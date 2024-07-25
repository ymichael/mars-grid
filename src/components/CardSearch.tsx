import { useState, useMemo, useEffect, useCallback } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getCardById, getEligibleCards } from "@/lib/allCards";
import { useDebounce } from "use-debounce";
import uFuzzy from "@leeoniya/ufuzzy";

const uf = new uFuzzy();

export function CardSearch({
  open,
  setOpen,
  onSelectCard,
  selectedCardId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelectCard: (cardId: string | null) => void;
  selectedCardId: string | null;
}) {
  const eligibleCards = useMemo(() => getEligibleCards(), []);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);
  const selectedCardOrNull = useMemo(() => {
    if (!selectedCardId) {
      return null;
    }
    return getCardById(selectedCardId);
  }, [selectedCardId]);
  const getResultsImmediate = useCallback(
    (query: string) => {
      if (query.length === 0) {
        return [];
      }
      const [idxs, _, __] = uf.search(
        eligibleCards.map((card) => card.name),
        query,
      );
      if (!idxs) {
        return [];
      }
      return idxs.map((idx) => eligibleCards[idx]);
    },
    [eligibleCards],
  );

  const filteredResults = useMemo(
    () => getResultsImmediate(debouncedQuery),
    [debouncedQuery, getResultsImmediate],
  );
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search for a card..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {selectedCardOrNull && !debouncedQuery && (
          <CommandGroup>
            <CommandItem onSelect={() => onSelectCard(null)}>
              Remove {JSON.stringify(selectedCardOrNull.name)}
            </CommandItem>
          </CommandGroup>
        )}
        {filteredResults.length > 0 ? (
          <CommandGroup>
            {filteredResults.map((card) => (
              <CommandItem
                key={card.id}
                onSelect={() => {
                  onSelectCard(card.id);
                }}
              >
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
