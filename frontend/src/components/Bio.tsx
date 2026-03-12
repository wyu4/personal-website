import { forwardRef, useRef } from "react";
import { bindRefAndForwardRef } from "../utils/RefUtils";

export default function Bio({ repositories }: BioProps) {
    return (
        <div className="grid grid-cols-1 grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 p-1 pt-[25vh] bg-linear-to-r from-slate-950 to-blue-950">
            <div></div>
            <div className="flex flex-col p-5 gap-3">
                <h1 className="text-4xl text-left">About Me</h1>
                <p className="text-2xl text-left">
                    I am a 17 year old living in Canada who codes as a hobby.
                    I'm currently studying in high school, and I plan on going
                    into computer science.
                </p>
            </div>
        </div>
    );
}

const LanguageChart = forwardRef<HTMLDivElement, DivAttributes & BioProps>(
    ({ repositories, className, ...props }, forwardedRef) => {
        const containerRef = useRef<HTMLDivElement>(null);

        return (
            <div
                ref={(node) =>
                    bindRefAndForwardRef(node, forwardRef, containerRef)
                }
                className={className}
                {...props}
            ></div>
        );
    },
);
