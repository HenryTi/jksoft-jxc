
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
    const { openModal } = useModal();
    const { id, readonly, labelSize, flag, value: initValue, budEditing
        , type, step, convertToBudValue, options, fromBudValue
        , ViewValueEdit: ValueEdit, onChanged, popup } = props;
    const budInitValue = fromBudValue === undefined ? initValue as string | number : fromBudValue(initValue);
    const [value, setValue] = useState<string | number>(budInitValue);
    const { bizBud } = budEditing;
    const { caption, name, ui } = bizBud;
    const label = caption ?? name;
    async function valueEdited(v: any) {
        let budValue = convertToBudValue(v);
        if (id !== undefined) {
            await uq.SaveBudValue.submit({
                phraseId: bizBud.id,
                id,
                ...budValue
            });
        }
        setValue(v);
        onChanged?.(bizBud, budValue.value);
    }
    if (popup === false) {
        return <ValueEdit label={label}
            labelSize={labelSize}
            readonly={readonly}
            flag={flag}
            onEditClick={null}
            popup={popup}
            {...budEditing}
        >
            <Input value={budInitValue} options={options} type={type} onEdited={valueEdited} />
        </ValueEdit>;
    }
    else {
        async function onEditClick() {
            let ret = await openModal<number | string>(<PagePickValue label={label} value={value} type={type} options={options} step={step} />);
            if (ret === undefined) return;
            await valueEdited(ret);
            /*
            let budValue = convertToBudValue(ret);
            if (id !== undefined) {
                await uq.SaveBudValue.submit({
                    phraseId: bizBud.id,
                    id,
                    ...budValue
                });
            }
            setValue(ret);
            onChanged?.(bizBud, budValue.value);
            */
        }
        let content: any = value;
        if (value === undefined) content = <ViewBudEmpty />;
        const { format } = ui;
        if (format !== undefined) {
            let f: string = format;
            content = f.replace('{value}', value ? String(value) : '?');
        }
        return <ValueEdit label={label}
            labelSize={labelSize}
            readonly={readonly}
            flag={flag}
            onEditClick={onEditClick}
            {...budEditing}
        >
            {content}
        </ValueEdit>;
    }
}

interface InputProps {
    value: string | number; options: RegisterOptions; type: string;
    onEdited: (v: any) => Promise<void>;
}

function Input({ value, options, type, onEdited }: InputProps) {
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ mode: 'onBlur' });
    const [waiting, setWaiting] = useState(false);
    const cn = 'form-control border-0 ';
    async function onBlur(evt: React.FocusEvent<HTMLInputElement>) {
        let nv = evt.currentTarget.value;
        if (nv.trim() === '') nv = undefined;
        if (nv !== value) {
            setWaiting(true);
            await wait(2000);
            await onEdited?.(nv);
            setWaiting(false);
        }
    }
    let vWaiting: any;
    if (waiting === true) {
        vWaiting = <div className={cn + ' position-absolute start-0 top-0 opacity-50 '}>
            <SpinnerSmall />
        </div>;
    }
    return <div className="position-relative">
        <input type={type} className={cn} placeholder="-" disabled={waiting}
            defaultValue={value}
            {...register('noname', options)}
            onBlur={onBlur}
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
    let { fraction } = ui;
    if (fraction !== undefined) {
        step = String(1 / Math.pow(10, fraction));
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
