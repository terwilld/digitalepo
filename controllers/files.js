var fs = require('fs');
const path = require('path')






module.exports.initUploadFolders = (baseFolder) => {
    console.log('fuasdf inside init upload folders')
    console.log(baseFolder)
    console.log(process.cwd())
    if (!fs.existsSync(baseFolder)) {
        fs.mkdirSync(baseFolder);
    }

    if (!fs.existsSync(path.join(baseFolder, 'uploads/'))) {
        fs.mkdirSync(path.join(baseFolder, 'uploads/'));
    }

    if (!fs.existsSync(path.join(baseFolder, 'processed/'))) {
        fs.mkdirSync(path.join(baseFolder, 'processed/'));
    }
    if (!fs.existsSync(path.join(baseFolder, 'audit/'))) {
        fs.mkdirSync(path.join(baseFolder, 'audit/'));
    }

    if (!fs.existsSync(path.join(baseFolder, 'testing/'))) {
        fs.mkdirSync(path.join(baseFolder, 'testing/'));
    }
}