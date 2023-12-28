import { FA, setAtomValue } from "tonwa-com";
import { EditProps } from "./model";
import { useAtomValue } from "jotai";
import { Pencil } from "app/hooks/tool";

export function InlineEdit(props: EditProps) {
    let { children, onEditClick, readonly, error, required } = props;
    let err = useAtomValue(error);
    let right: any = <span className="p-2">&nbsp;</span>;
    if (onEditClick !== null) {
        if (readonly !== true) {
            right = <div onClick={onEditClick} className="cursor-pointer pb-2 pt-1 align-self-start">
                <Pencil />
            </div>;
        }
    }
    function onClick() {
        setAtomValue(error, undefined);
    }
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
    return <div>
        <div className={'d-flex align-items-center border rounded ' + cn} onClick={onClick}>
            <div className="flex-fill py-0 ps-2">{children}</div>
            {right}
        </div>
        {vErr}
    </div>;
}
