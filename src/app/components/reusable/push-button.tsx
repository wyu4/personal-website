"use client";

import { bindRefAndForwardRef } from "@/utils/ref-helpers";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { forwardRef, useRef, useState } from "react";

type PushButtonAttributes = ButtonAttributes & {
  disabled?: boolean;
};

const PushButton = forwardRef<HTMLButtonElement, PushButtonAttributes>(
  (
    {
      children,
      className,
      onMouseUp,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      onClick,
      disabled = false,
      style = {},
      ...props
    },
    forwardedRef,
  ) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [hovering, setHovering] = useState(false);
    const [down, setDown] = useState(false);
    const [cursor, setCursor] = useState("default");

    useGSAP(() => {
      if (hovering) {
        if (disabled) return;
        setCursor("pointer");
        if (down) {
          gsap.to(buttonRef.current, {
            scale: 0.9,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
          return;
        }
        gsap.to(buttonRef.current, {
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else {
        setCursor("default");
        gsap.to(buttonRef.current, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    }, [hovering, down]);

    const handleMouseEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
      setHovering(true);
      onMouseEnter?.(event);
    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLButtonElement>) => {
      setHovering(false);
      setDown(false);
      onMouseLeave?.(event);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
      setDown(true);
      onMouseDown?.(event);
    };

    const handleMouseUp = (event: React.MouseEvent<HTMLButtonElement>) => {
      setDown(false);
      onMouseUp?.(event);
    };

    const handleMouseClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onClick?.(event);
    };

    return (
      <button
        className={`text-(--gray-900) ${className}`}
        ref={(node) => bindRefAndForwardRef(node, forwardedRef, buttonRef)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleMouseClick}
        style={{
          ...style,
          cursor: cursor,
        }}
        {...props}
      >
        {children}
      </button>
    );
  },
);

export default PushButton;

type PushAnchorAttributes = AnchorAttributes & {
  disabled?: boolean;
  hoverCursor?: string;
};

export const PushAnchor = forwardRef<
  HTMLAnchorElement,
  PushAnchorAttributes & { href: string }
>(
  (
    {
      children,
      className,
      href,
      onMouseUp,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      onClick,
      disabled = false,
      style = {},
      hoverCursor = "pointer",
      ...props
    },
    forwardedRef,
  ) => {
    const buttonRef = useRef<HTMLAnchorElement>(null);
    const [hovering, setHovering] = useState(false);
    const [down, setDown] = useState(false);
    const [cursor, setCursor] = useState("default");

    useGSAP(() => {
      if (hovering) {
        if (disabled) return;
        setCursor(hoverCursor);
        if (down) {
          gsap.to(buttonRef.current, {
            scale: 0.9,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
          return;
        }
        gsap.to(buttonRef.current, {
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else {
        setCursor("default");
        gsap.to(buttonRef.current, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    }, [hovering, down, hoverCursor]);

    const handleMouseEnter = (event: React.MouseEvent<HTMLAnchorElement>) => {
      setHovering(true);
      onMouseEnter?.(event);
    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLAnchorElement>) => {
      setHovering(false);
      setDown(false);
      onMouseLeave?.(event);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLAnchorElement>) => {
      setDown(true);
      onMouseDown?.(event);
    };

    const handleMouseUp = (event: React.MouseEvent<HTMLAnchorElement>) => {
      setDown(false);
      onMouseUp?.(event);
    };

    const handleMouseClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled) return;
      onClick?.(event);
    };

    return (
      <a
        className={`text-(--gray-900) ${className}`}
        ref={(node) => bindRefAndForwardRef(node, forwardedRef, buttonRef)}
        href={href}
        target="_blank"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleMouseClick}
        style={{
          ...style,
          cursor: cursor,
        }}
        {...props}
      >
        {children}
      </a>
    );
  },
);
