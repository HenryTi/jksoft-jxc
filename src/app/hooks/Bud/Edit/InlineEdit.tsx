import { FA, setAtomValue } from "tonwa-com";
import { EditProps } from "./model";
import { useAtomValue } from "jotai";
import { Pencil } from "app/hooks/tool";

export function InlineEdit(props: EditProps) {
    let { children, onEditClick, readOnly, error, required, popup } = props;
    let err = useAtomValue(error);
    let cn = ' bg-light ';
    let vErr: any;
    if (required === true) {
        cn = ' bg-white ';
    }
    if (err !== undefined) {
        cn = ' border-danger ';
        vErr = <span className="text-danger small">
            <FA name="exclamation-circle" className="me-2" />
            {err}
        </span>;
    }
    let content: any;
    if (popup === false && onEditClick === null) {
        content = <div className={'border rounded pe-1 ' + cn}>
            {children}
        </div>;
    }
    else {
        let right: any = <span className="p-2">&nbsp;</span>;
        if (onEditClick !== null) {
            if (readOnly !== true) {
                right = <div onClick={onEditClick} className="cursor-pointer pb-2 pt-1 align-self-start">
                    <Pencil />
                </div>;
            }
        }
        function onClick() {
            setAtomValue(error, undefined);
        }
        content = <div className={'d-flex align-items-center border rounded ' + cn} onClick={onClick}>
            <div className="flex-fill py-0 ps-2">{children}</div>
            {right}
        </div>;
    }
    return <div>
        {content}
        {vErr}
    </div>;
}
