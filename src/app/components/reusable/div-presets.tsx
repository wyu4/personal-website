import { bindRefAndForwardRef } from "@/utils/ref-helpers";
import { forwardRef, useRef } from "react";
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
  DivAttributes
>(({ className, ...props }, forwardedRef) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={(node) => bindRefAndForwardRef(node, forwardedRef, ref)}
      className={`shadow-md shadow-div ${className}`}
      {...props}
    />
  );
});

export const Sticker = forwardRef<HTMLDivElement, DivAttributes>(({ children }, ref) => {
  return (
    <PopupDiv
      ref={ref}
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
          p: ({ ...props }) => <p {...props} className="my-4 first:mt-0 last:mb-0" />,
          h1: ({ ...props }) => <h1 {...props} className="mt-10 mb-3 first:mt-0 text-[2em] font-bold" />,
          h2: ({ ...props }) => <h2 {...props} className="mt-8 mb-3 first:mt-0 text-[1.6em] font-bold" />,
          h3: ({ ...props }) => <h3 {...props} className="mt-6 mb-2 first:mt-0 text-[1.35em] font-bold" />,
          h4: ({ ...props }) => <h4 {...props} className="mt-5 mb-2 first:mt-0 text-[1.15em] font-bold" />,
          h5: ({ ...props }) => <h5 {...props} className="mt-4 mb-1 first:mt-0 text-[1em] font-bold" />,
          h6: ({ ...props }) => <h6 {...props} className="mt-4 mb-1 first:mt-0 text-[0.9em] font-bold" />,
          ul: ({ ...props }) => <ul {...props} className="list-disc list-inside my-2 space-y-1" />,
          ol: ({ ...props }) => (
            <ol {...props} className="list-decimal list-inside my-2 space-y-1" />
          ),
          li: ({ ...props }) => <li {...props} className="my-1" />,
          hr: ({ ...props }) => <hr {...props} className="my-6 border-t border(--gray-900)" />,
          blockquote: ({ ...props }) => (
            <blockquote
              {...props}
              className="my-4 border-l-4 border-(--gray-400) pl-4 italic opacity-80"
            />
          ),
          table: ({ ...props }) => (
            <div className="my-4 overflow-x-auto">
              <table {...props} className="w-full border-collapse text-left" />
            </div>
          ),
          thead: ({ ...props }) => <thead {...props} className="bg-(--gray-200)" />,
          tr: ({ ...props }) => <tr {...props} className="border-b border-(--gray-400)" />,
          th: ({ ...props }) => <th {...props} className="px-3 py-2 font-bold" />,
          td: ({ ...props }) => <td {...props} className="px-3 py-2" />,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
});
