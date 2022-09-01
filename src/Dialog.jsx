import React from "react";

class Dialog extends React.Component {
    render() {
        return (
            <div className="DataBinDialogBG">
                <div className="DataBinDialog">
                    <div className="DataBinDialogText">
                        <span>{this.props.text}</span>
                    </div>
                    <div className="DataBinDialogButtons">
                        {this.renderButtons(this.props.buttons)}
                    </div>
                </div>
            </div>
        );
    }

    renderButtons(buttons) {
        if (!buttons) return null;

        let result = [];
        for (let i = 0; i < buttons.length; i++) {
            if (!buttons[i]) continue;
            result.push(
                <button
                    onClick={() => this.props.onClick(i)}
                    key={i}
                >{buttons[i]}</button>
            );
        }

        if (!this.props.noCancel) result.push(
            <button
                onClick={() => this.props.onClick(null)}
                key={-1}
            >Cancel</button>
        );

        return result;
    }
}

export default Dialog;