import { useAtomValue } from "jotai";
import { BinStore, ValDiv } from "../BinEditing";
import { FA } from "tonwa-com";
import { getMockId } from "./model";
import { ChangeEvent } from "react";
import { BinRow, ValRow } from "../tool";

export function ViewBinDivs({ binStore, editable }: { binStore: BinStore; editable: boolean; }) {
    return <div>
        <ViewDivs binStore={binStore} div={binStore.valDiv} editable={editable} />
    </div>;
    // <button className="btn btn-primary" onClick={onRedraw}>刷新</button>
}

function ViewDivs({ binStore, div, editable, className }: { binStore: BinStore; div: ValDiv; editable: boolean; className?: string; }) {
    const divs = useAtomValue(div.atomDivs);
    return <div className={className}>
        {divs.map(v => <ViewDiv key={v.id} binStore={binStore} div={v} editable={editable} />)}
    </div>;
}

function ViewDiv({ binStore, div, editable }: { binStore: BinStore; div: ValDiv; editable: boolean; }) {
    const { atomValRow, atomDivs } = div;
    let vRow: any;
    if (atomValRow !== undefined) {
        vRow = <ViewRow binStore={binStore} div={div} editable={editable} />;
    }
    return <div>
        {vRow}
        {atomDivs && <ViewDivs binStore={binStore} div={div} editable={editable} className="ms-5" />}
    </div>
}

function ViewRow({ binStore, div, editable }: { binStore: BinStore; div: ValDiv; editable: boolean; }) {
    const { atomValRow, atomDivs, atomValue } = div;
    const val = useAtomValue(atomValRow);
    const value = useAtomValue(atomValue);
    const { pend, id } = val;
    let btn: any;
    if (atomDivs !== undefined) {
        function DivRow() {
            const divs = useAtomValue(atomDivs);
            const vValue = divs.length === 0 ?
                <div className="px-2 py-2 cursor-pointer text-warning" onClick={onDelSub}>
                    <FA name="times" />
                </div>
                :
                <div className="me-2 text-body-tertiary">{value}</div>;
            return <>
                {vValue}
                <div className="px-3 py-2 cursor-pointer text-primary" onClick={onAddSub}>
                    <FA name="plus" />
                </div>
            </>;
        }
        btn = <DivRow />;
    }
    else {
        btn = <>
            <div className="py-1 w-10c">
                <input type="number" className="form-control text-end" onChange={onValueChange} />
            </div>
            <div className="px-3 py-2 cursor-pointer text-warning" onClick={onDelSub}>
                <FA name="times" />
            </div>
        </>;
    }
    function onAddSub() {
        let rId = getMockId();
        let valRow: ValRow = { id: rId, origin: id, pend };
        binStore.setValRow(valRow);
    }
    function onDelSub() {
        binStore.delValRow(id);
    }
    function onValueChange(evt: ChangeEvent<HTMLInputElement>) {
        let v = evt.currentTarget.value;
        let n = Number(v);
        if (Number.isNaN(n) === true) return;
        div.setValue(n);
    }
    return <div className="d-flex align-items-center">
        <div className="flex-grow-1">
            <div className="px-3 py-2">{JSON.stringify(val)}</div>
        </div>
        {btn}
    </div>;
}