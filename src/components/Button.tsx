import React from "react";

type ButtonProps = {
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    href?: string;
};

export default function Button({
    onClick,
    children,
    className = "",
    href,
}: ButtonProps) {
    return (
        <button
            className={"grow-on-hover " + className}
            onClick={() => {
                if (href) {
                    const opened = window.open(href, "_blank");
                    if (opened) opened.focus();
                }
                if (onClick) onClick();
            }}
        >
            {children}
        </button>
    );
}
