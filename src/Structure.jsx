import React from 'react';

// Import Icons
import ByteIcon from './images/ByteIcon.jsx';
import Bit0Icon from './images/Bit0Icon.jsx';
import Bit1Icon from './images/Bit1Icon.jsx';
import DoubleIcon from './images/DoubleIcon.jsx';
import PackageIcon from './images/PackageIcon.jsx';

class Structure extends React.Component {
    render() {
        return (
            <div className="DataBinStructure">
                <div className="DataBinStructureContent">
                    {this.renderTags(this.props.tags)}
                </div>
            </div>
        );
    }

    renderTags(tags) {
        tags = tags || {};
        const keys = Object.keys(tags);
        let result = [], key;

        for (let i = 0; i < keys.length; i++) {
            key = tags[keys[i]];
            result.push(
                <div className="DataBinStructureTag" key={i}>
                    {this.getIcon(key.type, key.value)}
                    <span className="DataBinStructureTagName">{keys[i]}: {this.getValue(key.type, key.value)}</span>
                    <br/>
                </div>
            );
        }

        return result;
    }

    getIcon(type, value) {
        switch(type) {
            case 'byte':
                return <ByteIcon/>;
            case 'bit':
                return (
                    value ?
                        <Bit1Icon/>
                    :
                        <Bit0Icon/>
                );
            case 'double':
                return <DoubleIcon/>;
            case 'package':
                return <PackageIcon/>;
            default:
                throw new Error('Type `' + type + '` does not have an icon.');
        }
    }

    getValue(type, value) {
        switch(type) {
            case 'bit':
                return value ? '1' : '0';
            case 'package':
                const tags = this.renderTags(value);
                return (
                    <div className="DataBinStructureIndented">
                        {this.renderTags(value)}
                    </div>
                );
            default:
                return value;
        }
    }
}

export default Structure;