import { IDView, PickProps, UqAppBase } from "tonwa-app";
import { BudID } from "app/Biz";
import { EditBudValue } from "./model";
import { RegisterOptions } from "react-hook-form";
import { UqApp } from "app/UqApp";

export function pickBudID(uqApp: UqApp, budID: BudID, options: RegisterOptions): EditBudValue {
    let { ID } = budID;
    if (ID === undefined) {
        return {
            pickValue: async function (uqApp: UqAppBase, props: PickProps, options: RegisterOptions) {
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
        pickValue: async function (uqApp: UqAppBase, props: PickProps, options: RegisterOptions) {
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
