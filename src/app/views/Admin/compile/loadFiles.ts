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
        fr.onloadend = async function (evt: ProgressEvent<FileReader>) {
            resolve(evt.target.result as string);
        }
    });
}
