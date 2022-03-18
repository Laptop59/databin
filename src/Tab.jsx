import React from "react";
import Select from "react-select";

const options = [
    {value: 'save', label: 'Save'},
    {value: 'load', label: 'Load'}
]

class Tab extends React.Component {
    onSelection(selectedOption, change) {
        const selected = selectedOption.value;
        change(selected);
    }

    render() {
        return (
            <Select
                className="DataBinTab"
                value={null}
                onChange={opt => this.onSelection(opt, this.props.onChange)}
                options={options}
                placeholder={this.props.name}
                isSearchable={false}
                noOptionsMessage={this.props.name}
            />
        );
    }
}

export default Tab;