import { useState } from "react";
import { Spinner, SpinnerSmall } from "./Spinner";

interface Props {
    name: string;
    items: [item: string | number, caption: string, value: string | number, defaultCheck: boolean,][];
    onCheckChanged?: (item: string | number) => Promise<void>;
    classNameRadio?: string;
    disabled?: boolean;
}

export function RadioAsync(props: Props) {
    let { name, items, onCheckChanged, classNameRadio, disabled } = props;
    let [submiting, setSubmiting] = useState(false);

    async function onValueChanged(value: string | number) {
        if (onCheckChanged === undefined) return;
        setSubmiting(true);
        await onCheckChanged(value);
        setSubmiting(false);
    }

    let spinner: any;
    if (submiting === true) {
        disabled = true;
        spinner = <div className="position-absolute d-flex align-items-center" style={{ left: 0, top: 0, right: 0, bottom: 0 }}>
            <SpinnerSmall />
        </div>;
    }
    return <>
        {spinner}
        <ViewRadios name={name}
            items={items}
            onCheckChanged={onValueChanged}
            disabled={disabled}
            classNameRadio={classNameRadio} />
    </>;
}

function ViewRadios(props: Props & { disabled: boolean; }) {
    let { name, items, onCheckChanged, disabled, classNameRadio } = props;
    let cn = (classNameRadio ?? 'me-4') + ' ';
    // if (disabled === true) cn += ' text-light  ';
    return <>
        {items.map((v, index) => {
            let [item, caption, value, defaultCheck] = v;
            async function onChange() {
                await onCheckChanged(item);
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