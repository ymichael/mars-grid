"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ResponsiveCard } from "@/components/Card";
import { getEligibleCards } from "@/lib/allCards";
import { allRules, getRuleById } from "@/lib/rules";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const allCards = getEligibleCards();

function DebugRulePageInner({ params }: { params: { ruleId: string } }) {
  const router = useRouter();
  const [ruleId, setRuleId] = useState(params.ruleId);
  const rule = getRuleById(ruleId);

  const matchingCards = allCards.filter((card) => rule?.matches(card));
  const nonMatchingCards = allCards.filter((card) => !rule?.matches(card));

  const goToPrevRule = useCallback(() => {
    const currentIndex = allRules.findIndex((r) => r.id === ruleId);
    if (currentIndex > 0) {
      const prevRuleId = allRules[currentIndex - 1].id;
      router.push(`/debug/rule/${prevRuleId}`);
      setRuleId(prevRuleId);
    }
  }, [ruleId, router]);

  const goToNextRule = useCallback(() => {
    const currentIndex = allRules.findIndex((r) => r.id === ruleId);
    if (currentIndex < allRules.length - 1) {
      const nextRuleId = allRules[currentIndex + 1].id;
      router.push(`/debug/rule/${nextRuleId}`);
      setRuleId(nextRuleId);
    }
  }, [ruleId, router]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // ignore if command is held
      if (event.metaKey) {
        return;
      }
      if (event.key === "ArrowLeft") {
        goToPrevRule();
      } else if (event.key === "ArrowRight") {
        goToNextRule();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [ruleId, goToPrevRule, goToNextRule]);
  if (!rule) {
    return <div>Rule: {ruleId} not found</div>;
  }
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4 py-4 px-2">
        <h1 className="text-2xl font-bold">{rule.description}</h1>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={goToPrevRule}
            disabled={allRules.findIndex((r) => r.id === ruleId) === 0}
          >
            Previous Rule
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={goToNextRule}
            disabled={
              allRules.findIndex((r) => r.id === ruleId) === allRules.length - 1
            }
          >
            Next Rule
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 px-2">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Matching Cards ({matchingCards.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {matchingCards.map((card) => (
              <div key={card.id} className="flex flex-col items-center">
                <Link href={`/debug/card/${card.id}`}>
                  <div className="w-[120px] aspect-[15/18] flex items-center justify-center rounded-md overflow-hidden">
                    <ResponsiveCard cardId={card.id} />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Non-Matching Cards ({nonMatchingCards.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {nonMatchingCards.map((card) => (
              <div key={card.id} className="flex flex-col items-center">
                <Link href={`/debug/card/${card.id}`}>
                  <div className="w-[120px] aspect-[15/18] flex items-center justify-center rounded-md overflow-hidden">
                    <ResponsiveCard cardId={card.id} />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const DebugRulePage = dynamic(() => Promise.resolve(DebugRulePageInner), {
  ssr: false,
});
export default DebugRulePage;
