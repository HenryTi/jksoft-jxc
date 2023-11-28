import { FA, setAtomValue } from "tonwa-com";
import { EditProps } from "./model";
import { useAtomValue } from "jotai";

export function InlineEdit(props: EditProps) {
    let { children, onEditClick, readonly, error, required } = props;
    let err = useAtomValue(error);
    let right: any = <span className="p-2">&nbsp;</span>;
    if (onEditClick !== null) {
        if (readonly !== true) {
            right = <div onClick={onEditClick} className="cursor-pointer p-2 align-self-start"><FA name="pencil" className="text-info" /></div>;
        }
    }
    function onClick() {
        setAtomValue(error, undefined);
    }
    let cn = ' border-secondary-subtle bg-light ';
    let vContent: any;
    if (required === true) {
        cn = ' border-info bg-white ';
    }
    if (err !== undefined) {
        cn = ' border-danger bg-light ';
        vContent = <span className="text-danger small">
            <FA name="exclamation-circle" className="me-2" />
            {err}
        </span>
    }
    else {
        vContent = children;
    }
    return <div>
        <div className={'border rounded d-flex align-items-center ' + cn} onClick={onClick}>
            <div className="flex-fill py-2 ps-2">{vContent}</div>
            {right}
        </div>
    </div>;
}
