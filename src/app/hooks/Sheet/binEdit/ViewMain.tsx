import { SheetStore } from "../store";
import { EditBudInline, ViewFork, ViewForkAtom, ViewForkAtomBold, ViewForkR } from "app/hooks";
import { useAtomValue } from "jotai";
import { ViewSheetTime } from "../../ViewSheetTime";
import { BizBud, ValueSetType } from "tonwa";
import { setAtomValue } from "tonwa-com";
import { theme } from "tonwa-com";
import { BudCheckValue } from "tonwa-app";
import { LabelBox, RowCols } from "app/hooks/tool";

export function ViewMain({ store, readOnly }: { store: SheetStore; popup: boolean; readOnly?: boolean; }) {
    const { mainStore: main } = store;
    const { no, entity: entityMain, _valRow: _binRow, budEditings } = main;
    const { i: budI, x: budX } = entityMain;
    const binRow = useAtomValue(_binRow);
    const { id: idBin, i, x, buds } = binRow;
    let { length } = budEditings;
    function onBudChanged(bud: BizBud, value: string | number | BudCheckValue) {
        buds[bud.id] = value as any;
        setAtomValue(_binRow, { ...binRow });
    }

    let topBuds: any[] = [];
    let cnBlock = ' d-flex bg-white ' + theme.bootstrapContainer;
    let viewProps: any;
    if (length > 0) {
        let vBudArr: any[] = [];
        for (let budEditing of budEditings) {
            const { bizBud, required } = budEditing;
            if (bizBud === budI || bizBud === budX) continue;
            let { id, caption, valueSetType } = bizBud;
            let value = buds[id];
            let budReadOnly: boolean;
            if (readOnly === true) budReadOnly = readOnly;
            else budReadOnly = valueSetType === ValueSetType.equ;
            let view = <LabelBox key={id} label={caption} required={required} title={value as any} className="mb-2">
                <EditBudInline budEditing={budEditing} id={idBin} value={value} onChanged={onBudChanged} readOnly={budReadOnly} store={store} />
            </LabelBox>;
            if (budReadOnly === true) {
                topBuds.push(view);
                continue;
            }
            vBudArr.push(view);
        };
        if (vBudArr.length > 0) {
            viewProps = <div className={cnBlock + ' pt-2 border-top border-secondary '}>
                <div className={'flex-fill py-2 '}>
                    <RowCols>{vBudArr}</RowCols>
                </div>
            </div>;
        }
    }

    function ViewIdField({ bud, value }: { bud: BizBud; value: number }) {
        if (bud === undefined) return null;
        const { caption } = bud;
        //let content = value ? <ViewForkR id={value} /> : <>&nbsp;</>;
        let content = value ? <ViewForkAtom store={store} id={value} /> : <>&nbsp;</>;
        return <LabelBox label={caption} editable={false}>
            {content}
        </LabelBox>
    }

    return <div className="tonwa-bg-gray-1 ">
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
                    {topBuds}
                </RowCols>
            </div>
        </div>
        {viewProps}
    </div>;
}
