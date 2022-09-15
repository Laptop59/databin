import React from 'react';

// Import icons
// ------------------- Basic
import ByteIcon from './images/ByteIcon.jsx';
import BitIcon from './images/Bit0Icon.jsx';
import DoubleIcon from './images/DoubleIcon.jsx';
import PackageIcon from './images/PackageIcon.jsx';
import IntIcon from './images/IntIcon.jsx';
import ShortIcon from './images/ShortIcon.jsx';
import LongIcon from './images/LongIcon.jsx';
import TextIcon from './images/TextIcon.jsx';
import FloatIcon from './images/FloatIcon.jsx';
// -------------------
import UByteIcon from './images/UByteIcon.jsx';
import UShortIcon from './images/UShortIcon.jsx';
import UIntIcon from './images/UIntIcon.jsx';
import ULongIcon from './images/ULongIcon.jsx';
// ------------------- Arrays
import ByteArrayIcon from './images/ByteArrayIcon.jsx';
import ShortArrayIcon from './images/ShortArrayIcon.jsx';
import IntArrayIcon from './images/IntArrayIcon.jsx';
import LongArrayIcon from './images/LongArrayIcon.jsx';
import FloatArrayIcon from './images/FloatArrayIcon.jsx';
import DoubleArrayIcon from './images/DoubleArrayIcon.jsx';
// -------------------
import UByteArrayIcon from './images/UByteArrayIcon.jsx';
import UShortArrayIcon from './images/UShortArrayIcon.jsx';
import UIntArrayIcon from './images/UIntArrayIcon.jsx';
import ULongArrayIcon from './images/ULongArrayIcon.jsx';

// Define separator:
/**
 * A constant to tell the difference between a SPACE and a toolbox button.\
 * If it has `SPACE` as the value (technically `false`), it is a space.\
 * If it will EVER be edited to be a different value, it must be primitive.
 * @readonly
 */
const SPACE = false;

/**
 * @returns {JSX.Component} Returns a separator for items.
 */
const ItemSeparator = () => {
    return <div style={{width: '2.5px', height: '30px', margin: "0 5px", display: 'inline-block', backgroundColor: 'rgba(0,0,0,0.4)'}}></div>
}

/**
 * `ToolboxStructure` defines the toolbox of the application.
 * @constant
 * @type {Object.<string, Object.<string, (JSX.Element|boolean|string)>>}
 */
const ToolboxStructure = {
    standard: {
        $COLOR: '#9999ff',
        bit: <BitIcon/>,
        byte: <ByteIcon/>,
        short: <ShortIcon/>,
        int: <IntIcon/>,
        long: <LongIcon/>,
        double: <DoubleIcon/>,
        float: <FloatIcon/>,
        text: <TextIcon/>,
        package: <PackageIcon/>,
        _: SPACE,
        ubyte: <UByteIcon/>,
        ushort: <UShortIcon/>,
        uint: <UIntIcon/>,
        ulong: <ULongIcon/>,
    },

    array: {
        $COLOR: '#ff9999',
        byte_array: <ByteArrayIcon/>,
        short_array: <ShortArrayIcon/>,
        int_array: <IntArrayIcon/>,
        long_array: <LongArrayIcon/>,
        double_array: <DoubleArrayIcon/>,
        float_array: <FloatArrayIcon/>,
        _: SPACE,
        ubyte_array: <UByteArrayIcon/>,
        ushort_array: <UShortArrayIcon/>,
        uint_array: <UIntArrayIcon/>,
        ulong_array: <ULongArrayIcon/>,
    }
}

/*
    How this works:
    Take all categories (only objects) in a array and merge them ;)
*/
const Types = Object.assign({}, ...Object.values(ToolboxStructure));
const Categories = Object.keys(ToolboxStructure);

console.log(Types)

class Toolbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: Categories[0]
        }
    }

    render() {
        return (
            <div className="DataBinToolbox">
                <div className="DataBinToolboxCategories">
                    {this.renderCategories()}
                </div>
                {this.renderTypes()}
            </div>
        )
    }

    renderCategories() {
        let result = [], i = 0;
        for (let category of Categories) {
            const color = ToolboxStructure[category].$COLOR || "black";
            result.push(
                <button
                    key={i++}
                    className={"DataBinToolboxCategory"+(this.state.selected === category ? " selectedType" : "")}
                    style={{
                        backgroundColor: color
                    }}
                    onClick={() => {this.setState({selected: category})}}
                >
                    {category}
                </button>
            )
        }
        return result;
    }

    renderTypes() {
        let buttons = [];
        const names = Object.keys(ToolboxStructure[this.state.selected]);

        for (let i = 0; i < names.length; i++) {
            if (Types[names[i]] === SPACE) {
                buttons.push(<ItemSeparator/>);
                continue;
            } else if (names[i] === '$COLOR') continue;
            buttons.push(
                <button
                    onClick={() => this.props.onSelect(names[i])}
                    className={this.props.selected === names[i] ? 'selectedType' : ''}
                    key={i}
                >
                    {Types[names[i]]}
                </button>
            );
        }

        return buttons;
    }
}

export default Toolbox;
export {
    Types
};