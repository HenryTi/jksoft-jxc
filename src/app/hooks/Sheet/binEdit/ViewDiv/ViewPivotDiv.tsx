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
import { ViewDivProps } from "./tool";
import { ViewRow } from "./ViewRow";

export function ViewPivotDiv({ valDiv }: ViewDivProps) {
    const divs = useAtomValue(valDiv.atomValDivs);
    const { labelColor, value: cnValue } = theme;
    return <>
        {divs.map(v => <ViewPivot key={v.id} valDiv={v} />)}
    </>;
    function ViewPivot({ valDiv }: { valDiv: ValDiv }) {
        const { binDiv, atomValRow, atomValue } = valDiv;
        const { binDivBuds: binBuds, format } = binDiv;
        const { keyField, fieldColl } = binBuds;
        const valRow = useAtomValue(atomValRow);
        let valueValue = useAtomValue(atomValue);
        if (valueValue === undefined) {
            valueValue = 0;
        }
        else if (Number.isNaN(valueValue) === true) {
            debugger;
            valueValue = 0;
        }
        const { bud } = keyField;
        const { id } = bud;
        let value = keyField.getValue(valRow);
        if (value === null || value === undefined) return null;
        let keyLabel = <span key={id} className={labelColor}>
            {budContent(bud, value)}
        </span>
        let viewFormat: any;
        if (format !== undefined) {
            viewFormat = format.map(([bud, withLabel, item]) => {
                let field = fieldColl[bud.name];
                let value = field.getValue(valRow);
                if (value === null || value === undefined) return null;
                if (item !== undefined) {
                    if (value === item.value) return null;
                }
                return <span key={bud.id}>
                    {withLabel && <span className={labelColor + ' small '}>{bud.caption ?? bud.name}:</span>}
                    {budContent(bud, value)};
                </span>;
            })
        }
        return <div className="text-end ms-3">
            <div>{keyLabel}</div>
            <div className={cnValue}>{valueValue}</div>
            <div className="w-max-8c">{viewFormat}</div>
        </div>;
    }
}
