import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import axios from "axios";

const styles = theme => ({
    amount: {
	cursor: 'pointer',
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
    },
    amountLoading: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
	opacity: '50%',
    },
});

class Amount extends Component {

    state = {
	item: '',
	price: 0,
	monetary: true,
	loading: false,
    };

    handleClick() {
	let { monetary, item } = this.state;

	if (!item) {
	    this.setState({ loading: true });

	    axios('/ibis/price/', {
		withCredentials: true,
	    }).then(response => {
		this.setState({
		    item: response.data.item,
		    price: response.data.price,
		    monetary: false,
		    loading: false,
		});
	    }).catch(error => {
		console.log(error);
		console.log(error.response);
	    })
	} else {
	    this.setState({ monetary: !monetary });
	}
    };

    render() {
	let { classes, amount } = this.props;
	let { monetary, item, price, loading } = this.state;

	let dollars = amount > 0 ? amount / 100 : 0.0

	return (
	    <span
	      onClick={() => {!loading && this.handleClick()}}
	      className={loading? classes.amountLoading : classes.amount}
	    >
	      {monetary ? (
		  `$${(dollars).toFixed(2)}`
	      ):(
		  `${Math.round((dollars*100)/price*10)/10} ${item}`
	      )}
	    </span>
	);

    }

};

Amount.propTypes = {
    classes: PropTypes.object.isRequired,
    amount: PropTypes.number.isRequired,
};

export default withStyles(styles)(Amount);
