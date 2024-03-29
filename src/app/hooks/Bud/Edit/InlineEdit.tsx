import { FA, setAtomValue } from "tonwa-com";
import { EditProps } from "./model";
import { useAtomValue } from "jotai";

export function InlineEdit(props: EditProps) {
    let { children, onEditClick, readonly, error, required } = props;
    let err = useAtomValue(error);
    let right: any = <span className="p-2">&nbsp;</span>;
    if (onEditClick !== null) {
        if (readonly !== true) {
            right = <div onClick={onEditClick} className="cursor-pointer px-2 pb-2 pt-1 align-self-start"><FA name="pencil" className="text-info" /></div>;
        }
    }
    function onClick() {
        setAtomValue(error, undefined);
    }
    let cn = ' bg-light ';
    let vContent: any;
    if (required === true) {
        cn = ' bg-white ';
    }
    if (err !== undefined) {
        cn = ' border-danger bg-info ';
        vContent = <span className="text-danger small">
            <FA name="exclamation-circle" className="me-2" />
            {err}
        </span>
    }
    else {
        vContent = children;
    }
    return <div>
        <div className={'d-flex align-items-center border-bottom ' + cn} onClick={onClick}>
            <div className="flex-fill py-0 ps-2">{vContent}</div>
            {right}
        </div>
    </div>;
}
