import React, { ReactNode, Suspense, useMemo, useContext, JSX, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
    pathBase: string;
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
    readonly modalStack = {
        stack: atom([] as [JSX.Element, (value: any | PromiseLike<any>) => void, (result: any) => void][]),
    }
    readonly pageCache: PageCache;
    readonly autoRefresh: AutoRefresh;

    get refreshAction(): () => Promise<void> { return undefined };

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
        this.autoRefresh = new AutoRefresh(this);
    }

    abstract get pathLogin(): string;
    get pathBase(): string {
        let { pathBase } = this.appConfig;
        if (pathBase.startsWith('/') === true) pathBase.substring(1);
        return pathBase;
    }

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
        setAtomValue(this.modalStack.stack, []);
    }
    onModalClose: () => void;

    async logined(user: User) {
        this.net.logoutApis();
        setAtomValue(this.user, user);
        if (user) {
            jwtDecode(user.token);
            this.net.setCenterToken(user.id, user.token);
            this.localData.user.set(user);
            await this.loadOnLogined();
            // let autoRefresh = new AutoRefresh(this, this.refreshAction);
            this.autoRefresh.start();
        }
        else {
            this.net.clearCenterToken();
            this.uqSites = undefined;
            this.localData.user.remove();
            setAtomValue(this.user, undefined);
            document.cookie = '';
            localStorage.clear();
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
        if (this.uqsMan !== undefined) return;
        await this.net.init();
        try {
            let uqsMan = await createUQsMan(this.net, this.appConfig.version, this.uqConfigs, this.uqsSchema);
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

export type OpenModal = <T = any>(element: JSX.Element, onClosed?: (result: any) => void) => Promise<T>;
export const ModalContext = React.createContext(undefined);
export function useModal() {
    const uqApp = useUqAppBase();
    return uqAppModal(uqApp);
}

export interface Modal {
    open: OpenModal;
    close: (result?: any) => void;
}
export function uqAppModal(uqApp: UqAppBase): Modal {
    const { modalStack } = uqApp;
    const { stack: modalStackAtom } = modalStack;
    async function open<T = any>(element: JSX.Element, onClosed?: (result: any) => void): Promise<T> {
        return new Promise<T>(async (resolve, reject) => {
            let modalStack = getAtomValue(modalStackAtom);
            if (React.isValidElement(element) !== true) {
                alert('is not valid element');
                return;
            }
            let modal = <ModalContext.Provider value={true}>
                <Suspense fallback={<PageSpinner />}>
                    {element}
                </Suspense>
            </ModalContext.Provider>;
            setAtomValue(modalStackAtom, [...modalStack, [modal, resolve, onClosed]]);
        })
    }
    function close(result?: any) {
        let modalStack = getAtomValue(modalStackAtom);
        let [, resolve, onClosed] = modalStack.pop();
        setAtomValue(modalStackAtom, [...modalStack]);
        resolve(result);
        onClosed?.(result);
        uqApp.onModalClose?.();
    }
    return { open, close }
}

export const UqAppContext = React.createContext(undefined);
export function useUqAppBase() {
    return useContext<UqAppBase>(UqAppContext);
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // suspense: true,
        },
    },
});

export function ViewUqApp({ createUqApp, children }: { createUqApp: () => UqAppBase; children: ReactNode; }) {
    let uqApp = useMemo(createUqApp, []);
    const [modalStack] = useAtom(uqApp.modalStack.stack);
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
