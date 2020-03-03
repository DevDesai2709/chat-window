import React, { useEffect, useRef, ReactNode } from "react";

export const ChatBody = (p: { children?: ReactNode }) => {
  const container = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    container &&
      container.current &&
      container.current.scrollTo({
        top: container.current.scrollHeight,
        behavior: "smooth"
      });
  }, [p.children]);

  return (
    <div
      ref={container}
      style={{
        flex: 1,
        overflowY: "auto"
      }}
    >
      {p.children}
    </div>
  );
};
