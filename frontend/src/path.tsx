//faz a conexção com o backend, colocando o link de onde ele ta hospedado
const baseurl = {
  apiUrl: "http://localhost:3001/api",
};
export const PATH = {
  base: baseurl.apiUrl,
  MOVIES: {
    ROOT: "/movies",
    POPULAR: "/movies/popular",
    SEARCH: "/movies/search",
  },
  REVIEWS: "/reviews",
};
