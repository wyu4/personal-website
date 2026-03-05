import { forwardRef, useEffect, useRef, useState } from "react";
import { bindRefAndForwardRef } from "../../utils/RefUtils";

const ParallaxDiv = forwardRef<HTMLDivElement, ParallaxDivProps>(
    ({ speed = 0, children, className = "", ...props }, forwardedRef) => {
        const divRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const update = () => {
                if (!divRef.current) return;
                const scrollY = window.scrollY;
                divRef.current.style.transform = `translateY(${scrollY * speed}px)`;
            };

            window.addEventListener("load", update);
            window.addEventListener("resize", update);
            window.addEventListener("scroll", update);

            return () => {
                window.removeEventListener("load", update);
                window.removeEventListener("resize", update);
                window.removeEventListener("scroll", update);
            };
        }, [speed]);

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
