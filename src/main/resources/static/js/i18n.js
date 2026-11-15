// Translations: Russian (default), English, Uzbek (Latin)

const LANG_KEY = "cofounderlab_lang";
const LANGUAGES = { ru: "RU", en: "EN", uz: "UZ" };
const DATE_LOCALES = { ru: "ru-RU", en: "en-GB", uz: "uz-Latn-UZ" };

const TRANSLATIONS = {
    ru: {
        "brand.students": "Студенты Bucheon University",
        "close": "Закрыть",

        "auth.pageTitle": "CofounderLab — Вход",
        "auth.heading": "Найди людей, с которыми <em>создашь своё</em>",
        "auth.lead": "Опубликуй идею, посмотри, над чем работают другие студенты, и собери команду для стартапа, хакатона или проекта.",
        "auth.foot": "Сделано студентами для студентов.",
        "auth.welcome": "С возвращением",
        "auth.createTitle": "Создать аккаунт",
        "auth.loginSub": "Войдите с помощью логина и пароля.",
        "auth.registerSub": "Другие студенты увидят ваше имя, факультет и контакт.",
        "auth.signIn": "Войти",
        "auth.register": "Регистрация",
        "auth.createBtn": "Создать аккаунт",

        "f.password": "Пароль",
        "f.login": "Логин",
        "f.name": "Имя",
        "f.surname": "Фамилия",
        "f.department": "Факультет",
        "f.departmentPh": "например, Компьютерные науки",
        "f.year": "Курс",
        "f.contact": "Контакт для связи",
        "f.contactShort": "Контакт",

        "err.fillAll": "Заполните все поля.",
        "err.400": "Проверьте правильность заполнения полей.",
        "err.401": "Неверный логин или пароль.",
        "err.403": "Можно изменять только свои объявления.",
        "err.404": "Не найдено.",
        "err.409": "Этот логин уже занят.",
        "err.generic": "Что-то пошло не так. Попробуйте ещё раз.",
        "v.required": "Обязательное поле.",
        "v.loginLength": "Логин: от 3 до 20 символов.",
        "v.loginChars": "Только латинские буквы, цифры, точка и _.",
        "v.loginTaken": "Этот логин уже занят, придумайте другой.",
        "v.hint.login": "3–20 символов: латиница, цифры, . и _",
        "v.passwordShort": "Пароль должен быть не короче 8 символов.",
        "v.passwordLong": "Пароль должен быть не длиннее 64 символов.",
        "v.passwordMix": "Пароль должен содержать хотя бы одну букву и одну цифру.",
        "v.noSpaces": "Без пробелов.",
        "v.nameLength": "От 2 до 30 символов.",
        "v.nameChars": "Только буквы, пробел, дефис и апостроф.",
        "v.departmentLength": "От 2 до 50 символов.",
        "v.departmentChars": "Недопустимые символы в названии факультета.",
        "v.year": "Выберите курс от 1 до 4.",
        "v.category": "Выберите категорию.",
        "v.descriptionShort": "Описание должно быть не короче 10 символов.",
        "v.descriptionLong": "Описание должно быть не длиннее 200 символов.",
        "v.date": "Некорректная дата.",
        "v.datePast": "Срок не может быть в прошлом.",
        "v.hint.password": "Минимум 8 символов, буквы и цифры",

        "cat.all": "Все",
        "cat.categories": "Категории",
        "cat.STARTUP": "Стартап",
        "cat.STARTUP.hint": "Создать компанию вместе",
        "cat.HACKATHON": "Хакатон",
        "cat.HACKATHON.hint": "Команда на выходные",
        "cat.PROJECT": "Проект",
        "cat.PROJECT.hint": "Учебные и личные проекты",
        "cat.COMPETITION": "Конкурс",
        "cat.COMPETITION.hint": "Конкурсы и соревнования",
        "cat.OTHER": "Другое",
        "cat.OTHER.hint": "Всё остальное",

        "dl.past": "Закрыто · {date}",
        "dl.today": "Срок сегодня",
        "dl.left": "Ещё {n} {days}",
        "dl.until": "До {date}",

        "nav.home": "Главная",
        "nav.my": "Мои объявления",
        "nav.profile": "Профиль",
        "nav.newAd": "Новое объявление",

        "home.title": "Найди своего кофаундера",
        "home.hi": "Привет, {name}!",
        "home.lead": "Идеи и команды студентов со всего университета, по категориям.",
        "home.search": "Поиск по идеям, навыкам, факультетам…",
        "home.hidePast": "Скрыть закрытые",
        "home.loadError": "Не удалось загрузить объявления",

        "empty.none": "Пока нет объявлений",
        "empty.noneIn": "В категории «{cat}» пока нет объявлений",
        "empty.first": "Будь первым — опубликуй идею и найди команду.",
        "empty.post": "Опубликовать объявление",

        "card.yours": "Ваше",
        "card.student": "Студент",

        "my.lead": "Всё, что вы опубликовали. Откройте объявление, чтобы изменить или удалить его.",
        "my.new": "Создать объявление",
        "my.emptyTitle": "Вы ещё ничего не опубликовали",
        "my.emptyText": "Опишите идею и кого вы ищете.",

        "profile.ads": "Объявлений",
        "profile.active": "Активных",
        "profile.logout": "Выйти",
        "profile.details": "Данные студента",
        "profile.detailsSub": "Другие студенты видят их в ваших объявлениях.",
        "profile.save": "Сохранить",
        "profile.required": "Имя, фамилия и факультет обязательны.",
        "profile.saved": "Профиль сохранён",

        "edit.new": "Новое объявление",
        "edit.edit": "Редактировать объявление",
        "edit.category": "Категория",
        "edit.desc": "Что вы создаёте и кого ищете?",
        "edit.descPh": "Например: делаю приложение для совместной учёбы. Ищу фронтенд-разработчика и дизайнера.",
        "edit.deadline": "Срок",
        "edit.cancel": "Отмена",
        "edit.publish": "Опубликовать",
        "edit.save": "Сохранить",
        "edit.required": "Добавьте описание и контакт, чтобы с вами могли связаться.",

        "view.yours": "Ваше объявление",
        "view.looking": "{name} ищет команду",
        "view.noDeadline": "Без срока",
        "view.delete": "Удалить",
        "view.edit": "Изменить",
        "view.copy": "Скопировать контакт",

        "toast.published": "Объявление опубликовано",
        "toast.updated": "Объявление обновлено",
        "toast.deleted": "Объявление удалено",
        "toast.copied": "Контакт скопирован",
        "view.author": "Автор",
        "view.respond": "Откликнуться",
        "mail.subject": "CofounderLab: отклик на объявление «{cat}»",
        "mail.body": "Здравствуйте, {name}!\n\nУвидел(а) ваше объявление на CofounderLab и хочу присоединиться к команде.\n\nОбо мне: {me}, {dept}, {year}.\n",
        "contact.telegram": "Telegram",
        "contact.email": "Почта",
        "v.telegram": "Telegram: @ и от 5 до 32 латинских букв, цифр или _ (начинается с буквы).",
        "v.email": "Введите почту в формате name@mail.com.",
        "memeDay.title": "Мем дня",
        "memeDay.next": "Ещё мем",
        "meme.noResults": "Ничего не нашлось. Мозг взорван.",
        "meme.deleteConfirm": "Стоп! Точно удалить? Вернуть не получится.",
        "meme.writeThem": "Не молчи — напиши автору!",
        "meme.bye": "Уже уходишь? А кто будет искать кофаундера?",
        "meme.suspicious": "Хм… этот логин кто-то уже занял.",
        "meme.broken": "АААА! Что-то сломалось. Попробуй ещё раз.",
        "empty.noResults": "Ничего не найдено",
        "empty.tryOther": "Попробуй другие слова или другую категорию.",
        "view.deleteYes": "Да, удалить",
        "meme.login": "Ищу кофаундера. Мои навыки: мурчать и сидеть на клавиатуре.",
        "meme.register": "Новенький? Мур! Добро пожаловать в команду.",
        "meme.wrongPassword": "Мяу?! Это не тот пароль.",
        "meme.home": "Одна голова хорошо, а две — уже стартап.",
        "meme.my": "Твои объявления под моей охраной.",
        "meme.empty": "Тут пока пусто, и банану-коту грустно.",
        "meme.myEmpty": "Объявлений нет? Жми кнопку ниже — и они появятся.",
        "meme.profile": "Выглядишь как настоящий фаундер.",
        "meme.newAd": "Нельзя сорвать дедлайн, если его не ставить."
    },

    en: {
        "brand.students": "Bucheon University students",
        "close": "Close",

        "auth.pageTitle": "CofounderLab — Sign in",
        "auth.heading": "Find the people to <em>build it</em> with",
        "auth.lead": "Post your idea, browse what other students are working on, and team up for startups, hackathons and projects.",
        "auth.foot": "Made by students, for students.",
        "auth.welcome": "Welcome back",
        "auth.createTitle": "Create your account",
        "auth.loginSub": "Sign in with your login and password.",
        "auth.registerSub": "Other students will see your name, department and contact.",
        "auth.signIn": "Sign in",
        "auth.register": "Register",
        "auth.createBtn": "Create account",

        "f.password": "Password",
        "f.login": "Login",
        "f.name": "First name",
        "f.surname": "Last name",
        "f.department": "Department",
        "f.departmentPh": "e.g. Computer Science",
        "f.year": "Year",
        "f.contact": "Contact",
        "f.contactShort": "Contact",

        "err.fillAll": "Please fill in all fields.",
        "err.400": "Please check the fields and try again.",
        "err.401": "Wrong login or password.",
        "err.403": "You can only change your own ads.",
        "err.404": "Not found.",
        "err.409": "This login is already taken.",
        "err.generic": "Something went wrong. Try again.",
        "v.required": "This field is required.",
        "v.loginLength": "Login must be 3 to 20 characters.",
        "v.loginChars": "Only Latin letters, digits, dot and _.",
        "v.loginTaken": "This login is taken, try another one.",
        "v.hint.login": "3–20 characters: Latin letters, digits, . and _",
        "v.passwordShort": "Password must be at least 8 characters.",
        "v.passwordLong": "Password must be at most 64 characters.",
        "v.passwordMix": "Password must contain at least one letter and one digit.",
        "v.noSpaces": "No spaces allowed.",
        "v.nameLength": "Must be 2 to 30 characters.",
        "v.nameChars": "Only letters, spaces, hyphens and apostrophes.",
        "v.departmentLength": "Must be 2 to 50 characters.",
        "v.departmentChars": "The department name contains invalid characters.",
        "v.year": "Choose a year from 1 to 4.",
        "v.category": "Choose a category.",
        "v.descriptionShort": "Description must be at least 10 characters.",
        "v.descriptionLong": "Description must be at most 200 characters.",
        "v.date": "Invalid date.",
        "v.datePast": "The deadline can't be in the past.",
        "v.hint.password": "At least 8 characters, letters and digits",

        "cat.all": "All",
        "cat.categories": "Categories",
        "cat.STARTUP": "Startup",
        "cat.STARTUP.hint": "Build a company together",
        "cat.HACKATHON": "Hackathon",
        "cat.HACKATHON.hint": "Team up for a weekend sprint",
        "cat.PROJECT": "Project",
        "cat.PROJECT.hint": "Course or side projects",
        "cat.COMPETITION": "Competition",
        "cat.COMPETITION.hint": "Contests and challenges",
        "cat.OTHER": "Other",
        "cat.OTHER.hint": "Anything else",

        "dl.past": "Closed · {date}",
        "dl.today": "Deadline today",
        "dl.left": "{n} {days} left",
        "dl.until": "Until {date}",

        "nav.home": "Home",
        "nav.my": "My ads",
        "nav.profile": "Profile",
        "nav.newAd": "New ad",

        "home.title": "Find your cofounder",
        "home.hi": "Hi, {name}!",
        "home.lead": "Ideas and teams from students across the university, sorted by category.",
        "home.search": "Search ideas, skills, departments…",
        "home.hidePast": "Hide closed",
        "home.loadError": "Could not load ads",

        "empty.none": "No ads yet",
        "empty.noneIn": "No ads in {cat} yet",
        "empty.first": "Be the first — post your idea and find a teammate.",
        "empty.post": "Post an ad",

        "card.yours": "Your ad",
        "card.student": "Student",

        "my.lead": "Everything you've posted. Open an ad to edit or delete it.",
        "my.new": "Create a new ad",
        "my.emptyTitle": "You haven't posted anything yet",
        "my.emptyText": "Describe your idea and who you're looking for.",

        "profile.ads": "Ads",
        "profile.active": "Active",
        "profile.logout": "Log out",
        "profile.details": "Student details",
        "profile.detailsSub": "Other students see these on your ads.",
        "profile.save": "Save changes",
        "profile.required": "Name, surname and department are required.",
        "profile.saved": "Profile saved",

        "edit.new": "New ad",
        "edit.edit": "Edit ad",
        "edit.category": "Category",
        "edit.desc": "What are you building and who do you need?",
        "edit.descPh": "e.g. Building a study-buddy app. Looking for a frontend dev and a designer.",
        "edit.deadline": "Deadline",
        "edit.cancel": "Cancel",
        "edit.publish": "Publish",
        "edit.save": "Save changes",
        "edit.required": "Add a description and a contact so people can reach you.",

        "view.yours": "Your ad",
        "view.looking": "{name} is looking for a team",
        "view.noDeadline": "No deadline",
        "view.delete": "Delete",
        "view.edit": "Edit",
        "view.copy": "Copy contact",

        "toast.published": "Ad published",
        "toast.updated": "Ad updated",
        "toast.deleted": "Ad deleted",
        "toast.copied": "Contact copied",
        "view.author": "Author",
        "view.respond": "Respond",
        "mail.subject": "CofounderLab: reply to your {cat} ad",
        "mail.body": "Hi {name},\n\nI saw your ad on CofounderLab and would like to join your team.\n\nAbout me: {me}, {dept}, {year}.\n",
        "contact.telegram": "Telegram",
        "contact.email": "Email",
        "v.telegram": "Telegram: @ and 5 to 32 Latin letters, digits or _ (starts with a letter).",
        "v.email": "Enter an email like name@mail.com.",
        "memeDay.title": "Meme of the day",
        "memeDay.next": "Another one",
        "meme.noResults": "Nothing found. Mind blown.",
        "meme.deleteConfirm": "Wait! Delete it for real? There's no undo.",
        "meme.writeThem": "Don't be shy — message the author!",
        "meme.bye": "Leaving already? Who's going to find the cofounder?",
        "meme.suspicious": "Hmm… someone already took this login.",
        "meme.broken": "AAAA! Something broke. Try again.",
        "empty.noResults": "Nothing found",
        "empty.tryOther": "Try other words or another category.",
        "view.deleteYes": "Yes, delete",
        "meme.login": "Looking for a cofounder. Skills: purring and sitting on keyboards.",
        "meme.register": "New here? Purr! Welcome to the team.",
        "meme.wrongPassword": "Meow?! That's not the password.",
        "meme.home": "One head is good. Two is a startup.",
        "meme.my": "Your ads are under my protection.",
        "meme.empty": "Nothing here yet, and banana cat is sad.",
        "meme.myEmpty": "No ads yet? Hit the button below and they’ll appear.",
        "meme.profile": "You look like a real founder.",
        "meme.newAd": "You can’t miss a deadline if you never set one."
    },

    uz: {
        "brand.students": "Bucheon University talabalari",
        "close": "Yopish",

        "auth.pageTitle": "CofounderLab — Kirish",
        "auth.heading": "Birga <em>yaratadigan</em> odamlarni toping",
        "auth.lead": "G‘oyangizni joylang, boshqa talabalar nima ustida ishlayotganini ko‘ring va startap, hakaton yoki loyiha uchun jamoa yig‘ing.",
        "auth.foot": "Talabalar tomonidan, talabalar uchun.",
        "auth.welcome": "Xush kelibsiz",
        "auth.createTitle": "Hisob yaratish",
        "auth.loginSub": "Login va parolingiz bilan kiring.",
        "auth.registerSub": "Boshqa talabalar ismingiz, fakultetingiz va kontaktingizni ko‘radi.",
        "auth.signIn": "Kirish",
        "auth.register": "Ro‘yxatdan o‘tish",
        "auth.createBtn": "Hisob yaratish",

        "f.password": "Parol",
        "f.login": "Login",
        "f.name": "Ism",
        "f.surname": "Familiya",
        "f.department": "Fakultet",
        "f.departmentPh": "masalan, Kompyuter fanlari",
        "f.year": "Kurs",
        "f.contact": "Bog‘lanish uchun kontakt",
        "f.contactShort": "Kontakt",

        "err.fillAll": "Barcha maydonlarni to‘ldiring.",
        "err.400": "Maydonlar to‘g‘ri to‘ldirilganini tekshiring.",
        "err.401": "Login yoki parol noto‘g‘ri.",
        "err.403": "Faqat o‘z e’lonlaringizni o‘zgartira olasiz.",
        "err.404": "Topilmadi.",
        "err.409": "Bu login band.",
        "err.generic": "Nimadir xato ketdi. Qayta urinib ko‘ring.",
        "v.required": "Majburiy maydon.",
        "v.loginLength": "Login 3 tadan 20 tagacha belgidan iborat bo‘lishi kerak.",
        "v.loginChars": "Faqat lotin harflari, raqamlar, nuqta va _.",
        "v.loginTaken": "Bu login band, boshqasini o‘ylab toping.",
        "v.hint.login": "3–20 belgi: lotin harflari, raqamlar, . va _",
        "v.passwordShort": "Parol kamida 8 ta belgidan iborat bo‘lishi kerak.",
        "v.passwordLong": "Parol ko‘pi bilan 64 ta belgidan iborat bo‘lishi kerak.",
        "v.passwordMix": "Parolda kamida bitta harf va bitta raqam bo‘lishi kerak.",
        "v.noSpaces": "Bo‘sh joy qo‘yish mumkin emas.",
        "v.nameLength": "2 tadan 30 tagacha belgi.",
        "v.nameChars": "Faqat harflar, bo‘sh joy, chiziqcha va apostrof.",
        "v.departmentLength": "2 tadan 50 tagacha belgi.",
        "v.departmentChars": "Fakultet nomida noto‘g‘ri belgilar bor.",
        "v.year": "1 dan 4 gacha kursni tanlang.",
        "v.category": "Toifani tanlang.",
        "v.descriptionShort": "Tavsif kamida 10 ta belgidan iborat bo‘lishi kerak.",
        "v.descriptionLong": "Tavsif ko‘pi bilan 200 ta belgidan iborat bo‘lishi kerak.",
        "v.date": "Noto‘g‘ri sana.",
        "v.datePast": "Muddat o‘tgan sana bo‘lishi mumkin emas.",
        "v.hint.password": "Kamida 8 ta belgi, harflar va raqamlar",

        "cat.all": "Hammasi",
        "cat.categories": "Toifalar",
        "cat.STARTUP": "Startap",
        "cat.STARTUP.hint": "Birgalikda kompaniya qurish",
        "cat.HACKATHON": "Hakaton",
        "cat.HACKATHON.hint": "Dam olish kunlari uchun jamoa",
        "cat.PROJECT": "Loyiha",
        "cat.PROJECT.hint": "O‘quv va shaxsiy loyihalar",
        "cat.COMPETITION": "Tanlov",
        "cat.COMPETITION.hint": "Tanlovlar va musobaqalar",
        "cat.OTHER": "Boshqa",
        "cat.OTHER.hint": "Boshqa hamma narsa",

        "dl.past": "Yopilgan · {date}",
        "dl.today": "Muddat bugun",
        "dl.left": "{n} {days} qoldi",
        "dl.until": "{date} gacha",

        "nav.home": "Bosh sahifa",
        "nav.my": "E’lonlarim",
        "nav.profile": "Profil",
        "nav.newAd": "Yangi e’lon",

        "home.title": "Hammuassisingizni toping",
        "home.hi": "Salom, {name}!",
        "home.lead": "Universitet talabalarining g‘oyalari va jamoalari, toifalar bo‘yicha.",
        "home.search": "G‘oyalar, ko‘nikmalar, fakultetlar bo‘yicha qidirish…",
        "home.hidePast": "Yopilganlarni yashirish",
        "home.loadError": "E’lonlarni yuklab bo‘lmadi",

        "empty.none": "Hozircha e’lonlar yo‘q",
        "empty.noneIn": "«{cat}» toifasida hozircha e’lonlar yo‘q",
        "empty.first": "Birinchi bo‘ling — g‘oyangizni joylang va jamoadosh toping.",
        "empty.post": "E’lon joylash",

        "card.yours": "Sizniki",
        "card.student": "Talaba",

        "my.lead": "Siz joylagan barcha e’lonlar. Tahrirlash yoki o‘chirish uchun e’lonni oching.",
        "my.new": "Yangi e’lon yaratish",
        "my.emptyTitle": "Siz hali hech narsa joylamagansiz",
        "my.emptyText": "G‘oyangizni va kimni izlayotganingizni yozing.",

        "profile.ads": "E’lonlar",
        "profile.active": "Faol",
        "profile.logout": "Chiqish",
        "profile.details": "Talaba ma’lumotlari",
        "profile.detailsSub": "Boshqa talabalar ularni e’lonlaringizda ko‘radi.",
        "profile.save": "Saqlash",
        "profile.required": "Ism, familiya va fakultet majburiy.",
        "profile.saved": "Profil saqlandi",

        "edit.new": "Yangi e’lon",
        "edit.edit": "E’lonni tahrirlash",
        "edit.category": "Toifa",
        "edit.desc": "Nima yaratyapsiz va sizga kim kerak?",
        "edit.descPh": "Masalan: birga o‘qish uchun ilova qilyapman. Frontend dasturchi va dizayner kerak.",
        "edit.deadline": "Muddat",
        "edit.cancel": "Bekor qilish",
        "edit.publish": "Joylash",
        "edit.save": "Saqlash",
        "edit.required": "Siz bilan bog‘lanishlari uchun tavsif va kontakt qo‘shing.",

        "view.yours": "Sizning e’loningiz",
        "view.looking": "{name} jamoa qidiryapti",
        "view.noDeadline": "Muddatsiz",
        "view.delete": "O‘chirish",
        "view.edit": "Tahrirlash",
        "view.copy": "Kontaktni nusxalash",

        "toast.published": "E’lon joylandi",
        "toast.updated": "E’lon yangilandi",
        "toast.deleted": "E’lon o‘chirildi",
        "toast.copied": "Kontakt nusxalandi",
        "view.author": "Muallif",
        "view.respond": "Javob berish",
        "mail.subject": "CofounderLab: «{cat}» e’loniga javob",
        "mail.body": "Assalomu alaykum, {name}!\n\nCofounderLab’dagi e’loningizni ko‘rdim va jamoangizga qo‘shilmoqchiman.\n\nMen haqimda: {me}, {dept}, {year}.\n",
        "contact.telegram": "Telegram",
        "contact.email": "Pochta",
        "v.telegram": "Telegram: @ va 5 tadan 32 tagacha lotin harfi, raqam yoki _ (harf bilan boshlanadi).",
        "v.email": "Pochtani name@mail.com ko‘rinishida kiriting.",
        "memeDay.title": "Kun memi",
        "memeDay.next": "Yana bitta",
        "meme.noResults": "Hech narsa topilmadi. Miya portladi.",
        "meme.deleteConfirm": "To‘xta! Rostdan o‘chirasizmi? Qaytarib bo‘lmaydi.",
        "meme.writeThem": "Jim turmang — muallifga yozing!",
        "meme.bye": "Ketyapsizmi? Hammuassisni kim qidiradi?",
        "meme.suspicious": "Hmm… bu loginni kimdir allaqachon olgan.",
        "meme.broken": "AAAA! Nimadir buzildi. Qayta urinib ko‘ring.",
        "empty.noResults": "Hech narsa topilmadi",
        "empty.tryOther": "Boshqa so‘zlar yoki boshqa toifani sinab ko‘ring.",
        "view.deleteYes": "Ha, o‘chirish",
        "meme.login": "Hammuassis qidiryapman. Ko‘nikmalarim: miyovlash va klaviaturada o‘tirish.",
        "meme.register": "Yangimisiz? Mrr! Jamoaga xush kelibsiz.",
        "meme.wrongPassword": "Miyov?! Bu parol emas.",
        "meme.home": "Bir bosh yaxshi, ikki bosh — startap.",
        "meme.my": "E’lonlaringiz mening himoyamda.",
        "meme.empty": "Bu yer hozircha bo‘sh, banan-mushuk xafa.",
        "meme.myEmpty": "E’lonlar yo‘qmi? Pastdagi tugmani bosing — ular paydo bo‘ladi.",
        "meme.profile": "Haqiqiy asoschiga o‘xshaysiz.",
        "meme.newAd": "Muddat qo‘ymasangiz, uni o‘tkazib yubora olmaysiz."
    }
};

function detectLang() {
    try {
        const saved = localStorage.getItem(LANG_KEY);
        if (TRANSLATIONS[saved]) return saved;
    } catch (e) { /* storage unavailable */ }
    const browser = (navigator.language || "").slice(0, 2);
    return TRANSLATIONS[browser] ? browser : "ru";
}

let currentLang = detectLang();
const langListeners = [];

function t(key, params = {}) {
    const text = TRANSLATIONS[currentLang][key] ?? TRANSLATIONS.en[key] ?? key;
    return text.replace(/\{(\w+)\}/g, (_, name) => params[name] ?? "");
}

function setLang(lang) {
    if (!TRANSLATIONS[lang]) return;
    currentLang = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* storage unavailable */ }
    applyTranslations();
    langListeners.forEach(fn => fn(lang));
}

function onLangChange(fn) {
    langListeners.push(fn);
}

function formatDate(date) {
    return date.toLocaleDateString(DATE_LOCALES[currentLang], { day: "numeric", month: "short", year: "numeric" });
}

function daysWord(n) {
    if (currentLang === "ru") {
        const forms = { one: "день", few: "дня", many: "дней", other: "дня" };
        return forms[new Intl.PluralRules("ru").select(n)];
    }
    if (currentLang === "uz") return "kun";
    return n === 1 ? "day" : "days";
}

function yearLabel(year) {
    if (currentLang === "ru") return year + " курс";
    if (currentLang === "uz") return year + "-kurs";
    return ({ 1: "1st", 2: "2nd", 3: "3rd" }[year] || year + "th") + " year";
}

// Static markup: data-i18n (text), data-i18n-html, data-i18n-placeholder, data-i18n-aria, data-i18n-title
function applyTranslations(root = document) {
    document.documentElement.lang = currentLang;
    root.querySelectorAll("[data-i18n]").forEach(el => el.textContent = t(el.dataset.i18n));
    root.querySelectorAll("[data-i18n-html]").forEach(el => el.innerHTML = t(el.dataset.i18nHtml));
    root.querySelectorAll("[data-i18n-placeholder]").forEach(el => el.placeholder = t(el.dataset.i18nPlaceholder));
    root.querySelectorAll("[data-i18n-aria]").forEach(el => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
    root.querySelectorAll("[data-i18n-title]").forEach(el => el.title = t(el.dataset.i18nTitle));
    root.querySelectorAll("select[data-year-select] option").forEach(opt => opt.textContent = yearLabel(Number(opt.value)));
    root.querySelectorAll(".lang-switch button").forEach(btn => btn.classList.toggle("active", btn.dataset.lang === currentLang));
}

// Renders RU / EN / UZ buttons into every .lang-switch element
function initLangSwitch() {
    document.querySelectorAll(".lang-switch").forEach(box => {
        box.innerHTML = Object.entries(LANGUAGES)
            .map(([code, label]) => `<button type="button" data-lang="${code}">${label}</button>`).join("");
        box.addEventListener("click", event => {
            const btn = event.target.closest("button[data-lang]");
            if (btn) setLang(btn.dataset.lang);
        });
    });
    applyTranslations();
}
