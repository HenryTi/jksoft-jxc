import { useAtomValue } from "jotai";
import { theme } from "tonwa-com";
import { BudCheckValue, useModal } from "tonwa-app";
// import { BinEditing, FormBudsStore, StoreSheet } from "../../../Store";
// import { EditBudInline, ViewForkAtom, ViewForkAtomBold, ViewForkR } from "app/hooks";
// import { ViewSheetTime } from "../../ViewSheetTime";
import { BizBud, ValueSetType } from "../../Biz";
import { setAtomValue } from "../../tools";
import { EditBudInline, LabelBox, RowCols } from "../../View";
import { ViewForkAtom } from "../../View/Form/ViewForkOfStore";
import { ViewSheetTime } from "./ViewSheetTime";
import { StoreSheet } from "../../Store";
import { BinEditing, FormBudsStore } from "../../Control/ControlBuds/BinEditing";

export function ViewMain({ store, readOnly }: { store: StoreSheet; popup: boolean; readOnly?: boolean; }) {
    const modal = useModal();
    const { mainStore: main } = store;
    const { no, entity: entityMain, _valRow: _binRow } = main;
    const { i: budI, x: budX } = entityMain;
    const binRow = useAtomValue(_binRow);
    const { id: idBin, i, x, buds } = binRow;
    const budsEditing = new BinEditing(store, entityMain);
    const budEditings = budsEditing.createBudEditings();
    const formBudsStore = new FormBudsStore(modal, budsEditing);

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
                <EditBudInline formBudsStore={formBudsStore} budEditing={budEditing} id={idBin} value={value} onChanged={onBudChanged} readOnly={budReadOnly} store={store} />
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
