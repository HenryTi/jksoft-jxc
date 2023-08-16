import { IDView, PickProps, UqAppBase } from "tonwa-app";
import { BudAtom } from "app/Biz";
import { selectAtom } from "../BizAtom/PageAtomSelect";
import { EnumAtom } from "uqs/UqDefault";
import { EditBudValue } from "./model";
import { RegisterOptions } from "react-hook-form";
import { UqApp } from "app/UqApp";

export function pickBudAtom(uqApp: UqApp, budAtom: BudAtom, options: RegisterOptions): EditBudValue {
    let { bizAtom } = budAtom;
    if (bizAtom === undefined) {
        return {
            pickValue: async function (uqApp: UqAppBase, props: PickProps, options: RegisterOptions) {
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
        pickValue: async function (uqApp: UqAppBase, props: PickProps, options: RegisterOptions) {
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
