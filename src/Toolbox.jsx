import React from 'react';

// Import icons
import ByteIcon from './images/ByteIcon.jsx';
import BitIcon from './images/Bit0Icon.jsx';
import DoubleIcon from './images/DoubleIcon.jsx';
import PackageIcon from './images/PackageIcon.jsx';
import IntIcon from './images/IntIcon.jsx';

const types = {
    bit: <BitIcon/>,
    byte: <ByteIcon/>,
    double: <DoubleIcon/>,
    package: <PackageIcon/>,
    int: <IntIcon/>
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