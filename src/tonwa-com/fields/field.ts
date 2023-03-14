import { Rule } from './Rule';

export interface FieldProps {
    name: string;
    className?: string;
    readOnly?: boolean;
    disabled?: boolean;
    rule?: Rule | Rule[];
    memo?: string | string[];
}

export interface FieldItem {
    name: string;
    reset(): void;
}
