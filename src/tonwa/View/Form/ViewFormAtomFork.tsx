import { EntityFork } from "tonwa";
import { useUqApp } from "app/UqApp";
import { useState, JSX } from "react";
import {
    UseFormRegisterReturn, FieldError, UseFormClearErrors, UseFormSetValue
} from "react-hook-form";
import { useModal } from "tonwa-app";
import { FA } from "tonwa-com";
import { pickBudID } from "app/hooks/BizPick";
import { Band, FormAtom, FormContext } from "./FormRowsView";
import { BudEditing } from "app/hooks";
import { ViewForkId } from "./ViewForkId";

export function ViewFormAtomFork({ row, label, error, inputProps, clearErrors, setValue, entity, onChange, formContext }: {
    row: FormAtom;
    label: string | JSX.Element;
    entity: EntityFork;
    setValue: UseFormSetValue<any>;
    error: FieldError;
    clearErrors: UseFormClearErrors<any>;
    inputProps: UseFormRegisterReturn;
    onChange: (props: { name: string; value: string, type: 'number' }) => void;
    formContext: FormContext
}) {
    const uqApp = useUqApp();
    const modal = useModal();
    const { uq } = uqApp;
    // const IDSelect = useIDSelect();
    const { name, default: defaultValue, readOnly, bud } = row;
    const [id, setId] = useState<number>(defaultValue);
    async function onSelect() {
        clearErrors?.(name);
        let params = formContext.getParams(name);
        // let ret = await IDSelect(entity, params);
        let budEditing = new BudEditing(formContext, bud);
        let ret = await pickBudID(modal, budEditing);
        if (ret === undefined) return;
        const { id } = ret;
        if (setValue !== undefined) {
            setValue(name, id);
        }
        setId(id);
        onChange?.({ name, value: String(id), type: 'number' });
    }
    let content: any;
    if (id === undefined && entity) {
        let { placeHolder } = row;
        if (!placeHolder) placeHolder = '点击选择';
        content = <span className="text-black-50"><FA name="hand" /> {placeHolder}</span>;
    }
    else {
        content = <ViewForkId id={id} />;
    }
    let cnInput = 'form-control ';
    if (readOnly !== true) {
        cnInput += ' cursor-pointer ';
    }
    let vError: any = undefined;
    if (error) {
        cnInput += 'is-invalid'
        vError = <div className="invalid-feedback mt-1">
            {error.message?.toString()}
        </div>;
    }
    return <Band label={label}>
        <div className={cnInput} onClick={onSelect}>
            {content} &nbsp;
            <input name={name} type="hidden" {...inputProps} />
        </div>
        {vError}
    </Band>
}
