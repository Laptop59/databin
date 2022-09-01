import React from "react";

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

    errorGUI() {
        return (
            <div className={this.props.cover}>
                <div className="DataBinCrash">
                    <div className="DataBinCrashTitle">
                        <h1>Oh No!</h1>
                    </div>
                    <div className="DataBinCrashBody">
                        <p>We are so sorry,</p>
                        <p>but DataBin crashed due to an error.</p>
                        <br/>
                        <button className="DataBinCrashReload" onClick={this.reload}>Reload DataBin</button>
                        <br/>
                        <br/>
                        <p>Technical Error Details:</p>
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