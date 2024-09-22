import { BizBud } from "app/Biz";
import { RegisterOptions } from "react-hook-form";
import { BudCheckValue, BudValue, OnValueChanged, PickProps, UqAppBase } from "tonwa-app";
import { BudEditing } from "./EditBud";
import { WritableAtom } from "jotai";

export interface EditBudValue {
    pickValue: (uqApp: UqAppBase, props: PickProps, options: RegisterOptions) => Promise<string | number>;
    ValueTemplate: (props: { value: any; onValueChanged?: OnValueChanged; }) => JSX.Element;
}

export interface ViewBudRowProps {
    name: string;
    label: string | JSX.Element;
    labelSize?: 0 | 1 | 2;
    readonly?: boolean;
    type: 'string' | 'number' | 'text';
    bold?: boolean;
}

export interface ViewBudProps extends ViewBudRowProps {
    id: number;
    value: BudValue;
    saveField: (id: number, name: string, value: string | number) => Promise<void>;
    saveBud: (id: number, bizBud: BizBud, value: string | number) => Promise<void>;
    ValueTemplate?: (props: { value: any; }) => JSX.Element;
    pickValue?: (uqApp: UqAppBase, props: PickProps, options: RegisterOptions) => Promise<string | number>;
}
/*
export interface IEditing {
    error: WritableAtom<string, any, any>;
    required: boolean;
}

export interface IBudEditing extends IEditing {
    bizBud: BizBud;
    calcValue: (formula: string) => number | string;
}
*/
export type OnBudChanged = (bud: BizBud, value: string | number | BudCheckValue) => Promise<void> | void;

export interface EditBudProps {
    id: number;
    value: BudValue;
    budEditing: BudEditing;
    labelSize?: 0 | 1 | 2;
    flag?: JSX.Element;             // 重要字段标志
    readOnly?: boolean;
    options?: RegisterOptions;
    onChanged?: (bizBud: BizBud, value: string | number | BudCheckValue) => Promise<void> | void;
}

export interface EditBudTemplateProps extends EditBudProps {
    ViewValueEdit: ViewValueEdit;
}

export interface EditProps {
    label: string | JSX.Element;
    labelSize?: 0 | 1 | 2;
    children: React.ReactNode;
    onEditClick: () => void;
    readOnly?: boolean;
    flag?: JSX.Element;             // 重要的，label上做标识
    popup?: boolean;
    noBorder?: boolean;
    error: WritableAtom<string, any, any>;
    required: boolean;
}

export type ViewValueEdit = (props: EditProps) => JSX.Element;

