import { useUqApp } from "app/UqApp";
import { AtomData } from "../../Store";

export function ViewSite({ value }: { value: AtomData }) {
    let { no, ex } = value;
    // return <>{ex ?? '(无名机构)'} &nbsp; <small className="">{no}</small></>;
    return <>{ex ?? '机构' + no}</>;
}

export function ViewCurSite() {
    const uqApp = useUqApp();
    const { uqSites } = uqApp;
    let { userSite } = uqSites;
    return <ViewSite value={userSite} />;
}

export function ViewCurSiteHeader({ caption }: { caption: string; }) {
    return <>{caption} <span className="small ms-4 opacity-75"><ViewCurSite /></span></>;
}
