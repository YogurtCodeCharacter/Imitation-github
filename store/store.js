import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import axios from 'axios';


// TODO: 定义inntstate
let userState = {};

const LOGOUT = "LOGOUT";

// TODO: 定义reducer

const MIN = "name";
function usertReducer(state = userState, action) {
    switch (action.type) {
        case LOGOUT:
            return {}
        default:
            return state;
    }
}

// TODO: redux-thunk 测试
function asyncThunk(num) {
    return (dispatch, getState) => {
        setTimeout(() => {
            // dispatch()
        }, 1000)
    }
}

// TODO: action creators 
export function logout() {
    return (dispatch) => {
        axios.post('/logout').then((resp) => {
            if (resp.status === 200) {
                dispatch({
                    type: LOGOUT
                })
            } else {
                console.log(`登出失败:${resp}`);
            }
        }).catch((error) => {
            console.log(error);
        })
    }
}

const allReducer = combineReducers({ userInfo: usertReducer });

export default function initializeStore(state) {
    const store = createStore(allReducer, Object.assign({}, { userInfo: { name: 'killo' } }, state), composeWithDevTools(applyMiddleware(ReduxThunk)));
    return store;
}


