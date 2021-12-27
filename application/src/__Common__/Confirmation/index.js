import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import CustomMarkdown from '../CustomMarkdown';

const styles = theme => ({
    progress: {
	color: theme.palette.tertiary.main,
	padding: theme.spacing(1.5),
    },
    fadeProgress: {
	opacity: '50%',
    },
    clickable: {
	cursor: 'pointer',
    },
    progressWrapper: {
	textAlign: 'center',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
    },
    dialogPaper: {
	width: '70%',
    },
    dialogPaperPreview: {
	width: '90%',
	margin: theme.spacing(1),
    },
    dialogInner: {
	padding: theme.spacing(2),
	textAlign: 'center',
    },
    message: {
	fontSize: 16,
	paddingLeft: theme.spacing(3),
	paddingRight: theme.spacing(3),
	paddingBottom: theme.spacing(1),
    },
    messageLeft: {
	padding: theme.spacing(2),
	textAlign: 'left',
    },
    buttonsWrapper: {
    },
    dialogButton: {
	margin: theme.spacing(1),
	color: theme.palette.secondary.main,
	borderStyle: 'solid',
	borderWidth: '1px',
	borderColor: theme.palette.secondary.main,
	width: theme.spacing(10),
    },
    preview: {
 	borderStyle: 'solid',
  	borderWidth: '2px',
	textAlign: 'left',
  	borderColor: theme.palette.light.main,
	paddingLeft: theme.spacing(1),
	paddingRight: theme.spacing(1),
	marginBottom: theme.spacing(1),
    },
    previewWrapper: {
	paddingBottom: theme.spacing(2),
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
	this.setState({ opened: false, confirmed: false });
    };
    
    handleClick(e) {
	let { onClick } = this.props;


	this.setState({ confirmed: true });
	try {
	    onClick(e).then(response => {
		this.setState({ opened: false, confirmed: false });
	    }).catch(error => {
		this.setState({ opened: false, confirmed: false });
		console.log(error);
	    });
	} catch (error) {
	    this.setState({ opened: false, confirmed: false });
	    console.log(error);
	}
    };

    render() {
	let {
	    classes,
	    children,
	    autoconfirm,
	    message,
	    progress,
	    preview,
	    disabled,
	    mention,
	} = this.props;

	let { opened, confirmed } = this.state;
	
	if (disabled) {
	    return (
		<span>
		  {children}
		</span>
	    )
	}

	return (
	    <span>
	      {(opened || confirmed) ? (
		  progress ? (
		      <span className={classes.progressWrapper}>
			<CircularProgress size={24} className={classes.progress}/>
		      </span>
		  ):(
		      <span className={classes.fadeProgress}>
			{children}
		      </span>
		  )
	      ):(
		  <span className={classes.clickable} onClick={autoconfirm ? (
		      () => this.handleClick()
		  ):(
		      () => this.handleOpen()
		  )}>
		    {children}
		  </span>
	      )}
	      <Dialog
		  PaperProps={{className: preview ? classes.dialogPaperPreview : classes.dialogPaper}}
		  open={opened}
		  onClose={(e) => this.handleClose()}
	      >
		<div className={classes.dialogInner}>
		  <CustomMarkdown className={
		  (message && message.length > 160) ?
		  classes.messageLeft : classes.message
		  } noLink source={message}/>
		  {preview && (
		      <div className={classes.previewWrapper}>
			<CustomMarkdown
			    className={classes.preview}
			    noClick source={preview()}
			    mention={mention}
			/>
		      </div>
		  )}
		  <div className={classes.buttonsWrapper}>
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
	    </span>
	);
    };
};

export default withStyles(styles)(Confirmation);
