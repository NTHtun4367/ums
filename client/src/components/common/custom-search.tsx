import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

interface Props {
  search: string;
  setSearch: (search: string) => void;
  title: string;
}

function CustomSearch({ search, setSearch, title }: Props) {
  return (
    <div className="relative w-full md:w-72">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={`Search ${title}...`}
        className="pl-9 bg-white dark:bg-slate-950"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default CustomSearch;
