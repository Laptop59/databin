// React throws an error if we don't include this:
//
/* global BigInt64Array */
/* global BigUint64Array */

/**
 * The maximum tag type in number
 * @readonly
 * @type {number}
 */
const max_tag_type = 0x18;

/**
 * Enum for tag types
 * @readonly
 * @enum {string}
 */
const tag_types = {
    0x00: "bit",
    0x01: "bit",
    0x02: "byte",
    0x03: "short",
    0x04: "int",
    0x05: "long",
    0x06: "double",
    0x07: "float",
    0x08: "text",
    0x09: "ubyte",
    0x0a: "ushort",
    0x0b: "uint",
    0x0c: "ulong",
    0x0d: "package",
    0x0e: "byte_array",
    0x0f: "short_array",
    0x10: "int_array",
    0x11: "long_array",
    0x12: "float_array",
    0x13: "double_array",
    0x14: "time",
    0x15: "ubyte_array",
    0x16: "ushort_array",
    0x17: "uint_array",
    0x18: "ulong_array",
}

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
    let name, pointer, last_pointers = [], result = {}, packages = [], i, type, o;

    function convertTo(type, hex) {
        let n, buffer, view, longview, doubleview, floatview, tag, str;
        switch (type) {
            case 'bit': return {type: 'bit', value: !!hex};
            case 'byte':
                n = array[++i];
                return {type: 'byte', value: n >= 0x80 ? n - 0x100 : n};
            case 'short': 
                n = (array[++i] << 8) | array[++i];
                return {type: 'short', value: n >= 0x8000 ? n - 0x10000 : n};
            case 'int': 
                n = (array[++i] << 24) | (array[++i] << 16) | (array[++i] << 8) | array[++i];
                return {type: 'int', value: n >= 0x80000000 ? n - 0x100000000 : n};
            case 'long':
                buffer = new ArrayBuffer(8);
                view = new Uint8Array(buffer); // Create a view.
                longview = new BigInt64Array(buffer);
                for (let j = 7; j >= 0; j--) view[j] = array[++i];
                // Fetch the long.
                return {type: 'long', value: longview[0]};
            case 'double':
                buffer = new ArrayBuffer(8);
                view = new Uint8Array(buffer); // Create a view.
                doubleview = new Float64Array(buffer);
                for (let j = 7; j >= 0; j--) view[j] = array[++i];
                // Fetch the double.
                return {type: 'double', value: doubleview[0]};
            case 'float':
                buffer = new ArrayBuffer(4);
                view = new Uint8Array(buffer); // Create a view.
                floatview = new Float32Array(buffer);
                for (let j = 3; j >= 0; j--) view[j] = array[++i];
                // Fetch the float.
                return {type: 'float', value: floatview[0]};
            case 'package':
                n = (array[++i] << 24) | (array[++i] << 16) | (array[++i] << 8) | array[++i];
                pointer[name] = {
                    type: 'package',
                    value: {}
                };
                last_pointers.push(pointer);
                pointer = pointer[name].value;
                packages.push(n);
                return false;
            case 'text':
                str = "";
                while (array[++i]) {
                    str += String.fromCharCode(array[i]);
                }
                return {type: 'text', value: str};  
            case 'ubyte':
                n = array[++i];
                return {type: 'ubyte', value: n};
            case 'ushort': 
                n = (array[++i] << 8) | array[++i];
                return {type: 'ushort', value: n};
            case 'uint': 
                n = (array[++i] << 24) | (array[++i] << 16) | (array[++i] << 8) | array[++i];
                return {type: 'uint', value: n + (n < 0 ? 0x100000000 : 0x000000000)};
            case 'ulong':
                buffer = new ArrayBuffer(8);
                view = new Uint8Array(buffer); // Create a view.
                longview = new BigUint64Array(buffer);
                for (let j = 7; j >= 0; j--) view[j] = array[++i];
                // Fetch the long.
                return {type: 'ulong', value: longview[0]};
            case 'time':
                n = Math.min((array[++i] << 16) | (array[++i] << 8) | array[++i], 8639999);
                return {type: 'time', value: [Math.floor(n / 360000), Math.floor(n / 6000) % 60, Math.floor(n / 100) % 60, n % 100]};
            default:
                if (type.split('_array').length > 1) {
                    n = (array[++i] << 24) | (array[++i] << 16) | (array[++i] << 8) | array[++i];
                    tag = {
                        type,
                        value: {}
                    };
                    for (let j = 0; j < n; j++) {
                        tag.value[''+j] = convertTo(type.split('_array')[0]);
                    }
                    return tag;
                }
        }
    }

    if (array[0] === 0x04 &&
        array[1] === 0x02) {
        // Attempt to import.
        pointer = result;

        for (i = 2; i < array.length; i++) {
            type = array[i];
            name = ''
            i++;
            i = extractName(i);
            o = convertTo(fromTagNum(type), type);
            if (o) {
                pointer[name] = o;
            }
            console.log(pointer);
            if (type > max_tag_type) throw new Error('Type `' + type + '` doesn\'t exist.');
            
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
    return [toTagNum(tag.type, tag.value)].concat(
        encodeToName(name).concat(
            tagToBinValue(tag)
        )
    );
}

function toTagNum(type, value) {
    if (type === 'bit') return +value;
    for (let i in tag_types) {
        if (i < 0x02) continue;
        if (tag_types[i] === type) return i;
    }
    throw new Error(`Tag type ${type} doesn't exist.`)
}

function fromTagNum(hex) {
    return tag_types[hex];
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
        case 'bit': return [];
        case 'byte':
        case 'ubyte': return [tag.value & 0xFF];
        case 'short':
        case 'ushort': return shortToBytes(tag.value);
        case 'int':
        case 'uint': return intToBytes(tag.value);
        case 'long':
        case 'ulong': return longToBytes(tag.value);
        case 'double': return doubleToByteArray(tag.value);
        case 'package': return packageToBytes(tag.value);
        case 'text': return encodeToName(tag.value);
        case 'float': return floatToByteArray(tag.value);
        case 'byte_array':
        case 'short_array':
        case 'int_array':
        case 'long_array':
        case 'float_array':
        case 'double_array':
        case 'ubyte_array':
        case 'ushort_array':
        case 'uint_array':
        case 'ulong_array': return arrayToBytes(tag.value, tag.type.split('_array')[0]);
        case 'time': return convertToTime(tag.value);
        default:
            throw new TypeError('Could not encode tag with type `' + tag.type + '`.');
    }
}

function convertToTime(value) {
    /* Simple formula:
     * T = 360000h + 6000m + 100s + c
     * where
     * h = hours
     * m = minutes
     * s = seconds
     * c = centiseconds (1/100 of a second)
     */
    const num = value[0] * 360000 + value[1] * 6000 + value[2] * 100 + value[3];
    return [(num >> 16) & 0xFF, (num >> 8) & 0xFF, num & 0xFF];
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

function arrayToBytes(value, type) {
    // Array:
    // <items> <item1> <item2> ... <itemN>
    const items = Object.values(value);
    // Length
    let result = intToBytes(items.length);
    // Add tags
    for (let i = 0; i < items.length; i++) {
        result = result.concat(tagToBinValue(items[i]));
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