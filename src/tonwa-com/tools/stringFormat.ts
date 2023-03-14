export function stringFormat(format: string, ...params: string[]) {
    // store arguments in an array
    // let args = arguments;
    // use replace to iterate over the string
    // select the match and check if the related argument is present
    // if yes, replace the match with the argument
    return format.replace(/{([0-9]+)}/g, function (match, index) {
        // check if the argument is present
        let i = Number(match.substring(1, match.length - 1));
        return params[i] ?? '';
    });
};