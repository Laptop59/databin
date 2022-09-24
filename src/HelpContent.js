const c = {
    Tags: {
        Standard: {
            Bit: docAt('bit'),
            Byte: docAt('byte'),
            Short: docAt('short'),
            Integer: docAt('int'),
            Long: docAt('long'),
            Double: docAt('double'),
            Float: docAt('float'),
            Text: docAt('text'),
            Package: docAt('package'),
            UByte: docAt('ubyte'),
            UShort: docAt('ushort'),
            UInteger: docAt('uint'),
            ULong: docAt('ulong'),
            $INFO: docAt('standard')
        },
        Arrays: docAt('arrays'),
        Misc$DOT: {
            Time: docAt('time'),
            $INFO: docAt('miscellaneous')
        },
        $INFO: docAt('tags')
    },
    File: {
        Save: docAt('save'),
        Load: docAt('load'),
        $INFO: docAt('file')
    },
    Components: {
        Ribbon: docAt('ribbon'),
        Toolbox: docAt('toolbox'),
        Structure: docAt('structure'),
        $INFO: docAt('components')
    }
}

async function docAt(md) {
    return {$INFO: get(require('./docs/'+md+".md")), $ITEM: true};
}

async function get(md) {
    return fetch(md)
            .then(response => response.text())
            .catch();
}

export default c;