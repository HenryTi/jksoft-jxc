
import { EditBudProps } from "../model";
import { useModal } from "tonwa-app";
import { useCallback, useState } from "react";
import { LabelRowEdit } from "./LabelRowEdit";
import { useUqApp } from "app/UqApp";
import { PagePickValue } from "./PagePickValue";

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
    return <LabelRowEdit label={label}
        readonly={readonly}
        onEditClick={onEditClick}
    >
        {value}
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
    let step: string;
    if (ex !== undefined) {
        let { fraction } = ex;
        step = String(1 / Math.pow(10, fraction));
    }
    return <EditBudValue {...props} type="number" step={step} convertToBudValue={convertToBudValue} />;
}

const date19700101 = Date.parse('1970-1-1');
const milliseconds = 1000 * 60 * 60 * 24;
function getDays(date: string) {
    return Math.floor((Date.parse(date) - date19700101) / milliseconds) + 1;
}
function fromDays(days: number) {
    return new Date(date19700101 + days * milliseconds);
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
    const fromBudValue = useCallback(function (days: number) {
        let date = fromDays(days);
        let ret = date.toISOString();
        let p = ret.indexOf('T');
        return ret.substring(0, p);
    }, []);
    return <EditBudValue {...props} type="date"
        fromBudValue={fromBudValue}
        convertToBudValue={convertToBudValue} />;
}
