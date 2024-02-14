import { LabelRow } from "tonwa-com";
import { EditProps } from "./model";
import { Pencil } from "app/hooks/tool";

export function LabelRowEdit(props: EditProps) {
    let { label, flag, children, onEditClick, readonly, popup } = props;
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
    let content: any;
    if (popup === false && onEditClick === null) {
        content = <div className="py-2 pe-1 w-100">{children}</div>;
    }
    else {
        let right: any = <span className="p-3">&nbsp;</span>;
        if (onEditClick !== null) {
            if (readonly !== true) {
                right = <div onClick={onEditClick} className="cursor-pointer py-2 px-1">
                    <Pencil />
                </div>;
            }
        }
        content = <>
            <div className="ms-2 py-2 position-relative flex-fill">
                <div className="form-control border-0">
                    {children}
                </div>
            </div>
            {right}
        </>;
    }
    return <LabelRow {...props}>
        {vLabel}
        {content}
    </LabelRow>;
}
