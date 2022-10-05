const fs = require('fs');

function createFolder(path, newFolder) {
    try {
        if (!fs.existsSync(process.env.PUBLIC_PATH + path + newFolder)) {
            fs.mkdirSync(process.env.PUBLIC_PATH + path + newFolder);
        }
    } catch (err) {
        console.error(err);
        throw new Error('CREATE_FOLDER_FAILED');
    }
}

function saveBase64ImageToFile(path, base64Data) {
    try {
        fs.writeFileSync(process.env.PUBLIC_PATH + path, base64Data, { encoding: 'base64' });
    } catch (err) {
        console.error(err);
        throw new Error('SAVE_IMAGE64_FAILED');
    }
}

function deleteFolder(path) {
    try {
        fs.rmdirSync(process.env.PUBLIC_PATH + path, { recursive: true });
    } catch (err) {
        console.error(err);
        throw new Error('DELETE_FOLDER_FAILED');
    }
}

exports.createFolder = createFolder;
exports.saveBase64ImageToFile = saveBase64ImageToFile;
exports.deleteFolder = deleteFolder;
