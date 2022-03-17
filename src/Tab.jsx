import React from "react";
import Select from "react-select";

const options = [
    {value: 'save', label: 'Save'},
    {value: 'load', label: 'Load'}
]

class Tab extends React.Component {
    onSelection(selectedOption) {
        const selected = selectedOption.value;

        alert(selected);
    }

    render() {
        return (
            <Select
                className="DataBinTab"
                value={null}
                onChange={this.onSelection}
                options={options}
                placeholder={this.props.name}
                isSearchable={false}
                noOptionsMessage={this.props.name}
            />
        );
    }
}

export default Tab;