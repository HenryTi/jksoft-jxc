import { Band, BandProps } from '../band';
import { EnumString, resStrings } from '../res';
import { CharInput } from "./CharInput";
import { FieldProps } from './field';
import { Rule } from './Rule';

interface NumberProps extends FieldProps {
    placeholder?: string;
    maxLength?: number;
    min?: number;
    max?: number;
}

interface DecimalProps extends NumberProps {
}

function appendRule(rules: Rule | Rule[], ...ruleArr: Rule[]): Rule[] {
    let ret = [...ruleArr];
    if (rules) {
        ret.push(...Array.isArray(rules) === true ? rules as Rule[] : [rules as Rule]);
    }
    return ret;
}

function isValidNumber(val: string, excludeChars: string): boolean {
    val = (val as string).trim();
    if (val.length === 0) return;
    let r = Number.parseFloat(val);
    if (isNaN(r) === true) return false;
    if (val.indexOf('+') > 0 || val.indexOf('-') > 0) return false;
    let sr = String(r);
    let len = excludeChars.length;
    for (let i = 0; i < len; i++) {
        let ec = excludeChars[i];
        if (sr.indexOf(ec) >= 0) return false;
    }
    return true;
}

function belowMin(val: string, min: number): boolean {
    if (min === undefined || min === null) return false;
    let r = Number.parseFloat(val);
    if (isNaN(r) === true) return false;
    return r < min;
}

function overMax(val: string, max: number): boolean {
    if (max === undefined || max === null) return false;
    let r = Number.parseFloat(val);
    if (isNaN(r) === true) return false;
    return r > max;
}

const intChars = '01234567890-+';
const decChars = intChars + '.';
function NumberInput(props: NumberProps & { chars: string; excludeChars: string; }) {
    let { placeholder, maxLength, rule, min, max, chars, excludeChars } = props;
    function isValidKey(key: string) {
        return chars.indexOf(key) >= 0;
    }
    function mustBeDecimal(val: any) {
        if (isValidNumber(val, excludeChars) === false) {
            return resStrings[EnumString.rule_mustBeDecimal];
        }
    }
    function ruleMin(val: any) {
        if (belowMin(val, min) === true) {
            return resStrings[EnumString.rule_belowMin] + min;
        }
    }
    function ruleMax(val: any) {
        if (overMax(val, max) === true) {
            return resStrings[EnumString.rule_overMax] + max;
        }
    }
    return <CharInput placeholder={placeholder} maxLength={maxLength}
        isValidKey={isValidKey}
        rule={appendRule(rule, mustBeDecimal, ruleMin, ruleMax)}
        {...props} />;
}


export function Decimal(props: DecimalProps) {
    return <NumberInput {...props} chars={decChars} excludeChars="e" />;
}

export function BandDecimal(props: BandProps & DecimalProps) {
    return <Band {...props}>
        <Decimal {...props} />
    </Band>;
}

interface IntProps extends NumberProps {
}

export function Int(props: IntProps) {
    return <NumberInput {...props} chars={intChars} excludeChars=".e" />;
}

export function BandInt(props: BandProps & IntProps) {
    return <Band {...props}>
        <Int {...props} />
    </Band>;
}
