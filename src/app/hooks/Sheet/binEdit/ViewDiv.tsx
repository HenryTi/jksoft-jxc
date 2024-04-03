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
import { useModal } from "tonwa-app";
import { EditDiv } from "./EditDiv";
import { ViewPendRow } from "./ViewPendRow";

interface ViewDivProps {
    divStore: DivStore;
    valDiv: ValDiv;
    editable: boolean;
    className?: string;
}

export function ViewDiv(props: ViewDivProps) {
    const modal = useModal();
    const { divStore, valDiv } = props;
    const { binDiv, atomDeleted, atomValRow, atomValDivs } = valDiv;
    const { entityBin } = binDiv;
    const divs = useAtomValue(atomValDivs);
    const valRow = useAtomValue(atomValRow);
    const deleted = useAtomValue(atomDeleted);
    const inputs = useInputs();
    if (entityBin.pivot === binDiv) return null;
    const { pend, id } = valRow;

    async function onDelSub() {
        if (id < 0) {
            // 候选还没有输入行内容
            divStore.removePend(pend);
            return;
        }
        setAtomValue(atomDeleted, !deleted);
        /*
        if (level < divLevels) {
            alert('实现中...');
            return;
        }
        await divStore.delValRow(id);
        */
    }
    async function onEdit() {
        if (id < 0) {
            // 候选还没有输入行内容
            let pendRow = divStore.getPendRow(pend);
            const useInputsProps: UseInputsProps = {
                divStore,
                binDiv: divStore.binDiv,
                valDiv,
                pendRow,
                namedResults: {},
            }
            let retValDiv = await inputs(useInputsProps, false);
            if (retValDiv === undefined) return;
            divStore.replaceValDiv(valDiv, retValDiv);
            return;
        }
        await modal.open(<EditDiv divStore={divStore} valDiv={valDiv} />);
    }
    async function onDelThoroughly() {
        alert('彻底删除尚未实现');
    }
    let cnBtnDiv = ' px-1 cursor-pointer text-primary mt-n1 ';
    let btnEdit: any, iconDel: string, colorDel: string, memoDel: any;
    if (deleted === true) {
        iconDel = 'undo';
        colorDel = 'text-secondary opacity-100 ';
        memoDel = <span className="text-info me-1">恢复</span>;
    }
    else {
        iconDel = 'trash-o';
        colorDel = 'text-success';
        let iconEdit: string, colorEdit: string;
        if (divs.length === 0) {
            iconEdit = 'plus';
            colorEdit = ' text-primary ';
        }
        else {
            iconEdit = 'pencil-square-o';
            colorEdit = ' text-primary ';
        }
        btnEdit = <div className={cnBtnDiv + colorEdit} onClick={onEdit}>
            <FA name={iconEdit} fixWidth={true} size="lg" />
        </div>;
    }
    let btnDel = <>
        <div className={cnBtnDiv + colorDel} onClick={onDelSub}>
            <FA name={iconDel} fixWidth={true} size="lg" />
            {memoDel}
        </div>
    </>;

    if (deleted === true) {
        return <div className="">
            <div className="mt-1 d-flex justify-content-end">
                {btnDel}
                <div className={cnBtnDiv + ' text-warning '} onClick={onDelThoroughly}>
                    <FA name="times" fixWidth={true} size="lg" />
                    <span className="text-info me-3">彻底删除</span>
                </div>
            </div>
            <div className="text-body-tetiary opacity-50 text-decoration-line-through">
                <ViewRow {...props} />
            </div>
        </div>;
    }

    const buttons = <>{btnEdit}{btnDel}</>;
    if (id < 0) {
        return <ViewPendRow divStore={divStore} pendRow={divStore.getPendRow(pend)} viewButtons={<>{buttons}<div className="me-n3" /></>} />;
    }

    return <>
        <ViewRow {...props} buttons={buttons} />
        {divs.map(v => <ViewDiv key={v.id} {...props} valDiv={v} />)}
    </>
}

function ViewRow(props: ViewDivProps & { buttons?: any; }) {
    const { valDiv, divStore, editable, buttons } = props;
    const inputs = useInputs();
    const rowEdit = useRowEdit();
    const { atomValRow, atomValDivs, atomSum, atomValue, binDiv, atomDeleted } = valDiv;
    const { binBuds, level, entityBin, div } = binDiv;
    const { divLevels } = entityBin;
    const { hasIBase, budValue, fields, budPrice, budAmount, budI } = binBuds;
    const valRow = useAtomValue(atomValRow);
    let sum = useAtomValue(atomSum);
    if (Number.isNaN(sum) === true) {
        sum = 0;
    }
    const value = useAtomValue(atomValue);
    const { pend, pendValue, price, amount } = valRow;
    const divs = useAtomValue(atomValDivs);
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
                            {buttons}
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
                <div className="text-end mx-3">
                    <div className={labelColor}>{budValue.caption ?? budValue.name}</div>
                    <div className={cnValue}>{sum}</div>
                </div>
                {/*btnDel*/}
            </>;
        }
        return <>
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
        if (Number.isNaN(val) === true) {
            debugger;
            val = 0;
        }
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
        let valueValue = useAtomValue(atomValue);
        if (valueValue === undefined) {
            valueValue = 0;
        }
        else if (Number.isNaN(valueValue) === true) {
            debugger;
            valueValue = 0;
        }
        return <div className="text-end ms-3">
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
