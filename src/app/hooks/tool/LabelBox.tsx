import React from "react";

const cnRowCols = ' gx-0 row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 ';

export function RowCols({ children, contentClassName }: { children: React.ReactNode; contentClassName?: string }) {
    return <div className={cnRowCols + (contentClassName ?? '')}>
        {children}
    </div>;
}

interface LabelBoxProps {
    label: string | JSX.Element; children: React.ReactNode; required?: boolean;
    title?: string;
    colon?: boolean;
    editable?: boolean;
}

export function LabelBox({ label, children, required, title, colon, editable }: LabelBoxProps) {
    let vLabel: any;
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
    if (colon === true) vColon = ':';
    let content = editable === false ?
        <div className="d-flex align-items-center border-bottom border-secondary-subtle tonwa-bg-gray-1 pt-1 pb-2 px-2 text-nowrap text-truncate">
            {children}
        </div>
        :
        children;

    let cnLabelContainer = 'col-5 text-secondary text-end d-flex align-items-center flex-row justify-content-end small';
    let cnLabel = ' text-nowrap text-truncate ';
    return <div className="col">
        <div className="row gx-0">
            <div className={cnLabelContainer} title={labelTitle}>
                <span className={cnLabel}>{vLabel}</span> {vColon}
            </div>
            <div className="col-7 ps-1 py-1 text-nowrap text-truncate" title={title}>
                {content}
            </div>
        </div>
    </div>;
}
