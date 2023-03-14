import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useBand, useBandContainer } from '../band';
import { checkRule } from './Rule';
import { FieldProps, FieldItem } from './field';
import { useAtomValue } from "jotai";

type CharInputBaseProps = {
    placeholder: string;
    maxLength: number;
    isValidKey?: (key: string) => boolean;
    type?: string;
} & FieldProps;

class CharFieldItem implements FieldItem {
    readonly name: string;
    private input: HTMLInputElement;
    private initValue: any;
    constructor(name: string, input: HTMLInputElement, initValue: any) {
        this.name = name;
        this.input = input;
        this.initValue = initValue;
    }
    reset(): void {
        if (!this.input) return;
        this.input.value = this.initValue ?? '';
    }
}

export function CharInput(props: CharInputBaseProps) {
    let bandContainer = useBandContainer();
    let { name } = props;
    let initValue = bandContainer?.props.values?.[name];
    return <CharInputBase {...props} initValue={initValue} />
}

export function CharInputBase({ name, className, readOnly, placeholder, maxLength, rule, isValidKey, initValue, type, disabled }
    : CharInputBaseProps & { initValue: any; }) {
    let input = useRef<HTMLInputElement>();
    let [hasError, setHasError] = useState(false);
    let band = useBand();
    let bandContainer = useBandContainer();
    let { props, fields, fieldStates } = bandContainer;
    let fieldState = useAtomValue(fieldStates[name]);
    readOnly = readOnly ?? (fieldState?.readOnly) ?? props.readOnly ?? false;
    useEffect(() => {
        if (!band) return;
        let { fields: bandFields } = band;
        bandFields[name] = true;
        let { props, fieldStates } = bandContainer;
        fields[name] = new CharFieldItem(name, input.current, props.values?.[name]);
        Object.assign(fieldStates[name], { readOnly, disabled });
    }, [band, bandContainer, name, fields, disabled, readOnly]);
    let cn = className ?? props.stringClassName ?? bandContainer.defaultStringClassName ?? '';
    if (hasError === true) cn += ' is-invalid';
    if (readOnly === true) {
        return <div className={cn + ' bg-light text-muted'}>
            {initValue ?? bandContainer.defaultNone}
        </div>;
    }
    let onFocus = () => {
        bandContainer.clearError(name);
        setHasError(false);
    }
    let onBlur = () => {
        let err = checkRule(input.current.value, rule);
        bandContainer.setError(name, err);
        let has = !(err === undefined);
        setHasError(has);
    }
    let onChange = (evt: ChangeEvent<HTMLInputElement>) => {
        bandContainer.setValue(name, evt.currentTarget.value);
    }
    let onBeforeInput = (evt: React.FormEvent<HTMLInputElement>) => {
        if (!isValidKey) return true;
        if (isValidKey((evt as any).data) === false) {
            evt.preventDefault();
            return false;
        }
    }
    return <input ref={input} name={name} type={type ?? 'text'}
        className={cn}
        disabled={fieldState?.disabled}
        readOnly={readOnly}
        onFocus={onFocus} onBlur={onBlur} onBeforeInput={onBeforeInput}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        defaultValue={initValue} />;
}
