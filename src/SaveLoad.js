import { saveAs } from 'file-saver';
import { tagsToBin, binArrayToTags } from './DataBin';

function SaveFile(tags, name) {
    let blob = new Blob([tagsToBin(tags, name)], { type: "octet/stream" });
    saveAs(blob, `${name}${name.indexOf('.dbin') <= -1 ? '.dbin' : ''}`)
}

function SelectFile() {
    document.getElementById('DataBinInputFileButton').click();
}

function LoadFile(files) {
    return new Promise(resolve => {
        const file = files[0];
        if (!file) return;
        const reader = new FileReader();

        reader.readAsBinaryString(file);

        reader.onloadend = () => {
            resolve(LoadBinFile(reader.result, file.name));
        };
    });
}

function LoadBinFile(data, filename) {
    // Convert this string to an Array.
    let array = [];
    for (let i = 0; i < data.length; i++) {
        array.push(data.charCodeAt(i));
    }

    try {
        return binArrayToTags(array, filename);
    } catch (e) {
        alert('Could not import file: ' + e.message);
        return;
    }
}

export { SaveFile, SelectFile, LoadFile };