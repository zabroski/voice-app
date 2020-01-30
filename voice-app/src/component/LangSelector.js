import React from 'react';


class LangSelector extends React.Component {

    constructor (props) {
        super();
        this.state={}
    }
    render() {
        return (
            <select>
            <option>English</option>
            <option>Francais</option>
          </select>,
    
          <select className="">
            <option value="united">United State</option>
            <option>Canada</option>
            <option>United State</option>
            <option>Canada</option>
          </select>
        )
    }
}

export default LangSelector;