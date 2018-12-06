import React from 'react';
import Select from 'react-select';

class MeasureSelect extends React.Component {
  handleChange = (done) => {
    return (selectedOption) => {
      // wrapper to allow state change before interacting with parent
      done(selectedOption.value);
    }
  }

  render() {
    return (
      <Select
        value={this.props.options[this.props.selectedOption]}
        onChange={this.handleChange(this.props.handler)}
        options={this.props.options}
        style={{width: 200}}
      />
    );
  }
}

export default MeasureSelect;