import { PickProps, pickValue } from "tonwa-app";
import { BudString } from "app/Biz";
import { EditBudValue } from "./model";
import { RegisterOptions } from "react-hook-form";
import { UqApp } from "app/UqApp";

export function pickBudString(uqApp: UqApp, bud: BudString, options: RegisterOptions): EditBudValue {
    return {
        pickValue, //: (pickProps: PickProps, options: RegisterOptions) => pickValue(uqApp, pickProps, options),
        ValueTemplate: function ({ value }: { value: any }) {
            if (value === null || value === undefined) {
                return <span className="text-black-50">/</span>;
            }
            return <>{value}</>;
        }
    }
}
