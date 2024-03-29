import { useAtomValue } from "jotai";
import { BinEditing, DivStore, UseInputsProps, ValDiv } from "../store";
import { FA, setAtomValue } from "tonwa-com";
import { useInputs } from "../inputs";
import { ViewBud, ViewBudSpec, ViewBudUIType, ViewSpec, ViewSpecBaseOnly, ViewSpecNoAtom } from "app/hooks";
import { OwnedBuds, RowCols, RowColsSm } from "app/hooks/tool";
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
            return <ViewDiv key={v.id} divStore={divStore} valDiv={v} editable={editable} className={className} />;
        })}
    </>;
}

function ViewRow(props: ViewDivProps) {
    const { valDiv, divStore } = props;
    const inputs = useInputs();
    const rowEdit = useRowEdit();
    const { atomValRow, atomValDivs, atomSum, atomValue, binDiv } = valDiv;
    const { binBuds, level, entityBin, div } = binDiv;
    const { divLevels } = entityBin;
    const { hasIBase, budValue, fields, budPrice, budAmount, budI } = binBuds;
    const valRow = useAtomValue(atomValRow);
    const sum = useAtomValue(atomSum);
    const value = useAtomValue(atomValue);
    const { pend, id, pendValue, price, amount } = valRow;
    const divs = useAtomValue(atomValDivs);
    const styleLeft = { paddingLeft: `${(level - 1) * 2 + 1}rem`, paddingRight: `1rem` };
    async function onDelSub() {
        if (level < divLevels) {
            alert('实现中...');
            return;
        }
        await divStore.delValRow(id);
    }
    let vDel = <div className="px-3 cursor-pointer text-warning" onClick={onDelSub}>
        <FA name="times" fixWidth={true} />
    </div>;
    const cnBtn = 'w-min-8c w-max-8c d-flex justify-content-end align-items-end';
    let cn: string = theme.bootstrapContainer + ' gx-0 ';
    let { value: cnValue, price: cnPrice, amount: cnAmount } = theme;
    let vIBase: any;
    if (hasIBase === true) {
        let { iBase } = valDiv;
        vIBase = iBase !== undefined ? <div className="fw-bold">
            <ViewSpecBaseOnly id={iBase} noVisible={true} />
        </div> : null;
    }
    let left: any;
    if (level > 0) {
        left = <div className="d-flex pt-2 cursor-pointer text-primary"
            onClick={onAddSub}
            style={styleLeft}>
            <FA name="plus" fixWidth={true} />
        </div>;
    }
    else {
        left = <div className="ps-3" />;
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

    return <div className={'d-flex border-bottom py-1 tonwa-bg-gray-' + (divLevels - level)}>
        {
            div === undefined ? <ViewRowLeaf {...props} /> : <ViewRowStem {...props} />
        }
    </div>;

    function ViewIdField({ bud, value }: { bud: BizBud; value: number }) {
        if (bud === undefined) return null;
        return <ViewSpecNoAtom id={value} noLabel={true} />;
    }

    function ViewRowStem({ divStore, valDiv, editable }: ViewDivProps) {
        let pendOverflow: any;
        if (level === 0 && sum > pendValue) {
            pendOverflow = <div className="flex-fill">
                <FA name="exclamation-circle" className="text-danger me-1" fixWidth={true} />
                <span className="">{pendValue}</span>
            </div>;
        }
        function ViewFields() {
            return fields.map(field => {
                const { bud } = field;
                return <ViewBud key={bud.id} bud={bud} value={field.getValue(valRow)} uiType={ViewBudUIType.inDiv} />;
            })
        }
        return <>
            {left}
            <div className="flex-fill">
                {vIBase}
                <div className={cn}>
                    <RowColsSm contentClassName="flex-fill">
                        <ViewIdField bud={budI} value={valRow.i} />
                        <BinOwnedBuds bizBud={entityBin.i} valRow={valRow} />
                        <ViewFields />
                    </RowColsSm>
                </div >
            </div>
            <div className={cnBtn}>
                {divs.length === 0 ? vDel : <div className="d-flex text-end flex-column align-items-end">
                    {pendOverflow}
                    <PAV bud={entityBin.value} val={sum} className={theme.sum} />
                </div>}
                {vDel}
            </div>
        </>;
    }

    function PAV({ bud, className, val, onClick }: { bud: BizBud; className?: string; val: number; onClick?: () => void }) {
        if (bud === undefined) return null;
        let { caption, name } = bud;
        return <div className="d-flex ms-3 align-items-end text-end text-nowrap" onClick={onClick}>
            <div className={theme.labelColor + ' me-2 '}>{caption ?? name}</div>
            <div className={(className ?? '') + ' w-min-3c '}>{val}</div>
        </div>
    }
    function ViewRowLeaf({ divStore, valDiv, editable }: ViewDivProps) {
        // div === undefined
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
        return <>
            {left}
            <div className="flex-fill">
                {
                    budI &&
                    <div className="px-3 py-2 bg-white border-bottom">
                        <ViewIdField bud={budI} value={valRow.i} />
                    </div>
                }
                <div className={cn + ' bg-white '}>
                    {vIBase}
                    <RowColsSm contentClassName="flex-fill">
                        <BinOwnedBuds bizBud={entityBin.i} valRow={valRow} />
                        {
                            fields.map(field => {
                                const { bud } = field;
                                const { id } = bud;
                                let value = field.getValue(valRow);
                                if (value === null || value === undefined) return null;
                                return <ViewBud key={id} bud={bud} value={value} uiType={ViewBudUIType.inDiv} />;
                            })
                        }
                    </RowColsSm>
                </div>
            </div>
            <div className={cnBtn}>
                <div className="d-flex align-items-end flex-column">
                    <PAV bud={budAmount} className={cnAmount} val={amount} />
                    <PAV bud={budPrice} className={cnPrice} val={price} />
                    <PAV bud={budValue} className={cnValue + ' cursor-pointer '} val={value} onClick={onEdit} />
                </div>
                {vDel}
            </div>
        </>;
    }
}