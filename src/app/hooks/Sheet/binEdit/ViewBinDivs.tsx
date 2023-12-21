import { useAtomValue } from "jotai";
import { DivStore, UseInputsProps, ValDiv } from "../store";
import { FA } from "tonwa-com";
import { useInputs } from "../inputs";
import { ViewBud, ViewBudUIType, ViewSpecBaseOnly } from "app/hooks";

interface ViewDivProps {
    divStore: DivStore;
    valDiv: ValDiv;
    editable: boolean;
    className?: string;
}

export function ViewBinDivs({ divStore, editable }: { divStore: DivStore; editable: boolean; }) {
    const { valDiv } = divStore;
    const divs = useAtomValue(valDiv.atomValDivs);
    if (divs.length === 0) {
        return <div className="small text-body-tertiary p-3">
            无明细
        </div>;
    }
    return <div className="tonwa-bg-gray-1">
        {divs.map(v => {
            return <div key={v.id} className="mb-3 border-top border-bottom border-2 border-primary-subtle">
                <ViewDiv divStore={divStore} valDiv={v} editable={editable} />
            </div>;
        })}
    </div>;
}

function ViewDivs({ divStore, valDiv, editable, className }: ViewDivProps) {
    const divs = useAtomValue(valDiv.atomValDivs);
    return <>
        {divs.map(v => {
            return <ViewDiv key={v.id} divStore={divStore} valDiv={v} editable={editable} />;
        })}
    </>;
}

function ViewDiv({ divStore, valDiv, editable, className }: ViewDivProps) {
    const { atomValRow, atomValDivs: atomDivs } = valDiv;
    let vRow: any;
    if (atomValRow !== undefined) {
        vRow = <ViewRow divStore={divStore} valDiv={valDiv} editable={editable} className={className} />;
    }
    return <div>
        {vRow}
        {atomDivs && <ViewDivs divStore={divStore} valDiv={valDiv} editable={editable} />}
    </div>
}

const marginRightStyle = { marginRight: "-1em" };
function ViewRow({ divStore, valDiv, editable }: ViewDivProps) {
    const inputs = useInputs();
    const { atomValRow, atomValDivs, atomValue, binDiv } = valDiv;
    const { binBuds, level, entityBin } = binDiv;
    const { divLevels } = entityBin;
    const { hasIBase, valueBud } = binBuds;
    const val = useAtomValue(atomValRow);
    const value = useAtomValue(atomValue);
    const { pend, id } = val;
    let btn: any;
    let vDel = <div className="px-3 cursor-pointer text-warning" onClick={onDelSub} style={marginRightStyle}>
        <FA name="times" />
    </div>;
    const cnBtn = 'w-min-8c w-max-8c d-flex justify-content-end  position-relative';
    if (atomValDivs !== undefined) {
        function DivRow() {
            const divs = useAtomValue(atomValDivs);
            let pendOverflow: any;
            if (level === 0 && value > val.pendValue) {
                pendOverflow = <div className="text-danger d-flex justify-content-end position-absolute text-nowrap align-items-center" style={{ right: 0 }}>
                    <FA name="exclamation-circle" className="me-1" fixWidth={true} />
                    <small className="me-1">待处理</small>
                    <span className="me-4">{val.pendValue}</span>
                </div>;
            }
            return <div className={cnBtn}>
                {divs.length === 0 ? vDel : <div className="text-body-tertiary text-end">
                    <div>{value}</div>
                    {pendOverflow}
                </div>}
                <div className="px-3 cursor-pointer text-primary" onClick={onAddSub} style={marginRightStyle}>
                    <FA name="plus" />
                </div>
            </div>;
        }
        btn = <DivRow />;
    }
    else {
        let { caption, name } = valueBud;
        btn = <div className={cnBtn}>
            <div className="text-end">
                <span className="small text-secondary me-2">{caption ?? name}</span>
                {value}
            </div>
            {vDel}
        </div>;
    }
    async function onAddSub() {
        const pendRow = await divStore.getPendRow(pend);
        let props: UseInputsProps = {
            divStore,
            pendRow,
            valDiv,
            binDiv: binBuds.binDiv.div,
        };
        let ret = await inputs(props);
        if (ret === undefined) return;
        valDiv.setValDiv(ret);
    }
    async function onDelSub() {
        await divStore.delValRow(id);
    }
    /*
    function onValueChange(evt: ChangeEvent<HTMLInputElement>) {
        let v = evt.currentTarget.value;
        let n = Number(v);
        if (Number.isNaN(n) === true) return;
        valDiv.setValue(n);
    }
    */
    let vIBase: any;
    if (hasIBase === true) {
        vIBase = <div className="col-12">
            <ViewSpecBaseOnly id={valDiv.iBase} />
        </div>;
    }
    let cn: string = ' container d-flex py-2 border-bottom ';
    if (level < divLevels) cn += 'tonwa-bg-gray-' + (divLevels - level);
    else cn += 'bg-white';
    return <div className={cn}>
        <div className="flex-fill row row-cols-4">
            {vIBase}
            {valDiv.getBudsValArr().map(([bud, value]) => {
                const { id } = bud;
                return <ViewBud key={id} bud={bud} value={value} uiType={ViewBudUIType.inDiv} />;
            })}
        </div>
        {btn}
    </div >;
}
