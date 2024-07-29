import * as ActionTypes from './ActionTypes';
  
const INITIAL_STATE = {
    adminList: [],
    shopList: [],
    currentShop: {},
    // shopInfo: {}
    shopChanged: false,
}
  
  export default function userState(state = INITIAL_STATE, action) {
      return ({
        [ActionTypes.INIT_USER_STATE]  : () => INITIAL_STATE,
        [ActionTypes.INIT_SHOP_STATUS_FOR_USER]  : () => {
            return {
                ...state,
                shopChanged: action.shopChanged,
            }
        },
          [ActionTypes.YS_GET_ADMIN_INFO]  : () => {
              return {
                  ...state,
                  adminList: action.data || []
              }
          },
          [ActionTypes.YS_GET_SHOP_LIST]  : () => {
              return {
                  ...state,
                  shopList: action.data,
                //   currentShop: action.data[0]
              }
          },
          [ActionTypes.YS_GET_SHOP_INFO]  : () => {
              return {
                  ...state,
                  currentShop: action.data[0],
              }
          },
          
      }[action.type] || (() => state))();
  }
  