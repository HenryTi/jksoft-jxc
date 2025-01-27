import { useForm } from "react-hook-form";
import { BudsEditing } from "../BudsEditing";
import { ChangeEvent, useState, JSX } from "react";
import { ValueSetType } from "app/Biz";
import { FormRowsView } from "app/coms";

interface Props {
    budsEditing: BudsEditing;
    className?: string;
    onSubmit(data: any): Promise<void>;
    submit?: string | JSX.Element;
    submitClassName?: string;
    onContinue?(data: any): Promise<void>;
    continue?: string | JSX.Element;
    continueClassName?: string;
    validate?(data: any): [string, string][];
}

export function FormBudsEditing({ className, budsEditing, onSubmit, submit: submitCaption, submitClassName, validate }: Props) {
    const { register, handleSubmit, setValue, setError, trigger, formState: { errors } } = useForm({ mode: 'onBlur' });
    const [submitable, setSubmitable] = useState(budsEditing.submitable());
    async function onChange(evt: ChangeEvent<HTMLInputElement>) {
        const { type, value: valueInputText, name } = evt.target;
        budsEditing.onChange(name, type as 'number' | 'text', valueInputText, (bud, value) => {
            if (bud.valueSetType === ValueSetType.equ) {
                setValue(bud.name, value);
            }
        });
        setSubmitable(budsEditing.submitable());
    }
    const options = { onChange };
    budsEditing.buildCalcBuds();
    const formRows = budsEditing.buildFormRows(true);
    formRows.forEach(v => {
        if (v === undefined) return null;
        return (v as any).options = { ...(v as any).options, ...options };
    });
    formRows.push({
        type: 'submit',
        label: submitCaption ?? '提交',
        options: { disabled: submitable === false },
        className: submitClassName,
    });

    async function onSubmitData(data: any) {
        if (await trigger(undefined, { shouldFocus: true }) === false) return;
        if (validate !== undefined) {
            let errors = validate(data);
            if (errors !== undefined && errors.length > 0) {
                for (let [name, message] of errors) {
                    setError(name, { message });
                }
                return;
            }
        }
        await onSubmit(data);
    }

    return <form className={className} onSubmit={handleSubmit(onSubmitData)}>
        <FormRowsView rows={formRows} register={register} errors={errors} context={budsEditing} setValue={setValue} />
    </form>;
}
