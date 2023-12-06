import { atom } from "jotai";
import React, { useContext } from "react";
import { getAtomValue, setAtomValue } from "../tools";
import { BandContainerContext } from "./BandContainer";

interface NamedError {
    name: string;
    error: string;
}

export class BandContext {
    readonly container: BandContainerContext<any>;
    readonly errors = atom([] as NamedError[]);
    readonly memos?: string[];
    readonly fields: { [name: string]: boolean };
    readOnly: boolean = false;

    constructor(container: BandContainerContext<any>, memos?: string[]) {
        this.container = container;
        this.memos = memos;
        this.fields = {};
        container?.bands.push(this);
    }

    setError(name: string, error: string[]): boolean {
        if (this.fields[name] === true) {
            let errors = getAtomValue(this.errors);
            if (error) {
                setAtomValue(this.errors, [...errors, ...error.map(v => ({ name, error: v }))])
                return true;
            }
            return errors.length > 0;
        }
        return false;
    }



    clearError(name: string) {
        if (this.fields[name] === true) {
            setAtomValue(this.errors, []);
        }
    }

    clearAllErrors() {
        setAtomValue(this.errors, []);
    }
}

export const VBandContext = React.createContext<BandContext>(undefined);

export function useBand() {
    return useContext(VBandContext);
}
