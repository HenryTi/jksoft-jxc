import { ReactNode } from "react";
import { useUqAppBase } from "../UqAppBase";

interface Props {
    children: ReactNode;
    role: string[] | string;
}

export function DivRole({ children, role }: Props): JSX.Element {
    let uqApp = useUqAppBase();
    if (uqApp.hasRole(role) === true) return <>{children}</>;
    return null;
}
