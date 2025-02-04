export function download(content: string, filename: string, contentType: string) {
    // Create a blob
    let blob = new Blob([content], { type: contentType });
    let url = URL.createObjectURL(blob);

    // Create a link to download it
    let pom = document.createElement('a');
    pom.href = url;
    pom.setAttribute('download', filename);
    pom.click();
}
