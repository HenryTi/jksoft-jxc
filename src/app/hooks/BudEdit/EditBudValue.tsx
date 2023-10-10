
import { EditBudProps } from "../model";
import { useModal } from "tonwa-app";
import { useCallback, useState } from "react";
import { LabelRowEdit } from "./LabelRowEdit";
import { useUqApp } from "app/UqApp";
import { PagePickValue } from "./PagePickValue";
import { contenFromDays, getDays } from "app/tool";

type ConvertToBudValue = (value: any) => { int: number; dec: number; str: string; };
type FromBudValue = (value: any) => any;
function EditBudValue(props: EditBudProps & { type: string; step?: string; convertToBudValue: ConvertToBudValue; fromBudValue?: FromBudValue; }) {
    const { uq } = useUqApp();
    const { openModal } = useModal();
    const { id, readonly, value: initValue, bizBud, type, step, convertToBudValue, options, fromBudValue } = props;
    const [value, setValue] = useState<string | number>(
        fromBudValue === undefined ? initValue as string | number : fromBudValue(initValue)
    );
    const { caption, name, ex } = bizBud;
    const label = caption ?? name;
    async function onEditClick() {
        let ret = await openModal<number>(<PagePickValue label={label} value={value as number} type={type} options={options} step={step} />);
        let budValue = convertToBudValue(ret);
        await uq.SaveBudValue.submit({
            phraseId: bizBud.id,
            id,
            ...budValue
        });
        setValue(ret);
    }
    let content: any = value;
    if (ex !== undefined) {
        const { format } = ex;
        if (format !== undefined) {
            let f: string = format;
            content = f.replace('{value}', value ? String(value) : '?');
        }
    }
    return <LabelRowEdit label={label}
        readonly={readonly}
        onEditClick={onEditClick}
    >
        {content}
    </LabelRowEdit>;
}

export function EditBudString(props: EditBudProps) {
    function convertToBudValue(value: any) {
        return {
            int: undefined as number,
            dec: undefined as number,
            str: value,
        }
    }
    return <EditBudValue {...props} type="text" convertToBudValue={convertToBudValue} />;
}

export function EditBudInt(props: EditBudProps) {
    function convertToBudValue(value: any) {
        return {
            int: value,
            dec: undefined as number,
            str: undefined as string,
        }
    }
    return <EditBudValue {...props} type="number" convertToBudValue={convertToBudValue} />;
}

export function EditBudDec(props: EditBudProps) {
    const { ex } = props.bizBud;
    function convertToBudValue(value: any) {
        return {
            int: undefined as number,
            dec: value,
            str: undefined as string,
        }
    }
    let step: string = '0.000001';
    if (ex !== undefined) {
        let { fraction } = ex;
        step = String(1 / Math.pow(10, fraction));
    }
    return <EditBudValue {...props} type="number" step={step} convertToBudValue={convertToBudValue} />;
}

export function EditBudDate(props: EditBudProps) {
    const convertToBudValue = useCallback(function convertToBudValue(value: any) {
        let d = getDays(value);
        return {
            int: d,
            dec: undefined as number,
            str: undefined as string,
        }
    }, []);
    return <EditBudValue {...props} type="date"
        fromBudValue={contenFromDays}
        convertToBudValue={convertToBudValue} />;
}
