import * as ActionTypes from './ActionTypes';
import calc from '@/utils/calculate';
  
const INITIAL_STATE = {
    predictIncomeInfo: {},
    predictDishList: [],
    predictStockList: [],
    callStockList: [],
    tabValue: '冻品',
    callAddStockList: [],
    shopChanged: false,
    hasRecord: false, // 今日是否已叫货
    orderList: [],
    currentPopItem: {},
}
  
  export default function stockState(state = INITIAL_STATE, action) {
      return ({
        [ActionTypes.INIT_STOCK_STATE]  : () => INITIAL_STATE,
        [ActionTypes.INIT_SHOP_STATUS_FOR_STOCK]  : () => {
            return {
                ...state,
                shopChanged: action.shopChanged,
            }
        },
          [ActionTypes.GET_PREDICT_INCOME_LIST]  : () => {
              return {
                  ...state,
                  predictIncomeInfo: action.data[0] || {}
              }
          },
          [ActionTypes.GET_PREDICT_DISH_LIST]  : () => {
              return {
                  ...state,
                  predictDishList: action.data || []
              }
          },
          [ActionTypes.GET_PREDICT_STOCK_LIST]  : () => {
              return {
                  ...state,
                  predictStockList: action.data || []
              }
          },
          [ActionTypes.GET_CALL_STOCK_LIST]: () => {
            const oriData = action.data.map(item => {
                const val1 = calc(Number(item.stock_suggestion),'/',Number(item.number_step))
                const showValue = calc( Math.ceil(val1),'*',Number(item.number_step))
                // const showValue = Math.ceil(Number(item.stock_suggestion) / Number(item.number_step)) * Number(item.number_step)
                return {
                    ...item,
                    showValue: action.isAdd || action.tabValue === '员工餐' ? 0 : showValue,
                    actual_number: action.isAdd ? null : item.actual_number,
                    predict_number: action.isAdd ? null : item.predict_number
                }})
                if(action.isAdd){
                    return {
                        ...state,
                        callAddStockList: [...oriData],
                        tabValue: action.tabValue
                    }
                }else{
                    return {
                        ...state,
                        callStockList: [...oriData],
                        tabValue: action.tabValue
                    }
                }
            

        },
          [ActionTypes.GET_STAFF_STOCK_LIST]: () => {
            const oriData = action.data.map(item => {
                // const showValue = item[`${action.weekStr}_stock_number`]
                return {
                    ...item,
                    showValue: 0,
                    actual_number: null
                }})
                if(action.isAdd){
                    return {
                        ...state,
                        callAddStockList: [...oriData],
                        tabValue: action.tabValue
                    }
                }else{
                    return {
                        ...state,
                        callStockList: [...oriData],
                        tabValue: '员工餐'
                    }
                }
            

        },
        [ActionTypes.GET_RECORD_STOCK_LIST]  : () => {
            return {
                ...state,
                hasRecord: action.hasRecord,
            }
        },
        [ActionTypes.CHANGE_NEEDED_STOCK_LIST]: () => {
            return {
                ...state,
                orderList: action.data,
                tabValue: action.tabValue
            }
        },
        [ActionTypes.CHANGE_STOCK_POPUP_ITEM]: () => {
            return {
                ...state,
                currentPopItem: action.item,
            }
        },
          
          
      }[action.type] || (() => state))();
  }
  