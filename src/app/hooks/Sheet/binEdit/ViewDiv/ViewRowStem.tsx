import { useAtomValue } from "jotai";
import { theme } from "tonwa-com";
import { RowColsSm, ViewShowBuds } from "../../../tool";
import { PAV, ViewDivProps, ViewDivRight, ViewPendValue, cn } from "./tool";
import { ViewPivotDiv } from "./ViewPivotDiv";
import { ViewIBase, ViewIBaseBuds } from "./ViewIBase";
import { DivEditing } from "../../../../Store";

export function ViewRowStem(props: ViewDivProps) {
    const { valDiv, binStore, buttons, hidePivot, index } = props;
    const { sheetStore } = binStore;
    const { atomSum, binDiv } = valDiv;
    const { entityBin } = binDiv;
    const valRow = useAtomValue(valDiv.getAtomValRow());
    let { sumValue } = useAtomValue(atomSum);
    const divs = useAtomValue(valDiv.atomValDivs);
    const { i: iValue } = valRow;
    let {
        sum: cnSum, sumBold: cnSumBold
    } = theme;

    const { pivot, i: budI, value: budValue } = entityBin;
    let viewPivot: any;
    if (pivot !== undefined && pivot === binDiv.subBinDiv && hidePivot !== true) {
        viewPivot = <ViewPivotDiv binStore={binStore} valDiv={valDiv} />;
    }

    const divEditing = new DivEditing(binStore, valDiv);
    let content = <>
        <ViewIBaseBuds sheetStore={sheetStore} valDiv={valDiv} />
        <ViewShowBuds bud={budI} id={iValue} store={sheetStore} />
        {divEditing.buildViewBuds()}
    </>;
    function ViewRight() {
        let cn = viewPivot !== undefined ? cnSumBold : cnSum;
        return <>
            <ViewDivRight>
                <ViewPendValue {...props} />
                <PAV bud={budValue} val={sumValue} className={cn} />
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
    return <>
        <div className="flex-fill px-2 py-2 px-lg-3">
            <ViewIBase sheetStore={sheetStore} valDiv={valDiv} index={index} />
            {viewContent}
        </div>
        {viewRight}
    </>;
}
