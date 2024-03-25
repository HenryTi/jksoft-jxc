import { useAtomValue } from "jotai";
import { DivStore, UseInputsProps, ValDiv } from "../store";
import { FA } from "tonwa-com";
import { useInputs } from "../inputs";
import { ViewBud, ViewBudUIType, ViewSpecBaseOnly } from "app/hooks";
import { RowCols } from "app/hooks/tool";
import { theme } from "tonwa-com";

interface ViewDivProps {
    divStore: DivStore;
    valDiv: ValDiv;
    editable: boolean;
    className?: string;
}

/*
export function ViewBinDivs({ divStore, editable }: { divStore: DivStore; editable: boolean; }) {
    const { valDivs } = divStore;
    const divs = useAtomValue(valDivs.atomValDivs);
    if (divs.length === 0) {
        return <div className="tonwa-bg-gray-1">
            <div className="mt-3 small text-body-tertiary p-3 bg-white border-top">
                无明细
            </div>
        </div>;
    }
    return <div className="tonwa-bg-gray-1">
        {divs.map(v => {
            return <div key={v.id} className="mb-3 border-top border-bottom border-primary-subtle">
                <ViewDiv divStore={divStore} valDiv={v} editable={editable} />
            </div>;
        })}
    </div>;
}
*/
export function ViewDiv({ divStore, valDiv, editable, className }: ViewDivProps) {
    return <>
        <ViewRow divStore={divStore} valDiv={valDiv} editable={editable} className={className} />
        <ViewDivs divStore={divStore} valDiv={valDiv} editable={editable} />
    </>
}

function ViewDivs({ divStore, valDiv, editable, className }: ViewDivProps) {
    const divs = useAtomValue(valDiv.atomValDivs);
    return <>
        {divs.map(v => {
            return <ViewDiv key={v.id} divStore={divStore} valDiv={v} editable={editable} />;
        })}
    </>;
}

const marginRightStyle = { marginRight: "-1em" };
function ViewRow({ divStore, valDiv, editable }: ViewDivProps) {
    const inputs = useInputs();
    const { atomValRow, atomValDivs, atomSum: atomValue, binDiv } = valDiv;
    const { binBuds, level, entityBin, div } = binDiv;
    const { divLevels } = entityBin;
    const { hasIBase, valueBud, fields } = binBuds;
    const valRow = useAtomValue(atomValRow);
    const value = useAtomValue(atomValue);
    const { pend, id, pendValue } = valRow;
    let btn: any;
    let vDel = <div className="px-3 cursor-pointer text-warning" onClick={onDelSub} style={marginRightStyle}>
        <FA name="times" fixWidth={true} />
    </div>;
    const cnBtn = 'w-min-8c w-max-8c d-flex justify-content-end align-items-end';
    if (div !== undefined) {
        function DivRow() {
            const divs = useAtomValue(atomValDivs);
            let pendOverflow: any;
            if (level === 0 && value > pendValue) {
                pendOverflow = <div className="flex-fill">
                    <FA name="exclamation-circle" className="text-danger me-1" fixWidth={true} />
                    <span className="">{pendValue}</span>
                </div>;
                // <span className="me-1">待处理</span>
            }
            return <div className={cnBtn}>
                {divs.length === 0 ? vDel : <div className="d-flex text-end flex-column align-items-end">
                    {pendOverflow}
                    <div className={theme.sum}>{value}</div>
                </div>}
                <div className="px-3 cursor-pointer text-primary" onClick={onAddSub} style={marginRightStyle}>
                    <FA name="plus" fixWidth={true} />
                </div>
            </div>;
        }
        btn = <DivRow />;
    }
    else if (valueBud !== undefined) {
        let { caption, name } = valueBud;
        btn = <div className={cnBtn}>
            <div className="text-end">
                <div className={theme.labelColor}>{caption ?? name}</div>
                <div className={theme.value}>{value}</div>
            </div>
            {vDel}
        </div>;
    }
    else {
        btn = <div className={cnBtn}>
            valueBue === undefined
        </div>;
    }
    async function onAddSub() {
        const pendRow = await divStore.getPendRow(pend);
        let props: UseInputsProps = {
            divStore,
            pendRow,
            valDiv,
            binDiv: binBuds.binDiv.div,
            namedResults: {},
        };
        let ret = await inputs(props);
        if (ret === undefined) return;
        valDiv.addValDiv(ret);
    }
    async function onDelSub() {
        await divStore.delValRow(id);
    }
    let vIBase: any;
    if (hasIBase === true) {
        let { iBase } = valDiv;
        let vContent: any;
        if (iBase === undefined) {
            vContent = 'I Base';
        }
        else {
            vContent = <ViewSpecBaseOnly id={iBase} />;
        }
        vIBase = <div className="">
            {vContent}
        </div>;
    }
    let cn: string = theme.bootstrapContainer + ' d-flex py-2 border-bottom ';
    if (level < divLevels) cn += 'tonwa-bg-gray-' + (divLevels - level);
    else cn += 'bg-white';
    return <div className={cn}>
        {vIBase}
        <RowCols contentClassName="flex-fill">
            {
                fields.map(field => {
                    const { bud } = field;
                    if (bud === valueBud) return null;
                    const { id } = bud;
                    let value = field.getValue(valRow);
                    if (value === null || value === undefined) return null;
                    return <ViewBud key={id} bud={bud} value={value} uiType={ViewBudUIType.inDiv} />;
                })
            }
        </RowCols>
        {btn}
    </div >;
}
