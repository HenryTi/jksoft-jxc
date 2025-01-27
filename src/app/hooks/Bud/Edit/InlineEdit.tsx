import { FA, setAtomValue } from "tonwa-com";
import { EditProps } from "./model";
import { useAtomValue } from "jotai";
import { PencilLg } from "app/hooks/tool";

export function InlineEdit(props: EditProps) {
    let { children, onEditClick, readOnly, error, required, popup, noBorder } = props;
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
    if (noBorder === true) {
        content = children;
    }
    else if (popup === false && onEditClick === null) {
        content = <div className={'border rounded pe-1 ' + cn}>
            {children}
        </div>;
    }
    else {
        let right: any;
        if (onEditClick !== null) {
            if (readOnly !== true) {
                /*
                right = <div onClick={onEditClick} className="cursor-pointer pb-2 pt-1 px-1 align-self-start">
                    <PencilLg />
                </div>;
                */
                right = <div onClick={onEditClick} className="cursor-pointer">
                    <PencilLg />
                </div>;
            }
            else {
                right = <span className="">&nbsp;</span>;
            }
        }
        function onClick() {
            setAtomValue(error, undefined);
        }
        if (right === undefined) {
            /*
            content = <div className={'border rounded ' + cn} onClick={onClick}>
                {children}
            </div>;
            */
            content = <div className="form-control form-control-sm position-relative" onClick={onClick}>
                {children}
            </div>
        }
        else {
            //const cnFormControl = 'd-flex align-items-center border rounded ';
            const cnFormControl = 'form-control form-control-sm d-flex position-relative ';
            content = <div className={cnFormControl + cn} onClick={onClick}>
                <div className="flex-fill">{children}</div>
                {right}
            </div>;
        }
    }
    return <div>
        {content}
        {vErr}
    </div>;
}
