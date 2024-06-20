import { SheetStore } from "../store";
import { EditBudInline, ViewSpecR } from "app/hooks";
import { useAtomValue } from "jotai";
import { ViewSheetTime } from "../../ViewSheetTime";
import { BizBud } from "app/Biz";
import { setAtomValue } from "tonwa-com";
import { theme } from "tonwa-com";
import { BudCheckValue } from "tonwa-app";
import { LabelBox, RowCols } from "app/hooks/tool";

export function ViewMain({ store, popup, readOnly }: { store: SheetStore; popup: boolean; readOnly?: boolean; }) {
    const { main } = store;
    const { no, entity: entityMain, _valRow: _binRow, budEditings } = main;
    const { i: budI, x: budX } = entityMain;
    const binRow = useAtomValue(_binRow);
    const { id: idBin, i, x, buds } = binRow;
    let { length } = budEditings;
    function onBudChanged(bud: BizBud, value: string | number | BudCheckValue) {
        buds[bud.id] = value as any;
        /*
        switch (bud.name) {
            case 'value': binRow.value = Number(value); break;
            case 'price': binRow.price = Number(value); break;
            case 'amount': binRow.amount = Number(value); break;
        }
        */
        setAtomValue(_binRow, { ...binRow });
    }

    let cnBlock = ' d-flex bg-white ' + theme.bootstrapContainer;
    let viewProps: any;
    if (length > 0) {
        viewProps = <div className={cnBlock + ' pt-2 border-top border-secondary '}>
            <div className={'flex-fill py-2 '}>
                <RowCols>
                    {budEditings.map(v => {
                        const { bizBud, required } = v;
                        if (bizBud === budI || bizBud === budX) return null;
                        let { id, caption, name } = bizBud;
                        let value = buds[id];
                        return <LabelBox key={id} label={caption ?? name} required={required} title={value as any} className="mb-2">
                            <EditBudInline budEditing={v} id={idBin} value={value} onChanged={onBudChanged} readOnly={readOnly} />
                        </LabelBox>;
                    })}
                </RowCols>
            </div>
        </div>
    }

    function ViewIdField({ bud, value }: { bud: BizBud; value: number }) {
        if (bud === undefined) return null;
        const { caption, name } = bud;
        let content = value ? <ViewSpecR id={value} /> : <>&nbsp;</>;
        return <LabelBox label={caption ?? name} editable={false}>
            {content}
        </LabelBox>
    }

    return <div className="tonwa-bg-gray-1">
        <div className={cnBlock}>
            <div className={'flex-fill py-3'}>
                <RowCols>
                    <LabelBox label="单据编号" editable={false}>
                        <span className="align-bottom">
                            <span className="text-danger">{no}</span> &nbsp; <ViewSheetTime id={idBin} />
                        </span>
                    </LabelBox>
                    <ViewIdField bud={budI} value={i} />
                    <ViewIdField bud={budX} value={x} />
                </RowCols>
            </div>
        </div>
        {viewProps}
    </div>;
}
