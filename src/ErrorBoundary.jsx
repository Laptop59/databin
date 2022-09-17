import React from "react";
import { FormattedMessage, createIntlCache, createIntl } from "react-intl";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: {
                name: "Error",
                message: "None"
            },
        };
    }

    static getDerivedStateFromError(error) {
        // Update the state.
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Unluckily, DataBin crashed because of the following error:\n',
                      error);
        // Try to run the function
        try {
            if (this.state.onCrash) this.state.onCrash();
        } catch(e) {
            console.error('Could not recover lost data: ', e);
        }
    }

    reload() {
        window.location.reload();
    }

    getErrorDetails() {
        const error = this.state.error;

        if (!error || !error.name) return "";

        return (
            "Error Type: " + error.name + "\n" +
            "Error Message: " + (error.message || "None") + "\n" +
            (error.stack ? ("Error Stacktrace: \n--------------------\n" + error.stack) : "")
        );
    }

    errorGUI() {// Create our sorry messages, replacing new lines.
        const cache = createIntlCache()
        const intl = createIntl({
            locale: this.props.locale || "en-us",
            messages: this.props.messages || {}
        }, cache);

        const paragraphs = intl.formatMessage({id: "databin.crash.sorry", defaultMessage: "We are so sorry,\nbut DataBin crashed due to an error.", description: "Sorry message for crash. Paragraphs are separated by newlines `\\n`"});
        const sorry = paragraphs.split("\n").map((str, i, arr) => <p
            key={i}
        >{str}{i + 1 < arr.length && <br/>}</p>)

        return (
            <div className={this.props.cover}>
                <div className="DataBinCrash">
                    <div className="DataBinCrashTitle">
                        <h1><FormattedMessage
                            id="databin.crash.ohno"
                            defaultMessage="Oh no!"
                            description="DataBin crash exclamation."
                        /></h1>
                    </div>
                    <div className="DataBinCrashBody">
                        {sorry}
                        <br/>
                        <button className="DataBinCrashReload" onClick={this.reload}><FormattedMessage
                            id="databin.crash.reload"
                            defaultMessage="Reload DataBin."
                            description="DataBin reload button."
                        /></button>
                        <br/>
                        <br/>
                        <p><FormattedMessage
                            id="databin.crash.details"
                            defaultMessage="Technical Error Details:"
                            description="Databin detail text."
                        /></p>
                        <textarea
                            className="DataBinCrashDetails"
                            readOnly
                            value={this.getErrorDetails()}
                        />
                    </div>
                </div>
            </div>
        );
    }

    render() {
        if (this.state.hasError) {
            return this.errorGUI();
        }
        return this.props.children;
    }
}

export default ErrorBoundary