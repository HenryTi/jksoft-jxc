import { Link } from "react-router-dom";
import { Page } from "tonwa-app";
import { pathProp } from "./routeSetup";

export function TabSetup() {
    const cmds = [
        { label: '属性', path: pathProp }
    ];
    return <Page header="设置" back="none">
        {cmds.map((v, index) => {
            const { label, path } = v;
            return <Link key={index} to={`../${path}`} className="px-3 py-2 border-bottom align-items-center">
                {label}
            </Link>
        })}
    </Page>;
}
