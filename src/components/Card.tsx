"use client";

import { getCardById } from "@/lib/allCards";
import useResizeObserver from "@react-hook/resize-observer";
import React, { useMemo, useRef, useState, useLayoutEffect } from "react";

const useSize = (target: React.RefObject<HTMLElement>) => {
  const [size, setSize] = useState<DOMRect | undefined>(undefined);
  useLayoutEffect(() => {
    if (target.current) {
      setSize(target.current.getBoundingClientRect());
    }
  }, [target]);
  useResizeObserver(target, (entry) => setSize(entry.contentRect));
  return size;
};

export function ResponsiveCard({ cardId }: { cardId: string }) {
  const card = useMemo(() => getCardById(cardId), [cardId]);
  const parentRef = useRef<HTMLDivElement>(null);
  const size = useSize(parentRef);
  const scale = useMemo(() => {
    if (size && parentRef.current) {
      const scaleX = size.width / 275;
      const scaleY = size.height / 420;
      return Math.min(scaleX, scaleY);
    }
    return 1;
  }, [size]);
  return (
    <div
      ref={parentRef}
      className="w-full aspect-[15/18] flex justify-center items-center"
    >
      <div
        style={{
          transform: `scale(${scale})`,
          width: "fit-content",
          maxHeight: size?.height,
        }}
        dangerouslySetInnerHTML={{ __html: card.html }}
      />
    </div>
  );
}
