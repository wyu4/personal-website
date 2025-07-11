import React from "react";

type ButtonProps = {
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    href?: string;
    id?: string;
};

export default function Button({
    onClick,
    children,
    className = "",
    href,
    id = "",
}: ButtonProps) {
    return (
        <button
            id={id}
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
