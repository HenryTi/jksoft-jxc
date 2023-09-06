import { BudRadio } from "app/Biz";
import { EditBudValue } from "./model";
import { OnValueChanged } from "tonwa-app";
import { RadioAsync } from "tonwa-com";

export function pickBudRadio(budName: string, budRadio: BudRadio): EditBudValue {
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
        }
    }
}
