import { useAtomValue } from "jotai";
import { DivStore, UseInputsProps, ValDiv } from "../store";
import { FA } from "tonwa-com";
import { ChangeEvent } from "react";
import { useInputs } from "../inputs";
import { ViewBud, ViewBudUIType } from "app/hooks";

interface ViewDivProps {
    divStore: DivStore;
    valDiv: ValDiv;
    editable: boolean;
    className?: string;
}

export function ViewBinDivs({ divStore, editable }: { divStore: DivStore; editable: boolean; }) {
    return <div className="container">
        <ViewDivs divStore={divStore} valDiv={divStore.valDiv} editable={editable} />
    </div>;
    // <button className="btn btn-primary" onClick={onRedraw}>刷新</button>
}

function ViewDivs({ divStore, valDiv, editable, className }: ViewDivProps) {
    const divs = useAtomValue(valDiv.atomValDivs);
    return <div className={className}>
        {divs.map(v => <ViewDiv key={v.id} divStore={divStore} valDiv={v} editable={editable} />)}
    </div>;
}

function ViewDiv({ divStore, valDiv, editable }: ViewDivProps) {
    const { atomValRow, atomValDivs: atomDivs } = valDiv;
    let vRow: any;
    if (atomValRow !== undefined) {
        vRow = <ViewRow divStore={divStore} valDiv={valDiv} editable={editable} />;
    }
    return <div>
        {vRow}
        {atomDivs && <ViewDivs divStore={divStore} valDiv={valDiv} editable={editable} />}
    </div>
}

function ViewRow({ divStore, valDiv, editable }: ViewDivProps) {
    const inputs = useInputs();
    const { atomValRow, atomValDivs, atomValue, binDiv } = valDiv;
    const { binBuds } = binDiv;
    const val = useAtomValue(atomValRow);
    const value = useAtomValue(atomValue);
    const { pend, id } = val;
    let btn: any;
    let vDel = <div className="px-3 py-2 cursor-pointer text-warning" onClick={onDelSub}>
        <FA name="times" />
    </div>;
    if (atomValDivs !== undefined) {
        function DivRow() {
            const divs = useAtomValue(atomValDivs);
            const vValue = divs.length === 0 ?
                vDel :
                <div className="me-2 text-body-tertiary text-end">{value}</div>;
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
        // {value}
        btn = <>
            <div className="py-1 text-end fw-bold">
                <input type="number" className="form-control text-end w-8c"
                    onChange={onValueChange} defaultValue={value} />
            </div>
            {vDel}
        </>;
    }
    async function onAddSub() {
        const pendRow = divStore.getPendRow(pend);
        let props: UseInputsProps = {
            divStore,
            pendRow,
            binDiv: binBuds.binDiv.div,
        };
        let ret = await inputs(props);
        valDiv.setValDiv(ret);
    }
    function onDelSub() {
        divStore.delValRow(id);
    }
    function onValueChange(evt: ChangeEvent<HTMLInputElement>) {
        let v = evt.currentTarget.value;
        let n = Number(v);
        if (Number.isNaN(n) === true) return;
        valDiv.setValue(n);
    }
    return <div className="d-flex align-items-center ">
        <div className="flex-fill row row-cols-4">
            {valDiv.getBudsValArr().map(([bud, value]) => {
                const { id } = bud;
                return <ViewBud key={id} bud={bud} value={value} uiType={ViewBudUIType.inDiv} />;
                /*
                    <div key={id} className="d-flex me-3 w-12c">
                        <div className="text-secondary me-2">{caption ?? name}:</div>
                    </div>;
                */
            })}
        </div>
        {btn}
    </div >;
    // <div className="px-3 py-2 text-break">{JSON.stringify(val)}</div>
}