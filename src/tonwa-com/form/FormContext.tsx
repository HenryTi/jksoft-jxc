import { atom } from 'jotai';
import React, { useContext } from 'react';
import { setAtomValue } from '../tools';
import { BandContainerContext } from '../band';
import { FormProps } from './Form';

export interface ErrorResponse {
    hasError: boolean;
    errors: string[];
}
export class FormContext extends BandContainerContext<FormProps> {
    readonly errorResponse = atom({
        hasError: false,
        errors: undefined,
    } as ErrorResponse);

    get isDetail(): boolean {
        return false;
    }

    setError(name: string, err: string | string[]): boolean {
        if (!err) return;
        let errors: string[];
        let hasError: boolean;
        if (Array.isArray(err) === false) err = [err as string];
        if (!name) {
            if (err && err.length > 0) {
                errors = [...(err as string[])];
                hasError = true;
            }
        }
        else {
            hasError = super.setError(name, err as string[]);
        }
        setAtomValue(this.errorResponse, { hasError, errors });
        return hasError;
    }

    clearError(name: string) {
        super.clearError(name);
        setAtomValue(this.errorResponse, {
            hasError: false,
            errors: undefined,
        });
    }

    clearAllErrors() {
        super.clearAllErrors();
        setAtomValue(this.errorResponse, {
            hasError: false,
            errors: undefined,
        });
    }

    clearValues() {
        for (let i in this.valueAtoms) {
            this.setValue(i, undefined);
        }
        for (let i in this.fields) {
            this.fields[i].reset();
        }
        this.clearAllErrors();
    }
}

export const VFormContext = React.createContext<FormContext>(undefined);

export function useForm() {
    return useContext(VFormContext);
}
