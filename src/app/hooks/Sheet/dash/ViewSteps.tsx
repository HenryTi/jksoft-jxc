import React from "react";
import { FA } from "tonwa-com";
import { SheetSteps } from "../store";

export function ViewSteps({ sheetSteps }: { sheetSteps: SheetSteps; }) {
    if (sheetSteps === undefined) return null;
    const { steps, end, step } = sheetSteps;
    const cnStepBox = ' w-min-8c px-3 border rounded-4 py-2 ';
    const cnLabel = ' text-body-tertiary pb-1 ';
    const cnStep = ' fs-larger ';
    const cnStepColor = '  ';
    const cnStepCurrent = ' fw-bold text-primary ';
    return <div className="d-flex py-3 px-5 align-items-center text-center justify-content-center border-bottom border-primary">
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
                    <div className={cnLabel}>第{index + 1}步</div>
                    <div className={cn}>{v}</div>
                </div>
                <div className="px-4 text-body-tertiary">
                    <FA name="arrow-right" />
                </div>
            </React.Fragment>
        })}
        <div className={cnStepBox}>
            <div className={cnLabel}>第{steps.length + 1}步</div>
            <div className={cnStep + cnStepColor}>{end}</div>
        </div>
    </div>
}
