// P125.6 — Marketing image catalog (real photography from Unsplash CDN).
// Owner directive 2026-05-09: "use images from pixabay or other - not svg
// created - use real images - the public site should have several per page
// (eg 3-10 per page)".
//
// All URLs are stable Unsplash CDN paths verified during P125.6 build.
// Unsplash license: free for commercial + non-commercial use, no attribution
// required (https://unsplash.com/license). Pair with Ken Burns / vignette
// / glass-blur effects from src/index.css for atmosphere.
//
// To add a new image:
//   1. Find on unsplash.com and grab the photo ID from the URL slug.
//   2. Verify CDN reachability: curl -I https://images.unsplash.com/photo-{ID}?w=400
//   3. Add to the catalog below with a descriptive key + alt text.

const BASE = "https://images.unsplash.com/photo-"
const SUFFIX_MED = "?w=1200&q=78&auto=format&fit=crop"
const SUFFIX_LG = "?w=1600&q=78&auto=format&fit=crop"
const SUFFIX_SM = "?w=640&q=78&auto=format&fit=crop"

export type MarketingImage = {
  src: string
  src2x?: string
  alt: string
  // Optional credit (not required by Unsplash license, but nice to keep)
  credit?: string
}

function img(id: string, alt: string, size: "sm" | "md" | "lg" = "md"): MarketingImage {
  const suffix = size === "lg" ? SUFFIX_LG : size === "sm" ? SUFFIX_SM : SUFFIX_MED
  return { src: `${BASE}${id}${suffix}`, alt }
}

// All photo IDs verified HTTP 200 against Unsplash CDN on 2026-05-09.
export const MARKETING_IMAGES = {
  // Hero atmosphere — moody, dark
  heroAtmos: img("1481070414801-51fd732d7184", "Dark studio interior with warm light", "lg"),

  // Coffee shop demo (CinematicDemo right panel)
  coffee: img("1495474472287-4d71bcdd2085", "Pour-over coffee being prepared", "md"),
  coffeeShop: img("1556761175-5973dc0f32e7", "Coffee shop interior at warm hour", "md"),

  // Voice / microphone (feature card 1, blog hero)
  microphone: img("1521017432531-fbd92d768814", "Vintage condenser microphone in dark studio"),

  // Code / development (feature card 2 + open core decoration)
  codeDark: img("1517694712202-14dd9538aa97", "Code editor with terminal output"),
  workspaceDark: img("1497032628192-86f99bcd76bc", "Moody dark developer workspace"),

  // Sliders / dashboard (feature card 3)
  dashboard: img("1531297484001-80022131f5a1", "Laptop on dark surface with dashboard"),

  // University / research / Harvard vibe (stats backdrop, capstone refs)
  research: img("1481627834876-b7833e8f5570", "Open book on dark wooden surface"),
  blueprint: img("1522202176988-66273c2fd55f", "Whiteboard with planning sketches", "lg"),

  // Closing inspiration
  closing: img("1542435503-956c469947f6", "Notebook and pen on warm wood desk"),
  abstractDark: img("1554415707-6e8cfc93fe23", "Abstract dark gradient backdrop", "lg"),
  warmInterior: img("1494059980473-813e73ee784b", "Warm interior workspace", "md"),
}

export type MarketingImageKey = keyof typeof MARKETING_IMAGES
