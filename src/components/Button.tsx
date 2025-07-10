import React from "react";

type ButtonProps = {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
};

function Button({ onClick, children, className="" }: ButtonProps) {
    return (
        <button className={"grow-on-hover " + className} onClick={onClick}>
            {children}
        </button>
    );
}

export default Button;
