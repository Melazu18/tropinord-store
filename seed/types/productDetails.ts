export type ProductKind = "tea" | "oil" | "butter" | "superfood" | "other";

export type SafetyType =
  | "herbal"
  | "fruit"
  | "black"
  | "green"
  | "white"
  | "spice"
  | "oil"
  | "butter"
  | "food"
  | "unknown";

export type ContraindicationTag =
  | "pregnancy"
  | "breastfeeding"
  | "children"
  | "bloodPressure"
  | "anticoagulants"
  | "sedatives"
  | "antidepressants"
  | "immunosuppressants"
  | "thyroid"
  | "liver"
  | "surgery"
  | "allergy"
  | "photosensitivity"
  | "drugInteractions"
  | "sleepiness";

export interface Contraindication {
  tag: ContraindicationTag;
  title: string;          // short, user-facing
  details: string;        // clear explanation
  severity?: "info" | "caution" | "avoid";
}

export interface Benefit {
  title: string;          // user-facing
  details?: string;
}

export interface Dosage {
  amount: number;
  unit: "tsp" | "g" | "ml";
  volumeMl?: number;      // e.g. per 250 ml cup / per 1000 ml pot
}

export interface BrewingTime {
  min: number;
  max: number;
  unit: "min";
}

export interface BrewTemperature {
  value: number;
  unit: "C";
}

export interface OilLabelInfo {
  inci: string[];         // INCI list
  netContent: string;     // "200 ml", "50 ml", "200 g"
  pao?: string;           // "36M"
  batchNo?: string;       // "BN-1225-COH200"
  bestBefore?: string;    // "2028-11-31" (note: 31 Nov is invalid date; keep as string)
  originCountry?: string; // "Nigeria"
  packedIn?: string;      // "Trollhättan, Sverige"
  extractionMethod?: string;
}

export interface TeaLabelInfo {
  articleNo?: string;
  productionYear?: string;
  bestBefore?: string | null;
  naturallyGrown?: boolean;
  ingredients?: string[];
  flavouring?: string;
  flavour?: string[];
  dosage?: Dosage | null;
  brewingTime?: BrewingTime | null;
  brewTemperature?: BrewTemperature | null;
}

export interface ProductDetailSpec {
  slug: string;
  kind: ProductKind;
  productCode?: string;

  name: string;
  shortDescription: string;
  longDescription?: string;
  history?: string;

  originCountry?: string | null;

  benefits?: Benefit[];
  contraindications?: Contraindication[];

  safetyType?: SafetyType;

  // Optional label blocks
  tea?: TeaLabelInfo;
  oil?: OilLabelInfo;

  // Optional for all
  ingredients?: string[];

  // Optional metadata (keep flexible)
  meta?: Record<string, string | number | boolean | null>;
}
