import { Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { Page } from "tonwa-app";
import { Sep } from "tonwa-com";
import { gContact } from "./AtomContact";
import { gGoods } from "./AtomGoods";
import React from "react";
import { GAtom } from "app/tool";
import { pathAtomList } from "app/hooks";
import { useUqApp } from "app/UqApp";
import { gPerson } from "./AtomPerson";
import { gSumGroup } from "./AtomSumGroup";

export const pathAtomCenter = 'atom-center';

export function PageAtomCenter() {
    const uqApp = useUqApp();
    let arr: GAtom[] = [gGoods, gContact, gPerson, gSumGroup];
    let gAtoms = arr.map(v => {
        return uqApp.gAtoms[v.name];
    });
    return <Page header="档案中心">
        <Sep sep={3} />
        {gAtoms.map((v, index) => {
            const { name, caption } = v;
            return <React.Fragment key={index}>
                <Link to={`../${pathAtomList(name)}`} className="px-3 py-2 border-bottom align-items-center">
                    {caption}列表
                </Link>
                <Sep />
            </React.Fragment>;
        })}
    </Page>;
}

export const routeAtomCenter = <Route path={pathAtomCenter} element={<PageAtomCenter />} />;
