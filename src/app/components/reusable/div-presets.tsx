import { bindRefAndForwardRef } from "@/utils/ref-helpers";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { forwardRef, useRef, useState } from "react";

export const InsetDiv = forwardRef<HTMLDivElement, DivAttributes>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={`inset-shadow-div inset-shadow-sm ${className}`} {...props} />;
  },
);

export const PopupDiv = forwardRef<
  HTMLDivElement,
  DivAttributes & {
    hoverEffectEnabled?: boolean;
  }
>(({ className, hoverEffectEnabled = true, ...props }, forwardedRef) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  useGSAP(() => {
    const effectOn = hovering && hoverEffectEnabled;
    gsap.to(ref.current, {
      scale: effectOn ? 1.02 : 1,
      duration: 0.2,
      ease: "power2.inOut",
    });
  }, [hovering, hoverEffectEnabled]);

  return (
    <div
      ref={(node) => bindRefAndForwardRef(node, forwardedRef, ref)}
      className={`shadow-md shadow-div ${className}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      {...props}
    />
  );
});

export const Sticker = forwardRef<HTMLDivElement, DivAttributes>(({ children }, ref) => {
  return (
    <PopupDiv
      ref={ref}
      hoverEffectEnabled={false}
      className="text-3xl text-(--gray-900) aspect-square bg(--gray-200) rounded-md p-1 grid place-items-center"
    >
      {children}
    </PopupDiv>
  );
});
