import { useForm } from "react-hook-form";
import { BudsEditing } from "../BudsEditing";
import { ChangeEvent, useState } from "react";
import { ValueSetType } from "app/Biz";
import { FormRowsView } from "app/coms";
import { useAtomValue } from "jotai";

interface Props {
    budsEditing: BudsEditing;
    className?: string;
    onSubmit(data: any): Promise<void>;
    submitCaption?: string;
    validate?(data: any): [string, string][];
}

export function FormBudsEditing({ className, budsEditing: binEditing, onSubmit, submitCaption, validate }: Props) {
    const { register, handleSubmit, setValue, setError, trigger, formState: { errors } } = useForm({ mode: 'onBlur' });
    const [submitable, setSubmitable] = useState(false);
    async function onChange(evt: ChangeEvent<HTMLInputElement>) {
        const { type, value: valueInputText, name } = evt.target;
        binEditing.onChange(name, type as 'number' | 'text', valueInputText, (bud, value) => {
            if (bud.valueSetType === ValueSetType.equ) {
                setValue(bud.name, value);
            }
        });
        setSubmitable(binEditing.submitable());
    }
    const options = { onChange };
    const formRows = binEditing.buildFormRows(true);
    formRows.forEach(v => {
        if (v === undefined) return null;
        return (v as any).options = { ...(v as any).options, ...options };
    });
    formRows.push({ type: 'submit', label: submitCaption ?? '提交', options: { disabled: submitable === false } });

    async function onSubmitData(data: any) {
        if (await trigger(undefined, { shouldFocus: true }) === false) return;
        if (validate !== undefined) {
            let errors = validate(data);
            if (errors !== undefined) {
                for (let [name, message] of errors) {
                    setError(name, { message });
                }
                return;
            }
        }
        /*
        if (data.value === 0) {
            setError('value', { message: '不能为 0' });
            return;
        }
        */
        // modal.close(true);
        await onSubmit(data);
    }

    return <form className={className} onSubmit={handleSubmit(onSubmitData)}>
        <FormRowsView rows={formRows} register={register} errors={errors} context={binEditing} />
    </form>;
}
