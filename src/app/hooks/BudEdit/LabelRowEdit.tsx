import { FA, LabelRow } from "tonwa-com";
import { EditProps } from "./model";

export function LabelRowEdit(props: EditProps) {
    let { label, children, onEditClick, readonly } = props;
    let right: any = <span className="p-3">&nbsp;</span>;
    if (onEditClick !== null) {
        if (readonly !== true) {
            right = <div onClick={onEditClick} className="cursor-pointer p-3"><FA name="pencil" className="text-info" /></div>;
        }
    }
    return <LabelRow {...props}>
        {label}
        <div className="ms-3 position-relative">{children}</div>
        {right}
    </LabelRow>;
}

export function InlineEdit(props: EditProps) {
    let { label, children, onEditClick, readonly } = props;
    let right: any = <span className="p-3">&nbsp;</span>;
    if (onEditClick !== null) {
        if (readonly !== true) {
            right = <div onClick={onEditClick} className="cursor-pointer p-2"><FA name="pencil" className="text-info" /></div>;
        }
    }
    return <div className="border border-secondary-subtle rounded d-flex bg-light align-items-center">
        <div className="flex-fill py-2 ps-2">{children}</div>
        {right}
    </div>;
}
