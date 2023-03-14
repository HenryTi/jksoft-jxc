import { useT, FA, BandString, Sep, BandCom, LabelRow, ContainerProps, LabelRowProps } from "tonwa-com";
import { Page, PropEdit, LabelRowEdit } from "tonwa-app";
import { appT, ResApp } from '../../res';
import { useUqApp } from "app/UqApp";
import { Link } from "react-router-dom";
import { pathChangePassword, pathLogout, pathUserQuit } from "./routeMe";
import { useAtom } from "jotai/react";

export function PageEditMe() {
    let uqApp = useUqApp();
    let [user] = useAtom(uqApp.user);
    let t = useT(appT);

    let onValuesChanged = async (values: { name: string; value: any; preValue: any; }) => {
        let { name, value } = values;
        uqApp.setUserProp(name, value);
    }

    let temp: Partial<LabelRowProps> = {
        // LabelContainer,
        labelAlign: 'end',
        MidContainer: function ({ children }: ContainerProps) { return <div className="ms-2">{children}</div> }
    }
    //<BandImage label="头像" name="icon" />
    function Right({ text, onClick }: { text: string, onClick?: () => void }) {
        let cn = 'px-3 py-3';
        if (onClick) cn += ' cursor-pointer';
        return <div className={cn} onClick={onClick}>{text}</div>;
    }
    let tChangePassword = t(ResApp.changePassword);
    return <Page header="个人信息">
        <div>
            <LabelRow {...temp}>
                ok
                <div>content</div>
                <Right text="right"></Right>
            </LabelRow>
            <Sep />
            <LabelRow {...temp}>
                ok1
                <div>content</div>
                <Right text="right"></Right>
            </LabelRow>
            <Sep />
            <LabelRowEdit {...temp} label={"a"} value={1} />
            <Sep />
            <PropEdit className="container" values={user} onValuesChanged={onValuesChanged} labelSize={3} >
                <BandString label="别名" name="nick" placeholder="好的别名更方便记忆" />
                <Sep />
                <BandCom label={tChangePassword} toEdit={pathChangePassword}>
                    <FA className="text-info m-2 align-self-center" name="key" />
                </BandCom>
                <Sep />
                <BandCom label={t(ResApp.userQuit)} toEdit={pathUserQuit}>
                    <FA className="text-info m-2 align-self-center" name="key" />
                </BandCom>
            </PropEdit>
            <Sep />
            <div className="mt-5 w-100 text-center">
                <Link className="btn btn-danger w-100 w-max-20c" to={pathLogout}>
                    <FA name="sign-out" size="lg" /> {t(ResApp.logout)}
                </Link>
            </div>
        </div>
    </Page>;
}
