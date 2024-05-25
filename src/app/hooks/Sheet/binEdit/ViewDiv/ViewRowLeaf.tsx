import { useAtomValue } from "jotai";
import { theme } from "tonwa-com";
import { RowColsSm } from "../../../tool";
import { PAV, ViewDivProps, ViewDivRight, ViewPendValue, cn } from "./tool";
import { ViewIBase } from "./ViewIBase";
import { DivEditing } from "../../store";
import { ViewSpecBuds } from "app/hooks/View";

export function ViewRowLeaf(props: ViewDivProps) {
    const { divStore, valDiv, buttons } = props;
    const { sheetStore } = divStore;
    const { atomValRow, atomValue, binDiv } = valDiv;
    const { binDivBuds } = binDiv;
    // const { i: iBud, iBase } = entityBin;
    const { budValue, budPrice, budAmount, budI } = binDivBuds;
    const valRow = useAtomValue(atomValRow);
    const value = useAtomValue(atomValue);
    const { i, price, amount } = valRow;
    let {
        value: cnValue, price: cnPrice, amount: cnAmount
    } = theme;
    const { bizAtomColl } = sheetStore;
    //let budValueColl = budsColl[i];
    // let viewAtomMain: any;
    /*
    const { budIBase } = binDivBuds;
    if (budIBase === undefined && iBase === undefined) {
        if (budI !== undefined) {
            viewAtomMain = <div className="mb-1">
                <ViewSpecAtom id={i} store={sheetStore} />
                <ViewAtomTitles budValueColl={budValueColl} bud={iBud} atomColl={bizAtomColl} />
            </div>;
        }
    }
    else {
        viewAtomMain = <ViewIBase sheetStore={sheetStore} valDiv={valDiv} />;
    }
    */
    // viewAtomMain = <ViewIBase sheetStore={sheetStore} valDiv={valDiv} />;
    let viewIBud: any;
    if (budI !== undefined) {
        viewIBud = <>
            <ViewSpecBuds id={i} store={sheetStore} />
        </>;
        // <ViewShowBuds bud={budI} budValueColl={budValueColl} atomColl={bizAtomColl} />
    }
    const divEditing = new DivEditing(divStore, valDiv);
    return <>
        <div className={cn + ' flex-fill bg-white px-2 py-2 px-lg-3 '}>
            <ViewIBase sheetStore={sheetStore} valDiv={valDiv} />
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
