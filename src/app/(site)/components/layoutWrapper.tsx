"use client";

import { usePathname } from "next/navigation";

// Normal header: py-[20px] + logo max-h-[64px] = 104px tall, starts at top-[20px]
// Content should start at: top-[10px] (wrapper) + pt = after header bottom (124px viewport)
// → pt-[114px] to match (124 - 10)
//
// Condensed header: py-[8px] + logo max-h-[36px] = 52px tall, starts at top-[20px]
// Header bottom at 72px viewport → pt-[62px] (72 - 10)

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const condensed = pathname?.startsWith("/work");

  return (
    <div
      className={
        "fixed md:top-[10px] md:right-[10px] md:left-[10px] md:bottom-[10px] top-[5px] right-[5px] bottom-[5px] left-[5px] rounded-lg bg-primary text-foreground overflow-y-scroll transition-[padding] duration-300 " +
        (condensed ? "pt-[62px]" : "pt-[104px]")
      }
    >
      {children}
    </div>
  );
};

export default LayoutWrapper;
