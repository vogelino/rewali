interface GoogleListPriceType {
  amout: number;
  currencyCode: string;
}

interface GoogleOfferListPriceType {
  amoutInMicros: number;
  currencyCode: string;
}

export interface GoogleBookApiType {
  id: string;
  etag: string;
  kind: "books#volumes";
  selfLink: string;
  accessInfo: {
    accessViewStatus: string;
    country: string;
    embeddable: boolean;
    epub: { isAvailable: boolean };
    pdf: { isAvailable: boolean; acsTokenLink?: string };
    publicDomain: boolean;
    quoteSharingAllowed: boolean;
    textToSpeachPermission: "NOT_ALLOWED" | "ALLOWED";
    viewability: string;
    webReaderLink: string;
  };
  volumeInfo: {
    authors?: string[];
    averageRating?: number;
    ratingsCount?: number;
    canonicalVolumeLink: string;
    categories: string[];
    description: string;
    imageLinks: { smallThumbnail: string; thumbnail: string };
    industryIdentifiers: { type: "ISBN_10" | "ISBN_13"; identifier: string }[];
    infoLink: string;
    language: string;
    maturityRating: string;
    pageCount: number;
    previewLink: string;
    printType: string;
    publishedDate: string;
    publisher: string;
    readingMode: { text: boolean; image: boolean };
    title: string;
    subtitle?: string;
  };
  saleInfo: {
    country: string;
    isEbook: boolean;
    saleability: "FOR_SALE" | "NOT_FOR_SALE";
    listPrice?: GoogleListPriceType;
    offers?: {
      finskyOfferType: number;
      giftable: boolean;
      listPrice: GoogleOfferListPriceType;
      retailPrice: GoogleOfferListPriceType;
    }[];
    retailPrice: GoogleListPriceType;
  };
}

interface GoogleBooksSearchResultType {
  kind: GoogleBookApiType["kind"];
  totalItems: number;
  items: GoogleBookApiType[];
}

export async function searchGoogleBooks(
  searchTerm?: string | null | undefined
): Promise<GoogleBooksSearchResultType> {
  if (!searchTerm) return { items: [], kind: "books#volumes", totalItems: 0 };
  const key = process.env.GOOGLE_API_KEY || "";
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?key=${key}&q=${encodeURIComponent(
      searchTerm
    )}`
  );
  const items = (await res.json()) as GoogleBooksSearchResultType;
  return items;
}
