/**
 * i18n resources
 * Central place for all UI translations.
 */
export const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        catalog: "Catalog",
        about: "About",
        story: "Our Story",
        orders: "Orders",
        converter: "Converter",
      },
      footer: {
        brandLine: "A botanical house shaped in Sweden, rooted in tropical authenticity.",
        newsletterTitle: "Newsletter",
        newsletterBody:
          "Subscribe for product updates and news. For help, email admin@tropinord.com.",
        faq: "FAQ",
        privacy: "Privacy Policy",
      },
      common: {
        language: "Language",
        theme: "Theme",
        currency: "Currency",
        currencyHint: "Currency selection is saved for this device.",
      },
      notFound: {
        title: "Page not found",
        subtitle: "The page you are looking for does not exist.",
        routeLabel: "Route",
        cta: "Go to catalog",
      },
    },
  },
  sv: {
    translation: {
      nav: {
        home: "Hem",
        catalog: "Katalog",
        about: "Om",
        story: "Vår berättelse",
        orders: "Ordrar",
        converter: "Valutaväxlare",
      },
      footer: {
        brandLine: "Ett botaniskt hus format i Sverige, rotat i tropisk autenticitet.",
        newsletterTitle: "Nyhetsbrev",
        newsletterBody:
          "Prenumerera för produktuppdateringar och nyheter. För hjälp, mejla admin@tropinord.com.",
        faq: "FAQ",
        privacy: "Integritetspolicy",
      },
      common: {
        language: "Språk",
        theme: "Tema",
        currency: "Valuta",
        currencyHint: "Valutaval sparas för den här enheten.",
      },
      notFound: {
        title: "Sidan hittades inte",
        subtitle: "Sidan du söker finns inte.",
        routeLabel: "Sökväg",
        cta: "Gå till katalogen",
      },
    },
  },
  ar: {
    translation: {
      nav: {
        home: "الرئيسية",
        catalog: "الكتالوج",
        about: "حول",
        story: "قصتنا",
        orders: "الطلبات",
        converter: "محول العملات",
      },
      footer: {
        brandLine: "بيت نباتي تشكل في السويد، ومتجذر في أصالة المناطق الاستوائية.",
        newsletterTitle: "النشرة البريدية",
        newsletterBody:
          "اشترك للحصول على تحديثات المنتجات والأخبار. للمساعدة، راسل admin@tropinord.com.",
        faq: "الأسئلة الشائعة",
        privacy: "سياسة الخصوصية",
      },
      common: {
        language: "اللغة",
        theme: "المظهر",
        currency: "العملة",
        currencyHint: "يتم حفظ اختيار العملة لهذا الجهاز.",
      },
      notFound: {
        title: "الصفحة غير موجودة",
        subtitle: "الصفحة التي تبحث عنها غير متوفرة.",
        routeLabel: "المسار",
        cta: "اذهب إلى الكتالوج",
      },
    },
  },
  fr: {
    translation: {
      nav: {
        home: "Accueil",
        catalog: "Catalogue",
        about: "À propos",
        story: "Notre histoire",
        orders: "Commandes",
        converter: "Convertisseur",
      },
      footer: {
        brandLine: "Une maison botanique façonnée en Suède, ancrée dans l’authenticité tropicale.",
        newsletterTitle: "Newsletter",
        newsletterBody:
          "Abonnez-vous pour les mises à jour produits et les actualités. Besoin d'aide, écrivez à admin@tropinord.com.",
        faq: "FAQ",
        privacy: "Politique de confidentialité",
      },
      common: {
        language: "Langue",
        theme: "Thème",
        currency: "Devise",
        currencyHint: "Le choix de la devise est enregistré pour cet appareil.",
      },
      notFound: {
        title: "Page introuvable",
        subtitle: "La page que vous recherchez n’existe pas.",
        routeLabel: "Chemin",
        cta: "Aller au catalogue",
      },
    },
  },
  de: {
    translation: {
      nav: {
        home: "Start",
        catalog: "Katalog",
        about: "Über uns",
        story: "Unsere Geschichte",
        orders: "Bestellungen",
        converter: "Währungsrechner",
      },
      footer: {
        brandLine: "Ein botanisches Haus aus Schweden, verwurzelt in tropischer Authentizität.",
        newsletterTitle: "Newsletter",
        newsletterBody:
          "Abonnieren Sie Updates und Neuigkeiten. Hilfe unter admin@tropinord.com.",
        faq: "FAQ",
        privacy: "Datenschutz",
      },
      common: {
        language: "Sprache",
        theme: "Thema",
        currency: "Währung",
        currencyHint: "Die Währungsauswahl wird auf diesem Gerät gespeichert.",
      },
      notFound: {
        title: "Seite nicht gefunden",
        subtitle: "Die von dir gesuchte Seite existiert nicht.",
        routeLabel: "Pfad",
        cta: "Zum Katalog",
      },
    },
  },
  sw: {
    translation: {
      nav: {
        home: "Nyumbani",
        catalog: "Katalogi",
        about: "Kuhusu",
        story: "Hadithi yetu",
        orders: "Maagizo",
        converter: "Kibadilishaji sarafu",
      },
      footer: {
        brandLine: "Nyumba ya botaniki iliyoundwa Uswidi, yenye asili ya tropiki.",
        newsletterTitle: "Jarida",
        newsletterBody:
          "Jiandikishe kwa taarifa za bidhaa na habari. Kwa msaada, tuma barua kwa admin@tropinord.com.",
        faq: "Maswali",
        privacy: "Sera ya faragha",
      },
      common: {
        language: "Lugha",
        theme: "Mandhari",
        currency: "Sarafu",
        currencyHint: "Uchaguzi wa sarafu umehifadhiwa kwa kifaa hiki.",
      },
      notFound: {
        title: "Ukurasa haupatikani",
        subtitle: "Ukurasa unaoutafuta haupo.",
        routeLabel: "Njia",
        cta: "Nenda kwenye katalogi",
      },
    },
  },
} as const;

export type SupportedLanguage = keyof typeof resources;

export const supportedLanguages: Array<{
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
}> = [
  { code: "sv", label: "Swedish", nativeLabel: "Svenska" },
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية" },
  { code: "fr", label: "French", nativeLabel: "Français" },
  { code: "de", label: "German", nativeLabel: "Deutsch" },
  { code: "sw", label: "Swahili", nativeLabel: "Kiswahili" },
];

export const rtlLanguages: SupportedLanguage[] = ["ar"];
