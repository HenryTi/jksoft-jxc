import { LabelRow } from "tonwa-com";
import { EditProps } from "./model";
import { Pencil } from "../../Common";

export function LabelRowEdit(props: EditProps) {
    let { label, flag, children, onEditClick, readOnly, popup, noBorder } = props;
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
        let right: any; // = <span className="p-3">&nbsp;</span>;
        if (onEditClick !== null) {
            if (readOnly !== true) {
                right = <div onClick={onEditClick} className="cursor-pointer py-2 px-1">
                    <Pencil />
                </div>;
            }
        }
        if (noBorder === true) {
            content = children;
        }
        else {
            content = <>
                <div className="ms-1 position-relative flex-fill">
                    {children}
                </div>
                {right}
            </>;
        }
    }
    return <LabelRow {...props}>
        {vLabel}
        {content}
    </LabelRow>;
}
