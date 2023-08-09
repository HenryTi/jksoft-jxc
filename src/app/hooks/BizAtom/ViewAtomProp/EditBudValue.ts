import { OnValueChanged, PickProps } from "tonwa-app";

export interface EditBudValue {
    pickValue: (props: PickProps) => Promise<string | number>;
    ValueTemplate: (props: { value: any; onValueChanged?: OnValueChanged; }) => JSX.Element;
}
