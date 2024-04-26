import { useAtomValue } from "jotai";
import { theme, FA, setAtomValue } from "tonwa-com";
import { ViewBud, ViewBudUIType, budContent } from "../../../Bud";
import { RowColsSm, ViewShowBuds } from "../../../tool";
import { PAV, ViewDivProps, ViewIdField, cn } from "./tool";
import { ViewPivotDiv } from "./ViewPivotDiv";
import { ViewIBase, ViewIBaseBuds } from "./ViewIBase";

export function ViewRowStem(props: ViewDivProps) {
    const { valDiv, divStore, buttons, hidePivot } = props;
    const { sheetStore } = divStore;
    const { atomValRow, atomValDivs, atomSum, binDiv } = valDiv;
    const { binDivBuds: binBuds, level, entityBin } = binDiv;
    const { fields } = binBuds;
    const valRow = useAtomValue(atomValRow);
    let sum = useAtomValue(atomSum);
    const divs = useAtomValue(atomValDivs);
    const { i: iValue, pendValue } = valRow;
    let {
        value: cnValue, sum: cnSum
        , pend: cnPend, pendOver: cnPendOver
        , labelColor
    } = theme;

    const { pivot } = entityBin;
    let viewPivot: any;
    if (pivot !== undefined && pivot === binDiv.subBinDiv && hidePivot !== true) {
        viewPivot = <ViewPivotDiv divStore={divStore} valDiv={valDiv} />;
    }
    let viewPendValue: any;
    if (level === 0) {
        let icon: string, color: string;
        if (sum > pendValue) {
            icon = 'exclamation-circle';
            color = cnPendOver;
        }
        else {
            icon = 'hand-o-right';
            color = cnPend;
        }
        viewPendValue = <div className="flex-fill d-flex align-items-center">
            <FA name={icon} className={color + ' me-2 '} />
            <span className={'w-min-2c w-min-3c ' + color}>{pendValue}</span>
        </div>;
    }

    const { budsColl, bizAtomColl } = sheetStore;
    let budValueColl = budsColl[iValue];
    // <ViewIdField bud={budI} value={iValue} />
    let fieldsSet = new Set<number>();
    for (let f of fields) {
        const { id } = f.bud;
        if (id === undefined) debugger;
        if (fieldsSet.has(id) === true) debugger;
        fieldsSet.add(id);
    }
    let content = <>
        <ViewIBaseBuds sheetStore={sheetStore} valDiv={valDiv} />
        <ViewShowBuds bud={entityBin.i} budValueColl={budValueColl} atomColl={bizAtomColl} />
        {
            fields.map(field => {
                const { bud } = field;
                return <ViewBud key={bud.id} bud={bud} value={field.getValue(valRow)} uiType={ViewBudUIType.inDiv} atomColl={bizAtomColl} />;
            })
        }
    </>;
    let viewContent: any, viewRight: any;
    if (viewPivot === undefined) {
        viewContent = <div className={cn}>
            <RowColsSm contentClassName="flex-fill">
                {content}
            </RowColsSm>
        </div>;
        if (divs.length > 0) {
            /*
            viewRight = <div className="d-flex flex-column align-items-end">
                <div className="flex-fill d-flex mb-1 me-1">
                    {buttons}
                </div>
                <div className="d-flex text-end flex-column align-items-end me-3">
                    {viewPendValue}
                    <PAV bud={entityBin.value} val={sum} className={cnSum} />
                </div>
            </div>;
            */
            viewRight = <>
                <div className="d-flex text-end flex-column align-items-end me-3">
                    {viewPendValue}
                    <PAV bud={entityBin.value} val={sum} className={cnSum} />
                </div>
                <div className="">
                    {buttons}
                </div>
            </>;
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
            {buttons}
        </>;
    }
    return <>
        <div className="flex-fill">
            <ViewIBase sheetStore={sheetStore} valDiv={valDiv} />
            {viewContent}
        </div>
        {viewRight}
    </>;
}
