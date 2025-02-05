import React from "react";
import { FA } from "tonwa-com";
import { SheetSteps } from "../../Store";

export function ViewSteps({ sheetSteps }: { sheetSteps: SheetSteps; }) {
    if (sheetSteps === undefined) return null;
    const { steps, end, step } = sheetSteps;
    const cnStepBox = ' w-min-8c px-3 border rounded-5 py-2 d-flex ';
    const cnLabel = ' text-secondary me-2 ';
    const cnStep = '  ';
    const cnStepColor = '  ';
    const cnStepCurrent = ' fw-bold text-primary ';
    return <div className="d-flex py-2 px-5 align-items-center text-center justify-content-center border-bottom border-primary">
        {steps.map((v, index) => {
            let cn = cnStep, cnBox = cnStepBox;
            if (index === step) {
                cn += cnStepCurrent;
                cnBox += ' border-primary border-2 ';
            }
            else {
                cn += cnStepColor;
            }
            return <React.Fragment key={index}>
                <div className={cnBox}>
                    <div className={cnLabel}>{index + 1}</div>
                    <div className={cn}>{v}</div>
                </div>
                <div className="px-4 text-body-tertiary">
                    <FA name="arrow-right" />
                </div>
            </React.Fragment>
        })}
        <div className={cnStepBox}>
            <div className={cnLabel}>{steps.length + 1}</div>
            <div className={cnStep + cnStepColor}>{end}</div>
        </div>
    </div>
}
