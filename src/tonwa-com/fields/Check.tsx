import { useAtomValue } from "jotai";
import { ChangeEvent, useEffect, useRef } from "react";
import { Band, BandContentType, BandProps, useBand, useBandContainer } from '../band';
import { FieldProps, FieldItem } from './field';

type CheckInputProps = {
    indeterminate?: boolean;
    checkedValue?: string | number | boolean;
    uncheckedValue?: string | number | boolean;
} & FieldProps;

class CheckFieldItem implements FieldItem {
    readonly name: string;
    private input: HTMLInputElement;
    private indeterminate: boolean;
    private initChecked: boolean;
    constructor(name: string, input: HTMLInputElement, indeterminate: boolean, initChecked: boolean) {
        this.name = name;
        this.input = input;
        this.indeterminate = indeterminate;
        this.initChecked = initChecked;
    }
    reset(): void {
        if (!this.input) return;
        this.input.indeterminate = this.indeterminate;
        this.input.checked = this.initChecked;
    }
}

function CheckInput({ name, id, readOnly, indeterminate, checkedValue, uncheckedValue }: CheckInputProps & { id: string; }) {
    let input = useRef<HTMLInputElement>();
    let band = useBand();
    let bandContainer = useBandContainer();
    let { props } = bandContainer;
    let val = bandContainer.getValue(name);
    let initChecked = val === (checkedValue ?? true)
    let onClick: (evt: React.MouseEvent<HTMLInputElement>) => void;
    let checked: boolean;
    if (bandContainer.isDetail === true) {
        checked = initChecked;
        initChecked = undefined;
        onClick = (evt: React.MouseEvent<HTMLInputElement>) => {
            evt.preventDefault();
            return false;
        }
    }
    useEffect(() => {
        if (indeterminate === true) {
            input.current.indeterminate = true;
        }
        if (band) {
            let { fields: bandFields } = band;
            bandFields[name] = true;
        }
        let { props, fields } = bandContainer;
        let initChecked = props.values?.[name] === (checkedValue ?? true)
        fields[name] = new CheckFieldItem(name, input.current, indeterminate, initChecked);
    }, [band, bandContainer, name, indeterminate, checkedValue]);
    function onChange(evt: ChangeEvent<HTMLInputElement>) {
        let val: any;
        let t = evt.currentTarget;
        if (t.indeterminate === true) val = undefined;
        else {
            val = t.checked ? (checkedValue ?? true) : (uncheckedValue ?? false);
        }
        bandContainer.setValue(name, val);
    }
    return <input ref={input} name={name} type="checkbox" id={id}
        className={props.checkClassName ?? bandContainer.defaultCheckClassName}
        disabled={readOnly ?? props.readOnly ?? false}
        onChange={onChange}
        onClick={onClick}
        checked={checked}
        defaultChecked={initChecked} />;
}

interface CheckProps extends CheckInputProps {
    label?: JSX.Element | string;
}

export function Check(props: CheckProps) {
    let { label } = props;
    let id = `_${props.name}_${Date.now()}`
    return <div className={props.className ?? 'form-check'}>
        <CheckInput {...props} id={id} />
        <label className="form-check-label" htmlFor={id}>{label}</label>
    </div>;
}

export function BandCheck(props: BandProps & CheckProps) {
    let { label } = props;
    return <Band {...props} label={undefined} contentType={BandContentType.check}>
        <Check {...props} label={label} />
    </Band>;
}
