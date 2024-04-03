import { useAtomValue } from "jotai";
import { BinEditing, DivEditing, DivStore, UseInputsProps, ValDiv } from "../store";
import { FA, Sep, getAtomValue, setAtomValue } from "tonwa-com";
import { useInputs } from "../inputs";
import { ViewBud, ViewBudSpec, ViewBudUIType, ViewSpec, ViewSpecBaseOnly, ViewSpecNoAtom, budContent } from "app/hooks";
import { OwnedBuds, RowCols, RowColsSm } from "app/hooks/tool";
import { theme } from "tonwa-com";
import { BizBud } from "app/Biz";
import { BinOwnedBuds } from "./BinOwnedBuds";
import { useRowEdit } from "./rowEdit";
import { Page } from "tonwa-app";

export function PageEditDiv({ divStore, valDiv }: { divStore: DivStore; valDiv: ValDiv; }) {
    const { sheetStore, binDiv, entityBin } = divStore;
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
    const { valDiv } = props;
    const { atomValDivs, binDiv } = valDiv;
    const { level, entityBin, div } = binDiv;
    const { divLevels, pivot } = entityBin;
    const inputs = useInputs();
    const divs = useAtomValue(atomValDivs);
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
            const { divStore } = props;
            const { atomValRow } = valDiv;
            const valRow = getAtomValue(atomValRow);
            let pendRow = await divStore.loadPendRow(valRow.pend);
            let ret = await inputs({
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
        alert('删除');
    }
    let buttons = <div className="cursor-pointer px-2 text-body-secondary" onClick={onDel}>
        <FA className="" name="trash-o" />
    </div>;

    return <div className={cnDivBottom}>
        <EditRow {...props} buttons={buttons} />
        {viewDivs}
    </div>
}

function EditRow(props: EditDivProps & { buttons: any; }) {
    const { valDiv, divStore, buttons } = props;
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
            // const binEditing = new BinEditing(entityBin, valRow);
            const editing = new DivEditing(divStore, undefined, binDiv, valDiv, valRow);
            // binEditing.setValues(binDetail);
            let ret = await rowEdit(editing);
            if (ret === true) {
                // Object.assign(valRow, binEditing.valRow);
                // await row.changed();
                const { valRow } = editing;
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
            </div>
            <div className="d-flex flex-column align-items-end w-min-2c">
                <div className="cursor-pointer px-2 py-1 mt-n2" onClick={onEdit}>
                    <FA className="text-primary" name="pencil-square-o" size="lg" />
                </div>
                <div className="flex-fill" />
                {buttons}
            </div>
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
