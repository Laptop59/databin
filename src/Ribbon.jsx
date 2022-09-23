import React from 'react';
import { FormattedMessage } from 'react-intl';
import Tab from './Tab';

class Ribbon extends React.Component {
    render() {
        return (
            <div className="DataBinRibbon">
                <div className="DataBinTitleWrapper">
                    <span className="DataBinTitle">DataBin</span>
                </div>
                <div className="DataBinTabs">
                    <div className="DataBinTabsWrapper">
                        <Tab
                            className="DataBinTabFile"
                            name={<FormattedMessage
                                id="databin.ribbon.file"
                                defaultMessage="File"
                                description="Text for file dropdown."
                            />}
                            items={{
                                save: <FormattedMessage
                                    id="databin.ribbon.save"
                                    defaultMessage="Save"
                                    description="Text for save dropdown."
                                />,
                                load: <FormattedMessage
                                    id="databin.ribbon.load"
                                    defaultMessage="Load"
                                    description="Text for load dropdown."
                                />
                            }}
                            file={true}
                            onChange={op => this.props.onFile(op)}
                        />
                        <Tab
                            className="DataBinTabLang"
                            styles={{float: 'right'}}
                            name={this.props.languages ? (this.props.languages[this.props.locale].name || this.props.locale) : this.props.locale}
                            file={false}
                            items={this.toFriendly(this.props.languages)}
                            onChange={l => this.props.changeLanguage(l)}
                        />
                        <button onClick={() => this.props.openHelp()}>?</button>
                    </div>
                </div>
            </div>
        )
    }

    toFriendly(lang) {
        const keys = Object.keys(lang)
        const names = Object.values(lang).map(x => x.name) || "???";
        const langs = {};
        for (let i = 0; i < names.length; i++) {
            langs[keys[i]] = names[i]
        }
        return langs;
    }
}

export default Ribbon;