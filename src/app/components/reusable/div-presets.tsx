import { bindRefAndForwardRef } from "@/utils/ref-helpers";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { forwardRef, useRef, useState } from "react";
import { MdConstruction } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PushAnchor } from "./push-button";

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

export const ConstructionDiv = forwardRef<HTMLDivElement, DivAttributes>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <InsetDiv
        ref={forwardedRef}
        {...props}
        className={`relative rounded-2xl flex flex-col justify-center items-center p-5 gap-5 z-15 ${className}`}
      >
        <PopupDiv
          className="rounded-2xl bg-(--gray-200)-1/2 text-3xl md:text-5xl p-2 md:p-3"
          hoverEffectEnabled={false}
        >
          <MdConstruction />
        </PopupDiv>

        <p className="code text-xl text-center">[This section is under construction.]</p>
      </InsetDiv>
    );
  },
);

export const MarkdownDiv = forwardRef<
  HTMLDivElement,
  Omit<DivAttributes, "children"> & { text?: string }
>(({ text = "", ...props }, fref) => {
  return (
    <div ref={fref} {...props}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => (
            <PushAnchor href={href ?? "/"} className="underline" {...props}>
              {children}
            </PushAnchor>
          ),
          ul: ({ ...props }) => <ul {...props} className="list-disc list-inside my-2 space-y-1" />,
          ol: ({ ...props }) => (
            <ol {...props} className="list-decimal list-inside my-2 space-y-1" />
          ),
          li: ({ ...props }) => <li {...props} className="my-1" />,
          hr: ({ ...props }) => <hr {...props} className="my-6 border-t border(--gray-900)" />,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
});
