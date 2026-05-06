import { forwardRef } from "react";

export const InsetDiv = forwardRef<HTMLDivElement, DivAttributes>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`inset-shadow-div inset-shadow-sm ${className}`}
        {...props}
      />
    );
  },
);

export const PopupDiv = forwardRef<HTMLDivElement, DivAttributes>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={`shadow-md shadow-div ${className}`} {...props} />;
  },
);

export const Sticker = forwardRef<HTMLDivElement, DivAttributes>(({ children }, ref) => {
  return (
    <PopupDiv
      ref={ref}
      className="text-3xl aspect-square bg(--gray-200) rounded-md p-1 grid place-items-center"
    >
      {children}
    </PopupDiv>
  );
});
