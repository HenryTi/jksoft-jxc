import { useAtomValue } from "jotai";
import { theme } from "tonwa-com";
import { RowColsSm } from "../../../tool";
import { PAV, ViewDivProps, ViewDivRight, ViewPendValue, cn } from "./tool";
import { ViewIBase } from "./ViewIBase";
import { DivEditing } from "../../store";
import { ViewAtomPrimesOfStore, ViewForkBuds } from "app/hooks/View";

export function ViewRowLeaf(props: ViewDivProps) {
    const { binStore: binStore, valDiv, buttons, index } = props;
    const { sheetStore } = binStore;
    const { atomValue, binDiv } = valDiv;
    const { binDivBuds } = binDiv;
    const { budValue, budPrice, budAmount, budI } = binDivBuds;
    const valRow = useAtomValue(valDiv.getAtomValRow());
    const value = useAtomValue(atomValue);
    const { i, price, amount } = valRow;
    let {
        value: cnValue, price: cnPrice, amount: cnAmount
    } = theme;

    if (value === undefined) return null;
    let viewIBud: any;
    if (budI !== undefined) {
        viewIBud = <>
            <ViewForkBuds id={i} store={sheetStore} />
        </>;
    }
    const divEditing = new DivEditing(binStore, valDiv);
    return <>
        <div className={cn + ' flex-fill bg-white px-2 py-2 px-lg-3 '}>
            <ViewIBase sheetStore={sheetStore} valDiv={valDiv} index={index} />
            <RowColsSm contentClassName="flex-fill">
                <ViewAtomPrimesOfStore id={valDiv.getIValue()} store={sheetStore} />
                {viewIBud}
                {divEditing.buildViewBuds()}
            </RowColsSm>
        </div>
        <ViewDivRight>
            <ViewPendValue {...props} />
            <PAV bud={budValue} className={cnValue} val={value} />
            <PAV bud={budPrice} className={cnPrice} val={price} />
            <PAV bud={budAmount} className={cnAmount} val={amount} />
        </ViewDivRight>
        {buttons}
    </>;
}
