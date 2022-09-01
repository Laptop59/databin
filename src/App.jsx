import React from 'react';
import Toolbox from './Toolbox';
import Ribbon from './Ribbon';
import Structure from './Structure';
import Dialog from './Dialog';
import FileInput from './FileInput';
import ErrorBoundary from './ErrorBoundary';

import {SaveFile, SelectFile, LoadFile} from './SaveLoad';

// React throws an error if we don't include this:
//
/* global BigInt */

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dialog: null,
            selected: 'byte',
            title: 'Untitled',
            tags: {
                Untitled: {
                    type: 'file',
                    value: {}
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
                <ErrorBoundary cover="DataBinRibbon" onCrash={() => this.tryToSave()}>
                    <Ribbon
                        onFile={x => {
                            if (x === 'save') {
                                SaveFile(this.state.tags, this.state.title);
                            } else if (x === 'load') {
                                SelectFile();
                            }
                        }}
                    />
                </ErrorBoundary>
                <ErrorBoundary cover="DataBinToolbox" onCrash={() => this.tryToSave()}>
                    <Toolbox 
                        selected={this.state.selected}
                        onSelect={type => {
                            this.saveToPrev();
                            if (type === 'long' && typeof BigInt === 'undefined') {
                                this.setState({dialog:
                                    <Dialog
                                        text="Your browser does not support BigInt, which is important."
                                        buttons={
                                            ['OK']
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
                <ErrorBoundary cover="DataBinStructure" onCrash={() => this.tryToSave()}>
                    <Structure beforeTry={() => this.saveToPrev()}
                        tags={this.state.tags}
                        clickedTag={(outerkeys, name) =>
                            this.clickedTag(outerkeys, name)
                        }
                    />
                </ErrorBoundary>
                <ErrorBoundary conver="DataBinDialogBG" onCrash={() => this.tryToSave()}>
                    {this.state.dialog}
                </ErrorBoundary>
                <ErrorBoundary cover="DataBinInputFileButton" onCrash={() => this.tryToSave()}>
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
        let navigated = tags;
        // Find the actual tags
        for (let i = 0; i < outerkeys.length; i++) {
            // Navigate
            navigated = navigated[outerkeys[i]].value;
        }
        // Send off navigated[name] and other things.
        this.manageTag(navigated, name, tags);
    }

    manageTag(navigated, name, tags) {
        // Do different things depending on the type.
        if (navigated[name].type === 'file') {
            this.setState({
                dialog: <Dialog
                    text="What do you want to do with the file?"
                    buttons={[
                        "Add Tag",
                        "Rename"
                    ]}
                    onClick={
                        i => {
                            this.setState({dialog: null});
                            if (i === 0) {
                                const tagname = prompt('Name of the tag:');
                                if (!tagname) return;
                                if (!validString(tagname)) {
                                    alert('A name of an element cannot contain unicode.');
                                    return;
                                }
                                navigated[this.state.title].value[tagname] = {
                                    type: this.state.selected,
                                    value: this.toValidValue(0, this.state.selected, true)
                                };
                                this.setState(tags);
                            } else if (i === 1) {
                                let change = prompt('Change the name of the file:', this.state.title);
                                if (change) {
                                    // Rename the file.
                                    const file = tags[this.state.title];
                                    tags = {};
                                    tags[change] = file;
                                    console.log(tags)
                                    this.setState({ title: change, tags });
                                }
                            }
                        }
                    }
                />
            });
        } else {
            this.setState({
                dialog: <Dialog
                    text="What do you want to do with this tag?"
                    buttons={[
                        "Edit",
                        "Rename",
                        "Change Type To Selected",
                        "Delete",
                        navigated[name].type === 'package' && "Add Tag"
                    ]}
                    onClick={
                        i => {
                            let todo = this.buttonClicked(i, 1, navigated[name].type);
                            if ((typeof todo === 'number' || typeof todo === 'string') && i === 0) {
                                navigated[name].value = this.toValidValue(todo, navigated[name].type);
                                this.setState(tags);
                            } else if (typeof todo === 'string' && i === 1) {
                                const tag = navigated[name];
                                delete navigated[name];
                                navigated[todo] = tag;
                                this.setState(tags);
                            } else if (i === 2) {
                                const type = this.state.selected;

                                if (type === navigated[name].type) return;

                                navigated[name].type = type;
                                navigated[name].value = this.toValidValue(navigated[name].value, type);
                            } else if (i === 3) {
                                const confirmed = window.confirm('Are you sure you want to delete this tag?');

                                if (confirmed) delete navigated[name];
                            } else if (i === 4) {
                                const tagname = prompt('Name of the tag:');
                                if (!tagname) return;
                                if (!validString(tagname)) {
                                    alert('A name of an element cannot contain unicode.');
                                    return;
                                }
                                navigated[name].value[tagname] = {
                                    type: this.state.selected,
                                    value: this.toValidValue(0, this.state.selected, true)
                                }
                                this.setState(tags);
                            }
                        }
                    }
                />,
            });
            // navigated[name] = {type: 'bit', value: false};
        }
    }

    buttonClicked(i, type, tagtype) {
        this.setState({ dialog: null });
        if (type === 1) {
            if (i === 0) { // If EDIT was clicked
                const newvalue = prompt('Enter new value for the tag:');
                if (newvalue) {
                    let n;
                    if (tagtype === 'long' || tagtype === 'ulong' || tagtype === 'text')
                        n = newvalue;
                    else
                        n = Number(newvalue);
                    return n;
                }
            } else if (i === 1) { // Rename
                const newname = prompt('Enter new name for the tag:');
                if (newname && !validString(newname)) {
                    alert('A name of an element cannot contain unicode.');
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
                val = ((value + 0x80) & 0xFF) - 0x80;
                break;
            case 'short':
                val = ((value + 0x8000) & 0xFFFF) - 0x8000;
                break;
            case 'int':
                // JavaScript manages bitwise operations to 32-bit numbers.
                val = (value >>> 0) | 0;
                break;
            case 'long':
                if (isNaN(Number(value)) || !isFinite(Number(value))) return 0;
                // Use BigInt
                const b = BigInt("0x8000000000000000");
                return ((BigInt(value) + b) % BigInt("0x10000000000000000")) - b;
            case 'double':
                val = Number(value);
                break;
            case 'float':
                // Convert it to a double first.
                val = this.toValidValue(value, 'double', true);
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
            default:
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
        localStorage.setItem('DataBin.beforeCrashedState', {
            tags: this.state.prev.tags,
            title: this.state.prev.title,
            selected: this.state.prev.selected
        });
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
}

function validString(s) {
    return !(/[^\u0000-\u00ff]/.test(s));
}

export default App;