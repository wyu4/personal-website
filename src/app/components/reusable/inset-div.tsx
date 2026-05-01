import { forwardRef } from "react";

const InsetDiv = forwardRef<HTMLDivElement, DivAttributes>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={`inset-shadow-gray-300/50 inset-shadow-sm ${className}`} {...props} />
  );
});

export default InsetDiv;
