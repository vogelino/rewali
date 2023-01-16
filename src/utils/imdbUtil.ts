interface IMDBKeyValueType {
  key: string;
  value: string;
}

export interface IMDBSearchResultType {
  id: string;
  description: string;
  image: string;
  resultType: string | "Title";
  title: string;
  runtimeStr: string;
  genres?: string;
  genreList?: IMDBKeyValueType[];
  contentRating: string;
  imDbRatingVotes: string;
  metacriticRating: string;
  plot: string;
  stars?: string;
  starList?: {
    id: string;
    name: string;
  }[];
}

interface IMDBResponseType {
  errorMessage: string;
  expression: string;
  searchType: string | "All";
  results: IMDBSearchResultType[];
}

export async function searchIMDBItems(
  searchTerm?: string | null | undefined
): Promise<IMDBResponseType> {
  if (!searchTerm)
    return {
      results: [],
      errorMessage: "",
      expression: searchTerm || "",
      searchType: "All",
    };
  const key = process.env.IMDB_API_KEY || "";
  const res = await fetch(
    `https://imdb-api.com/en/API/AdvancedSearch/${key}/?title=${encodeURIComponent(
      searchTerm
    )}`
  );
  const items = (await res.json()) as IMDBResponseType;
  return items;
}
