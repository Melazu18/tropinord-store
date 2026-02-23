import type { ProductDetailSpec } from "@/types/productDetails";
import { contraindications } from "@/seed/contraindications";

export const productDetailsSeed: Record<string, ProductDetailSpec> = {
  // ─────────────────────────────
  // OILS / BUTTERS (label-accurate)
  // ─────────────────────────────
  "oil-coconut-heat": {
    slug: "oil-coconut-heat",
    kind: "oil",
    name: "Heat-Processed Coconut Oil",
    shortDescription:
      "Single-ingredient coconut oil produced with heat processing. Suitable for culinary preparation or traditional external use.",
    history:
      "Coconut oil has long been used across tropical regions for household cooking and traditional personal care preparations.",
    originCountry: "Nigeria",
    safetyType: "oil",
    oil: {
      inci: ["Cocos Nucifera Oil (Kokosolja)"],
      netContent: "200 ml",
      pao: "36M",
      batchNo: "BN-1225-COH200",
      bestBefore: "2028-11-31",
      originCountry: "Nigeria",
      packedIn: "Trollhättan, Sverige",
      extractionMethod: "Heat-processed",
    },
    ingredients: ["Cocos Nucifera Oil"],
    benefits: [
      { title: "Multi-purpose staple", details: "Works for household use and routines." },
      { title: "Suitable for higher-heat cooking", details: "Heat processing suits culinary use." },
    ],
  },

  "oil-coconut": {
    slug: "oil-coconut",
    kind: "oil",
    name: "Cold-Pressed Coconut Oil",
    shortDescription:
      "Single-ingredient cold-pressed coconut oil. Solid at cooler temperatures; melts on skin contact.",
    history:
      "Traditional tropical oil used for centuries in Africa, South Asian and Pacific Island cultures for cooking, hair care, and skin protection.",
    originCountry: "Moçambique",
    safetyType: "oil",
    oil: {
      inci: ["Cocos Nucifera Oil (Kokosolja)"],
      netContent: "100 ml",
      pao: "36M",
      batchNo: "BN-1225-CO100",
      bestBefore: "2028-10-31",
      originCountry: "Moçambique",
      packedIn: "Trollhättan, Sverige",
      extractionMethod: "Cold-pressed",
    },
    ingredients: ["Cocos Nucifera Oil"],
    benefits: [
      { title: "Moisturizes skin & hair", details: "Comforting, rich feel for routines." },
      { title: "Simple ingredient list", details: "Single-ingredient botanical oil." },
    ],
  },

  "butter-shea": {
    slug: "butter-shea",
    kind: "butter",
    name: "Shea Butter",
    shortDescription:
      "Unrefined shea butter with a rich, creamy texture. A versatile base for DIY blends and balms.",
    history:
      "Traditional West African botanical butter used for generations in household and cultural preparations.",
    originCountry: "Nigeria",
    safetyType: "butter",
    oil: {
      inci: ["Butyrospermum Parkii Butter (Sheasmör)"],
      netContent: "200 g",
      pao: "36M",
      batchNo: "BN-1225-SB200",
      bestBefore: "2028-11-31",
      originCountry: "Nigeria",
      packedIn: "Trollhättan, Sverige",
      extractionMethod: "Unrefined",
    },
    ingredients: ["Butyrospermum Parkii Butter"],
    benefits: [
      { title: "Versatile base", details: "Great for balms and blends." },
      { title: "Rich texture", details: "Comforting feel for dry areas." },
    ],
    contraindications: [
      {
        tag: "allergy",
        severity: "caution",
        title: "Nut sensitivity",
        details:
          "Shea is from a nut. Patch test first if you have a history of nut sensitivity or reactive skin.",
      },
    ],
  },

  "oil-palm-kernel": {
    slug: "oil-palm-kernel",
    kind: "oil",
    name: "Palm Kernel Oil",
    shortDescription:
      "Traditional West African botanical oil with a rich feel; commonly used in soaps and hair butters.",
    history:
      "Centuries-old West African traditional oil, used in household formulations and cultural preparations.",
    originCountry: "Nigeria",
    safetyType: "oil",
    oil: {
      inci: ["Elaeis Guineensis Kernel Oil (Palmkärnolja)"],
      netContent: "50 ml",
      pao: "36M",
      batchNo: "BN-1225-PK50",
      bestBefore: "2028-12-31",
      originCountry: "Nigeria",
      packedIn: "Trollhättan, Sverige",
      extractionMethod: "Traditional / pressed",
    },
    ingredients: ["Elaeis Guineensis Kernel Oil"],
    benefits: [{ title: "Rich texture", details: "Popular for traditional formulation routines." }],
  },

  "ancestral-balm": {
    slug: "ancestral-balm",
    kind: "butter",
    name: "Ancestral Balm",
    shortDescription:
      "A rich balm blend inspired by traditional body-care routines.",
    originCountry: "Africa",
    safetyType: "butter",
    oil: {
      inci: [
        "Butyrospermum Parkii Butter (Sheasmör)",
        "Cocos Nucifera Oil (Kokosolja)",
        "Elaeis Guineensis Oil (Palmolja)",
      ],
      netContent: "150 g",
      pao: "36M",
      batchNo: "BN-1225-AB100",
      bestBefore: "2028-11-31",
      originCountry: "Africa",
      packedIn: "Trollhättan, Sverige",
    },
    ingredients: [
      "Butyrospermum Parkii Butter",
      "Cocos Nucifera Oil",
      "Elaeis Guineensis Oil",
    ],
    contraindications: [
      {
        tag: "allergy",
        severity: "caution",
        title: "Sensitive skin / allergies",
        details:
          "Contains multiple botanical oils/butters. Patch test first if you have reactive skin.",
      },
    ],
  },

  // ─────────────────────────────
  // TEAS (clean benefits + contraindications)
  // ─────────────────────────────
  "warm-resolve": {
    slug: "warm-resolve",
    kind: "tea",
    name: "Warm Resolve",
    shortDescription:
      "Organic herbal blend with apple, ginger, cinnamon, rooibos, and warming spices for balance and vitality.",
    originCountry: null,
    safetyType: "herbal",
    tea: {
      articleNo: "82457",
      productionYear: "2025",
      bestBefore: "2027-10-21",
      naturallyGrown: true,
      ingredients: [
        "Apple",
        "Blackberry leaves",
        "Ginger",
        "Cinnamon sticks",
        "Rooibos",
        "Chamomile",
        "Black pepper",
        "Orange peel",
        "Apple pieces",
        "Clove",
        "Cardamom",
        "Mallow",
      ],
      dosage: { amount: 12, unit: "g", volumeMl: 1000 },
      brewingTime: { min: 7, max: 10, unit: "min" },
      brewTemperature: { value: 100, unit: "C" },
      flavouring: "spiced-fruity",
      flavour: ["Apple", "Ginger", "Cinnamon", "Spices"],
    },
    ingredients: [
      "Apple",
      "Blackberry leaves",
      "Ginger",
      "Cinnamon",
      "Rooibos",
      "Chamomile",
      "Black pepper",
      "Orange peel",
      "Clove",
      "Cardamom",
      "Mallow",
    ],
    benefits: [
      { title: "Warming cup", details: "Ginger and spices give a cozy feel." },
      { title: "Caffeine-free", details: "Suitable for afternoons/evenings." },
    ],
    contraindications: [
      {
        tag: "pregnancy",
        severity: "caution",
        title: "Pregnancy & breastfeeding",
        details:
          "Herbal blends can vary. If pregnant/breastfeeding, consult a professional before regular use.",
      },
    ],
  },

  "quiet-morning": {
    slug: "quiet-morning",
    kind: "tea",
    name: "Quiet Morning",
    shortDescription:
      "Organic Assam black tea blended with bergamot flavour and blue cornflower petals.",
    originCountry: "India",
    safetyType: "black",
    tea: {
      articleNo: "84064",
      productionYear: "2025",
      bestBefore: "2027-12-16",
      naturallyGrown: true,
      ingredients: ["Black tea (Assam)", "Natural bergamot flavour", "Cornflower blue"],
      dosage: { amount: 12, unit: "g", volumeMl: 1000 },
      brewingTime: { min: 3, max: 5, unit: "min" },
      brewTemperature: { value: 100, unit: "C" },
      flavouring: "citrusy",
      flavour: ["Bergamot", "Black tea"],
    },
    ingredients: ["Black tea (Assam)", "Natural bergamot flavour", "Cornflower blue"],
    benefits: [
      { title: "Bright, classic black tea", details: "Bergamot adds a citrus lift." },
      { title: "Focus & alertness", details: "Contains caffeine (black tea)." },
    ],
    contraindications: [
      {
        tag: "sleepiness",
        severity: "info",
        title: "Contains caffeine",
        details:
          "Black tea naturally contains caffeine. Avoid close to bedtime if you’re sensitive.",
      },
    ],
  },

  "sunset-care": {
    slug: "sunset-care",
    kind: "tea",
    name: "Sunset Care",
    shortDescription:
      "Organic herbal blend with coconut and lime notes, designed for evening relaxation and nighttime balance.",
    safetyType: "herbal",
    tea: {
      articleNo: "83376",
      productionYear: "2025",
      bestBefore: null,
      naturallyGrown: true,
      ingredients: [
        "Nettle (50%)",
        "Lemon balm",
        "Chamomile (9%)",
        "Spearmint",
        "Green tea China Bancha",
        "Moringa leaves",
        "Coconut",
        "Lime oil",
        "Valerian (3%)",
        "Wheatgrass",
        "Marigold",
        "Mallow",
        "St. John's wort",
      ],
      dosage: { amount: 12, unit: "g", volumeMl: 1000 },
      brewingTime: { min: 7, max: 10, unit: "min" },
      brewTemperature: { value: 100, unit: "C" },
      flavouring: "coconut-citrus",
      flavour: ["Coconut", "Lime", "Herbal"],
    },
    ingredients: [
      "Nettle",
      "Lemon balm",
      "Chamomile",
      "Spearmint",
      "Green tea (Bancha)",
      "Moringa leaves",
      "Coconut",
      "Lime oil",
      "Valerian",
      "Wheatgrass",
      "Marigold",
      "Mallow",
      "St. John's wort",
    ],
    benefits: [
      { title: "Evening-friendly blend", details: "Herbal profile designed for wind-down routines." },
      { title: "Coconut & lime notes", details: "Light tropical-citrus finish." },
    ],
    contraindications: [
      // Valerian precautions
      ...contraindications.valerian,
      // St. John’s wort precautions
      ...contraindications.stJohnsWort,
      // Plus caffeine note because Bancha is green tea
      {
        tag: "sleepiness",
        severity: "info",
        title: "Contains a small amount of caffeine",
        details:
          "Includes green tea (Bancha). If caffeine-sensitive, try earlier in the evening.",
      },
    ],
  },
};
