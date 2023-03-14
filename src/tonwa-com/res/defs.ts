export enum EnumString {
    rule_required,
    rule_mustBeInteger,
    rule_mustBeDecimal,
    rule_belowMin,
    rule_overMax,
    placeholder_pick,
    placeholder_select,

    string_submit,

    time_yesterday,
    time_today,
    time_tomorrow,
}

export interface LangFunc {
    time_md: (month: number, date: number) => string;
    time_ymd: (year: number, month: number, date: number) => string;
};

export interface StringsAndFuncs {
    strings: { [key in EnumString]: string };
    funcs: LangFunc;
}
