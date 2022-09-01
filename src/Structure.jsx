import React from 'react';

// Import Icons
import ByteIcon from './images/ByteIcon.jsx';
import IntIcon from './images/IntIcon.jsx';
import Bit0Icon from './images/Bit0Icon.jsx';
import Bit1Icon from './images/Bit1Icon.jsx';
import DoubleIcon from './images/DoubleIcon.jsx';
import PackageIcon from './images/PackageIcon.jsx';
import FileIcon from './images/FileIcon.jsx';
import ShortIcon from './images/ShortIcon.jsx';
import LongIcon from './images/LongIcon.jsx';
import TextIcon from './images/TextIcon.jsx';
import FloatIcon from './images/FloatIcon.jsx';

class Structure extends React.Component {
    render() {
        return (
            <div className="DataBinStructure">
                <div className="DataBinStructureContent">
                    {this.renderTags(this.props.tags, null)}
                </div>
            </div>
        );
    }

    componentDidMount() {
        // This runs once the rendering is done.
        if (this.props.beforeTry) this.props.beforeTry();
    }

    renderTags(tags, upperkeys) {
        tags = tags || {};
        const keys = Object.keys(tags);
        let result = [], key;
        upperkeys = upperkeys || [];

        for (let i = 0; i < keys.length; i++) {
            // Create a new tag
            key = tags[keys[i]];
            result.push(
                <div className="DataBinStructureTag" key={i}>
                    <button
                        className="DataBinStructureTagIcon"
                        onClick={() => this.props.clickedTag(upperkeys, keys[i])}>
                        {this.getIcon(key.type, key.value)}
                    </button>
                    <span className="DataBinStructureTagName">
                        {keys[i]}: {this.getValue(key.type, key.value, keys[i], upperkeys)}
                    </span>
                    <br/>
                </div>
            );
        }

        return result;
    }

    getIcon(type, value) {
        switch (type) {
            case 'byte':
                return <ByteIcon />;
            case 'bit':
                return (
                    value ?
                        <Bit1Icon />
                        :
                        <Bit0Icon />
                );
            case 'double':
                return <DoubleIcon />;
            case 'package':
                return <PackageIcon />;
            case 'int':
                return <IntIcon />;
            case 'short':
                return <ShortIcon />;
            case 'long':
                return <LongIcon />;
            case 'text':
                return <TextIcon />;
            case 'file':
                return <FileIcon />;
            case 'float':
                return <FloatIcon />;
            default:
                throw new Error('Type `' + type + '` does not have an icon.');
        }
    }

    getValue(type, value, name, upperkeys) {
        switch (type) {
            case 'bit':
                return value ? '1' : '0';
            case 'long':
                return value.toString();
            case 'package':
            case 'file':
                return (
                    <div className="DataBinStructureIndented">
                        {this.renderTags(value, upperkeys.concat([name]))}
                    </div>
                );
            default:
                return value;
        }
    }
}

export default Structure;