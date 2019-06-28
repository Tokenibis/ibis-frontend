/*

   Content is the main entry point for the App post-authentication. It
   is a simple component that render the MainBar and whatever goes
   underneath it, which may be a standalone page (Settings, Accounts,
   etc), or a more complex structure, such as the NavBar and its
   children.

   func handleFrame: Similar to the ubiquitous handleWindow function,
   except that it "breaks out of" any underlying Window and allows the
   ability to declare the state of the MainBar.

*/

import React, { Component } from 'react';

import { BlankVal } from '../Cycler'
import Window from '../__Common__/Window';
import MainBar from '../MainBar';
import Home from '../Home';

class Content extends Component {

    constructor () {
	super();
	this.state = {
	    page: <Home handleFrame={this.handleFrame}/>,
	    cycle: BlankVal,
	    hideHome: true,
	};
    }

    handleFrame = (page, cycle, hideHome) => {
        page && this.setState({ page, cycle, hideHome });
    }

    render() {
	const { page, cycle, hideHome } = this.state;

	return (
	    <div>
	      <MainBar
		  cycle={cycle} 
		  handleFrame={this.handleFrame}
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
