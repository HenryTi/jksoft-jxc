import { useAtomValue } from "jotai";
import { BinEditing, DivStore, UseInputsProps, ValDiv } from "../store";
import { FA, getAtomValue, setAtomValue } from "tonwa-com";
import { useInputs } from "../inputs";
import { ViewBud, ViewBudUIType, ViewSpecBaseOnly, ViewSpecNoAtom, budContent } from "app/hooks";
import { OwnedBuds, RowCols, RowColsSm } from "app/hooks/tool";
import { theme } from "tonwa-com";
import { BizBud, BudDataType, EnumBudType } from "app/Biz";
import { BinOwnedBuds } from "./BinOwnedBuds";
import { useRowEdit } from "./rowEdit";
import { useModal } from "tonwa-app";
import { PageEditDiv } from "./EditDiv";
import { ViewPendRow } from "./ViewPendRow";

interface ViewDivProps {
    divStore: DivStore;
    valDiv: ValDiv;
    editable: boolean;
    className?: string;
    buttons?: any;
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
        if (divs.length === 0) {
            // 无Div明细
            try {
                let pendRow = await divStore.loadPendRow(pend);
                let ret = await inputs({
                    divStore,
                    pendRow,
                    namedResults: {},
                    binDiv,
                    valDiv,
                });
                if (ret === undefined) return;
                setAtomValue(atomValDivs, [...divs, ret]);
                return;
            }
            catch (e) {
                console.error(e);
                alert('error');
            }
        }
        await modal.open(<PageEditDiv divStore={divStore} valDiv={valDiv} />);
    }
    async function onDelThoroughly() {
        await divStore.delValDiv(valDiv);
    }
    let cnBtnDiv = ' px-1 cursor-pointer text-primary ';
    let btnEdit: any, iconDel: string, colorDel: string, memoDel: any;
    if (deleted === true) {
        iconDel = 'undo';
        colorDel = 'text-secondary opacity-100 ';
        memoDel = '恢复';
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
            <FA name={iconDel} fixWidth={true} />
            {memoDel && <span className="ms-1">{memoDel}</span>}
        </div>
    </>;

    if (deleted === true) {
        return <div className="d-flex">
            <div className="flex-fill text-body-tetiary opacity-50 text-decoration-line-through">
                <ViewRow {...props} />
            </div>
            <div className="w-min-6c text-end pt-2 me-2">
                {btnDel}
                <div className={cnBtnDiv + ' text-warning mt-2'} onClick={onDelThoroughly}>
                    <FA name="times" fixWidth={true} />
                    <span className="text-info ms-1">删除</span>
                </div>
            </div>
        </div>;
    }

    let buttons = <>{btnEdit}{btnDel}</>;
    if (id < 0) {
        let pendRow = divStore.getPendRow(pend);
        buttons = <>{buttons}<div className="me-n3" /></>;
        return <ViewPendRow divStore={divStore} pendRow={pendRow} viewButtons={buttons} />;
    }

    if (divs.length === 0) {
        return <ViewRow {...props} buttons={buttons} />;
    }
    return <>
        <ViewRow {...props} buttons={buttons} />
        {divs.map(v => <ViewDiv key={v.id} {...props} valDiv={v} />)}
    </>
}

const cnBtn = 'w-min-8c w-max-8c d-flex justify-content-end align-items-end';
let cn: string = theme.bootstrapContainer + ' gx-0 ';

function ViewRow(props: ViewDivProps) {
    const { valDiv } = props;
    const { binDiv } = valDiv;
    const { binDivBuds: binBuds, level, entityBin, div } = binDiv;
    const { divLevels } = entityBin;
    const { hasIBase } = binBuds;
    let vIBase: any;
    if (hasIBase === true) {
        let { iBase } = valDiv;
        vIBase = iBase !== undefined ? <div className="fw-bold">
            <ViewSpecBaseOnly id={iBase} noVisible={true} />
        </div> : null;
    }
    return <div className={'d-flex border-bottom ps-3 py-2 tonwa-bg-gray-' + (divLevels - level)}>
        {
            div === undefined ?
                <ViewRowLeaf {...props} vIBase={vIBase} />
                :
                <ViewRowStem {...props} vIBase={vIBase} />
        }
    </div>;

}

function ViewIdField({ bud, value }: { bud: BizBud; value: number }) {
    if (bud === undefined) return null;
    return <ViewSpecNoAtom id={value} noLabel={true} />;
}

function PAV({ bud, className, val, onClick }: { bud: BizBud; className?: string; val: number; onClick?: () => void }) {
    if (bud === undefined) return null;
    let { caption, name } = bud;
    if (Number.isNaN(val) === true) {
        debugger;
        val = 0;
    }
    return <div className="d-flex ms-3 align-items-center text-end text-nowrap" onClick={onClick}>
        <div className={theme.labelColor + ' me-2 '}>{caption ?? name}</div>
        <div className={(className ?? '') + ' w-min-2c '}>{val}</div>
    </div>
}

function ViewRowStem(props: ViewDivProps & { vIBase: any; buttons?: any; }) {
    const { valDiv, divStore, editable, vIBase, buttons } = props;
    const { atomValRow, atomValDivs, atomSum, atomValue, binDiv } = valDiv;
    const { binDivBuds: binBuds, level, entityBin, div } = binDiv;
    const { fields, budI } = binBuds;
    const valRow = useAtomValue(atomValRow);
    let sum = useAtomValue(atomSum);
    const divs = useAtomValue(atomValDivs);
    const { pendValue } = valRow;
    let {
        value: cnValue, sum: cnSum
        , pend: cnPend, pendOver: cnPendOver
        , labelColor
    } = theme;

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

function ViewRowLeaf(props: ViewDivProps & { vIBase: any; }) {
    // div === undefined
    const { valDiv, divStore, editable, vIBase, buttons } = props;
    const rowEdit = useRowEdit();
    const { atomValRow, atomValue, binDiv } = valDiv;
    const { binDivBuds: binBuds, entityBin } = binDiv;
    const { budValue, fields, budPrice, budAmount, budI } = binBuds;
    const valRow = useAtomValue(atomValRow);
    const value = useAtomValue(atomValue);
    const { price, amount } = valRow;
    let {
        value: cnValue, price: cnPrice, amount: cnAmount
    } = theme;
    async function onEdit() {
        if (editable === false) return;
        const binEditing = new BinEditing(entityBin, valRow);
        let ret = await rowEdit(binEditing);
        if (ret === true) {
            const { valRow } = binEditing;
            await divStore.saveDetail(binDiv, valRow);
            setAtomValue(atomValRow, valRow);
        }
    }
    // <ViewIdField bud={budI} value={valRow.i} />
    return <>
        <div className="flex-fill">
            {
                budI &&
                <div className="mb-1">
                    <ViewSpecBaseOnly id={valRow.i} noVisible={false} bold={true} />
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
        </div>
        <div className="d-flex align-items-start">
            {buttons}
        </div>
    </>;
}

function ViewPivotDiv({ valDiv }: ViewDivProps) {
    const divs = useAtomValue(valDiv.atomValDivs);
    const { labelColor, value: cnValue } = theme;
    return <>
        {divs.map(v => <ViewPivot key={v.id} valDiv={v} />)}
    </>;
    function ViewPivot({ valDiv }: { valDiv: ValDiv }) {
        const { binDiv, atomValRow, atomValue } = valDiv;
        const { binDivBuds: binBuds, format } = binDiv;
        const { keyField, fieldColl } = binBuds;
        const valRow = useAtomValue(atomValRow);
        let valueValue = useAtomValue(atomValue);
        if (valueValue === undefined) {
            valueValue = 0;
        }
        else if (Number.isNaN(valueValue) === true) {
            debugger;
            valueValue = 0;
        }
        const { bud } = keyField;
        const { id } = bud;
        let value = keyField.getValue(valRow);
        if (value === null || value === undefined) return null;
        let keyLabel = <span key={id} className={labelColor}>
            {budContent(bud, value)}
        </span>
        let viewFormat: any;
        if (format !== undefined) {
            viewFormat = format.map(([bud, withLabel, item]) => {
                let field = fieldColl[bud.name];
                let value = field.getValue(valRow);
                if (value === null || value === undefined) return null;
                if (item !== undefined) {
                    if (value === item.value) return null;
                }
                return <span key={bud.id}>
                    {withLabel && <span className={labelColor + ' small '}>{bud.caption ?? bud.name}:</span>}
                    {budContent(bud, value)};
                </span>;
            })
        }
        return <div className="text-end ms-3">
            <div>{keyLabel}</div>
            <div className={cnValue}>{valueValue}</div>
            <div className="w-max-8c">{viewFormat}</div>
        </div>;
    }
}
