import React from "react";
import Select from "react-select";

class Tab extends React.Component {
    onSelection(selectedOption, change) {
        const selected = selectedOption.value;
        change(selected);
    }

    render() {
        return (
            <Select
                className={"DataBinTab " + this.props.className}
                value={this.props.file ? null : "English"}
                onChange={opt => this.onSelection(opt, this.props.onChange)}
                options={Object.keys(this.props.items).map(x => ({value: x, label: this.props.items[x]}))}
                placeholder={this.props.name}
                isSearchable={false}
                noOptionsMessage={this.props.name || "Select"}
            />
        );
    }
}

export default Tab;