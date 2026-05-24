export interface QuoteFormState {
  // step 1
  eventType: "wedding" | "corporate" | "gala" | "other" | "";
  eventDate: string;
  headcount: number | "";
  city: string;
  province: string;
  // step 2
  categories: string[];
  products: string[];
  budget: "<5k" | "5-15k" | "15-50k" | "50k+" | "not-sure" | "";
  needBy: string;
  // step 3
  name: string;
  company: string;
  email: string;
  phone: string;
  notes: string;
  consent: boolean;
  // hidden
  honeypot: string;
}

export const PROVINCES = ["AB","BC","MB","NB","NL","NS","NT","NU","ON","PE","QC","SK","YT"] as const;
export const CATEGORIES = [
  { slug: "chiavari-chairs", label: "Chiavari Chairs" },
  { slug: "banquet-tables", label: "Banquet Tables" },
  { slug: "chair-covers-and-sashes", label: "Chair Covers & Sashes" },
  { slug: "linens", label: "Linens" },
  { slug: "charger-plates", label: "Charger Plates" },
  { slug: "centerpieces-and-florals", label: "Centerpieces & Florals" },
  { slug: "stage-and-backdrop", label: "Stage & Backdrop" },
  { slug: "dishes-and-glassware", label: "Dishes & Glassware" },
  { slug: "event-lighting", label: "Event Lighting" },
  { slug: "pipe-and-drape", label: "Pipe & Drape" },
] as const;
