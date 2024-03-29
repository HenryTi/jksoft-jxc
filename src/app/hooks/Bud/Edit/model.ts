import { BizBud } from "app/Biz";
import { Atom, WritableAtom } from "jotai";
import { RegisterOptions } from "react-hook-form";
import { BudCheckEditValue, BudValue, OnValueChanged, PickProps, UqAppBase } from "tonwa-app";

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

export interface ViewBudProps extends ViewBudRowProps {
    id: number;
    value: BudValue;
    saveField: (id: number, name: string, value: string | number) => Promise<void>;
    saveBud: (id: number, bizBud: BizBud, value: string | number) => Promise<void>;
    ValueTemplate?: (props: { value: any; }) => JSX.Element;
    pickValue?: (uqApp: UqAppBase, props: PickProps, options: RegisterOptions) => Promise<string | number>;
}

export interface IEditing {
    error: WritableAtom<string, any, any>;
    required: boolean;
}

export interface IBudEditing extends IEditing {
    bizBud: BizBud;
}

export type OnBudChanged = (bud: BizBud, value: string | number | BudCheckEditValue) => Promise<void> | void;

export interface EditBudProps {
    id: number;
    value: BudValue;
    budEditing: IBudEditing;
    // bizBud: BizBud;
    plus?: boolean;             // 重要的字段
    readonly?: boolean;
    options?: RegisterOptions;
    onChanged?: (bizBud: BizBud, value: string | number | BudCheckEditValue) => Promise<void> | void;
}

export interface EditBudTemplateProps extends EditBudProps {
    ViewValueEdit: ViewValueEdit;
}

export interface EditProps extends IEditing {
    label: string | JSX.Element;
    children: React.ReactNode;
    onEditClick: () => void;
    readonly?: boolean;
    plus?: boolean;             // 重要的，label上做标识
}

export type ViewValueEdit = (props: EditProps) => JSX.Element;

