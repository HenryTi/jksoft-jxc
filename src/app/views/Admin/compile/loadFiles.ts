export async function loadFiles(files: FileList) {
    let fullContent = '';
    for (let file of files) {
        fullContent += await load(file);
    }
    return fullContent;
}

async function load(file: File): Promise<string> {
    return new Promise<string>((resolve) => {
        let fr = new FileReader();
        fr.readAsText(file);
        // let blob = file.slice(0, 1);
        // fr.readAsArrayBuffer(blob);
        fr.onloadstart = async function (evt: ProgressEvent<FileReader>) {
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
