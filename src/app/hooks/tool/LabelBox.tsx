import React from "react";

interface CnCombo {
    cnRowCols: string;
    cnColLabel: string;
    cnColContent: string;
}
/*
const cnCombo: CnCombo = {
    cnRowCols: ' gx-0 row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 ',
    cnColLabel: ' col-4 ',
    cnColContent: ' col-8 ps-1 py-1 ',
}
*/
const cnCombo: CnCombo = {
    cnRowCols: ' row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 ',
    cnColLabel: '',
    cnColContent: '',
}

// let cnGX = ' gx-0 ';
// let cnLabelContainer = ` ${cnCombo.cnColLabel} text-secondary text-end d-flex align-items-center flex-row justify-content-end `; //  small
// let cnContent = ' d-flex align-items-center border-bottom border-secondary-subtle tonwa-bg-gray-1 pt-1 pb-2 px-2 text-nowrap text-truncate ';
// let cnLabel = ' text-nowrap text-truncate ';
let cnGX = ' ';
let cnLabelContainer = ` ${cnCombo.cnColLabel} text-secondary text-start d-flex align-items-center flex-row justify-content-start `; //  small
let cnLabel = ' text-nowrap text-truncate ps-2 pb-1';
let cnContent = ' d-flex align-items-center border-bottom border-secondary-subtle tonwa-bg-gray-1 pt-1 pb-2 px-2 text-nowrap text-truncate ';

export function RowCols({ children, contentClassName }: { children: React.ReactNode; contentClassName?: string }) {
    return <div className={cnCombo.cnRowCols + (contentClassName ?? '')}>
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
        <div className={cnContent}>
            {children}
        </div>
        :
        children;

    return <div className="col">
        <div className={'row ' + cnGX}>
            <div className={cnLabelContainer} title={labelTitle}>
                <span className={cnLabel}>{vLabel}</span> {vColon}
            </div>
            <div className={`${cnCombo.cnColContent} text-nowrap text-truncate`} title={title}>
                {content}
            </div>
        </div>
    </div>;
}
