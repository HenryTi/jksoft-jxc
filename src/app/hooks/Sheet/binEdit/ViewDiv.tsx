import { useAtomValue } from "jotai";
import { BinEditing, DivStore, UseInputsProps, ValDiv } from "../store";
import { FA, setAtomValue } from "tonwa-com";
import { useInputs } from "../inputs";
import { ViewBud, ViewBudSpec, ViewBudUIType, ViewSpec, ViewSpecBaseOnly, ViewSpecNoAtom, budContent } from "app/hooks";
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

export function ViewDiv(props: ViewDivProps) {
    const { valDiv } = props;
    const { binDiv } = valDiv;
    const { entityBin } = binDiv;
    if (entityBin.pivot === binDiv) return null;
    return <>
        <ViewRow {...props} />
        <ViewDivs {...props} />
    </>
}

function ViewDivs(props: ViewDivProps) {
    const { valDiv } = props;
    const { atomValDivs } = valDiv;
    const divs = useAtomValue(atomValDivs);
    return <>
        {divs.map(v => <ViewDiv key={v.id} {...props} valDiv={v} />)}
    </>;
}

function ViewRow(props: ViewDivProps) {
    const { valDiv, divStore, editable } = props;
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
    function onEdit() {
        alert('实现中...');
    }
    let btnEdit = <div className="px-1 cursor-pointer text-primary align-self-end" onClick={onEdit}>
        <FA name="pencil-square-o" fixWidth={true} size="lg" />
    </div>;
    let btnDel = <div className="px-1 cursor-pointer text-success align-self-end" onClick={onDelSub}>
        <FA name="times" fixWidth={true} size="lg" />
    </div>;
    const cnBtn = 'w-min-8c w-max-8c d-flex justify-content-end align-items-end';
    let {
        value: cnValue, sum: cnSum, price: cnPrice, amount: cnAmount
        , pend: cnPend, pendOver: cnPendOver
        , labelColor, bootstrapContainer
    } = theme;
    let cn: string = bootstrapContainer + ' gx-0 ';
    let vIBase: any;
    if (hasIBase === true) {
        let { iBase } = valDiv;
        vIBase = iBase !== undefined ? <div className="fw-bold">
            <ViewSpecBaseOnly id={iBase} noVisible={true} />
        </div> : null;
    }
    let left: any;
    /*
    if (level > 0) {
        left = <div className="d-flex pt-2 cursor-pointer text-primary align-self-end"
            onClick={onAddSub}
            style={styleLeft}>
            <FA name="plus" fixWidth={true} />
        </div>;
    }
    else {
        left = <div className="ps-3" />;
    }
    */
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

    return <div className={'d-flex border-bottom ps-3 py-2 tonwa-bg-gray-' + (divLevels - level)}>
        {div === undefined ? <ViewRowLeaf /> : <ViewRowStem />}
    </div>;

    function ViewIdField({ bud, value }: { bud: BizBud; value: number }) {
        if (bud === undefined) return null;
        return <ViewSpecNoAtom id={value} noLabel={true} />;
    }

    function ViewRowStem() {
        const { pivot } = entityBin;
        let viewPivot: any;
        if (pivot !== undefined && pivot === binDiv.div) {
            viewPivot = <ViewPivotDiv divStore={divStore} valDiv={valDiv} editable={editable} />;
        }
        let viewPend: any;
        if (level === 0) {
            let icon: string, color: string;
            if (sum > pendValue) {
                icon = 'exclamation-circle';
                color = cnPendOver;
            }
            else {
                icon = 'hand-right-o';
                color = cnPend;
            }
            viewPend = <div className="flex-fill d-flex align-items-center">
                <FA name={icon} className={color + ' me-2 '} />
                <span className={'w-min-2c ' + color}>{pendValue}</span>
            </div>;
        }
        function ViewFields() {
            return fields.map(field => {
                const { bud } = field;
                return <ViewBud key={bud.id} bud={bud} value={field.getValue(valRow)} uiType={ViewBudUIType.inDiv} />;
            })
        }
        let content = <>
            <ViewIdField bud={budI} value={valRow.i} />
            <BinOwnedBuds bizBud={entityBin.i} valRow={valRow} />
            <ViewFields />
        </>;
        let viewContent: any, viewRight: any;
        if (viewPivot === undefined) {
            viewContent = <div className={cn}>
                <RowColsSm contentClassName="flex-fill">
                    {content}
                </RowColsSm>
            </div>;
            if (divs.length > 0) {
                let viewRightValue = <div className="d-flex text-end flex-column align-items-end">
                    {viewPend}
                    <PAV bud={entityBin.value} val={sum} className={cnSum} />
                </div>

                viewRight = <div className={cnBtn}>
                    {viewRightValue}
                    {/*btnDel*/}
                </div>;
                if (level === 0) {
                    viewRight = <div className="d-flex flex-column align-items-end">
                        <div className="flex-fill d-flex mb-1 me-1">
                            {btnEdit}
                            {btnDel}
                        </div>
                        <div className="me-3">
                            {viewRightValue}
                        </div>
                    </div>;
                }
            }
        }
        else {
            viewContent = <div className="d-flex">
                {content}
                {viewPivot}
            </div>;
            const { value: budValue } = entityBin;
            viewRight = <>
                <div className="text-end me-3">
                    <div className={labelColor}>{budValue.caption ?? budValue.name}</div>
                    <div className={cnValue}>{sum}</div>
                </div>
                {/*btnDel*/}
            </>;
        }
        return <>
            {left}
            <div className="flex-fill">
                {vIBase}
                {viewContent}
            </div>
            {viewRight}
        </>;
    }

    function PAV({ bud, className, val, onClick }: { bud: BizBud; className?: string; val: number; onClick?: () => void }) {
        if (bud === undefined) return null;
        let { caption, name } = bud;
        return <div className="d-flex ms-3 align-items-center text-end text-nowrap" onClick={onClick}>
            <div className={labelColor + ' me-2 '}>{caption ?? name}</div>
            <div className={(className ?? '') + ' w-min-2c '}>{val}</div>
        </div>
    }
    function ViewRowLeaf() {
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
                <div className="d-flex align-items-end flex-column me-3">
                    <PAV bud={budAmount} className={cnAmount} val={amount} />
                    <PAV bud={budPrice} className={cnPrice} val={price} />
                    <PAV bud={budValue} className={cnValue + ' cursor-pointer '} val={value} onClick={onEdit} />
                </div>
                {/*btnDel*/}
            </div>
        </>;
    }
}

function ViewPivotDiv({ valDiv }: ViewDivProps) {
    const divs = useAtomValue(valDiv.atomValDivs);
    const { labelColor, value: cnValue } = theme;
    return <>
        {divs.map(v => <ViewPivot key={v.id} valDiv={v} />)}
    </>;
    function ViewPivot({ valDiv }: { valDiv: ValDiv }) {
        const { binDiv, atomValRow, atomValue } = valDiv;
        const { binBuds } = binDiv;
        const { fields } = binBuds;
        const valRow = useAtomValue(atomValRow);
        const valueValue = useAtomValue(atomValue);
        return <div className="text-end mx-2">
            <div>
                {
                    fields.map(field => {
                        const { bud } = field;
                        const { id } = bud;
                        let value = field.getValue(valRow);
                        if (value === null || value === undefined) return null;
                        return <span key={id} className={labelColor}>
                            {budContent(bud, value)}
                        </span>;
                    })
                }
            </div>
            <div className={cnValue}>{valueValue}</div>
        </div>;
    }
}
