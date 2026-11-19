// Digital She — Barcha foydalanuvchi ko'radigan o'zbekcha matnlar (lotin alifbosida)
// Keyinchalik boshqa til qo'shish oson bo'lishi uchun markazlashtirilgan lug'at

export const CATEGORIES = [
  "Dizayn (logotip, banner, Canva)",
  "SMM va kontent",
  "Tarjima",
  "Ma'lumot kiritish",
  "Matn yozish",
  "Veb va dasturlash",
  "Boshqa",
] as const;

export const REGIONS = [
  "Toshkent shahri",
  "Toshkent viloyati",
  "Qoraqalpog'iston Respublikasi",
  "Andijon viloyati",
  "Buxoro viloyati",
  "Farg'ona viloyati",
  "Jizzax viloyati",
  "Xorazm viloyati",
  "Namangan viloyati",
  "Navoiy viloyati",
  "Qashqadaryo viloyati",
  "Samarqand viloyati",
  "Sirdaryo viloyati",
  "Surxondaryo viloyati",
] as const;

export const LANGUAGES_LIST = [
  { code: "uz", label: "O'zbek tili" },
  { code: "ru", label: "Rus tili" },
  { code: "en", label: "Ingliz tili" },
  { code: "kaa", label: "Qoraqalpoq tili" },
  { code: "tr", label: "Turk tili" },
] as const;

export const POPULAR_SKILLS = [
  "Canva",
  "Grafik dizayn",
  "Logotip",
  "SMM",
  "Copywriting",
  "O'zbek-Ingliz tarjima",
  "O'zbek-Rus tarjima",
  "Excel / Google Sheets",
  "Ma'lumot kiritish",
  "Telegram bot",
  "Frontend (HTML/CSS/React)",
  "Video montaj (CapCut)",
] as const;

export const TEXTS = {
  brand: {
    name: "DIGITAL SHE",
    tagline: "Raqamli iqtisodiyotda ayollar imkoniyatlarini kengaytirish",
    description:
      "Ayollar va qizlar uchun moslashuvchan, xavfsiz va qulay masofaviy ish (frilans) platformasi.",
  },
  nav: {
    home: "Bosh sahifa",
    jobs: "Ishlar",
    postJob: "Ish e'lon qilish",
    dashboard: "Kabinet",
    profile: "Profilim",
    admin: "Admin panel",
    login: "Kirish",
    register: "Ro'yxatdan o'tish",
    logout: "Chiqish",
    demoBadge: "Namuna rejimi",
  },
  landing: {
    heroBadge: "O'zbekiston ayollari va qizlari uchun №1 frilans maydoni",
    heroTitle: "O'z vaqtingizga mos masofaviy ish toping va daromad qiling",
    heroSubtitle:
      "Digital She — oila, o'qish va farzand parvarishi bilan birga olib borish mumkin bo'lgan moslashuvchan buyurtmalar hamda 15–30 daqiqalik mikro-vazifalar platformasi.",
    ctaFindWork: "Ish topishni boshlash",
    ctaPostJob: "Buyurtma joylash",
    stats: {
      freelancers: "Ro'yxatdan o'tgan mutaxassislar",
      openJobs: "Ochiq buyurtmalar",
      microTasks: "Mikro-vazifalar ulushi",
      safeEnv: "Xavfsiz va mahalliy muhit",
    },
    problemTitle: "Nega an'anaviy ish va frilans saytlari har doim ham mos kelmaydi?",
    problems: [
      {
        title: "Qat'iy ish grafigi",
        desc: "Yosh onalar va talaba qizlar kuniga 8 soat uzluksiz ofisda yoki ekran qarshisida o'tira olmaydi.",
      },
      {
        title: "Til va murakkablik to'sig'i",
        desc: "Xorijiy frilans birjalarida ingliz tili, murakkab to'lov tizimlari va keskin raqobat boshlovchilarni cho'chitadi.",
      },
      {
        title: "Xavfsizlik va ishonch muammosi",
        desc: "Telegram kanallardagi e'lonlarda shaxsiy raqam oshkor bo'lishi va mehnat haqi to'lanmasligi xavfi yuqori.",
      },
    ],
    solutionTitle: "Digital She qanday yechim beradi?",
    solutions: [
      {
        title: "Ona rejimi (Moslashuvchan grafik)",
        desc: "Haftasiga necha soat ishlay olishingizni belgilang va faqat moslashuvchan muddatli buyurtmalarni tanlang.",
      },
      {
        title: "Mikro-vazifalar (15–30 daqiqa)",
        desc: "Kichik bo'sh vaqtingizda bajarish mumkin bo'lgan qisqa topshiriqlar orqali ilk tajriba va daromadga ega bo'ling.",
      },
      {
        title: "Mahalliy tilda xavfsiz muhit",
        desc: "Shaxsiy telefon raqamingiz yashirin qoladi, barcha muloqot va buyurtma jarayoni o'zbek tilida amalga oshadi.",
      },
    ],
    howItWorksTitle: "Platforma qanday ishlaydi?",
    howItWorksSteps: [
      {
        step: "01",
        title: "Profil yarating va ko'nikmalarni kiriting",
        desc: "Ro'yxatdan o'tib, qo'lingizdan keladigan ishlar va haftalik bo'sh vaqtingizni ('Ona rejimi') belgilang.",
      },
      {
        step: "02",
        title: "Sizga mos ishlarga ariza yuboring",
        desc: "Aqlli moslik tizimi sizga eng mos buyurtmalarni foizlarda ko'rsatadi. O'z taklifingizni yuboring.",
      },
      {
        step: "03",
        title: "Ishni topshiring va reyting yig'ing",
        desc: "Buyurtmani bajarib topshiring, to'lovni qabul qiling va ijobiy sharhlar orqali daromadingizni oshiring.",
      },
    ],
    audienceTitle: "Digital She kimlar uchun?",
    forFreelancers: {
      badge: "Ayol va qizlar uchun",
      title: "Frilanser sifatida",
      items: [
        "Uydan chiqmasdan o'z bilimingizni daromadga aylantiring",
        "Farzand parvarishi yoki o'qishga xalaqit bermaydigan moslashuvchan muddatlar",
        "Canva dizayn, tarjima, SMM, matn yozish va ma'lumot kiritish bo'yicha yuzlab vazifalar",
        "Tasdiqlangan profil va haqqoniy reyting orqali doimiy mijozlar toping",
      ],
      cta: "Frilanser bo'lib qo'shilish",
    },
    forClients: {
      badge: "Tadbirkor va kompaniyalar uchun",
      title: "Buyurtmachi sifatida",
      items: [
        "Mas'uliyatli va saralangan mahalliy mutaxassislarni tez toping",
        "Kichik vazifalardan tortib yirik loyihalargacha daqiqalar ichida e'lon bering",
        "Nomzodlarning ko'nikma mosligi, portfoliolari va oldingi baholarini ko'rib tanlang",
        "Aniq bosqichli buyurtma nazorati: jarayonda, topshirildi, yakunlandi",
      ],
      cta: "Buyurtmachi sifatida boshlash",
    },
    faqTitle: "Tez-tez so'raladigan savollar",
    faqs: [
      {
        q: "Platformadan foydalanish pullikmi?",
        a: "Yo'q, MVP bosqichida Digital She platformasida ro'yxatdan o'tish, ish e'lon qilish va ariza topshirish mutlaqo bepul.",
      },
      {
        q: "'Ona rejimi' va mikro-vazifa nima degani?",
        a: "'Ona rejimi' — haftasiga qancha soat ajrata olishingiz va faqat qat'iy bo'lmagan (moslashuvchan) muddatli ishlarni ko'rish imkoniyati. Mikro-vazifalar esa 15–30 daqiqa ichida bitadigan kichik ishlardir.",
      },
      {
        q: "To'lov qanday amalga oshiriladi?",
        a: "Hozirgi MVP bosqichida to'lov buyurtmachi va frilanser o'rtasida bevosita (masalan, plastik karta orqali) kelishiladi va saytda 'To'lov qildim' / 'To'lovni oldim' belgilari bilan tasdiqlanadi. Xavfsiz to'lov (escrow) tez orada qo'shiladi.",
      },
      {
        q: "Telefon raqamim yoki emailim boshqalarga ko'rinadimi?",
        a: "Yo'q! Xavfsizlik maqsadida sizning email manzilingiz va shaxsiy kontaktlaringiz ommaviy profilda hech kimga ko'rsatilmaydi.",
      },
    ],
  },
  auth: {
    loginTitle: "Tizimga kirish",
    loginSubtitle: "Digital She hisobingizga kiring",
    registerTitle: "Ro'yxatdan o'tish",
    registerSubtitle: "Yangi hisob yarating va imkoniyatlarni kashf eting",
    emailLabel: "Elektron pochta (Email)",
    passwordLabel: "Parol (kamida 8 belgi)",
    fullNameLabel: "To'liq ismingiz (Ism va familiya)",
    roleLabel: "Kim sifatida foydalanmoqchisiz?",
    roleFreelancer: "Frilanser (Ish topish)",
    roleFreelancerDesc: "Buyurtmalarga ariza topshirish va daromad qilish",
    roleClient: "Buyurtmachi (Ish e'lon qilish)",
    roleClientDesc: "Vazifalar joylash va mutaxassislarni yollash",
    submitLogin: "Kirish",
    submitRegister: "Hisob yaratish",
    noAccount: "Hisobingiz yo'qmi?",
    hasAccount: "Allaqachon hisobingiz bormi?",
  },
  jobs: {
    listTitle: "Barcha buyurtmalar va vazifalar",
    listSubtitle: "Ko'nikmangiz va bo'sh vaqtingizga mos ishlarni tanlang",
    searchPlaceholder: "Sarlavha yoki kalit so'z bo'yicha qidirish...",
    categoryAll: "Barcha kategoriyalar",
    minBudget: "Min. byudjet (so'm)",
    maxBudget: "Maks. byudjet (so'm)",
    onlyMicro: "Faqat mikro-vazifalar (15-30 daq)",
    onlyFlexible: "Moslashuvchan muddat (Ona rejimi)",
    loadMore: "Ko'proq yuklash",
    noJobs: "Tanlangan filtrlar bo'yicha hozircha ishlar topilmadi.",
    matchPrefix: "Mos:",
    microBadge: "Mikro-vazifa",
    flexibleBadge: "Moslashuvchan muddat",
    demoBadge: "Namuna",
    budgetNegotiable: "Kelishiladi",
    currency: "so'm",
    hoursUnit: "soat",
    paymentNotice:
      "To'lov tomonlar o'rtasida kelishiladi. Xavfsiz to'lov (escrow) tez orada qo'shiladi.",
    clientPaidBtn: "To'lov qildim",
    freelancerReceivedBtn: "To'lovni oldim",
    statusLabels: {
      open: "Ochiq",
      in_progress: "Jarayonda",
      submitted: "Topshirildi (tekshiruvda)",
      completed: "Yakunlangan",
      cancelled: "Bekor qilingan",
    },
    applicationStatus: {
      pending: "Kutilmoqda",
      accepted: "Qabul qilindi",
      rejected: "Rad etildi",
    },
  },
  footer: {
    rights: "Barcha huquqlar himoyalangan.",
    madeFor: "O'zbekiston ayollari va qizlarining raqamli kelajagi uchun yaratildi.",
  },
};
