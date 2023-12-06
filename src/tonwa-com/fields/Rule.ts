import { EnumString, resStrings } from "../res";

export type Rule = (val: any) => (string | string[]);

export function checkRule(val: any, rule: Rule | Rule[]): string[] {
    if (!rule) return;
    let ret: string[] = [];
    function addErr(rule: Rule) {
        let err = rule(val);
        if (err) {
            if (Array.isArray(err) === true)
                ret.push(...err as string[]);
            else
                ret.push(err as string);
        }
    }
    if (Array.isArray(rule) === true) {
        for (let r of rule as Rule[]) {
            addErr(r);
        }
    }
    else {
        addErr(rule as Rule);
    }
    if (ret.length > 0) return ret;
    return undefined;
}

export function ruleIsRequired(val: any) {
    let s = (val as string).trim();
    if (!s) {
        return resStrings[EnumString.rule_required];
    }
}
