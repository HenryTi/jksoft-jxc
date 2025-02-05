import { useAtomValue } from "jotai";
import { theme } from "tonwa-com";
import { ViewDivProps } from "./tool";
import { ValDiv } from "../../Store/ValDiv";
import { budContent } from "../../View";

export function ViewPivotDiv({ controller, valDiv }: ViewDivProps) {
    const { binStore } = controller.controlSheet;
    const { sheetStore } = binStore;
    const divs = useAtomValue(valDiv.atomValDivs);
    const { labelColor, value: cnValue } = theme;
    return <>
        {divs.map(v => <ViewPivot key={v.id} valDiv={v} />)}
    </>;
    function ViewPivot({ valDiv }: { valDiv: ValDiv }) {
        const { binDiv, atomValue } = valDiv;
        const { binDivBuds: binBuds, format } = binDiv;
        const { keyField, coll } = binBuds;
        const valRow = useAtomValue(valDiv.getAtomValRow());
        let valueValue = useAtomValue(atomValue);
        if (valueValue === undefined) {
            valueValue = 0;
        }
        else if (Number.isNaN(valueValue) === true) {
            debugger;
            valueValue = 0;
        }
        const bud = keyField;
        const { id } = bud;
        let value = binBuds.getBudValue(keyField, valRow);
        if (value === null || value === undefined) return null;
        let keyLabel = <span key={id} className={labelColor}>
            {budContent(bud, value, sheetStore)}
        </span>
        let viewFormat: any;
        if (format !== undefined) {
            viewFormat = format.map(([bud, withLabel, item]) => {
                let field = coll[bud.id];
                let value = field.getValue(valRow);
                if (value === null || value === undefined) return null;
                if (item !== undefined) {
                    if (value === item.value) return null;
                }
                return <span key={bud.id} className="ms-2">
                    {withLabel && <span className={labelColor + ' small '}>{bud.caption}:</span>}
                    {budContent(bud, value, sheetStore)}
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
