import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
    progress: {
	color: theme.palette.tertiary.main,
	padding: theme.spacing(1.5),
    },
    progressWrapper: {
	textAlign: 'center',
	display: 'flex',
    },
    dialogInner: {
	padding: theme.spacing(4),
	textAlign: 'center',
    },
    message: {
	display: 'flex',
	color: theme.palette.tertiary.main,
	justifyContent: 'space-between',
	paddingBottom: theme.spacing(2),
    },
    dialogButton: {
	paddingLeft: theme.spacing(6),
	paddingRight: theme.spacing(6),
	marginTop: theme.spacing(1),
	marginBottom: theme.spacing(1),
	marginLeft: theme.spacing(2),
	marginRight: theme.spacing(2),
	color: theme.palette.secondary.main,
	borderStyle: 'solid',
	borderWidth: '1px',
	borderColor: theme.palette.secondary.main,
	width: '80%',
    },
});

class Confirmation extends Component {

    state = {
	opened: false,
	confirmed: false,
    };

    handleOpen() {
	this.setState({ opened: true });
    };

    handleClose() {
	this.setState({ opened: false });
    };
    
    handleClick(e) {
	let { onClick } = this.props;

	this.setState({ confirmed: true });
	onClick(e).then(response => {
	    this.setState({ opened: false, confirmed: false });
	}).catch(error => {
	    console.log(error);
	});
    };

    render() {
	let { classes, children, autoconfirm, message, onClick, disabled } = this.props;
	let { opened, confirmed } = this.state;
	
	if (disabled) {
	    return (
		<div>
		  {children}
		</div>
	    )
	}

	return (
	    <div>
	      {(opened || confirmed) ? (
		  <div className={classes.progressWrapper}>
		    <CircularProgress size={24} className={classes.progress}/>
		  </div>
	      ):(
		  <div onClick={autoconfirm ? (
		      () => this.handleClick()
		  ):(
		      () => this.handleOpen()
		  )}>
		    {children}
		  </div>
	      )}
	      <Dialog
		  open={opened}
		  onClose={(e) => this.handleClose()}
	      >
		<div className={classes.dialogInner}>
		  <div className={classes.message}>
		    <Typography variant="body2">
		      {message}
		    </Typography>
		  </div>
		  <div>
		    {confirmed ? (
			<div className={classes.progressWrapper}>
			  <CircularProgress size={24} className={classes.progress}/>
			</div>
		    ):(
			<div>
			  <Button
			      className={classes.dialogButton}
			      onClick={(e) => this.handleClick(e)}
			    >
			    Yes
			  </Button>
			  <Button
			      className={classes.dialogButton}
			      onClick={() => this.handleClose()}
			    >
			    No
			  </Button>
			</div>
		    )}
		  </div>
		</div>
	      </Dialog>
	    </div>
	);
    };
};

export default withStyles(styles)(Confirmation);
