import { Search } from 'lucide-react';

interface SearchFormProps {
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => Promise<void>;
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
}

export function SearchForm({ handleSubmit, searchInput, setSearchInput }: SearchFormProps) {
  return (
    <form className="me-2 grid w-full max-w-lg lg:max-w-sm" onSubmit={handleSubmit}>
      <label htmlFor="search" className="sr-only">
        Search
      </label>

      <input
        type="search"
        name="search"
        id="search"
        placeholder="Search"
        className="placeholder:text-navbar-foreground text-primary-foreground focus-visible:outline-ring outline-navbar-border bg-navbar-accent col-start-1 row-start-1 block w-full rounded-md py-1.5 ps-3 pe-10 text-base outline -outline-offset-1 focus-visible:outline-2 focus-visible:-outline-offset-1 sm:text-sm"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <Search
        className="text-navbar-foreground pointer-events-none col-start-1 row-start-1 me-3 aspect-square w-5 self-center justify-self-end"
        aria-hidden="true"
      />
    </form>
  );
}
