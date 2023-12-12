import React, {createContext, useReducer} from 'react';
import AppReducer from './AppReducer';
import axios from 'axios';

// Initial State

const initialState = {
    transactions: [],
       error: null,
       loading: true  
}

// Create context 
export const GlobalContext = createContext(initialState);

// Provider component 
export const GlobalProvider = ({children}) => {
    const [state, dispatch] = useReducer(AppReducer, initialState)

    //Actions 

    async function getTransactions() {          // using async because axios returns a promise
        try {
            const res = await axios.get('/api/v1/transactions');  // We need not write https://localhost:5000/api/v1/transactions as we added a proxy in teh package-json file

            dispatch({
                type: 'GET_TRANSACTIONS',
                payload: res.data.data
            });
        } catch (err) {
            dispatch({
                type: 'TRANSACTION_ERROR',
                payload: err.response.data.error
            });
        }
    }
    async function deleteTransaction(id) {

        try {
            await axios.delete(`/api/v1/transactions/${id}`); 

            dispatch({
                type: 'DELETE_TRANSACTION',
                payload: id 
            });

        } catch (err) {
            dispatch({
                type: 'TRANSACTION_ERROR',
                payload: err.response.data.error
            });
        }
        
    }

    async function addTransaction(transaction) {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        try {
            const res = await axios.post('/api/v1/transactions', transaction, config);

            dispatch({
                type: 'ADD_TRANSACTION',
                payload: res.data.data
            });
        } catch (err) {
            dispatch({
                type: 'TRANSACTION_ERROR',
                payload: err.response.data.error
            });
        }

    }
    return (<GlobalContext.Provider value={{
        transactions: state.transactions,
        error: state.error,
        loading: state.loading,
        getTransactions,
        deleteTransaction,
        addTransaction
    }}>
        {children}
    </GlobalContext.Provider>);
}
