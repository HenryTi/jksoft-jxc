import { RegisterOptions } from "react-hook-form";
import { OnValueChanged, PickProps, UqAppBase } from "tonwa-app";

export interface EditBudValue {
    pickValue: (uqApp: UqAppBase, props: PickProps, options: RegisterOptions) => Promise<string | number>;
    ValueTemplate: (props: { value: any; onValueChanged?: OnValueChanged; }) => JSX.Element;
}
