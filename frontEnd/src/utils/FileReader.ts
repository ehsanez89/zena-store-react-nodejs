export function loadFileBase64(f: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result && !reader.error) {
                resolve(reader.result as string);
            } else {
                reject(reader.error || new Error('Cannot read the file'));
            }
        };
        reader.readAsDataURL(f);
    });
}
