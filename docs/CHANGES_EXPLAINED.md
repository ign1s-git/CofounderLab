# Разбор изменений CofounderLab

Этот файл объясняет всё, что я поменял в проекте: как было, что стало и почему.

**Точка отсчёта — коммит `e204bfa` «Add JWT authentication and authorization».** Всё, что было в нём, считается «как было». Сравнить самой можно командой:

```bash
git diff e204bfa -- src/main/java src/main/resources/application.properties pom.xml
```

Совет: в VS Code нажмите `Cmd+Shift+V`, чтобы читать этот файл в красивом виде.

---

## 0. Коротко: было → стало

| Что | Было | Стало |
|---|---|---|
| Сайт | Не было, только API | Две страницы: вход/регистрация и личный кабинет |
| База данных | H2 (`data/cofounderlab.mv.db`) | SQLite (`data/cofounderlab.db`) |
| Вход | Имя + фамилия + факультет + курс + пароль | Логин + пароль |
| Уникальность студента | Сочетание имени, фамилии, факультета и курса | Уникальный логин |
| Проверка полей | Только «поле не пустое» | Правила для каждого поля, на сайте и на сервере |
| Контакт | Любой текст до 20 символов | Telegram `@username` или почта до 64 символов |
| Доступ к файлам сайта | Закрыт (всё требовало токен) | Страницы, стили, скрипты и картинки открыты, API закрыт |
| Языки | — | Русский, английский, узбекский |

**Что я не трогал:** контроллеры (`AuthController`, `AdController`, `StudentController`), токены (`JwtService`, `JwtAuthFilter`), сущность `Ad` (кроме длины одного поля), `AdService`, `AdRepository`, перечисления в `enums/`. Вход по токену и правило «чужое менять нельзя» уже были в `e204bfa`.

---

## 1. Бэкенд (подробно)

Изменено 9 файлов, добавлен 1 новый (`InputValidator.java`).

### 1.1. База данных: H2 → SQLite

**Зачем:** вы попросили подключить SQLite.

#### `pom.xml` — библиотеки

Было:

```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

Стало:

```xml
<dependency>
    <groupId>org.xerial</groupId>
    <artifactId>sqlite-jdbc</artifactId>
    <version>3.50.3.0</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>org.hibernate.orm</groupId>
    <artifactId>hibernate-community-dialects</artifactId>
</dependency>
```

- **`sqlite-jdbc`** — драйвер: через него Java умеет открыть файл SQLite и выполнять в нём SQL. `scope=runtime` значит, что он нужен только при запуске, а не при компиляции.
- **`hibernate-community-dialects`** — «словарь» для Hibernate. Hibernate сам пишет SQL по вашим Java-классам, но SQL у разных баз немного разный. Диалект для H2 встроен в Hibernate, а для SQLite лежит в этой отдельной библиотеке. Версию не указываем: её подбирает Spring Boot, чтобы она совпадала с версией Hibernate.

#### `application.properties` — подключение

Было:

```properties
spring.datasource.url=jdbc:h2:file:./data/cofounderlab;NON_KEYWORDS=YEAR
spring.datasource.username=sa
spring.datasource.password=
```

Стало:

```properties
spring.datasource.url=jdbc:sqlite:./data/cofounderlab.db
spring.datasource.driver-class-name=org.sqlite.JDBC
spring.datasource.hikari.maximum-pool-size=1
spring.jpa.database-platform=org.hibernate.community.dialect.SQLiteDialect
```

Построчно:

- **`url`** — где лежит база: файл `data/cofounderlab.db` в папке проекта. Если его нет, SQLite создаст его сам.
- Логин и пароль базы (`sa`) убраны: у SQLite их нет, это просто файл.
- `NON_KEYWORDS=YEAR` был нужен только H2: там `year` — служебное слово, а у студента есть поле `year`. SQLite это не мешает.
- **`driver-class-name`** — какой класс-драйвер использовать.
- **`maximum-pool-size=1`** — сервер держит открытым только **одно** соединение с базой. По умолчанию Spring открывает до 10 соединений, чтобы обрабатывать запросы параллельно. Но SQLite в каждый момент разрешает писать только одному, и при нескольких соединениях бывает ошибка «database is locked». Для учебного проекта одного соединения хватает с запасом.
- **`database-platform`** — какой диалект брать из библиотеки выше.

Строку `ddl-auto=update` я оставил. Она значит: при запуске Hibernate сравнивает классы `Student` и `Ad` с таблицами и **добавляет** недостающие колонки. Удалять он ничего не умеет.

#### Подводный камень, на который мы наткнулись

Когда у `Student` появилось новое уникальное поле, Hibernate попытался выполнить:

```sql
alter table students add column student_number varchar(255) unique
```

SQLite так не умеет: добавить колонку с `UNIQUE` в уже существующую таблицу нельзя. Сервер не запустился. Я добавил колонку вручную, без `UNIQUE`, и отдельно уникальный индекс:

```sql
ALTER TABLE students ADD COLUMN student_number varchar(255);
CREATE UNIQUE INDEX ux_students_student_number ON students(student_number);
```

**Вывод на будущее:** если добавите в класс поле с `unique = true`, а таблица уже существует, Hibernate на SQLite упадёт. Колонку придётся добавить руками или удалить файл базы (тогда данные пропадут).

Старые данные из H2 в SQLite **не переносились**: новая база начиналась пустой. Файлы `data/cofounderlab.mv.db` и `cofounderlab.trace.db` остались от H2 и больше не используются.

---

### 1.2. Вход: четыре поля → логин

**Проблема в старой версии:** студент входил, указывая имя, фамилию, факультет и курс. Уникальность держалась на сочетании этих четырёх полей:

```java
@Table(name = "students", uniqueConstraints = @UniqueConstraint(columnNames = {"name", "surname", "department", "year"}))
```

Из-за этого:

- два однофамильца-тёзки на одном факультете и курсе не смогли бы зарегистрироваться;
- после перехода на второй курс студент не смог бы войти: курс изменился, а он входит со старым;
- при входе нужно было без ошибок набрать название факультета ровно так же, как при регистрации.

**Как теперь.** У студента есть отдельное поле `login`. Его выбирает сам студент, и оно уникально.

#### `Student.java`

```java
// было
@Table(name = "students", uniqueConstraints = @UniqueConstraint(columnNames = {"name", "surname", "department", "year"}))

// стало
@Table(name = "students")
...
// Chosen by the student at registration, stored in lower case; used to sign in
@Column(name = "login", unique = true)
private String login;
// + getLogin() / setLogin()
```

Ограничение на четыре поля убрано: теперь одинаковые имена не мешают.

> **Важно:** в старой базе это ограничение осталось. Hibernate умеет только добавлять, поэтому старый уникальный индекс из таблицы сам не удалится. В нашей SQLite-базе его нет, потому что она создавалась уже без него.

#### `LoginRequest.java` — что сайт присылает при входе

```java
// было: name, surname, department, year, password
// стало:
private String login;
private String password;
```

Spring сам превращает JSON `{"login":"aziza","password":"..."}` в этот объект: он сопоставляет ключи JSON с полями класса через `setLogin()` и `setPassword()`.

#### `StudentRepository.java`

```java
// было
Optional<Student> findByNameAndSurnameAndDepartmentAndYear(String name, String surname, String department, int year);

// стало
Optional<Student> findByLogin(String login);
```

Это **не** обычный метод, который кто-то написал. Spring Data читает его название по частям: `find` (найти) `By` (по полю) `Login` и сам генерирует SQL:

```sql
select * from students where login = ?
```

`Optional` значит «может найтись, а может и нет». Поэтому дальше в коде стоит `.orElse(null)` или `.isPresent()`.

#### `AuthService.register()` — регистрация

Было:

```java
if (student.getName() == null || student.getSurname() == null
        || student.getDepartment() == null || student.getPassword() == null) {
    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "...");
}
if (studentRepository.findByNameAndSurnameAndDepartmentAndYear(...).isPresent()) {
    throw new ResponseStatusException(HttpStatus.CONFLICT, "Student already registered");
}
```

Стало:

```java
// 1. Нормализуем ввод
String login = clean(student.getLogin());
student.setLogin(login == null ? null : login.toLowerCase());
student.setName(clean(student.getName()));
student.setSurname(clean(student.getSurname()));
student.setDepartment(clean(student.getDepartment()));
student.setContact(clean(student.getContact()));

// 2. Проверяем каждое поле
InputValidator.validateLogin(student.getLogin());
InputValidator.validatePassword(student.getPassword());
InputValidator.validateProfile(student.getName(), student.getSurname(), student.getDepartment(),
        student.getYear(), student.getContact());

// 3. Логин свободен?
if (studentRepository.findByLogin(student.getLogin()).isPresent()) {
    throw new ResponseStatusException(HttpStatus.CONFLICT, "Login is already taken");
}
// дальше без изменений: хеш пароля, сохранение, токен
```

Разбор:

1. **`clean()`** убирает пробелы по краям. Иначе `" aziza"` и `"aziza"` были бы разными логинами, а имя `"Азиза "` сохранилось бы с пробелом.
2. **`toLowerCase()`**: логин хранится маленькими буквами. Поэтому `Aziza`, `AZIZA` и `aziza` — один и тот же логин, и нельзя завести «двойника», поменяв регистр.
3. **Проверки** стоят **до** обращения к базе: нет смысла искать в базе логин, который и так неправильный.
4. **409 Conflict** — стандартный HTTP-код для «такое уже есть». Сайт по нему показывает «Этот логин уже занят» прямо под полем.

#### `AuthService.login()` — вход

```java
// было
Student student = studentRepository.findByNameAndSurnameAndDepartmentAndYear(
        request.getName(), request.getSurname(), request.getDepartment(), request.getYear()).orElse(null);

// стало
String login = clean(request.getLogin());
Student student = login == null ? null : studentRepository.findByLogin(login.toLowerCase()).orElse(null);
```

Дальше всё как было: `passwordEncoder.matches()` сравнивает введённый пароль с хешем BCrypt из базы, при ошибке отвечает **401**, при успехе выдаёт токен.

Обратите внимание: и «нет такого логина», и «неверный пароль» дают **одинаковый** ответ 401 «Invalid credentials». Так сделано специально: иначе по ответу можно было бы перебором узнать, какие логины существуют.

#### Промежуточный этап, которого уже нет

Между этими версиями был вход по **студенческому ID**. Регистрироваться можно было только с номером из списка университета `data/student-ids.csv`, а за этот список отвечал класс `StudentIdRegistry`. Потом вы решили, что ID пользователю не нужен. Я убрал класс, настройку `app.student-ids-file` и проверку списка и вернул логин. Внутренний номер (`id`) база по-прежнему выдаёт сама: он записан в токене, но пользователь его не видит.

---

### 1.3. Проверка полей: новый класс `InputValidator`

**Новый файл:** `src/main/java/org/example/cofounderlab/validation/InputValidator.java`

**Зачем:** раньше сервер проверял только «не пусто». Можно было зарегистрироваться с паролем `1`, именем из цифр или курсом `99`. Проверка на сайте от этого **не защищает**: запрос можно отправить в обход сайта (через Postman, curl или консоль браузера). Поэтому правила обязательно должны быть на сервере.

#### Как устроен класс

```java
public final class InputValidator {
    private InputValidator() { }   // объект создать нельзя, только вызывать статические методы

    private static void check(boolean condition, String message) {
        if (!condition) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
    }
}
```

Всё держится на одном методе `check()`: «если условие ложно, прерви запрос с ответом **400** и вот этим текстом». Spring ловит `ResponseStatusException` сам и превращает её в HTTP-ответ, поэтому писать `try/catch` в контроллерах не нужно.

#### Правила (регулярные выражения)

Шаблоны `Pattern` создаются **один раз** (`static final`) и используются для каждого запроса. Это быстрее, чем собирать выражение каждый раз заново.

| Шаблон | Выражение | Как читать |
|---|---|---|
| `LOGIN` | `^[a-zA-Z0-9._]{3,20}$` | От начала (`^`) до конца (`$`) только латиница, цифры, точка или `_`, от 3 до 20 штук |
| `PERSON_NAME` | `^\p{L}[\p{L}\s'‘’`-]{1,29}$` | Первый символ — любая буква любого алфавита (`\p{L}`: латиница, кириллица, корейский). Дальше ещё 1–29 букв, пробелов, апострофов (`'`, `‘`, `’` и обратный апостроф — для узбекских oʻ, gʻ) или дефисов. Всего 2–30 символов |
| `DEPARTMENT` | `^[\p{L}\d][\p{L}\d\s&.,()'‘’`-]{1,49}$` | Начинается с буквы или цифры, дальше буквы, цифры, пробелы и знаки `& . , ( ) ' -`. Всего 2–50 символов |
| `TELEGRAM` | `^@[a-zA-Z][a-zA-Z0-9_]{4,31}$` | `@`, затем буква, затем ещё 4–31 латинских букв, цифр или `_`. Это правила самого Telegram: имя от 5 до 32 символов |
| `EMAIL` | `^[^\s@]+@[^\s@]+\.[^\s@]{2,}$` | «что-то без пробелов и `@`» + `@` + «домен» + `.` + зона минимум из 2 символов. Простая проверка формы, существование ящика она не проверяет |
| `HAS_LETTER`, `HAS_DIGIT`, `WHITESPACE` | `\p{L}`, `\d`, `\s` | Есть ли в строке хоть одна буква / цифра / пробел (`find()`, а не `matches()`) |

`matches()` проверяет, что **вся** строка подходит под шаблон, а `find()` ищет совпадение **где-нибудь** внутри строки.

#### Методы

```java
validateLogin(login)      // логин по шаблону LOGIN
validatePassword(pwd)     // 8–64 символа, без пробелов, есть буква И цифра
validateProfile(name, surname, department, year, contact)  // + курс 1–4 + контакт
validateAd(title, description, deadline, contact, previousDeadline)
clean(value)              // trim(), но null оставляет null
```

**Тонкость в `validateAd`:**

```java
if (deadline != null && !deadline.equals(previousDeadline)) {
    check(!deadline.isBefore(LocalDate.now()), "Deadline cannot be in the past");
}
```

Срок в прошлом запрещён, **кроме** случая, когда это старый срок самого объявления. Представьте: объявление создано с дедлайном 10 ноября, сегодня 15-е, автор хочет поправить опечатку в описании. Без этой оговорки сервер не дал бы сохранить, потому что «срок в прошлом». Поэтому при изменении передаётся `ad.getDeadline()` (старый срок): если он не менялся, проверка пропускается. При создании передаётся `null`.

**Контакт** проверяется в одном месте, `validateContact()`: годится либо Telegram, либо почта. Он обязателен и для профиля, и для объявления.

#### Где вызывается

| Метод сервиса | Какие проверки |
|---|---|
| `AuthService.register()` | `validateLogin`, `validatePassword`, `validateProfile` |
| `StudentService.updateStudent()` (профиль) | `clean` + `validateProfile` |
| `StudentService.createAdForStudent()` | `clean` + `validateAd(…, null)` |
| `StudentService.updateAdForStudent()` | `clean` + `validateAd(…, ad.getDeadline())` |

Проверки стоят в **сервисах**, а не в контроллерах. Так любое место, которое создаёт объявление через сервис, автоматически получает проверку.

#### `Ad.java` — одна правка

```java
// было
@Column (name = "studentTg", length = 20)
// стало
@Column (name = "studentTg", length = 64)
```

Почта бывает длиннее 20 символов (`aziza.hasanova.student@gmail.com` — это 32). Строго говоря, SQLite длину `varchar` не проверяет вообще, но аннотация описывает намерение и пригодится, если базу когда-нибудь сменят.

---

### 1.4. `SecurityConfig`: открыть файлы сайта

Было:

```java
.requestMatchers("/api/auth/register", "/api/auth/login", "/error").permitAll()
.anyRequest().authenticated()
```

`anyRequest().authenticated()` закрывал **всё** остальное, включая сами страницы. Браузер просил `index.html`, а сервер отвечал 401: войти было негде, потому что страница входа тоже закрыта.

Стало:

```java
.requestMatchers("/api/auth/register", "/api/auth/login", "/error").permitAll()
// Frontend pages and assets; the API itself stays protected
.requestMatchers("/", "/index.html", "/home.html", "/css/**", "/js/**", "/img/**").permitAll()
.anyRequest().authenticated()
```

- `/` — корень сайта. Spring Boot отдаёт по нему `index.html` (в логе это строка `Adding welcome page`).
- `/css/**` — всё внутри папки `css` на любой глубине.
- Порядок важен: правила проверяются сверху вниз, первое подходящее побеждает. Поэтому `anyRequest()` стоит последним.

**Безопасно ли открывать `home.html`?** Да. Сама страница — это просто HTML без данных. Данные она берёт из `/api/...`, а API по-прежнему требует токен. Без токена страница откроется пустой и сразу перекинет на вход.

---

## 2. Как связаны фронтенд и бэкенд

Это, пожалуй, главное, что стоит понять.

### 2.1. Один сервер на всё

Spring Boot по умолчанию раздаёт как обычные файлы всё, что лежит в `src/main/resources/static/`. Я положил туда сайт. Поэтому:

- `http://localhost:8080/index.html` — это файл `static/index.html`;
- `http://localhost:8080/api/ads` — это метод `AdController.getAds()`.

Сайт и API живут на **одном адресе и порту**. Это избавляет от CORS — запрета браузера ходить с одного сайта на другой. Если бы фронтенд был на отдельном сервере (например, `localhost:3000`), пришлось бы настраивать CORS в `SecurityConfig`.

Есть и минус: файлы сайта попадают внутрь собранного приложения. Поэтому после правки HTML/CSS/JS сервер нужно **перезапустить**.

### 2.2. Единая функция запросов: `js/api.js`

Все запросы сайта к серверу идут через одну функцию:

```js
async function api(path, options = {}) {
    const headers = { "Content-Type": "application/json" };
    const token = getToken();
    if (token) headers["Authorization"] = "Bearer " + token;

    const response = await fetch(path, {
        method: options.method || "GET",
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined
    });

    if (!response.ok) {
        throw new ApiError(response.status, t(KNOWN_STATUSES.includes(response.status) ? "err." + response.status : "err.generic"));
    }
    const text = await response.text();
    return text ? JSON.parse(text) : null;
}
```

Что она делает:

1. **Сама прикладывает токен.** Ни одной странице не нужно помнить про заголовок `Authorization`.
2. **Превращает объект в JSON** (`JSON.stringify`). Spring на другой стороне превращает его обратно в Java-объект.
3. **Переводит код ошибки в текст.** Spring по умолчанию **скрывает** текст ошибок из `ResponseStatusException` (в ответе только код). Поэтому сайт сам знает, что значит каждый код:

| Код | Откуда на сервере | Что видит пользователь |
|---|---|---|
| 400 | `InputValidator.check()` | «Проверьте правильность заполнения полей» |
| 401 | `AuthService.login()` или нет токена | «Неверный логин или пароль» / выход на страницу входа |
| 403 | `checkOwner()` / `checkSelf()` в контроллерах | «Можно изменять только свои объявления» |
| 404 | `checkOwner()` | «Не найдено» |
| 409 | `AuthService.register()` | «Этот логин уже занят» (под полем логина) |

4. **Пустой ответ.** `DELETE` возвращает пустое тело. Поэтому сначала читается текст, и `JSON.parse` вызывается, только если он не пустой.

### 2.3. Жизнь токена

```
Регистрация/вход                         Любой следующий запрос
─────────────────                         ──────────────────────
index.html                                home.html
  api("/api/auth/login", POST)              api("/api/ads")
        │                                         │ Authorization: Bearer <токен>
        ▼                                         ▼
AuthService.login()                       JwtAuthFilter
  → JwtService.generateToken(student)       → JwtService.extractStudentId(token)
        │                                         │ кладёт id в SecurityContext
        ▼                                         ▼
{ token, student }  ──► localStorage      AdController(@AuthenticationPrincipal Long studentId)
                        "cofounderlab_token"
```

- Токен хранится в `localStorage` браузера под ключом `cofounderlab_token` и переживает закрытие вкладки.
- Срок жизни 24 часа (`jwt.expiration-ms=86400000`). Потом сервер ответит 401, и сайт (`if (e.status === 401) return logout();`) удалит токен и откроет вход.
- «Выйти» на сайте просто удаляет токен из браузера. Сервер о выходе не знает и не должен: он ничего не помнит.

### 2.4. Какое действие → какой адрес → какой метод

| Действие на сайте | Запрос | Метод на сервере |
|---|---|---|
| Регистрация | `POST /api/auth/register` | `AuthController.register` → `AuthService.register` |
| Вход | `POST /api/auth/login` | `AuthController.login` → `AuthService.login` |
| Открыть главную | `GET /api/auth/me`, `GET /api/ads`, `GET /api/students` | `AuthService.me`, `AdService.getAllAds`, `StudentService.findAllStudents` |
| Опубликовать объявление | `POST /api/ads` | `AdController.addAd` → `StudentService.createAdForStudent` |
| Изменить объявление | `PUT /api/ads/{id}` | `AdController.updateAd` → `checkOwner` → `StudentService.updateAdForStudent` |
| Удалить объявление | `DELETE /api/ads/{id}` | `AdController.deleteAdById` → `checkOwner` → `StudentService.deleteAd` |
| Сохранить профиль | `PUT /api/students/{id}` | `StudentController.updateStudent` → `checkSelf` → `StudentService.updateStudent` |

Три запроса при открытии главной уходят **параллельно** (`Promise.all`), поэтому страница грузится быстрее. Имена авторов сайт берёт из `/api/students`: у объявления есть только `studentId`, а имя лежит у студента. Сайт строит словарь «номер → студент» (`new Map(...)`) и по нему подписывает карточки.

### 2.5. Одни правила с двух сторон

Правила полей продублированы: `js/validate.js` (объект `LIMITS` и `RULES`) и `InputValidator.java`. Зачем дважды:

- **на сайте** — чтобы ошибка появилась сразу под полем, без запроса на сервер;
- **на сервере** — потому что сайт можно обойти.

> Если меняете правило, меняйте его **в обоих** файлах. Иначе сайт пропустит то, что отклонит сервер, и пользователь увидит общее «Проверьте поля» вместо понятной подсказки.

Похожая связка с контактом: **сайт приводит** ввод к нужному виду (`t.me/aziza_dev` или `aziza_dev` → `@aziza_dev`, почту — в маленькие буквы), а **сервер только проверяет** результат. Тип контакта (Telegram или почта) нигде отдельно не хранится: его видно по самому значению. Начинается с `@` — Telegram, есть `@` внутри — почта.

---

## 3. Фронтенд (кратко)

Всё лежит в `src/main/resources/static/`. Фреймворков нет: обычный HTML, CSS и JavaScript.

| Файл | Что делает |
|---|---|
| `index.html` | Вход и регистрация (вкладки), переключатель языка, мемы-реакции (на неверный пароль, на занятый логин) |
| `home.html` | Всё после входа: главная, «Мои объявления», профиль. Разделы переключаются по `#home`, `#my`, `#profile` без перезагрузки |
| `js/api.js` | Запросы к серверу, хранение токена, иконки категорий, формат сроков |
| `js/i18n.js` | Все тексты на трёх языках. В HTML пишется `data-i18n="ключ"`, в коде `t("ключ")` |
| `js/validate.js` | Правила полей, ошибки под полями, переключатель «Telegram / Почта», ссылка на контакт |
| `js/cats.js` | Какой мем, где и с какой подписью; «Мем дня» в профиле |
| `css/style.css` | Цвета (синий и оранжевый, как на гербе университета), шрифты Unbounded + Nunito, вёрстка под телефон |
| `img/memes/` | Картинки мемов; в `tpl/` шаблоны с текстом, отдельно на каждый язык |

Возможности по шагам:

1. Вход и регистрация с проверкой каждого поля.
2. Главная: объявления сгруппированы по категориям, есть фильтр, поиск и «скрыть закрытые».
3. Окно объявления: автор, контакт-ссылка, кнопка «Откликнуться» (открывает Telegram или готовое письмо).
4. Создание, изменение и удаление своих объявлений; удаление подтверждается прямо в окне.
5. Профиль с изменением данных.
6. Три языка, переключение без перезагрузки.
7. Мемы с котиками и классические шаблоны (Drake, Distracted Boyfriend и другие) с подписями под тему.
8. Вёрстка под телефон: нижнее меню, окна по ширине экрана. Проверено на ширине 320–1280 px.

---

## 4. Что я менял прямо в базе данных

Hibernate не всё умеет менять сам, поэтому несколько раз я правил вашу базу `data/cofounderlab.db` вручную, командой `sqlite3`:

1. **Логины в нижний регистр:** `UPDATE students SET login = lower(login)`. Нужно было после того, как вход стал нечувствительным к регистру, иначе аккаунт `Aziza` не смог бы войти.
2. **Колонка `student_number`** с уникальным индексом (см. п. 1.1) для этапа со студенческим ID.
3. **Логин для старых аккаунтов:** `UPDATE students SET login = student_number WHERE login IS NULL`. Аккаунтам, зарегистрированным по ID, их ID стал логином, чтобы они не потеряли доступ. Перед этим я сделал копию: `data/cofounderlab.backup-before-login.db`.

Колонка `student_number` так и осталась в таблице, код её больше не использует.

---

## 5. Что в git

| Где | Что |
|---|---|
| Коммит `4534acd` (запушен в `login-auth`) | SQLite, сайт, проверка полей, мемы, вход по студенческому ID |
| **Не закоммичено** | Возврат на вход по логину, удаление `StudentIdRegistry`, исправления под телефон, этот файл |

В git никогда не попадают (`.gitignore`): `secrets.properties` (секрет для токенов), папка `data/` (база и копии), `target/` (сборка).

---

## 6. Что осталось и стоит знать

Это не мои изменения, а то, что я заметил при разборе. Я это не трогал:

- **`GET /api/students`** отдаёт любому вошедшему список всех студентов вместе с контактами.
- **«Не найдено» иногда превращается в 500.** В сервисах стоит `throw new RuntimeException(...)`, а Spring отвечает на неё кодом 500 «ошибка сервера». Лучше `ResponseStatusException(HttpStatus.NOT_FOUND, ...)`.
- **`deleteStudent()`** удаляет студента, но не его объявления.
- **Неиспользуемый код:** список `ads` в `AdService`, список `students` и метод `createStudent()` в `StudentService`, поле `status` у объявления (никогда не заполняется).
- **Тест один** (`contextLoads`), и он проверяет только, что приложение запускается.
