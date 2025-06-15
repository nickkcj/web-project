import { FC } from "react";

interface Props {
  filters: string[];
  active: string;
  onChange: (filter: string) => void;
}

const FilterRow: FC<Props> = ({ filters, active, onChange }) => (
  <div className="flex flex-wrap gap-3 justify-center mt-8">
    {filters.map((f) => (
      <button
        key={f}
        onClick={() => onChange(f)}
        className={`px-4 py-1.5 rounded-full text-sm transition
          ${
            active === f
              ? "bg-amber-500 text-white"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
      >
        {f}
      </button>
    ))}
  </div>
);

export default FilterRow;
