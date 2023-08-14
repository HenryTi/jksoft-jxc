import { UqApp, useUqApp } from "app/UqApp";

export function Permit({ permit, children }: { permit?: string | string[]; children: React.ReactNode; }) {
    let uqApp = useUqApp();
    let show = isPermitted(uqApp, permit);
    /*
    let { uqSites } = uqApp;
    if (uqSites === undefined) return null;
    let { userSite } = uqSites;
    if (userSite === undefined) return null;
    let { permits, isAdmin } = userSite;
    let show = isAdmin;
    if (permit !== undefined) {
        if (typeof permit === 'string') {
            if (permits[permit] === true) {
                show = true;
            }
        }
        else {
            for (let p of permit) {
                if (permits[p] === true) {
                    show = true;
                    break;
                }
            }
        }
    }
    */
    if (show === true) {
        return <>
            {children}
        </>
    };
}

export function isPermitted(uqApp: UqApp, permit?: string | string[]) {
    let { uqSites } = uqApp;
    if (uqSites === undefined) return false;
    let { userSite } = uqSites;
    if (userSite === undefined) return false;
    let { permits, isAdmin } = userSite;
    if (isAdmin === true) return true;
    if (permit !== undefined) {
        if (typeof permit === 'string') {
            if (permits[permit] === true) {
                return true;
            }
        }
        else {
            for (let p of permit) {
                if (permits[p] === true) {
                    return true;
                }
            }
        }
    }
    return false;
}