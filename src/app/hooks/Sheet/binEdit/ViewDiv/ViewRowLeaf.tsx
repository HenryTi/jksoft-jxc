import { useAtomValue } from "jotai";
import { theme } from "tonwa-com";
import { ViewSpecBaseOnly } from "../../../View";
import { ViewBud, ViewBudUIType } from "../../../Bud";
import { RowColsSm, ViewAtomTitles, ViewShowBuds } from "../../../tool";
import { PAV, ViewDivProps, cn, cnBtn } from "./tool";
import { ViewIBase } from "./ViewIBase";

export function ViewRowLeaf(props: ViewDivProps) {
    const { valDiv, divStore, buttons } = props;
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
    let budValueColl = divStore.sheetStore.budsColl[valRow.i];
    return <>
        <div className="flex-fill">
            {
                budI &&
                <div className="mb-1">
                    <ViewSpecBaseOnly id={valRow.i} noVisible={false} bold={true} />
                    <ViewAtomTitles budValueColl={budValueColl} bud={iBud} />
                </div>
            }
            <div className={cn + ' bg-white '}>
                <ViewIBase valDiv={valDiv} />
                <RowColsSm contentClassName="flex-fill">
                    <ViewShowBuds bud={iBud} budValueColl={budValueColl} />
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
                <PAV bud={budValue} className={cnValue} val={value} />
            </div>
        </div>
        <div className="d-flex align-items-start">
            {buttons}
        </div>
    </>;
}
