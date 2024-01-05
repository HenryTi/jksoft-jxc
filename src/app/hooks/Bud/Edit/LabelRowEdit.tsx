import { FA, LabelRow } from "tonwa-com";
import { EditProps } from "./model";
import { Pencil } from "app/hooks/tool";

export function LabelRowEdit(props: EditProps) {
    let { label, flag, children, onEditClick, readonly } = props;
    let right: any = <span className="p-3">&nbsp;</span>;
    if (onEditClick !== null) {
        if (readonly !== true) {
            right = <div onClick={onEditClick} className="cursor-pointer py-3 px-1">
                <Pencil />
            </div>;
        }
    }
    let vLabel: any;
    if (flag !== undefined) {
        vLabel = <>
            {label}
            {flag}
        </>;
    }
    else {
        vLabel = label;
    }
    return <LabelRow {...props}>
        {vLabel}
        <div className="ms-2 position-relative">{children}</div>
        {right}
    </LabelRow>;
}
