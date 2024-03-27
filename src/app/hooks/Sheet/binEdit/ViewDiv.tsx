import { useAtomValue } from "jotai";
import { BinEditing, DivStore, UseInputsProps, ValDiv } from "../store";
import { FA, setAtomValue } from "tonwa-com";
import { useInputs } from "../inputs";
import { ViewBud, ViewBudUIType, ViewSpec, ViewSpecBaseOnly } from "app/hooks";
import { OwnedBuds, RowCols } from "app/hooks/tool";
import { theme } from "tonwa-com";
import { BizBud } from "app/Biz";
import { BinOwnedBuds } from "./BinOwnedBuds";
import { useRowEdit } from "./rowEdit";

interface ViewDivProps {
    divStore: DivStore;
    valDiv: ValDiv;
    editable: boolean;
    className?: string;
}

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
    const rowEdit = useRowEdit();
    const { atomValRow, atomValDivs, atomSum: atomValue, binDiv } = valDiv;
    const { binBuds, level, entityBin, div } = binDiv;
    const { i: budI, divLevels, price: priceBud, amount: amountBud } = entityBin;
    const { hasIBase, valueBud, fields } = binBuds;
    const valRow = useAtomValue(atomValRow);
    const value = useAtomValue(atomValue);
    const { pend, id, pendValue, price, amount } = valRow;
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
    else if (valueBud !== undefined || priceBud !== undefined || amountBud !== undefined) {
        function PAV({ bud, className, val, onClick }: { bud: BizBud; className: string; val: number; onClick?: () => void }) {
            let { caption, name } = bud;
            return <div className="d-flex ms-3 align-items-end text-end text-nowrap" onClick={onClick}>
                <div className={theme.labelColor + ' me-2 '}>{caption ?? name}</div>
                <div className={className + ' w-min-3c '}>{val}</div>
            </div>
        }
        async function onEdit() {
            if (editable === false) return;
            const binEditing = new BinEditing(entityBin, valRow);
            // binEditing.setValues(binDetail);
            let ret = await rowEdit(binEditing);
            if (ret === true) {
                // Object.assign(valRow, binEditing.valRow);
                // await row.changed();
                const { valRow } = binEditing;
                await divStore.saveDetail(binDiv, valRow);
                setAtomValue(atomValRow, valRow);
            }
        }
        let { value: cnValue, price: cnPrice, amount: cnAmount } = theme;
        btn = <div className={cnBtn}>
            <div className="d-flex align-items-end flex-column">
                {amountBud && <PAV bud={amountBud} className={cnAmount} val={amount} />}
                {priceBud && <PAV bud={priceBud} className={cnPrice} val={price} />}
                {valueBud && <PAV bud={valueBud} className={cnValue + ' cursor-pointer '} val={value} onClick={onEdit} />}
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
    function ViewIdField({ bud, value }: { bud: BizBud; value: number }) {
        if (bud === undefined) return null;
        return <ViewSpec id={value} bold={false} noLabel={true} />;
    }
    return <div>
        <div className="px-3 py-2 bg-white border-bottom">
            <ViewIdField bud={budI} value={valRow.i} />
        </div>
        <div className={cn}>
            {vIBase}
            <RowCols contentClassName="flex-fill">
                <BinOwnedBuds bizBud={entityBin.i} valRow={valRow} />
                {
                    fields.map(field => {
                        const { bud } = field;
                        if (bud === valueBud) return null;
                        if (bud === priceBud) return null;
                        if (bud === amountBud) return null;
                        const { id } = bud;
                        let value = field.getValue(valRow);
                        if (value === null || value === undefined) return null;
                        return <ViewBud key={id} bud={bud} value={value} uiType={ViewBudUIType.inDiv} />;
                    })
                }
            </RowCols>
            {btn}
        </div >
    </div>;
}
