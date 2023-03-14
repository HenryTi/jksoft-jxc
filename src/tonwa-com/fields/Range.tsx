import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Band, BandProps, useBand, useBandContainer } from '../band';
import { FieldProps, FieldItem } from './field';

class RangeFieldItem implements FieldItem {
    readonly name: string;
    private readonly input: HTMLInputElement;
    private initValue: number;
    constructor(name: string, input: HTMLInputElement, initValue: number) {
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
            this.input.value = String(this.initValue);
        }
    }
}

interface RangeProps extends FieldProps {
    min: number;
    max: number;
    step?: number;
}

export function Range(props: RangeProps) {
    let input = useRef<HTMLInputElement>();
    let [value, setValue] = useState<number>();
    let band = useBand();
    let bandContainer = useBandContainer();
    useEffect(() => {
        let { name } = props;
        let fieldItem = new RangeFieldItem(name, input.current, bandContainer.props.values?.[name]);
        if (band) band.fields[name] = true;
        bandContainer.fields[name] = fieldItem;
    }, [band, bandContainer, input, props]);
    let { props: formProps } = bandContainer;
    let { name, className, readOnly, min, max, step } = props;
    readOnly = readOnly ?? formProps.readOnly;
    let initValue = bandContainer.props.values?.[name];
    function onChange(evt: ChangeEvent<HTMLInputElement>) {
        let val = evt.currentTarget.value;
        let n = Number(val);
        if (Number.isNaN(n) === false) {
            bandContainer.setValue(name, n);
            setValue(n);
        }
    }
    if (readOnly === true) {
        return <div className={className ?? bandContainer.defaultStringClassName}>
            {initValue ?? bandContainer.defaultNone}
        </div>;
    }
    return <div className={'d-flex ' + (className ?? bandContainer.defaultStringClassName)}>
        <div className="me-2 w-min-3c text-center">{value ?? initValue}</div>
        <div className="flex-grow-1">
            <input ref={input} type="range"
                defaultValue={bandContainer.props.values?.[name]}
                className={className ?? bandContainer.defaultRangeClassName}
                onChange={onChange}
                min={min}
                max={max}
                step={step}
            />
            <div className="d-flex small text-muted px-1">
                <div className="me-3">{min}</div>
                <div className="flex-grow-1" />
                <div className="ms-3">{max}</div>
            </div>
        </div>
    </div>;
}

export function BandRange(props: BandProps & RangeProps) {
    return <Band {...props}>
        <Range {...props} />
    </Band>;
}
