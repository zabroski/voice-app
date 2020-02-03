import React from 'react';

class LangSelector extends React.Component {
    constructor (props) {
        super();
        this.state={
          value:'',
          }
    }
    handleChange = (e) => {
      this.setState(
        {value: e.target.value})  
    }

    render() {
        return (
        <form onChange={this.handleChange}>
          <select value={this.state.value} 
            onChange = {this.handleChange} >
            <option value="en-US">{this.state.language}English</option>
            <option value="fr-FR">{this.state.language}Francais</option>
          </select>
        </form>
        )
    }
}

export default LangSelector;