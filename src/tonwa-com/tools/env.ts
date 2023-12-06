export const env = (function () {
    let lang: string, district: string;
    let language = (navigator.languages && navigator.languages[0])  // Chrome / Firefox
        || navigator.language; // ||   // All browsers
    if (!language) {
        lang = 'zh';
        district = 'CN';
    }
    else {
        let arr = language.split('-');
        lang = arr[0];
        if (arr.length > 1) district = arr[1].toUpperCase();
    }
    let timeZone = -new Date().getTimezoneOffset() / 60;
    const regEx = new RegExp('Android|webOS|iPhone|iPad|' +
        'BlackBerry|Windows Phone|' +
        'Opera Mini|IEMobile|Mobile',
        'i');
    const isMobile = regEx.test(navigator.userAgent);
    const browser = detectBrowser();
    return { lang, district, timeZone, isMobile, browser };
}());

function detectBrowser() {
    let navi = navigator;
    if (!navi) return;
    if ((navi.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) >= 0)
        return 'Opera';
    if (navi.userAgent.indexOf("Chrome") >= 0)
        return 'Chrome';
    if (navi.userAgent.indexOf("Safari") >= 0)
        return 'Safari';
    if (navi.userAgent.indexOf("Firefox") >= 0)
        return 'Firefox';
    if ((navi.userAgent.indexOf("MSIE") >= 0) || (!!(document as any).documentMode === true))
        return 'IE'; //crap
    return 'Unknown';
}
