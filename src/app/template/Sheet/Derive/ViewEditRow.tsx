import { UqApp, useUqApp } from "app/UqApp";
import { ReturnGetDetailQPAsFromOriginRet } from "uqs/JsTicket";
import { ChangeEvent, FocusEvent, useRef, useState } from "react";
import { ViceTitle } from "app/coms";
import { FA, List, LMR } from "tonwa-com";
import { SheetBase, PartDerive } from "app/template";

export function ViewEditRow<S extends SheetBase, D extends object = any>({ row, Part }: { row: any, Part: new (uqApp: UqApp) => PartDerive<S, D> }) {
    const uqApp = useUqApp();
    const part = uqApp.partOf(Part);
    const { uq, editing } = part;
    const { sheet } = row;
    const [details, setDetails] = useState<any[]>(row.details);
    function ViewItemDetail({ value: detail }: { value: ReturnGetDetailQPAsFromOriginRet & { id: number; $changedValue: number; value: number } }) {
        let inp = useRef(undefined as HTMLInputElement);
        let { id, origin, originQuantity, value, done } = detail;
        let [disabled, setDisabled] = useState(false);
        done = done ?? 0;
        let operatableValue = originQuantity - done;
        async function changeValue(newValue: number) {
            if (newValue !== undefined) {
                if (newValue < 0) newValue = 0;
                else if (newValue > operatableValue) newValue = operatableValue;
            }
            if (newValue !== value) {
                setDisabled(true);
                let sheetDerive = editing.getSheet();
                if ((newValue === undefined || newValue === 0) && id !== undefined) id = -id;
                let newDetail = { id, sheet: sheetDerive.id, origin, value: newValue };
                let retId = await editing.setDetail(newDetail);
                /*
                let retId = await uq.ActID({
                    ID: uq.DetailOrigin,
                    value: newDetail
                });
                */
                if (id === undefined) detail.id = retId;
                setDisabled(false);
            }
            detail.$changedValue = newValue;
            detail.value = newValue;
            if (inp.current) {
                inp.current.value = String(newValue);
            }
            editing.refreshSubmitable();
        }
        async function onClick() {
            if (!inp.current) return;
            let { value: inpValue } = inp.current;
            if (inpValue.trim().length > 0) return;
            await changeValue(operatableValue);
        }
        function onChange(e: ChangeEvent<HTMLInputElement>) {
            let { value: inpValue } = e.currentTarget;
            let n: number = undefined;
            if (inpValue.trim().length > 0) {
                n = Number(inpValue);
                if (Number.isNaN(n) === true) n = undefined;
            }
            detail.$changedValue = n;
        }
        async function onBlur(e: FocusEvent<HTMLInputElement>) {
            let { value, $changedValue } = detail;
            if (value === undefined) return;
            await changeValue($changedValue);
        }
        return <LMR className="px-3 py-2 text-break align-items-end" onClick={onClick}>
            <div className="text-break">{JSON.stringify(detail)}</div>
            <div className="d-flex align-items-center">
                <FA name="angle-right" className="ms-3 me-1" />
                <input ref={inp} type="number"
                    className="form-control w-6c text-end"
                    defaultValue={value}
                    disabled={disabled}
                    onChange={onChange}
                    onBlur={onBlur} />
            </div>
        </LMR>
    }
    async function onLoadOrigin() {
        alert('调入源单，正在实现中...');
    }
    return <div>
        <ViceTitle className="text-break align-items-end">
            <span>source: {sheet.id}</span>
            <button className="btn btn-sm btn-link pb-0" onClick={onLoadOrigin}><FA name="plus" /></button>
        </ViceTitle>
        <List items={details} ViewItem={ViewItemDetail} itemKey={item => item.origin} />
    </div>
}
