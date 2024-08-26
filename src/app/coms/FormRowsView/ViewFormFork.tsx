import { EntityAtom, EntityFork } from "app/Biz";
import {
    UseFormRegisterReturn, FieldError, UseFormClearErrors, UseFormSetValue
} from "react-hook-form";
import { Band, FormContext, FormFork } from "./FormRowsView";
import { Page, useModal } from "tonwa-app";
import { FA, theme } from "tonwa-com";
import { budContent, FormBudsEditing, ValuesBudsEditing } from "app/hooks";
import { useRef, useState } from "react";

export function ViewFormFork({ row, label, error, inputProps, formContext, setValue, onChange }: {
    row: FormFork;
    label: string | JSX.Element;
    setValue: UseFormSetValue<any>;
    error: FieldError;
    clearErrors: UseFormClearErrors<any>;
    inputProps: UseFormRegisterReturn;
    onChange: (props: { name: string; value: string | object, type: 'text' }) => void;
    formContext: FormContext
}) {
    const modal = useModal();
    const { name, baseBud, readOnly } = row;
    let defaultValue = formContext.getValue(name);
    const [forkObj, setForkObj] = useState(defaultValue);
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
    let vContent: any;
    let atomId = formContext.getBudValue(baseBud);
    let entityAtom = formContext.getEntityFromId(atomId);
    if (entityAtom === undefined) return null;
    let { fork } = entityAtom as EntityAtom;
    if (fork === undefined) return null;
    if (forkObj === undefined) {
        let { placeHolder } = row;
        if (!placeHolder) placeHolder = '点击输入';
        vContent = <span className="text-black-50"><FA name="hand" /> {placeHolder}</span>;
    }
    else {
        const { labelColor } = theme;
        vContent = fork.keys.map(v => {
            const { id, caption } = v;
            const value = forkObj[id];
            return <span key={id} className="text-nowrap me-3">
                <small className={labelColor}>{caption}</small>: {budContent(v, value, formContext.store)}
            </span>;
        });
    }
    async function onEdit() {
        let ret = await modal.open(<PageFork fork={fork} value={forkObj} />);
        if (ret === undefined) return;
        if (setValue !== undefined) {
            setValue(name, JSON.stringify(ret));
        }
        setForkObj(ret);
        onChange?.({ name, value: ret, type: 'text' });
    }
    return <Band label={label}>
        <div className={cnInput} onClick={onEdit}>
            {vContent} &nbsp;
            <input name={name} type="hidden" {...inputProps} />
        </div>
        {vError}
    </Band>
}

function PageFork({ fork, value }: { fork: EntityFork; value: object; }) {
    const modal = useModal();
    const buds = [...fork.keys, ...fork.buds];
    const { current: budsEditing } = useRef(new ValuesBudsEditing(modal, fork.biz, buds));
    budsEditing.initBudValues(value);
    /*
    const { register, handleSubmit, formState: { errors }, } = useForm({ mode: 'onBlur' });
    let rows: FormRow[] = [
        ...budsEditing.buildFormRows(),
        { type: 'submit', label: '提交' },
    ];
    */
    async function onSubmit(data: any) {
        let ret = budsEditing.getResultObject();
        ret.$ = fork.id;
        modal.close(ret);
    }
    return <Page header={fork.caption}>
        <FormBudsEditing budsEditing={budsEditing} onSubmit={onSubmit} className="p-3" />
    </Page>;
    /*
        <form onSubmit={handleSubmit(onSubmit)} className={theme.bootstrapContainer + ' my-3 pe-5 '}>
        <FormRowsView rows={rows} {...{ register, errors }} context={budsEditing} />
    </form>
    */
}
