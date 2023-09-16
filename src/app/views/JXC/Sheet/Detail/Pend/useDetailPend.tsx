import { InputNumber } from "app/coms";
import { EditingRow, SheetRow } from 'app/tool';
import { useAtomValue } from "jotai";
import { ViewAtomSpec } from "../../ViewAUS";
import { OptionsUseSheetDetail, UpdateRow, UseSheetDetailReturn } from "app/hooks";
import { ViewAtom } from "app/hooks";

export interface OptionsUseDetailPend extends OptionsUseSheetDetail {
    selectPend: (editingRows: EditingRow[]) => Promise<SheetRow[]>;
}

export function useDetailPend(options: OptionsUseDetailPend): UseSheetDetailReturn {
    const { detail, selectPend } = options;

    async function addRow(editingRows: EditingRow[]): Promise<SheetRow[]> {
        if (selectPend === undefined) {
            alert('genPend can not be undefined');
            return;
        }
        let selected = await selectPend(editingRows);
        return selected;
    }

    const cnCol = ' col py-2 ';
    function ViewDetailPend({ editingRow, updateRow }: { editingRow: EditingRow; updateRow: UpdateRow; }): JSX.Element {
        const { atomDetails } = editingRow;
        const details = useAtomValue(atomDetails);
        const { origin } = editingRow;
        const { item, value: originValue, price: price, amount: amount, pendValue } = origin;
        const row = details[0];
        const { value } = row;
        (row as any).$saveValue = value;

        const onInputed = async (valueInputed: number) => {
            let { $saveValue } = row as any;
            if (valueInputed !== $saveValue) {
                row.value = valueInputed;
                await updateRow(editingRow, [row])
            }
        }
        return <div className="container">
            <div className="row">
                <ViewAtomSpec id={item} className={cnCol} />
                <div className={" text-end " + cnCol}>
                    <span><small>单价:</small> {price?.toFixed(4)} <small>金额:</small> {amount?.toFixed(4)}</span>
                    <br />
                    <small>数量:</small> <b>{originValue}</b>
                </div>
                <div className={cnCol + ' d-flex justify-content-end '}>
                    <InputNumber onInputed={onInputed} defaultValue={value ?? pendValue} min={0} max={pendValue} />
                </div>
            </div>
        </div>;
    }
    return {
        detail,
        ViewItemTemplate: ViewAtom,
        ViewRow: ViewDetailPend,
        addRow,
        editRow: undefined,
    };
}
