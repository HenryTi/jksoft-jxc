import { ChangeEvent, useEffect, useRef } from "react";
import { Band, BandProps, useBand, useBandContainer } from '../band';
import { FieldProps, FieldItem } from './field';
import { EnumString, resStrings } from "../res";
import { OptionItem } from "../defines";

class SelectFieldItem implements FieldItem {
    readonly name: string;
    private readonly select: HTMLSelectElement;
    private initIndex: any;
    constructor(name: string, select: HTMLSelectElement, initIndex: number) {
        this.name = name;
        this.select = select;
        this.initIndex = initIndex;
    }
    reset(): void {
        if (!this.select) return;
        this.select.selectedIndex = this.initIndex;
    }
}

interface SelectProps extends FieldProps {
    options: OptionItem[];
    placeholder?: string;
}

export function Select(props: SelectProps) {
    let select = useRef<HTMLSelectElement>();
    let band = useBand();
    let bandContainer = useBandContainer();
    useEffect(() => {
        let { props: formProps } = bandContainer;
        let { name, options } = props;
        let initValue = formProps.values?.[name];
        let initIndex = initValue ? options.findIndex(v => v.value === initValue) : 0;
        let fieldItem = new SelectFieldItem(name, select.current, initIndex);
        if (band) band.fields[name] = true;
        bandContainer.fields[name] = fieldItem;
    }, [band, bandContainer, props]);
    let { props: formProps } = bandContainer;
    let { name, options, placeholder, className, readOnly } = props;
    readOnly = readOnly ?? formProps.readOnly;
    let initValue = bandContainer.props.values?.[name];
    function onChange(evt: ChangeEvent<HTMLSelectElement>) {
        bandContainer.setValue(name, evt.currentTarget.value);
    }
    if (readOnly === true) {
        return <div className={className ?? bandContainer.defaultStringClassName}>
            {initValue ?? bandContainer.defaultNone}
        </div>;
    }
    return <select ref={select}
        defaultValue={bandContainer.props.values?.[name]}
        className={className ?? bandContainer.defaultSelectClassName}
        onChange={onChange}
    >
        {!initValue &&
            <option value={undefined}>{placeholder ?? resStrings[EnumString.placeholder_select]}</option>}
        {options.map((v, index) => <option key={index} value={v.value as any}>{v.label}</option>)}
    </select>;
}

export function BandSelect(props: BandProps & SelectProps) {
    return <Band {...props}>
        <Select {...props} />
    </Band>;
}
