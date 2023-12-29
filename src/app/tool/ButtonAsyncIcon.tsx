import React from "react";
import { ButtonAsync, FA } from "tonwa-com";

interface Props {
    children: React.ReactNode;
    onClick: () => Promise<void>;
    icon: string;
    className?: string;
    disabled?: boolean;
}

export function ButtonAsyncIcon({ children, onClick, disabled, className, icon }: Props) {
    return <ButtonAsync className={' btn me-3 ' + (className ?? 'btn-primary')} disabled={disabled} onClick={onClick}>
        <span className="mx-1">
            <FA name={icon} className="me-2 small" />
            {children}
        </span>
    </ButtonAsync>;
}
