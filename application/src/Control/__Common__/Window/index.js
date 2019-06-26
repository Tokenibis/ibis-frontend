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

    handlePage = (page) => {
	this.setState({ page });
    };

    render(props) {
	return React.cloneElement(this.state.page, { handlePage: this.handlePage })
    };
};

Window.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Window;
