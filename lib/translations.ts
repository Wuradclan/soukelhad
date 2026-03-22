/**
 * All UI strings for Arabic (ar) and French (fr).
 * Use getMessage(locale, 'dot.path') or useTranslation().t('dot.path') in client components.
 */

export type Locale = 'ar' | 'fr'

export const DEFAULT_LOCALE: Locale = 'fr'

export const LOCALE_COOKIE = 'NEXT_LOCALE'

export const translations = {
  ar: {
    metadata: {
      title: 'سوق الأحد أكادير | المتجر الرقمي والدليل الرسمي',
      description:
        'أكبر سوق في إفريقيا بين يديك. اعثر على أفضل المحلات في سوق الأحد أكادير، اكتشف المنتجات عبر إنستغرام، وتواصل مع التجار مباشرة.',
      keywords: ['سوق الأحد', 'أكادير', 'المغرب', 'تسوق أكادير', 'حرف تقليدية', 'دليل سياحي'],
      ogTitle: 'سوق الأحد أكادير — دليلك الرقمي للتسوق',
      ogDescription:
        'استكشف سوق الأحد كما لم تفعل من قبل. حرف يدوية، موضة، ومنتجات محلية مباشرة من أكادير.',
      twitterTitle: 'سوق الأحد أكادير الرقمي',
      twitterDescription: 'الدليل الأساسي لتسوقك في سوق أكادير.',
    },
    nav: {
      brand: 'SoukElHad.ma',
      brandSub: '/ سوق الأحد',
      signUp: 'التسجيل',
    },
    hero: {
      badge: 'قريباً',
      title: 'محلك في سوق الأحد، مرئي للجميع.',
      subtitle:
        'لا تضيع الوقت في إدارة موقع معقّد. صِلْ إنستغرام، ونزامن منتجاتك تلقائياً على الخريطة الرقمية الرسمية.',
      cta: 'احجز صفحتي (مجاناً)',
      imageAlt: 'بوابة سوق الأحد',
    },
    features: {
      items: [
        {
          title: 'مزامنة إنستغرام',
          description:
            'انشر على إنستغرام كالعادة. تظهر صورك تلقائياً على صفحتك في SoukElHad.ma.',
        },
        {
          title: 'خريطة تفاعلية',
          description: 'السياح والسكان يستخدمون مخططنا الرقمي للعثور على موقع محلك بدقة.',
        },
        {
          title: 'مبيعات على واتساب',
          description:
            'الزبناء يكتشفون جديدك ويضغطون زراً للتواصل معك مباشرة على واتساب.',
        },
      ],
      mockupLabel: 'محل #120',
      mockupClient: 'زبون',
      mockupChat: 'السلام! هل هذا الحقيبة جلد متوفرة؟',
      mockupWa: 'محادثة على واتساب',
    },
    instagramFeed: {
      title: 'مباشر من سوق الأحد',
      subtitle: 'تابع آخر جديدنا على إنستغرام',
      postAlt: 'منشور إنستغرام',
      follow: 'تابع @soukelhad.ma',
      consoleError: 'خطأ إنستغرام:',
      emptyFeed: 'لا توجد منشورات للعرض حالياً.',
      viewOnInstagram: 'عرض على إنستغرام',
    },
    waitlist: {
      title: 'سبقوا الجميع',
      description: 'سجّلوا لكونوا من أوائل التجار المعتمدين.',
      thankYou: 'شكراً على التسجيل!',
      followUp: 'سنتواصل معكم قريباً عبر واتساب.',
      errorSubmit: 'حدث خطأ أثناء التسجيل',
      nameLabel: 'الاسم الكامل',
      namePlaceholder: 'مثال: حسن العلمي',
      localLabel: 'رقم المحل والباب (باب)',
      localPlaceholder: 'مثال: محل 145، باب 6',
      whatsappLabel: 'رقم واتساب',
      whatsappPlaceholder: 'مثال: 06 00 00 00 00',
      instagramLabel: 'اسم مستخدم إنستغرام',
      instagramPlaceholder: 'مثال: @MaBoutiqueAgadir',
      submitting: 'جاري التسجيل...',
      submit: 'انضم لقائمة الانتظار',
      apiValidation: 'الاسم والمحل/الباب وواتساب إلزامية',
      apiInsertError: 'خطأ أثناء التسجيل',
      apiServerError: 'خطأ في الخادم',
    },
    footer: {
      tagline: 'SoukElHad.ma — صُنع بشغف في أكادير.',
    },
    login: {
      title: 'سوق الأحد',
      subtitle: 'فضاء التاجر',
      emailLabel: 'البريد المهني',
      emailPlaceholder: 'nom@boutique.com',
      passwordLabel: 'كلمة المرور',
      passwordPlaceholder: '••••••••',
      errorCredentials: 'البريد أو كلمة المرور غير صحيحة.',
      errorUnexpected: 'حدث خطأ غير متوقع.',
      submit: 'تسجيل الدخول',
      submitting: 'جاري الاتصال...',
      noAccount: 'ليس لديك واجهة بعد؟',
      createAccount: 'إنشاء حساب',
      copyright: 'سوق الأحد أكادير © 2026 — منصة التجار',
    },
    signup: {
      errors: {
        required: 'يرجى تعبئة جميع الحقول الإلزامية.',
        shopNameShort: 'اسم المحل يجب أن يكون على الأقل حرفين.',
        passwordShort: 'كلمة المرور يجب أن يكون 8 أحرف على الأقل لأمانك.',
        whatsappInvalid: 'يرجى إدخال رقم واتساب صحيح',
      },
      title: 'إنشاء واجهتي',
      subtitle: 'انضم إلى السوق الرقمي لأكادير في دقيقتين.',
      shopLabel: 'سمية البوتيك',
      shopPlaceholder: 'مثال: Bazar Al Anwar أو بالعربية',
      whatsappLabel: 'رقم واتساب',
      whatsappPlaceholder: '06 12 34 56 78 أو +212 612 345 678',
      whatsappHint: 'ضروري لاستقبال طلبات الزبناء مباشرة',
      whatsappValid: 'رقم واتساب صالح',
      emailLabel: 'البريد المهني',
      emailPlaceholder: 'contact@maboutique.com',
      passwordLabel: 'كلمة مرور آمنة',
      passwordPlaceholder: '8 أحرف على الأقل',
      submit: 'افتح محلي',
      hasAccount: 'لديك واجهة بالفعل؟',
      signIn: 'سجّل الدخول هنا.',
    },
    user: {
      brand: 'سوق الأحد',
      brandAccent: 'كونكت',
      signOut: 'خروج',
      hello: 'مرحباً،',
      merchantFallback: 'تاجر',
      subtitle: 'أدِر حضورك الرقمي في سوق الأحد بأكادير.',
      msgInstagramOk: 'حساب إنستغرام مربوط الآن بصفحتك!',
      msgWelcome: 'أهلاً! تم إنشاء محلك. صِلْ إنستغرام للبدء.',
      errorIgTitle: 'خطأ في ربط إنستغرام',
      errorIgBody: 'يجب أن يكون حسابك مهنياً (Business) ومربوطاً بصفحة فيسبوك.',
      checkFb: 'التحقق من صفحة فيسبوك',
      sectionAnalytics: 'إحصائيات',
      analyticsVisitsLabel: 'زيارات الصفحة',
      analyticsViewsLabel: 'مشاهدات المنتجات',
      analyticsWaLabel: 'نقرات واتساب',
      analyticsTotalLabel: 'الإجمالي (كل الفترات)',
      analyticsLast7Title: 'آخر 7 أيام',
      analyticsLegendVisits: 'زيارات',
      analyticsLegendViews: 'مشاهدات',
      analyticsLegendWa: 'نقرات',
      analyticsNoDataOverlay: 'لا توجد بيانات بعد',
      analyticsChartEmptyTitle: 'لا توجد بيانات بعد',
      analyticsChartEmptyBody:
        'شارك رابط محلك: أول زيارة، أول مشاهدة لمنتج، وأول نقرة على واتساب ستظهر هنا تلقائياً.',
      analyticsChartTapHint: 'اضغط على نقطة في المنحنى لعرض الأرقام بدقة لهذا اليوم.',
      analyticsChartDayDetail: 'تفاصيل اليوم',
      analyticsDayCol: 'اليوم',
      sectionVitrine: 'واجهتي العامة',
      shopNameLabel: 'اسم المحل',
      shopPending: 'محل قيد الإعداد',
      shareLabel: 'رابط المشاركة',
      configureLink: 'اضبط محلك للحصول على رابط.',
      sectionInstagram: 'مزامنة إنستغرام',
      fluxActive: 'التدفق نشط',
      connectedAs: 'متصل باسم',
      merchantFallbackShort: 'تاجر',
      merchantMetaPending:
        'حسابك قيد التفعيل التقني من طرف Meta. قريباً سيتم جلب منتجاتك تلقائياً.',
      disconnectIg: 'قطع الربط',
      footer: 'هندسة رقمية أكادير — سوق الأحد كونكت',
    },
    pro: {
      navSignUp: 'التسجيل',
      heroTitle: 'محلك يستحق',
      heroTitleAccent: 'واجهة رقمية',
      heroTitleEnd: 'تّليق بك.',
      heroSubtitle:
        'لا تضيع الوقت في موقع معقّد. صِلْ إنستغرام، وننشئ متجرك الإلكتروني تلقائياً.',
      cta: 'احجز صفحتي (مجاناً)',
      card1Title: 'صفر إدارة',
      card1Body:
        'انشر على إنستغرام كالعادة. تظهر صورك فوراً على واجهة سوق الأحد كونكت.',
      card2Title: 'مبيعات مباشرة',
      card2Body:
        'يُضاف زر «اطلب عبر واتساب» تحت كل منتج. استلم الطلبات مباشرة على هاتفك.',
      card3Title: 'أقصى ظهور',
      card3Body: 'ظهر في الصفحة الأولى للسوق. اجذب زبناء من أكادير والمغور والعالم.',
      howTitle: 'كيف يعمل؟',
      step1Title: 'أنشئ حسابك',
      step1Body: 'اختر اسم محلك وعنوانك المخصص.',
      step2Title: 'اربط إنستغرام',
      step2Body: 'بنقرة واحدة نزامن منتجاتك بأمان.',
      step3Title: 'بِع!',
      step3Body: 'شارك الرابط واستلم أول طلباتك على واتساب.',
      ctaTitle: 'مستعد لرقمنة تجارتك؟',
      ctaButton: 'ابدأ الآن',
      ctaNote: 'تسجيل مجاني لأول 100 تاجر في أكادير.',
      footer: 'هندسة رقمية أكادير — سوق الأحد كونكت',
    },
    shop: {
      signUp: 'التسجيل',
      officialBadge: 'محل رسمي',
      box: 'صندوق',
      hours: '09h - 20h',
      descriptionFallback:
        'اكتشفوا تشكيلتنا الحصرية مباشرة من سوق الأحد بأكادير. جودة مضمونة وخدمة عبر واتساب.',
      newArrivals: 'وصل حديثاً',
      footer: 'SoukElHad.ma — أكادير 2026',
      demoProducts: [
        { caption: 'بابوش جلد تقليدي من الأطلس — حرف يدوية من سوق الأحد.' },
        { caption: 'طاجين طيني مزخرف للطبخ المغربي الأصيل.' },
        { caption: 'زربية أمازيغية بألوان سوق الأحد — صوف طبيعي.' },
        { caption: 'بابوش مخيط يدوياً بأكادير، جودة ونعل مرن.' },
        { caption: 'طاجين مخزني بألوان ترابية، أصالة من الجنوب.' },
        { caption: 'زربية صوف بحرف السوق — تسليم عبر واتساب.' },
      ],
    },
    productGrid: {
      productFallback: 'منتج السوق',
      demoSyncBadge: 'قيد المزامنة',
      certified: 'منتج موثّق',
      detailsFallback: 'التفاصيل',
      priceOnRequest: 'السعر عند الطلب',
      noDescription: 'لا يوجد وصف إضافي.',
      buyNow: 'اشترِ الآن',
      waMessagePrefix: 'السلام! مهتم بهذا المنتج لدى',
    },
    instagramConnect: {
      configError: 'خطأ في الإعداد: متغيرات البيئة ناقصة.',
      button: 'بدء الربط',
    },
    privacy: {
      title: 'سياسة الخصوصية',
      lastUpdate: 'آخر تحديث: 21 مارس 2026',
      s1Title: '1. مقدمة',
      s1Body:
        'مرحباً بك في سوق الأحد أكادير (soukelhadagadir.com). نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيف نعالج المعلومات عند استخدامك للمنصة، وخصوصاً لعرض محتوى إنستغرام للتجار.',
      s2Title: '2. البيانات المجمعة',
      s2Intro: 'في إطار استخدام واجهة إنستغرام، نجمع فقط البيانات الضرورية:',
      s2Li1: 'معرّفات إنستغرام: اسم المستخدم ومعرّف الحساب.',
      s2Li2: 'المحتوى: الصور والفيديوهات والتعليقات المنشورة علناً على حسابك.',
      s2Li3: 'رموز الوصول: للحفاظ على الاتصال التلقائي بمنشوراتك.',
      s2Li4: 'جهة الاتصال: رقم واتساب لربطك بالزبناء.',
      s3Title: '3. استخدام البيانات',
      s3Intro: 'تُستخدم بياناتك فقط من أجل:',
      s3Li1: 'عرض كتالوج منتجاتك ديناميكياً على صفحة محلك.',
      s3Li2: 'تمكين الزبناء من التواصل معك مباشرة عبر واتساب.',
      s4Title: '4. حذف البيانات',
      s4Intro: 'وفقاً لمتطلبات ميتا، يمكنك طلب حذف بياناتك في أي وقت:',
      s4Li1: 'أرسل بريداً إلى {email} بعنوان «حذف البيانات».',
      s4Li2: 'اذكر اسم مستخدم إنستغرام المرتبط بمحلك.',
      s4Li3: 'خلال 48 ساعة نحذف نهائياً رموز الوصول والوسائط المخزنة على خوادمنا.',
      s5Title: '5. الاتصال',
      s5Body: 'لأي سؤال حول هذه السياسة، يمكنك التواصل:',
      s5Name: 'Wurad Ait',
      emailLabel: 'البريد:',
    },
    terms: {
      title: 'شروط الاستخدام',
      s1Title: '1. غرض الخدمة',
      s1Body:
        'يوفر سوق الأحد كونكت منصة واجهة رقمية للتجار في سوق الأحد بأكادير لعرض منتجاتهم عبر واجهة إنستغرام.',
      s2Title: '2. استخدام تدفق إنستغرام',
      s2Body:
        'بربط حسابك إنستغرام، تسمح لنا بجلب وعرض صورك العامة. تبقى أنت المالك الوحيد لمحتواك. لا نعدّل صورك.',
      s3Title: '3. المسؤولية',
      s3Body:
        'التاجر مسؤول عن شرعية المنتجات المعروضة. لا تتحمل المنصة مسؤولية المعاملات بين البائع والمشتري عبر واتساب.',
      s4Title: '4. الإنهاء',
      s4Body:
        'يمكنك إيقاف الخدمة في أي وقت بقطع ربط إنستغرام من لوحة التحكم أو من إعدادات فيسبوك/إنستغرام.',
      s5Title: '5. الاتصال',
      s5Body: 'لأي استفسار:',
      footerUpdate: 'آخر تحديث: 21 مارس 2026',
    },
    testDb: {
      checking: 'جاري التحقق من الاتصال...',
      success: '✅ تم الاتصال! عنوان الرابط والمفتاح صحيحان.',
      errorPrefix: '❌ خطأ في الاتصال:',
      title: 'تشخيص Supabase',
      retest: 'إعادة الاختبار',
    },
  },
  fr: {
    metadata: {
      title: 'Souk El Had Agadir | Boutique Digitale & Guide Officiel',
      description:
        "Le plus grand souk d'Afrique à portée de clic. Localisez les meilleures boutiques de Souk El Had Agadir, découvrez les produits via Instagram et contactez les commerçants directement.",
      keywords: ['Souk El Had', 'Agadir', 'Maroc', 'Shopping Agadir', 'Artisanat Marocain', 'Boutique Souk Agadir', 'Guide Touristique Agadir'],
      ogTitle: 'Souk El Had Agadir - Votre Guide Shopping Numérique',
      ogDescription:
        "Explorez le Souk El Had comme jamais auparavant. Artisanat, mode, et produits locaux en direct d'Agadir.",
      twitterTitle: 'Souk El Had Agadir Digital',
      twitterDescription: "Le guide indispensable pour vos achats au Souk d'Agadir.",
    },
    nav: {
      brand: 'SoukElHad.ma',
      brandSub: '/ سوق الأحد',
      signUp: "S'inscrire",
    },
    hero: {
      badge: 'Bientôt Disponible',
      title: 'Votre boutique à Souk El Had, visible par tout le monde.',
      subtitle:
        'Ne perdez plus de temps à gérer un site web. Connectez votre Instagram, et nous synchronisons vos produits automatiquement sur la carte officielle numérique.',
      cta: 'Réserver ma page (Gratuit)',
      imageAlt: 'Portes du Souk El Had',
    },
    features: {
      items: [
        {
          title: 'Synchronisation Instagram',
          description:
            "Publiez sur Instagram comme d'habitude. Vos photos apparaissent automatiquement sur votre page SoukElHad.ma.",
        },
        {
          title: 'Carte Interactive',
          description:
            "Les touristes et locaux utilisent notre plan numérique pour trouver l'emplacement exact de votre boutique.",
        },
        {
          title: 'Ventes directes WhatsApp',
          description:
            'Les clients découvrent vos nouveautés et cliquent sur un bouton pour vous contacter directement sur WhatsApp.',
        },
      ],
      mockupLabel: 'Boutique #120',
      mockupClient: 'Client',
      mockupChat: 'Salam! Ce sac en cuir est disponible ?',
      mockupWa: 'Discuter sur WhatsApp',
    },
    instagramFeed: {
      title: 'En direct de Souk El Had',
      subtitle: 'Suivez nos dernières pépites sur Instagram',
      postAlt: 'Post Instagram',
      follow: 'Suivre @soukelhad.ma',
      consoleError: 'Erreur Instagram:',
      emptyFeed: 'Aucune publication Instagram à afficher pour le moment.',
      viewOnInstagram: 'Voir sur Instagram',
    },
    waitlist: {
      title: "Prenez de l'avance",
      description: 'Inscrivez-vous pour être parmi les premiers marchands certifiés.',
      thankYou: 'Merci pour votre inscription!',
      followUp: 'Nous vous contacterons bientôt sur WhatsApp.',
      errorSubmit: "Erreur lors de l'inscription",
      nameLabel: 'Nom complet',
      namePlaceholder: 'Ex: Hassan Alami',
      localLabel: 'Numéro du Local & Porte (Bab)',
      localPlaceholder: 'Ex: Local 145, Bab 6',
      whatsappLabel: 'Numéro WhatsApp',
      whatsappPlaceholder: 'Ex: 06 00 00 00 00',
      instagramLabel: "Nom d'utilisateur Instagram",
      instagramPlaceholder: 'Ex: @MaBoutiqueAgadir',
      submitting: 'Inscription en cours...',
      submit: "Rejoindre la liste d'attente",
      apiValidation: 'Nom, Local/Bab et WhatsApp sont requis',
      apiInsertError: "Erreur lors de l'inscription",
      apiServerError: 'Erreur serveur',
    },
    footer: {
      tagline: 'SoukElHad.ma - Fait avec passion à Agadir.',
    },
    login: {
      title: 'Souk El Had',
      subtitle: 'Espace Commerçant',
      emailLabel: 'Email professionnel',
      emailPlaceholder: 'nom@boutique.com',
      passwordLabel: 'Mot de passe',
      passwordPlaceholder: '••••••••',
      errorCredentials: 'Email ou mot de passe incorrect.',
      errorUnexpected: 'Une erreur inattendue est survenue.',
      submit: 'Se connecter',
      submitting: 'Connexion...',
      noAccount: "Vous n'avez pas encore de vitrine ?",
      createAccount: 'Créer mon compte',
      copyright: 'Souk El Had Agadir © 2026 - Plateforme Commerçants',
    },
    signup: {
      errors: {
        required: 'Veuillez remplir tous les champs obligatoires.',
        shopNameShort: 'Le nom de la boutique doit contenir au moins 2 caractères.',
        passwordShort: 'Le mot de passe doit contenir au moins 8 caractères pour votre sécurité.',
        whatsappInvalid: 'Veuillez entrer un numéro WhatsApp valide',
      },
      title: 'Créer ma vitrine',
      subtitle: "Rejoignez le marché numérique d'Agadir en 2 minutes.",
      shopLabel: 'Nom de la boutique',
      shopPlaceholder: 'Ex: Bazar Al Anwar ou en arabe',
      whatsappLabel: 'Numéro WhatsApp',
      whatsappPlaceholder: '06 12 34 56 78 ou +212 612 345 678',
      whatsappHint:
        'Indispensable pour recevoir les commandes des clients directement.',
      whatsappValid: 'Numéro WhatsApp valide',
      emailLabel: 'Adresse Email professionnelle',
      emailPlaceholder: 'contact@maboutique.com',
      passwordLabel: 'Mot de passe sécurisé',
      passwordPlaceholder: '8 caractères minimum',
      submit: 'Ouvrir ma boutique',
      hasAccount: 'Vous avez déjà une vitrine ?',
      signIn: 'Connectez-vous ici.',
    },
    user: {
      brand: 'Souk El Had',
      brandAccent: 'Connect',
      signOut: 'Quitter',
      hello: 'Bonjour,',
      merchantFallback: 'Commerçant',
      subtitle: "Gérez votre présence digitale au Souk El Had d'Agadir.",
      msgInstagramOk: 'Votre compte Instagram est maintenant relié à votre vitrine !',
      msgWelcome:
        'Bienvenue ! Votre boutique a été créée. Connectez votre Instagram pour commencer.',
      errorIgTitle: 'Erreur de connexion Instagram',
      errorIgBody:
        'Votre compte doit être en mode Professionnel (Business) et lié à une Page Facebook.',
      checkFb: 'Vérifier ma Page Facebook',
      sectionAnalytics: 'Statistiques',
      analyticsVisitsLabel: 'Visites (page boutique)',
      analyticsViewsLabel: 'Vues produit (fenêtre)',
      analyticsWaLabel: 'Clics WhatsApp',
      analyticsTotalLabel: 'Total (historique)',
      analyticsLast7Title: 'Tendance — 7 derniers jours',
      analyticsLegendVisits: 'Visites',
      analyticsLegendViews: 'Vues',
      analyticsLegendWa: 'Clics',
      analyticsNoDataOverlay: 'Pas encore de données',
      analyticsChartEmptyTitle: 'Pas encore de données',
      analyticsChartEmptyBody:
        'Partagez le lien de votre vitrine : la première visite, la première vue produit et le premier clic WhatsApp apparaîtront ici automatiquement.',
      analyticsChartTapHint: 'Touchez un point de la courbe pour afficher le détail du jour.',
      analyticsChartDayDetail: 'Détail du jour',
      analyticsDayCol: 'Jour',
      sectionVitrine: 'Ma Vitrine Publique',
      shopNameLabel: 'Nom de la boutique',
      shopPending: 'Boutique en attente',
      shareLabel: 'Lien de partage',
      configureLink: 'Configurez votre boutique pour obtenir un lien.',
      sectionInstagram: 'Instagram Sync',
      fluxActive: 'Flux Actif',
      connectedAs: 'Connecté en tant que',
      merchantFallbackShort: 'Commerçant',
      merchantMetaPending:
        'Votre compte est en cours d’activation technique par Meta. Vos produits seront bientôt synchronisés automatiquement.',
      disconnectIg: 'Déconnecter le compte',
      footer: 'Architecture Digitale Agadir — Souk El Had Connect',
    },
    pro: {
      navSignUp: "S'inscrire",
      heroTitle: 'Votre boutique mérite une',
      heroTitleAccent: 'vitrine digitale',
      heroTitleEnd: 'à la hauteur.',
      heroSubtitle:
        "Ne perdez plus de temps à gérer un site web complexe. Connectez votre Instagram, et nous créons votre boutique en ligne automatiquement.",
      cta: "Réserver ma page (C'est Gratuit)",
      card1Title: 'Zéro Gestion',
      card1Body:
        "Postez sur Instagram comme d'habitude. Vos photos apparaissent instantanément sur votre vitrine Souk El Had Connect.",
      card2Title: 'Ventes Directes',
      card2Body:
        'Un bouton "Commander sur WhatsApp" est ajouté sous chaque produit. Recevez les commandes directement sur votre téléphone.',
      card3Title: 'Visibilité Max',
      card3Body:
        "Apparaissez sur la première page du Souk. Attirez des clients d'Agadir, du Maroc et du monde entier.",
      howTitle: 'Comment ça marche ?',
      step1Title: 'Créez votre compte',
      step1Body: 'Choisissez le nom de votre boutique et votre adresse personnalisée.',
      step2Title: 'Liez votre Instagram',
      step2Body: 'En un clic, nous synchronisons vos produits de manière sécurisée.',
      step3Title: 'Vendez !',
      step3Body: 'Partagez votre lien et recevez vos premières commandes sur WhatsApp.',
      ctaTitle: 'Prêt à digitaliser votre commerce ?',
      ctaButton: 'Commencer maintenant',
      ctaNote: "Inscription gratuite pour les 100 premiers commerçants d'Agadir.",
      footer: 'Architecture Digitale Agadir — Souk El Had Connect',
    },
    shop: {
      signUp: "S'inscrire",
      officialBadge: 'Boutique Officielle',
      box: 'Box',
      hours: '09h - 20h',
      descriptionFallback:
        "Retrouvez notre sélection exclusive d'articles en direct du Souk El Had d'Agadir. Qualité garantie et service client direct via WhatsApp.",
      newArrivals: 'Nouveaux Arrivages',
      footer: 'SoukElHad.ma — Agadir 2026',
      demoProducts: [
        { caption: 'Babouche en cuir traditionnel marocain — artisanat du Souk El Had.' },
        { caption: 'Tajine en terre cuite émaillée pour la cuisine marocaine.' },
        { caption: 'Tapis berbère tissé main, motifs du Souk d’Agadir.' },
        { caption: 'Babouche cousue main à Agadir, confort et finitions soignées.' },
        { caption: 'Tajine décoratif aux couleurs terre, inspiration du Sud.' },
        { caption: 'Tapis en laine, commande et livraison via WhatsApp.' },
      ],
    },
    productGrid: {
      productFallback: 'Produit Souk',
      demoSyncBadge: 'Synchronisation en cours',
      certified: 'Article Certifié',
      detailsFallback: 'Détails',
      priceOnRequest: 'Prix sur demande',
      noDescription: 'Aucune description supplémentaire.',
      buyNow: 'Acheter maintenant',
      waMessagePrefix: "Salam! Je suis intéressé par ce produit chez",
    },
    instagramConnect: {
      configError: "Erreur de configuration : Variables d'environnement manquantes.",
      button: 'Démarrer la connexion',
    },
    privacy: {
      title: 'Politique de Confidentialité',
      lastUpdate: 'Dernière mise à jour : 21 mars 2026',
      s1Title: '1. Introduction',
      s1Body:
        'Bienvenue sur Souk El Had Agadir (soukelhadagadir.com). Nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles. Cette politique explique comment nous traitons les informations lorsque vous utilisez notre plateforme, notamment pour l\'affichage des flux Instagram des commerçants.',
      s2Title: '2. Données collectées',
      s2Intro: "Dans le cadre de l'utilisation de l'API Instagram, nous collectons uniquement les données strictement nécessaires :",
      s2Li1: "Identifiants Instagram : Nom d'utilisateur et ID de compte.",
      s2Li2: 'Contenu Médias : Photos, vidéos et légendes publiées publiquement sur votre compte Instagram.',
      s2Li3: "Jetons d'accès : Pour maintenir la connexion automatique à votre flux.",
      s2Li4: 'Contact : Votre numéro WhatsApp pour la mise en relation client.',
      s3Title: '3. Utilisation des données',
      s3Intro: 'Vos données sont utilisées exclusivement pour :',
      s3Li1: 'Afficher votre catalogue de produits dynamiquement sur votre page boutique.',
      s3Li2: 'Permettre aux clients de vous contacter directement via WhatsApp.',
      s4Title: '4. Instructions de suppression des données',
      s4Intro: 'Conformément aux exigences de Meta, vous pouvez demander la suppression de vos données à tout moment :',
      s4Li1: 'Envoyez un e-mail à {email} avec pour objet "Suppression de données".',
      s4Li2: "Précisez votre nom d'utilisateur Instagram associé à votre boutique.",
      s4Li3: 'Sous 48h, tous vos jetons d\'accès et médias stockés seront définitivement supprimés de nos serveurs.',
      s5Title: '5. Contact',
      s5Body: 'Pour toute question concernant cette politique, vous pouvez contacter le responsable :',
      s5Name: 'Wurad Ait',
      emailLabel: 'Email :',
    },
    terms: {
      title: "Conditions Générales d'Utilisation",
      s1Title: '1. Objet du Service',
      s1Body:
        "Souk El Had Connect fournit une plateforme de vitrine numérique permettant aux commerçants du Souk El Had d'Agadir d'afficher leurs produits via l'API Instagram.",
      s2Title: '2. Utilisation du Flux Instagram',
      s2Body:
        'En connectant votre compte Instagram, vous autorisez Souk El Had Connect à récupérer et afficher vos photos publiques. Vous restez l\'unique propriétaire de vos contenus. Nous ne modifions pas vos photos.',
      s3Title: '3. Responsabilité',
      s3Body:
        'Le commerçant est responsable de la légalité des produits affichés sur sa vitrine. Souk El Had Connect ne peut être tenu responsable des transactions effectuées entre le vendeur et l\'acheteur via WhatsApp.',
      s4Title: '4. Résiliation',
      s4Body:
        'Vous pouvez interrompre le service à tout moment en déconnectant votre compte Instagram depuis votre tableau de bord ou depuis vos paramètres Facebook/Instagram.',
      s5Title: '5. Contact',
      s5Body: 'Pour toute question :',
      footerUpdate: 'Dernière mise à jour : 21 mars 2026',
    },
    testDb: {
      checking: 'Vérification de la connexion...',
      success: '✅ Connexion établie ! Ton URL et ta Clé Anon sont correctes.',
      errorPrefix: '❌ Erreur de connexion :',
      title: 'Supabase Diagnostic',
      retest: 'Re-tester',
    },
  },
} as const

export type TranslationTree = (typeof translations)[Locale]

export function getMessage(locale: Locale, path: string): string {
  const segments = path.split('.')
  let value: unknown = translations[locale]
  for (const segment of segments) {
    if (value !== null && typeof value === 'object' && segment in value) {
      value = (value as Record<string, unknown>)[segment]
    } else {
      return path
    }
  }
  return typeof value === 'string' ? value : path
}

/** Read locale from NEXT_LOCALE cookie (server). */
export function localeFromCookie(cookieValue: string | undefined): Locale {
  return cookieValue === 'ar' ? 'ar' : 'fr'
}
