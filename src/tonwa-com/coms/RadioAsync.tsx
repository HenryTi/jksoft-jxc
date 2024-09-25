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
        spinner = <div className="position-absolute d-flex align-items-center" style={{ left: '1em', top: 0, right: 0, bottom: 0 }}>
            <SpinnerSmall />
        </div>;
    }
    return <ViewRadios name={name}
        items={items}
        onCheckChanged={onValueChanged}
        disabled={disabled}
        classNameRadio={classNameRadio}
        spinner={spinner} />;
}

function ViewRadios(props: Props & { disabled: boolean; spinner: any }) {
    let { name, items, onCheckChanged, disabled, classNameRadio, spinner } = props;
    let cn = (classNameRadio ?? ' me-4 ') + ' ';
    return <>
        {items.map((v, index) => {
            let [item, caption, value, defaultCheck] = v;
            async function onChange() {
                await onCheckChanged(item);
            }
            return <label key={index} className={cn + ' position-relative '}>
                {spinner}
                <input className="form-check-input"
                    onChange={onChange}
                    disabled={disabled}
                    type="radio" name={name} value={value}
                    defaultChecked={defaultCheck} /> {caption}
            </label>
        })}
    </>;
}