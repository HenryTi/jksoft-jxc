import { FA } from 'tonwa-com';
import { Band } from 'tonwa-com';
import { BandPassword } from 'tonwa-com';
import { Form, Submit } from 'tonwa-com';
import { useModal, useUqAppBase } from '../../UqAppBase';
import { PasswordParams } from './PasswordParams';
import { useRef } from 'react';
import { AuthFormBandTemplate } from '../AuthFormBandTemplate';
import { Page } from '../../coms';

export const pathForget = 'forget';
export const pathRegister = 'register';

interface Props {
    header: string;
    submitCaption: string;
    account: string;
    onPasswordSubmit: (pwd: string) => Promise<string>;
}

interface PasswordContext {
    error?: string;
}
function ModalPasswordBase({ header, submitCaption, account, onPasswordSubmit }: Props) {
    const { openModal } = useModal();
    const context = useRef<PasswordContext>({})

    let onButtonSubmit = async (values: any): Promise<any> => {
        let { pwd, rePwd } = values;
        let error: string;
        if (!pwd || pwd !== rePwd) {
            error = '密码错误，请重新输入密码！';
            return [['pwd', undefined], ['rePwd', undefined], ['pwd', error]];
        }
        else {
            error = await onPasswordSubmit(pwd);
            context.current.error = error;
            if (error !== undefined) {
                openModal(<Page header="注册不成功">
                    <div className="p-5 text-danger">{context.current.error}</div>
                </Page>);
            }
        }
        return error;
    }
    /*
    let onEnter = async (name: string, context: Context): Promise<string> => {
        if (name === 'rePwd') {
            return await onButtonSubmit('submit', context);
        }
    }
    */
    return <Page header={header}>
        <div className="w-min-30c my-5 py-5 mx-auto">
            <div className="h-1c" />
            <Form BandTemplate={AuthFormBandTemplate}>
                <Band label="账号" contentContainerClassName='d-flex align-items-center'><b className='text-primary'>{account}</b></Band>
                <BandPassword name="pwd" label="密码" placeholder="密码" maxLength={100} />
                <BandPassword name="rePwd" label="重复密码" placeholder="重复密码" maxLength={100} />
                <Band contentContainerClassName="mt-3">
                    <Submit onSubmit={onButtonSubmit}>{submitCaption}</Submit>
                </Band>
            </Form>
        </div>
    </Page>;
}

interface RegisterParameter {
    nick: string,
    user: string,
    pwd: string,
    country: number,
    mobile: number,
    mobileCountry: number,
    email: string,
    verify: string,
};

export function ModalRegisterPassword({ passwordParams, header }: { passwordParams: PasswordParams; header: string; }) {
    const { openModal } = useModal();
    let { userApi } = useUqAppBase();
    let { type, account, verify } = passwordParams;
    let onPasswordSubmit = async (pwd: string): Promise<string> => {
        passwordParams.password = pwd;
        let params: RegisterParameter = {
            nick: undefined,
            user: account,
            pwd,
            country: undefined,
            mobile: undefined,
            mobileCountry: undefined,
            email: undefined,
            verify: verify
        }
        switch (type) {
            case 'mobile':
                params.mobile = Number(account);
                params.mobileCountry = 86;
                break;
            case 'email':
                params.email = account;
                break;
        }
        let ret = await userApi.register(params);
        if (ret === 0) {
            openModal(<RegisterSuccess />)
            return;
        }
        let error = regReturn(ret)
        return error;
    }

    function regReturn(registerReturn: number): string {
        let msg: any;
        switch (registerReturn) {
            default: return '服务器发生错误';
            case 4: return '验证码错误';
            case 0: return;
            case 1: msg = '用户名 ' + account; break;
            case 2: msg = '手机号 +' + account; break;
            case 3: msg = '邮箱 ' + account; break;
        }
        return msg + ' 已经被注册过了';
    }

    return <ModalPasswordBase header={header} submitCaption="注册新账号" account={account} onPasswordSubmit={onPasswordSubmit} />;
    function RegisterSuccess() {
        let { account, toLogin } = passwordParams;
        return <div className="container w-min-30c mx-auto">
            <div className="my-5 text-center">
                <div className="py-5">
                    <FA name='check-circle' className="me-2" />
                    账号 <strong className="text-primary">{account} </strong> 注册成功！
                </div>
                <button className="btn btn-success btn-block" type="button" onClick={toLogin}>
                    直接登录
                </button>
            </div>
        </div>;
    }
}

export function ModalForgetPassword({ header, passwordParams }: { passwordParams: PasswordParams; header: string; }) {
    const { openModal, closeModal } = useModal();
    let { userApi } = useUqAppBase();
    let { account, verify, type, toLogin } = passwordParams;
    let onPasswordSubmit = async (pwd: string): Promise<string> => {
        passwordParams.password = pwd;
        let ret = await userApi.resetPassword(account, pwd, verify, type);
        if (ret.length === 0) {
            let err = 'something wrong in reseting password';
            console.log(err);
            throw err;
        }
        closeModal();
        openModal(<ForgetSuccess />)
        return;
    }
    return <ModalPasswordBase header={header} submitCaption="改密码" account={account} onPasswordSubmit={onPasswordSubmit} />;

    function ForgetSuccess() {
        return <div className="container w-min-30c mx-auto">
            <div className="my-5 text-center">
                <div className="py-5 text-success">
                    <FA name='check-circle' className="me-2" />
                    成功修改密码
                </div>
                <button className="btn btn-primary btn-block" onClick={toLogin}>
                    登录账号
                </button>
            </div>
        </div>
    }
}
