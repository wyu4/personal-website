import { forwardRef } from "react";

export const InsetDiv = forwardRef<HTMLDivElement, DivAttributes>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`inset-shadow-gray-500/50 inset-shadow-sm ${className}`}
        {...props}
      />
    );
  },
);

export const PopupDiv = forwardRef<HTMLDivElement, DivAttributes>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={`shadow-md shadow-gray-500/50 ${className}`} {...props} />;
  },
);
