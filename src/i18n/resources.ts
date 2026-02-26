// src/i18n/resources.ts
export type SupportedLanguage = "sv" | "en" | "ar" | "fr" | "de" | "sw";

export const rtlLanguages: SupportedLanguage[] = ["ar"];

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

// Namespaces used across the app
export const NAMESPACES = [
  "common",
  "nav",
  "footer",
  "newsletter",
  "errors",
  "checkout",
  "home",
  "catalog",
  "about",
  "cart",
  "story",
  "faq",
  "privacy",
] as const;

export type AppNamespace = (typeof NAMESPACES)[number];

/**
 * resources object for i18next
 * Structure: resources[lang][namespace][keys...]
 */
export const resources = {
  en: {
    common: {
      language: "Language",
      theme: "Theme",
      currency: "Currency",
      currencyHint: "Currency selection is saved for this device.",
      loading: "Loading…",
      close: "Close",
      copy: "Copy",
      backToShop: "Back to shop",
      free: "Free",
      included: "Included",
      includesFreeTeaBagsTitle: "Includes free tea bags",
      includesFreeTeaBagsBody:
        "Every tea order includes a pack of 10 reusable organic tea bags.",
      teaBagsLabel: "Reusable organic tea bags (10-pack)",
    },
    currencies: {
      SEK: "Swedish krona (SEK)",
      EUR: "Euro (EUR)",
      USD: "US dollar (USD)",
      GBP: "British pound (GBP)",
      NOK: "Norwegian krone (NOK)",
      DKK: "Danish krone (DKK)",
      CHF: "Swiss franc (CHF)",
      KES: "Kenyan shilling (KES)",
      TZS: "Tanzanian shilling (TZS)",
      UGX: "Ugandan shilling (UGX)",
    },
    nav: {
      menu: "Menu",
      home: "Home",
      catalog: "Catalog",
      about: "About",
      story: "Our Story",
      orders: "Orders",
      converter: "Currency converter",
      account: "Account",
      language: "Language",
    },
    about: {
      headerTitle: "About",
      headerSubtitle:
        "Quiet European refinement, rooted in tropical authenticity.",

      hero: {
        kicker: "Premium wellness  Ethical trade  Heritage botanicals",
        title: "TropiNord is a Nordic-led botanical house with tropical depth.",
        body: "Based in Sweden, TropiNord curates oils, teas, and superfoods with an emphasis on traceability, careful handling, and calm design. We combine Nordic precision with the cultural depth of tropical ingredients, selecting products that feel pure, intentional, and worthy of daily ritual.",
      },

      brandStory: {
        title: "Brand story",
        p1: "Our story begins with a belief that wellness should connect people to nature, heritage, and the wisdom that sustains both.",
        p2: "We are building a premium niche brand with controlled growth, prioritizing craftsmanship and sourcing clarity.",
      },

      transparency: {
        title: "Sourcing transparency",
        body: "Oils and superfoods are sourced from small producers in tropical regions of Africa. Teas are currently supplied through European partners while we build direct logistics.",
      },

      whatWeDo: {
        title: "What we do",
        cards: {
          traceable: {
            title: "Curated products of traceable origin",
            body: "We curate oils, teas, and superfoods that can be explained through origin, handling, and integrity.",
          },
          ethical: {
            title: "Ethical partnerships",
            body: "We work with small producers and trusted partners with an emphasis on fair value exchange and clarity.",
          },
          design: {
            title: "Quality control and calm design",
            body: "Nordic design is restraint. We keep the brand quiet and premium so the product speaks.",
          },
          platform: {
            title: "A platform built for trust",
            body: "We build systems for transparency, product clarity, and a premium customer experience.",
          },
        },
      },

      mission: {
        title: "Our mission",
        p1: "To refine natural wellness through integrity, responsible sourcing, and Nordic precision.",
        tagline:
          "TropiNord. Where tradition meets technology for natural wellbeing.",
      },

      contact: {
        title: "Contact",
        bodyPrefix: "For partnerships, sourcing, or support, contact",
      },
    },
    cart: {
      title: "Shopping Cart",
      bundleApplied: "Bundle applied",
      teaHoneyLabel: "Tea + Honey Bundle (10% off honey)",
      emptyTitle: "Your cart is empty",
      emptyBody: "Add some products to get started",
      subtotal: "Subtotal",
      discounts: "Discounts",
      total: "Total",
      save: "Save",
      proceedToCheckout: "Proceed to Checkout",
      clearCart: "Clear Cart",
      productFallbackTitle: "Product",
      decreaseQty: "Decrease quantity",
      increaseQty: "Increase quantity",
      removeItem: "Remove item",
      continueShopping: "Continue Shopping",
    },
    story: {
      header: {
        title: "Our Story",
        subtitle: "A botanical house with Nordic restraint and tropical depth.",
      },

      hero: {
        kicker: "Botanical maison  Ethical trade  Heritage craft",
        title:
          "A living bridge between continents, built with restraint and responsibility.",
        body: "TropiNord exists to protect origin. We choose traceable sourcing, careful handling, and calm design, so what reaches your shelf still carries the place it came from.",
        founderLine: "Founded by Paul Abejegah.",
      },

      quote: "Authenticity is preserved when origin is respected.",

      why: {
        title: "Why TropiNord exists",
        p1: "Our story begins with a belief that wellness should connect people to nature, heritage, and the wisdom that sustains both. Born in Sweden, TropiNord blends Nordic precision with tropical innovation to create natural products that nurture, restore, and protect.",
        p2: "The project is shaped by lived experience across continents and climates. It is built with quiet European refinement, and a deep respect for tropical craft and community knowledge.",
      },

      transparency: {
        title: "Sourcing transparency statement",
        body: "Oils and superfoods are sourced from small-scale producers in tropical regions of Africa, with a focus on careful handling, traceability, and fair value exchange. Teas are currently supplied through European partners who source from Africa, selected for quality control and compliance while we build direct logistics. Each product page reflects what we can verify, and how it was sourced.",
      },

      sections: {
        oils: {
          title: "Our oils",
          body: "Our oils are not mass-produced commodities. They are crafted in small batches using traditional methods, often cold-pressed or gently refined. This preserves the natural character, aroma, texture, and performance that industrial processing often strips away.",
        },
        superfoods: {
          title: "Our superfoods",
          body: "Our superfoods are harvested in small quantities and minimally processed to retain integrity. From moringa and baobab to thick forest honey, we prioritize authenticity, careful handling, and respect for the communities that produce them.",
        },
      },

      founder: {
        kicker: "Founder",
        name: "Paul Abejegah",
        photoAlt: "Paul Abejegah",
      },

      principles: {
        kicker: "Principles",
        items: [
          "Traceable origin and honest sourcing",
          "Small-batch handling, not industrial anonymity",
          "Design restraint with premium intent",
          "Respect for craft, people, and place",
        ],
      },

      sourcing: {
        kicker: "Sourcing transparency",
        title: "Sourcing map",
        body: "A simplified view of origin and partnerships. Oils and superfoods are sourced through small producers in tropical Africa. Teas are currently supplied through European partners who source from Africa, selected for consistency and compliance while we build direct logistics.",
        map: {
          sweden: "Sweden",
          euPartners: "European partners",
          westAfrica: "West Africa",
          nigeria: "Nigeria",
          eastAfrica: "East Africa",
        },
        cards: {
          oils: {
            title: "Oils",
            body: "Small-batch sourcing with local producers, crafted with traditional methods and careful handling.",
          },
          superfoods: {
            title: "Superfoods",
            body: "Harvested in small quantities and minimally processed for integrity and authenticity.",
          },
          teas: {
            title: "Teas",
            body: "Sourced via European partners who source from Africa, chosen for quality control while we scale logistics.",
          },
        },
      },

      closing: {
        title: "Authenticity is not a trend. It is our standard.",
        currentLanguage: "Current language:",
      },
    },
    faq: {
      header: {
        title: "FAQ",
        subtitle: "Answers to common questions.",
      },
      title: "Frequently asked questions",
      questions: {
        shipping: {
          title: "Where do you ship from",
          body: "We ship from Sweden. Product availability and delivery times can vary by region.",
        },
        authenticity: {
          title: "Are your products authentic",
          body: "We prioritize traceability and sourcing clarity. Oils and superfoods are sourced from small producers in tropical Africa. Teas are currently supplied through European partners who source from Africa.",
        },
        contact: {
          title: "How can I contact you",
          body: "Email admin@tropinord.com or reach us via WhatsApp from the footer icon.",
        },
      },
    },
    privacy: {
      header: {
        title: "Privacy Policy",
        subtitle: "How we handle your data.",
      },
      title: "Privacy policy",
      body: {
        p1: "We collect only the information needed to provide our services, such as order fulfillment and customer support. We do not sell personal information.",
        p2: "Newsletter signups are used to send product updates and brand news. You can unsubscribe at any time.",
        p3: "For questions about privacy, contact admin@tropinord.com.",
      },
    },
    footer: {
      brandLine:
        "A botanical house shaped in Sweden, rooted in tropical authenticity.",
      newsletterTitle: "Newsletter",
      newsletterBody:
        "Subscribe for product drops and sourcing updates. Need help? Email support@tropinord.com.",
      trustLine: "Secure checkout • Stripe • Swish (manual)",
      faq: "FAQ",
      privacy: "Privacy Policy",
      madeIn: "Designed in Sweden • Rooted in the Tropics",
      helpBody:
        "Reach us on <whatsapp>WhatsApp</whatsapp> or email <email>support@tropinord.com</email>.",
      rightsReserved: "© {{year}} TropiNord. All rights reserved.",
    },
    newsletter: {
      emailPlaceholder: "Email address",
      subscribe: "Subscribe",
      signingUp: "Signing up…",
      subscribedTitle: "Subscribed",
      subscribedDescription: "Thanks! You have been added to the newsletter.",
      errorTitle: "Could not subscribe",
      errorDescription:
        "Please try again later, or contact support@tropinord.com.",
    },
    errors: {
      genericTitle: "Error",
      genericDescription: "Something went wrong. Please try again.",
      copyFailedTitle: "Copy failed",
      copyFailedDescription: "Could not copy to clipboard.",
      missingInfoTitle: "Missing information",
      checkoutFailedTitle: "Checkout failed",
      checkoutFailedDescription:
        "We couldn't start the payment. Please try again.",
      swishRequiresSekTitle: "Swish requires SEK",
      swishRequiresSekDescription:
        "Swish is only available for SEK orders. Please use SEK currency.",

      // Form validation
      fullNameRequired: "Full name is required.",
      emailRequired: "Email is required.",
      emailInvalid: "Invalid email address.",
      streetRequired: "Street address is required.",
      cityRequired: "City is required.",
      postalCodeRequired: "Postal code is required.",
      countryRequired: "Country is required.",
    },
    checkout: {
      headerTitle: "Checkout",
      headerSubtitle: "Shipping details, payment method, and secure payment.",
      emptyTitle: "Your cart is empty",
      emptyBody: "Add some products to your cart before checking out.",
      continueShopping: "Continue Shopping",

      contactTitle: "Contact Information",
      fullName: "Full Name",
      email: "Email",
      phoneOptional: "Phone (optional)",
      phonePlaceholder: "+46 70 123 4567",

      shippingTitle: "Shipping Address",
      streetAddress: "Street Address",
      city: "City",
      postalCode: "Postal Code",
      country: "Country",

      paymentTitle: "Payment Method",
      payCardTitle: "Card (Stripe)",
      payCardBody: "Secure Stripe Checkout",
      paySwishTitle: "Swish (manual)",
      paySwishBody: "QR + reference (confirmed after verification)",
      paySwishRequiresSek: "Requires SEK currency",
      payPaypalTitle: "PayPal",
      payPaypalBody: "Enable via Stripe Checkout (if eligible)",

      summaryTitle: "Order Summary",
      qty: "Qty",
      subtotal: "Subtotal",
      discounts: "Discounts",
      shipping: "Shipping",
      total: "Total",

      starting: "Starting…",
      showSwishQr: "Show Swish QR",
      payWithStripe: "Pay with Stripe",
      swishHint: "You’ll get a QR code and reference for Swish.",
      stripeHint: "You’ll be redirected to Stripe’s secure checkout.",

      // Swish modal
      swishModalTitle: "Pay with Swish",
      swishModalDescription:
        "Scan the QR code in Swish or use the number + reference. Your order will be confirmed after verification.",
      amount: "Amount",
      swishNumber: "Swish number",
      reference: "Reference",
      openSwish: "Open Swish",
      afterPayHint:
        "After you pay, your order will remain pending until verified. If you need help, contact support.",
      iHavePaid: "I have paid",

      // Toasts
      copiedTitle: "Copied",
      copiedDescription: "{{label}} copied to clipboard.",
      paymentPendingTitle: "Payment pending",
      paymentPendingDescription:
        "Thanks! We’ll confirm your Swish payment shortly.",
    },

    home: {
      hero: {
        tagline: "Tropical Origins. Global Harmony.",
        explore: "Explore",
        headline: "Teas, Oils & Superfoods from the Tropics",
        subheadline:
          "Digitally traceable. Sustainably sourced. Premium tropical nourishment.",
        ourStory: "Our Story",
      },
      tea: {
        ariaBrowse: "Browse Teas",
        heroAlt: "TropiNord Tea Collection",
        badge: "Traditionally Crafted",
        guideAlt: "Tea guide",
        title: "Steep calm, sip clarity",
        body: "Whole-leaf character. Honest aroma. A ritual remembered.",
        cta: "Browse Teas",
      },
      oil: {
        ariaBrowse: "Browse Oils",
        heroAlt: "TropiNord Oil Collection",
        badge: "Small Batch Sourced",
        alt1: "Cold pressed oils",
        alt2: "Palm kernel oil hair care",
        title: "Authentic oils, sourced in small batches",
        p1: "TropiNord oils are sourced in small batches from local farmers across tropical regions of Africa. These are not mass-produced commodity oils. They are traditionally crafted oils pressed, prepared, and handled with care so they retain their natural character and authenticity.",
        p2: "We prioritize direct relationships and traceability. Each batch reflects its origin: the soil, climate, and hands behind it. What you receive is 100% authentic, locally made oil, prepared the way it has been for generations.",
      },
      superfoods: {
        ariaBrowse: "Browse Superfoods",
        heroAlt: "Superfoods",
        badge: "Harvested Traditionally",
        title: "Superfoods with real origin, not industrial powders",
        p1: "Our superfoods are sourced from their native environments across Africa, where they have been used for generations. From moringa leaves to baobab fruit and thick forest honey, we focus on small-quantity harvesting to preserve quality and integrity.",
        p2: "These are minimally processed ingredients, naturally dried, carefully handled, and prepared to retain their authentic nutritional profile. We choose traditional methods over mass production, because authenticity matters.",
      },
      newsletter: {
        title: "Stay in the loop",
        success: "Thanks! You're on the list.",
        placeholder: "Enter your email",
        cta: "Subscribe",
      },
    },
    catalog: {
      // Main catalog page
      title: "Explore products",
      subtitle: "Discover our selection of premium products",
      filterByCategory: "Filter by Category",
      loadFailed: "Failed to load products.",
      showingCount: "Showing {{count}} products",

      // Product details page
      productDetailsTitle: "Product details",
      productDetailsSubtitle: "Product details and purchase options.",
      productDetailsLoadingSubtitle: "Loading product information.",
      productNotFoundTitle: "Product not found",
      productNotFoundSubtitle: "This product could not be found.",
      productNotFoundBody:
        "The product you're looking for doesn't exist or has been removed.",
      backToCatalog: "Back to catalog",

      // Stock labels
      inStockCount: "{{count}} in stock",
      outOfStock: "Out of stock",
      comingSoon: "Coming soon",

      // Ritual badges
      ritualFriendly: "Ritual Friendly",
      pairsWithHoney: "Pairs with Honey",
      slowBrew: "Slow Brew",

      // Ritual section
      ritualTitle: "Complete Your Tea Ritual",
      ritualSubtitle: "Simple companions that elevate the cup.",
      ritualPicks: "Ritual Picks",
      ritualPick: "Ritual Pick",
      ritualTip: "Tip: Add Wild Forest Honey for a richer ritual cup.",

      // Related products
      youMayAlsoLike: "You may also like",

      // Bundle pairing notice
      teaHoneyPairingTitle: "Tea + Honey Ritual Pairing",
      teaHoneyPairingBody:
        "Both items are in your cart. Bundle discounts can be enabled in checkout.",

      // Buttons
      addToCart: "Add to cart",
      added: "Added",
      maxInCart: "Max in cart",
      unavailable: "Unavailable",

      // NEW: used by CategoryFilter + ProductSearch + ProductCard
      searchPlaceholder: "Search products...",
      clearSearch: "Clear search",
      onlyLeft: "Only {{count}} left",
      productFallbackTitle: "Product",
      categories: {
        all: "All Products",
        tea: "Tea",
        oils: "Oils",
        superfoods: "Superfoods",
        others: "Others",
      },
    },
  },

  sv: {
    common: {
      language: "Språk",
      theme: "Tema",
      currency: "Valuta",
      currencyHint: "Valutaval sparas för den här enheten.",
      loading: "Laddar…",
      close: "Stäng",
      copy: "Kopiera",
      backToShop: "Tillbaka till butiken",
      free: "Gratis",
      included: "Inkluderat",
      includesFreeTeaBagsTitle: "Inkluderar gratis tepåsar",
      includesFreeTeaBagsBody:
        "Varje te-beställning inkluderar ett paket med 10 återanvändbara ekologiska tepåsar.",
      teaBagsLabel: "Återanvändbara ekologiska tepåsar (10-pack)",
    },
    currencies: {
      SEK: "Svensk krona (SEK)",
      EUR: "Euro (EUR)",
      USD: "US-dollar (USD)",
      GBP: "Brittiskt pund (GBP)",
      NOK: "Norsk krona (NOK)",
      DKK: "Dansk krona (DKK)",
      CHF: "Schweizisk franc (CHF)",
      KES: "Kenyansk shilling (KES)",
      TZS: "Tanzanisk shilling (TZS)",
      UGX: "Ugandisk shilling (UGX)",
    },
    nav: {
      menu: "Meny",
      home: "Hem",
      catalog: "Katalog",
      about: "Om",
      story: "Vår berättelse",
      orders: "Ordrar",
      converter: "Valutaväxlare",
      account: "Konto",
      language: "Språk",
    },
    about: {
      headerTitle: "Om",
      headerSubtitle: "Tyst europeisk förfining, rotad i tropisk autenticitet.",

      hero: {
        kicker: "Premium wellness  Etisk handel  Botaniskt arv",
        title:
          "TropiNord är ett nordiskt lett botaniskt hus med tropiskt djup.",
        body: "Baserat i Sverige kurerar TropiNord oljor, teer och superfoods med fokus på spårbarhet, noggrann hantering och lugn design.",
      },

      brandStory: {
        title: "Vår berättelse",
        p1: "Vår resa börjar med tron att välmående ska förena människor med natur och arv.",
        p2: "Vi bygger ett premiumvarumärke med kontrollerad tillväxt och tydlig sourcing.",
      },

      transparency: {
        title: "Transparens i sourcing",
        body: "Oljor och superfoods kommer från små producenter i tropiska delar av Afrika.",
      },

      whatWeDo: {
        title: "Vad vi gör",
        cards: {
          traceable: {
            title: "Kurerade produkter med spårbart ursprung",
            body: "Vi väljer produkter med tydligt ursprung och integritet.",
          },
          ethical: {
            title: "Etiska partnerskap",
            body: "Vi samarbetar med små producenter med fokus på rättvist värde.",
          },
          design: {
            title: "Kvalitet och lugn design",
            body: "Nordisk design är återhållsam och strukturerad.",
          },
          platform: {
            title: "En plattform byggd på förtroende",
            body: "Vi bygger system för transparens och kundupplevelse.",
          },
        },
      },

      mission: {
        title: "Vårt uppdrag",
        p1: "Att förfina naturligt välmående genom integritet och nordisk precision.",
        tagline:
          "TropiNord. Där tradition möter teknik för naturligt välmående.",
      },

      contact: {
        title: "Kontakt",
        bodyPrefix: "För partnerskap, sourcing eller support, kontakta",
      },
    },
    cart: {
      title: "Varukorg",
      bundleApplied: "Paket aktiverat",
      teaHoneyLabel: "Te + Honung-paket (10% rabatt på honung)",
      emptyTitle: "Din varukorg är tom",
      emptyBody: "Lägg till produkter för att komma igång",
      subtotal: "Delsumma",
      discounts: "Rabatter",
      total: "Totalt",
      save: "Spara",
      proceedToCheckout: "Gå till kassan",
      clearCart: "Töm varukorgen",
      productFallbackTitle: "Produkt",
      decreaseQty: "Minska antal",
      increaseQty: "Öka antal",
      removeItem: "Ta bort",
      continueShopping: "Fortsätt handla",
    },
    story: {
      header: {
        title: "Vår berättelse",
        subtitle:
          "Ett botaniskt hus med nordisk återhållsamhet och tropiskt djup.",
      },

      hero: {
        kicker: "Botaniskt hus  Etisk handel  Hantverkstradition",
        title:
          "En levande bro mellan kontinenter, byggd med återhållsamhet och ansvar.",
        body: "TropiNord finns för att skydda ursprung. Vi väljer spårbar sourcing, varsam hantering och lugn design, så att det som når din hylla fortfarande bär platsen det kommer ifrån.",
        founderLine: "Grundat av Paul Abejegah.",
      },

      quote: "Autenticitet bevaras när ursprung respekteras.",

      why: {
        title: "Varför TropiNord finns",
        p1: "Vår berättelse börjar med en tro att välmående ska koppla människor till natur, arv och den kunskap som bär båda. Född i Sverige blandar TropiNord nordisk precision med tropisk innovation för att skapa naturliga produkter som vårdar, återställer och skyddar.",
        p2: "Projektet formas av levda erfarenheter över kontinenter och klimat. Det byggs med tyst europeisk förfining och en djup respekt för tropiskt hantverk och lokalt kunnande.",
      },

      transparency: {
        title: "Transparens i sourcing",
        body: "Oljor och superfoods kommer från småskaliga producenter i tropiska delar av Afrika, med fokus på varsam hantering, spårbarhet och rättvist värdeutbyte. Teer levereras för närvarande via europeiska partners som sourcar från Afrika, utvalda för kvalitetskontroll och efterlevnad medan vi bygger direkt logistik. Varje produktsida visar vad vi kan verifiera och hur det har sourcats.",
      },

      sections: {
        oils: {
          title: "Våra oljor",
          body: "Våra oljor är inte massproducerade varor. De framställs i små batcher med traditionella metoder, ofta kallpressade eller varsamt raffinerade. Det bevarar naturlig karaktär, arom, textur och funktion som industriell bearbetning ofta tar bort.",
        },
        superfoods: {
          title: "Våra superfoods",
          body: "Våra superfoods skördas i små mängder och bearbetas minimalt för att behålla integritet. Från moringa och baobab till tjock skogshonung prioriterar vi autenticitet, varsam hantering och respekt för samhällena som producerar dem.",
        },
      },

      founder: {
        kicker: "Grundare",
        name: "Paul Abejegah",
        photoAlt: "Paul Abejegah",
      },

      principles: {
        kicker: "Principer",
        items: [
          "Spårbart ursprung och ärlig sourcing",
          "Småskalig hantering, inte industriell anonymitet",
          "Design-återhållsamhet med premiumavsikt",
          "Respekt för hantverk, människor och plats",
        ],
      },

      sourcing: {
        kicker: "Transparens i sourcing",
        title: "Sourcingkarta",
        body: "En förenklad bild av ursprung och partnerskap. Oljor och superfoods sourcas via små producenter i tropiska Afrika. Teer levereras för närvarande via europeiska partners som sourcar från Afrika, utvalda för konsekvens och efterlevnad medan vi bygger direkt logistik.",
        map: {
          sweden: "Sverige",
          euPartners: "Europeiska partners",
          westAfrica: "Västafrika",
          nigeria: "Nigeria",
          eastAfrica: "Östafrika",
        },
        cards: {
          oils: {
            title: "Oljor",
            body: "Små batcher med lokala producenter, framställda med traditionella metoder och varsam hantering.",
          },
          superfoods: {
            title: "Superfoods",
            body: "Skördas i små mängder och bearbetas minimalt för integritet och autenticitet.",
          },
          teas: {
            title: "Teer",
            body: "Sourcas via europeiska partners som sourcar från Afrika, utvalda för kvalitetskontroll medan vi skalar logistik.",
          },
        },
      },

      closing: {
        title: "Autenticitet är ingen trend. Det är vår standard.",
        currentLanguage: "Nuvarande språk:",
      },
    },
    faq: {
      header: {
        title: "FAQ",
        subtitle: "Svar på vanliga frågor.",
      },
      title: "Vanliga frågor",
      questions: {
        shipping: {
          title: "Varifrån skickar ni",
          body: "Vi skickar från Sverige. Produkttillgänglighet och leveranstider kan variera beroende på region.",
        },
        authenticity: {
          title: "Är era produkter autentiska",
          body: "Vi prioriterar spårbarhet och tydlig sourcing. Oljor och superfoods kommer från små producenter i tropiska Afrika. Teer levereras via europeiska partners som sourcar från Afrika.",
        },
        contact: {
          title: "Hur kan jag kontakta er",
          body: "Mejla admin@tropinord.com eller nå oss via WhatsApp-ikonen i sidfoten.",
        },
      },
    },
    privacy: {
      header: {
        title: "Integritetspolicy",
        subtitle: "Så hanterar vi din data.",
      },
      title: "Integritetspolicy",
      body: {
        p1: "Vi samlar endast in information som behövs för att tillhandahålla våra tjänster, såsom orderhantering och kundsupport. Vi säljer inte personuppgifter.",
        p2: "Nyhetsbrevsregistrering används för att skicka produktuppdateringar och nyheter. Du kan avsluta prenumerationen när som helst.",
        p3: "För frågor om integritet, kontakta admin@tropinord.com.",
      },
    },
    footer: {
      brandLine:
        "Ett botaniskt hus format i Sverige, rotat i tropisk autenticitet.",
      newsletterTitle: "Nyhetsbrev",
      newsletterBody:
        "Prenumerera för produktlanseringar och uppdateringar. Behöver du hjälp? Mejla support@tropinord.com.",
      trustLine: "Säker betalning • Stripe • Swish (manuell)",
      faq: "FAQ",
      privacy: "Integritetspolicy",
      madeIn: "Designad i Sverige • Rotad i tropikerna",
      helpBody:
        "Kontakta oss på <whatsapp>WhatsApp</whatsapp> eller mejla <email>support@tropinord.com</email>.",
      rightsReserved: "© {{year}} TropiNord. Alla rättigheter förbehållna.",
    },
    newsletter: {
      emailPlaceholder: "E-postadress",
      subscribe: "Prenumerera",
      signingUp: "Registrerar…",
      subscribedTitle: "Prenumeration klar",
      subscribedDescription: "Tack! Du är nu med i nyhetsbrevet.",
      errorTitle: "Kunde inte prenumerera",
      errorDescription:
        "Försök igen senare eller kontakta support@tropinord.com.",
    },
    errors: {
      genericTitle: "Fel",
      genericDescription: "Något gick fel. Försök igen.",
      copyFailedTitle: "Kopiering misslyckades",
      copyFailedDescription: "Kunde inte kopiera till urklipp.",
      missingInfoTitle: "Saknar information",
      checkoutFailedTitle: "Kassan misslyckades",
      checkoutFailedDescription:
        "Vi kunde inte starta betalningen. Försök igen.",
      swishRequiresSekTitle: "Swish kräver SEK",
      swishRequiresSekDescription:
        "Swish är endast tillgängligt för order i SEK. Välj SEK som valuta.",
      fullNameRequired: "Fullständigt namn krävs.",
      emailRequired: "E-post krävs.",
      emailInvalid: "Ogiltig e-postadress.",
      streetRequired: "Gatuadress krävs.",
      cityRequired: "Stad krävs.",
      postalCodeRequired: "Postnummer krävs.",
      countryRequired: "Land krävs.",
    },
    checkout: {
      headerTitle: "Kassa",
      headerSubtitle: "Leveransuppgifter, betalningsmetod och säker betalning.",
      emptyTitle: "Din varukorg är tom",
      emptyBody: "Lägg till produkter i varukorgen innan du går till kassan.",
      continueShopping: "Fortsätt handla",

      contactTitle: "Kontaktuppgifter",
      fullName: "Namn",
      email: "E-post",
      phoneOptional: "Telefon (valfritt)",
      phonePlaceholder: "+46 70 123 4567",

      shippingTitle: "Leveransadress",
      streetAddress: "Gatuadress",
      city: "Stad",
      postalCode: "Postnummer",
      country: "Land",

      paymentTitle: "Betalningsmetod",
      payCardTitle: "Kort (Stripe)",
      payCardBody: "Säker Stripe-betalning",
      paySwishTitle: "Swish (manuell)",
      paySwishBody: "QR + referens (bekräftas efter verifiering)",
      paySwishRequiresSek: "Kräver SEK-valuta",
      payPaypalTitle: "PayPal",
      payPaypalBody: "Aktiveras via Stripe (om möjligt)",

      summaryTitle: "Ordersammanfattning",
      qty: "Antal",
      subtotal: "Delsumma",
      discounts: "Rabatter",
      shipping: "Frakt",
      total: "Totalt",

      starting: "Startar…",
      showSwishQr: "Visa Swish-QR",
      payWithStripe: "Betala med Stripe",
      swishHint: "Du får en QR-kod och referens för Swish.",
      stripeHint: "Du skickas vidare till Stripes säkra kassa.",

      swishModalTitle: "Betala med Swish",
      swishModalDescription:
        "Skanna QR-koden i Swish eller använd nummer + referens. Din order bekräftas efter verifiering.",
      amount: "Belopp",
      swishNumber: "Swish-nummer",
      reference: "Referens",
      openSwish: "Öppna Swish",
      afterPayHint:
        "Efter betalning ligger ordern kvar som väntande tills den verifierats. Behöver du hjälp, kontakta support.",
      iHavePaid: "Jag har betalat",

      copiedTitle: "Kopierat",
      copiedDescription: "{{label}} kopierat till urklipp.",
      paymentPendingTitle: "Betalning väntar",
      paymentPendingDescription:
        "Tack! Vi bekräftar din Swish-betalning snart.",
    },

    home: {
      hero: {
        tagline: "Tropiska ursprung. Global harmoni.",
        explore: "Utforska",
        headline: "Teer, oljor & superfoods från tropikerna",
        subheadline:
          "Digitalt spårbart. Hållbart odlat. Premium näring från tropikerna.",
        ourStory: "Vår berättelse",
      },
      tea: {
        ariaBrowse: "Utforska teer",
        heroAlt: "TropiNord te-kollektion",
        badge: "Traditionellt framställt",
        guideAlt: "Te-guide",
        title: "Brygg lugn, smaka klarhet",
        body: "Hela blad. Ärlig arom. En ritual att minnas.",
        cta: "Utforska teer",
      },
      oil: {
        ariaBrowse: "Utforska oljor",
        heroAlt: "TropiNord oljekollektion",
        badge: "Små batcher",
        alt1: "Kallpressade oljor",
        alt2: "Palmkärnolja för hårvård",
        title: "Autentiska oljor i små batcher",
        p1: "TropiNords oljor tas fram i små batcher från lokala bönder i tropiska delar av Afrika. Det här är inte massproducerade varuoljor. De är traditionellt framställda, pressade och hanterade med omsorg för att behålla sin naturliga karaktär och autenticitet.",
        p2: "Vi prioriterar direkta relationer och spårbarhet. Varje batch speglar sitt ursprung: jorden, klimatet och händerna bakom. Du får 100% autentisk, lokalt producerad olja, tillagad på samma sätt i generationer.",
      },
      superfoods: {
        ariaBrowse: "Utforska superfoods",
        heroAlt: "Superfoods",
        badge: "Traditionellt skördat",
        title: "Superfoods med äkta ursprung, inte industripulver",
        p1: "Våra superfoods hämtas från sina ursprungsmiljöer i Afrika där de använts i generationer. Från moringablad till baobabfrukt och tjock skogshonung fokuserar vi på småskalig skörd för att bevara kvalitet och integritet.",
        p2: "Det här är minimalt bearbetade ingredienser: naturligt torkade, varsamt hanterade och framtagna för att behålla sin autentiska näringsprofil. Vi väljer traditionella metoder framför massproduktion — för att autenticitet spelar roll.",
      },
      newsletter: {
        title: "Håll dig uppdaterad",
        success: "Tack! Du är med på listan.",
        placeholder: "Ange din e-post",
        cta: "Prenumerera",
      },
    },
    catalog: {
      title: "Utforska produkter",
      subtitle: "Upptäck vårt utbud av premiumprodukter",
      filterByCategory: "Filtrera efter kategori",
      loadFailed: "Misslyckades att ladda produkter.",
      showingCount: "Visar {{count}} produkter",

      productDetailsTitle: "Produktdetaljer",
      productDetailsSubtitle: "Produktdetaljer och köpalternativ.",
      productDetailsLoadingSubtitle: "Laddar produktinformation.",
      productNotFoundTitle: "Produkten hittades inte",
      productNotFoundSubtitle: "Den här produkten kunde inte hittas.",
      productNotFoundBody:
        "Produkten du letar efter finns inte eller har tagits bort.",
      backToCatalog: "Tillbaka till katalogen",

      inStockCount: "{{count}} i lager",
      outOfStock: "Slut i lager",
      comingSoon: "Kommer snart",

      ritualFriendly: "Ritualvänlig",
      pairsWithHoney: "Passar med honung",
      slowBrew: "Lång bryggning",

      ritualTitle: "Komplettera din teritual",
      ritualSubtitle: "Enkla tillbehör som lyfter koppen.",
      ritualPicks: "Ritualval",
      ritualPick: "Ritualval",
      ritualTip: "Tips: Lägg till vild skogshonung för en rikare kopp.",

      youMayAlsoLike: "Du kanske också gillar",

      teaHoneyPairingTitle: "Te + Honung – ritualparning",
      teaHoneyPairingBody:
        "Båda produkterna finns i din varukorg. Paket-/rabattlogik kan aktiveras i kassan.",

      addToCart: "Lägg i varukorgen",
      added: "Tillagd",
      maxInCart: "Max i varukorgen",
      unavailable: "Ej tillgänglig",

      // NEW: used by CategoryFilter + ProductSearch + ProductCard
      searchPlaceholder: "Sök produkter…",
      clearSearch: "Rensa sökning",
      onlyLeft: "Endast {{count}} kvar",
      productFallbackTitle: "Produkt",
      categories: {
        all: "Alla produkter",
        tea: "Te",
        oils: "Oljor",
        superfoods: "Superfoods",
        others: "Övrigt",
      },
    },
  },

  ar: {
    common: {
      language: "اللغة",
      theme: "المظهر",
      currency: "العملة",
      currencyHint: "يتم حفظ اختيار العملة لهذا الجهاز.",
      loading: "جارٍ التحميل…",
      close: "إغلاق",
      copy: "نسخ",
      backToShop: "العودة إلى المتجر",
      free: "مجاني",
      included: "مُشامل",
      includesFreeTeaBagsTitle: "يتضمن مساحات شاي قابلة لإعادة الاستخدام",
      includesFreeTeaBagsBody:
        "تتضمن كل طلب شاي حزمة من 10 مساحات شاي قابلة لإعادة الاستخدام.",
      teaBagsLabel: "مساحات شاي قابلة لإعادة الاستخدام (حزمة من 10)",
    },
    currencies: {
      SEK: "كرونة سويدية (SEK)",
      EUR: "يورو (EUR)",
      USD: "دولار أمريكي (USD)",
      GBP: "جنيه إسترليني (GBP)",
      NOK: "كرونة نرويجية (NOK)",
      DKK: "كرونة دنماركية (DKK)",
      CHF: "فرنك سويسري (CHF)",
      KES: "شلن كيني (KES)",
      TZS: "شلن تنزاني (TZS)",
      UGX: "شلن أوغندي (UGX)",
    },
    nav: {
      menu: "القائمة",
      home: "الرئيسية",
      catalog: "الكتالوج",
      about: "حول",
      story: "قصتنا",
      orders: "الطلبات",
      converter: "محول العملات",
      account: "الحساب",
      language: "اللغة",
    },
    about: {
      headerTitle: "حول",
      headerSubtitle: "رقي أوروبي هادئ، متجذر في أصالة المناطق الاستوائية.",
      hero: {
        kicker: "عافية متميزة  تجارة أخلاقية  تراث نباتي",
        title: "TropiNord بيت نباتي بقيادة شمالية بعمق استوائي.",
        body: "يقع مقر TropiNord في السويد ويختار الزيوت والشاي والسوبرفود بعناية مع التركيز على الشفافية وقابلية التتبع.",
      },
      brandStory: {
        title: "قصتنا",
        p1: "نؤمن أن العافية يجب أن تربط الإنسان بالطبيعة والتراث.",
        p2: "نبني علامة متخصصة بنمو مدروس ووضوح في التوريد.",
      },
      transparency: {
        title: "شفافية التوريد",
        body: "يتم الحصول على الزيوت والسوبرفود من منتجين صغار في أفريقيا.",
      },
      whatWeDo: {
        title: "ماذا نفعل",
        cards: {
          traceable: {
            title: "منتجات مختارة بأصل واضح",
            body: "نختار منتجات يمكن شرح مصدرها بوضوح.",
          },
          ethical: {
            title: "شراكات أخلاقية",
            body: "نتعاون مع منتجين موثوقين بقيمة عادلة.",
          },
          design: {
            title: "جودة وتصميم هادئ",
            body: "التصميم الشمالي يعني البساطة والانضباط.",
          },
          platform: {
            title: "منصة مبنية على الثقة",
            body: "نبني أنظمة للشفافية وتجربة مميزة.",
          },
        },
      },
      mission: {
        title: "مهمتنا",
        p1: "الارتقاء بالعافية الطبيعية من خلال النزاهة والمسؤولية.",
        tagline: "TropiNord. حيث يلتقي التراث بالتكنولوجيا.",
      },
      contact: {
        title: "تواصل معنا",
        bodyPrefix: "للشراكات أو الدعم، تواصل عبر",
      },
    },
    cart: {
      title: "سلة التسوق",
      bundleApplied: "تم تطبيق الباقة",
      teaHoneyLabel: "باقة الشاي + العسل (خصم 10% على العسل)",
      emptyTitle: "سلة التسوق فارغة",
      emptyBody: "أضف بعض المنتجات للبدء",
      subtotal: "المجموع الفرعي",
      discounts: "الخصومات",
      total: "الإجمالي",
      save: "وفّر",
      proceedToCheckout: "المتابعة إلى الدفع",
      clearCart: "إفراغ السلة",
      productFallbackTitle: "منتج",
      decreaseQty: "تقليل الكمية",
      increaseQty: "زيادة الكمية",
      removeItem: "إزالة",
      continueShopping: "متابعة التسوق",
    },
    story: {
      header: {
        title: "قصتنا",
        subtitle: "بيت نباتي بانضباط شمالي وعمق استوائي.",
      },

      hero: {
        kicker: "بيت نباتي  تجارة أخلاقية  حِرفة موروثة",
        title: "جسر حيّ بين القارات، مبنيّ بالانضباط والمسؤولية.",
        body: "توجد TropiNord لحماية الأصل. نختار توريدًا قابلًا للتتبع، وتعاملًا دقيقًا، وتصميمًا هادئًا، لكي يحمل ما يصل إلى رفّك المكان الذي جاء منه.",
        founderLine: "أسسها بول أبيجيجاه.",
      },

      quote: "تُحفظ الأصالة عندما يُحترم الأصل.",

      why: {
        title: "لماذا وُجدت TropiNord",
        p1: "تبدأ قصتنا بإيمانٍ بأن العافية يجب أن تربط الناس بالطبيعة والتراث والحكمة التي تحافظ عليهما. وُلدت في السويد، وتمزج TropiNord الدقة الشمالية بالابتكار الاستوائي لتصنع منتجات طبيعية تُغذي وتُرمم وتحمي.",
        p2: "يتشكل المشروع بتجربة معيشية عبر القارات والمناخات. يُبنى برقي أوروبي هادئ، وباحترام عميق لحِرفة المناطق الاستوائية ومعرفة المجتمعات المحلية.",
      },

      transparency: {
        title: "بيان شفافية التوريد",
        body: "يتم الحصول على الزيوت والسوبرفود من منتجين صغار في المناطق الاستوائية بأفريقيا مع التركيز على التعامل الدقيق وقابلية التتبع وتبادل عادل للقيمة. يتم توريد الشاي حاليًا عبر شركاء أوروبيين يحصلون عليه من أفريقيا، اختيروا لضبط الجودة والامتثال بينما نبني لوجستيات مباشرة. تعكس صفحة كل منتج ما يمكننا التحقق منه وكيف تم التوريد.",
      },

      sections: {
        oils: {
          title: "زيوتنا",
          body: "زيوتنا ليست سلعًا مُنتجة بكميات ضخمة. تُصنع على دفعات صغيرة بطرق تقليدية، غالبًا معصورة على البارد أو مُنقّاة بلطف. يحافظ ذلك على الطابع الطبيعي والرائحة والملمس والأداء الذي تُفقده المعالجة الصناعية عادة.",
        },
        superfoods: {
          title: "السوبرفود لدينا",
          body: "تُحصد سوبرفودنا بكميات صغيرة وتُعالج بأدنى قدر للحفاظ على النزاهة. من المورينغا والباوباب إلى عسل الغابات الكثيف، نعطي الأولوية للأصالة والتعامل الحذر واحترام المجتمعات التي تنتجها.",
        },
      },

      founder: {
        kicker: "المؤسس",
        name: "Paul Abejegah",
        photoAlt: "Paul Abejegah",
      },

      principles: {
        kicker: "المبادئ",
        items: [
          "أصل قابل للتتبع وتوريد صادق",
          "تعامل على دفعات صغيرة لا غموض صناعي",
          "تصميم منضبط بنَفَس فاخر",
          "احترام الحِرفة والناس والمكان",
        ],
      },

      sourcing: {
        kicker: "شفافية التوريد",
        title: "خريطة التوريد",
        body: "عرض مبسط للأصول والشراكات. يتم توريد الزيوت والسوبرفود عبر منتجين صغار في أفريقيا الاستوائية. يتم توريد الشاي حاليًا عبر شركاء أوروبيين يحصلون عليه من أفريقيا، اختيروا للثبات والامتثال بينما نبني لوجستيات مباشرة.",
        map: {
          sweden: "السويد",
          euPartners: "شركاء أوروبيون",
          westAfrica: "غرب أفريقيا",
          nigeria: "نيجيريا",
          eastAfrica: "شرق أفريقيا",
        },
        cards: {
          oils: {
            title: "الزيوت",
            body: "توريد دفعات صغيرة مع منتجين محليين بطرق تقليدية وتعامل دقيق.",
          },
          superfoods: {
            title: "السوبرفود",
            body: "يُحصد بكميات صغيرة ويُعالج بشكل محدود للحفاظ على النزاهة والأصالة.",
          },
          teas: {
            title: "الشاي",
            body: "يتم الحصول عليه عبر شركاء أوروبيين يوردون من أفريقيا لضبط الجودة أثناء توسيع اللوجستيات.",
          },
        },
      },

      closing: {
        title: "الأصالة ليست موضة. إنها معيارنا.",
        currentLanguage: "اللغة الحالية:",
      },
    },
    faq: {
      header: {
        title: "الأسئلة الشائعة",
        subtitle: "إجابات على الأسئلة المتكررة.",
      },
      title: "الأسئلة الشائعة",
      questions: {
        shipping: {
          title: "من أين يتم الشحن",
          body: "نقوم بالشحن من السويد. قد يختلف توفر المنتجات ومدة التوصيل حسب المنطقة.",
        },
        authenticity: {
          title: "هل منتجاتكم أصلية",
          body: "نولي أولوية لقابلية التتبع ووضوح التوريد. يتم الحصول على الزيوت والسوبرفود من منتجين صغار في أفريقيا الاستوائية. يتم توريد الشاي عبر شركاء أوروبيين.",
        },
        contact: {
          title: "كيف يمكنني التواصل معكم",
          body: "راسلنا عبر admin@tropinord.com أو تواصل معنا عبر واتساب من أيقونة أسفل الصفحة.",
        },
      },
    },
    privacy: {
      header: {
        title: "سياسة الخصوصية",
        subtitle: "كيف نتعامل مع بياناتك.",
      },
      title: "سياسة الخصوصية",
      body: {
        p1: "نجمع فقط المعلومات اللازمة لتقديم خدماتنا، مثل تنفيذ الطلبات ودعم العملاء. نحن لا نبيع المعلومات الشخصية.",
        p2: "تُستخدم اشتراكات النشرة البريدية لإرسال تحديثات المنتجات وأخبار العلامة. يمكنك إلغاء الاشتراك في أي وقت.",
        p3: "للاستفسارات حول الخصوصية، تواصل عبر admin@tropinord.com.",
      },
    },
    footer: {
      brandLine:
        "بيت نباتي تشكل في السويد، ومتجذر في أصالة المناطق الاستوائية.",
      newsletterTitle: "النشرة البريدية",
      newsletterBody:
        "اشترك للحصول على إطلاقات المنتجات وتحديثات التوريد. للمساعدة: support@tropinord.com",
      trustLine: "دفع آمن • Stripe • Swish (يدوي)",
      faq: "الأسئلة الشائعة",
      privacy: "سياسة الخصوصية",
      madeIn: "مصمم في السويد • متجذر في المناطق الاستوائية",
      helpBody:
        "تواصل معنا عبر <whatsapp>واتساب</whatsapp> أو عبر البريد <email>support@tropinord.com</email>.",
      rightsReserved: "© {{year}} TropiNord. جميع الحقوق محفوظة.",
    },
    newsletter: {
      emailPlaceholder: "عنوان البريد الإلكتروني",
      subscribe: "اشترك",
      signingUp: "جارٍ الاشتراك…",
      subscribedTitle: "تم الاشتراك",
      subscribedDescription: "شكرًا! تمت إضافتك إلى النشرة البريدية.",
      errorTitle: "تعذر الاشتراك",
      errorDescription:
        "يرجى المحاولة لاحقًا أو التواصل عبر support@tropinord.com.",
    },
    errors: {
      genericTitle: "خطأ",
      genericDescription: "حدث خطأ ما. حاول مرة أخرى.",
      copyFailedTitle: "فشل النسخ",
      copyFailedDescription: "تعذر النسخ إلى الحافظة.",
      missingInfoTitle: "معلومات ناقصة",
      checkoutFailedTitle: "فشل الدفع",
      checkoutFailedDescription: "تعذر بدء الدفع. حاول مرة أخرى.",
      swishRequiresSekTitle: "Swish يتطلب SEK",
      swishRequiresSekDescription:
        "Swish متاح فقط لطلبات SEK. الرجاء اختيار SEK.",
      fullNameRequired: "الاسم الكامل مطلوب.",
      emailRequired: "البريد الإلكتروني مطلوب.",
      emailInvalid: "عنوان البريد الإلكتروني غير صالح.",
      streetRequired: "عنوان الشارع مطلوب.",
      cityRequired: "المدينة مطلوبة.",
      postalCodeRequired: "الرمز البريدي مطلوب.",
      countryRequired: "الدولة مطلوبة.",
    },
    checkout: {
      headerTitle: "الدفع",
      headerSubtitle: "تفاصيل الشحن وطريقة الدفع ودفع آمن.",
      emptyTitle: "سلة التسوق فارغة",
      emptyBody: "أضف بعض المنتجات إلى السلة قبل المتابعة.",
      continueShopping: "متابعة التسوق",
      contactTitle: "معلومات التواصل",
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phoneOptional: "الهاتف (اختياري)",
      phonePlaceholder: "+46 70 123 4567",
      shippingTitle: "عنوان الشحن",
      streetAddress: "عنوان الشارع",
      city: "المدينة",
      postalCode: "الرمز البريدي",
      country: "الدولة",
      paymentTitle: "طريقة الدفع",
      payCardTitle: "بطاقة (Stripe)",
      payCardBody: "دفع آمن عبر Stripe",
      paySwishTitle: "Swish (يدوي)",
      paySwishBody: "QR + مرجع (يؤكد بعد التحقق)",
      paySwishRequiresSek: "يتطلب SEK",
      payPaypalTitle: "PayPal",
      payPaypalBody: "تفعيل عبر Stripe (إن أمكن)",
      summaryTitle: "ملخص الطلب",
      qty: "الكمية",
      subtotal: "المجموع الفرعي",
      discounts: "الخصومات",
      shipping: "الشحن",
      total: "الإجمالي",
      starting: "جارٍ البدء…",
      showSwishQr: "عرض QR الخاص بـ Swish",
      payWithStripe: "الدفع عبر Stripe",
      swishHint: "ستحصل على رمز QR ومرجع لـ Swish.",
      stripeHint: "سيتم تحويلك إلى صفحة دفع Stripe الآمنة.",
      swishModalTitle: "الدفع عبر Swish",
      swishModalDescription:
        "امسح رمز QR في Swish أو استخدم الرقم + المرجع. سيتم تأكيد طلبك بعد التحقق.",
      amount: "المبلغ",
      swishNumber: "رقم Swish",
      reference: "المرجع",
      openSwish: "فتح Swish",
      afterPayHint:
        "بعد الدفع، سيبقى الطلب قيد الانتظار حتى يتم التحقق. إذا احتجت مساعدة، تواصل مع الدعم.",
      iHavePaid: "لقد دفعت",
      copiedTitle: "تم النسخ",
      copiedDescription: "تم نسخ {{label}} إلى الحافظة.",
      paymentPendingTitle: "الدفع قيد الانتظار",
      paymentPendingDescription: "شكرًا! سنؤكد دفع Swish قريبًا.",
    },

    home: {
      hero: {
        tagline: "أصول استوائية. انسجام عالمي.",
        explore: "استكشف",
        headline: "شاي وزيوت وسوبرفود من المناطق الاستوائية",
        subheadline:
          "قابل للتتبع رقميًا. مُستدام المصدر. تغذية استوائية فاخرة.",
        ourStory: "قصتنا",
      },
      tea: {
        ariaBrowse: "استعرض الشاي",
        heroAlt: "مجموعة شاي TropiNord",
        badge: "مصنوع تقليديًا",
        guideAlt: "دليل الشاي",
        title: "انقع الهدوء، وارتشف الصفاء",
        body: "أوراق كاملة. عطر صادق. طقس لا يُنسى.",
        cta: "استعرض الشاي",
      },
      oil: {
        ariaBrowse: "استعرض الزيوت",
        heroAlt: "مجموعة زيوت TropiNord",
        badge: "دفعات صغيرة",
        alt1: "زيوت معصورة على البارد",
        alt2: "زيت نوى النخيل للعناية بالشعر",
        title: "زيوت أصيلة من مصادر بدفعات صغيرة",
        p1: "يتم توريد زيوت TropiNord على شكل دفعات صغيرة من مزارعين محليين في مناطق استوائية من أفريقيا. ليست زيوتًا سلعية مُنتَجة بكميات ضخمة. بل زيوت تقليدية تُعصر وتُحضّر وتُتعامل معها بعناية لتحافظ على طابعها الطبيعي وأصالتها.",
        p2: "نُعطي الأولوية للعلاقات المباشرة وقابلية التتبع. كل دفعة تعكس أصلها: التربة والمناخ والأيدي التي صنعتها. ما يصلك زيت أصيل 100% مُنتَج محليًا، مُحضّر كما كان عبر الأجيال.",
      },
      superfoods: {
        ariaBrowse: "استعرض السوبرفود",
        heroAlt: "سوبرفود",
        badge: "محصودة تقليديًا",
        title: "سوبرفود بأصل حقيقي، لا مساحيق صناعية",
        p1: "تأتي سوبرفودنا من بيئاتها الأصلية في أفريقيا حيث استُخدمت عبر الأجيال. من أوراق المورينغا إلى فاكهة الباوباب وعسل الغابات الكثيف، نركز على الحصاد بكميات صغيرة للحفاظ على الجودة والنزاهة.",
        p2: "مكونات قليلة المعالجة: مجففة طبيعيًا، ومُتعامل معها بعناية، ومُحضّرة للحفاظ على قيمتها الغذائية الأصيلة. نختار الطرق التقليدية بدل الإنتاج الضخم لأن الأصالة مهمة.",
      },
      newsletter: {
        title: "ابقَ على اطلاع",
        success: "شكرًا! تم تسجيلك في القائمة.",
        placeholder: "أدخل بريدك الإلكتروني",
        cta: "اشترك",
      },
    },
    catalog: {
      title: "استكشاف المنتجات",
      subtitle: "اكتشف مجموعتنا من المنتجات المميزة",
      filterByCategory: "تصفية حسب الفئة",
      loadFailed: "فشل في تحميل المنتجات.",
      showingCount: "عرض {{count}} منتج",

      productDetailsTitle: "تفاصيل المنتج",
      productDetailsSubtitle: "تفاصيل المنتج وخيارات الشراء.",
      productDetailsLoadingSubtitle: "جارٍ تحميل معلومات المنتج.",
      productNotFoundTitle: "المنتج غير موجود",
      productNotFoundSubtitle: "تعذر العثور على هذا المنتج.",
      productNotFoundBody: "المنتج الذي تبحث عنه غير موجود أو تمت إزالته.",
      backToCatalog: "العودة إلى الكتالوج",

      inStockCount: "{{count}} متوفر في المخزون",
      outOfStock: "غير متوفر",
      comingSoon: "قريباً",

      ritualFriendly: "مناسب للطقوس",
      pairsWithHoney: "يتناسب مع العسل",
      slowBrew: "تخمير بطيء",

      ritualTitle: "أكمل طقس الشاي الخاص بك",
      ritualSubtitle: "إضافات بسيطة تعزز تجربتك.",
      ritualPicks: "اختيارات الطقوس",
      ritualPick: "اختيار مميز",
      ritualTip: "نصيحة: أضف عسل الغابة البري للحصول على كوب أكثر غنى.",

      youMayAlsoLike: "قد يعجبك أيضاً",

      teaHoneyPairingTitle: "مزيج الشاي والعسل",
      teaHoneyPairingBody:
        "كلا المنتجين في سلة التسوق. يمكن تفعيل خصومات الباقة عند الدفع.",

      addToCart: "أضف إلى السلة",
      added: "تمت الإضافة",
      maxInCart: "الحد الأقصى في السلة",
      unavailable: "غير متاح",

      // NEW: used by CategoryFilter + ProductSearch + ProductCard
      searchPlaceholder: "ابحث عن المنتجات…",
      clearSearch: "مسح البحث",
      onlyLeft: "متبقي {{count}} فقط",
      productFallbackTitle: "منتج",
      categories: {
        all: "كل المنتجات",
        tea: "شاي",
        oils: "زيوت",
        superfoods: "سوبرفود",
        others: "أخرى",
      },
    },
  },

  fr: {
    common: {
      language: "Langue",
      theme: "Thème",
      currency: "Devise",
      currencyHint: "Le choix de devise est enregistré sur cet appareil.",
      loading: "Chargement…",
      close: "Fermer",
      copy: "Copier",
      backToShop: "Retour à la boutique",
      free: "Gratuit",
      included: "Inclus",
      includesFreeTeaBagsTitle: "Inclut des infuseurs à thé réutilisables",
      includesFreeTeaBagsBody:
        "Chaque commande de thé inclut un paquet de 10 infuseurs à thé réutilisables.",
      teaBagsLabel: "Infuseurs à thé réutilisables (paquet de 10)",
    },
    currencies: {
      SEK: "Couronne suédoise (SEK)",
      EUR: "Euro (EUR)",
      USD: "Dollar américain (USD)",
      GBP: "Livre sterling (GBP)",
      NOK: "Couronne norvégienne (NOK)",
      DKK: "Couronne danoise (DKK)",
      CHF: "Franc suisse (CHF)",
      KES: "Shilling kényan (KES)",
      TZS: "Shilling tanzanien (TZS)",
      UGX: "Shilling ougandais (UGX)",
    },
    nav: {
      menu: "Menu",
      home: "Accueil",
      catalog: "Catalogue",
      about: "À propos",
      story: "Notre histoire",
      orders: "Commandes",
      converter: "Convertisseur de devises",
      account: "Compte",
      language: "Langue",
    },
    about: {
      headerTitle: "À propos",
      headerSubtitle:
        "Un raffinement européen discret, ancré dans l’authenticité tropicale.",

      hero: {
        kicker: "Bien-être premium  Commerce éthique  Botanique héritée",
        title:
          "TropiNord est une maison botanique d’inspiration nordique, avec une profondeur tropicale.",
        body: "Basée en Suède, TropiNord sélectionne des huiles, des thés et des superaliments avec un accent sur la traçabilité, la manipulation soigneuse et un design apaisé. Nous combinons la précision nordique avec la profondeur culturelle des ingrédients tropicaux, en choisissant des produits qui semblent purs, intentionnels et dignes d’un rituel quotidien.",
      },

      brandStory: {
        title: "Histoire de la marque",
        p1: "Notre histoire commence avec la conviction que le bien-être doit relier les personnes à la nature, à l’héritage et à la sagesse qui les soutient. Né en Suède, TropiNord associe la précision nordique à l’innovation tropicale pour créer des produits naturels qui nourrissent, restaurent et protègent.",
        p2: "Nous construisons une marque de niche premium avec une croissance maîtrisée, en privilégiant l’artisanat et la clarté de l’approvisionnement. Chaque produit est choisi pour sa pureté, ses performances et une origine explicable sans bruit marketing.",
      },

      transparency: {
        title: "Transparence de l’approvisionnement",
        body: "Les huiles et superaliments proviennent de petits producteurs dans les régions tropicales d’Afrique. Les thés sont actuellement fournis via des partenaires européens qui s’approvisionnent en Afrique, choisis pour leur fiabilité et leur conformité, le temps de bâtir une logistique directe. Nous indiquerons toujours ce que nous savons, ce que nous pouvons vérifier et comment chaque catégorie est sourcée.",
      },

      whatWeDo: {
        title: "Ce que nous faisons",
        cards: {
          traceable: {
            title: "Produits sélectionnés à l’origine traçable",
            body: "Nous sélectionnons des huiles, des thés et des superaliments qui peuvent être expliqués par leur origine, leur traitement et leur intégrité.",
          },
          ethical: {
            title: "Partenariats éthiques",
            body: "Nous travaillons avec de petits producteurs et des partenaires de confiance, en mettant l’accent sur un échange de valeur équitable et la clarté.",
          },
          design: {
            title: "Contrôle qualité et design apaisé",
            body: "Le design nordique, c’est la retenue. Nous gardons la marque discrète, structurée et premium, pour laisser le produit parler.",
          },
          platform: {
            title: "Une plateforme construite pour la confiance",
            body: "Nous construisons des systèmes pour la transparence, la clarté produit et une expérience client premium.",
          },
        },
      },

      mission: {
        title: "Notre mission",
        p1: "Raffiner le bien-être naturel grâce à l’intégrité, un approvisionnement responsable et la précision nordique, en créant des produits aussi éthiques qu’agréables à utiliser.",
        tagline:
          "TropiNord. Là où la tradition rencontre la technologie pour le bien-être naturel.",
      },

      contact: {
        title: "Contact",
        bodyPrefix:
          "Pour les partenariats, l’approvisionnement ou le support, contactez",
      },
    },
    cart: {
      title: "Panier",
      bundleApplied: "Pack appliqué",
      teaHoneyLabel: "Pack Thé + Miel (10% sur le miel)",
      emptyTitle: "Votre panier est vide",
      emptyBody: "Ajoutez des produits pour commencer",
      subtotal: "Sous-total",
      discounts: "Réductions",
      total: "Total",
      save: "Économisez",
      proceedToCheckout: "Passer au paiement",
      clearCart: "Vider le panier",
      productFallbackTitle: "Produit",
      decreaseQty: "Diminuer la quantité",
      increaseQty: "Augmenter la quantité",
      removeItem: "Retirer",
      continueShopping: "Continuer vos achats",
    },
    story: {
      header: {
        title: "Notre histoire",
        subtitle:
          "Une maison botanique, sobrement nordique et profondément tropicale.",
      },

      hero: {
        kicker: "Maison botanique  Commerce éthique  Savoir-faire hérité",
        title:
          "Un pont vivant entre les continents, construit avec retenue et responsabilité.",
        body: "TropiNord existe pour protéger l’origine. Nous privilégions la traçabilité, la manipulation soigneuse et un design apaisé, afin que ce qui arrive chez vous porte encore le lieu d’où il vient.",
        founderLine: "Fondé par Paul Abejegah.",
      },

      quote: "L’authenticité se préserve lorsque l’origine est respectée.",

      why: {
        title: "Pourquoi TropiNord existe",
        p1: "Notre histoire commence avec la conviction que le bien-être doit relier les personnes à la nature, à l’héritage et à la sagesse qui les soutient. Né en Suède, TropiNord associe la précision nordique à l’innovation tropicale pour créer des produits naturels qui nourrissent, restaurent et protègent.",
        p2: "Le projet est façonné par une expérience vécue à travers continents et climats. Il est construit avec un raffinement européen discret et un profond respect pour l’artisanat tropical et les savoirs communautaires.",
      },

      transparency: {
        title: "Déclaration de transparence d’approvisionnement",
        body: "Les huiles et superaliments proviennent de petits producteurs des régions tropicales d’Afrique, avec un accent sur la manipulation soigneuse, la traçabilité et un échange de valeur équitable. Les thés sont actuellement fournis via des partenaires européens sourçant en Afrique, choisis pour le contrôle qualité et la conformité, le temps de bâtir une logistique directe. Chaque page produit indique ce que nous pouvons vérifier et comment l’approvisionnement a été réalisé.",
      },

      sections: {
        oils: {
          title: "Nos huiles",
          body: "Nos huiles ne sont pas des commodités produites en masse. Elles sont élaborées en petites séries selon des méthodes traditionnelles, souvent pressées à froid ou doucement raffinées. Cela préserve le caractère, l’arôme, la texture et les performances que le traitement industriel efface souvent.",
        },
        superfoods: {
          title: "Nos superaliments",
          body: "Nos superaliments sont récoltés en petites quantités et peu transformés pour préserver leur intégrité. Du moringa au baobab en passant par le miel de forêt épais, nous privilégions l’authenticité, la manipulation soigneuse et le respect des communautés qui les produisent.",
        },
      },

      founder: {
        kicker: "Fondateur",
        name: "Paul Abejegah",
        photoAlt: "Paul Abejegah",
      },

      principles: {
        kicker: "Principes",
        items: [
          "Origine traçable et approvisionnement honnête",
          "Petites séries, pas d’anonymat industriel",
          "Retenue du design, intention premium",
          "Respect du savoir-faire, des personnes et des lieux",
        ],
      },

      sourcing: {
        kicker: "Transparence d’approvisionnement",
        title: "Carte d’approvisionnement",
        body: "Une vue simplifiée des origines et des partenariats. Les huiles et superaliments proviennent de petits producteurs en Afrique tropicale. Les thés sont actuellement fournis via des partenaires européens sourçant en Afrique, choisis pour leur constance et conformité, pendant que nous construisons une logistique directe.",
        map: {
          sweden: "Suède",
          euPartners: "Partenaires européens",
          westAfrica: "Afrique de l’Ouest",
          nigeria: "Nigeria",
          eastAfrica: "Afrique de l’Est",
        },
        cards: {
          oils: {
            title: "Huiles",
            body: "Approvisionnement en petites séries avec des producteurs locaux, méthodes traditionnelles et manipulation soigneuse.",
          },
          superfoods: {
            title: "Superaliments",
            body: "Récoltés en petites quantités et peu transformés pour préserver intégrité et authenticité.",
          },
          teas: {
            title: "Thés",
            body: "Sourcés via des partenaires européens en Afrique, choisis pour le contrôle qualité pendant la montée en puissance logistique.",
          },
        },
      },

      closing: {
        title: "L’authenticité n’est pas une tendance. C’est notre standard.",
        currentLanguage: "Langue actuelle :",
      },
    },
    faq: {
      header: {
        title: "FAQ",
        subtitle: "Réponses aux questions fréquentes.",
      },
      title: "Questions fréquentes",
      questions: {
        shipping: {
          title: "D’où expédiez-vous",
          body: "Nous expédions depuis la Suède. La disponibilité des produits et les délais de livraison peuvent varier selon la région.",
        },
        authenticity: {
          title: "Vos produits sont-ils authentiques",
          body: "Nous privilégions la traçabilité et la clarté d’approvisionnement. Les huiles et superaliments proviennent de petits producteurs en Afrique tropicale. Les thés sont actuellement fournis via des partenaires européens.",
        },
        contact: {
          title: "Comment vous contacter",
          body: "Envoyez un e-mail à admin@tropinord.com ou contactez-nous via WhatsApp depuis l’icône en pied de page.",
        },
      },
    },
    privacy: {
      header: {
        title: "Politique de confidentialité",
        subtitle: "Comment nous traitons vos données.",
      },
      title: "Politique de confidentialité",
      body: {
        p1: "Nous collectons uniquement les informations nécessaires pour fournir nos services, comme l’exécution des commandes et le support client. Nous ne vendons pas d’informations personnelles.",
        p2: "Les inscriptions à la newsletter servent à envoyer des mises à jour produits et des actualités de la marque. Vous pouvez vous désinscrire à tout moment.",
        p3: "Pour toute question relative à la confidentialité, contactez admin@tropinord.com.",
      },
    },
    footer: {
      brandLine:
        "Une maison botanique façonnée en Suède, ancrée dans l’authenticité tropicale.",
      newsletterTitle: "Newsletter",
      newsletterBody:
        "Abonnez-vous pour les nouveautés et les mises à jour. Besoin d’aide ? Écrivez à support@tropinord.com.",
      trustLine: "Paiement sécurisé • Stripe • Swish (manuel)",
      faq: "FAQ",
      privacy: "Politique de confidentialité",
      madeIn: "Conçu en Suède • Ancré sous les tropiques",
      helpBody:
        "Contactez-nous sur <whatsapp>WhatsApp</whatsapp> ou par e-mail <email>support@tropinord.com</email>.",
      rightsReserved: "© {{year}} TropiNord. Tous droits réservés.",
    },
    newsletter: {
      emailPlaceholder: "Adresse e-mail",
      subscribe: "S’abonner",
      signingUp: "Inscription…",
      subscribedTitle: "Abonné",
      subscribedDescription: "Merci ! Vous avez été ajouté à la newsletter.",
      errorTitle: "Impossible de s’abonner",
      errorDescription:
        "Veuillez réessayer plus tard ou contacter support@tropinord.com.",
    },
    errors: {
      genericTitle: "Erreur",
      genericDescription: "Une erreur est survenue. Veuillez réessayer.",
      copyFailedTitle: "Copie échouée",
      copyFailedDescription: "Impossible de copier dans le presse-papiers.",
      missingInfoTitle: "Informations manquantes",
      checkoutFailedTitle: "Paiement échoué",
      checkoutFailedDescription:
        "Nous n’avons pas pu démarrer le paiement. Veuillez réessayer.",
      swishRequiresSekTitle: "Swish nécessite SEK",
      swishRequiresSekDescription:
        "Swish n’est disponible que pour les commandes en SEK. Veuillez choisir SEK.",
      fullNameRequired: "Le nom complet est requis.",
      emailRequired: "L’e-mail est requis.",
      emailInvalid: "Adresse e-mail invalide.",
      streetRequired: "L’adresse est requise.",
      cityRequired: "La ville est requise.",
      postalCodeRequired: "Le code postal est requis.",
      countryRequired: "Le pays est requis.",
    },
    checkout: {
      headerTitle: "Paiement",
      headerSubtitle:
        "Coordonnées de livraison, mode de paiement et paiement sécurisé.",
      emptyTitle: "Votre panier est vide",
      emptyBody: "Ajoutez des produits à votre panier avant de payer.",
      continueShopping: "Continuer vos achats",
      contactTitle: "Informations de contact",
      fullName: "Nom complet",
      email: "E-mail",
      phoneOptional: "Téléphone (facultatif)",
      phonePlaceholder: "+46 70 123 4567",
      shippingTitle: "Adresse de livraison",
      streetAddress: "Adresse",
      city: "Ville",
      postalCode: "Code postal",
      country: "Pays",
      paymentTitle: "Mode de paiement",
      payCardTitle: "Carte (Stripe)",
      payCardBody: "Paiement Stripe sécurisé",
      paySwishTitle: "Swish (manuel)",
      paySwishBody: "QR + référence (confirmé après vérification)",
      paySwishRequiresSek: "Nécessite la devise SEK",
      payPaypalTitle: "PayPal",
      payPaypalBody: "Activer via Stripe (si éligible)",
      summaryTitle: "Récapitulatif",
      qty: "Qté",
      subtotal: "Sous-total",
      discounts: "Réductions",
      shipping: "Livraison",
      total: "Total",
      starting: "Démarrage…",
      showSwishQr: "Afficher le QR Swish",
      payWithStripe: "Payer avec Stripe",
      swishHint: "Vous recevrez un QR code et une référence pour Swish.",
      stripeHint: "Vous serez redirigé vers le paiement sécurisé Stripe.",
      swishModalTitle: "Payer avec Swish",
      swishModalDescription:
        "Scannez le QR code dans Swish ou utilisez le numéro + la référence. Votre commande sera confirmée après vérification.",
      amount: "Montant",
      swishNumber: "Numéro Swish",
      reference: "Référence",
      openSwish: "Ouvrir Swish",
      afterPayHint:
        "Après paiement, votre commande restera en attente jusqu’à vérification. Besoin d’aide ? Contactez le support.",
      iHavePaid: "J’ai payé",
      copiedTitle: "Copié",
      copiedDescription: "{{label}} copié dans le presse-papiers.",
      paymentPendingTitle: "Paiement en attente",
      paymentPendingDescription:
        "Merci ! Nous confirmerons votre paiement Swish prochainement.",
    },
    home: {
      hero: {
        tagline: "Origines tropicales. Harmonie mondiale.",
        explore: "Explorer",
        headline: "Thés, huiles & superaliments des tropiques",
        subheadline:
          "Traçable numériquement. Approvisionnement durable. Nutrition tropicale premium.",
        ourStory: "Notre histoire",
      },
      tea: {
        ariaBrowse: "Découvrir les thés",
        heroAlt: "Collection de thés TropiNord",
        badge: "Fabriqué traditionnellement",
        guideAlt: "Guide du thé",
        title: "Infusez le calme, savourez la clarté",
        body: "Feuilles entières. Arôme sincère. Un rituel inoubliable.",
        cta: "Découvrir les thés",
      },
      oil: {
        ariaBrowse: "Découvrir les huiles",
        heroAlt: "Collection d’huiles TropiNord",
        badge: "Petites séries",
        alt1: "Huiles pressées à froid",
        alt2: "Huile de palmiste pour les cheveux",
        title: "Des huiles authentiques, en petites quantités",
        p1: "Les huiles TropiNord proviennent de petites séries auprès d’agriculteurs locaux dans les régions tropicales d’Afrique. Ce ne sont pas des huiles de commodité produites en masse. Elles sont élaborées traditionnellement, pressées et manipulées avec soin pour préserver leur caractère naturel et leur authenticité.",
        p2: "Nous privilégions les relations directes et la traçabilité. Chaque lot reflète son origine : le sol, le climat et les mains derrière. Vous recevez une huile 100% authentique, produite localement, préparée comme depuis des générations.",
      },
      superfoods: {
        ariaBrowse: "Découvrir les superaliments",
        heroAlt: "Superaliments",
        badge: "Récolté traditionnellement",
        title:
          "Des superaliments d’origine réelle, pas des poudres industrielles",
        p1: "Nos superaliments proviennent de leurs environnements natifs en Afrique, utilisés depuis des générations. Des feuilles de moringa au fruit de baobab et au miel de forêt épais, nous privilégions une récolte en petite quantité pour préserver qualité et intégrité.",
        p2: "Des ingrédients peu transformés : séchés naturellement, manipulés avec soin, et préparés pour conserver un profil nutritionnel authentique. Nous choisissons des méthodes traditionnelles plutôt que la production de masse, car l’authenticité compte.",
      },
      newsletter: {
        title: "Restez informé",
        success: "Merci ! Vous êtes inscrit.",
        placeholder: "Saisissez votre e-mail",
        cta: "S’abonner",
      },
    },
    catalog: {
      title: "Explorer les produits",
      subtitle: "Découvrez notre sélection de produits premium",
      filterByCategory: "Filtrer par catégorie",
      loadFailed: "Échec du chargement des produits.",
      showingCount: "{{count}} produits affichés",

      productDetailsTitle: "Détails du produit",
      productDetailsSubtitle: "Détails du produit et options d'achat.",
      productDetailsLoadingSubtitle: "Chargement des informations du produit.",
      productNotFoundTitle: "Produit introuvable",
      productNotFoundSubtitle: "Ce produit est introuvable.",
      productNotFoundBody:
        "Le produit que vous recherchez n'existe pas ou a été supprimé.",
      backToCatalog: "Retour au catalogue",

      inStockCount: "{{count}} en stock",
      outOfStock: "Rupture de stock",
      comingSoon: "Bientôt disponible",

      ritualFriendly: "Adapté au rituel",
      pairsWithHoney: "Se marie avec le miel",
      slowBrew: "Infusion lente",

      ritualTitle: "Complétez votre rituel du thé",
      ritualSubtitle: "Des compagnons simples qui subliment votre tasse.",
      ritualPicks: "Sélection rituelle",
      ritualPick: "Choix rituel",
      ritualTip:
        "Astuce : Ajoutez du miel de forêt sauvage pour une tasse plus riche.",

      youMayAlsoLike: "Vous pourriez aussi aimer",

      teaHoneyPairingTitle: "Association Thé + Miel",
      teaHoneyPairingBody:
        "Les deux articles sont dans votre panier. Les remises groupées peuvent être activées au paiement.",

      addToCart: "Ajouter au panier",
      added: "Ajouté",
      maxInCart: "Quantité maximale atteinte",
      unavailable: "Indisponible",

      // NEW: used by CategoryFilter + ProductSearch + ProductCard
      searchPlaceholder: "Rechercher des produits…",
      clearSearch: "Effacer la recherche",
      onlyLeft: "Plus que {{count}}",
      productFallbackTitle: "Produit",
      categories: {
        all: "Tous les produits",
        tea: "Thé",
        oils: "Huiles",
        superfoods: "Superaliments",
        others: "Autre",
      },
    },
  },

  de: {
    common: {
      language: "Sprache",
      theme: "Design",
      currency: "Währung",
      currencyHint: "Die Währungsauswahl wird auf diesem Gerät gespeichert.",
      loading: "Lädt…",
      close: "Schließen",
      copy: "Kopieren",
      backToShop: "Zurück zum Shop",
      free: "Kostenlos",
      included: "Inklusive",
      includesFreeTeaBagsTitle: "Enthält wiederverwendbare Teebeutel",
      includesFreeTeaBagsBody:
        "Jede Teebestellung enthält ein Paket mit 10 wiederverwendbaren Teebeuteln.",
      teaBagsLabel: "Wiederverwendbare Teebeutel (Paket mit 10)",
    },
    currencies: {
      SEK: "Schwedische Krone (SEK)",
      EUR: "Euro (EUR)",
      USD: "US-Dollar (USD)",
      GBP: "Britisches Pfund (GBP)",
      NOK: "Norwegische Krone (NOK)",
      DKK: "Dänische Krone (DKK)",
      CHF: "Schweizer Franken (CHF)",
      KES: "Kenia-Schilling (KES)",
      TZS: "Tansania-Schilling (TZS)",
      UGX: "Uganda-Schilling (UGX)",
    },
    nav: {
      menu: "Menü",
      home: "Start",
      catalog: "Katalog",
      about: "Über uns",
      story: "Unsere Geschichte",
      orders: "Bestellungen",
      converter: "Währungsrechner",
      account: "Konto",
      language: "Sprache",
    },
    about: {
      headerTitle: "Über uns",
      headerSubtitle:
        "Stille europäische Raffinesse – verwurzelt in tropischer Authentizität.",

      hero: {
        kicker: "Premium Wellness  Ethischer Handel  Botanisches Erbe",
        title:
          "TropiNord ist ein nordisch geführtes botanisches Haus mit tropischer Tiefe.",
        body: "Mit Sitz in Schweden kuratiert TropiNord Öle, Tees und Superfoods mit Fokus auf Rückverfolgbarkeit, sorgfältige Handhabung und ruhiges Design. Wir verbinden nordische Präzision mit der kulturellen Tiefe tropischer Zutaten und wählen Produkte, die rein, bewusst und eines täglichen Rituals würdig wirken.",
      },

      brandStory: {
        title: "Markengeschichte",
        p1: "Unsere Geschichte beginnt mit dem Glauben, dass Wellness Menschen mit Natur, Herkunft und dem Wissen verbinden sollte, das beides trägt. In Schweden geboren, vereint TropiNord nordische Präzision mit tropischer Innovation und schafft natürliche Produkte, die nähren, stärken und schützen.",
        p2: "Wir bauen eine Premium-Nischenmarke mit kontrolliertem Wachstum auf und priorisieren Handwerkskunst und klare Herkunft. Jedes Produkt wird nach Reinheit, Wirkung und nachvollziehbarer Herkunft ausgewählt – ohne Marketinglärm.",
      },

      transparency: {
        title: "Transparenz bei der Herkunft",
        body: "Öle und Superfoods stammen von kleinen Produzenten in tropischen Regionen Afrikas. Tees werden derzeit über europäische Partner bezogen, die in Afrika sourcen – ausgewählt für Zuverlässigkeit und Compliance, während wir direkte Logistik aufbauen. Wir sagen stets, was wir wissen, was wir verifizieren können und wie jede Kategorie bezogen wird.",
      },

      whatWeDo: {
        title: "Was wir tun",
        cards: {
          traceable: {
            title: "Kuratiertes Sortiment mit nachvollziehbarer Herkunft",
            body: "Wir kuratieren Öle, Tees und Superfoods, die sich durch Herkunft, Handhabung und Integrität erklären lassen.",
          },
          ethical: {
            title: "Ethische Partnerschaften",
            body: "Wir arbeiten mit kleinen Produzenten und vertrauenswürdigen Partnern – mit Fokus auf fairen Wert und Transparenz.",
          },
          design: {
            title: "Qualitätssicherung und ruhiges Design",
            body: "Nordisches Design ist Zurückhaltung. Wir halten die Marke leise, strukturiert und premium – damit das Produkt spricht.",
          },
          platform: {
            title: "Eine Plattform, die auf Vertrauen baut",
            body: "Wir bauen Systeme für Transparenz, Produktklarheit und ein Premium-Kundenerlebnis.",
          },
        },
      },

      mission: {
        title: "Unsere Mission",
        p1: "Natürliche Wellness durch Integrität, verantwortungsvolles Sourcing und nordische Präzision zu veredeln – mit Produkten, die sich ethisch so gut anfühlen wie physisch.",
        tagline:
          "TropiNord. Wo Tradition und Technologie für natürliches Wohlbefinden zusammenkommen.",
      },

      contact: {
        title: "Kontakt",
        bodyPrefix:
          "Für Partnerschaften, Sourcing oder Support kontaktieren Sie",
      },
    },
    cart: {
      title: "Warenkorb",
      bundleApplied: "Bundle angewendet",
      teaHoneyLabel: "Tee + Honig Bundle (10% auf Honig)",
      emptyTitle: "Ihr Warenkorb ist leer",
      emptyBody: "Fügen Sie Produkte hinzu, um zu starten",
      subtotal: "Zwischensumme",
      discounts: "Rabatte",
      total: "Gesamt",
      save: "Sparen",
      proceedToCheckout: "Zur Kasse",
      clearCart: "Warenkorb leeren",
      productFallbackTitle: "Produkt",
      decreaseQty: "Menge verringern",
      increaseQty: "Menge erhöhen",
      removeItem: "Entfernen",
      continueShopping: "Einkauf fortsetzen",
    },
    story: {
      header: {
        title: "Unsere Geschichte",
        subtitle:
          "Ein botanisches Haus mit nordischer Zurückhaltung und tropischer Tiefe.",
      },

      hero: {
        kicker: "Botanisches Haus  Ethischer Handel  Handwerkskultur",
        title:
          "Eine lebendige Brücke zwischen Kontinenten — gebaut mit Zurückhaltung und Verantwortung.",
        body: "TropiNord existiert, um Ursprung zu schützen. Wir setzen auf Rückverfolgbarkeit, sorgfältige Handhabung und ruhiges Design, damit das, was bei dir ankommt, den Ort seiner Herkunft bewahrt.",
        founderLine: "Gegründet von Paul Abejegah.",
      },

      quote: "Authentizität bleibt erhalten, wenn Herkunft respektiert wird.",

      why: {
        title: "Warum TropiNord existiert",
        p1: "Unsere Geschichte beginnt mit dem Glauben, dass Wellness Menschen mit Natur, Herkunft und dem Wissen verbinden sollte, das beides trägt. In Schweden geboren, vereint TropiNord nordische Präzision mit tropischer Innovation und schafft natürliche Produkte, die nähren, erneuern und schützen.",
        p2: "Das Projekt ist geprägt von gelebter Erfahrung über Kontinente und Klimazonen hinweg. Es ist gebaut mit stiller europäischer Raffinesse und tiefem Respekt für tropisches Handwerk und lokales Wissen.",
      },

      transparency: {
        title: "Transparenz-Erklärung zur Herkunft",
        body: "Öle und Superfoods stammen von kleinbäuerlichen Produzenten in tropischen Regionen Afrikas, mit Fokus auf sorgfältige Handhabung, Rückverfolgbarkeit und fairen Werttausch. Tees werden derzeit über europäische Partner bezogen, die in Afrika sourcen — ausgewählt für Qualitätskontrolle und Compliance, während wir direkte Logistik aufbauen. Jede Produktseite zeigt, was wir verifizieren können und wie die Beschaffung erfolgt.",
      },

      sections: {
        oils: {
          title: "Unsere Öle",
          body: "Unsere Öle sind keine massenproduzierten Rohstoffwaren. Sie werden in kleinen Chargen mit traditionellen Methoden hergestellt, oft kaltgepresst oder sanft veredelt. Das bewahrt Charakter, Aroma, Textur und Wirkung, die industrielle Verarbeitung häufig entfernt.",
        },
        superfoods: {
          title: "Unsere Superfoods",
          body: "Unsere Superfoods werden in kleinen Mengen geerntet und minimal verarbeitet, um Integrität zu bewahren. Von Moringa und Baobab bis zu dickem Waldhonig: Wir priorisieren Authentizität, sorgfältige Handhabung und Respekt für die Communities, die sie produzieren.",
        },
      },

      founder: {
        kicker: "Gründer",
        name: "Paul Abejegah",
        photoAlt: "Paul Abejegah",
      },

      principles: {
        kicker: "Prinzipien",
        items: [
          "Rückverfolgbare Herkunft und ehrliches Sourcing",
          "Kleine Chargen statt industrieller Anonymität",
          "Design-Zurückhaltung mit Premium-Anspruch",
          "Respekt für Handwerk, Menschen und Ort",
        ],
      },

      sourcing: {
        kicker: "Transparenz bei der Herkunft",
        title: "Herkunftskarte",
        body: "Eine vereinfachte Sicht auf Ursprung und Partnerschaften. Öle und Superfoods werden über kleine Produzenten im tropischen Afrika bezogen. Tees werden derzeit über europäische Partner bezogen, die in Afrika sourcen — ausgewählt für Konsistenz und Compliance, während wir direkte Logistik aufbauen.",
        map: {
          sweden: "Schweden",
          euPartners: "Europäische Partner",
          westAfrica: "Westafrika",
          nigeria: "Nigeria",
          eastAfrica: "Ostafrika",
        },
        cards: {
          oils: {
            title: "Öle",
            body: "Kleine Chargen mit lokalen Produzenten, traditionelle Methoden und sorgfältige Handhabung.",
          },
          superfoods: {
            title: "Superfoods",
            body: "In kleinen Mengen geerntet und minimal verarbeitet — für Integrität und Authentizität.",
          },
          teas: {
            title: "Tees",
            body: "Über europäische Partner in Afrika bezogen, ausgewählt für Qualitätskontrolle während wir Logistik skalieren.",
          },
        },
      },

      closing: {
        title: "Authentizität ist kein Trend. Sie ist unser Standard.",
        currentLanguage: "Aktuelle Sprache:",
      },
    },
    faq: {
      header: {
        title: "FAQ",
        subtitle: "Antworten auf häufige Fragen.",
      },
      title: "Häufig gestellte Fragen",
      questions: {
        shipping: {
          title: "Von wo versenden Sie",
          body: "Wir versenden aus Schweden. Produktverfügbarkeit und Lieferzeiten können je nach Region variieren.",
        },
        authenticity: {
          title: "Sind Ihre Produkte authentisch",
          body: "Wir legen Wert auf Rückverfolgbarkeit und transparente Herkunft. Öle und Superfoods stammen von kleinen Produzenten in tropischem Afrika. Tees werden derzeit über europäische Partner bezogen.",
        },
        contact: {
          title: "Wie kann ich Sie kontaktieren",
          body: "Schreiben Sie an admin@tropinord.com oder kontaktieren Sie uns über das WhatsApp-Symbol im Footer.",
        },
      },
    },
    privacy: {
      header: {
        title: "Datenschutzerklärung",
        subtitle: "So gehen wir mit deinen Daten um.",
      },
      title: "Datenschutzerklärung",
      body: {
        p1: "Wir erfassen nur die Informationen, die zur Bereitstellung unserer Dienste erforderlich sind, z. B. zur Bestellabwicklung und für den Kundensupport. Wir verkaufen keine personenbezogenen Daten.",
        p2: "Newsletter-Anmeldungen werden genutzt, um Produktupdates und Neuigkeiten zu senden. Du kannst dich jederzeit abmelden.",
        p3: "Bei Fragen zum Datenschutz: admin@tropinord.com.",
      },
    },
    footer: {
      brandLine:
        "Ein botanisches Haus, in Schweden geformt und in tropischer Authentizität verwurzelt.",
      newsletterTitle: "Newsletter",
      newsletterBody:
        "Abonnieren Sie Produkt-Drops und Updates. Hilfe? support@tropinord.com",
      trustLine: "Sicherer Checkout • Stripe • Swish (manuell)",
      faq: "FAQ",
      privacy: "Datenschutzerklärung",
      madeIn: "In Schweden gestaltet • In den Tropen verwurzelt",
      helpBody:
        "Erreichen Sie uns über <whatsapp>WhatsApp</whatsapp> oder per E-Mail <email>support@tropinord.com</email>.",
      rightsReserved: "© {{year}} TropiNord. Alle Rechte vorbehalten.",
    },
    newsletter: {
      emailPlaceholder: "E-Mail-Adresse",
      subscribe: "Abonnieren",
      signingUp: "Wird angemeldet…",
      subscribedTitle: "Abonniert",
      subscribedDescription: "Danke! Sie wurden zum Newsletter hinzugefügt.",
      errorTitle: "Abonnement nicht möglich",
      errorDescription:
        "Bitte später erneut versuchen oder support@tropinord.com kontaktieren.",
    },
    errors: {
      genericTitle: "Fehler",
      genericDescription: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
      copyFailedTitle: "Kopieren fehlgeschlagen",
      copyFailedDescription: "Konnte nicht in die Zwischenablage kopieren.",
      missingInfoTitle: "Fehlende Angaben",
      checkoutFailedTitle: "Checkout fehlgeschlagen",
      checkoutFailedDescription:
        "Wir konnten die Zahlung nicht starten. Bitte erneut versuchen.",
      swishRequiresSekTitle: "Swish erfordert SEK",
      swishRequiresSekDescription:
        "Swish ist nur für Bestellungen in SEK verfügbar. Bitte SEK wählen.",
      fullNameRequired: "Vollständiger Name ist erforderlich.",
      emailRequired: "E-Mail ist erforderlich.",
      emailInvalid: "Ungültige E-Mail-Adresse.",
      streetRequired: "Straße ist erforderlich.",
      cityRequired: "Stadt ist erforderlich.",
      postalCodeRequired: "Postleitzahl ist erforderlich.",
      countryRequired: "Land ist erforderlich.",
    },
    checkout: {
      headerTitle: "Checkout",
      headerSubtitle: "Lieferdaten, Zahlungsart und sichere Zahlung.",
      emptyTitle: "Ihr Warenkorb ist leer",
      emptyBody: "Fügen Sie Produkte hinzu, bevor Sie zur Kasse gehen.",
      continueShopping: "Weiter einkaufen",
      contactTitle: "Kontaktinformationen",
      fullName: "Vollständiger Name",
      email: "E-Mail",
      phoneOptional: "Telefon (optional)",
      phonePlaceholder: "+46 70 123 4567",
      shippingTitle: "Lieferadresse",
      streetAddress: "Straße und Hausnummer",
      city: "Stadt",
      postalCode: "Postleitzahl",
      country: "Land",
      paymentTitle: "Zahlungsart",
      payCardTitle: "Karte (Stripe)",
      payCardBody: "Sicherer Stripe Checkout",
      paySwishTitle: "Swish (manuell)",
      paySwishBody: "QR + Referenz (Bestätigung nach Prüfung)",
      paySwishRequiresSek: "Erfordert SEK",
      payPaypalTitle: "PayPal",
      payPaypalBody: "Über Stripe aktivieren (wenn verfügbar)",
      summaryTitle: "Bestellübersicht",
      qty: "Menge",
      subtotal: "Zwischensumme",
      discounts: "Rabatte",
      shipping: "Versand",
      total: "Gesamt",
      starting: "Startet…",
      showSwishQr: "Swish-QR anzeigen",
      payWithStripe: "Mit Stripe zahlen",
      swishHint: "Sie erhalten einen QR-Code und eine Referenz für Swish.",
      stripeHint: "Sie werden zu Stripes sicherem Checkout weitergeleitet.",
      swishModalTitle: "Mit Swish zahlen",
      swishModalDescription:
        "Scannen Sie den QR-Code in Swish oder verwenden Sie Nummer + Referenz. Ihre Bestellung wird nach Prüfung bestätigt.",
      amount: "Betrag",
      swishNumber: "Swish-Nummer",
      reference: "Referenz",
      openSwish: "Swish öffnen",
      afterPayHint:
        "Nach der Zahlung bleibt die Bestellung bis zur Prüfung ausstehend. Bei Fragen kontaktieren Sie den Support.",
      iHavePaid: "Ich habe bezahlt",
      copiedTitle: "Kopiert",
      copiedDescription: "{{label}} wurde kopiert.",
      paymentPendingTitle: "Zahlung ausstehend",
      paymentPendingDescription:
        "Danke! Wir bestätigen Ihre Swish-Zahlung in Kürze.",
    },
    home: {
      hero: {
        tagline: "Tropische Ursprünge. Globale Harmonie.",
        explore: "Entdecken",
        headline: "Tees, Öle & Superfoods aus den Tropen",
        subheadline:
          "Digital rückverfolgbar. Nachhaltig bezogen. Premium-Tropennahrung.",
        ourStory: "Unsere Geschichte",
      },
      tea: {
        ariaBrowse: "Tees entdecken",
        heroAlt: "TropiNord Tee-Kollektion",
        badge: "Traditionell hergestellt",
        guideAlt: "Tee-Guide",
        title: "Ruhe aufgießen, Klarheit genießen",
        body: "Ganze Blätter. Ehrliches Aroma. Ein Ritual, das bleibt.",
        cta: "Tees entdecken",
      },
      oil: {
        ariaBrowse: "Öle entdecken",
        heroAlt: "TropiNord Öl-Kollektion",
        badge: "Kleine Chargen",
        alt1: "Kaltgepresste Öle",
        alt2: "Palmkernöl für Haarpflege",
        title: "Authentische Öle aus kleinen Chargen",
        p1: "TropiNord-Öle stammen in kleinen Chargen von lokalen Bauern aus tropischen Regionen Afrikas. Keine massenproduzierten Rohstofföle. Traditionell hergestellt, gepresst und sorgfältig behandelt, damit sie ihren natürlichen Charakter und ihre Authentizität bewahren.",
        p2: "Wir setzen auf direkte Beziehungen und Rückverfolgbarkeit. Jede Charge spiegelt ihren Ursprung wider: Boden, Klima und die Hände dahinter. Sie erhalten 100% authentisches, lokal hergestelltes Öl — wie seit Generationen.",
      },
      superfoods: {
        ariaBrowse: "Superfoods entdecken",
        heroAlt: "Superfoods",
        badge: "Traditionell geerntet",
        title: "Superfoods mit echtem Ursprung, keine Industriepulver",
        p1: "Unsere Superfoods stammen aus ihren natürlichen Lebensräumen in Afrika und werden dort seit Generationen genutzt. Von Moringa-Blättern bis Baobab und dickem Waldhonig: wir setzen auf kleinbäuerliche Ernte, um Qualität und Integrität zu bewahren.",
        p2: "Minimal verarbeitet: natürlich getrocknet, sorgfältig behandelt und so vorbereitet, dass das authentische Nährstoffprofil erhalten bleibt. Wir wählen traditionelle Methoden statt Massenproduktion — weil Authentizität zählt.",
      },
      newsletter: {
        title: "Bleib auf dem Laufenden",
        success: "Danke! Du bist auf der Liste.",
        placeholder: "E-Mail eingeben",
        cta: "Abonnieren",
      },
    },
    catalog: {
      title: "Produkte entdecken",
      subtitle: "Entdecken Sie unsere Auswahl an Premium-Produkten",
      filterByCategory: "Nach Kategorie filtern",
      loadFailed: "Produkte konnten nicht geladen werden.",
      showingCount: "{{count}} Produkte werden angezeigt",

      productDetailsTitle: "Produktdetails",
      productDetailsSubtitle: "Produktdetails und Kaufoptionen.",
      productDetailsLoadingSubtitle: "Produktinformationen werden geladen.",
      productNotFoundTitle: "Produkt nicht gefunden",
      productNotFoundSubtitle: "Dieses Produkt konnte nicht gefunden werden.",
      productNotFoundBody:
        "Das gesuchte Produkt existiert nicht oder wurde entfernt.",
      backToCatalog: "Zurück zum Katalog",

      inStockCount: "{{count}} auf Lager",
      outOfStock: "Nicht auf Lager",
      comingSoon: "Demnächst verfügbar",

      ritualFriendly: "Ritualgeeignet",
      pairsWithHoney: "Passt gut zu Honig",
      slowBrew: "Langsame Ziehzeit",

      ritualTitle: "Vervollständigen Sie Ihr Tee-Ritual",
      ritualSubtitle: "Einfache Begleiter, die Ihre Tasse veredeln.",
      ritualPicks: "Ritual-Auswahl",
      ritualPick: "Ritual-Empfehlung",
      ritualTip:
        "Tipp: Fügen Sie Wildwaldhonig hinzu für eine intensivere Tasse.",

      youMayAlsoLike: "Das könnte Ihnen auch gefallen",

      teaHoneyPairingTitle: "Tee + Honig Ritual-Kombination",
      teaHoneyPairingBody:
        "Beide Artikel befinden sich in Ihrem Warenkorb. Bundle-Rabatte können im Checkout aktiviert werden.",

      addToCart: "In den Warenkorb",
      added: "Hinzugefügt",
      maxInCart: "Maximale Menge im Warenkorb",
      unavailable: "Nicht verfügbar",

      // NEW: used by CategoryFilter + ProductSearch + ProductCard
      searchPlaceholder: "Produkte suchen…",
      clearSearch: "Suche löschen",
      onlyLeft: "Nur noch {{count}} übrig",
      productFallbackTitle: "Produkt",
      categories: {
        all: "Alle Produkte",
        tea: "Tee",
        oils: "Öle",
        superfoods: "Superfoods",
        others: "Sonstiges",
      },
    },
  },

  sw: {
    common: {
      language: "Lugha",
      theme: "Mandhari",
      currency: "Sarafu",
      currencyHint: "Uchaguzi wa sarafu umehifadhiwa kwenye kifaa hiki.",
      loading: "Inapakia…",
      close: "Funga",
      copy: "Nakili",
      backToShop: "Rudi dukani",
      free: "Bure",
      included: "Imejumuishwa",
      includesFreeTeaBagsTitle:
        "Inajumuisha mifuko ya chai inayoweza kutumika tena",
      includesFreeTeaBagsBody:
        "Kila agizo la chai linajumuisha pakiti ya mifuko 10 ya chai inayoweza kutumika tena.",
      teaBagsLabel: "Mifuko ya chai inayoweza kutumika tena (pakiti ya 10)",
    },
    currencies: {
      SEK: "Krona ya Uswidi (SEK)",
      EUR: "Yuro (EUR)",
      USD: "Dola ya Marekani (USD)",
      GBP: "Pauni ya Uingereza (GBP)",
      NOK: "Krona ya Norwei (NOK)",
      DKK: "Krona ya Denmaki (DKK)",
      CHF: "Faranga ya Uswisi (CHF)",
      KES: "Shilingi ya Kenya (KES)",
      TZS: "Shilingi ya Tanzania (TZS)",
      UGX: "Shilingi ya Uganda (UGX)",
    },
    nav: {
      menu: "Menyu",
      home: "Nyumbani",
      catalog: "Katalogi",
      about: "Kuhusu",
      story: "Hadithi yetu",
      orders: "Maagizo",
      converter: "Kibadilishaji sarafu",
      account: "Akaunti",
      language: "Lugha",
    },
    about: {
      headerTitle: "Kuhusu",
      headerSubtitle:
        "Ustaarabu wa Ulaya kwa utulivu, uliojikita katika uhalisia wa tropiki.",

      hero: {
        kicker: "Ustawi wa premium  Biashara ya maadili  Urithi wa mimea",
        title:
          "TropiNord ni nyumba ya mimea inayoongozwa kwa mtazamo wa Nordic yenye kina cha tropiki.",
        body: "Ikiwa Sweden, TropiNord huchagua mafuta, chai na superfoods kwa msisitizo wa ufuatiliaji wa chanzo, ushughulikiaji makini na muundo tulivu. Tunaunganisha usahihi wa Nordic na kina cha kitamaduni cha viambato vya tropiki, tukichagua bidhaa zinazoonekana safi, zenye kusudi na zinazofaa kuwa sehemu ya desturi ya kila siku.",
      },

      brandStory: {
        title: "Hadithi ya chapa",
        p1: "Hadithi yetu inaanza na imani kwamba ustawi unapaswa kuwaunganisha watu na asili, urithi na hekima inayovihifadhi vyote. Ikizaliwa Sweden, TropiNord huchanganya usahihi wa Nordic na ubunifu wa tropiki ili kuunda bidhaa za asili zinazolisha, kurejesha na kulinda.",
        p2: "Tunajenga chapa ya premium ya kipekee kwa ukuaji unaodhibitiwa, tukitanguliza ufundi na uwazi wa chanzo. Kila bidhaa huchaguliwa kwa usafi, ufanisi na asili inayoweza kuelezwa bila kelele ya masoko.",
      },

      transparency: {
        title: "Uwazi wa upatikanaji wa chanzo",
        body: "Mafuta na superfoods hupatikana kutoka kwa wazalishaji wadogo katika maeneo ya tropiki barani Afrika. Chai kwa sasa hupatikana kupitia washirika wa Ulaya wanaosource Afrika—tuliyowachagua kwa uaminifu na ufuataji wa viwango tunapoendelea kujenga usafirishaji wa moja kwa moja. Tutaeleza kila wakati tunachojua, tunachoweza kuthibitisha, na jinsi kila kundi linavyopatikana.",
      },

      whatWeDo: {
        title: "Tunachofanya",
        cards: {
          traceable: {
            title: "Bidhaa zilizochaguliwa zenye chanzo kinachofuatilika",
            body: "Tunachagua mafuta, chai na superfoods ambazo zinaweza kuelezwa kupitia asili, ushughulikiaji na uadilifu.",
          },
          ethical: {
            title: "Ushirikiano wa maadili",
            body: "Tunafanya kazi na wazalishaji wadogo na washirika wanaoaminika kwa msisitizo wa thamani ya haki na uwazi.",
          },
          design: {
            title: "Udhibiti wa ubora na muundo tulivu",
            body: "Muundo wa Nordic ni nidhamu. Tunaiweka chapa tulivu, yenye muundo na ya premium ili bidhaa ijiseme.",
          },
          platform: {
            title: "Jukwaa lililojengwa kwa uaminifu",
            body: "Tunajenga mifumo ya uwazi, uelewa wa bidhaa na uzoefu wa mteja wa kiwango cha premium.",
          },
        },
      },

      mission: {
        title: "Dhamira yetu",
        p1: "Kuinua ustawi wa asili kupitia uadilifu, upatikanaji wa chanzo kwa uwajibikaji na usahihi wa Nordic, tukitengeneza bidhaa zinazohisi vizuri kimaadili kama zinavyohisi kimwili.",
        tagline:
          "TropiNord. Mahali ambapo jadi hukutana na teknolojia kwa ustawi wa asili.",
      },

      contact: {
        title: "Mawasiliano",
        bodyPrefix:
          "Kwa ushirikiano, upatikanaji wa chanzo au msaada, wasiliana",
      },
    },
    cart: {
      title: "Kikapu",
      bundleApplied: "Kifurushi kimewekwa",
      teaHoneyLabel: "Kifurushi cha Chai + Asali (punguzo 10% kwa asali)",
      emptyTitle: "Kikapu chako kiko tupu",
      emptyBody: "Ongeza bidhaa ili kuanza",
      subtotal: "Jumla ndogo",
      discounts: "Punguzo",
      total: "Jumla",
      save: "Okoa",
      proceedToCheckout: "Endelea hadi malipo",
      clearCart: "Futa kikapu",
      productFallbackTitle: "Bidhaa",
      decreaseQty: "Punguza idadi",
      increaseQty: "Ongeza idadi",
      removeItem: "Ondoa",
      continueShopping: "Endelea kununua",
    },
    story: {
      header: {
        title: "Hadithi yetu",
        subtitle:
          "Nyumba ya mimea yenye nidhamu ya Nordic na kina cha tropiki.",
      },

      hero: {
        kicker: "Nyumba ya mimea  Biashara ya maadili  Ufundi wa urithi",
        title:
          "Daraja hai kati ya mabara, lililojengwa kwa utulivu na uwajibikaji.",
        body: "TropiNord ipo kulinda asili. Tunachagua ufuatiliaji wa chanzo, ushughulikiaji makini, na muundo tulivu ili kile kinachofika kwako kibebe bado mahali kilipotoka.",
        founderLine: "Imeanzishwa na Paul Abejegah.",
      },

      quote: "Uhalisia huhifadhiwa pale asili inapoheshimiwa.",

      why: {
        title: "Kwa nini TropiNord ipo",
        p1: "Hadithi yetu inaanza na imani kwamba ustawi unapaswa kuwaunganisha watu na asili, urithi na hekima inayovihifadhi vyote. Ikizaliwa Sweden, TropiNord huchanganya usahihi wa Nordic na ubunifu wa tropiki ili kuunda bidhaa za asili zinazolisha, kurejesha na kulinda.",
        p2: "Mradi huu umeundwa na uzoefu halisi katika mabara na hali za hewa tofauti. Umejengwa kwa ustaarabu wa Ulaya kwa utulivu, na heshima ya kina kwa ufundi wa tropiki na maarifa ya jamii.",
      },

      transparency: {
        title: "Tamko la uwazi wa upatikanaji wa chanzo",
        body: "Mafuta na superfoods hupatikana kutoka kwa wazalishaji wadogo katika maeneo ya tropiki barani Afrika, kwa kuzingatia ushughulikiaji makini, ufuatiliaji wa chanzo na thamani ya haki. Chai kwa sasa hupatikana kupitia washirika wa Ulaya wanaosource Afrika, waliochaguliwa kwa udhibiti wa ubora na ufuataji wa viwango tunapoendelea kujenga usafirishaji wa moja kwa moja. Kila ukurasa wa bidhaa unaonyesha tunachoweza kuthibitisha na jinsi chanzo kilivyopatikana.",
      },

      sections: {
        oils: {
          title: "Mafuta yetu",
          body: "Mafuta yetu si bidhaa za viwandani zinazozalishwa kwa wingi. Hutengenezwa kwa makundi madogo kwa mbinu za jadi, mara nyingi yakikamuliwa kwa baridi au kusafishwa kwa upole. Hii huhifadhi tabia ya asili, harufu, umbile na ufanisi ambao usindikaji wa viwandani mara nyingi huondoa.",
        },
        superfoods: {
          title: "Superfoods zetu",
          body: "Superfoods zetu huvunwa kwa kiasi kidogo na kuchakatwa kidogo ili kudumisha uadilifu. Kuanzia moringa na baobab hadi asali nzito ya msituni, tunatanguliza uhalisia, ushughulikiaji makini na heshima kwa jamii zinazozizalisha.",
        },
      },

      founder: {
        kicker: "Mwanzilishi",
        name: "Paul Abejegah",
        photoAlt: "Paul Abejegah",
      },

      principles: {
        kicker: "Kanuni",
        items: [
          "Asili inayofuatilika na upatikanaji wa chanzo wa uaminifu",
          "Ushughulikiaji wa makundi madogo, si kutokujulikana kwa viwanda",
          "Muundo wa nidhamu wenye dhamira ya premium",
          "Heshima kwa ufundi, watu na mahali",
        ],
      },

      sourcing: {
        kicker: "Uwazi wa upatikanaji wa chanzo",
        title: "Ramani ya chanzo",
        body: "Muonekano rahisi wa asili na ushirikiano. Mafuta na superfoods hupatikana kupitia wazalishaji wadogo katika Afrika ya tropiki. Chai kwa sasa hupatikana kupitia washirika wa Ulaya wanaosource Afrika, waliochaguliwa kwa uthabiti na ufuataji wa viwango tunapoendelea kujenga usafirishaji wa moja kwa moja.",
        map: {
          sweden: "Uswidi",
          euPartners: "Washirika wa Ulaya",
          westAfrica: "Afrika Magharibi",
          nigeria: "Nigeria",
          eastAfrica: "Afrika Mashariki",
        },
        cards: {
          oils: {
            title: "Mafuta",
            body: "Upatikanaji wa makundi madogo na wazalishaji wa ndani, mbinu za jadi na ushughulikiaji makini.",
          },
          superfoods: {
            title: "Superfoods",
            body: "Huvunwa kwa kiasi kidogo na kuchakatwa kidogo ili kudumisha uadilifu na uhalisia.",
          },
          teas: {
            title: "Chai",
            body: "Hupatikana kupitia washirika wa Ulaya wanaosource Afrika, kwa udhibiti wa ubora tunapopanua usafirishaji.",
          },
        },
      },

      closing: {
        title: "Uhalisia si mtindo. Ni kiwango chetu.",
        currentLanguage: "Lugha ya sasa:",
      },
    },
    faq: {
      header: {
        title: "Maswali Yanayoulizwa Mara kwa Mara",
        subtitle: "Majibu ya maswali ya kawaida.",
      },
      title: "Maswali ya mara kwa mara",
      questions: {
        shipping: {
          title: "Mnasafirisha kutoka wapi",
          body: "Tunasafirisha kutoka Sweden. Upatikanaji wa bidhaa na muda wa uwasilishaji unaweza kutofautiana kulingana na eneo.",
        },
        authenticity: {
          title: "Je, bidhaa zenu ni halisi",
          body: "Tunatanguliza ufuatiliaji wa chanzo na uwazi wa upatikanaji. Mafuta na superfoods hutoka kwa wazalishaji wadogo katika Afrika ya tropiki. Chai hupatikana kupitia washirika wa Ulaya.",
        },
        contact: {
          title: "Ninawezaje kuwasiliana nanyi",
          body: "Tuma barua pepe kwa admin@tropinord.com au wasiliana nasi kupitia WhatsApp kwenye sehemu ya chini ya ukurasa.",
        },
      },
    },
    privacy: {
      header: {
        title: "Sera ya Faragha",
        subtitle: "Jinsi tunavyoshughulikia data yako.",
      },
      title: "Sera ya faragha",
      body: {
        p1: "Tunakusanya tu taarifa zinazohitajika kutoa huduma zetu, kama kutimiza maagizo na huduma kwa wateja. Hatuuzi taarifa binafsi.",
        p2: "Usajili wa jarida hutumika kutuma taarifa za bidhaa na habari za chapa. Unaweza kujiondoa wakati wowote.",
        p3: "Kwa maswali kuhusu faragha, wasiliana na admin@tropinord.com.",
      },
    },
    footer: {
      brandLine:
        "Nyumba ya mimea iliyoundwa Uswidi, iliyojikita katika uhalisia wa tropiki.",
      newsletterTitle: "Jarida",
      newsletterBody:
        "Jiandikishe kwa matoleo mapya na taarifa za upatikanaji. Unahitaji msaada? support@tropinord.com",
      trustLine: "Malipo salama • Stripe • Swish (kwa mkono)",
      faq: "Maswali",
      privacy: "Sera ya faragha",
      madeIn: "Imebuniwa Uswidi • Imejikita Tropiki",
      helpBody:
        "Wasiliana nasi kupitia <whatsapp>WhatsApp</whatsapp> au barua pepe <email>support@tropinord.com</email>.",
      rightsReserved: "© {{year}} TropiNord. Haki zote zimehifadhiwa.",
    },
    newsletter: {
      emailPlaceholder: "Anwani ya barua pepe",
      subscribe: "Jiandikishe",
      signingUp: "Inaandikisha…",
      subscribedTitle: "Umejiandikisha",
      subscribedDescription: "Asante! Umeongezwa kwenye jarida.",
      errorTitle: "Imeshindikana kujiandikisha",
      errorDescription:
        "Tafadhali jaribu tena baadaye au wasiliana na support@tropinord.com.",
    },
    errors: {
      genericTitle: "Hitilafu",
      genericDescription: "Kuna tatizo. Tafadhali jaribu tena.",
      copyFailedTitle: "Kunakili kumeshindikana",
      copyFailedDescription: "Haikuweza kunakili kwenye clipboard.",
      missingInfoTitle: "Taarifa hazijakamilika",
      checkoutFailedTitle: "Malipo yameshindikana",
      checkoutFailedDescription:
        "Hatukuweza kuanzisha malipo. Tafadhali jaribu tena.",
      swishRequiresSekTitle: "Swish inahitaji SEK",
      swishRequiresSekDescription:
        "Swish inapatikana tu kwa maagizo ya SEK. Tafadhali chagua SEK.",
      fullNameRequired: "Jina kamili linahitajika.",
      emailRequired: "Barua pepe inahitajika.",
      emailInvalid: "Anwani ya barua pepe si sahihi.",
      streetRequired: "Anwani ya barabara inahitajika.",
      cityRequired: "Jiji linahitajika.",
      postalCodeRequired: "Msimbo wa posta unahitajika.",
      countryRequired: "Nchi inahitajika.",
    },
    checkout: {
      headerTitle: "Malipo",
      headerSubtitle:
        "Maelezo ya usafirishaji, njia ya malipo, na malipo salama.",
      emptyTitle: "Kikapu chako kiko tupu",
      emptyBody: "Ongeza bidhaa kwenye kikapu kabla ya kuendelea.",
      continueShopping: "Endelea kununua",
      contactTitle: "Taarifa za mawasiliano",
      fullName: "Jina kamili",
      email: "Barua pepe",
      phoneOptional: "Simu (si lazima)",
      phonePlaceholder: "+46 70 123 4567",
      shippingTitle: "Anwani ya usafirishaji",
      streetAddress: "Anwani",
      city: "Jiji",
      postalCode: "Msimbo wa posta",
      country: "Nchi",
      paymentTitle: "Njia ya malipo",
      payCardTitle: "Kadi (Stripe)",
      payCardBody: "Malipo salama kupitia Stripe",
      paySwishTitle: "Swish (kwa mkono)",
      paySwishBody: "QR + rejea (huthibitishwa baada ya ukaguzi)",
      paySwishRequiresSek: "Inahitaji SEK",
      payPaypalTitle: "PayPal",
      payPaypalBody: "Wezesha kupitia Stripe (ikifaa)",
      summaryTitle: "Muhtasari wa agizo",
      qty: "Idadi",
      subtotal: "Jumla ndogo",
      discounts: "Punguzo",
      shipping: "Usafirishaji",
      total: "Jumla",
      starting: "Inaandaa…",
      showSwishQr: "Onyesha QR ya Swish",
      payWithStripe: "Lipa kwa Stripe",
      swishHint: "Utapata QR na rejea ya Swish.",
      stripeHint: "Utaelekezwa kwenye malipo salama ya Stripe.",
      swishModalTitle: "Lipa kwa Swish",
      swishModalDescription:
        "Scan QR kwenye Swish au tumia namba + rejea. Agizo lako litathibitishwa baada ya ukaguzi.",
      amount: "Kiasi",
      swishNumber: "Namba ya Swish",
      reference: "Rejea",
      openSwish: "Fungua Swish",
      afterPayHint:
        "Baada ya kulipa, agizo litabaki kusubiri hadi kuthibitishwa. Ukihitaji msaada, wasiliana na support.",
      iHavePaid: "Nimelipa",
      copiedTitle: "Imenakiliwa",
      copiedDescription: "{{label}} imenakiliwa.",
      paymentPendingTitle: "Malipo yanasubiri",
      paymentPendingDescription:
        "Asante! Tutathibitisha Swish yako hivi karibuni.",
    },
    home: {
      hero: {
        tagline: "Asili ya tropiki. Maelewano ya kimataifa.",
        explore: "Chunguza",
        headline: "Chai, mafuta na superfoods kutoka tropiki",
        subheadline:
          "Inafuatiliwa kidijitali. Imetokana na vyanzo endelevu. Lishe bora ya tropiki.",
        ourStory: "Hadithi yetu",
      },
      tea: {
        ariaBrowse: "Tazama chai",
        heroAlt: "Mkusanyiko wa chai wa TropiNord",
        badge: "Imetengenezwa kwa jadi",
        guideAlt: "Mwongozo wa chai",
        title: "Chemsha utulivu, onja uwazi",
        body: "Majani kamili. Harufu halisi. Desturi ya kukumbukwa.",
        cta: "Tazama chai",
      },
      oil: {
        ariaBrowse: "Tazama mafuta",
        heroAlt: "Mkusanyiko wa mafuta wa TropiNord",
        badge: "Kundi dogo",
        alt1: "Mafuta yaliyokamuliwa kwa baridi",
        alt2: "Mafuta ya punje za mawese kwa nywele",
        title: "Mafuta halisi, kutoka makundi madogo",
        p1: "Mafuta ya TropiNord hupatikana kwa makundi madogo kutoka kwa wakulima wa maeneo ya tropiki barani Afrika. Si mafuta ya bidhaa yanayozalishwa kwa wingi. Ni mafuta ya jadi yaliyokamuliwa na kushughulikiwa kwa uangalifu ili yadumishe asili na uhalisia wake.",
        p2: "Tunatanguliza uhusiano wa moja kwa moja na ufuatiliaji wa chanzo. Kila kundi linaakisi asili yake: udongo, hali ya hewa na mikono iliyoyatengeneza. Unachopokea ni mafuta halisi 100% ya kienyeji, yakiwa yametayarishwa kama ilivyofanyika kwa vizazi.",
      },
      superfoods: {
        ariaBrowse: "Tazama superfoods",
        heroAlt: "Superfoods",
        badge: "Imevunwa kwa jadi",
        title: "Superfoods zenye asili halisi, si unga wa viwandani",
        p1: "Superfoods zetu hutoka kwenye mazingira yake ya asili barani Afrika, ambapo zimetumiwa kwa vizazi. Kuanzia majani ya moringa hadi tunda la baobab na asali nzito ya msituni, tunazingatia uvunaji wa kiasi kidogo ili kuhifadhi ubora.",
        p2: "Viambato vilivyochakatwa kidogo: vimekaushwa kiasili, vimeshughulikiwa kwa uangalifu, na vimetayarishwa ili kudumisha thamani ya lishe. Tunachagua mbinu za jadi badala ya uzalishaji wa wingi kwa sababu uhalisia ni muhimu.",
      },
      newsletter: {
        title: "Endelea kupata taarifa",
        success: "Asante! Umeongezwa kwenye orodha.",
        placeholder: "Weka barua pepe yako",
        cta: "Jiandikishe",
      },
    },
    catalog: {
      title: "Chunguza bidhaa",
      subtitle: "Gundua uteuzi wetu wa bidhaa bora",
      filterByCategory: "Chuja kwa Kategoria",
      loadFailed: "Imeshindikana kupakia bidhaa.",
      showingCount: "Inaonyesha bidhaa {{count}}",

      productDetailsTitle: "Maelezo ya bidhaa",
      productDetailsSubtitle: "Maelezo ya bidhaa na chaguo za ununuzi.",
      productDetailsLoadingSubtitle: "Inapakia maelezo ya bidhaa.",
      productNotFoundTitle: "Bidhaa haijapatikana",
      productNotFoundSubtitle: "Bidhaa hii haikupatikana.",
      productNotFoundBody: "Bidhaa unayotafuta haipo au imeondolewa.",
      backToCatalog: "Rudi kwenye katalogi",

      inStockCount: "{{count}} zipo dukani",
      outOfStock: "Imeisha",
      comingSoon: "Inakuja hivi karibuni",

      ritualFriendly: "Inafaa kwa utaratibu",
      pairsWithHoney: "Inaendana na asali",
      slowBrew: "Chemsha taratibu",

      ritualTitle: "Kamilisha utaratibu wako wa chai",
      ritualSubtitle: "Viongezo rahisi vinavyoboresha kikombe chako.",
      ritualPicks: "Chaguo za utaratibu",
      ritualPick: "Chaguo maalum",
      ritualTip:
        "Kidokezo: Ongeza asali ya msitu kwa kikombe chenye ladha zaidi.",

      youMayAlsoLike: "Unaweza pia kupenda",

      teaHoneyPairingTitle: "Mchanganyiko wa Chai + Asali",
      teaHoneyPairingBody:
        "Bidhaa zote ziko kwenye kikapu chako. Punguzo la kifurushi linaweza kuwezeshwa wakati wa malipo.",

      addToCart: "Ongeza kwenye kikapu",
      added: "Imeongezwa",
      maxInCart: "Kikomo kwenye kikapu",
      unavailable: "Haipatikani",

      // NEW: used by CategoryFilter + ProductSearch + ProductCard
      searchPlaceholder: "Tafuta bidhaa…",
      clearSearch: "Futa utafutaji",
      onlyLeft: "Zimebaki {{count}} tu",
      productFallbackTitle: "Bidhaa",
      categories: {
        all: "Bidhaa zote",
        tea: "Chai",
        oils: "Mafuta",
        superfoods: "Superfoods",
        others: "Nyingine",
      },
    },
  },
} as const;
