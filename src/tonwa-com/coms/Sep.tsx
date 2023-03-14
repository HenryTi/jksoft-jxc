import React from "react";

interface Props {
    sep?: number | JSX.Element;
    children?: React.ReactNode;
    className?: string;
}
export function Sep({ sep, className, children }: Props) {
    if (sep === null) return null;
    className = className ?? '';
    if (typeof sep === 'number') {
        className += ' border-top border-' + sep;
    }
    else if (React.isValidElement(sep) === true) {
        children = <>{sep}{children}</>;
    }
    if (!children) {
        className += ' border-top border-1';
    }
    return <div className={className}>
        {children}
    </div>;
}