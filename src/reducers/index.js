import { combineReducers } from 'redux'
import homeState from './home/index'
import userState from './user/index'
import stockState from './stock/index'
import shopState from './shop/index'

export default combineReducers({
    homeState,
    userState,
    stockState,
    shopState,
})
