import { JSX } from "react";

export type OpenModal = <T = any>(element: JSX.Element, onClosed?: (result: any) => void) => Promise<T>;
export type OpenModalAsync = <T = any>(element: JSX.Element, promise: Promise<any>, onClosed?: (result: any) => void) => Promise<T>;

export interface Modal {
    open: OpenModal;
    openAsync: OpenModalAsync;
    close: (result?: any) => void;
}
