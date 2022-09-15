import App from './App'
import { IntlProvider } from 'react-intl';
import React from 'react';

const langDir = "./lang/";

/**
 * Languages:\
 * `id`: ID of the language. {string}\
 * `name`: Name of the language IN that language. {string}\
 * `isRtl`: If the language is right to left {boolean}
 * @type {Array<Object.<string, (string|boolean)>>}
 */
const languages = {
    "en-us": {
        name: "English",
        isRtL: false
    }
};

function localeSet() {
    let defaultLocale = "en-us";

    return defaultLocale;
}

async function getMessages(locale) {
    if (languages.hasOwnProperty(locale)) return import(langDir + locale + ".json");

    return import(langDir + "en-us.json");
}

function getIfRtL(locale) {
    let lang = languages[locale];
    return lang ? lang.isRtL : false;
}

class AppWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locale: localeSet(),
            messages: {}
        }
    }

    componentDidMount() {
        this.updateMessages();
    }

    async updateMessages() {
        this.setState({
            messages: await getMessages(this.state.locale)
        })
    }

    changeLanguage(l) {
        console.warn("Changed language to " + l)
        this.setState({
            locale: l
        });
        this.updateMessages();
    }

    render() {
        return (
            <IntlProvider locale={this.state.locale} messages={this.state.messages} isRtL={getIfRtL(this.state.locale)}>
                <App
                    changeLanguage={l => this.changeLanguage(l)}
                    languages={languages}
                    locale={this.state.locale}
                    messages={this.state.messages}
                />
            </IntlProvider>
        );
    }
}

export default AppWrapper;