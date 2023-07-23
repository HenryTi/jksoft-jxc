import { Link } from "react-router-dom";
import { Page } from "tonwa-app";
import { Sep } from "tonwa-com";
import { pathSumGroup } from "./PageSumGroup";
import { pathSumFormula } from "./PageSumFormula";
import React from "react";

export const pathAchieve = 'admin-achieve';

export function PageAchieve() {
    let arr: { path: string; caption: string; }[] = [
        { path: pathSumFormula, caption: '公式' },
        { path: pathSumGroup, caption: '小组成员' },
    ]
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
    </Page>;
}
