import { Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { Page } from "tonwa-app";
import { FA, LMR, Sep } from "tonwa-com";
import { GenContact } from "./AtomContact";
import { GenProduct } from "./AtomProduct";
import { UqApp, useUqApp } from "app/UqApp";
import { GenAtom } from "app/template";
import React from "react";

export const pathAtomCenter = 'atom-center';

export function PageAtomCenter() {
    let uqApp = useUqApp();
    let arr: (new (uqApp: UqApp) => GenAtom)[] = [GenProduct, GenContact];
    let genAtoms: GenAtom[] = arr.map(v => uqApp.objectOf(v));
    return <Page header="档案中心">
        <Sep sep={3} />
        {genAtoms.map((v, index) => {
            const { genAtomNew, genAtomList, caption } = v;
            return <React.Fragment key={index}>
                <Link to={`../${genAtomNew.path}`}>
                    <LMR className="px-3 py-2 border-bottom align-items-center">
                        <FA name="chevron-circle-right" className="me-2 text-secondary" />
                        新建{caption}
                        <span>
                            {10}
                            <FA name="angle-right" className="ms-2" />
                        </span>
                    </LMR>
                </Link>
                <Link to={`../${genAtomList.path}`} className="px-3 py-2 border-bottom align-items-center">
                    {caption}列表
                </Link>
                <Sep sep={3} />
            </React.Fragment>;
        })}
    </Page>;
    /*
    <Link to={`../${genProduct.pathNew}`}>
    <LMR className="px-3 py-2 border-bottom align-items-center">
        <FA name="chevron-circle-right" className="me-2 text-secondary" />
        新建产品
        <span>
            {10}
            <FA name="angle-right" className="ms-2" />
        </span>
    </LMR>
    </Link>
    <Link to={`../${genProduct.pathList}`} className="px-3 py-2 border-bottom align-items-center">
    产品列表
    </Link>
    <Sep sep={3} />
    {cmdContacts.map((v, index) => LinkCmd(v, index))}
    <Link to={`../${pathContactList}`} className="px-3 py-2 border-bottom align-items-center">
    往来单位列表
    </Link>
    */
}

export const routeAtomCenter = <Route path={pathAtomCenter} element={<PageAtomCenter />} />;