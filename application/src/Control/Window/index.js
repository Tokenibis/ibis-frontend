import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Window extends Component {

    constructor(props) {
	super(props);
	this.state = { page: props.children }
    };

    componentWillReceiveProps(props) {
	this.setState({ page: props.children });
    };

    handleWindow = (page) => {
	this.setState({ page });
    };

    render(props) {
	return React.cloneElement(this.state.page, { handleWindow: this.handleWindow })
    };
};

Window.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Window;
