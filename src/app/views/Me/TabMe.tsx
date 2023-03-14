import { useUqApp } from "app/UqApp";
import { useAtom } from "jotai/react";
import { Link } from "react-router-dom";
import { FA, LMR, Sep, useT } from "tonwa-com";
import { Image, Page } from "tonwa-app";
import { appT, ResApp } from "../../res";
import { pathEditMe } from "./routeMe";

const pathAbout = 'about';

export function TabMe() {
    const t = useT(appT);
    const uqApp = useUqApp();
    const [user] = useAtom(uqApp.user);

    function MeInfo() {
        if (!user) return null;
        let { id, name, nick, icon } = user;
        return <Link to={pathEditMe}>
            <LMR className="py-3 px-3 w-100">
                <Image className="w-3c h-3c me-3" src={icon || '.user-o'} />
                <div>
                    <div>{userSpan(name, nick)}</div>
                    <div className="small"><span className="text-muted">ID:</span> {id > 10000 ? id : String(id + 10000).substring(1)}</div>
                </div>
                <FA className="align-self-end" name="angle-right" />
            </LMR>
        </Link>;
    }

    function AboutLink() {
        return <Link to={pathAbout}>
            <LMR className="w-100 py-3 px-3 align-items-center">
                <FA className="text-info me-3" name="smile-o" fixWidth={true} size="lg" />
                <b className="">{t(ResApp.aboutTheApp)} <small>{t(ResApp.version)} {uqApp.version}</small></b>
                <FA className="align-self-center" name="angle-right" />
            </LMR>
        </Link>;
    }
    const pageMe = <Page header={t(ResApp.me)} back="none">
        <div>
            <MeInfo />
            <Sep />
            <AboutLink />
            <Sep />
        </div>
    </Page>;
    return pageMe;
}




function userSpan(name: string, nick: string): JSX.Element {
    return nick ?
        <><b>{nick} &nbsp; <small className="muted">{name}</small></b></>
        : <b>{name}</b>
}
