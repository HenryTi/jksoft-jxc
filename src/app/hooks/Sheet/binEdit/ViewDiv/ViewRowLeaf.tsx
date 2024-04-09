import { useAtomValue } from "jotai";
import { theme, setAtomValue, getAtomValue } from "tonwa-com";
import { ViewSpecBaseOnly } from "../../../View";
import { ViewBud, ViewBudUIType } from "../../../Bud";
import { RowColsSm, ViewShowBuds } from "../../../tool";
import { BinEditing } from "../../store";
import { useRowEdit } from "../useRowEdit";
import { PAV, ViewDivProps, cn, cnBtn } from "./tool";

export function ViewRowLeaf(props: ViewDivProps & { vIBase: any; }) {
    // div === undefined
    const { valDiv, divStore, vIBase, buttons } = props;
    const rowEdit = useRowEdit();
    const { atomValRow, atomValue, binDiv, atomDeleted } = valDiv;
    const { binDivBuds: binBuds, entityBin } = binDiv;
    const { budValue, fields, budPrice, budAmount, budI } = binBuds;
    const { sheetStore } = divStore;
    const valRow = useAtomValue(atomValRow);
    const value = useAtomValue(atomValue);
    const deleted = getAtomValue(atomDeleted);
    const { price, amount } = valRow;
    let {
        value: cnValue, price: cnPrice, amount: cnAmount
    } = theme;
    async function onEdit() {
        const binEditing = new BinEditing(sheetStore, entityBin, valRow);
        let ret = await rowEdit(binEditing);
        if (ret === true) {
            const { valRow } = binEditing;
            await divStore.saveDetail(binDiv, valRow);
            setAtomValue(atomValRow, valRow);
        }
    }
    let viewValue = deleted === true ?
        <PAV bud={budValue} className={cnValue} val={value} />
        :
        <PAV bud={budValue} className={cnValue + ' cursor-pointer '} val={value} onClick={onEdit} />
    let budValueColl = divStore.sheetStore.budsColl[valRow.i];
    // if (budValueColl === undefined) debugger;
    return <>
        <div className="flex-fill">
            {
                budI &&
                <div className="mb-1">
                    <ViewSpecBaseOnly id={valRow.i} noVisible={false} bold={true} />
                </div>
            }
            <div className={cn + ' bg-white '}>
                {vIBase}
                <RowColsSm contentClassName="flex-fill">
                    <ViewShowBuds bud={entityBin.i} budValueColl={budValueColl} />
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
                {viewValue}
            </div>
        </div>
        <div className="d-flex align-items-start">
            {buttons}
        </div>
    </>;
}
