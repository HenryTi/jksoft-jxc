import React from "react";
import { BI } from "./bootstrap-icons";

const cnDefault = 'btn btn-sm me-2 btn-';

interface ButtonRightProps {
    className?: string;
    color?: string;
    onClick?: () => Promise<void>;
    tag?: string;
}

export function ButtonRight({ className, color, onClick, children, tag }: ButtonRightProps & { children: React.ReactNode; }) {
    let cn: string;
    if (color !== undefined) {
        cn = cnDefault + color;
    }
    else if (className === undefined) {
        cn = cnDefault + 'primary';
    }
    else {
        cn = className;
    }
    return React.createElement(tag ?? (onClick === undefined ? 'div' : 'button')
        , { className: cn, onClick }
        , children);
}

export function ButtonRightAdd(props: ButtonRightProps) {
    return <ButtonRight {...props}>
        <BI name="plus-lg" compact={true} />
    </ButtonRight>
}

