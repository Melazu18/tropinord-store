import type { Contraindication } from "@/types/productDetails";

export const contraindications = {
  valerian: [
    {
      tag: "sedatives",
      severity: "caution",
      title: "May cause drowsiness",
      details:
        "Valerian can make you sleepy. Avoid driving or operating machinery if you feel drowsy, and avoid combining with alcohol or other sedatives.",
    },
    {
      tag: "pregnancy",
      severity: "caution",
      title: "Pregnancy & breastfeeding",
      details:
        "If pregnant or breastfeeding, consult a healthcare professional before use due to limited safety data.",
    },
    {
      tag: "surgery",
      severity: "caution",
      title: "Before surgery",
      details:
        "Stop using valerian at least 1–2 weeks before scheduled surgery because it may interact with anesthesia/sedatives.",
    },
  ] satisfies Contraindication[],

  stJohnsWort: [
    {
      tag: "drugInteractions",
      severity: "avoid",
      title: "Interacts with many medications",
      details:
        "St. John’s wort can reduce the effectiveness of many medicines (including some antidepressants, birth control, blood thinners, and transplant meds). Consult a pharmacist/doctor before use.",
    },
    {
      tag: "antidepressants",
      severity: "avoid",
      title: "Do not combine with antidepressants",
      details:
        "Combining with SSRIs/SNRIs/MAOIs can increase the risk of serotonin syndrome. Avoid unless supervised by a clinician.",
    },
    {
      tag: "photosensitivity",
      severity: "caution",
      title: "May increase sun sensitivity",
      details:
        "Some people become more sensitive to sunlight. Use sun protection if you notice redness or sensitivity.",
    },
    {
      tag: "pregnancy",
      severity: "caution",
      title: "Pregnancy & breastfeeding",
      details:
        "If pregnant or breastfeeding, consult a healthcare professional before use due to limited safety data and interaction risk.",
    },
  ] satisfies Contraindication[],
};
