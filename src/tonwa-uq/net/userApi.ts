import { CenterApiBase } from "./uqApi";
import { decodeUserToken, decodeGuestToken, User } from '../tool';

export interface RegisterParameter {
    nick: string,
    user: string,
    pwd: string,
    country: number,
    mobile: number,
    mobileCountry: number,
    email: string,
    verify: string,
};

export class UserApi extends CenterApiBase {
    async login(params: { user: string, pwd: string, guest: number }): Promise<any> {
        let ret = await this.post('user/login', params);
        switch (typeof ret) {
            default: return;
            case 'string': return decodeUserToken(ret);
            case 'object':
                let token = ret.token;
                let user = decodeUserToken(token);
                let { nick, icon } = ret;
                if (nick) user.nick = nick;
                if (icon) user.icon = icon;
                return user;
        }
    }
    async register(params: RegisterParameter): Promise<any> {
        return await this.post('user/register', params);
    }

    async changePassword(param: { orgPassword: string, newPassword: string }) {
        return await this.post('tie/change-password', param);
    }

    async sendVerify(account: string, type: 'mobile' | 'email', oem: string) {
        return await this.post('user/set-verify', { account: account, type: type, oem: oem });
    }

    async checkVerify(account: string, verify: string) {
        return await this.post('user/check-verify', { account: account, verify: verify });
    }

    async isExists(account: string) {
        return await this.get('user/is-exists', { account: account });
    }

    async resetPassword(account: string, password: string, verify: string, type: 'mobile' | 'email'): Promise<any[]> {
        return await this.post('user/reset-password', { account: account, password, verify, type });
    }

    async userSetProp(prop: string, value: any) {
        await this.post('tie/user-set-prop', { prop: prop, value: value });
    }

    async me(): Promise<any> {
        return await this.get('tie/me');
    }

    async user(id: number): Promise<any> {
        return await this.get('tie/user', { id: id });
    }

    async fromKey(key: string): Promise<{ id: number, name: string, nick: string, icon: string }> {
        return await this.get('tie/user-from-key', { key });
    }

    async guest(): Promise<any> {
        let ret = await this.get('guest/', {});
        switch (typeof ret) {
            default: return;
            case 'string': return decodeGuestToken(ret);
            case 'object':
                let guest = decodeGuestToken(ret.token);
                return guest;
        }
    }

    async userQuit(): Promise<void> {
        await this.get('tie/user-ask-quit', {});
    }
    async userAppUnits(app: number): Promise<any[]> {
        return await this.get('tie/user-app-units', { app: app });
    }
    async userFromKey(userName: string): Promise<User> {
        return await this.get('tie/user-from-key', { key: userName });
    }
    async userFromId(userId: number): Promise<any> {
        return await this.get('user/user-name-nick-icon-from-id', { userId: userId });
    }
    async userFromName(userName: string): Promise<User> {
        return await this.get('tie/user-from-key', { key: userName });
    }
    async usersFromEmail(email: string): Promise<any> {
        return await this.get('tie/users-from-email', { email });
    }
    async userFromMobile(mobile: string): Promise<User> {
        return await this.get('tie/users-from-mobile', { mobile });
    }
}
