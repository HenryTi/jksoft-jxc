import React from "react";
import { useAtomValue } from "jotai";
import { SpinnerSmall, theme } from "tonwa-com";
import { BizBud } from "../../Biz";
import { ControllerSheetEdit } from "./ControlSheetEdit";
import { ViewMain } from "./ViewMain";
import { PAV } from "./tool";
import { ViewDiv } from "./ViewDiv";
import { BControlSheetEdit } from "../../Control";

export function ViewSheetContent({ control, readonly }: { control: BControlSheetEdit; readonly: boolean; }) {
    const { storeSheet: store, atomSum } = control;
    const { binStore } = store;
    if (binStore === undefined) {
        return <ViewMain store={store} popup={false} readOnly={readonly} />
    }
    function ViewSum() {
        const sum = useAtomValue(atomSum);
        if (sum === undefined) return null;
        const { entity: entityBin } = binStore;
        const { sumAmount, sumValue } = sum;
        const { amount: budAmount, value: budValue } = entityBin;
        const { value: cnValue, amount: cnAmount } = theme;
        let viewAmount: any, viewValue: any;
        function viewNumber(cn: string, bud: BizBud, val: number) {
            return <>
                <div className="ms-3" />
                <PAV className={cn} bud={bud} val={val} />
            </>
        }
        if (budAmount === undefined) {
            if (budValue === undefined) return null;
        }
        else {
            viewAmount = viewNumber(cnAmount, budAmount, sumAmount);
        }
        if (budValue !== undefined) {
            viewValue = viewNumber(cnValue, budValue, sumValue);
        }
        return <div className="d-flex ps-3 pe-5 py-3 justify-content-end">
            <div className="me-3">合计</div>
            {viewAmount}
            {viewValue}
        </div>;
    }
    function ViewBinDivs() {
        const { valDivsRoot, atomWaiting } = binStore;
        const valDivs = useAtomValue(valDivsRoot.atomValDivs);
        const waiting = useAtomValue(atomWaiting);
        let viewWaiting: any;
        if (waiting === true) {
            viewWaiting = <div className="px-3 py-2"><SpinnerSmall /></div>;
        }
        return <div className="tonwa-bg-gray-1 border-top border-bottom border-primary-subtle">
            {valDivs.length === 0 ?
                <div className="mt-3 small text-body-tertiary p-3 bg-white border-top">
                    无明细
                </div>
                :
                valDivs.map((v, index) => {
                    const { id } = v;
                    if (id === undefined) return null;// debugger;
                    const cn = 'border-top border-bottom ' + (id < 0 ? 'border-warning' : 'border-primary-subtle');
                    return <React.Fragment key={id}>
                        <div className="page-break" />
                        <div className={cn} style={{ marginTop: '1px', marginBottom: '1px' }}>
                            <ViewDiv controller={control.controlDetailEdit} valDiv={v} readonly={readonly} index={index + 1} />
                        </div>
                    </React.Fragment>;
                })}
            {viewWaiting}
        </div>
    }
    return <div>
        <ViewMain store={store} popup={false} readOnly={readonly} />
        <ViewBinDivs />
        <ViewSum />
    </div>;
}
