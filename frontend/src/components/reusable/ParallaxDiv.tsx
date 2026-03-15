import { forwardRef, useRef } from "react";
import { bindRefAndForwardRef } from "../../utils/RefUtils";
import useScrollEffect from "../../hooks/ScrollHook";

const ParallaxDiv = forwardRef<HTMLDivElement, ParallaxDivProps>(
    ({ speed = 0, children, className = "", ...props }, forwardedRef) => {
        const divRef = useRef<HTMLDivElement>(null);

        useScrollEffect(
            (scrollY) => {
                if (!divRef.current) return;
                divRef.current.style.transform = `translateY(${scrollY * speed}px)`;
            },
            [speed],
        );

        return (
            <div
                ref={(node) => bindRefAndForwardRef(node, forwardedRef, divRef)}
                className={`overflow-visible will-change-transform ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    },
);

export default ParallaxDiv;
