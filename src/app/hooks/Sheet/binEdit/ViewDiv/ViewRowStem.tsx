import { useAtomValue } from "jotai";
import { theme, FA } from "tonwa-com";
import { RowColsSm, ViewShowBuds } from "../../../tool";
import { PAV, ViewDivProps, ViewDivRight, ViewPendValue, cn } from "./tool";
import { ViewPivotDiv } from "./ViewPivotDiv";
import { ViewIBase, ViewIBaseBuds } from "./ViewIBase";
import { DivEditing } from "../../store";

export function ViewRowStem(props: ViewDivProps) {
    const { valDiv, binStore: divStore, buttons, hidePivot } = props;
    const { sheetStore } = divStore;
    const { atomSum, binDiv } = valDiv;
    const { entityBin } = binDiv;
    const valRow = useAtomValue(valDiv.getAtomValRow());
    let { sumValue, sumAmount } = useAtomValue(atomSum);
    const divs = useAtomValue(valDiv.getAtomValDivs());
    const { i: iValue } = valRow;
    let {
        sum: cnSum, sumBold: cnSumBold
    } = theme;

    const { pivot, i: budI, value: budValue } = entityBin;
    let viewPivot: any;
    if (pivot !== undefined && pivot === binDiv.subBinDiv && hidePivot !== true) {
        viewPivot = <ViewPivotDiv binStore={divStore} valDiv={valDiv} />;
    }

    const divEditing = new DivEditing(divStore, valDiv);
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
            <ViewIBase sheetStore={sheetStore} valDiv={valDiv} />
            {viewContent}
        </div>
        {viewRight}
    </>;
}
