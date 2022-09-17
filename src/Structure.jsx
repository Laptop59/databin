import React from 'react';

// Import Icons
import Bit0Icon from './images/Bit0Icon.jsx';
import Bit1Icon from './images/Bit1Icon.jsx';
import FileIcon from './images/FileIcon.jsx';
import { Types } from './Toolbox.jsx';
import { FormattedMessage } from 'react-intl';

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
            const [value, contains] = this.getValue(key.mini || false, key.type, key.value, noname ? '' : keys[i], upperkeys);
            let mes = <FormattedMessage
                id="databin.tags.valuetags"
                defaultMessage="{name}: {value}"
                description="For normal tags."
                values={{name: noname ? '' : keys[i], value}}
            />;
            if (contains) mes = value;
            result.push(
                <div className="DataBinStructureTag" key={i}>
                    <button
                        className="DataBinStructureTagIcon"
                        onClick={() => this.props.clickedTag(upperkeys, keys[i])}>
                        {this.getIcon(key.type, key.value)}
                    </button>
                    <span className="DataBinStructureTagName">
                        {mes}
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
                return [value ? '1' : '0', false];
            case 'long':
                return [value.toString(), false];
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
                return [<>
                    {count === 1 ? <FormattedMessage
                        id="databin.tags.singulartags"
                        defaultMessage="{name}: [1 tag]"
                        description="For one-itemed tags."
                        values={{name: name}}
                    /> : <FormattedMessage
                        id="databin.tags.pluraltags"
                        defaultMessage="{name}: [{count} tags]"
                        description="For empty or two or more-itemed tags."
                        values={{name: name, count}}
                    />}
                    &nbsp;<button className="DataBinStructureButton" onClick={() => this.props.miniTag(upperkeys, name)}><div>{'▼▲'[+mini]}</div></button>
                    {!mini && <div className="DataBinStructureIndented">
                        {this.renderTags(value, upperkeys.concat([name]), type.split("_array").length > 1)}
                    </div>}
                </>, true];
            case 'time':
                let str = value.map(x => x.toString().padStart(2, "0"));
                str = `${str[0]}:${str[1]}:${str[2]}.${str[3]}`
                return [str, false]
            default:
                return [value, false];
        }
    }
}

export default Structure;