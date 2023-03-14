import { StringsAndFuncs, EnumString } from "./defs";

export const zh: StringsAndFuncs = {
    strings: {
        [EnumString.rule_required]: '请填内容',
        [EnumString.rule_mustBeInteger]: '必须是整数',
        [EnumString.rule_mustBeDecimal]: '必须是数字',
        [EnumString.rule_belowMin]: '最小值',
        [EnumString.rule_overMax]: '最大值',
        [EnumString.placeholder_pick]: '请点击选择',
        [EnumString.placeholder_select]: '请点击选择',

        [EnumString.string_submit]: '提交',

        [EnumString.time_yesterday]: '昨天',
        [EnumString.time_today]: '今天',
        [EnumString.time_tomorrow]: '明天',
    },
    funcs: {
        time_md: (month: number, date: number) => `${month}-${date}`,
        time_ymd: (year: number, month: number, date: number) => `${year}-${month}-${date}`,
    }
}
