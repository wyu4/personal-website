import { forwardRef } from "react";

const Bio = forwardRef<HTMLDivElement, BioProps>(
    ({ repositories, className = "", ...props }, forwardedRef) => {
        return (
            <div
                {...props}
                ref={forwardedRef}
                className={`${className} flex flex-col sm:flex-row p-5 gap-1`}
            >
                <div></div>
                <div className="flex flex-col p-5 gap-3">
                    <h1 className="text-5xl text-left">About Me</h1>
                    <p className="text-4xl text-left">
                        I am a 17 year old living in Canada who codes as a
                        hobby. I'm currently studying in high school, and I plan
                        on going into computer science.
                    </p>
                </div>
            </div>
        );
    },
);

export default Bio;

// const LanguageChart = forwardRef<HTMLDivElement, BioProps>(
//     ({ repositories, className, ...props }, forwardedRef) => {
//         const containerRef = useRef<HTMLDivElement>(null);

//         return (
//             <div
//                 ref={(node) =>
//                     bindRefAndForwardRef(node, forwardRef, containerRef)
//                 }
//                 className={className}
//                 {...props}
//             ></div>
//         );
//     },
// );
