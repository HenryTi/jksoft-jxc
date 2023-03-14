import { useEffect, useState } from "react";
import { FA } from "../coms";
import { Band, BandProps, useBand, useBandContainer } from '../band';
import { FieldProps, FieldItem } from './field';
import { EnumString, resStrings } from "../res";
import { setAtomValue } from "../tools";

type PickProps = {
    className?: string;
    onPick: (initValue: any) => Promise<any>;
    placeholder?: string;
    Value?: (props: { value: any }) => JSX.Element;
} & FieldProps;

class PickFieldItem implements FieldItem {
    readonly name: string;
    constructor(name: string) {
        this.name = name;
    }
    reset(): void {
    }
}

export function Pick(props: PickProps) {
    let band = useBand();
    let bandContainer = useBandContainer();
    let [value, setValue] = useState<any>();
    useEffect(() => {
        let { name } = props;
        if (band) band.fields[name] = true;
        bandContainer.fields[name] = new PickFieldItem(name/*, val*/);
    }, [band, bandContainer, props]);
    let { props: formProps } = bandContainer;
    let { name, className, onPick, placeholder, readOnly, Value } = props;
    readOnly = readOnly ?? formProps.readOnly;
    value = value ?? bandContainer.props.values?.[name];
    let cn = 'd-flex ';
    let vRight: any;
    let onClick: () => void;
    let vValue: any;
    if (readOnly !== true) {
        cn += ' cursor-pointer ';
        vRight = <div><FA name="angle-right" /></div>;
        onClick = async function () {
            let ret = await onPick(value);
            setAtomValue(bandContainer.getValue(name), ret);
            setValue(ret);
        }
        if (value === null) {
            vValue = null;
        }
        else if (value !== undefined) {
            vValue = Value === undefined ? JSON.stringify(value) : <Value value={value} />;
        }
        else {
            vValue = placeholder ?? resStrings[EnumString.placeholder_pick];
        }
    }
    else {
        vValue = value ?? bandContainer.defaultNone;
    }
    cn += (className ?? formProps.pickClassName ?? bandContainer.defaultPickClassName);
    return <div className={cn}
        onClick={onClick}>
        <div className="flex-grow-1">
            {vValue}
        </div>
        {vRight}
    </div>
}

export function BandPick(props: BandProps & PickProps) {
    return <Band {...props}>
        <Pick {...props} />
    </Band>;
}