import { useAtomValue } from "jotai";
import { theme } from "tonwa-com";
import { ViewSpecBaseOnly } from "../../../View";
import { ViewBud, ViewBudUIType } from "../../../Bud";
import { RowColsSm, ViewAtomTitles, ViewShowBuds } from "../../../tool";
import { PAV, ViewDivProps, cn } from "./tool";
import { ViewIBase } from "./ViewIBase";
import { DivEditing } from "../../store";
import { ViewSepcBuds, ViewSpecAtom } from "../../views";

export function ViewRowLeaf(props: ViewDivProps) {
    const { divStore, valDiv, buttons } = props;
    const { sheetStore } = divStore;
    const { atomValRow, atomValue, binDiv } = valDiv;
    const { binDivBuds: binBuds, entityBin } = binDiv;
    const { i: iBud } = entityBin;
    const { budValue, budPrice, budAmount, budI } = binBuds;
    const valRow = useAtomValue(atomValRow);
    const value = useAtomValue(atomValue);
    const { i, price, amount } = valRow;
    let {
        value: cnValue, price: cnPrice, amount: cnAmount
    } = theme;
    const { budsColl, bizAtomColl, bizSpecColl } = sheetStore;
    let budValueColl = budsColl[i];
    let viewAtomMain: any;
    const { binDivBuds, } = binDiv;
    const { budIBase } = binDivBuds;
    if (budIBase === undefined) {
        if (budI !== undefined) {
            viewAtomMain = <div className="mb-1">
                {/*<ViewSpecBaseOnly id={i} noVisible={false} bold={true} />*/}
                <ViewSpecAtom id={i} sheetStore={sheetStore} />
                <ViewAtomTitles budValueColl={budValueColl} bud={iBud} atomColl={bizAtomColl} />
            </div>;
        }
    }
    else {
        viewAtomMain = <ViewIBase sheetStore={sheetStore} valDiv={valDiv} />;
    }
    // const cnBtn = 'w-min-8c w-max-8c d-flex justify-content-end align-items-end';
    const divEditing = new DivEditing(divStore, valDiv);
    return <>
        <div className={cn + ' flex-fill bg-white px-2 py-2 px-lg-3 '}>
            {viewAtomMain}
            <RowColsSm contentClassName="flex-fill">
                <ViewSepcBuds id={i} sheetStore={sheetStore} />
                <ViewShowBuds bud={iBud} budValueColl={budValueColl} atomColl={bizAtomColl} />
                {divEditing.buildViewBuds(bizAtomColl)}
            </RowColsSm>
        </div>
        <div className="d-flex flex-column justify-content-end align-items-end px-2 py-2 px-lg-3 border-start">
            <PAV bud={budAmount} className={cnAmount} val={amount} />
            <PAV bud={budPrice} className={cnPrice} val={price} />
            <PAV bud={budValue} className={cnValue} val={value} />
        </div>
        {buttons}
    </>;
}
