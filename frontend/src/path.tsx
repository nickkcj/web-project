//faz a conexção com o backend, colocando o link de onde ele ta hospedado
const baseurl = {
  apiUrl: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  tmdbImageBaseUrl: "https://image.tmdb.org/t/p/original",
};
export const PATH = {
  base: baseurl.apiUrl,
  imageUrl: baseurl.tmdbImageBaseUrl,
  MOVIES: {
    ROOT: "/movies",
    POPULAR: "/movies/popular",
    SEARCH: "/movies/search",
  },
  REVIEWS: "/reviews",
};
