const BASE = "/api/movies";

export interface MovieSummary {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  [key: string]: any;
}

export interface MovieDetails extends MovieSummary {
  overview: string;
  runtime: number;
  genres: { id: number; name: string }[];
}

async function request<T>(url: string, params?: Record<string, string | number>): Promise<T> {
  const qs =
    params && Object.keys(params).length
      ? "?" +
        new URLSearchParams(
          Object.entries(params).map(([k, v]) => [k, String(v)])
        ).toString()
      : "";

  const res = await fetch(`${url}${qs}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} (${url})`);
  return res.json() as Promise<T>;
}


export const MoviesApi = {
  popular(page = 1) {
    return request<MovieSummary[]>(`${BASE}/popular`, { page });
  },

  search(query: string, page = 1) {
    return request<MovieSummary[]>(`${BASE}/search`, { q: query, page });
  },

  details(id: number | string) {
    return request<MovieDetails>(`${BASE}/${id}`);
  },
};
