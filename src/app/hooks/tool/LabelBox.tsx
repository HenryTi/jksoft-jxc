import React from "react";
import { theme } from "tonwa-com";

/*
const cnCombo: CnCombo = {
    cnRowCols: ' gx-0 row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 ',
    cnColLabel: ' col-4 ',
    cnColContent: ' col-8 ps-1 py-1 ',
}

const cnCombo: Css = {
    cnRowCols: ' row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 ',
    cnColLabel: '',
    cnColContent: '',
}
*/
// let cnGX = ' gx-0 ';
// let cnLabelContainer = ` ${cnCombo.cnColLabel} text-secondary text-end d-flex align-items-center flex-row justify-content-end `; //  small
// let cnContent = ' d-flex align-items-center border-bottom border-secondary-subtle tonwa-bg-gray-1 pt-1 pb-2 px-2 text-nowrap text-truncate ';
// let cnLabel = ' text-nowrap text-truncate ';
/*
let cnGX = ' ';
let cnLabelContainer = ` ${cnCombo.cnColLabel} text-secondary text-start d-flex align-items-center flex-row justify-content-start `; //  small
let cnLabel = ' text-nowrap text-truncate ps-2 pb-1';
let cnContent = ' d-flex align-items-center border-bottom border-secondary-subtle tonwa-bg-gray-1 pt-1 pb-2 px-2 text-nowrap text-truncate ';
*/
/*
export interface LabelBoxCss {
    cnRowCols: string;
    cnColLabel: string;
    cnColContent: string;
    cnGX: string;
    cnLabelContainer: string;
    cnContent: string;
    cnLabel: string;
}

export const labelBoxCssH: LabelBoxCss = {
    cnRowCols: ' gx-0 row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 ',
    cnColLabel: ' col-4 ',
    cnColContent: ' col-8 ps-1 py-1 ',
    cnGX: ' gx-0 ',
    cnLabelContainer: ` col-4 text-secondary text-end d-flex align-items-center flex-row justify-content-end `, //  small
    cnContent: ' d-flex align-items-center border-bottom border-secondary-subtle tonwa-bg-gray-1 pt-1 pb-2 px-2 text-nowrap text-truncate ',
    cnLabel: ' text-nowrap text-truncate ',
}

export const labelBoxCssV: LabelBoxCss = {
    cnRowCols: ' row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 ',
    cnColLabel: '',
    cnColContent: '',
    cnGX: ' ',
    cnLabelContainer: ` text-secondary text-start d-flex align-items-center flex-row justify-content-start `, //  small
    cnLabel: ' text-nowrap text-truncate ps-2 pb-1',
    cnContent: ' d-flex align-items-center border-bottom border-secondary-subtle tonwa-bg-gray-1 pt-1 pb-2 px-2 text-nowrap text-truncate ',
}

export const labelBoxCss = labelBoxCssV;
*/

export function RowCols({ children, contentClassName }: { children: React.ReactNode; contentClassName?: string; }) {
    return <div className={theme.labelBox.cnRowCols + (contentClassName ?? '')}>
        {children}
    </div>;
}

interface LabelBoxProps {
    label: string | JSX.Element; children: React.ReactNode; required?: boolean;
    title?: string;
    colon?: boolean;
    editable?: boolean;
    // css: LabelBoxCss;
    className?: string;
}

export function LabelBox({ label, children, required, title, editable, className }: LabelBoxProps) {
    const { cnContent, cnGX, cnLabelContainer, cnLabel, cnColContent, colon } = theme.labelBox;
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

    return <div className={' col ' + (className ?? '')}>
        <div className={'row ' + cnGX}>
            <div className={cnLabelContainer} title={labelTitle}>
                <span className={cnLabel}>{vLabel}</span> {vColon}
            </div>
            <div className={`${cnColContent} text-nowrap text-truncate`} title={title}>
                {content}
            </div>
        </div>
    </div>;
}
