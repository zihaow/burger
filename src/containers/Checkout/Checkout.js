import React, { Component } from 'react';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';

class Checkout extends Component {
	state = {
		ingredients: {
			salad: 1,
			meat: 1,
			cheese: 1,
			bacon: 1
		}
	}

	checkoutCancelledHanlder = () => {
		this.props.history.goBack();
	}

	checkoutContinuedHanlder = () => {
		this.props.history.replace('/checkout/contact-date');
	}

	render() {
		return (
			<div>
				<CheckoutSummary ingredients={this.state.ingredients} 
								 checkoutCancelled={this.checkoutCancelledHanlder}
								 checkoutContinued={this.checkoutContinuedHanlder}/>
			</div>
		);
	}
}

export default Checkout;