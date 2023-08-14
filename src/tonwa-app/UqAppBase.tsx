import React, { ReactNode, useContext, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { atom, useAtom } from 'jotai';
import jwtDecode from 'jwt-decode';
import { Spinner, getAtomValue, setAtomValue, useEffectOnce } from 'tonwa-com';
import {
    Guest, LocalDb, NetProps, UqConfig, User, UserApi
    , createUQsMan, Net, UqSites, UserSite, UQsMan, isPromise
} from 'tonwa-uq';
import { uqsProxy } from './uq';
import { AutoRefresh } from './AutoRefresh';
import { LocalData } from './tools';
import { PageCache } from './PageCache';
import { PageSpinner } from './coms';

export interface AppConfig { //extends UqsConfig {
    center: string;
    version: string;        // 版本变化，缓存的uqs才会重载
    loginTop?: JSX.Element;
    oem?: string;               // 用户注册发送验证码的oem厂家，默认同花
    privacy?: string;
    noUnit?: boolean;			// app的运行，不跟unit绑定
    htmlTitle?: string;
    mustLogin?: boolean;
}

export interface AppEnv {
    isDevelopment: boolean;
    testing: boolean;
    unit: number;
}

export interface RoleName {
    role?: string;
    caption: string;
    icon?: string;
    color?: string;
}

export abstract class UqAppBase<UQS = any> {
    private readonly appConfig: AppConfig;
    private readonly uqConfigs: UqConfig[];
    private readonly uqsSchema: { [uq: string]: any; };
    private localData: LocalData;
    readonly net: Net;
    readonly userApi: UserApi;
    readonly version: string;    // version in appConfig;
    readonly mustLogin: boolean;
    readonly refreshTime = atom(Date.now() / 1000);
    readonly user = atom(undefined as User);
    readonly modal = {
        stack: atom([] as [JSX.Element, (value: any | PromiseLike<any>) => void, (result: any) => void][]),
    }
    readonly pageCache: PageCache;

    uqsMan: UQsMan;
    guest: number;
    uqs: UQS;
    uqSites: UqSites;

    constructor(appConfig: AppConfig, uqConfigs: UqConfig[], uqsSchema: { [uq: string]: any; }, appEnv: AppEnv) {
        window.history.scrollRestoration = 'manual';
        this.appConfig = appConfig;
        this.uqConfigs = uqConfigs;
        this.uqsSchema = uqsSchema;
        this.version = appConfig.version;
        this.mustLogin = appConfig.mustLogin !== false;
        const { unit, testing, isDevelopment } = appEnv;
        let props: NetProps = {
            center: appConfig.center,
            isDevelopment,
            unit,
            testing,
            localDb: new LocalStorageDb(),
            createObservableMap: () => new Map(), //new ObservableMap(),
        }
        this.net = new Net(props);
        this.localData = new LocalData(testing);

        this.userApi = this.net.userApi;
        let user = this.localData.user.get();
        setAtomValue(this.user, user);
        this.pageCache = new PageCache();
    }

    abstract get pathLogin(): string;

    protected get defaultUqRoleNames(): { [lang: string]: any } { return undefined }

    protected setSite(site: number) {
        for (let uqMan of this.uqsMan.uqMans) {
            let a = uqMan;
        }
    }

    loginUnit(userSite: UserSite) {
        this.uqSites.loginUnit(userSite);
    }

    logoutUnit() {
        this.uqSites.logoutUnit();
    }
    closeAllModal() {
        setAtomValue(this.modal.stack, []);
    }
    onCloseModal: () => void;

    async logined(user: User) {
        this.net.logoutApis();
        setAtomValue(this.user, user);
        let autoLoader: Promise<any> = undefined;
        let autoRefresh = new AutoRefresh(this, autoLoader);
        if (user) {
            jwtDecode(user.token);
            this.net.setCenterToken(user.id, user.token);
            this.localData.user.set(user);
            await this.loadOnLogined();
        }
        else {
            this.net.clearCenterToken();
            this.uqSites = undefined;
            this.localData.user.remove();
            setAtomValue(this.user, undefined);
            document.cookie = '';
            localStorage.clear();
            autoRefresh.stop();
        }
    }

    restart() {
        document.location.assign('/');
    }

    async setUserProp(propName: string, value: any) {
        await this.userApi.userSetProp(propName, value);
        let user = getAtomValue(this.user);
        let newUser = { ...user };
        (newUser as any)[propName] = value;
        setAtomValue(this.user, newUser);
        this.localData.user.set(newUser);
    }

    saveLocalData() {
        this.localData.saveToLocalStorage();
    }

    protected onLoadUQs() { }

    initErrors: string[];

    async init(): Promise<void> {
        console.log('UqApp.load()');
        await this.net.init();
        console.log('await this.net.init()');
        try {
            let uqsMan = await createUQsMan(this.net, this.appConfig.version, this.uqConfigs, this.uqsSchema);
            console.log('createUQsMan');
            this.uqsMan = uqsMan;
            this.uqs = uqsProxy(uqsMan) as UQS;

            if (this.uqs) {
                this.onLoadUQs();
            }
            let user = getAtomValue(this.user);
            if (!user) {
                let guest: Guest = this.localData.guest.get();
                if (guest === undefined) {
                    guest = await this.net.userApi.guest();
                }
                if (!guest) {
                    throw Error('guest can not be undefined');
                }
                this.net.setCenterToken(0, guest.token);
                this.localData.guest.set(guest);
                await this.loadWithoutLogin();
            }
            else {
                await this.loadWithoutLogin();
                await this.logined(user);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    protected loadWithoutLogin(): Promise<void> {
        return;
    }

    protected loadOnLogined(): Promise<void> {
        return;
    }

    /*
    private readonly objects = new Map<new (uqApp: any) => any, any>();
    objectOf<T, A extends UqAppBase>(constructor: new (uqApp: A) => T) {
        let ret = this.objects.get(constructor) as T;
        if (ret === undefined) {
            ret = new constructor(this as any);
            this.objects.set(constructor, ret);
            this.onObjectBuilt(ret);
        }
        return ret;
    }

    protected onObjectBuilt(object: any) {
    }
    */
}

class LocalStorageDb extends LocalDb {
    getItem(key: string): string {
        return localStorage.getItem(key);
    }
    setItem(key: string, value: string): void {
        localStorage.setItem(key, value);
    }
    removeItem(key: string): void {
        localStorage.removeItem(key);
    }
}

export type OpenModal = <T = any>(element: JSX.Element | (() => Promise<JSX.Element>), onClosed?: (result: any) => void) => Promise<T>;
export const ModalContext = React.createContext(undefined);
export function useModal() {
    const uqApp = useUqAppBase();
    return uqAppModal(uqApp);
}

export function uqAppModal(uqApp: UqAppBase): { openModal: OpenModal; closeModal: (result?: any) => void } {
    const { modal } = uqApp;
    const { stack: modalStackAtom } = modal;
    async function openModal<T = any>(element: (JSX.Element | (() => Promise<JSX.Element>)), onClosed?: (result: any) => void): Promise<T> {
        return new Promise<T>(async (resolve, reject) => {
            let modalStack = getAtomValue(modalStackAtom);
            let el: JSX.Element;
            if (React.isValidElement(element) === true) {
                el = element as JSX.Element;
            }
            else if (typeof element === 'function') {
                let ret = element();
                if (isPromise(ret) === true) {
                    setAtomValue(modalStackAtom, [...modalStack, [<PageSpinner />, undefined, undefined]]);
                    el = await ret;
                    setAtomValue(modalStackAtom, [...modalStack]);
                }
                else {
                    alert('is not a valid () => Promise<JSX.Element>');
                    return;
                }
            }
            else {
                alert('is not valid element');
                return;
            }
            let modal = <ModalContext.Provider value={true}>
                {el}
            </ModalContext.Provider>;
            setAtomValue(modalStackAtom, [...modalStack, [modal, resolve, onClosed]]);
        })
    }
    function closeModal(result?: any) {
        let modalStack = getAtomValue(modalStackAtom);
        let [, resolve, onClosed] = modalStack.pop();
        setAtomValue(modalStackAtom, [...modalStack]);
        resolve(result);
        onClosed?.(result);
        uqApp.onCloseModal?.();
    }
    return { openModal, closeModal }
}


export const UqAppContext = React.createContext(undefined);
export function useUqAppBase() {
    return useContext<UqAppBase>(UqAppContext);
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            suspense: true,
        },
    },
});

export function ViewUqApp({ uqApp, children }: { uqApp: UqAppBase; children: ReactNode; }) {
    const [modalStack] = useAtom(uqApp.modal.stack);
    let [appInited, setAppInited] = useState<boolean>(false);
    useEffectOnce(() => {
        (async function () {
            await uqApp.init();
            setAppInited(true);
        })();
    });
    if (appInited === false) {
        return <div className="p-5 text-center">
            <Spinner className="text-info" />
        </div>;
    }
    if (uqApp.initErrors) {
        return <div>
            <div>uq app start failed. init errors: </div>
            <ul className="text-danger">
                {
                    uqApp.initErrors.map((v: string, index: number) => <li key={index}>{v}</li>)
                }
            </ul>
        </div>;
    }
    let len = modalStack.length;
    let cnMain: string;
    let viewModalStack: any;
    if (len === 0) {
        cnMain = '';
        viewModalStack = null;
    }
    else {
        cnMain = 'd-none';
        viewModalStack = modalStack.map((v, index) => {
            let cn = index < len - 1 ? 'd-none' : '';
            let [el] = v;
            return <React.Fragment key={index}>
                <div className={cn + ' h-100'}>{el}</div>
            </React.Fragment>;
        })
    }

    return <UqAppContext.Provider value={uqApp}>
        <QueryClientProvider client={queryClient}>
            <div className={cnMain + ' h-100'}>{children}</div>
            {viewModalStack}
        </QueryClientProvider>
    </UqAppContext.Provider>;
}
