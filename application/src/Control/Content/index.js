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
	    hideHome: true,
	};
    }

    handlePage = (page, cycle, hideHome) => {
        page && this.setState({ page, cycle, hideHome });
    }

    render() {
	const { page, cycle, hideHome } = this.state;

	return (
	    <div>
	      <MainBar
		  cycle={cycle} 
		  handlePage={this.handlePage}
	          hideHome={hideHome}
	      />
	      <Window>
		{page}
	      </Window>
	    </div>
	);
    }
};

export default Content;
