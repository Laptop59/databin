import { tagsToBin, binArrayToTags } from '../DataBin';

it('checks output of `tagsToBin`', () => {
    // Tags ==> Bin

    expect(checkTtoB({})).toStrictEqual([0x04, 0x02]);

    expect(checkTtoB({
        A: {
            type: 'byte',
            value: 69
        }
    })).toStrictEqual([0x04, 0x02, 0x02, 65, 0x00, 69]);

    expect(checkTtoB({
        A: {
            type: 'package',
            value: {
                C: {
                    type: 'bit',
                    value: true
                }
            }
        }
    })).toStrictEqual([0x04, 0x02, 0x0d, 65, 0, 0, 0, 0, 1, 0x01, 67, 0]);
});

it('checks output of `binArrayToTags`', () => {
    // Bin ==> Tag

    expect(checkBtoT([0x04, 0x02])).toStrictEqual({});

    expect(checkTtoB({
        A: {
            type: 'byte',
            value: 69
        }
    })).toStrictEqual([0x04, 0x02, 0x02, 65, 0x00, 69]);

    expect(checkBtoT([0x04, 0x02, 0x0d, 65, 0, 0, 0, 0, 1, 0x01, 66, 0])).toStrictEqual({
        A: {
            type: 'package',
            value: {
                B: {
                    type: 'bit',
                    value: true
                }
            }
        }
    });
})

function checkTtoB(obj) {
    return Array.from(
        tagsToBin({
            Test: {
                type: 'file',
                value: obj
            }
        }, "Test")
    );
}

function checkBtoT(array) {
    return binArrayToTags(array, "Test").Test.value
}