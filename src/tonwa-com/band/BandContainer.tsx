import React, { useContext } from "react";
import { BandTemplateProps } from "./Band";
import { BandContext } from "./BandContext";
import { FieldItem } from "../fields";
import { atom, WritableAtom } from "jotai";
import { getAtomValue, setAtomValue } from "../tools";

export type OnValuesChanged = (values: { name: string; value: any; preValue: any; }, context: BandContainerContext<any>) => Promise<void>;
export interface BandContainerProps {
    className?: string;
    labelSize?: number;
    children: React.ReactNode;
    stringClassName?: string;    // for string and number and date
    checkClassName?: string;     // for checkbox and radio
    pickClassName?: string;     // for pick
    values?: { [name: string]: any };
    BandTemplate?: (props: BandTemplateProps) => JSX.Element;
    readOnly?: boolean;
    onValuesChanged?: OnValuesChanged;
}

const defaultStringClassName = 'form-control';
const defaultCheckClassName = 'form-check-input';
const defaultSelectClassName = 'form-select';
const defaultPickClassName = 'form-control';
const defaultRangeClassName = 'form-range';

export abstract class BandContainerContext<P extends BandContainerProps> {
    protected readonly valueAtoms: { [name: string]: WritableAtom<any, any, any> };
    readonly defaultStringClassName = defaultStringClassName;
    readonly defaultCheckClassName = defaultCheckClassName;
    readonly defaultSelectClassName = defaultSelectClassName;
    readonly defaultPickClassName = defaultPickClassName;
    readonly defaultRangeClassName = defaultRangeClassName;
    readonly defaultNone = '-';
    readonly fields: { [name: string]: FieldItem };
    readonly fieldStates: { [name: string]: WritableAtom<{ readOnly: boolean; disabled: boolean; }, any, any> };
    readonly bands: BandContext[];
    readonly BandTemplate?: (props: BandTemplateProps) => JSX.Element;
    readonly props: P;
    readonly readOnly: boolean;

    constructor(props: P) {
        let { values, BandTemplate, readOnly } = props;
        this.bands = [];
        this.BandTemplate = BandTemplate;
        this.props = props;
        this.readOnly = readOnly;
        this.valueAtoms = {};
        if (values) {
            for (let i in values) {
                this.valueAtoms[i] = atom(values[i]);
            }
        }
        this.fields = {};
        this.fieldStates = {};
        let each = (cs: React.ReactNode) => {
            React.Children.forEach(cs, c => {
                if (!c) return;
                if (React.isValidElement(c) === false) return;
                let e = c as JSX.Element;
                let { props: cProps } = e;
                if (cProps) {
                    let { name } = cProps;
                    if (name) this.fieldStates[name] = atom({ readOnly: false, disabled: false });
                    each(cProps.children);
                }
            })
        }
        each(props.children);
    }

    getValue(name: string): any {
        let atom = this.valueAtoms[name];
        if (!atom) return undefined;
        return getAtomValue(atom);
    }

    setValue(name: string, val: any) {
        let a = this.valueAtoms[name];
        if (!a) {
            this.valueAtoms[name] = atom(val);
        }
        else {
            setAtomValue(a, val);
        }
        let values: { [name: string]: any } = {};
        values[name] = val;
        this.onValuesChanged(values);
    }

    getValues() {
        let values: { [name: string]: any } = {};
        for (let i in this.valueAtoms) {
            values[i] = getAtomValue(this.valueAtoms[i]);
        }
        return values;
    }

    abstract get isDetail(): boolean;
    onValuesChanged = async (values: any) => {
        for (let i in values) {
            let vNew = values[i];
            let vOld = this.getValue(i);
            if (vNew !== vOld) {
                await this.props.onValuesChanged?.({ name: i, value: vNew, preValue: vOld }, this);
                this.setValue(i, vNew);
            }
        }
    }

    setError(name: string, err: string[]): boolean {
        let hasError = false;
        for (let band of this.bands) {
            let bandHasError = band.setError(name, err);
            if (bandHasError === false) continue;
            hasError = true;
        }
        return hasError;
    }

    clearError(name: string) {
        for (let band of this.bands) {
            band.clearError(name);
        }
    }

    clearAllErrors() {
        for (let band of this.bands) {
            band.clearAllErrors();
        }
    }

    setReadonly(name: string, readOnly: boolean) {
        let atomFieldState = this.fieldStates[name];
        let fieldState = getAtomValue(atomFieldState);
        if (fieldState) {
            setAtomValue(atomFieldState, {
                ...fieldState,
                readOnly,
            });
        }
    }

    setDisabled(name: string, disabled: boolean) {
        let atomFieldState = this.fieldStates[name];
        let fieldState = getAtomValue(atomFieldState);
        if (fieldState) {
            setAtomValue(atomFieldState, {
                ...fieldState,
                disabled,
            });
        }
    }
}

export const VBandContainerContext = React.createContext<BandContainerContext<BandContainerProps>>(undefined);

export function useBandContainer() {
    return useContext(VBandContainerContext);
}
