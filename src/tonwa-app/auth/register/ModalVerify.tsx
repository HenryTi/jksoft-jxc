import { BandInt, Form } from "tonwa-com";
import { ruleIsRequired } from "tonwa-com";
import { Band, BandContainerContext } from "tonwa-com";
import { Submit } from "tonwa-com";
import { Page } from "../../coms";
import { AuthFormBandTemplate } from "../AuthFormBandTemplate";
import { PasswordParams } from './PasswordParams';

type OnVerify = (verify: string) => Promise<number>;

interface Props {
    passwordParams: PasswordParams;
    onVerify: OnVerify;
    header: string;
}

export function ModalVerify({ passwordParams, onVerify, header }: Props) {
    let { type, account } = passwordParams;

    let onSubmit = async (values: any): Promise<any> => {
        let verify = values['verify'];
        let ret = await onVerify(verify);
        if (ret === 0) {
            return [['verify', '验证码错误']];
        }
    }

    async function onValuesChanged({ name, value }: { name: string; value: any; }, context: BandContainerContext<any>) {
        let field = context.fields['submit'];
        if (field) {
            context.setDisabled('submit', (value as string).length > 0)
        }
    }

    let typeText: string, extra: any;
    switch (type) {
        case 'mobile': typeText = '手机号'; break;
        case 'email':
            typeText = '邮箱';
            extra = <small><span className="text-danger">注意</span>: 有可能误为垃圾邮件，请检查<br /></small>;
            break;
    }
    return <Page header={header}><div className="w-min-20c my-5 py-5 mx-auto">
        <div className="text-center mb-4">
            验证码已经发送到{typeText} <b>{account}</b><br />
            {extra}
        </div>
        <div></div>
        <div className="h-1c" />
        <Form onValuesChanged={onValuesChanged} BandTemplate={AuthFormBandTemplate}>
            <BandInt name="verify" label="验证码" placeholder="请输入验证码"
                maxLength={6} rule={ruleIsRequired} />
            <Band contentContainerClassName='mt-3'>
                <Submit name="submit" onSubmit={onSubmit}>下一步 {'>'}</Submit>
            </Band>
        </Form>
    </div>
    </Page>;
}
