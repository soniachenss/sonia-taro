import * as ActionTypes from './ActionTypes';

const initArr = [
    {
        yesterday_theoretical_number: 100,
        yesterday_gross_number: 100,
        today_number: 70,
        predict_theoretical_number: 50,
        today_theoretical_consume: 80,
        predict_gross_number: 80,
        stock_unit: '斤',
        stock_name: '肉蟹煲1',
        spec: '斤',
        date_str: '2024-07-12',
        _id: '111'
    },
    {
        yesterday_theoretical_number: 100,
        yesterday_gross_number: 100,
        today_number: 70,
        predict_theoretical_number: 50,
        today_theoretical_consume: 80,
        predict_gross_number: 80,
        stock_unit: '斤',
        stock_name: '肉蟹煲2',
        spec: '斤',
        date_str: '2024-07-12',
        _id: '222'
    },
    {
        yesterday_theoretical_number: 100,
        yesterday_gross_number: 100,
        today_number: 70,
        predict_theoretical_number: 50,
        today_theoretical_consume: 80,
        predict_gross_number: 80,
        stock_unit: '斤',
        stock_name: '肉蟹煲3',
        spec: '斤',
        date_str: '2024-07-12',
        _id: '333'
    },
    {
        yesterday_theoretical_number: 100,
        yesterday_gross_number: 100,
        today_number: 70,
        predict_theoretical_number: 50,
        today_theoretical_consume: 80,
        predict_gross_number: 80,
        stock_unit: '斤',
        stock_name: '肉蟹煲4',
        spec: '斤',
        date_str: '2024-07-12',
        _id: '444'
    },
    {
        yesterday_theoretical_number: 100,
        yesterday_gross_number: 100,
        today_number: 70,
        predict_theoretical_number: 50,
        today_theoretical_consume: 80,
        predict_gross_number: 80,
        stock_unit: '斤',
        stock_name: '肉蟹煲5',
        spec: '斤',
        date_str: '2024-07-12',
        _id: '555'
    },
    {
        yesterday_theoretical_number: 100,
        yesterday_gross_number: 100,
        today_number: 70,
        predict_theoretical_number: 50,
        today_theoretical_consume: 80,
        predict_gross_number: 80,
        stock_unit: '斤',
        stock_name: '肉蟹煲6',
        spec: '斤',
        date_str: '2024-07-12',
        _id: '666'
    },
    {
        yesterday_theoretical_number: 100,
        yesterday_gross_number: 100,
        today_number: 70,
        predict_theoretical_number: 50,
        today_theoretical_consume: 80,
        predict_gross_number: 80,
        stock_unit: '斤',
        stock_name: '肉蟹煲7',
        spec: '斤',
        date_str: '2024-07-12',
        _id: '777'
    },
    {
        yesterday_theoretical_number: 100,
        yesterday_gross_number: 100,
        today_number: 70,
        predict_theoretical_number: 50,
        today_theoretical_consume: 80,
        predict_gross_number: 80,
        stock_unit: '斤',
        stock_name: '肉蟹煲8',
        spec: '斤',
        date_str: '2024-07-12',
        _id: '888'
    },
    {
        yesterday_theoretical_number: 100,
        yesterday_gross_number: 100,
        today_number: 70,
        predict_theoretical_number: 50,
        today_theoretical_consume: 80,
        predict_gross_number: 80,
        stock_unit: '斤',
        stock_name: '肉蟹煲9',
        spec: '斤',
        date_str: '2024-07-12',
        _id: '999'
    },
    {
        yesterday_theoretical_number: 100,
        yesterday_gross_number: 100,
        today_number: 70,
        predict_theoretical_number: 50,
        today_theoretical_consume: 80,
        predict_gross_number: 80,
        stock_unit: '斤',
        stock_name: '肉蟹煲10',
        spec: '斤',
        date_str: '2024-07-12',
        _id: '000'
    },
]
const INITIAL_STATE = {
    allShopStockList: [],
    shopStockList: [],
    shopStockCtgyList: [],
    shopCtgyName: '全部',
    pageTabValue: 'JP',
    // isModify: false,
    shopChanged: false,
    showPopIndex: '',
    sauceFault: new Map(),
}

export default function shopState(state = INITIAL_STATE, action) {
    return ({
        [ActionTypes.INIT_SHOP_STATE]  : () => INITIAL_STATE,
        [ActionTypes.INIT_SHOP_STATUS_FOR_SHOP]  : () => {
            return {
                ...state,
                shopChanged: action.shopChanged,
            }
        },
        [ActionTypes.GET_SHOP_STOCK_CTGY_LIST]: () => {
            // console.log(action.data,action.data.map(item=>{return {sort_value: item.sort_value,storage_area:item.storage_area}} ));
            return {
                ...state,
                shopStockCtgyList: action.data,
            }
        },
        // [ActionTypes.CHANGE_SHOP_STOCK_IS_MODIFY]: () => {
        //     return {
        //         ...state,
        //         isModify: action.isModify,
        //     }
        // },
        [ActionTypes.GET_SHOP_STOCK_LIST]: () => {
            const oriData = action.data.map(item => {
                // const checkValue = !item.predict_theoretical_number || item.predict_theoretical_number < 0 ? 0 : Math.round(item.predict_theoretical_number)
                return {
                    ...item,
                    oriValue: item.predict_theoretical_number,
                    predict_theoretical_number: item.predict_theoretical_number
                }}) //保留原始值、对比用

            return {
                ...state,
                shopStockList: [...oriData],
                shopCtgyName: action.ctgyName,
                allShopStockList: [...oriData],
                pageTabValue: action.isJp ? 'JP' : 'QP'
            }

        },
        [ActionTypes.GET_SHOP_STOCK_LIST_FROM_CTGY]: () => {
            const allShopStockList = state.allShopStockList
            const shopStockList = action.ctgyName === '全部' ? allShopStockList : allShopStockList.filter(item => item.storage_area === action.ctgyName)
            return {
                ...state,
                shopStockList: [...shopStockList],
                shopCtgyName: action.ctgyName,
            }

        },
        [ActionTypes.CHANGE_SHOP_ALL_STOCK_DATA]: () => {
            // const id = action.data.id
            // const index = action.data.index
            // const allShopStockList = [...state.allShopStockList]
            // const shopStockList = [...state.shopStockList]
            // const oriStockItem = shopStockList[index]
            // shopStockList[index] = {
            //     ...oriStockItem,
            //     predict_theoretical_number: action.data.predict_theoretical_number

            // }
            // const allIndex = allShopStockList.findIndex(item => item._id === id)
            // const oriItem = allShopStockList[allIndex]
            // allShopStockList[allIndex] = {
            //     ...oriItem,
            //     predict_theoretical_number: action.data.predict_theoretical_number,

            // }
            const shopCtgyName = state.shopCtgyName
            return {
                ...state,
                shopStockList: shopCtgyName === '全部' ? [...action.list] : action.list.filter(item => item.storage_area === shopCtgyName),
                allShopStockList: [...action.list],
            }
        },
        [ActionTypes.SHOP_CHANGE_POPUP_INDEX]: () => {
            // console.log(action.data,action.data.map(item=>{return {sort_value: item.sort_value,storage_area:item.storage_area}} ));
            return {
                ...state,
                showPopIndex: action.value,
            }
        },
        [ActionTypes.GET_SHOP_STOCK_FAULT_VALUE]: () => {
            return {
                ...state,
                sauceFault: action.data,
            }
        },

    }[action.type] || (() => state))();
}
