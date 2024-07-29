import * as ActionTypes from './ActionTypes';

const INITIAL_STATE = {
    tabValue: 'shop',
    phoneNumber: '',
    userShopList: [], //当前登录用户所在门店列表
    isAdmin: false, //
    userInfo: {},
    isModify: false,
    keyBoardActiveValue: '',
    systemInfo: {},
}

export default function homeState(state = INITIAL_STATE, action) {
    return ({
        [ActionTypes.INIT_HOME_STATE]: () => INITIAL_STATE,
        [ActionTypes.CHANGE_TAB_VALUE]: () => {
            return {
                ...state,
                tabValue: action.data
            }
        },
        [ActionTypes.YS_GET_PHONE_LOGIN]: () => {
            return {
                ...state,
                phoneNumber: action.phoneNumber,
                userShopList: action.userShopList || [],
                isAdmin: action.isAdmin || false
            }
        },
        [ActionTypes.YS_CHANGE_USER_INFO]: () => {
            return {
                ...state,
                userInfo: action.userInfo
            }
        },
        [ActionTypes.CHANGE_PAGE_CONTENT_IS_MODIFY]: () => {
            return {
                ...state,
                isModify: action.isModify,
            }
        },
        [ActionTypes.CHANGE_KEY_BOARD_SHOW]: () => {
            return {
                ...state,
                keyBoardActiveValue: action.activeValue,
            }
        },
        [ActionTypes.YS_SYSTEM_INFO]: () => {
            return {
                ...state,
                systemInfo: action.data,
            }
        },

    }[action.type] || (() => state))();
}