// React throws an error if we don't include this:
//
/* global BigInt64Array */

function tagsToBin(tags, name) {
    const data = tags[name].value;
    const data_keys = Object.keys(data);
    let bytes = [0x04, 0x02];

    for (let i = 0; i < data_keys.length; i++) {
        let tag = data[data_keys[i]];
        bytes = bytes.concat(tagToBin(tag, data_keys[i]));
    }

    return new Uint8Array(bytes);
}

function binArrayToTags(array, filename) {
    // Check if the header is valid
    let i, type, n, name, pointer, last_pointers = [], result = {}, packages = [],
    buffer, doubleview, longview, view;

    if (array[0] === 0x04 &&
        array[1] === 0x02) {
        // Attempt to import.
        pointer = result;

        for (i = 2; i < array.length; i++) {
            type = array[i];
            name = ''
            i++;
            i = extractName(i);
            switch (type) {
                case 0x00: // Bit (0)
                case 0x01: // Bit (1)
                    pointer[name] = {
                        type: 'bit',
                        value: !!type
                    };
                    break;
                case 0x02: // Byte
                    i++;
                    n = array[i];
                    pointer[name] = {
                        type: 'byte',
                        value: n >= 0x80 ? n - 0x100 : n
                    };
                    break;
                case 0x03: // Short
                    n = 
                        (array[++i] << 8) |
                        array[++i];
                    pointer[name] = {
                        type: 'short',
                        value: n >= 0x8000 ? n - 0x10000 : n
                    };
                    break;
                case 0x04: // Int
                    n =
                        (array[++i] << 24) |
                        (array[++i] << 16) |
                        (array[++i] << 8) |
                        array[++i];

                    pointer[name] = {
                        type: 'int',
                        value: n >= 0x80000000 ? n - 0x100000000 : n
                    };
                    break;
                case 0x05: // Long
                    buffer = new ArrayBuffer(8);
                    view = new Uint8Array(buffer); // Create a view.
                    longview = new BigInt64Array(buffer);

                    for (let j = 7; j >= 0; j--) view[j] = array[++i];

                    // Fetch the long.
                    pointer[name] = {
                        type: 'long',
                        value: longview[0]
                    };
                    break;
                case 0x06: // Double
                    buffer = new ArrayBuffer(8);
                    view = new Uint8Array(buffer); // Create a view.
                    doubleview = new Float64Array(buffer);

                    for (let j = 7; j >= 0; j--) view[j] = array[++i];

                    // Fetch the double.
                    pointer[name] = {
                        type: 'double',
                        value: doubleview[0]
                    };
                    break;
                case 0x07: // Double
                    buffer = new ArrayBuffer(4);
                    view = new Uint8Array(buffer); // Create a view.
                    doubleview = new Float32Array(buffer);

                    for (let j = 3; j >= 0; j--) view[j] = array[++i];

                    // Fetch the float.
                    pointer[name] = {
                        type: 'float',
                        value: doubleview[0]
                    };
                    break;
                case 0x08: // Text
                    let str = "";
                    while (array[++i]) {
                        str += String.fromCharCode(array[i]);
                    }
                    pointer[name] = {
                        type: 'text',
                        value: str
                    };
                    break;
                case 0x0d: // Package
                    n =
                        (array[++i] << 24) |
                        (array[++i] << 16) |
                        (array[++i] << 8)  |
                         array[++i];
                    pointer[name] = {
                        type: 'package',
                        value: {}
                    };
                    last_pointers.push(pointer);
                    pointer = pointer[name].value;
                    packages.push(n);
                    break;
                default:
                    throw new Error('Type `' + type + '` doesn\'t exist.');
            }
            if (packages[packages.length - 1] <= 0) {
                // End package.
                packages.pop();

                pointer = last_pointers.pop();
            }
            if (packages.length > 0) packages[packages.length - 1]--;
        }

        let final = {};
        final[filename] = {
            type: 'file',
            value: result
        };
        return final;
    } else {
        throw new Error('The file is not a DataBin file.');
    }

    function extractName(i) {
        while (array[i]) {
            name += String.fromCharCode(array[i]);
            i++;
        }
        return i;
    }
}

function tagToBin(tag, name) {
    return [toTagNum(tag)].concat(
        encodeToName(name).concat(
            tagToBinValue(tag)
        )
    );
}

function toTagNum(tag) {
    switch (tag.type) {
        case 'bit':
            return tag.value + 0; // 0x00 and 0x01
        case 'byte':
            return 0x02;
        case 'short':
            return 0x03;
        case 'int':
            return 0x04;
        case 'long':
            return 0x05;
        case 'double':
            return 0x06;
        case 'float':
            return 0x07;
        case 'text':
            return 0x08;
        case 'ubyte':
            return 0x09;
        case 'ushort':
            return 0x0a;
        case 'uint':
            return 0x0b;
        case 'ulong':
            return 0x0c;
        case 'package':
            return 0x0d;
        case 'any':
            return 0x0e;
        default:
            return 0xFF;
    }
}

function encodeToName(name) {
    let bytes = [];
    for (let i = 0; i < name.length; i++) {
        // if it is a NULL byte, put a question mark instead.
        bytes.push(name.charCodeAt(i) || 63);
    }
    bytes.push(0);
    return bytes;
}

function tagToBinValue(tag) {
    switch (tag.type) {
        case 'byte': return [tag.value & 0xFF];
        case 'short': return shortToBytes(tag.value)
        case 'int': return intToBytes(tag.value);
        case 'long': return longToBytes(tag.value);
        case 'double': return doubleToByteArray(tag.value);
        case 'package': return packageToBytes(tag.value);
        case 'text': return encodeToName(tag.value);
        case 'float': return floatToByteArray(tag.value);

        default: throw new TypeError('Could not encode tag with type `' + tag.type + '`.');
    }
}

function packageToBytes(value) {
    // Package:
    // <items> <item1> <item2> ... <itemN>
    const keys = Object.keys(value);
    // Add length
    let result = intToBytes(keys.length);
    // Add tags
    for (let i = 0; i < keys.length; i++) {
        result = result.concat(tagToBin(value[keys[i]], keys[i]));
    }
    // Result
    return result;
}

// From https://stackoverflow.com/questions/25942516/double-to-byte-array-conversion-in-javascript
function doubleToByteArray(number) {
    var buffer = new ArrayBuffer(8);         // Doubles are 8 bytes long, or 64 bits
    var longNum = new Float64Array(buffer);

    longNum[0] = number;

    return Array.from(new Int8Array(buffer)).reverse();
}

// Inspired from doubleToByteArray
function floatToByteArray(number) {
    var buffer = new ArrayBuffer(4);         // Doubles are 4 bytes long, or 32 bits
    var longNum = new Float32Array(buffer);

    longNum[0] = number;

    return Array.from(new Int8Array(buffer)).reverse();
}

const intToBytesAB = num => {
    const arr = new ArrayBuffer(4);
    const view = new DataView(arr);
    view.setUint32(0, num, false);
    return arr;
}

const longToBytesAB = num => {
    const arr = new ArrayBuffer(8);
    const view = new DataView(arr);
    view.setBigInt64(0, num, false);
    return arr;
}

const shortToBytesAB = num => {
    const arr = new ArrayBuffer(2);
    const view = new DataView(arr);
    view.setUint16(0, num, false);
    return arr;
}

function intToBytes(int) {
    return Array.from(
        new Uint8Array(
            intToBytesAB(int)
        )
    );
}

function shortToBytes(short) {
    return Array.from(
        new Uint8Array(
            shortToBytesAB(short)
        )
    );
}

function longToBytes(long) {
    return Array.from(
        new Uint8Array(
            longToBytesAB(long)
        )
    );
}

export { tagsToBin, binArrayToTags };