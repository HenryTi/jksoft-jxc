import { SheetMain, SheetStore } from "../store";
import { EditBudInline, ViewSpecR } from "app/hooks";
import { useAtomValue } from "jotai";
import { ViewSheetTime } from "../../ViewSheetTime";
import { BizBud, BudDataType, EnumBudType } from "app/Biz";
import { setAtomValue } from "tonwa-com";
import { theme } from "tonwa-com";
import { BudCheckValue } from "tonwa-app";
import React from "react";
import { LabelBox, RowCols } from "app/hooks/tool";

export function ViewMain({ store, popup, readOnly }: { store: SheetStore; popup: boolean; readOnly?: boolean; }) {
    const { main } = store;
    const { no, entityMain, _valRow: _binRow, budEditings } = main;
    const { i: budI, x: budX } = entityMain;
    const binRow = useAtomValue(_binRow);
    const { id: idBin, i, x, buds } = binRow;
    let { length } = budEditings;
    let propRow: any[] = [];
    const propRowArr: any[][] = [propRow];
    for (let i = 0; i < length; i++) {
        let budEditing = budEditings[i];
        const { bizBud, required } = budEditing;
        let { id, caption, name } = bizBud;
        let value = buds[id];
        propRow.push(<LabelBox key={id} label={caption ?? name} required={required} title={value as any} className="mb-2">
            <EditBudInline budEditing={budEditing} id={idBin} value={value} onChanged={onBudChanged} readOnly={readOnly} />
        </LabelBox>);
        if (i === length - 1) break;
        if (i % 4 === 3) {
            propRow = [];
            propRowArr.push(propRow);
        }
    }
    function onBudChanged(bud: BizBud, value: string | number | BudCheckValue) {
        buds[bud.id] = value as any;
        setAtomValue(_binRow, { ...binRow });
    }

    let cnBlock = ' d-flex bg-white ' + theme.bootstrapContainer;
    let viewProps: any;
    if (length > 0) {
        let viewRowArr = propRowArr.map((row, index) => <React.Fragment key={index}>
            {row}
        </React.Fragment>);
        viewProps = <div className={cnBlock + ' pt-2 border-top border-secondary '}>
            <div className={'flex-fill py-2 '}>
                <RowCols>
                    {viewRowArr}
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
