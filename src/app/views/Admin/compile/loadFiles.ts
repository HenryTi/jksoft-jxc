export async function loadFiles(files: FileList, encoding: string) {
    let fullContent = '';
    for (let file of files) {
        fullContent += await load(file, encoding);
    }
    return fullContent;
}

async function load(file: File, encoding: string): Promise<string> {
    return new Promise<string>((resolve) => {
        let fr = new FileReader();
        fr.readAsText(file, encoding);
        // let blob = file.slice(0, 1);
        // fr.readAsArrayBuffer(blob);
        fr.onloadstart = async function (evt: ProgressEvent<FileReader>) {
            // evt.target.
            evt.target.result
            console.log('start');
        };
        fr.onprogress = async function (evt: ProgressEvent<FileReader>) {
            console.log('progress');
        };
        fr.onloadend = async function (evt: ProgressEvent<FileReader>) {
            // let t = await blob.text();
            // console.log('loadend: ' + t);
            resolve(evt.target.result as string);
        }
    });
}
