const c = {
    Tags: {
        Bit: convert('bit'),
        Byte: convert('byte'),
        $INFO: convert('tags')
    }
}

async function convert(md) {
    return {$INFO: get(require('./docs/'+md+".md")), $ITEM: true};
}

async function get(md) {
    return fetch(md)
            .then(response => response.text())
            .catch();
}

export default c;