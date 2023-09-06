import { useState } from "react";
import { Spinner, SpinnerSmall } from "./Spinner";

interface Props {
    name: string;
    items: [caption: string, value: string | number, defaultCheck: boolean,][];
    onValueChanged?: (value: string | number) => Promise<void>;
}

export function RadioAsync(props: Props) {
    let { name, items, onValueChanged: orgOnValueChanged } = props;
    let [submiting, setSubmiting] = useState(false);

    async function onValueChanged(value: string | number) {
        if (orgOnValueChanged === undefined) return;
        setSubmiting(true);
        await orgOnValueChanged(value);
        setSubmiting(false);
    }

    let spinner: any;
    if (submiting === true) {
        spinner = <div className="position-absolute d-flex align-items-center" style={{ left: 0, top: 0, right: 0, bottom: 0 }}>
            <SpinnerSmall />
        </div>;
    }
    return <>
        {spinner}
        <ViewRadios name={name} items={items} onValueChanged={onValueChanged} disabled={submiting} />
    </>;
}

function ViewRadios(props: Props & { disabled: boolean; }) {
    let { name, items, onValueChanged, disabled } = props;
    let cn = 'me-4 ';
    if (disabled === true) cn += 'text-light invisible ';
    return <>
        {items.map((v, index) => {
            let [caption, value, defaultCheck] = v;
            async function onChange() {
                await onValueChanged(value);
            }
            return <label key={index} className={cn}>
                <input className="form-check-input"
                    onChange={onChange}
                    disabled={disabled}
                    type="radio" name={name} value={value}
                    defaultChecked={defaultCheck} /> {caption}
            </label>
        })}
    </>;
}