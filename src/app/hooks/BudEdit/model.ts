import { BizBud } from "app/Biz";
import { RegisterOptions } from "react-hook-form";
import { OnValueChanged, PickProps, UqAppBase } from "tonwa-app";

export interface EditBudValue {
    pickValue: (uqApp: UqAppBase, props: PickProps, options: RegisterOptions) => Promise<string | number>;
    ValueTemplate: (props: { value: any; onValueChanged?: OnValueChanged; }) => JSX.Element;
}

export interface ViewBudRowProps {
    name: string;
    label: string | JSX.Element;
    readonly?: boolean;
    type: 'string' | 'number' | 'text';
}

export type BudValue = string | number | { [item: number]: boolean; };

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

export interface EditBudTemplateProps extends EditBudProps {
    ValueEdit: ValueEdit;
}

export interface EditProps {
    label: string | JSX.Element;
    children: React.ReactNode;
    onEditClick: () => void;
    readonly?: boolean;
}

export type ValueEdit = (props: EditProps) => JSX.Element;

