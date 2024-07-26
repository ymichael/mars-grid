"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ResponsiveCard } from "@/components/Card";
import { getEligibleCards, Card } from "@/lib/allCards";
import { allRules, Rule } from "@/lib/rules";
import { Button } from "@/components/ui/button";

const allCards = getEligibleCards();

function DebugCardPageInner({ params }: { params: { cardId: string } }) {
  const router = useRouter();
  const [cardId, setCardId] = useState(params.cardId);
  const cardIdx = allCards.findIndex((card) => card.id === cardId);
  const card: Card | undefined = allCards[cardIdx];
  const goToPrevCard = useCallback(() => {
    if (cardIdx > 0) {
      const prevCardId = allCards[cardIdx - 1].id;
      router.push(`/debug/card/${prevCardId}`);
      setCardId(prevCardId);
    }
  }, [cardIdx, router]);

  const goToNextCard = useCallback(() => {
    if (cardIdx < allCards.length - 1) {
      const nextCardId = allCards[cardIdx + 1].id;
      router.push(`/debug/card/${nextCardId}`);
      setCardId(nextCardId);
    }
  }, [cardIdx, router]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // ignore if command is held
      if (event.metaKey) {
        return;
      }
      if (event.key === "ArrowLeft") {
        goToPrevCard();
      } else if (event.key === "ArrowRight") {
        goToNextCard();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cardIdx, router, goToPrevCard, goToNextCard]);

  const getRuleOrder = (ruleId: string) => {
    // Tag rules should be at the bottom
    if (ruleId.startsWith("tag_") || ruleId.startsWith("req_tag_")) {
      return 100;
    }
    if (
      ruleId === "event_card" ||
      ruleId === "active_card" ||
      ruleId === "green_card"
    ) {
      return 90;
    }
    // Cost rules should be at the bottom too
    if (ruleId.startsWith("cost_ge_") || ruleId.startsWith("cost_le_")) {
      return 80;
    }
    // Has action, draws card should be at the top
    if (ruleId.startsWith("has_action") || ruleId.startsWith("draws_card")) {
      return 0;
    }
    return 50;
  };

  const sortedRules = [...allRules].sort((a, b) => {
    const aMatches = a.matches(card);
    const bMatches = b.matches(card);
    if (aMatches && !bMatches) return -1;
    if (!aMatches && bMatches) return 1;
    // If both match or both don't match, sort by rule type using a custom function
    if (aMatches === bMatches) {
      const ruleOrderA = getRuleOrder(a.id);
      const ruleOrderB = getRuleOrder(b.id);
      return ruleOrderA - ruleOrderB;
    }
    return 0;
  });
  if (!card) {
    return <div>Card {cardId} not found</div>;
  }
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4 py-4 px-2">
        <h1 className="text-2xl font-bold">{card.name}</h1>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={goToPrevCard}
            disabled={cardIdx === 0}
          >
            Previous Card
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={goToNextCard}
            disabled={cardIdx === allCards.length - 1}
          >
            Next Card
          </Button>
        </div>
      </div>
      <div className="flex">
        <div className="flex flex-col w-1/4 pr-4">
          <div className=" aspect-[15/18] max-w-full flex items-center justify-center rounded-md overflow-hidden">
            <ResponsiveCard cardId={card.id} />
          </div>
          <pre className="bg-card p-2 text-xs rounded overflow-auto">
            {JSON.stringify(card, null, 2)}
          </pre>
        </div>
        <div className="grow">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-secondary">
                <th className="border p-2">Rule</th>
                <th className="border p-2">Matches</th>
              </tr>
            </thead>
            <tbody>
              {sortedRules.map((rule: Rule) => (
                <tr key={rule.id}>
                  <td className="border p-2">{rule.description}</td>
                  <td className="border p-2 text-center">
                    {rule.matches(card) ? "✅" : "❌"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const DebugCardPage = dynamic(() => Promise.resolve(DebugCardPageInner), {
  ssr: false,
});
export default DebugCardPage;
