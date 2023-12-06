import { ChangeEvent, useEffect, useRef } from "react";
import { useBand, Band, BandProps, useBandContainer } from '../band';
import { checkRule } from './Rule';
import { FieldItem, FieldProps } from './field';

type TextProps = {
    placeholder?: string;
    maxLength?: number;
    rows?: number;
} & FieldProps;

class TextFieldItem implements FieldItem {
    readonly name: string;
    private input: HTMLTextAreaElement;
    private initValue: any;
    constructor(name: string, input: HTMLTextAreaElement, initValue: any) {
        this.name = name;
        this.input = input;
        this.initValue = initValue;
    }
    reset(): void {
        if (!this.input) return;
        this.input.value = this.initValue ?? '';
    }
}

export function TextArea({ name, className, readOnly, placeholder, maxLength, rule, rows }: TextProps) {
    let input = useRef<HTMLTextAreaElement>();
    let band = useBand();
    let bandContainer = useBandContainer();
    useEffect(() => {
        if (band) band.fields[name] = true;
        let { fields, props } = bandContainer;
        fields[name] = new TextFieldItem(name, input.current, props.values?.[name]);
    }, [band, bandContainer, name]);
    let { props } = bandContainer;
    readOnly = readOnly ?? props.readOnly ?? false;
    let cn = className ?? props.stringClassName ?? bandContainer.defaultStringClassName;
    let initValue = props.values?.[name];
    if (readOnly === true) {
        return <div className={cn}>
            {initValue ?? bandContainer.defaultNone}
        </div>;
    }
    let onFocus = () => {
        bandContainer.clearError(name);
    }
    let onBlur = () => {
        let err = checkRule(input.current.value, rule);
        bandContainer.setError(name, err);
    }
    let onChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
        bandContainer.setValue(name, evt.currentTarget.value);
    }
    return <textarea ref={input} name={name}
        className={cn}
        readOnly={readOnly}
        onFocus={onFocus} onBlur={onBlur}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows ?? 4}
        defaultValue={initValue} />;
}

export function BandTextArea(props: BandProps & TextProps) {
    return <Band {...props}>
        <TextArea {...props} />
    </Band>;
}
