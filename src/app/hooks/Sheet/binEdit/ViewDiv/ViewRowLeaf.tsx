import { useAtomValue } from "jotai";
import { theme, FA, setAtomValue } from "tonwa-com";
import { useModal } from "tonwa-app";
import { BizBud } from "../../../../Biz";
import { ViewSpecBaseOnly, ViewSpecNoAtom } from "../../../View";
import { ViewBud, ViewBudUIType, budContent } from "../../../Bud";
import { RowColsSm } from "../../../tool";
import { BinEditing, DivEditing, DivStore, UseInputsProps, ValDiv } from "../../store";
import { useDivNew } from "../divNew";
import { BinOwnedBuds } from "../BinOwnedBuds";
import { useRowEdit } from "../useRowEdit";
import { PageEditDiv } from "./PageEditDiv";
import { ViewPendRow } from "../ViewPendRow";
import { PAV, ViewDivProps, cn, cnBtn } from "./tool";

export function ViewRowLeaf(props: ViewDivProps & { vIBase: any; }) {
    // div === undefined
    const { valDiv, divStore, vIBase, buttons } = props;
    const rowEdit = useRowEdit();
    const { atomValRow, atomValue, binDiv } = valDiv;
    const { binDivBuds: binBuds, entityBin } = binDiv;
    const { budValue, fields, budPrice, budAmount, budI } = binBuds;
    const valRow = useAtomValue(atomValRow);
    const value = useAtomValue(atomValue);
    const { price, amount } = valRow;
    let {
        value: cnValue, price: cnPrice, amount: cnAmount
    } = theme;
    async function onEdit() {
        // if (editable === false) return;
        const binEditing = new BinEditing(entityBin, valRow);
        let ret = await rowEdit(binEditing);
        if (ret === true) {
            const { valRow } = binEditing;
            await divStore.saveDetail(binDiv, valRow);
            setAtomValue(atomValRow, valRow);
        }
    }
    // <ViewIdField bud={budI} value={valRow.i} />
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
                    <BinOwnedBuds bizBud={entityBin.i} valRow={valRow} />
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
                <PAV bud={budValue} className={cnValue + ' cursor-pointer '} val={value} onClick={onEdit} />
            </div>
        </div>
        <div className="d-flex align-items-start">
            {buttons}
        </div>
    </>;
}
