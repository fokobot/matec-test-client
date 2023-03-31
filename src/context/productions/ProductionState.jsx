import React, { useEffect, useReducer } from 'react';
import { ProductionContext } from './ProductionContext';
import { ProductionReducer } from './ProductionReducer';
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
    REMOVE_PRODUCTION_RATING
} from '../../constants/index';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const URL = import.meta.env.VITE_API_URL;

export const ProductionState = (props) => {
    const initialState = {
        token: '',
        user: null,
        randomProduction: null,
        productionOfTheDay: null,
        productions: [],
        ratings: []
    };

    const notify = (message) => toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });

    const notifySuccess = (message) => toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });

    const [state, dispatch] = useReducer(ProductionReducer, initialState);

    useEffect(() => {
        let token = localStorage.getItem('token');
        let user = JSON.parse(localStorage.getItem('user'));
        let enterprise = JSON.parse(localStorage.getItem('enterprise'));
        dispatch({
            type: SET_INIT,
            payload: { token, user, enterprise }
        });
    }, []);

    useEffect(() => {
        return () => {
            localStorage.setItem('token', state.token);
            if (state.user) {
                localStorage.setItem('user', JSON.stringify(state.user));
            }
            if (state.enterprise) {
                localStorage.setItem('enterprise', JSON.stringify(state.enterprise));
            }
        }
    }, [state]);

    const setToken = async (data) => {
        try {
            if (data.register) {
                delete data.register.passwordConfirmation;
                let response = await fetch(`${URL}auth/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(data.register)
                });
                if (!response.ok) {
                    throw new Error(tokenData.message);
                }

                data.login = { username: data.register.username, password: data.register.password };
            }
            let response = await fetch(`${URL}auth/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(data.login)
            });
            const tokenData = await response.json();
            if (response.ok) {
                dispatch({
                    type: SET_TOKEN,
                    payload: tokenData
                });
            } else {
                console.log(tokenData)
                throw new Error(tokenData.message);
            }
        } catch (error) {
            notify(error.message);
        }
    }

    const removeToken = async () => {
        dispatch({
            type: REMOVE_TOKEN
        });
    }

    const setRandomProduction = async () => {
        try {
            let response = await fetch(`${URL}production/random`, {
                method: 'GET',
                headers: getHeaders(state)
            });
            const randomProduction = await response.json();
            if (response.ok) {
                dispatch({
                    type: SET_RANDOM_PRODUCTION,
                    payload: randomProduction
                });
            } else {
                throw new Error(randomProduction.message);
            }
        } catch (error) {
            notify(error.message);
        }
    }

    const setProductionOfTheDay = async () => {
        try {
            let response = await fetch(`${URL}production/day`, {
                method: 'GET',
                headers: getHeaders(state)
            });
            const productionOfTheDay = await response.json();
            if (response.ok) {
                dispatch({
                    type: SET_PRODUCTION_OF_THE_DAY,
                    payload: productionOfTheDay
                });
            } else {
                throw new Error(productionOfTheDay.message);
            }
        } catch (error) {
            notify(error.message);
        }
    }

    const updateProductionOfTheDay = async (productionId) => {
        try {
            let response = await fetch(`${URL}production/day/${productionId}`, {
                method: 'PUT',
                headers: getHeaders(state),
                body: JSON.stringify({})
            });
            const production = await response.json();
            if (response.ok) {
                notifySuccess("Se cambió la pelicula del dia con éxito!");
                setProductions({ name: '', genre: [], type: '' }, '');
            } else {
                throw new Error(production.message);
            }
        } catch (error) {
            notify(error.message);
        }
    }

    const setProductions = async (query, order) => {
        try {
            let response = await fetch(`${URL}production?query=${JSON.stringify(query)}&sort=${order}`, {
                method: 'GET',
                headers: getHeaders(state)
            });
            const productions = await response.json();
            if (response.ok) {
                dispatch({
                    type: SET_PRODUCTIONS,
                    payload: productions
                });
            } else {
                throw new Error(productions.message);
            }
        } catch (error) {
            notify(error.message);
        }
    }

    const createProduction = async (data) => {
        try {
            let response = await fetch(`${URL}production`, {
                method: 'POST',
                headers: getHeaders(state),
                body: JSON.stringify(data)
            });
            const production = await response.json();
            if (response.ok) {
                notifySuccess("Producción creada on éxito!");
                setProductions({ name: '', genre: [], type: '' }, '');
            } else {
                throw new Error(production.message);
            }
        } catch (error) {
            notify(error.message);
        }
    }

    const setUserRatings = async () => {
        try {
            let response = await fetch(`${URL}rating/${state.user._id}`, {
                method: 'GET',
                headers: getHeaders(state)
            });
            const ratings = await response.json();
            if (response.ok) {
                dispatch({
                    type: SET_RATINGS,
                    payload: ratings
                });
            } else {
                throw new Error(ratings.message);
            }
        } catch (error) {
            notify(error.message);
        }
    }

    const createProductionRating = async (data) => {
        try {
            let response = await fetch(`${URL}rating`, {
                method: 'POST',
                headers: getHeaders(state),
                body: JSON.stringify(data)
            });
            const rating = await response.json();
            if (response.ok) {
                let newRatings = state.ratings;
                newRatings.push(rating);
                setProductions({ name: '', genre: [], type: '' }, '');
                setProductionOfTheDay();
                dispatch({
                    type: CREATE_PRODUCTION_RATING,
                    payload: newRatings
                });
            } else {
                throw new Error(rating.message);
            }
        } catch (error) {
            notify(error.message);
        }
    }

    const editProductionRating = async (ratingId, data) => {
        try {
            let response = await fetch(`${URL}rating/${ratingId}`, {
                method: 'PATCH',
                headers: getHeaders(state),
                body: JSON.stringify(data)
            });
            const rating = await response.json();
            if (response.ok) {
                let newRatings = state.ratings.filter((rating => rating._id !== ratingId));
                newRatings.push(rating);
                setProductions({ name: '', genre: [], type: '' }, '');
                setProductionOfTheDay();
                dispatch({
                    type: EDIT_PRODUCTION_RATING,
                    payload: newRatings
                });
            } else {
                throw new Error(rating.message);
            }
        } catch (error) {
            notify(error.message);
        }
    }

    const removeProductionRating = async (ratingId) => {
        try {
            let response = await fetch(`${URL}rating/${ratingId}`, {
                method: 'DELETE',
                headers: getHeaders(state)
            });
            const rating = await response.json();
            if (response.ok) {
                let newRatings = state.ratings.filter((rating => rating._id !== ratingId));
                dispatch({
                    type: REMOVE_PRODUCTION_RATING,
                    payload: newRatings
                });
            } else {
                throw new Error(rating.message);
            }
        } catch (error) {
            notify(error.message);
        }
    }

    return (
        <ProductionContext.Provider
            value={{
                token: state.token,
                user: state.user,
                randomProduction: state.randomProduction,
                productionOfTheDay: state.productionOfTheDay,
                productions: state.productions,
                ratings: state.ratings,
                setToken,
                removeToken,
                setRandomProduction,
                setProductionOfTheDay,
                updateProductionOfTheDay,
                setProductions,
                createProduction,
                setUserRatings,
                createProductionRating,
                editProductionRating,
                removeProductionRating
            }}
        >
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            {props.children}
        </ProductionContext.Provider>
    );
}

function getHeaders(state) {
    return {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `${state.token}`
    };
}