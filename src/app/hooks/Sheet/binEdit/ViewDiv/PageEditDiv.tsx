import { useAtomValue } from "jotai";
import { BinEditing, DivEditing, DivStore, UseInputsProps, ValDiv } from "../../store";
import { FA, Sep, getAtomValue, setAtomValue } from "tonwa-com";
import { useDivNew } from "../divNew";
import { ViewBud, ViewBudSpec, ViewBudUIType, ViewSpec, ViewSpecBaseOnly, ViewSpecNoAtom, budContent } from "app/hooks";
import { OwnedBuds, RowCols, RowColsSm } from "app/hooks/tool";
import { theme } from "tonwa-com";
import { BizBud } from "app/Biz";
import { BinOwnedBuds } from "../BinOwnedBuds";
import { useRowEdit } from "../useRowEdit";
import { Page, useModal } from "tonwa-app";
import { ValRow } from "../../tool";
import { ViewDivUndo } from "./ViewDivUndo";
import { ViewRow } from "./ViewRow";

export function PageEditDiv({ divStore, valDiv }: { divStore: DivStore; valDiv: ValDiv; }) {
    const { sheetStore } = divStore;
    const { entitySheet, main } = sheetStore;
    return <Page header={`${(entitySheet.caption ?? entitySheet.name)} - ${main.no}`}>
        <EditDiv divStore={divStore} valDiv={valDiv} />
    </Page>
}

interface EditDivProps {
    divStore: DivStore;
    valDiv: ValDiv;
}

function EditDiv(props: EditDivProps) {
    const modal = useModal();
    const { divStore, valDiv } = props;
    const { atomValDivs, binDiv, atomDeleted } = valDiv;
    const { level, entityBin, div } = binDiv;
    const { divLevels, pivot } = entityBin;
    const divInputs = useDivNew();
    const divs = useAtomValue(atomValDivs);
    const deleted = useAtomValue(atomDeleted);
    let bg = divLevels - level - 1;
    let borderTop = ''; // bg > 0 ? 'border-top' : '';
    let cdAddBottom: string;
    let cnDivBottom: string;
    if (div === undefined || div === pivot) {
        cnDivBottom = ' border-bottom ';
        cdAddBottom = '';
    }
    else {
        cnDivBottom = level === 0 ? ' mb-2 ' : ' mb-2 border-bottom ';
        cdAddBottom = ' border-bottom ';
    }
    let viewDivs: any;
    if (divs.length > 0) {
        async function onAddNew() {
            const { atomValRow } = valDiv;
            const valRow = getAtomValue(atomValRow);
            let pendRow = await divStore.loadPendRow(valRow.pend);
            let ret = await divInputs({
                divStore,
                pendRow,
                namedResults: {},
                binDiv: div,
                valDiv,
            });
            if (ret === undefined) return;
            setAtomValue(atomValDivs, [...divs, ret]);
        }
        viewDivs = <div className="ms-4 border-start">
            {
                divs.map(v => <EditDiv key={v.id} {...props} valDiv={v} />)
            }
            <div className={` ps-3 py-2 tonwa-bg-gray-${bg} ${borderTop} ${cdAddBottom} cursor-pointer text-success`} onClick={onAddNew}>
                <FA name="plus" size="lg" className="me-2" /> {div?.ui?.caption}
            </div>
        </div>;
    }
    async function onDel() {
        setAtomValue(atomDeleted, !deleted);
        if (level === 0) {
            modal.close();
            return;
        }
    }
    async function onDelThoroughly() {
        await divStore.delValDiv(valDiv);
    }

    function btn(onClick: () => void, icon: string, iconColor: string, caption: string, captionColor: string) {
        return <div className={'cursor-pointer px-2 ' + iconColor} onClick={onClick}>
            <FA className="me-1" name={icon} fixWidth={true} />
            <span className={captionColor}>{caption}</span>
        </div>
    }

    function btnDel(icon: string, caption?: string) {
        return btn(onDel, icon, ' text-body-secondary ', caption, '');
    }

    if (deleted === true) {
        //let viewRow = <ViewRow {...props} deleted={deleted} />
        let viewRow = <ViewRow {...props} />;
        return <ViewDivUndo divStore={divStore} valDiv={valDiv} viewRow={viewRow} />;
        /*
        return <div className="d-flex border-bottom">
            <div className="flex-fill text-body-tetiary opacity-50 text-decoration-line-through">
                <EditRow {...props} deleted={deleted} />
            </div>
            <div className="w-min-6c text-end pt-2">
                {btnDel('undo', '恢复')}
                {btn(onDelThoroughly, 'times', ' text-warning ', '删除', 'text-info')}
            </div>
        </div>;
        */
    }

    return <div className={cnDivBottom}>
        <ViewRow {...props} buttons={btnDel('trash-o')} />
        {viewDivs}
    </div>
}

function EditRow(props: EditDivProps & { buttons?: any; deleted?: boolean; }) {
    const { valDiv, divStore, buttons, deleted } = props;
    const rowEdit = useRowEdit();
    const { atomValRow, atomValDivs, atomSum, atomValue, binDiv, atomDeleted } = valDiv;
    const { binDivBuds: binBuds, level, entityBin, div } = binDiv;
    const { divLevels } = entityBin;
    const { hasIBase, budValue, fields, budPrice, budAmount, budI } = binBuds;
    const valRow = useAtomValue(atomValRow);
    const sum = useAtomValue(atomSum);
    const value = useAtomValue(atomValue);
    const { pend, id, pendValue, price, amount } = valRow;
    const divs = useAtomValue(atomValDivs);
    const cnBtn = ' w-min-8c w-max-8c d-flex justify-content-end align-items-end ';
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

    let rowContent: any, borderBottom: string;
    if (div === undefined) {
        borderBottom = '';
        rowContent = <ViewRowLeaf />;
    }
    else {
        borderBottom = 'border-bottom';
        rowContent = <ViewRowStem />;
    }
    return <div className={`d-flex ps-3 py-2 tonwa-bg-gray-${divLevels - level} ${borderBottom}`}>
        {rowContent}
    </div>;

    function ViewIdField({ bud, value }: { bud: BizBud; value: number }) {
        if (bud === undefined) return null;
        return <ViewSpecNoAtom id={value} noLabel={true} />;
    }

    function ViewRowStem() {
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
        viewContent = <div className={cn}>
            <RowColsSm contentClassName="flex-fill">
                {content}
            </RowColsSm>
        </div>;
        if (divs.length > 0) {
            let viewRightValue = <div className="d-flex text-end flex-column align-items-end me-3">
                {viewPend}
                <PAV bud={entityBin.value} val={sum} className={cnSum} />
            </div>

            viewRight = <div className={cnBtn}>
                {viewRightValue}
            </div>;
        }
        return <>
            <div className="flex-fill">
                {vIBase}
                {viewContent}
            </div>
            {viewRight}
            <div className="d-flex flex-column w-min-2c">
                <div className="flex-fill" />
                {buttons}
            </div>
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
            const editing = new DivEditing(divStore, undefined, binDiv, valDiv, valRow);
            let ret = await rowEdit(editing);
            if (ret !== true) return;
            const { valRow: newValRow } = editing;
            if (isPivotKeyDuplicate(newValRow) === true) {
                alert('Pivot key duplicate');
                return;
            }
            await divStore.saveDetail(binDiv, newValRow);
            setAtomValue(atomValRow, newValRow);

            function isPivotKeyDuplicate(valRow: ValRow) {
                const { key } = binDiv;
                if (key === undefined) return false;
                const { id: keyId } = key;
                const keyValue = valRow.buds[keyId];
                const valDivParent = divStore.getParentValDiv(valDiv);
                const { atomValDivs } = valDivParent;
                const valDivs = getAtomValue(atomValDivs);
                for (let vd of valDivs) {
                    if (vd === valDiv) continue;
                    const { atomValRow } = vd;
                    const vr = getAtomValue(atomValRow);
                    if (keyValue === vr.buds[keyId]) return true;
                }
                return false;
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
            </div>
            {
                deleted !== true &&
                <div className="d-flex flex-column align-items-end w-min-2c">
                    <div className="cursor-pointer px-2 py-1 mt-n2" onClick={onEdit}>
                        <FA className="text-primary" name="pencil-square-o" size="lg" />
                    </div>
                    <div className="flex-fill" />
                    {buttons}
                </div>
            }
        </>;
    }
}

function EditPivotDiv({ valDiv }: EditDivProps) {
    const divs = useAtomValue(valDiv.atomValDivs);
    const { labelColor, value: cnValue } = theme;
    return <>
        {divs.map(v => <ViewPivot key={v.id} valDiv={v} />)}
    </>;
    function ViewPivot({ valDiv }: { valDiv: ValDiv }) {
        const { binDiv, atomValRow, atomValue } = valDiv;
        const { binDivBuds: binBuds } = binDiv;
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
