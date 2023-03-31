import {
    SET_INIT,
    SET_TOKEN,
    REMOVE_TOKEN,
    SET_RANDOM_PRODUCTION,
    SET_PRODUCTION_OF_THE_DAY,
    SET_PRODUCTIONS,
    SET_RATINGS,
    CREATE_PRODUCTION_RATING,
    EDIT_PRODUCTION_RATING,
    REMOVE_PRODUCTION_RATING,
} from '../../constants/index';

export const ProductionReducer = (state, action) => {
    switch (action.type) {
        case SET_INIT:
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user
            };
        case SET_TOKEN:
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user
            };
        case REMOVE_TOKEN:
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return {
                ...state,
                token: '',
                user: null
            };
        case SET_RANDOM_PRODUCTION:
            return {
                ...state,
                randomProduction: action.payload
            };
        case SET_PRODUCTION_OF_THE_DAY:
            return {
                ...state,
                productionOfTheDay: action.payload
            };
        case SET_PRODUCTIONS:
            return {
                ...state,
                productions: action.payload
            };
        case SET_RATINGS:
            return {
                ...state,
                ratings: action.payload
            };
        case CREATE_PRODUCTION_RATING:
            return {
                ...state,
                ratings: action.payload
            };
        case EDIT_PRODUCTION_RATING:
            return {
                ...state,
                ratings: action.payload
            };
        case REMOVE_PRODUCTION_RATING:
            return {
                ...state,
                ratings: action.payload
            };
        default:
            return state;
    }
}