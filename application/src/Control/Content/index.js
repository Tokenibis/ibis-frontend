import React, { Component } from 'react';

import { BlankVal } from '../Cycler'
import Window from '../__Common__/Window';
import MainBar from '../MainBar';
import Home from '../Home';

class Content extends Component {

    constructor () {
	super();
	this.state = {
	    page: <Home handlePage={this.handlePage}/>,
	    cycle: BlankVal,
	};
    }

    handlePage = (page, cycle) => {
        page && this.setState({ page, cycle });
    }

    render() {
	const { page, cycle } = this.state;

	return (
	    <div>
	      <MainBar
		  cycle={cycle} 
		  handlePage={this.handlePage}
	      />
	      <Window>
		{page}
	      </Window>
	    </div>
	);
    }
};

export default Content;
