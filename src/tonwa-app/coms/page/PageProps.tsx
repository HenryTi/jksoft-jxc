import { JSX } from "react";

const scrollAfter = 20; // 20ms之后，scroll执行
export class Scroller {
    private el: HTMLBaseElement;
    constructor(el: HTMLBaseElement) {
        this.el = el;
    }

    scrollToTop(): void {
        setTimeout(() => this.el.scrollTo(0, 0), scrollAfter);
    }
    scrollToBottom(): void {
        setTimeout(() => this.el.scrollTo(0, this.el.scrollTop + this.el.offsetHeight), scrollAfter);
    }
}

export interface PageBackProps {
    back?: 'close' | 'back' | 'none' | string;
    onBack?: () => void;
}

export interface PageHeaderProps extends PageBackProps {
    header?: string | boolean | JSX.Element;
    right?: JSX.Element;
    headerClassName?: string;
}

export interface PageFooterProps {
    top?: JSX.Element;
    footer?: JSX.Element;
}

export interface PageContentProps {
    children?: React.ReactNode;

    onScroll?: (e: any) => void;
    onScrollTop?: (scroller: Scroller) => Promise<boolean>;
    onScrollBottom?: (scroller: Scroller) => Promise<void>;
}

export interface PageTemplateProps {
    Back?: (props: PageProps) => JSX.Element;
    Header?: (props: PageProps) => JSX.Element;
    Footer?: (props: PageProps) => JSX.Element;
    Content?: (props: PageProps) => JSX.Element;
    Error?: (props: PageProps) => JSX.Element;
    errorPosition?: 'above-header' | 'under-header';
}

export interface PageProps extends PageHeaderProps, PageFooterProps, PageContentProps, PageTemplateProps {
    ref?: any;
    auth?: boolean;                     // 需要验证，default=true
    onClosing?: () => Promise<boolean>;
    onClosed?: () => Promise<void> | void;
    hideScroll?: boolean;
}
