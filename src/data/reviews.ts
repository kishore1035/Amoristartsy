export interface Review {
  id: string;
  author: string;
  rating: number; // 1 to 5
  date: string;
  artworkId?: string; // Optional reference to a specific artwork ID
  artworkTitle: string; // e.g. "Crescent Moon Camping Landscape" or "Custom Commission"
  category?: string;
  comment: string;
  location?: string;
  verified: boolean;
  helpfulCount: number;
  avatarBg?: string;
}

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    author: "Ananya Sharma",
    rating: 5,
    date: "October 1, 2026",
    artworkId: "canvas-05",
    artworkTitle: "Crescent Moon Camping Landscape",
    category: "Landscapes & Illustrative",
    comment:
      "The texture on this piece is breathtaking! You can feel the distinct layers of acrylic paint and the starry moon details. The parcel was wrapped with eco-friendly kraft paper and included a sweet handwritten artist note from Guna. Looks stunning on my reading shelf!",
    location: "Bengaluru, Karnataka",
    verified: true,
    helpfulCount: 14,
    avatarBg: "bg-amber-100 text-amber-900 border-amber-300",
  },
  {
    id: "rev-2",
    author: "Karthik Raja",
    rating: 5,
    date: "September 27, 2026",
    artworkId: "canvas-22",
    artworkTitle: "Spider-Man Electric Aura",
    category: "Pop Culture",
    comment:
      "Ordered this mini canvas for my desk setup. The lightning effects and electric aura pop with such vibrant intensity. Everyone who walks into my room asks where I got it. 10/10 craftsmanship from amoristartsy!",
    location: "Chennai, Tamil Nadu",
    verified: true,
    helpfulCount: 9,
    avatarBg: "bg-rose-100 text-rose-900 border-rose-300",
  },
  {
    id: "rev-3",
    author: "Meera & Siddharth",
    rating: 5,
    date: "September 22, 2026",
    artworkTitle: "Custom Heart Canvas Sunset Commission",
    category: "Custom Commission",
    comment:
      "We commissioned Guna for an anniversary painting on a heart-shaped canvas recreating our favorite beach sunset in Pondicherry. The blend of terracotta and golden hues took our breath away. Delivered promptly with zero damage. Thank you Guna!",
    location: "Mumbai, Maharashtra",
    verified: true,
    helpfulCount: 18,
    avatarBg: "bg-teal-100 text-teal-900 border-teal-300",
  },
  {
    id: "rev-4",
    author: "Pooja V.",
    rating: 5,
    date: "September 15, 2026",
    artworkTitle: "Mini Floral Bouquet Canvas with Wooden Easel",
    category: "Traditional",
    comment:
      "Such an affordable price for an authentic hand-painted canvas! The wooden display easel that comes with it makes it the cutest tabletop aesthetic decor. Will definitely be ordering more for Diwali gifts.",
    location: "Hyderabad, Telangana",
    verified: true,
    helpfulCount: 7,
    avatarBg: "bg-purple-100 text-purple-900 border-purple-300",
  },
  {
    id: "rev-5",
    author: "Rohan Nair",
    rating: 5,
    date: "September 08, 2026",
    artworkTitle: "Studio Ghibli Inspired Starry Sky",
    category: "Pop Culture",
    comment:
      "As a massive anime fan, seeing Guna's brushwork translate the whimsical spirit of Ghibli into a physical acrylic piece was magical. The colors are even richer in person than on camera.",
    location: "Kochi, Kerala",
    verified: true,
    helpfulCount: 11,
    avatarBg: "bg-blue-100 text-blue-900 border-blue-300",
  },
  {
    id: "rev-6",
    author: "Divya Krishnan",
    rating: 5,
    date: "August 30, 2026",
    artworkTitle: "Custom Nameplate Typography Canvas",
    category: "Typography",
    comment:
      "Guna was so cooperative on WhatsApp when discussing color themes and fonts for our newly renovated home entrance. The gold pigment accents gleam warmly under warm lighting. Highly recommended!",
    location: "Coimbatore, Tamil Nadu",
    verified: true,
    helpfulCount: 6,
    avatarBg: "bg-emerald-100 text-emerald-900 border-emerald-300",
  },
];

const LOCAL_STORAGE_KEY = "amoristartsy_reviews_v1";

// Safe retrieval from localStorage
export function getSavedReviews(): Review[] {
  if (typeof window === "undefined") {
    return INITIAL_REVIEWS;
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return INITIAL_REVIEWS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_REVIEWS;
  } catch (e) {
    console.error("Error reading reviews from localStorage", e);
    return INITIAL_REVIEWS;
  }
}

// Save a new review to localStorage
export function saveNewReview(reviewData: Omit<Review, "id" | "date" | "helpfulCount">): Review {
  const existing = getSavedReviews();
  const dateFormatted = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const avatarColors = [
    "bg-amber-100 text-amber-900 border-amber-300",
    "bg-rose-100 text-rose-900 border-rose-300",
    "bg-emerald-100 text-emerald-900 border-emerald-300",
    "bg-blue-100 text-blue-900 border-blue-300",
    "bg-purple-100 text-purple-900 border-purple-300",
    "bg-teal-100 text-teal-900 border-teal-300",
  ];
  const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

  const newReview: Review = {
    ...reviewData,
    id: `rev-${Date.now()}`,
    date: dateFormatted,
    helpfulCount: 0,
    avatarBg: randomColor,
  };

  const updated = [newReview, ...existing];
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("amoristartsy_reviews_updated"));
    }
  } catch (e) {
    console.error("Error saving review to localStorage", e);
  }

  return newReview;
}

// Mark helpful
export function incrementReviewHelpful(reviewId: string): void {
  if (typeof window === "undefined") return;
  try {
    const reviews = getSavedReviews();
    const updated = reviews.map((r) =>
      r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
    );
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("amoristartsy_reviews_updated"));
  } catch (e) {
    console.error("Error updating helpful count", e);
  }
}

export const incrementHelpful = incrementReviewHelpful;

