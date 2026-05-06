import { bindRefAndForwardRef } from "@/utils/ref-helpers";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollToPlugin, SplitText } from "gsap/all";
import { forwardRef, useRef } from "react";

gsap.registerPlugin(ScrollToPlugin);
export const FadeInHeading = forwardRef<HTMLHeadingElement, Heading2Attributes>(
  ({ children, ...props }, forwardedRef) => {
    const ref = useRef<HTMLHeadingElement>(null);

    useGSAP(() => {
      const splitHeading = new SplitText(ref.current, {
        type: "words, chars",
      });
      gsap.fromTo(
        splitHeading.chars,
        { opacity: 0, y: "1rem" },
        {
          scrollTrigger: ref.current,
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power3.inOut",
        },
      );

      return () => splitHeading.revert();
    }, []);

    return (
      <h2 ref={(node) => bindRefAndForwardRef(node, forwardedRef, ref)} {...props}>
        {children}
      </h2>
    );
  },
);
