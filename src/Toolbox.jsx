import React from 'react';

// Import icons
import ByteIcon from './images/ByteIcon.jsx';
import BitIcon from './images/Bit0Icon.jsx';
import DoubleIcon from './images/DoubleIcon.jsx';
import PackageIcon from './images/PackageIcon.jsx';
import IntIcon from './images/IntIcon.jsx';
import ShortIcon from './images/ShortIcon.jsx';
import LongIcon from './images/LongIcon.jsx';
import TextIcon from './images/TextIcon.jsx';
import FloatIcon from './images/FloatIcon.jsx';

const types = {
    bit: <BitIcon/>,
    byte: <ByteIcon/>,
    short: <ShortIcon/>,
    int: <IntIcon/>,
    long: <LongIcon/>,
    double: <DoubleIcon/>,
    float: <FloatIcon/>,
    text: <TextIcon/>,
    package: <PackageIcon/>,
};

class Toolbox extends React.Component {
    render() {
        return (
            <div className="DataBinToolbox">
                {this.renderTypes()}
            </div>
        )
    }

    renderTypes() {
        let buttons = [];
        const names = Object.keys(types);

        for (let i = 0; i < names.length; i++) {
            buttons.push(
                <button
                    onClick={() => this.props.onSelect(names[i])}
                    className={this.props.selected === names[i] ? 'selectedType' : ''}
                    key={i}
                >
                    {types[names[i]]}
                </button>
            );
        }

        return buttons;
    }
}

export default Toolbox;