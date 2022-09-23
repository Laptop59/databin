import React from "react";
import HelpContent from "./HelpContent";
import Markdown from "markdown-to-jsx";
import Image from "./images/Image"

class Help extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            closed: [],
            selected: ".DataBin",
            error: null,
            _: null
        }
    }

    componentDidCatch(error) {
        console.warn("Error in help: ", error)
        this.setState({error})
    }

    render() {
        const content = this.state.error ? (
            <div>
                <p>Something went wrong. Close and reopen to get help again.</p>
            </div>
        ) : (
            <>
                <div className="DataBinHelpStructure">
                    {this.renderStructure(HelpContent, true)}</div>
                        <div className="DataBinHelpContented">
                            {!(!this.state.selected || this.state.selected === ".DataBin") ? this.state._ || "Loading" : <>
                                <h1>Welcome to Help!</h1>
                                <p>Select a help topic to get information.</p>
                            </>}
            </div>
            </>
        );
        return (
            <div className="DataBinHelpWrapper">
                <div className="DataBinHelp">
                    <div className="DataBinHelpRibbon">
                        <span>Help</span>
                        <button onClick={() => this.props.closeHelp()}>×</button>
                    </div>
                    <div className="DataBinHelpContent">
                        {content}
                    </div>
                </div>
            </div>
        );
    }

    async getContent(full) {
        const keys = full.split(".").slice(2);
        let item = HelpContent;
        for (let key of keys) {
            item = item[key]
        }
        if (typeof item.$INFO === "object") {
            item = item.$INFO;
        }
        if (typeof item.then !== "function") {
            this.setState({_: "No information :("});
            return;
        } else {
            console.log("Fetching " + full)
            this.setState({_: "Loading..."});
        }
        item.then(
            i => i.$INFO.then(j => this.setState({_: <Markdown style={{lineHeight: '25px', scrollY: 'auto'}} options={{
                overrides: {
                    Image: {
                        component: Image
                    },
                    Link: {
                        component: (props) => <this.Link props={props} help={this}/>
                    }
                }
            }}>{j}</Markdown>}))
        );
    }

    Link(props) {
        if (!props.props.href || !props.help) return props.children;
        return <button className="linked" onClick={() => {
            props.help.goto.call(props.help, props.props.href);
        }}><u>{props.props.children}</u></button>
    }

    renderStructure(s, first, top = "") {
        let structure = [], inside, opener, minus, ii = 0;
        if (first) {
            s = {DataBin: s};
        }
        if (typeof s !== "object" || s.$ITEM)
            return;
        else
            for (let i in s) {
                if (i === "$INFO") continue; // Exclude information like $INFO
                let full = top + "." + i;
                inside = this.renderStructure(s[i], false, full);
                minus = !this.state.closed.includes(full);
                opener = <>
                    {this.getSVG((Object.keys(s).length <= ++ii + 1 ? "end" : "") + "inside")}
                    {(typeof s[i] === "object" && !s[i].$ITEM && !(typeof s[i].then === "function")) && <button className="help_switcher" onClick={() => {
                        let {closed} = this.state;
                        if (closed.includes(full)) {
                            closed.splice(closed.indexOf(full), 1);
                        } else {
                            closed.push(full);
                        }
                        this.setState({closed})
                    }}>{this.getSVG(!minus ? "minus" : "plus")}</button>}
                </>
                structure.push(<>
                    <button className="help_name" style={this.state.selected === full ? {
                        backgroundColor: "#224658"
                    } : {}}
                    onClick={() => {
                        this.goto(full);
                    }}>{!first && opener} <div className="help_s_text">{i}</div></button>
                    <br/>
                    {
                        first ? inside : <div className="help_indent">{!minus && inside}</div>
                    }
                </>)
            }
        return structure;
    }

    goto(full) {
        this.getContent(full);
        this.setState({selected: full});
    }

    getSVG(type) {
        switch (type) {
            case "endinside":
                return (
                    <svg version="1.1" width="25" height="25" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 25 14.5 v 12 h 12 h -12 v -12" strokeWidth="2" stroke="white"/>
                    </svg>
                );
            case "inside":
                return (
                    <svg version="1.1" width="25" height="25" viewBox="0 0 35 40" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 25 14.5 v 24 v -12 h 12 h -12 v -12" strokeWidth="2" stroke="white"/>
                    </svg>
                );
            case "plus":
                return (
                    <svg version="1.1" width="25" height="25" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg">
                        <rect x={5} y={5} width={25} height={25} fill="white"></rect>
                        <path d="M 17.5 17.5 h -9 h 9 h 9 h -9 v -9 v 9 v 9 v -9" strokeWidth="4" stroke="#002638"/>
                    </svg>
                );
            case "minus":
                return (
                    <svg version="1.1" width="25" height="25" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg">
                        <rect x={5} y={5} width={25} height={25} fill="white"></rect>
                        <path d="M 17.5 17.5 h -9 h 9 h 9 h -9" strokeWidth="4" stroke="#002638"/>
                    </svg>
                );
            default:
                console.warn("Unknown SVG of type detected: " + type)
                return <></>;
        }
    }
}

export default Help;