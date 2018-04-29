import React from 'react';
import classes from './Spinner.css';

const spinner = () => (
	<div className={classes.Spinner}>
	  <div className={classes.Double_bounce1}></div>
	  <div className={classes.Double_bounce2}></div>
	</div>
);

export default spinner;