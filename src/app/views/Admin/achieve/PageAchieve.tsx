import { Link } from "react-router-dom";
import { Page } from "tonwa-app";
import { Sep } from "tonwa-com";
import { pathSumGroup } from "./PageSumGroup";
import { pathSumFormula } from "./PageSumFormula";
import React from "react";
import { gSubject } from "./AtomSubject";
import { GAtom } from "app/tool";
import { useUqApp } from "app/UqApp";
import { pathAtomList } from "app/hooks";
import { gPersonPost } from "./AtomPersonPost";
import { gGroupPost } from "./AtomGroupPost";

export const pathAchieve = 'admin-achieve';

export function PageAchieve() {
    const uqApp = useUqApp();
    let arr: { path: string; caption: string; }[] = [
        { path: pathSumFormula, caption: '公式' },
        { path: pathSumGroup, caption: '销售小组' },
    ];
    let gs: GAtom[] = [gSubject, gPersonPost, gGroupPost];
    return <Page header="业绩设置">
        <Sep sep={3} />
        {
            arr.map((v, index) => {
                let { path, caption } = v;
                return <React.Fragment key={index}>
                    <Link to={`../${path}`} className="px-3 py-2 border-bottom align-items-center">
                        {caption}
                    </Link>
                    <Sep />
                </React.Fragment>;
            })
        }
        {
            gs.map((v, index) => {
                const { name, caption } = uqApp.gAtoms[v.name];
                return <React.Fragment key={index}>
                    <Link to={`../${pathAtomList(name)}`} className="px-3 py-2 border-bottom align-items-center">
                        {caption}
                    </Link>
                    <Sep />
                </React.Fragment>;
            })
        }
    </Page>;
}
