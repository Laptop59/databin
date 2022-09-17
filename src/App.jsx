import React from 'react';

import Toolbox from './Toolbox';
import Ribbon from './Ribbon';
import Structure from './Structure';
import Dialog from './Dialog';
import FileInput from './FileInput';
import ErrorBoundary from './ErrorBoundary';

import {SaveFile, SelectFile, LoadFile} from './SaveLoad';
import { FormattedMessage, createIntl, createIntlCache } from 'react-intl';

// React throws an error if we don't include this:
//
/* global BigInt */

const Messages = {
    OK: <FormattedMessage id="databin.buttons.ok" defaultMessage="OK" description="Button that represents OK."/>,
    ADD_TAG: <FormattedMessage id="databin.buttons.addtag" defaultMessage="Add tag" description="Button that represents adding a tag."/>,
    RENAME: <FormattedMessage id="databin.buttons.rename" defaultMessage="Rename" description="Button that represents renaming."/>,
    EDIT:  <FormattedMessage id="databin.buttons.edit" defaultMessage="Edit" description="Button that represents editing the value."/>,
    CHANGE_TAG_TYPE:  <FormattedMessage id="databin.buttons.changetype" defaultMessage="Change type to selected" description="Button that represents changing the type."/>,
    DELETE:  <FormattedMessage id="databin.buttons.delete" defaultMessage="Delete" description="Button that represents deleting."/>,
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dialog: null,
            selected: 'byte',
            title: this.getNewIntl().formatMessage({id: "databin.tags.untitled", defaultMessage: "Untitled", description:"A untitled title."}) || 'Untitled',
            tags: {
                Untitled: {
                    type: 'file',
                    value: {},
                    mini: false,
                }
            },
            prev: {
                selected: 'byte',
                title: 'Untitled',
                tags: {}
            }
        }
    }

    render() {
        if (window.location.href.endsWith('#crash')) throw new Error('The crash was done manually.');
        return (
            <div className="DataBinApp">
                <ErrorBoundary locale={this.props.locale} messages={this.props.messages} isRtL={this.props.locale} cover="DataBinRibbon" onCrash={() => this.tryToSave()}>
                    <Ribbon
                        changeLanguage={x => this.props.changeLanguage(x)}
                        languages={this.props.languages}
                        locale={this.props.locale}
                        onFile={x => {
                            if (x === 'save') {
                                SaveFile(this.state.tags, this.state.title);
                            } else if (x === 'load') {
                                SelectFile();
                            }
                        }}
                    />
                </ErrorBoundary>
                <ErrorBoundary locale={this.props.locale} messages={this.props.messages} isRtL={this.props.locale} cover="DataBinToolbox" onCrash={() => this.tryToSave()}>
                    <Toolbox 
                        selected={this.state.selected}
                        onSelect={type => {
                            this.saveToPrev();
                            if ( (type === 'long' || type === 'long_array') && typeof BigInt === 'undefined') {
                                this.setState({dialog:
                                    <Dialog
                                        text={<FormattedMessage
                                            id="databin.tags.nobigint"
                                            defaultMessage="Your browser does not support BigInt, which is important."
                                            description="A message to tell the user that BigInt is not supported."
                                        />}
                                        buttons={
                                            [Messages.OK]
                                        }
                                        onClick={() => {
                                            this.setState({dialog: null});
                                        }}
                                        noCancel={true}
                                    />
                                });
                                return;
                            }
                            this.setState({selected: type})
                        }}
                    />
                </ErrorBoundary>
                <ErrorBoundary locale={this.props.locale} messages={this.props.messages} isRtL={this.props.locale} cover="DataBinStructure" onCrash={() => this.tryToSave()}>
                    <Structure beforeTry={() => this.saveToPrev()}
                        tags={this.state.tags}
                        clickedTag={(outerkeys, name) =>
                            this.clickedTag(outerkeys, name)
                        }
                        miniTag={(outerkeys, name) =>
                            this.miniTag(outerkeys, name)
                        }
                        locale={this.props.locale}
                        messages={this.props.messages}
                    />
                </ErrorBoundary>
                <ErrorBoundary locale={this.props.locale} messages={this.props.messages} isRtL={this.props.locale} conver="DataBinDialogBG" onCrash={() => this.tryToSave()}>
                    {this.state.dialog}
                </ErrorBoundary>
                <ErrorBoundary locale={this.props.locale} messages={this.props.messages} isRtL={this.props.locale} cover="DataBinInputFileButton" onCrash={() => this.tryToSave()}>
                    <FileInput
                        onChange={async files => {
                            let result = await LoadFile(files);
                            if (!result) return;
                            this.setState({
                                tags: result,
                                title: Object.keys(result)[0]
                            });
                        }}
                    />
                </ErrorBoundary>
            </div>
        );
    }

    clickedTag(outerkeys, name) {
        let tags = this.state.tags;
        let navigated = tags, isInArray = false;
        // Find the actual tags
        for (let i = 0; i < outerkeys.length; i++) {
            // Navigate
            isInArray = isInArray || navigated[outerkeys[i]].type.split("_array").length > 1;
            navigated = navigated[outerkeys[i]].value;
        }
        // Send off navigated[name] and other things.
        this.manageTag(navigated, name, tags, {isInArray});
    }

    miniTag(outerkeys, name) {
        let {tags} = this.state;
        let navigated = tags;
        // Find the actual tags
        for (let i = 0; i < outerkeys.length; i++) {
            // Navigate
            navigated = navigated[outerkeys[i]].value;
        }
        navigated[name].mini = !navigated[name].mini;
        this.setState({tags})
    }

    getNewIntl() {
        const cache = createIntlCache()
        return createIntl({
            locale: this.props.locale || "en-us",
            messages: this.props.messages || {}
        }, cache)
    }

    manageTag(navigated, name, tags, extra) {
        const intl = this.getNewIntl()
        // Do different things depending on the type.
        const n = navigated[name];
        if (n.type === 'file') {
            this.setState({
                dialog: <Dialog
                    text={<FormattedMessage
                        id="databin.tags.editfile"
                        defaultMessage="What do you want to do with this file?"
                        description="A message to ask the user what to do with the file."
                    />}
                    buttons={[
                        Messages.ADD_TAG,
                        Messages.RENAME
                    ]}
                    onClick={
                        i => {
                            this.setState({dialog: null});
                            switch(i) {
                                case 0:
                                    const tagname = prompt(intl.formatMessage({id: "databin.tags.tagname", defaultMessage: "Name of the tag:", description: "Asking the name of the tag."}));
                                    if (!tagname) return;
                                    if (!validString(tagname)) {
                                        alert(intl.formatMessage({id: "databin.tags.nounicode", defaultMessage: "A name of an element cannot contain unicode.", description: "Alert that tells that no element can have unicode names."}));
                                        return;
                                    }
                                    navigated[this.state.title].value[tagname] = {
                                        type: this.state.selected,
                                        value: this.toValidValue(0, this.state.selected, true),
                                        mini: false
                                    };
                                    this.setState(tags);
                                    break;
                                case 1:
                                    let change = prompt(intl.formatMessage({id: "databin.tags.renamefile", defaultMessage: "Change the name of the file:", description: "Input the new name of the file."}), this.state.title);
                                    if (change) {
                                        // Rename the file.
                                        const file = tags[this.state.title];
                                        tags = {};
                                        tags[change] = file;
                                        console.log(tags)
                                        this.setState({ title: change, tags });
                                    }
                                    break;
                                default:
                            }
                        }
                    }
                />
            });
        } else {
            const ntype = n.type.split("_array")[0];
            const {isInArray} = extra;
            const intl = this.getNewIntl();
            this.setState({
                    dialog: <Dialog
                        text={<FormattedMessage
                        id="databin.tags.edittag"
                        defaultMessage="What do you want to do with this tag?"
                        description="A message to ask the user what to do with the tag."
                    />}
                    buttons={[
                        !this.isTagContainer(n.type) && Messages.EDIT,
                        !isInArray && Messages.RENAME,
                        !isInArray && Messages.CHANGE_TAG_TYPE,
                        Messages.DELETE,
                        n.type === 'package' && Messages.ADD_TAG,
                            n.type.split("_array").length > 1 &&
                        <FormattedMessage
                            id="databin.buttons.additem"
                            defaultMessage="Add {item}"
                            description="A button that represents adding an item."
                            values={{item: ntype.toUpperCase()}}
                        />
                    ]}
                    onClick={
                        i => {
                            let todo = this.buttonClicked(i, 1, navigated[name].type);
                            switch (i) {
                                case 0:
                                    if (['string','number'].includes(typeof todo) || Array.isArray(todo)) {
                                        navigated[name].value = this.toValidValue(todo, navigated[name].type);
                                        this.setState(tags);
                                    }
                                break;
                                case 1:
                                    if (typeof todo === 'string') {
                                        const tag = navigated[name];
                                        delete navigated[name];
                                        navigated[todo] = tag;
                                        this.setState(tags);
                                    }
                                break;
                                case 2:
                                    const type = this.state.selected;

                                    if (type === navigated[name].type) return;

                                    navigated[name].type = type;
                                    navigated[name].value = this.toValidValue(navigated[name].value, type);
                                    break;
                                case 3:
                                    const confirmed = window.confirm(intl.formatMessage({id: "databin.tags.deletetag", defaultMessage: "Are you sure you want to delete this tag?", description: "Confirms the user to delete the tag."}));

                                    if (confirmed) delete navigated[name];
                                    break;
                                case 4: 
                                    const tagname = prompt(intl.formatMessage({id: "databin.tags.tagname", defaultMessage: "Name of the tag:", description: "Asking the name of the tag."}));
                                    if (!tagname) return;
                                    if (!validString(tagname)) {
                                        alert(intl.formatMessage({id: "databin.tags.nounicode", defaultMessage: "A name of an element cannot contain unicode.", description: "Alert that tells that no element can have unicode names."}));
                                        return;
                                    }
                                    navigated[name].value[tagname] = {
                                        type: this.state.selected,
                                        value: this.toValidValue(0, this.state.selected, true)
                                    }
                                    this.setState(tags);
                                    break;
                                case 5:
                                    const t = navigated[name].type.split("_array")[0];
                                    const n = Math.min(+prompt(intl.formatMessage({id: "databin.tags.addtags", defaultMessage: "How many tags do you want to add?", description: "Asks the user how many tags to add."})) || 0, 0xFFFFFFFF);
                                    for (let i = 0; i < n; i++) navigated[name].value[""+Object.keys(navigated[name].value).length] = {
                                        type: t,
                                        value: this.toValidValue(0, t, true)
                                    }
                                    break;
                                default:
                            }
                        }
                    }
                />,
            });
            // navigated[name] = {type: 'bit', value: false};
        }
    }

    buttonClicked(i, type, tagtype) {
        const intl = this.getNewIntl();
        this.setState({ dialog: null });
        if (type === 1) {
            if (i === 0) { // If EDIT was clicked
                const newvalue = prompt(intl.formatMessage({id: "databin.tags.newvalue", defaultMessage: "Enter new value for the tag:", description: "Asks the user the new value of the tag."}));
                if (newvalue) {
                    let n;
                    if (tagtype === 'long' || tagtype === 'ulong' || tagtype === 'text')
                        n = newvalue;
                    else if (tagtype === 'time')
                        n = this.toValidValue(newvalue, tagtype, false)
                    else
                        n = Number(newvalue);
                    return n;
                }
            } else if (i === 1) { // Rename
                const newname = prompt(intl.formatMessage({id: "databin.tags.tagname", defaultMessage: "Name of the tag:", description: "Asking the name of the tag."}));
                if (newname && !validString(newname)) {
                    alert(intl.formatMessage({id: "databin.tags.nounicode", defaultMessage: "A name of an element cannot contain unicode.", description: "Alert that tells that no element can have unicode names."}));
                    return;
                }
                if (newname) return newname;
            }
        }
    }

    toValidValue(value, type, newtag) {
        let val;
        if (
            typeof value === 'object' &&
            !Array.isArray(value) &&
            value !== null
        ) {
            return 0;
        }
        if (newtag && type === 'text') return '';
        switch (type) {
            case 'byte':
                val = ((Number(value) + 0x80) & 0xFF) - 0x80;
                break;
            case 'ubyte':
                val = Number(value) & 0xFF;
                break;
            case 'short':
                val = ((Number(value) + 0x8000) & 0xFFFF) - 0x8000;
                break;
            case 'ushort':
                val = Number(value) & 0xFFFF;
                break;
            case 'int':
                // JavaScript manages bitwise operations to 32-bit numbers.
                val = (Number(value) >>> 0) | 0;
                break;
            case 'uint':
                val = Number(value) >>> 0;
                break;
            case 'long':
                if (isNaN(Number(value)) || !isFinite(Number(value))) return 0;
                // Use BigInt
                const b = BigInt("0x8000000000000000");
                return ((BigInt(value) + b) % BigInt("0x10000000000000000")) - b;
            case 'ulong':
                if (isNaN(Number(value)) || !isFinite(Number(value))) return 0;
                // Use BigInt
                return (BigInt(value)) % BigInt("0x10000000000000000");
            case 'double':
                val = Number(value);
                break;
            case 'float':
                // Convert it to a double first.
                val = this.toValidValue(Number(value), 'double', true);
                // Lose precision.
                let buffer = new ArrayBuffer(4); // A float (single) has 4 bytes.
                let view = new Float32Array(buffer);
                view[0] = val;

                return view[0];
            case 'bit':
                val = !!value;
                break;
            case 'text':
                return value + '';
            case 'package':
                return {};
            case 'time':
                if (typeof value === "string" && value.split(":").length === 3 && value.split(".").length >= 2) {
                    // Extract
                    value = value.split('.').join(':').split(':').map(x => !isNaN(+x) ? Math.round(Math.max(+x, 0)) : 0);
                } else if (typeof value === "string" && value.split(":").length >= 3) {
                    // Extract
                    value = value.split(':').map(x => !isNaN(+x) ? Math.round(Math.max(+x, 0)) : 0);
                }
                const time = [Math.min(value[0] || 0, 23), Math.min(value[1] || 0, 59), Math.min(value[2] || 0, 59), Math.min(value[3] || 0, 99)];
                return time;
            default:
                if (type.split("_array").length > 1) return {};
                val = value;
        }
        if (
            (type !== 'double' && type !== 'float' && type !== 'bit')
            && (isNaN(val) || !isFinite(val))
        ) {
            val = 0;
        }
        return val;
    }

    tryToSave() {
        // Try to save to local storage for easy access to restore later.
        localStorage.setItem('DataBin.beforeCrashedState', JSON.stringify({
            tags: this.state.prev.tags,
            title: this.state.prev.title,
            selected: this.state.prev.selected
        }));
    }

    saveToPrev() {
        // Save before a potiential crash.
        this.setState({
            prev: {
                tags: this.state.tags,
                title: this.state.title,
                selected: this.state.selected
            }
        })
    }

    isTagContainer(type) {
        return type === "package" || type.split("_array") > 1
    }
}

function validString(s) {
    return !(/[^\0-\u00ff]/.test(s));
}

export default App;