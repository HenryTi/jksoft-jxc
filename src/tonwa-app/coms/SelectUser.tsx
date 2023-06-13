import { useState } from "react";
import { ButtonAsync, MutedSmall, SearchBox, wait } from "tonwa-com";
import { FA } from "tonwa-com";
import { User } from "tonwa-uq";
import { useModal, useUqAppBase } from "../UqAppBase";
import { Image } from "./Image";
import { Page } from "./page";

interface Props {
    header?: string | JSX.Element;
    top?: string | JSX.Element;
}
export function SelectUser({ header, top }: Props) {
    let app = useUqAppBase();
    const { closeModal } = useModal();
    let [user, setUser] = useState<User>(null);
    let onSearch = async (key: string) => {
        let retUser = await app.userApi.userFromName(key);
        setUser(retUser);
    }
    header = header ?? 'Select user';
    let cnBorder = "border rounded-3 bg-white p-5 mx-auto w-min-20c";
    async function onClick() {
        closeModal(user);
    }
    let vContent: any;
    if (user === null) {
        vContent = null;
    }
    else if (!user) {
        vContent = <div className={cnBorder}><FA name="info-o" className="me-3 text-info" /> No user</div>;
    }
    else {
        vContent = <div className={cnBorder}>
            <ViewUser user={user} />
            <div className="text-center mt-5">
                <ButtonAsync className="btn btn-primary" onClick={onClick}>
                    OK
                </ButtonAsync>
            </div>
        </div>;
    }

    return <Page header={header} back="close">
        <div className="p-3 d-flex align-items-center flex-column">
            <div>{top}</div>
            <div className="mx-auto mb-3">
                <SearchBox className="w-min-20c"
                    onFocus={() => setUser(null)}
                    onSearch={onSearch}
                    placeholder="user account" />
            </div>
            {vContent}
        </div>
    </Page>;
}

export function ViewUser({ user }: { user: User; }) {
    let { name, nick, icon } = user;
    return <div className="d-flex">
        <Image src={icon} className="me-4 w-2-5c h-2-5c" />
        <div>
            <div><MutedSmall>Name:</MutedSmall> &nbsp; {name}</div>
            <div><MutedSmall>Nick:</MutedSmall> &nbsp; {nick}</div>
        </div>
    </div>;
}