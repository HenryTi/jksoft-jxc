import { useState } from "react";
import { FA } from "tonwa-com";

export interface InputNumber {
    className?: string;
    errorClassName?: string;
    defaultValue?: number;
    min?: number;
    max?: number;
    allowDecimal?: boolean;      // default false
    onInputed: (value: number) => Promise<void>;
}

export function InputNumber({ className, errorClassName, defaultValue, min, max, allowDecimal, onInputed }: InputNumber) {
    const [error, setError] = useState(undefined as string);
    const [disabled, setDisabled] = useState(false);
    const onFocus = (evt: React.FocusEvent<HTMLInputElement>) => {
        evt.currentTarget.select();
        setError(undefined);
    }
    const onChange = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    }
    const onBlur = async (evt: React.FocusEvent<HTMLInputElement>) => {
        let err: string = undefined;
        let v = evt.currentTarget.value;
        let n: number;
        if (v.trim().length === 0) {
            n = undefined;
        }
        n = Number(evt.currentTarget.value);
        if (Number.isNaN(n) === true) {
            err = '不是数字';
        }
        else {
            if (min !== undefined) {
                if (n < min) err = `不能小于${min}`;
            }
            if (max !== undefined) {
                if (n > max) err = `不能大于${max}`;
            }
            if (allowDecimal === undefined || allowDecimal === false) {
                if (Number.isInteger(n) === false) err = '不能是小数';
            }
            if (err !== undefined) {
                setError(err);
                return;
            }
        }
        if (onInputed !== undefined) {
            setDisabled(true);
            await onInputed(n);
            setDisabled(false);
        }
    }
    return <>
        <input type="text"
            disabled={disabled}
            className={(className ?? 'form-control w-8c text-end') + (error === undefined ? '' : ' is-invalid')}
            defaultValue={defaultValue}
            onFocus={onFocus}
            onChange={onChange}
            onBlur={onBlur} />
        {error && <div className={errorClassName ?? 'text-danger text-end mx-3'}><FA name="times-circle" /> {error}</div>}
    </>;
}
