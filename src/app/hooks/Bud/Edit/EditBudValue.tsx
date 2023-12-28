
import { useModal } from "tonwa-app";
import { useCallback, useState } from "react";
import { useUqApp } from "app/UqApp";
import { PagePickValue } from "./PagePickValue";
import { contentFromDays, getDays } from "app/tool";
import { EditBudTemplateProps } from "./model";
import { ViewBudEmpty } from "../../tool";

type ConvertToBudValue = (value: any) => { value: any; int: number; dec: number; str: string; };
type FromBudValue = (value: any) => any;
function EditBudValue(props: EditBudTemplateProps & { type: string; step?: string; convertToBudValue: ConvertToBudValue; fromBudValue?: FromBudValue; }) {
    const { uq } = useUqApp();
    const { openModal } = useModal();
    const { id, readonly, plus, value: initValue, budEditing, type, step, convertToBudValue, options, fromBudValue, ViewValueEdit: ValueEdit, onChanged } = props;
    const budInitValue = fromBudValue === undefined ? initValue as string | number : fromBudValue(initValue);
    const [value, setValue] = useState<string | number>(budInitValue);
    const { bizBud } = budEditing;
    const { caption, name, ui } = bizBud;
    const label = caption ?? name;
    async function onEditClick() {
        let ret = await openModal<number | string>(<PagePickValue label={label} value={value} type={type} options={options} step={step} />);
        if (ret === undefined) return;
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
    }
    let content: any = value;
    if (value === undefined) content = <ViewBudEmpty />;
    const { format } = ui;
    if (format !== undefined) {
        let f: string = format;
        content = f.replace('{value}', value ? String(value) : '?');
    }
    return <ValueEdit label={label}
        readonly={readonly}
        plus={plus}
        onEditClick={onEditClick}
        {...budEditing}
    >
        {content}
    </ValueEdit>;
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
