import { SheetMain } from "../store";
import { BudEditing, EditBudInline, ViewSpecR } from "app/hooks";
import { useAtomValue } from "jotai";
import { ViewSheetTime } from "../ViewSheetTime";
import { BizBud } from "app/Biz";
import { FA, setAtomValue } from "tonwa-com";
import { BudCheckEditValue, BudCheckValue } from "tonwa-app";
import React from "react";
import { LabelBox, LabelContent, RolCols } from "app/hooks/tool";

export function ViewMain({ main }: { main: SheetMain }) {
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
        propRow.push(<LabelBox key={id} label={caption ?? name} required={required}>
            <EditBudInline budEditing={budEditing} id={idBin} value={value} onChanged={onBudChanged} />
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

    let cnBlock = ' d-flex border-bottom border-secondary-subtle bg-white container mt-2 ';
    let viewProps: any;
    if (length > 0) {
        let viewRowArr = propRowArr.map((row, index) => <React.Fragment key={index}>
            {row}
        </React.Fragment>);
        viewProps = <div className={cnBlock}>
            <div className={'flex-fill py-2 '}>
                <RolCols>
                    {viewRowArr}
                </RolCols>
            </div>
        </div>
    }

    function ViewIdField({ bud, value }: { bud: BizBud; value: number }) {
        if (bud === undefined) return null;
        const { caption, name } = bud;
        return <LabelContent label={caption ?? name}>
            <ViewSpecR id={value} />
        </LabelContent>
    }

    return <div className="tonwa-bg-gray-1">
        <div className={cnBlock + ' border-top '}>
            <div className={'flex-fill py-3 container'}>
                <RolCols>
                    <LabelContent label="单据编号">
                        <span className="text-danger">{no}</span> &nbsp; <ViewSheetTime id={idBin} />
                    </LabelContent>
                    <ViewIdField bud={budI} value={i} />
                    <ViewIdField bud={budX} value={x} />
                </RolCols>
            </div>
        </div>
        {viewProps}
    </div>;
}
