import { Form } from 'tonwa-com';
import { User } from 'tonwa-uq';
import { BandString, ruleIsRequired } from 'tonwa-com';
import { Submit } from 'tonwa-com';
import { BandPassword } from 'tonwa-com';
import { Band } from 'tonwa-com';
import { FormErrors } from 'tonwa-com';
import { useUqAppBase } from '../UqAppBase';
import { PageForget, PageRegister } from './register/PageRegister';
import { getSender } from './tools';
import { Link, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { pathForget, pathRegister } from './register/ModalPassword';
import { AuthFormBandTemplate } from './AuthFormBandTemplate';
import { Page } from '../coms';

/*
const schema: Schema = [
    { name: 'username', type: 'string', required: true, maxLength: 100 } as StringSchema,
    { name: 'password', type: 'string', required: true, maxLength: 100 } as StringSchema,
    { name: 'login', type: 'submit' },
];
*/

interface Props {
    url?: string;
    withBack?: boolean;
    loginTop?: JSX.Element;
    privacy: JSX.Element;
    callback?: (user: User) => Promise<void>
}

export function Login({ url, withBack, loginTop, privacy, callback }: Props) {
    let uqApp = useUqAppBase();
    let { userApi, guest } = uqApp;
    const navigate = useNavigate();
    let onLogin = async (un: string, pwd: string): Promise<boolean> => {
        let user = await userApi.login({
            user: un,
            pwd: pwd,
            guest,
        });

        if (user === undefined) return false;
        console.log("onLoginSubmit: user=%s pwd:%s", user.name, user.token);
        await uqApp.logined(user);
        await callback?.(user);
        navigate(url ?? '/', { replace: true });
        return true;
    }

    let onSubmit = async (values: any): Promise<string> => {
        let un = values['username'];
        let pwd = values['password'];
        if (pwd === undefined) {
            return 'something wrong, pwd is undefined';
        }
        let ret = await onLogin(un, pwd);
        if (ret === true) return;

        let sender = getSender(un);
        let type: string = sender !== undefined ? sender.caption : '用户名';
        return type + '或密码错！';
    }
    /*
    let onEnter = async (name: string, context: Context): Promise<string> => {
        if (name === 'password') {
            return await onSubmit('login', context);
        }
    }
    */
    let header = withBack === true ? '登录' : false
    function PageIndex() {
        return <Page auth={false} header={header} footer={privacy}>
            <div className="d-flex p-5 flex-column justify-content-center align-items-center">
                <div className="flex-fill" />
                <div className="w-30c">
                    {loginTop ?? <div className="text-center p-3 fs-5 text-primary">登录</div>}
                    <div className="h-2c" />
                    <Form BandTemplate={AuthFormBandTemplate}>
                        <BandString label="登录账号" name="username"
                            placeholder="手机/邮箱/用户名" rule={ruleIsRequired}
                            maxLength={100} />
                        <BandPassword label="密码" name="password"
                            placeholder="密码" rule={ruleIsRequired}
                            maxLength={100} />
                        <Band>
                            <FormErrors />
                        </Band>
                        <Band contentContainerClassName="my-3">
                            <Submit onSubmit={onSubmit}><div className='mx-5'>登录</div></Submit>
                        </Band>
                    </Form>
                    <div className="row">
                        <div className="offset-sm-3">
                            <Link className="btn btn-link" to={pathForget}>忘记密码</Link>
                            <Link className="btn btn-link" to={pathRegister}>注册账号</Link>
                        </div>
                    </div>
                </div>
                <div className="flex-fill" />
                <div className="flex-fill" />
            </div>
        </Page>;
    }
    function OutletLogin() {
        return <Outlet />;
    }
    return <Routes>
        <Route element={<OutletLogin />} >
            <Route index element={<PageIndex />} />
            <Route path={pathForget} element={<PageForget loginTop={loginTop} privacy={privacy} />} />
            <Route path={pathRegister} element={<PageRegister loginTop={loginTop} privacy={privacy} />} />
        </Route>
    </Routes>;
}
