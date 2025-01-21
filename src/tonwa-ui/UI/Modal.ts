export type OpenModal = <T = any>(element: JSX.Element, onClosed?: (result: any) => void) => Promise<T>;

export interface Modal {
    open: OpenModal;
    close: (result?: any) => void;
}
