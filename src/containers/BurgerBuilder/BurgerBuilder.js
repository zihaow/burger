import React, { Component } from 'react';
import { connect } from 'react-redux';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as Actions from '../../store/actions/index';

export class BurgerBuilder extends Component {
	// constructor(props) {
	// 	 super(props);
	// 	 this.state = {...}
	// }
	
	state = {
		purchasing: false,
	}

	componentDidMount() {
		this.props.onInitIngredients();
		document.addEventListener("keydown", this.escFunction, false);
	}

	updatePurchaseState (currentIngredients) {
		const ingredients = currentIngredients;
		const sum = Object.keys(ingredients)
			.map(ingredientKey => {
				return ingredients[ingredientKey];
			})
			.reduce((sum, el) => {
				return sum + el;
			}, 0);
		return sum > 0;
	}

	purchaseHandler = () => {
    if (this.props.isAuthenticated) {
      this.setState({ purchasing: true }); 
    } else {
      this.props.onSetAuthRedirectPath('./checkout');
      this.props.history.push('/auth');
    }
	}

	purchaseCancelHandler = () => {
		this.setState({ purchasing: false });
	}

	purchaseContinueHandler = () => {
		this.props.onInitPurchased();
		this.props.history.push('/checkout');
	}

	escFunction = (event) => {
		if(event.keyCode === 27) {
			this.setState({ purchasing: false });
		}
	}
  	
  	componentWillUnmount(){
    	document.removeEventListener("keydown", this.escFunction, false);
  	}	

	render () {
		const disabledInfo = { ...this.props.ings };
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0
		}
		let orderSummary = null;
		let burger = this.props.error ? <p>Ingredients can't be loaded</p> : <Spinner />;

		if (this.props.ings) {
			burger = (
				<Aux>
					<Burger ingredients={this.props.ings} />
					<BuildControls 
					ingredientAdded={this.props.onIngredientAdded}
					ingredientRemoved={this.props.onIngredientRemoved}
					disabled={disabledInfo}
					price={this.props.price}
					ordered={this.purchaseHandler}
					purchaseable={this.updatePurchaseState(this.props.ings)}
          isAuth={this.props.isAuthenticated}
					/>
				</Aux>
			);
			orderSummary = <OrderSummary 
							ingredients={this.props.ings} 
							price={this.props.price}
							purchaseCancelled={this.purchaseCancelHandler}
							purchaseContinued={this.purchaseContinueHandler}
						   />;
		}
		return (
			<Aux>
				<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
					{orderSummary}
				</Modal>
				{burger}				
			</Aux>
		);
	}
}

const mapStateToProps = state => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null
	};
}

const mapDispatchToProps = dispatch => {
	return {
		onIngredientAdded: (ingName) => dispatch(Actions.addIngredient(ingName)),
		onIngredientRemoved: (ingName) => dispatch(Actions.removeIngredient(ingName)),
		onInitIngredients: () => dispatch(Actions.initIngredients()),
		onInitPurchased: () => dispatch(Actions.purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(Actions.setAuthRedirectPath(path))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));

