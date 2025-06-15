import { useState } from "react";
import SearchBar from "./SearchBar";
import FilterRow from "./FilterRow";
import MovieGrid from "./MovieGrid";
import liloAndStitchPoster from "../../Assets/Photos/liloAndStitchPoster.jpg";
import strawPoster from "../../Assets/Photos/strawPoster.jpg";
import predatorKillerOfKillersPoster from "../../Assets/Photos/predatorKillerOfKillersPoster.jpg";
import theAmateurPoster from "../../Assets/Photos/theAmateurPoster.jpg";
import theAccountant2Poster from "../../Assets/Photos/theAccountant2Poster.jpg";

const dummyMovies = [
  { id: 1, title: "Predator: Killer of Killers", year: "2025", poster: predatorKillerOfKillersPoster, tag: "HD" },
  { id: 2, title: "STRAW", year: "2025", poster: strawPoster, tag: "HD" },
  { id: 3, title: "The Amateur", year: "2025", poster: theAmateurPoster, tag: "HD" },
  { id: 4, title: "The Accountant 2", year: "2025", poster: theAccountant2Poster, tag: "HD" },
  { id: 5, title: "Lilo & Stitch", year: "2025", poster: liloAndStitchPoster, tag: "CAM" },
  // … add more or fetch from TMDB later
];

const filterLabels = ["Trending", "Top IMDb", "Ação", "Comédia", "Drama"];

export default function MoviesPage() {
  const [activeFilter, setActiveFilter] = useState(filterLabels[0]);
  const [movies, setMovies] = useState(dummyMovies);

  const handleSearch = (term: string) => {
    // TODO: call backend / TMDB
    console.log("Searching for:", term);
  };

  const handleFilter = (label: string) => {
    setActiveFilter(label);
    // TODO: filter / fetch data
  };

  return (
    <div className="px-5 pb-16">
      <SearchBar onSearch={handleSearch} />
      <FilterRow
        filters={filterLabels}
        active={activeFilter}
        onChange={handleFilter}
      />
      <MovieGrid movies={movies} />
    </div>
  );
}
