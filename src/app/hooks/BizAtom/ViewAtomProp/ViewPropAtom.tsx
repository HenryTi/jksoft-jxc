import { IDView, OpenModal, PickProps } from "tonwa-app";
import { UqApp } from "app/UqApp";
import { BudAtom } from "app/Biz";
import { selectAtom } from "../PageAtomSelect";
import { EnumAtom } from "uqs/UqDefault";
import { EditBudValue } from "./EditBudValue";

export function pickValueForBudAtom(uqApp: UqApp, budAtom: BudAtom): EditBudValue {
    let { bizAtom } = budAtom;
    if (bizAtom === undefined) {
        return {
            pickValue: async function (props: PickProps) {
                alert('no atom defined');
                return undefined;
            },
            ValueTemplate: function ({ value }: { value: any }) {
                return <div>no atom defined, need to customize view</div>;
            }
        }
    }
    let { name: atomName } = bizAtom;
    let { uq } = uqApp;
    let gAtom = uqApp.gAtoms[bizAtom.name];
    return {
        pickValue: async function (props: PickProps) {
            let ret = await selectAtom(uqApp, atomName as EnumAtom);
            return ret?.id;
        },
        ValueTemplate: function ({ value }: { value: any }) {
            if (value === null || value === undefined) {
                return <span className="text-black-50">/</span>;
            }
            return <IDView uq={uq} id={Number(value)}
                Template={gAtom.ViewItem} />
        }
    }
}
