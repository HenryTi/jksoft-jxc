import { EntityAtom } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { useCallback, useState } from "react";
import {
    UseFormRegisterReturn, FieldError, UseFormClearErrors, UseFormSetValue
} from "react-hook-form";
import { useModal } from "tonwa-app";
import { FA } from "tonwa-com";
import { pickBudID } from "app/hooks/BizPick";
import { Band, FormAtom, FormContext } from "./FormRowsView";
import { BudEditing, ViewSpecAtom } from "app/hooks";

export function ViewFormAtom({ row, label, error, inputProps, clearErrors, setValue, entityAtom, onChange, formContext }: {
    row: FormAtom;
    label: string | JSX.Element;
    entityAtom: EntityAtom;
    setValue: UseFormSetValue<any>;
    error: FieldError;
    clearErrors: UseFormClearErrors<any>;
    inputProps: UseFormRegisterReturn;
    onChange: (props: { name: string; value: string | object, type: 'number' }) => void;
    formContext: FormContext;
}) {
    const uqApp = useUqApp();
    const modal = useModal();
    const { uq } = uqApp;
    // const IDSelect = useIDSelect();
    const { name, default: defaultValue, readOnly, onPick, bud } = row;
    const [id, setId] = useState<number>(defaultValue);
    const onSelectAtom = useCallback(async function () {
        clearErrors?.(name);
        let retAtomId: number;
        if (onPick !== undefined) {
            let ret = await onPick();
            if (ret === undefined) return;
            console.log('retAtom', ret);
            if (typeof ret === 'object') {
                retAtomId = (ret as any).id;
            }
            else {
                retAtomId = ret;
            }
        }
        else {
            // let ret = await IDSelect(entityAtom, undefined);
            let budEditing = new BudEditing(formContext, bud);
            let ret = await pickBudID(modal, budEditing);
            if (ret === undefined) return;
            retAtomId = ret.id;
        }
        if (setValue !== undefined) {
            setValue(name, retAtomId);
        }
        setId(retAtomId);
        onChange?.({ name, value: String(retAtomId), type: 'number' });
    }, []);
    function ViewAtom({ value }: { value: any }) {
        const { no, ex } = value;
        return <>{ex} &nbsp; <small className="text-muted">{no}</small></>;
    }
    let content: any;
    if (id === undefined && entityAtom) {
        let { placeHolder } = row;
        if (!placeHolder) placeHolder = '点击选择';
        content = <span className="text-black-50"><FA name="hand" /> {placeHolder}</span>;
    }
    else {
        if (id === undefined) {
            content = <>id: undefined</>;
        }
        else {
            // content = <IDView uq={uq} id={Number(id)} Template={ViewAtom} />;
            content = <ViewSpecAtom id={Number(id)} store={formContext.store} />;
        }
    }
    let onClick: () => void;
    let cnInput = 'form-control ';
    if (readOnly !== true || onPick !== undefined) {
        cnInput += ' cursor-pointer ';
        onClick = onSelectAtom;
    }
    else {
        cnInput += ' bg-body-secondary';
    }
    let vError: any = undefined;
    if (error) {
        cnInput += 'is-invalid'
        vError = <div className="invalid-feedback mt-1">
            {error.message?.toString()}
        </div>;
    }
    return <Band label={label}>
        <div className={cnInput} onClick={onClick}>
            {content} &nbsp;
            <input name={name} type="hidden" {...inputProps} />
        </div>
        {vError}
    </Band>
}
