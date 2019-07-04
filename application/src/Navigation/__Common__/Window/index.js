/*

   Simple container for handling "Windows", which is a internal term
   we are using to denote a section within the technically
   single-page-app that can display one of the "Pages" found in
   src/Pages. Although it is a simple component, it is very important
   to understand its two primary behaviors:
   
   1. Render its given React child component within the Window
   context, leaving "higher-level" components unchanged
   
   2. Add a "handlePage" prop to the child, which is a function that
   the child can itself use to swap in a new page.

*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { IbisConsumer } from '../../../Context';

class Window extends Component {

    constructor(props) {
	super(props);
	this.state = { page: props.children }
    };

    componentWillReceiveProps(props) {
	this.setState({ page: props.children });
    };

    handlePage = (page) => {
	this.setState({ page });
    };

    render(props) {
	return (
	    <IbisConsumer>
	      {context => (
		  React.cloneElement(this.state.page, {
		      handlePage: this.handlePage,
		      context: context,
		  })
	      )}
	    </IbisConsumer> 
	);
    };
};

Window.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Window;
