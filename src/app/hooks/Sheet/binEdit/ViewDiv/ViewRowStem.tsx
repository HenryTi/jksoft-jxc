import { useAtomValue } from "jotai";
import { theme, FA } from "tonwa-com";
import { RowColsSm, ViewAtomTitles, ViewShowBuds } from "../../../tool";
import { PAV, ViewDivProps, ViewDivRight, cn } from "./tool";
import { ViewPivotDiv } from "./ViewPivotDiv";
import { ViewIBase, ViewIBaseBuds } from "./ViewIBase";
import { DivEditing } from "../../store";
import { ViewSpecAtom } from "../../views";

export function ViewRowStem(props: ViewDivProps) {
    const { valDiv, divStore, buttons, hidePivot, readonly } = props;
    const { sheetStore } = divStore;
    const { atomValRow, atomValDivs, atomSum, binDiv } = valDiv;
    const { level, entityBin, binDivBuds } = binDiv;
    const { budIBase } = binDivBuds;
    const valRow = useAtomValue(atomValRow);
    let sum = useAtomValue(atomSum);
    const divs = useAtomValue(atomValDivs);
    const { i: iValue, pendValue } = valRow;
    let {
        sum: cnSum, sumBold: cnSumBold
        , pend: cnPend, pendOver: cnPendOver, pendValue: cnPendValue
    } = theme;

    const { pivot, i: budI, value: budValue } = entityBin;
    let viewPivot: any;
    if (pivot !== undefined && pivot === binDiv.subBinDiv && hidePivot !== true) {
        viewPivot = <ViewPivotDiv divStore={divStore} valDiv={valDiv} />;
    }
    let viewPendValue: any;
    if (level === 0) {
        if (readonly !== true) {
            let icon: string, color: string;
            if (sum > pendValue) {
                icon = 'exclamation-circle';
                color = cnPendOver;
            }
            else {
                icon = 'th-large'; //'hand-o-right';
                color = cnPend;
            }
            viewPendValue = <div className="d-flex align-items-center">
                <FA name={icon} className={color + ' me-2 '} />
                <span className={'w-min-2c w-min-3c ' + cnPendValue}>{budValue?.getUIValue(pendValue)}</span>
            </div>;
        }
    }

    const { budsColl, bizAtomColl } = sheetStore;
    let budValueColl = budsColl[iValue];
    const divEditing = new DivEditing(divStore, valDiv);
    let content = <>
        <ViewIBaseBuds sheetStore={sheetStore} valDiv={valDiv} />
        <ViewShowBuds bud={budI} budValueColl={budValueColl} atomColl={bizAtomColl} />
        {divEditing.buildViewBuds(bizAtomColl)}
    </>;
    function ViewRight() {
        let cn = viewPivot !== undefined ? cnSumBold : cnSum;
        return <>
            <ViewDivRight>
                {viewPendValue}
                <PAV bud={budValue} val={sum} className={cn} />
            </ViewDivRight>
            {buttons}
        </>;
    }

    let viewContent: any, viewRight: any;
    if (viewPivot === undefined) {
        viewContent = <div className={cn}>
            <RowColsSm contentClassName="flex-fill">
                {content}
            </RowColsSm>
        </div>;
        if (divs.length > 0) {
            viewRight = <ViewRight />;
        }
    }
    else {
        viewContent = <div className="d-flex">
            {content}
            {viewPivot}
        </div>;
        viewRight = <ViewRight />;
    }
    function ViewI() {
        if (budIBase === undefined) return null;
        return <>
            <div>level={level} iValue={iValue} iBase={valDiv.iBase}</div>
            <ViewSpecAtom id={iValue} sheetStore={sheetStore} />
            <ViewAtomTitles budValueColl={budValueColl} bud={budI} atomColl={bizAtomColl} />
        </>;
    }
    // <ViewI />
    return <>
        <div className="flex-fill px-2 py-2 px-lg-3">
            <ViewIBase sheetStore={sheetStore} valDiv={valDiv} />
            {viewContent}
        </div>
        {viewRight}
    </>;
}
