
import { useModal } from "tonwa-app";
import React, { useCallback, useState } from "react";
import { useUqApp } from "app/UqApp";
import { PagePickValue } from "./PagePickValue";
import { contentFromDays, getDays } from "app/tool";
import { EditBudTemplateProps } from "./model";
import { ViewBudEmpty } from "../../tool";
import { RegisterOptions, useForm } from "react-hook-form";
import { Spinner, SpinnerSmall, wait } from "tonwa-com";

type ConvertToBudValue = (value: any) => { value: any; int: number; dec: number; str: string; };
type FromBudValue = (value: any) => any;
function EditBudValue(props: EditBudTemplateProps & { type: string; step?: string; convertToBudValue: ConvertToBudValue; fromBudValue?: FromBudValue; }) {
    const { uq } = useUqApp();
    const modal = useModal();
    const { id, readOnly, labelSize, flag, value: initValue, budEditing
        , type, step, convertToBudValue, options, fromBudValue
        , ViewValueEdit: ValueEdit, onChanged } = props;
    const budInitValue = fromBudValue === undefined ? initValue as string | number : fromBudValue(initValue);
    const [value, setValue] = useState<string | number>(budInitValue);
    const { bizBud } = budEditing;
    const { caption, ui } = bizBud;
    const label = caption;
    async function valueEdited(v: any) {
        let budValue = convertToBudValue(v);
        budEditing.setBudValue(budValue);
        if (id !== undefined && id > 0) {
            await uq.SaveBudValue.submit({
                phraseId: bizBud.id,
                id,
                ...budValue
            });
        }
        setValue(v);
        onChanged?.(bizBud, budValue.value);
    }
    function onInputChange(evt: React.ChangeEvent<HTMLInputElement>) {
        budEditing.setBudValue(evt.currentTarget.value);
    }
    if (ui?.edit === 'pop') {
        async function onEditClick() {
            let ret = await modal.open<number | string>(<PagePickValue label={label} value={value} type={type} options={options} step={step} />);
            if (ret === undefined) return;
            await valueEdited(ret);
        }
        let content: any = value;
        if (value === undefined) content = <ViewBudEmpty />;
        if (ui !== undefined) {
            const { format } = ui;
            if (format !== undefined) {
                let f: string = format;
                content = f.replace('{value}', value ? String(value) : '?');
            }
        }
        return <ValueEdit label={label}
            labelSize={labelSize}
            readOnly={readOnly}
            flag={flag}
            onEditClick={onEditClick}
            {...budEditing}
        >
            {content}
        </ValueEdit>;
    }
    else {
        return <ValueEdit label={label}
            labelSize={labelSize}
            readOnly={readOnly}
            flag={flag}
            onEditClick={null}
            {...budEditing}
        >
            <Input value={value} options={options} type={type}
                onChange={onInputChange}
                onEdited={valueEdited} readOnly={readOnly} />
        </ValueEdit>;
    }
}

interface InputProps {
    value: string | number; options: RegisterOptions; type: string;
    onEdited: (v: any) => Promise<void>;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    readOnly: boolean;
}

function Input({ onChange, value, options, type, onEdited, readOnly }: InputProps) {
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ mode: 'onBlur' });
    const [waiting, setWaiting] = useState(false);
    const cn = 'form-control border-0 ';
    async function triggerInputChange(newValue: string) {
        if (newValue.trim() === '') newValue = undefined;
        if (newValue !== value) {
            setWaiting(true);
            // await wait(2000);
            await onEdited?.(newValue);
            setWaiting(false);
        }
    }
    async function onBlur(evt: React.FocusEvent<HTMLInputElement>) {
        await triggerInputChange(evt.currentTarget.value);
    }
    let vWaiting: any;
    if (waiting === true) {
        vWaiting = <div className={cn + ' position-absolute start-0 top-0 opacity-50 '}>
            <SpinnerSmall />
        </div>;
    }
    return <div className="position-relative">
        <input type={type} className={cn} placeholder="-" disabled={waiting}
            defaultValue={value} readOnly={readOnly}
            {...register('noname', options)}
            onBlur={onBlur}
            onChange={onChange}
        />
        {vWaiting}
    </div>;
}

export function EditBudString(props: EditBudTemplateProps) {
    function convertToBudValue(value: any) {
        return {
            value,
            int: undefined as number,
            dec: undefined as number,
            str: value,
        }
    }
    return <EditBudValue {...props} type="text" convertToBudValue={convertToBudValue} />;
}

export function EditBudInt(props: EditBudTemplateProps) {
    function convertToBudValue(value: any) {
        return {
            value,
            int: value,
            dec: undefined as number,
            str: undefined as string,
        }
    }
    return <EditBudValue {...props} type="number" convertToBudValue={convertToBudValue} />;
}

export function EditBudDec(props: EditBudTemplateProps) {
    const { ui } = props.budEditing.bizBud;
    function convertToBudValue(value: any) {
        return {
            value,
            int: undefined as number,
            dec: value,
            str: undefined as string,
        }
    }
    let step: string = '0.000001';
    if (ui !== undefined) {
        let { fraction } = ui;
        if (fraction !== undefined) {
            step = String(1 / Math.pow(10, fraction));
        }
    }
    return <EditBudValue {...props} type="number" step={step} convertToBudValue={convertToBudValue} />;
}

export function EditBudDate(props: EditBudTemplateProps) {
    const convertToBudValue = useCallback(function (value: any) {
        let d = getDays(value);
        return {
            value: d,
            int: d,
            dec: undefined as number,
            str: undefined as string,
        }
    }, []);
    return <EditBudValue {...props} type="date"
        fromBudValue={contentFromDays}
        convertToBudValue={convertToBudValue} />;
}
