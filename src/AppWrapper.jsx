import App from './App'
import { IntlProvider } from 'react-intl';
import React from 'react';
import ErrorBoundary from './ErrorBoundary';

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
    },
    "fr": {
        name: "Français",
        isRtL: false
    },
    "ar": {
        name: "اَلْعَرَبِيَّةُ",
        isRtL: true
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
    return lang && lang.isRtL;
}

class AppWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locale: localeSet(),
            messages: {},
            done: false
        }
    }

    componentDidMount() {
        this.updateMessages(true);
    }

    async updateMessages(firstTime, l) {
        this.setState({
            messages: await getMessages(l || this.state.locale)
        })
        if (firstTime) this.setState({done: true})
    }

    async changeLanguage(l) {
        if (l === this.state.locale) return;
        console.warn("Changed language to " + l)
        this.setState({
            locale: l
        });
        await this.updateMessages(null, l);
        document.getElementsByTagName('html')[0].setAttribute("dir", getIfRtL(l) ? "rtl" : "ltr");
    }

    render() {
        return (
            <ErrorBoundary cover="DataBinApp">
                {this.state.done && <IntlProvider locale={this.state.locale} messages={this.state.messages} isRtL={getIfRtL(this.state.locale)}>
                    <ErrorBoundary cover="DataBinApp" locale={this.state.locale} messages={this.state.messages} isRtL={getIfRtL(this.state.locale)}>
                        <App
                            changeLanguage={l => this.changeLanguage(l)}
                            languages={languages}
                            locale={this.state.locale}
                            messages={this.state.messages}
                        />
                    </ErrorBoundary>
                </IntlProvider>}
            </ErrorBoundary>
        );
    }
}

export default AppWrapper;