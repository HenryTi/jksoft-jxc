import { BizBud } from "app/Biz";
import { RegisterOptions } from "react-hook-form";
import { PickProps, UqAppBase } from "tonwa-app";

export interface ViewPropRowProps {
    name: string;
    label: string;
    readonly?: boolean;
    type: 'string' | 'number';
}

export interface ViewPropProps extends ViewPropRowProps {
    id: number;
    value: string | number;
    saveField: (id: number, name: string, value: string | number) => Promise<void>;
    saveBud: (id: number, bizBud: BizBud, value: string | number) => Promise<void>;
    ValueTemplate?: (props: { value: any; }) => JSX.Element;
    pickValue?: (uqApp: UqAppBase, props: PickProps, options: RegisterOptions) => Promise<string | number>;
}
