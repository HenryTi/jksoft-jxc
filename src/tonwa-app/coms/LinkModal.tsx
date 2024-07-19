import React from "react";
import { useModal } from "tonwa-app/UqAppBase";

interface Props {
    tag?: string;
    className?: string;
    modal: JSX.Element | (() => Promise<JSX.Element>);
    children: React.ReactNode;
}

export function LinkModal({ tag, className, modal, children }: Props) {
    const modalContext = useModal();
    if (tag === undefined) {
        tag = 'div';
        className = (className ?? '') + ' cursor-pointer';
    }
    async function onClick() {
        if (React.isValidElement(modal) === false) {
            modal = await (modal as (() => Promise<JSX.Element>))();
        }
        modalContext.open(modal as JSX.Element);
    }
    return React.createElement(
        tag,
        { className, onClick },
        children
    );
}
