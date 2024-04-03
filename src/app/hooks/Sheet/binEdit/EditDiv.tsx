import { useAtomValue } from "jotai";
import { BinEditing, DivStore, UseInputsProps, ValDiv } from "../store";
import { FA, getAtomValue, setAtomValue } from "tonwa-com";
import { useInputs } from "../inputs";
import { ViewBud, ViewBudSpec, ViewBudUIType, ViewSpec, ViewSpecBaseOnly, ViewSpecNoAtom, budContent } from "app/hooks";
import { OwnedBuds, RowCols, RowColsSm } from "app/hooks/tool";
import { theme } from "tonwa-com";
import { BizBud } from "app/Biz";
import { BinOwnedBuds } from "./BinOwnedBuds";
import { useRowEdit } from "./rowEdit";
import { Page } from "tonwa-app";

export function EditDiv({ divStore, valDiv }: { divStore: DivStore; valDiv: ValDiv; }) {
    const { sheetStore, binDiv, entityBin } = divStore;
    const { entitySheet, main } = sheetStore;
    return <Page header={`${(entitySheet.caption ?? entitySheet.name)} - ${main.no}`}>
        <ViewDiv divStore={divStore} valDiv={valDiv} />
    </Page>
}


interface ViewDivProps {
    divStore: DivStore;
    valDiv: ValDiv;
}

function ViewDiv(props: ViewDivProps) {
    const { valDiv } = props;
    const { atomValDivs, binDiv } = valDiv;
    const { level, entityBin, div } = binDiv;
    const { divLevels } = entityBin;
    const inputs = useInputs();
    const divs = useAtomValue(atomValDivs);
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
            console.log(ret);
            setAtomValue(atomValDivs, [...divs, ret]);
        }
        let bg = divLevels - level - 1;
        let borderTop = bg > 0 ? 'border-top' : '';
        let borderBottom = level === 0 ? 'border-bottom' : '';
        viewDivs = <div className="ms-4 border-start">
            {
                divs.map(v => <ViewDiv key={v.id} {...props} valDiv={v} />)
            }
            <div className={` ps-3 py-2 tonwa-bg-gray-${bg} ${borderTop} ${borderBottom} cursor-pointer`} onClick={onAddNew}>
                <FA name="plus" size="lg" className="me-2 text-success" /> {div?.ui?.caption}
            </div>
        </div>;
    }
    return <>
        <ViewRow {...props} />
        {viewDivs}
    </>
}

function ViewRow(props: ViewDivProps) {
    const { valDiv, divStore } = props;
    const inputs = useInputs();
    const rowEdit = useRowEdit();
    const { atomValRow, atomValDivs, atomSum, atomValue, binDiv, atomDeleted } = valDiv;
    const { binBuds, level, entityBin, div } = binDiv;
    const { divLevels } = entityBin;
    const { hasIBase, budValue, fields, budPrice, budAmount, budI } = binBuds;
    const valRow = useAtomValue(atomValRow);
    const sum = useAtomValue(atomSum);
    const value = useAtomValue(atomValue);
    const { pend, id, pendValue, price, amount } = valRow;
    const divs = useAtomValue(atomValDivs);
    const styleLeft = { paddingLeft: `${(level - 1) * 2 + 1}rem`, paddingRight: `1rem` };
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
    async function onAddSub() {
        const pendRow = await divStore.loadPendRow(pend);
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
        // if (viewPivot === undefined) {
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
        /*
        }
        else {
            viewContent = <div>
                <div className="d-flex">{content}</div>
                <div className="d-flex bg-white border-top">{viewPivot}</div>
            </div>;
            const { value: budValue } = entityBin;
            viewRight = <>
                <div className="text-end me-3">
                    <div className={labelColor}>{budValue.caption ?? budValue.name}</div>
                    <div className={cnValue}>{sum}</div>
                </div>
            </>;
        }
        */
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
