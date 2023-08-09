import { IDView, OpenModal, PickProps } from "tonwa-app";
import { UqApp } from "app/UqApp";
import { BudAtom, BudID } from "app/Biz";
import { selectAtom } from "../PageAtomSelect";
import { EnumAtom } from "uqs/UqDefault";
import { EditBudValue } from "./EditBudValue";

export function pickValueForBudID(uqApp: UqApp, budID: BudID): EditBudValue {
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
