import { ChangeEvent, useEffect, useRef } from "react";
import { Band, BandProps, useBand, useBandContainer } from '../band';
import { FieldProps, FieldItem } from './field';
import { OptionItem } from "../defines";
import { useAtomValue } from "jotai";

type RadioInputProps = {
    item: OptionItem;
    itemIndex: number;
    defaultChecked: boolean;
} & FieldProps;

class RadioFieldItem implements FieldItem {
    readonly name: string;
    private readonly inputs: HTMLInputElement[];
    private initValue: any;
    constructor(name: string, initValue: any) {
        this.name = name;
        this.inputs = [];
        if (initValue) {
            this.initValue = String(initValue);
        }
    }
    addInput(input: HTMLInputElement) {
        this.inputs.push(input);
    }
    reset(): void {
        for (let input of this.inputs) {
            if (!input) continue;
            input.checked = input.value === this.initValue;
        }
    }
}

function RadioInput({ name, className, readOnly, item, itemIndex, defaultChecked }: RadioInputProps) {
    let { label, value } = item;
    let input = useRef<HTMLInputElement>();
    let band = useBand();
    let bandContainer = useBandContainer();
    useEffect(() => {
        let fieldItem = bandContainer.fields[name] as RadioFieldItem;
        fieldItem.addInput(input.current);
    }, [band, bandContainer, name]);
    let { props } = bandContainer;
    function onChange(evt: ChangeEvent<HTMLInputElement>) {
        let t = evt.currentTarget;
        if (t.checked === true) {
            bandContainer.setValue(name, value);
        }
    }
    readOnly = readOnly ?? props.readOnly ?? false;
    let radioId = `_${name}_${itemIndex}_${Date.now()}`;
    return <label className="form-check form-check-inline py-1 form-check-label">
        <input ref={input} name={name} type="radio"
            id={radioId}
            className={className ?? props.checkClassName ?? bandContainer.defaultCheckClassName}
            disabled={readOnly}
            onChange={onChange}
            value={value as any}
            defaultChecked={defaultChecked} />
        {label}
    </label>;
    // <label className="form-check-label" htmlFor={radioId}>{label}</label> &nbsp;
}

interface RadioProps extends FieldProps {
    options: OptionItem[];
    children?: React.ReactNode;
}

export function Radio(props: RadioProps) {
    let band = useBand();
    let bandContainer = useBandContainer();
    let { name, options } = props;
    let val = bandContainer.getValue(name);
    let { current: fieldItem } = useRef(new RadioFieldItem(name, bandContainer.props.values?.[name]));
    if (band) band.fields[name] = true;
    bandContainer.fields[name] = fieldItem;
    return <div className="py-1">
        {options.map((v, index) => <RadioInput key={index} {...props} item={v}
            itemIndex={index} defaultChecked={v.value === val} />)}
    </div>;
}

export function BandRadio(props: BandProps & RadioProps) {
    return <Band {...props} >
        <Radio {...props} />
    </Band>;
}
