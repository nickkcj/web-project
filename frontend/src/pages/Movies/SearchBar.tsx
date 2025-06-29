import { FC, useState, FormEvent } from "react";
import { Search, ArrowRight } from "lucide-react";

interface Props {
  onSearch: (term: string) => void;
  activeTab?: "movies" | "users";
}

const SearchBar: FC<Props> = ({ onSearch, activeTab }) => {
  const [query, setQuery] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form
      onSubmit={submit}
      className="relative w-full max-w-3xl mt-10 mx-auto"
    >
      <Search
        size={20}
        className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={
          activeTab === "users"
            ? "Encontre pessoas pelo nome ou e-mail…"
            : "Encontre quem compartilha da sua paixão por cinema"
        }
        className="w-full h-14 pl-12 pr-16 rounded-full bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 hover:bg-amber-600"
        aria-label="Pesquisar"
      >
        <ArrowRight size={18} />
      </button>
    </form>
  );
};

export default SearchBar;
