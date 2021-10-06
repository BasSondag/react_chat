import { combineReducers } from 'redux';
import * as actionTypes from '../actions/types';

const initialState = {
    curentUser: null,
    isLoading: true
}

const user_reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                curentUser: action.payload.currentUser,
                isLoading: false
            }
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    user: user_reducer
});

export default rootReducer;