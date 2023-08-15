import { RegisterOptions } from "react-hook-form";
import { OnValueChanged, PickProps } from "tonwa-app";

export interface EditBudValue {
    pickValue: (props: PickProps, options: RegisterOptions) => Promise<string | number>;
    ValueTemplate: (props: { value: any; onValueChanged?: OnValueChanged; }) => JSX.Element;
}
