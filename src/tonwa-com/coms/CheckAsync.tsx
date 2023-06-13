import { useState } from "react";
import { FA } from "./FA";

interface Props extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    children: React.ReactNode;
    label?: string;
    labelClassName?: string;
    inputClassName?: string;
    gapClassName?: string;
    onCheckChanged?: (name: string, checked: boolean) => Promise<void>;
}

export function CheckAsync(props: Props) {
    let { onCheckChanged, children, labelClassName, inputClassName, gapClassName, name, defaultChecked } = props;
    let [running, setRunning] = useState(false);
    async function onChange(evt: React.ChangeEvent<HTMLInputElement>) {
        if (onCheckChanged === undefined) return;
        setRunning(true);
        let { name, checked } = evt.currentTarget;
        await onCheckChanged(name, checked);
        setRunning(false);
    }
    if (gapClassName === undefined) gapClassName = '';
    let vRunning: any;
    if (running === true) {
        vRunning = <FA name="spinner" spin={true} className={gapClassName + ' text-info position-absolute '} />;
    }
    return <label className={(labelClassName ?? '') + ' d-inline-block position-relative '}>
        {vRunning}
        <input type="checkbox" className={(inputClassName ?? '') + gapClassName}
            name={name}
            disabled={running}
            defaultChecked={defaultChecked}
            onChange={onChange} />
        {children}
    </label>;

}
