import { UqApp } from "app/UqApp";
import { BudRadio } from "app/Biz";
import { EditBudValue } from "./EditBudValue";
import { OnValueChanged } from "tonwa-app";
import { RadioAsync } from "tonwa-com";

export function pickValueForBudRadio(uqApp: UqApp, budName: string, budRadio: BudRadio): EditBudValue {
    let { items } = budRadio;
    return {
        pickValue: null,
        ValueTemplate: function ({ value: initValue, onValueChanged }: { value: any; onValueChanged?: OnValueChanged; }) {
            let radios: [caption: string, value: string | number, defaultCheck: boolean,][] = []
            let hasChecked = false;
            for (let item of items) {
                let [name, caption, value] = item;
                let c: boolean;
                if (initValue === value) {
                    c = true;
                    hasChecked = true;
                }
                else {
                    c = false;
                }
                radios.push([caption ?? name, value, c]);
            }
            if (hasChecked === false) {
                (radios[0])[2] = true;
            }
            return <RadioAsync name={budName} items={radios} onValueChanged={onValueChanged} />;
            /*
            return <>
                {items.map((v, index) => {
                    let [name, caption, value] = v;
                    async function onChange() {
                        if (onValueChanged === undefined) return;
                        await onValueChanged(value);
                    }
                    return <label key={index} className="me-4">
                        <input className="form-check-input"
                            onChange={onChange}
                            type="radio" name={budName} value={value}
                            defaultChecked={checked[index]} /> {caption ?? name}
                    </label>
                })}
            </>
            */
        }
    }
}
