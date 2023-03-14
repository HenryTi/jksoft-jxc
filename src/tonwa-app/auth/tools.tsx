const mobileRegex = /^[0-9]*$/;
const emailRegex = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
// /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/

interface Sender {
    type: string;
    caption: string;
    regex: RegExp;
}

const senders: Sender[] = [
    { type: 'mobile', caption: '手机号', regex: mobileRegex },
    { type: 'email', caption: '邮箱', regex: emailRegex }
];

export function getSender(un: string): Sender {
    let sender = senders.find(v => v.regex.test(un) === true);
    return sender;
}