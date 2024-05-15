import { useAtomValue } from "jotai";
import { theme } from "tonwa-com";
import { RowColsSm, ViewAtomTitles, ViewShowBuds } from "../../../tool";
import { PAV, ViewDivProps, ViewDivRight, ViewPendValue, cn } from "./tool";
import { ViewIBase } from "./ViewIBase";
import { DivEditing } from "../../store";
import { ViewSpecBuds, ViewSpecAtom } from "../../views";

export function ViewRowLeaf(props: ViewDivProps) {
    const { divStore, valDiv, buttons } = props;
    const { sheetStore } = divStore;
    const { atomValRow, atomValue, binDiv } = valDiv;
    const { binDivBuds, entityBin } = binDiv;
    const { i: iBud } = entityBin;
    const { budValue, budPrice, budAmount, budI } = binDivBuds;
    const valRow = useAtomValue(atomValRow);
    const value = useAtomValue(atomValue);
    const { i, price, amount } = valRow;
    let {
        value: cnValue, price: cnPrice, amount: cnAmount
    } = theme;
    const { budsColl, bizAtomColl } = sheetStore;
    let budValueColl = budsColl[i];
    let viewAtomMain: any;
    const { budIBase } = binDivBuds;
    if (budIBase === undefined) {
        if (budI !== undefined) {
            viewAtomMain = <div className="mb-1">
                <ViewSpecAtom id={i} sheetStore={sheetStore} />
                <ViewAtomTitles budValueColl={budValueColl} bud={iBud} atomColl={bizAtomColl} />
            </div>;
        }
    }
    else {
        viewAtomMain = <ViewIBase sheetStore={sheetStore} valDiv={valDiv} />;
    }
    let viewIBud: any;
    if (budI !== undefined) {
        viewIBud = <>
            <ViewSpecBuds id={i} sheetStore={sheetStore} />
        </>;
        // <ViewShowBuds bud={budI} budValueColl={budValueColl} atomColl={bizAtomColl} />
    }
    const divEditing = new DivEditing(divStore, valDiv);
    return <>
        <div className={cn + ' flex-fill bg-white px-2 py-2 px-lg-3 '}>
            {viewAtomMain}
            <RowColsSm contentClassName="flex-fill">
                {viewIBud}
                {divEditing.buildViewBuds(bizAtomColl)}
            </RowColsSm>
        </div>
        <ViewDivRight>
            <ViewPendValue {...props} />
            <PAV bud={budAmount} className={cnAmount} val={amount} />
            <PAV bud={budPrice} className={cnPrice} val={price} />
            <PAV bud={budValue} className={cnValue} val={value} />
        </ViewDivRight>
        {buttons}
    </>;
}
