import React from 'react';

// Import Icons
import Bit0Icon from './images/Bit0Icon.jsx';
import Bit1Icon from './images/Bit1Icon.jsx';
import FileIcon from './images/FileIcon.jsx';
import { Types } from './Toolbox.jsx';

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

    renderTags(tags, upperkeys, noname) {
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
                        {noname ? '' : keys[i] + ": "}{this.getValue(key.mini || false, key.type, key.value, keys[i], upperkeys)}
                    </span>
                    <br/>
                </div>
            );
        }

        return result;
    }

    getIcon(type, value) {
        switch (type) {
            case 'file':
                return <FileIcon />
            case 'bit':
                return (
                    value ?
                        <Bit1Icon />
                        :
                        <Bit0Icon />
                );
            default:
                if (Types[type]) return Types[type];
                throw new Error('Type `' + type + '` does not have an icon.');
        }
    }

    getValue(mini, type, value, name, upperkeys) {
        switch (type) {
            case 'bit':
                return value ? '1' : '0';
            case 'long':
                return value.toString();
            case 'package':
            case 'file':
            case 'byte_array':
            case 'short_array':
            case 'int_array':
            case 'long_array':
            case 'float_array':
            case 'double_array':
            case 'ubyte_array':
            case 'ushort_array':
            case 'uint_array':
            case 'ulong_array':
                const count = Object.keys(value).length;
                return (<>
                    [{count} tag{count !== 1 && "s"}]
                    &nbsp;<button className="DataBinStructureButton" onClick={() => this.props.miniTag(upperkeys, name)}><div>{'▼▲'[+mini]}</div></button>
                    {!mini && <div className="DataBinStructureIndented">
                        {this.renderTags(value, upperkeys.concat([name]), type.split("_array").length > 1)}
                    </div>}
                </>);
            default:
                return value;
        }
    }
}

export default Structure;