import React from "react";
import { FA } from "tonwa-com";

const cnDefault = 'btn btn-sm me-2 btn-';

interface ButtonRightProps {
    className?: string;
    color?: string;
    onClick: () => Promise<void>;
}

export function ButtonRight({ className, color, onClick, children }: ButtonRightProps & { children: React.ReactNode; }) {
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
    return <button className={cn} onClick={onClick}>{children}</button>;
}

export function ButtonRightAdd(props: ButtonRightProps) {
    return <ButtonRight {...props}>
        <FA name="plus" />
    </ButtonRight>
}
