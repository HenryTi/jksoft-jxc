import React from "react";
import { theme } from "tonwa-com";

export function RowCols({ children, contentClassName }: { children: React.ReactNode; contentClassName?: string; }) {
    return <div className={theme.labelBox.cnRowCols + (contentClassName ?? '')}>
        {children}
    </div>;
}

export function RowColsSm({ children, contentClassName }: { children: React.ReactNode; contentClassName?: string; }) {
    return <div className={theme.labelBox.cnRowColsSm + (contentClassName ?? '')}>
        {children}
    </div>;
}

interface LabelBoxProps {
    label: string | JSX.Element; children: React.ReactNode; required?: boolean;
    title?: string;
    colon?: boolean;
    editable?: boolean;
    className?: string;
}

export function LabelBox({ label, children, required, title, editable, className, colon }: LabelBoxProps) {
    const { cnReadonly, cnGX, cnLabelContainer, cnLabel, cnColContent, colon: themeColon } = theme.labelBox;
    let vLabel: any, cnContainer = cnGX;
    if (required === true) {
        vLabel = <>
            {label}
            <span className="text-danger ms-0">*</span>
        </>;
    }
    else {
        vLabel = label;
    }
    let labelTitle: string;
    if (typeof label === 'string') labelTitle = label;
    let vColon: any;
    if ((colon ?? themeColon) === true) {
        vColon = <span className="me-1">:</span>;
        cnContainer += ' d-flex ';
    }
    let content = editable === false ?
        <div className={cnReadonly}>
            {children}
        </div>
        :
        children;

    return <div className={' col ' + (className ?? '')}>
        <div className={cnContainer}>
            <div className={cnLabelContainer} title={labelTitle}>
                <span className={cnLabel}>{vLabel}</span> {vColon}
            </div>
            <div className={`${cnColContent} text-nowrap text-truncate`} title={title}>
                {content}
            </div>
        </div>
    </div>;
}
