import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';

import CustomMarkdown from '../CustomMarkdown';

const styles = theme => ({
    dialogInner: {
	padding: theme.spacing(2),
    },
    clickable: {
	cursor: 'pointer',
    },
    normalPaperProps: {
	width: '70%',
	margin: theme.spacing(1),
    },
    widePaperProps: {
	width: '90%',
	margin: theme.spacing(1),
    },
});

class Popup extends Component {

    state = {
	opened: false,
    };

    render() {
	let { classes, children, message, wide } = this.props;
	let { opened } = this.state;

	return (
	    <span>
	      <Dialog
		  open={!!opened}
		  onClose={() => this.setState({ opened: false})}
		  PaperProps={{ className: wide ? classes.widePaperProps : classes.normalPaperProps}}
	      >
		<div className={classes.dialogInner}>
		  <CustomMarkdown safe source={message} />
		</div>
	      </Dialog>
	      <span
		  onClick={() => this.setState({ opened: true })}
		  className={classes.clickable}
	      >
		{children}
	      </span>
	    </span>
	);
    };
};

Popup.propTypes = {
    classes: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
};

export default withStyles(styles)(Popup);
