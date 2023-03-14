import { FunctionComponent, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BandString } from 'tonwa-com';
import { Band, BandContainerContext } from 'tonwa-com';
import { Form, Submit } from 'tonwa-com';
import { Page } from '../../coms';
import { getSender } from '../tools';
import { ModalVerify } from './ModalVerify';
import { PasswordParams } from './PasswordParams';
import { ModalForgetPassword, ModalRegisterPassword } from './ModalPassword';
import { useModal, useUqAppBase } from '../../UqAppBase';
import { AuthFormBandTemplate } from '../AuthFormBandTemplate';

interface StartProps {
    privacy: JSX.Element;
    loginTop: JSX.Element;
}

interface Props extends StartProps {
    header: string;
    accountLable: string;
    ModalPassword: FunctionComponent<{ passwordParams: PasswordParams; header: string; }>;
    accountError: (isExists: number) => string;
    sendVerifyOem: string;          // 发送短信或者邮件的时候的厂家标志
}

function PageRegisterBase({ header, accountLable, privacy, loginTop, ModalPassword, accountError, sendVerifyOem }: Props) {
    const { openModal } = useModal();
    const navigate = useNavigate();
    const uqApp = useUqAppBase();
    const { userApi, pathLogin } = uqApp;
    let { current: passwordParams } = useRef({ toLogin } as PasswordParams);
    function toLogin() {
        uqApp.closeAllModal();
        navigate(pathLogin);
    }
    async function onValuesChanged({ name, value }: { name: string; value: any; }, context: BandContainerContext<any>) {
        let field = context.fields['submit'];
        if (field) {
            context.setDisabled('submit', (value as string).length < 6)
        }
    }
    let onSubmit = async (values: any): Promise<any> => {
        let user = 'user';
        let value = values[user];
        let sender = getSender(value);
        if (sender === undefined) {
            return [undefined, [user, '必须是手机号或邮箱']];
        }
        let type: 'mobile' | 'email' = sender.type as 'mobile' | 'email';
        if (type === 'mobile') {
            if (value.length !== 11 || value[0] !== '1') {
                return [undefined, [user, '请输入正确的手机号']];
            }
        }
        let account = value;
        let ret = await userApi.isExists(account);
        let error = accountError(ret);
        if (error !== undefined) return error;
        ret = await userApi.sendVerify(account, type, sendVerifyOem);
        // ret值  0: 60秒之内发送过，1: 新发送,  2: 超过60秒，已经发送
        passwordParams.account = account;
        passwordParams.type = type;
        /*
        if (ret) {
            return [undefined, [user, ret]];
        }
        */

        async function onVerify(verify: string) {
            passwordParams.verify = verify;
            let ret = await userApi.checkVerify(account, verify);
            if (ret === 0) return ret;
            openModal(<ModalPassword header={header} passwordParams={passwordParams} />);
        }
        openModal(<ModalVerify header={header} onVerify={onVerify} passwordParams={passwordParams} />);
    }
    /*
        let onEnter = async (name: string, context: Context): Promise<string> => {
            if (name === 'user') {
                return await onSubmit('verify', context);
            }
        }
    */

    return <Page auth={false} header={header} footer={privacy}>
        <div className="d-grid">
            <div className="d-grid w-20c my-5 py-5"
                style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                {loginTop ?? <div className="text-center p-3 fs-5 text-primary">注册</div>}
                <div className="h-3c" />
                <Form BandTemplate={AuthFormBandTemplate} onValuesChanged={onValuesChanged}>
                    <BandString name="user" label={accountLable} placeholder="手机号或邮箱" />
                    <Band contentContainerClassName='mt-3'>
                        <Submit name="submit" onSubmit={onSubmit} disabled={true}>发送验证码</Submit>
                    </Band>
                </Form>
                <div className="text-center py-3">
                    <Link className="btn btn-link text-primary" to={'/login'}>已有账号，直接登录</Link>
                </div>
            </div>
        </div>
    </Page>;
}

export function PageRegister(props: StartProps) {
    let { loginTop, privacy } = props;
    let accountError = (isExists: number) => {
        if (isExists > 0) return '已经被注册使用了';
    }
    return <PageRegisterBase header="注册账号" accountLable="账号"
        ModalPassword={ModalRegisterPassword}
        accountError={accountError} sendVerifyOem={undefined}
        loginTop={loginTop} privacy={privacy} />;
}

export function PageForget(props: StartProps) {
    let { loginTop, privacy } = props;
    let accountError = (isExists: number) => {
        if (isExists === 0) return '请输入正确的账号';
    }
    return <PageRegisterBase header="密码找回" accountLable="账号"
        ModalPassword={ModalForgetPassword}
        accountError={accountError} sendVerifyOem={undefined}
        loginTop={loginTop} privacy={privacy} />;
}
