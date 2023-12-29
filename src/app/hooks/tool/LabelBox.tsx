import React from "react";

const cnRolCols = ' row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 ';

export function RolCols({ children }: { children: React.ReactNode; }) {
    return <div className={cnRolCols}>
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
    if (required === true) {
        label = <>
            {label}
            <span className="text-danger ms-1">*</span>
        </>;
    }
    let vColon: any;
    if (colon === true) vColon = ':';
    let content = editable === false ?
        <div className="d-flex align-items-center border-bottom border-secondary-subtle tonwa-bg-gray-1 pt-1 pb-2 px-2">
            {children}
        </div>
        :
        children;

    return <div className="col">
        <div className="row">
            <div className={'col-4 px-0 text-secondary text-end d-flex align-items-center flex-row justify-content-end small text-nowrap '} title={title}>
                {label} {vColon}
            </div>
            <div className="col-8 ps-2 py-1">
                {content}
            </div>
        </div>
    </div>;
}
