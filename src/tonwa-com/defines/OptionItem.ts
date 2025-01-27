import { JSX } from "react";

export interface OptionItem {
    label: string | JSX.Element;
    value: string | number | boolean;
}
