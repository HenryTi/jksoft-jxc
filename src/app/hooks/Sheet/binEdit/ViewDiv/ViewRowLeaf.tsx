import { useAtomValue } from "jotai";
import { theme } from "tonwa-com";
import { ViewSpecBaseOnly } from "../../../View";
import { ViewBud, ViewBudUIType } from "../../../Bud";
import { RowColsSm, ViewAtomTitles, ViewShowBuds } from "../../../tool";
import { PAV, ViewDivProps, cn } from "./tool";
import { ViewIBase } from "./ViewIBase";

export function ViewRowLeaf(props: ViewDivProps) {
    const { divStore, valDiv, buttons } = props;
    const { sheetStore } = divStore;
    const { atomValRow, atomValue, binDiv } = valDiv;
    const { binDivBuds: binBuds, entityBin } = binDiv;
    const { i: iBud } = entityBin;
    const { budValue, fields, budPrice, budAmount, budI } = binBuds;
    const valRow = useAtomValue(atomValRow);
    const value = useAtomValue(atomValue);
    const { price, amount } = valRow;
    let {
        value: cnValue, price: cnPrice, amount: cnAmount
    } = theme;
    const { budsColl, bizAtomColl } = sheetStore;
    let budValueColl = budsColl[valRow.i];
    let viewAtomMain: any;
    const { binDivBuds, } = binDiv;
    const { budIBase } = binDivBuds;
    if (budIBase === undefined) {
        if (budI !== undefined) {
            viewAtomMain = <div className="mb-1">
                <ViewSpecBaseOnly id={valRow.i} noVisible={false} bold={true} />
                <ViewAtomTitles budValueColl={budValueColl} bud={iBud} atomColl={bizAtomColl} />
            </div>;
        }
    }
    else {
        viewAtomMain = <ViewIBase sheetStore={sheetStore} valDiv={valDiv} />;
    }
    /*
    {
        budI &&
        <div className="mb-1">
            <ViewSpecBaseOnly id={valRow.i} noVisible={false} bold={true} />
            <ViewAtomTitles budValueColl={budValueColl} bud={iBud} atomColl={bizAtomColl} />
        </div>
    }
    */
    // const cnBtn = 'w-min-8c w-max-8c d-flex justify-content-end align-items-end';
    return <>
        <div className={cn + ' flex-fill bg-white px-2 py-2 px-lg-3 '}>
            {viewAtomMain}
            <RowColsSm contentClassName="flex-fill">
                <ViewShowBuds bud={iBud} budValueColl={budValueColl} atomColl={bizAtomColl} />
                {
                    fields.map(field => {
                        const { bud } = field;
                        const { id } = bud;
                        let value = field.getValue(valRow);
                        if (value === null || value === undefined) return null;
                        return <ViewBud key={id} bud={bud} value={value} uiType={ViewBudUIType.inDiv} atomColl={bizAtomColl} />;
                    })
                }
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
