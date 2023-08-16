import { RegisterOptions } from "react-hook-form";
import { PickProps, UqAppBase, pickValue } from "tonwa-app";
import { BudInt } from "app/Biz";
import { EditBudValue } from "./model";

export function pickBudInt(uqApp: UqAppBase, bud: BudInt, options: RegisterOptions): EditBudValue {
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
