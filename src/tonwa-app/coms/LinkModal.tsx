import React from "react";
import { useModal } from "tonwa-app/UqAppBase";

interface Props {
    tag?: string;
    className?: string;
    modal: JSX.Element;
    children: React.ReactNode;
}

export function LinkModal({ tag, className, modal, children }: Props) {
    const { openModal } = useModal();
    if (tag === undefined) {
        tag = 'div';
        className = (className ?? '') + ' cursor-pointer';
    }
    function onClick() {
        openModal(modal);
    }
    return React.createElement(
        tag,
        { className, onClick },
        children
    );
    /*
    return <div className={(className ?? '') + 'cursor-pointer'} onClick={() => openModal(modal)}>
        {children}
    </div>;
    */
}
