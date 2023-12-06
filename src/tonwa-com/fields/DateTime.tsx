import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Band, BandProps, useBand, useBandContainer } from '../band';
import { FieldProps, FieldItem } from './field';
import { checkRule } from "./Rule";

class DTFieldItem implements FieldItem {
    readonly name: string;
    private readonly input: HTMLInputElement;
    private initValue: string;
    constructor(name: string, input: HTMLInputElement, initValue: string) {
        this.name = name;
        this.input = input;
        this.initValue = initValue;
    }
    reset(): void {
        if (!this.input) return;
        if (!this.initValue) {
            this.input.value = undefined;
        }
        else {
            this.input.value = this.initValue;
        }
    }
}

interface DtProps extends FieldProps {
}

function Picker(props: DtProps & { type: 'date' | 'time'; }) {
    let input = useRef<HTMLInputElement>();
    let band = useBand();
    let bandContainer = useBandContainer();
    let [hasError, setHasError] = useState(false);
    useEffect(() => {
        let { fields } = bandContainer;
        let { name } = props;
        let fieldItem = new DTFieldItem(name, input.current, bandContainer.props.values?.[name]);
        if (band) {
            band.fields[name] = true;
        }
        fields[name] = fieldItem;
    }, [band, bandContainer, input, props]);
    let { name, className, readOnly, type, rule } = props;
    let { props: formProps } = bandContainer;
    readOnly = readOnly ?? formProps.readOnly;
    let initValue = bandContainer.props.values?.[name];
    let cn = className ?? formProps.stringClassName ?? bandContainer.defaultStringClassName ?? '';
    if (hasError === true) cn += ' is-invalid';
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
    function onChange(evt: ChangeEvent<HTMLInputElement>) {
        let val = evt.currentTarget.value;
        bandContainer.setValue(name, val);
    }
    if (readOnly === true) {
        return <div className={className ?? bandContainer.defaultStringClassName}>
            {initValue ?? bandContainer.defaultNone}
        </div>;
    }
    return <input ref={input} type={type}
        defaultValue={bandContainer.props.values?.[name]}
        className={cn}
        onBlur={onBlur} onFocus={onFocus}
        onChange={onChange}
    />;
}

interface DateProps extends DtProps {
}
export function DatePicker(props: DateProps) {
    return <Picker {...props} type="date" />
}

interface TimeProps extends DtProps {
}
export function TimePicker(props: TimeProps) {
    return <Picker {...props} type="time" />
}

export function BandDatePicker(props: BandProps & DtProps) {
    return <Band {...props}>
        <DatePicker {...props} />
    </Band>;
}

export function BandTimePicker(props: BandProps & DtProps) {
    return <Band {...props}>
        <TimePicker {...props} />
    </Band>;
}
