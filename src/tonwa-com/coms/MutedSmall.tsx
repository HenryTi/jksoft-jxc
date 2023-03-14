import React from "react";

interface Props {
    className?: string;
    children: React.ReactNode;
}

export function MutedSmall({ className, children }: Props) {
    return <small className={'text-muted ' + (className ?? '')}>
        {children}
    </small>
}
