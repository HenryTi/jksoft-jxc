import { pickValue } from "tonwa-app";
import { BudInt } from "app/Biz";
import { EditBudValue } from "./model";
import { RegisterOptions } from "react-hook-form";

export function pickBudInt(bud: BudInt, options: RegisterOptions): EditBudValue {
    return {
        pickValue,
        ValueTemplate: function ({ value }: { value: any }) {
            if (value === null || value === undefined) {
                return <span className="text-black-50">/</span>;
            }
            return <>{value}</>;
        }
    }
}
