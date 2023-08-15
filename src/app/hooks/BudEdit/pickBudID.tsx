import { IDView, PickProps } from "tonwa-app";
import { UqApp, uqApp } from "app/UqApp";
import { BudID } from "app/Biz";
import { EditBudValue } from "./model";
import { RegisterOptions } from "react-hook-form";

export function pickBudID(budID: BudID, options: RegisterOptions): EditBudValue {
    let { ID } = budID;
    if (ID === undefined) {
        return {
            pickValue: async function (props: PickProps) {
                alert('no ID defined');
                return undefined;
            },
            ValueTemplate: function ({ value }: { value: any }) {
                return <div>no ID defined, need to customize view</div>;
            }
        }
    }
    // let { name: IDName } = ID;
    let { uq } = uqApp;
    return {
        pickValue: async function (props: PickProps) {
            alert('ID select');
            return undefined;
        },
        ValueTemplate: function ({ value }: { value: any }) {
            if (value === null || value === undefined) {
                return <span className="text-black-50">/</span>;
            }
            return <IDView uq={uq} id={Number(value)} />
        }
    }
}
