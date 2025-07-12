import React from "react";

type ButtonProps = React.HTMLAttributes<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement> & {
    onClick?: () => void;
    children: React.ReactNode;
    href?: string;
    grow?: boolean;
};

export default function Button({
    onClick,
    children,
    className = "",
    href,
    grow=true,
    ...args
}: ButtonProps) {
    return (
        <button
            className={grow ? "grow-on-hover " + className : className}
            onClick={() => {
                if (href) {
                    const opened = window.open(href, "_blank");
                    if (opened) opened.focus();
                }
                if (onClick) onClick();
            }}
            {...args}
        >
            {children}
        </button>
    );
}
