import { BizBud } from "app/Biz";
import { RegisterOptions } from "react-hook-form";
import { PickProps, UqAppBase } from "tonwa-app";

export interface ViewBudRowProps {
    name: string;
    label: string;
    readonly?: boolean;
    type: 'string' | 'number' | 'text';
}

export type BudValue = string | number | { [item: string]: boolean; };

export interface ViewBudProps extends ViewBudRowProps {
    id: number;
    value: BudValue;
    saveField: (id: number, name: string, value: string | number) => Promise<void>;
    saveBud: (id: number, bizBud: BizBud, value: string | number) => Promise<void>;
    ValueTemplate?: (props: { value: any; }) => JSX.Element;
    pickValue?: (uqApp: UqAppBase, props: PickProps, options: RegisterOptions) => Promise<string | number>;
}

export interface EditBudProps {
    id: number;
    value: BudValue;
    bizBud: BizBud;
    readonly?: boolean;
    options?: RegisterOptions;
}
