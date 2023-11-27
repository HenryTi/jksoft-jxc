import { FA, LabelRow } from "tonwa-com";
import { EditProps } from "./model";

export function LabelRowEdit(props: EditProps) {
    let { label, plus, children, onEditClick, readonly } = props;
    let right: any = <span className="p-3">&nbsp;</span>;
    if (onEditClick !== null) {
        if (readonly !== true) {
            right = <div onClick={onEditClick} className="cursor-pointer p-3"><FA name="pencil" className="text-info" /></div>;
        }
    }
    let vLabel: any;
    if (plus === true) {
        vLabel = <>
            <FA name="star-o" className="text-danger me-2" />
            {label}
        </>;
    }
    else {
        vLabel = label;
    }
    return <LabelRow {...props}>
        {vLabel}
        <div className="ms-3 position-relative">{children}</div>
        {right}
    </LabelRow>;
}
