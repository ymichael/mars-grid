import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Card, getEligibleCards } from "@/lib/allCards";
import { useDebounce } from "use-debounce";
import uFuzzy from "@leeoniya/ufuzzy";

const uf = new uFuzzy();

export function CardSearch({
  open,
  setOpen,
  onSelectCard,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelectCard: (card: Card | null) => void;
}) {
  const eligibleCards = useMemo(() => getEligibleCards(), []);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const getResultsImmediate = useCallback(
    (query: string) => {
      if (query.length === 0) {
        return [];
      }
      const [idxs, info, order] = uf.search(
        eligibleCards.map((card) => card.name),
        query
      );
      if (!idxs) {
        return [];
      }
      return idxs.map((idx) => eligibleCards[idx]);
    },
    [query, eligibleCards]
  );

  const filteredResults = useMemo(
    () => getResultsImmediate(debouncedQuery),
    [debouncedQuery, eligibleCards]
  );
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search for a card..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {filteredResults.length > 0 ? (
          <CommandGroup>
            {filteredResults.map((card) => (
              <CommandItem key={card.id} onSelect={() => onSelectCard(card)}>
                {card.name}
              </CommandItem>
            ))}
          </CommandGroup>
        ) : debouncedQuery.length > 0 ? (
          <CommandEmpty>No cards found.</CommandEmpty>
        ) : (
          <CommandEmpty>Search for a card...</CommandEmpty>
        )}
      </CommandList>
    </CommandDialog>
  );
}
