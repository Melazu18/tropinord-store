// src/pages/B2B.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  normalizeSupportedLang,
  getLocalizedPath,
} from "@/utils/getLocalizedPath";

type RouteParams = { lang?: string };

type TeaSpec = {
  id: string; // matches selectedId
  name: string;
  productCode: string;

  ingredients: { sv: string; en: string };

  brewing: {
    sv: { dose: string; tempC: string; steepMin: string };
    en: { dose: string; tempC: string; steepMin: string };
  };

  origin: { sv: string; en: string };
  storage: { sv: string; en: string };

  tasteNotes?: { sv: string; en: string };
  expectedResponse?: { sv: string; en: string };

  // for “coming soon” badge on B2B page (doesn't change catalog behavior)
  comingSoon?: boolean;
};

type PriceItem = {
  id: string;
  name: string;

  // Public B2B pricing
  wholesaleSekExVat?: number; // legacy / optional display
  wholesaleSekPerKgExVat?: number; // actual wholesale bag price (1 kg bag)
  retailSekInclVat?: number; // recommended retail / sell price incl VAT (100g)

  notes?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatSek(n: number) {
  if (!isFinite(n)) return "—";
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatNumber(n: number, digits = 2) {
  if (!isFinite(n)) return "—";
  return new Intl.NumberFormat("sv-SE", {
    maximumFractionDigits: digits,
  }).format(n);
}

function isSwedish(lang: string) {
  return lang?.toLowerCase().startsWith("sv");
}

export default function B2B() {
  const { t, i18n } = useTranslation(["common", "catalog"]);
  const params = useParams<RouteParams>();

  const lang = useMemo(
    () => normalizeSupportedLang(params.lang || i18n.language || "en"),
    [params.lang, i18n.language],
  );

  const path = (key: string) => getLocalizedPath(key, lang);

  // UI language helper
  const uiLang = isSwedish(lang) ? "sv" : "en";
  const ui = (svText: string, enText: string) =>
    uiLang === "sv" ? svText : enText;

  const vatRate = 0.12;

  // Product images from public/images
  const productImages: Record<string, string> = {
    "quiet-morning": "/images/BEG.png",
    "warm-resolve": "/images/WomansPower.png",
    "soft-horizon": "/images/WellnessT.png",
    "gentle-garden": "/images/RelaxYourself01.png",
    "sunset-care": "/images/NightCare.png",
  };

  // -----------------------------
  // Tea specs (SV/EN) — TropiNord only
  // -----------------------------
  const teaSpecs: Record<string, TeaSpec> = useMemo(
    () => ({
      "quiet-morning": {
        id: "quiet-morning",
        name: "Quiet Morning",
        productCode: "ALV-BEG-1000",
        ingredients: {
          sv: "Grönt te, citrongräs, mynta, ingefära.",
          en: "Green tea, lemongrass, mint, ginger.",
        },
        brewing: {
          sv: {
            dose: "1 tsk (ca 2 g) per 200 ml",
            tempC: "80°C",
            steepMin: "2–3 min",
          },
          en: {
            dose: "1 tsp (approx. 2 g) per 200 ml",
            tempC: "80°C",
            steepMin: "2–3 min",
          },
        },
        origin: {
          sv: "Råvaror från tropiska regioner.",
          en: "Raw materials sourced from tropical regions.",
        },
        storage: {
          sv: "Förvaras torrt och svalt, skyddat från direkt solljus. Förslut påsen ordentligt efter öppning.",
          en: "Store in a cool, dry place away from direct sunlight. Reseal the bag tightly after opening.",
        },
        tasteNotes: {
          sv: "Frisk och grön med citrongräs, sval mint och en lätt ingefärsvärme.",
          en: "Fresh and green with lemongrass, cool mint, and a gentle ginger warmth.",
        },
        expectedResponse: {
          sv: "En lättsåld “daily drinker” för caféer och wellness — känns ren, uppfriskande och modern.",
          en: "An easy-to-sell daily tea for cafés and wellness — clean, refreshing, and modern.",
        },
      },

      "warm-resolve": {
        id: "warm-resolve",
        name: "Warm Resolve",
        productCode: "ALV-WPB-1000",
        ingredients: {
          sv: "Svart te, kanel, kardemumma, kryddnejlika, ingefära.",
          en: "Black tea, cinnamon, cardamom, clove, ginger.",
        },
        brewing: {
          sv: {
            dose: "1 tsk (ca 2 g) per 200 ml",
            tempC: "95°C",
            steepMin: "3–4 min",
          },
          en: {
            dose: "1 tsp (approx. 2 g) per 200 ml",
            tempC: "95°C",
            steepMin: "3–4 min",
          },
        },
        origin: {
          sv: "Råvaror från tropiska regioner.",
          en: "Raw materials sourced from tropical regions.",
        },
        storage: {
          sv: "Förvaras torrt och svalt, skyddat från direkt solljus. Förslut påsen ordentligt efter öppning.",
          en: "Store in a cool, dry place away from direct sunlight. Reseal the bag tightly after opening.",
        },
        tasteNotes: {
          sv: "Värmande kryddighet med fylligt svart te — kanel/kardemumma med mjuk ingefära.",
          en: "Warming spiced profile on a full black tea base — cinnamon/cardamom with soft ginger.",
        },
        expectedResponse: {
          sv: "Säljer starkt i kalla säsonger och som ‘chai-känsla’ utan att bli för söt.",
          en: "Strong seasonal seller and a ‘chai-like’ option without being overly sweet.",
        },
      },

      "soft-horizon": {
        id: "soft-horizon",
        name: "Soft Horizon",
        productCode: "WOL-WELL-1000",
        ingredients: {
          sv: "äppelbitar, nypon Skal, hibiskus blommor, vita, rosmarin, äppel pommes, äppel skivor, söta Björnbär blad, rosa Peppar, ingefära, citron Verbena, safflor blomblad, smak, naturlig kryddsmak, naturlig örtsmak",
          en: "apple bits, rosehip peels, hibiscus flowers, white, rosemary, apple fries, apple slices, sweet blackberry leaves, pink pepper, ginger, lemon verbena, safflower petals, flavour, natural spice flavour, natural herbal flavour",
        },
        brewing: {
          sv: {
            dose: "1 tsk (ca 2 g) per 200 ml",
            tempC: "75–80°C",
            steepMin: "2–3 min",
          },
          en: {
            dose: "1 tsp (approx. 2 g) per 200 ml",
            tempC: "75–80°C",
            steepMin: "2–3 min",
          },
        },
        origin: {
          sv: "Råvaror från tropiska regioner.",
          en: "Raw materials sourced from tropical regions.",
        },
        storage: {
          sv: "Förvaras torrt och svalt, skyddat från direkt solljus. Förslut påsen ordentligt efter öppning.",
          en: "Store in a cool, dry place away from direct sunlight. Reseal the bag tightly after opening.",
        },
        tasteNotes: {
          sv: "Fruktig äppel/nypon-bas med örtiga toppnoter (rosmarin/verbena) och mild kryddtouch.",
          en: "Fruity apple/rosehip base with herbal top notes (rosemary/verbena) and a gentle spice lift.",
        },
        expectedResponse: {
          sv: "Passar wellness & spa: doftar gott, känns “hälsosam”, fungerar varmt eller som kall brygd.",
          en: "Great for wellness/spa: aromatic, ‘healthy-feeling’, works hot or as cold brew.",
        },
      },

      "gentle-garden": {
        id: "gentle-garden",
        name: "Gentle Garden",
        productCode: "WOL-KZR-2000",
        ingredients: {
          sv: "äppelbitar, nypon Skal, fänkål, söt, stjärnanis, hibiskus blommor, vita, anis Frön, päron skivor, söta Björnbär blad, smak, päron bitar, solros blad, majs blomma blad-vit",
          en: "apple bits, rosehip peels, fennel, sweet, star anise, hibiscus flowers, white, anise seed, pear slices, sweet blackberry leaves, flavour, pear bits, sunflower petals, corn flower petals-white",
        },
        brewing: {
          sv: {
            dose: "1 tsk (ca 2 g) per 200 ml",
            tempC: "80°C",
            steepMin: "2–3 min",
          },
          en: {
            dose: "1 tsp (approx. 2 g) per 200 ml",
            tempC: "80°C",
            steepMin: "2–3 min",
          },
        },
        origin: {
          sv: "Råvaror från tropiska regioner.",
          en: "Raw materials sourced from tropical regions.",
        },
        storage: {
          sv: "Förvaras torrt och svalt, skyddat från direkt solljus. Förslut påsen ordentligt efter öppning.",
          en: "Store in a cool, dry place away from direct sunlight. Reseal the bag tightly after opening.",
        },
        tasteNotes: {
          sv: "Mjukt fruktig (äpple/päron) med rund anis/fänkål — känns lugnande och aromatisk.",
          en: "Soft fruit (apple/pear) with rounded anise/fennel — calming and aromatic.",
        },
        expectedResponse: {
          sv: "Bra för kvällsritual i salong/wellness-miljö (utan medicinska claims).",
          en: "A strong evening ritual option for salons/wellness (without medical claims).",
        },
      },

      "sunset-care": {
        id: "sunset-care",
        name: "SUNSET CARE",
        productCode: "ALV-NCB-1000",
        comingSoon: true,
        ingredients: {
          sv: "Rooibos, hibiskus, apelsinskal, kamomill.",
          en: "Rooibos, hibiscus, orange peel, chamomile.",
        },
        brewing: {
          sv: {
            dose: "1 tsk (ca 2 g) per 200 ml",
            tempC: "95°C",
            steepMin: "4–5 min",
          },
          en: {
            dose: "1 tsp (approx. 2 g) per 200 ml",
            tempC: "95°C",
            steepMin: "4–5 min",
          },
        },
        origin: {
          sv: "Råvaror från tropiska regioner.",
          en: "Raw materials sourced from tropical regions.",
        },
        storage: {
          sv: "Förvaras torrt och svalt, skyddat från direkt solljus. Förslut påsen ordentligt efter öppning.",
          en: "Store in a cool, dry place away from direct sunlight. Reseal the bag tightly after opening.",
        },
        tasteNotes: {
          sv: "Mjuk och rund med naturlig sötma.",
          en: "Smooth and rounded with natural sweetness.",
        },
        expectedResponse: {
          sv: "Perfekt som kvällste i café/spa — koffeinfritt intryck och mjuk profil.",
          en: "Perfect as an evening tea in cafés/spas — gentle profile with a caffeine-free feel.",
        },
      },
    }),
    [],
  );

  // -----------------------------
  // TropiNord items
  // Wholesale is sold in 1kg bags
  // -----------------------------
  const items: PriceItem[] = useMemo(
    () => [
      {
        id: "quiet-morning",
        name: "Quiet Morning",
        wholesaleSekExVat: 119,
        wholesaleSekPerKgExVat: 1190,
        retailSekInclVat: 189,
      },
      {
        id: "warm-resolve",
        name: "Warm Resolve",
        wholesaleSekExVat: 115,
        wholesaleSekPerKgExVat: 1150,
        retailSekInclVat: 179,
      },
      {
        id: "soft-horizon",
        name: "Soft Horizon",
        wholesaleSekExVat: 95,
        wholesaleSekPerKgExVat: 950,
        retailSekInclVat: 149,
      },
      {
        id: "gentle-garden",
        name: "Gentle Garden",
        wholesaleSekExVat: 95,
        wholesaleSekPerKgExVat: 950,
        retailSekInclVat: 149,
      },
      {
        id: "sunset-care",
        name: "SUNSET CARE",
        retailSekInclVat: 0,
        notes: ui("Kommer snart", "Coming soon"),
      },
    ],
    [uiLang],
  );

  // -----------------------------
  // Selection
  // -----------------------------
  const [selectedId, setSelectedId] = useState<string>("quiet-morning");
  const selected = useMemo(
    () => items.find((x) => x.id === selectedId),
    [items, selectedId],
  );
  const spec = teaSpecs[selectedId];

  // -----------------------------
  // Reselling profit calculator
  // Public-safe:
  // purchase price = wholesale price per 1kg bag
  // selling price = resale price per 1kg bag incl VAT
  // -----------------------------
  const [sellPriceSek, setSellPriceSek] = useState<number>(1890);
  const [purchasePriceSek, setPurchasePriceSek] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(12);

  const [paymentFeePct, setPaymentFeePct] = useState<number>(2.9);
  const [shippingPerUnitSek, setShippingPerUnitSek] = useState<number>(0);
  const [otherOverheadPerUnitSek, setOtherOverheadPerUnitSek] =
    useState<number>(0);

  // -----------------------------
  // Cups calculator
  // -----------------------------
  const [gramsPerCup, setGramsPerCup] = useState<number>(2.0);
  const [packSizeG, setPackSizeG] = useState<number>(100);
  const cups = gramsPerCup > 0 ? packSizeG / gramsPerCup : 0;

  // -----------------------------
  // Bulk cost → per cup
  // Public-safe: uses wholesale / kg
  // -----------------------------
  const [bulkCostSekPerKg, setBulkCostSekPerKg] = useState<number>(1190);
  const costPerGram = bulkCostSekPerKg / 1000;
  const costPerCup = costPerGram * gramsPerCup;

  // -----------------------------
  // Café profitability (per cup / per pot)
  // -----------------------------
  const [cafeSellPricePerCup, setCafeSellPricePerCup] = useState<number>(45);
  const [cupsPerDay, setCupsPerDay] = useState<number>(40);
  const [addonsCostPerCup, setAddonsCostPerCup] = useState<number>(0);
  const [potMl, setPotMl] = useState<number>(400);
  const [cupMl, setCupMl] = useState<number>(200);

  const cupsPerPot = cupMl > 0 ? potMl / cupMl : 0;
  const totalTeaCostPerCup = costPerCup + addonsCostPerCup;
  const cafeProfitPerCup = cafeSellPricePerCup - totalTeaCostPerCup;
  const cafeMarginPct =
    cafeSellPricePerCup > 0
      ? (cafeProfitPerCup / cafeSellPricePerCup) * 100
      : 0;
  const cafeProfitPerPot = cafeProfitPerCup * cupsPerPot;
  const cafeProfitPerDay = cafeProfitPerCup * cupsPerDay;

  function applySelected(item?: PriceItem) {
    if (!item) return;

    if (
      typeof item.retailSekInclVat === "number" &&
      item.retailSekInclVat > 0
    ) {
      setSellPriceSek(item.retailSekInclVat * 10);
    }

    if (typeof item.wholesaleSekPerKgExVat === "number") {
      setPurchasePriceSek(item.wholesaleSekPerKgExVat);
      setBulkCostSekPerKg(item.wholesaleSekPerKgExVat);
    } else {
      setPurchasePriceSek(0);
      setBulkCostSekPerKg(0);
    }
  }

  useEffect(() => {
    const current = items.find((x) => x.id === selectedId);
    applySelected(current);
  }, [selectedId, items]);

  // Profit outputs
  const sellPriceExVat = sellPriceSek / (1 + vatRate);
  const paymentFee = (sellPriceSek * clamp(paymentFeePct, 0, 100)) / 100;

  const totalCostPerUnit =
    purchasePriceSek +
    shippingPerUnitSek +
    otherOverheadPerUnitSek +
    paymentFee;

  const grossProfitPerUnit = sellPriceExVat - totalCostPerUnit;
  const grossMarginPct =
    sellPriceExVat > 0 ? (grossProfitPerUnit / sellPriceExVat) * 100 : 0;

  const totalProfit = grossProfitPerUnit * quantity;
  const totalRevenue = sellPriceExVat * quantity;
  const totalCost = totalCostPerUnit * quantity;

  const breakEvenPriceExVat =
    purchasePriceSek + shippingPerUnitSek + otherOverheadPerUnitSek;

  const feeRate = clamp(paymentFeePct, 0, 100) / 100;
  const breakEvenInclFeeExVat =
    1 - feeRate > 0 ? breakEvenPriceExVat / (1 - feeRate) : Infinity;

  const breakEvenPriceInclVat = breakEvenPriceExVat * (1 + vatRate);
  const breakEvenInclFeeInclVat = breakEvenInclFeeExVat * (1 + vatRate);

  // Localized spec rendering
  const specText = (obj?: { sv: string; en: string }) =>
    obj ? obj[uiLang] : "";

  const fieldClass =
    "w-full rounded-lg border px-3 py-2 bg-background text-foreground";

  const comingSoonLabel = t("catalog:comingSoon", {
    defaultValue: ui("Kommer snart", "Coming soon"),
  });

  return (
    <div className="container py-10 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">
          {ui("B2B / Återförsäljarportal", "B2B / Reseller Portal")}
        </h1>

        <p className="text-muted-foreground max-w-3xl">
          {ui(
            "För caféer, salonger, wellnessbutiker och återförsäljare. Räkna marginaler, koppar per 100g/1kg, bulk-lönsamhet och se ingredienser + brygginstruktioner för TropiNord-teer.",
            "For cafés, salons, wellness shops, and retailers. Estimate margins, cups per 100g/1kg, bulk profitability, and view ingredients & brewing instructions for TropiNord teas.",
          )}
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to={path("explore")}
            className="inline-flex items-center rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent transition"
          >
            {ui("Bläddra produkter →", "Browse products →")}
          </Link>

          <a
            href="mailto:support@tropinord.com?subject=B2B%20Inquiry"
            className="inline-flex items-center rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-medium hover:bg-emerald-700 transition"
          >
            {ui("Begär ett grossistkonto", "Request a wholesale account")}
          </a>
        </div>
      </div>

      {/* Reference prices */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          {ui("TropiNord-teer", "TropiNord teas")}
        </h2>

        <p className="text-sm text-muted-foreground">
          {ui(
            "Välj ett te för att fylla i grossistpris per kg-påse och se ingredienser + bryggning + ursprung + förvaring.",
            "Select a tea to prefill wholesale price per kg bag and view full ingredients + brewing + origin + storage.",
          )}
          <span className="block mt-1">
            {ui("Grossistpriser visas ", "Wholesale prices shown are ")}
            <span className="font-medium">{ui("EXKL. MOMS", "EX VAT")}</span>.
          </span>
        </p>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {items.map((x) => {
            const isSelected = selectedId === x.id;
            const s = teaSpecs[x.id];
            const isComingSoon = Boolean(s?.comingSoon);

            return (
              <button
                key={x.id}
                onClick={() => setSelectedId(x.id)}
                className={[
                  "text-left rounded-xl border p-4 transition",
                  "hover:bg-accent/40",
                  isSelected ? "ring-2 ring-emerald-600" : "",
                ].join(" ")}
              >
                {productImages[x.id] ? (
                  <div className="mb-3 overflow-hidden rounded-xl border bg-white dark:bg-neutral-900">
                    <img
                      src={productImages[x.id]}
                      alt={x.name}
                      className="h-44 w-full object-contain"
                    />
                  </div>
                ) : null}

                <div className="flex items-start justify-between gap-3">
                  <div className="font-semibold">{x.name}</div>
                  {isComingSoon ? (
                    <span className="px-2 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                      {comingSoonLabel}
                    </span>
                  ) : null}
                </div>

                <div className="text-sm text-muted-foreground mt-1 space-y-1">
                  {typeof x.wholesaleSekPerKgExVat === "number" ? (
                    <div>
                      {ui(
                        "Grossist / kg-påse (exkl. moms): ",
                        "Wholesale / kg bag (ex VAT): ",
                      )}
                      {formatSek(x.wholesaleSekPerKgExVat)}
                    </div>
                  ) : (
                    <div>
                      {ui(
                        "Grossist / kg-påse (exkl. moms): ",
                        "Wholesale / kg bag (ex VAT): ",
                      )}
                      —
                    </div>
                  )}

                  {typeof x.retailSekInclVat === "number" &&
                  x.retailSekInclVat > 0 ? (
                    <div>
                      {ui(
                        "Vägledande prisnivå från 100g-pris: ",
                        "Guide price level from 100g price: ",
                      )}
                      {formatSek(x.retailSekInclVat)} / 100g
                    </div>
                  ) : null}

                  {x.notes ? (
                    <div className="text-xs opacity-80">{x.notes}</div>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Profit calculator */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          {ui(
            "Vinstkalkyl (återförsäljning av 1kg-påsar)",
            "Net profit calculator (reselling 1kg bags)",
          )}
        </h2>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border p-5 space-y-4">
            <div className="rounded-xl bg-accent/20 p-4 text-sm text-muted-foreground">
              {ui(
                "Denna kalkyl utgår från att 1 enhet = 1 kg-påse. Antal visar alltså hur många 1 kg-påsar som säljs.",
                "This calculator assumes 1 unit = 1 kg bag. Quantity therefore means how many 1 kg bags are sold.",
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <div className="text-sm font-medium">
                  {ui(
                    "Försäljningspris (SEK inkl. moms / 1kg-påse)",
                    "Selling price (SEK incl VAT / 1kg bag)",
                  )}
                </div>
                <input
                  type="number"
                  value={sellPriceSek}
                  onChange={(e) => setSellPriceSek(Number(e.target.value))}
                  className={fieldClass}
                  min={0}
                />
              </label>

              <label className="space-y-1">
                <div className="text-sm font-medium">
                  {ui(
                    "Inköpspris från TropiNord (SEK / 1kg-påse, exkl. moms)",
                    "Purchase price from TropiNord (SEK / 1kg bag, ex VAT)",
                  )}
                </div>
                <input
                  type="number"
                  value={purchasePriceSek}
                  onChange={(e) => setPurchasePriceSek(Number(e.target.value))}
                  className={fieldClass}
                  min={0}
                />
              </label>

              <label className="space-y-1">
                <div className="text-sm font-medium">
                  {ui("Antal 1kg-påsar", "Quantity of 1kg bags")}
                </div>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className={fieldClass}
                  min={1}
                />
              </label>

              <label className="space-y-1">
                <div className="text-sm font-medium">
                  {ui("Betalavgift (%)", "Payment fee (%)")}
                </div>
                <input
                  type="number"
                  value={paymentFeePct}
                  onChange={(e) => setPaymentFeePct(Number(e.target.value))}
                  className={fieldClass}
                  min={0}
                  step={0.1}
                />
              </label>

              <label className="space-y-1">
                <div className="text-sm font-medium">
                  {ui(
                    "Fraktkostnad (SEK / 1kg-påse)",
                    "Shipping cost (SEK / 1kg bag)",
                  )}
                </div>
                <input
                  type="number"
                  value={shippingPerUnitSek}
                  onChange={(e) =>
                    setShippingPerUnitSek(Number(e.target.value))
                  }
                  className={fieldClass}
                  min={0}
                />
              </label>

              <label className="space-y-1">
                <div className="text-sm font-medium">
                  {ui(
                    "Övriga omkostnader (SEK / 1kg-påse)",
                    "Other overhead (SEK / 1kg bag)",
                  )}
                </div>
                <input
                  type="number"
                  value={otherOverheadPerUnitSek}
                  onChange={(e) =>
                    setOtherOverheadPerUnitSek(Number(e.target.value))
                  }
                  className={fieldClass}
                  min={0}
                />
              </label>
            </div>

            <div className="text-xs text-muted-foreground">
              {ui(
                "Tips för caféer: använd café-kalkylen nedan för vinst per kopp/kanna/dag. För te-kostnad per kopp används grossistpris per kg.",
                "Tip for cafés: use the café calculator below to estimate profit per cup/pot/day. Tea cost per cup uses wholesale price per kg.",
              )}
            </div>
          </div>

          <div className="rounded-2xl border p-5 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-accent/30 p-4">
                <div className="text-xs text-muted-foreground">
                  {ui("Vinst / 1kg-påse", "Profit / 1kg bag")}
                </div>
                <div className="text-2xl font-bold">
                  {formatSek(grossProfitPerUnit)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {ui("Marginal: ", "Margin: ")}
                  {formatNumber(grossMarginPct, 1)}%
                </div>
              </div>

              <div className="rounded-xl bg-accent/30 p-4">
                <div className="text-xs text-muted-foreground">
                  {ui("Total vinst", "Total profit")}
                </div>
                <div className="text-2xl font-bold">
                  {formatSek(totalProfit)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {ui("Antal kg-påsar: ", "Qty kg bags: ")}
                  {formatNumber(quantity, 0)}
                </div>
              </div>

              <div className="rounded-xl border p-4">
                <div className="text-xs text-muted-foreground">
                  {ui("Nettoomsättning (exkl. moms)", "Net sales (ex VAT)")}
                </div>
                <div className="text-lg font-semibold">
                  {formatSek(totalRevenue)}
                </div>
              </div>

              <div className="rounded-xl border p-4">
                <div className="text-xs text-muted-foreground">
                  {ui("Totala kostnader", "Total costs")}
                </div>
                <div className="text-lg font-semibold">
                  {formatSek(totalCost)}
                </div>
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <div className="text-sm font-medium mb-1">
                {ui(
                  "Nollpunkt (ungefär)",
                  "Break-even selling price (approx.)",
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {ui(
                  "Före betalavgift (inkl. moms / 1kg-påse): ",
                  "Before payment fee (incl VAT / 1kg bag): ",
                )}
                <span className="font-semibold text-foreground">
                  {formatSek(breakEvenPriceInclVat)}
                </span>
                <br />
                {ui(
                  "Inkl. betalavgift (inkl. moms / 1kg-påse): ",
                  "Including payment fee (incl VAT / 1kg bag): ",
                )}
                <span className="font-semibold text-foreground">
                  {formatSek(breakEvenInclFeeInclVat)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cups + bulk */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          {ui("Kopparkalkyl (100g & 1kg)", "Cups calculator (100g & 1kg)")}
        </h2>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border p-5 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <div className="text-sm font-medium">
                  {ui("Förpackningsstorlek", "Pack size")}
                </div>
                <select
                  value={packSizeG}
                  onChange={(e) => setPackSizeG(Number(e.target.value))}
                  className={fieldClass}
                >
                  <option value={100}>100g</option>
                  <option value={1000}>1kg</option>
                </select>
              </label>

              <label className="space-y-1">
                <div className="text-sm font-medium">
                  {ui("Gram per kopp", "Grams per cup")}
                </div>
                <input
                  type="number"
                  value={gramsPerCup}
                  onChange={(e) => setGramsPerCup(Number(e.target.value))}
                  className={fieldClass}
                  min={0.5}
                  step={0.1}
                />
                <div className="text-xs text-muted-foreground">
                  {ui(
                    "Bas på etikett: ~2g per 200ml",
                    "Label baseline: ~2g per 200ml",
                  )}
                </div>
              </label>
            </div>

            <div className="rounded-xl bg-accent/30 p-4">
              <div className="text-xs text-muted-foreground">
                {ui("Uppskattat antal koppar", "Estimated cups")}
              </div>
              <div className="text-2xl font-bold">{formatNumber(cups, 0)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                ({formatNumber(packSizeG, 0)}g ÷ {formatNumber(gramsPerCup, 1)}
                g)
              </div>
            </div>
          </div>

          <div className="rounded-2xl border p-5 space-y-4">
            <div className="text-sm font-medium">
              {ui(
                "Bulk-kostnad → kostnad per kopp",
                "Bulk cost → cost per cup",
              )}
            </div>

            <label className="space-y-1 block">
              <div className="text-sm font-medium">
                {ui(
                  "Grossistpris (SEK / kg) (exkl. moms)",
                  "Wholesale price (SEK / kg) (ex VAT)",
                )}
              </div>
              <input
                type="number"
                value={bulkCostSekPerKg}
                onChange={(e) => setBulkCostSekPerKg(Number(e.target.value))}
                className={fieldClass}
                min={0}
              />
              <div className="text-xs text-muted-foreground">
                {ui(
                  "Ange grossistpris per kg (exkl. moms).",
                  "Enter wholesale price per kg (ex VAT).",
                )}
              </div>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border p-4">
                <div className="text-xs text-muted-foreground">
                  {ui("Kostnad / gram", "Cost / gram")}
                </div>
                <div className="text-lg font-semibold">
                  {formatSek(costPerGram)}
                </div>
              </div>

              <div className="rounded-xl border p-4">
                <div className="text-xs text-muted-foreground">
                  {ui("Kostnad / kopp", "Cost / cup")}
                </div>
                <div className="text-lg font-semibold">
                  {formatSek(costPerCup)}
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              {ui(
                "För “kostnad per enhet” (burk/påse): (SEK/kg ÷ 1000) × gram-per-enhet.",
                "For “cost per unit” (jar/bag): (SEK/kg ÷ 1000) × grams-per-unit.",
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Café profitability */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          {ui(
            "Café-lönsamhet (per kopp / per kanna)",
            "Café profitability (per cup / per pot)",
          )}
        </h2>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border p-5 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <div className="text-sm font-medium">
                  {ui("Säljpris (SEK / kopp)", "Sell price (SEK / cup)")}
                </div>
                <input
                  type="number"
                  value={cafeSellPricePerCup}
                  onChange={(e) =>
                    setCafeSellPricePerCup(Number(e.target.value))
                  }
                  className={fieldClass}
                  min={0}
                />
              </label>

              <label className="space-y-1">
                <div className="text-sm font-medium">
                  {ui(
                    "Tilläggskostnad (SEK / kopp)",
                    "Add-ons cost (SEK / cup)",
                  )}
                </div>
                <input
                  type="number"
                  value={addonsCostPerCup}
                  onChange={(e) => setAddonsCostPerCup(Number(e.target.value))}
                  className={fieldClass}
                  min={0}
                  step={0.5}
                />
              </label>

              <label className="space-y-1">
                <div className="text-sm font-medium">
                  {ui("Koppstorlek (ml)", "Cup size (ml)")}
                </div>
                <input
                  type="number"
                  value={cupMl}
                  onChange={(e) => setCupMl(Number(e.target.value))}
                  className={fieldClass}
                  min={50}
                  step={10}
                />
              </label>

              <label className="space-y-1">
                <div className="text-sm font-medium">
                  {ui("Kannans volym (ml)", "Pot size (ml)")}
                </div>
                <input
                  type="number"
                  value={potMl}
                  onChange={(e) => setPotMl(Number(e.target.value))}
                  className={fieldClass}
                  min={100}
                  step={50}
                />
              </label>

              <label className="space-y-1 sm:col-span-2">
                <div className="text-sm font-medium">
                  {ui("Koppar per dag", "Cups per day")}
                </div>
                <input
                  type="number"
                  value={cupsPerDay}
                  onChange={(e) => setCupsPerDay(Number(e.target.value))}
                  className={fieldClass}
                  min={0}
                />
              </label>
            </div>

            <div className="text-xs text-muted-foreground">
              {ui(
                "Te-kostnad per kopp räknas automatiskt från SEK/kg och gram per kopp ovan.",
                "Tea cost per cup is auto-calculated from SEK/kg and grams per cup above.",
              )}
            </div>
          </div>

          <div className="rounded-2xl border p-5 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-accent/30 p-4">
                <div className="text-xs text-muted-foreground">
                  {ui(
                    "Te-kostnad / kopp (inkl tillägg)",
                    "Tea cost / cup (incl add-ons)",
                  )}
                </div>
                <div className="text-2xl font-bold">
                  {formatSek(totalTeaCostPerCup)}
                </div>
              </div>

              <div className="rounded-xl bg-accent/30 p-4">
                <div className="text-xs text-muted-foreground">
                  {ui("Vinst / kopp", "Profit / cup")}
                </div>
                <div className="text-2xl font-bold">
                  {formatSek(cafeProfitPerCup)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {ui("Marginal: ", "Margin: ")}
                  {formatNumber(cafeMarginPct, 1)}%
                </div>
              </div>

              <div className="rounded-xl border p-4">
                <div className="text-xs text-muted-foreground">
                  {ui("Koppar per kanna", "Cups per pot")}
                </div>
                <div className="text-lg font-semibold">
                  {formatNumber(cupsPerPot, 1)}
                </div>
              </div>

              <div className="rounded-xl border p-4">
                <div className="text-xs text-muted-foreground">
                  {ui("Vinst / kanna", "Profit / pot")}
                </div>
                <div className="text-lg font-semibold">
                  {formatSek(cafeProfitPerPot)}
                </div>
              </div>

              <div className="rounded-xl border p-4 sm:col-span-2">
                <div className="text-xs text-muted-foreground">
                  {ui("Uppskattad vinst / dag", "Estimated profit / day")}
                </div>
                <div className="text-lg font-semibold">
                  {formatSek(cafeProfitPerDay)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tea Specs */}
      {spec ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            {ui(
              "Te-specifikation (ingredienser & bryggning)",
              "Tea specs (ingredients & brewing)",
            )}
          </h2>

          <div className="rounded-2xl border p-5 space-y-4">
            {productImages[selectedId] ? (
              <div className="overflow-hidden rounded-2xl border bg-white dark:bg-neutral-900">
                <img
                  src={productImages[selectedId]}
                  alt={spec.name}
                  className="mx-auto h-72 w-full object-contain"
                />
              </div>
            ) : null}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <div className="text-sm text-muted-foreground">
                  {ui("Valt te", "Selected tea")}
                </div>
                <div className="text-lg font-semibold">{spec.name}</div>
              </div>

              <div className="flex items-center gap-3">
                {spec.comingSoon ? (
                  <span className="px-2 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                    {comingSoonLabel}
                  </span>
                ) : null}

                <div className="text-sm text-muted-foreground">
                  {ui("Produktkod: ", "Product code: ")}
                  <span className="font-medium text-foreground">
                    {spec.productCode}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-accent/30 p-4">
                <div className="text-xs text-muted-foreground mb-1">
                  {ui("Smaknot", "Taste note")}
                </div>
                <div className="text-sm">
                  {specText(spec.tasteNotes) || "—"}
                </div>
              </div>

              <div className="rounded-xl bg-accent/30 p-4">
                <div className="text-xs text-muted-foreground mb-1">
                  {ui("Förväntad kundreaktion", "Expected customer response")}
                </div>
                <div className="text-sm">
                  {specText(spec.expectedResponse) || "—"}
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border p-4">
                <div className="text-xs text-muted-foreground mb-1">
                  {ui("Ingredienser", "Ingredients")}
                </div>
                <div className="text-sm">{specText(spec.ingredients)}</div>
              </div>

              <div className="rounded-xl border p-4">
                <div className="text-xs text-muted-foreground mb-2">
                  {ui("Bryggning", "Brewing")}
                </div>
                <div className="text-sm space-y-1">
                  <div>
                    <span className="font-medium">{ui("Dos:", "Dose:")}</span>{" "}
                    {spec.brewing[uiLang].dose}
                  </div>
                  <div>
                    <span className="font-medium">
                      {ui("Vatten:", "Water:")}
                    </span>{" "}
                    {spec.brewing[uiLang].tempC}
                  </div>
                  <div>
                    <span className="font-medium">{ui("Tid:", "Steep:")}</span>{" "}
                    {spec.brewing[uiLang].steepMin}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border p-4">
                <div className="text-xs text-muted-foreground mb-1">
                  {ui("Ursprung", "Origin")}
                </div>
                <div className="text-sm">{specText(spec.origin)}</div>
              </div>

              <div className="rounded-xl border p-4">
                <div className="text-xs text-muted-foreground mb-1">
                  {ui("Förvaring", "Storage")}
                </div>
                <div className="text-sm">{specText(spec.storage)}</div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              {ui(
                "Blandat och packat för TropiNord, Trollhättan, Sverige.",
                "Blended and packed for TropiNord, Trollhättan, Sweden.",
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">
            {ui("Te-specifikation", "Tea specs")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {ui(
              "Välj ett TropiNord-te för att se ingredienser och brygginstruktioner.",
              "Select a TropiNord tea to view ingredients and brewing instructions.",
            )}
          </p>
        </section>
      )}
    </div>
  );
}
