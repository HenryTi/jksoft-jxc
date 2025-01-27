import { AtomData } from "app/tool";
import { useUqApp } from "app/UqApp";

export function ViewSite({ value }: { value: AtomData }) {
    let { no, ex } = value;
    return <>{ex ?? '(无名机构)'} &nbsp; <small className="">{no}</small></>;
}

export function ViewCurSite() {
    const uqApp = useUqApp();
    const { uqSites } = uqApp;
    let { userSite } = uqSites;
    return <ViewSite value={userSite} />;
}

export function ViewCurSiteHeader({ caption }: { caption: string; }) {
    return <>{caption} - <ViewCurSite /></>;
}