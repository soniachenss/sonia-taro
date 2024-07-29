
import * as ActionTypes from './ActionTypes';
import api from '@/services/api'
import Taro from '@tarojs/taro'
import jdyApi from '@/services/jdyApi'
import calc from '@/utils/calculate'
import {
    YS_APP_ID,
    YS_STAFF_DISH_LIST_TABLE_ID,
    YS_PREDICT_INCOME_LIST_TABLE_ID,
    YS_PREDICT_STOCK_LIST_TABLE_ID,
    YS_PREDICT_DISH_LIST_TABLE_ID,
    YS_CALL_STOCK_LIST_TABLE_ID,
    YS_SAVE_STOCK_LIST_TABLE_ID,
} from '@/services/Limit.js'

// 获取预测信息（收入、日期类别等）
export const getPredictIncomeList = (parmars) => (dispatch, getState) => {
    const {
        date,
        shopId,
    } = parmars
    const currentShop = getState().userState.currentShop
    const _shopId = shopId ? shopId : currentShop.self_entity_id
    jdyApi.post('entry/data/list',{
        app_id: YS_APP_ID,
        entry_id: YS_PREDICT_INCOME_LIST_TABLE_ID,
        filter: {
            rel: 'and',
            cond: [
                {
                "field": "predict_date",
                "method": "eq",
                "value": date
                },
                {
                    "field": "self_entity_id",
                    "method": "eq",
                    "value": _shopId
                }
            ]
        },
        limit: 100,
        
    }).then((res) => {
        dispatch({
            type: ActionTypes.GET_PREDICT_INCOME_LIST,
            data: res.data?.data || []
        })
    })
}
// 预测菜品
export const getPredictDishList = (parmars) => (dispatch,getState) => {
    const {
        date,
        shopId,
    } = parmars
    const currentShop = getState().userState.currentShop
    const _shopId = shopId ? shopId : currentShop.self_entity_id
    jdyApi.post('entry/data/list',{
        app_id: YS_APP_ID,
        entry_id: YS_PREDICT_DISH_LIST_TABLE_ID,
        filter: {
            rel: 'and',
            cond: [
                {
                "field": "predict_date",
                "method": "eq",
                "value": date
                // "value": '2024-06-13'
                },
                {
                    "field": "self_entity_id",
                    "method": "eq",
                    "value": _shopId
                }
            ]
        },
        limit: 100,
        
    }).then((res) => {
        dispatch({
            type: ActionTypes.GET_PREDICT_DISH_LIST,
            data: res.data?.data || []
        })
    })
}
// 预测货品
export const getPredictStockList = (parmars) => (dispatch, getState) => {
    const {
        date,
        shopId,
    } = parmars
    const currentShop = getState().userState.currentShop
    const _shopId = shopId ? shopId : currentShop.self_entity_id
    Taro.showLoading({
        title: '加载中',
    })
    let stockList = []
    const getDataLoop = (data_id) => {
        jdyApi.post('entry/data/list',{
            app_id: YS_APP_ID,
            entry_id:  YS_CALL_STOCK_LIST_TABLE_ID,
            data_id,
            filter: {
                rel: 'and',
                cond: [
                    {
                        "field": "date_str",
                        "method": "eq",
                        "value": date
                        // "value": '2024-06-13'
                    },
                    {
                        "field": "self_entity_id",
                        "method": "eq",
                        "value": _shopId
                    },
                    {
                        "field": "predict_number",
                        "method": "not_empty",
                    },
                ]
            },
            limit: 100,
            
        }).then((res) => {
            stockList = stockList.concat(res.data.data)
            if(res.data.data && res.data.data.length === 100 ){
                getDataLoop(res.data.data[res.data.data.length-1]._id)
            }else{
                dispatch({
                    type: ActionTypes.GET_PREDICT_STOCK_LIST,
                    data: stockList
                })
                Taro.hideLoading()
            }
            
        })
    }
    getDataLoop('')
}

// 获取叫货库存列表
export const getCallStockList = (parmars,resolve) => (dispatch,getState) => {
    const {
        date,
        tabValue = '冻品',
        isAdd = false,
        shopId,
    } = parmars
    let stockList = []
    Taro.showLoading({
        title: '加载中',
    })
    const currentShop = getState().userState.currentShop
    const _shopId = shopId ? shopId : currentShop.self_entity_id
    let cond = [
        {
            "field": "date_str",
            "method": "eq",
            "value": date
            // "value": '2024-07-19'
        },
        {
            "field": "self_entity_id",
            "method": "eq",
            "value": _shopId
        },
        {
            "field": "storage_area",
            "method": "eq",
            "value": tabValue 
        }
    ]
    const getDataLoop = (data_id) => {
        jdyApi.post('entry/data/list',{
            app_id: YS_APP_ID,
            entry_id: YS_CALL_STOCK_LIST_TABLE_ID,
            data_id,
            filter: {
                rel: 'and',
                cond
            },
            limit: 100,
            
        }).then((res) => {
            stockList = stockList.concat(res.data.data)
            if(res.data.data && res.data.data.length === 100 ){
                getDataLoop(res.data.data[res.data.data.length-1]._id)
            }else{
                dispatch({
                    type: ActionTypes.GET_CALL_STOCK_LIST,
                    data: stockList || [],
                    tabValue,
                    isAdd,
                })
                Taro.hideLoading()
                resolve && resolve()
            }
            
        })
    }
    getDataLoop('')
    
}

// 获取员工餐列表
export const getStaffStockList = (parmars, resolve) => (dispatch,getState) => {
    const {
        date,
        weekStr,
        // tabValue = '冻品',
        isAdd,
        // shopId,
    } = parmars
    // const currentShop = getState().userState.currentShop
    // const _shopId = shopId ? shopId : currentShop.self_entity_id
    let stockList = []
    Taro.showLoading({
        title: '加载中',
    })
    jdyApi.post('entry/data/list',{
        app_id: YS_APP_ID,
        entry_id: YS_STAFF_DISH_LIST_TABLE_ID,
        filter: {
            rel: 'and',
            cond: [
                {
                    "field": "date_str",
                    "method": "eq",
                    "value": date
                },
                // {
                //     "field": "self_entity_id",
                //     "method": "eq",
                //     "value": _shopId
                // }
            ]
        },
        limit: 100,
        
    }).then((res) => {
        const data = res.data.data || []
         dispatch({
            type: ActionTypes.GET_STAFF_STOCK_LIST,
            data: data[0] ? data[0][weekStr] : [],
            isAdd,
        })
        resolve && resolve()
           
            Taro.hideLoading()
        
        
    })
}
// 查询叫货记录
export const getStockRecordList = (parmars, resolve) => (dispatch,getState) => {
    const {
        date,
        tabValue,
        shopId,
        todayStr,
        weekStr,
    } = parmars
    const currentShop = getState().userState.currentShop
    const _shopId = shopId ? shopId : currentShop.self_entity_id
    Taro.showLoading({
        title: '加载中',
    })
    jdyApi.post('entry/data/list',{
        app_id: YS_APP_ID,
        entry_id: YS_SAVE_STOCK_LIST_TABLE_ID,
        filter: {
            rel: 'and',
            cond: [
                {
                    "field": "date",
                    "method": "eq",
                    "value": date
                },
                {
                    "field": "self_entity_id",
                    "method": "eq",
                    "value": _shopId
                },
                {
                    "field": "storage_area",
                    "method": "eq",
                    "value": tabValue
                },
            ]
        },
        limit: 100,
        
    }).then((res) => {
        
        Taro.hideLoading()
        const data = res.data.data || []
         dispatch({
            type: ActionTypes.GET_RECORD_STOCK_LIST,
            hasRecord: data.length ? true : false,
        })
        const getList = data.length === 0
        if(getList){
            // resolve && resolve()
            // if(tabValue === '员工餐'){
            //     dispatch(getStaffStockList({
            //         date: date.substr(0, 7),
            //         weekStr,
            //     }))
            // }else{
                dispatch(getCallStockList({
                    date: todayStr,
                    tabValue
                }))
            // }
            
        }
        
        
    })
}
// 叫货保存
export const saveCallStockList = (parmars, successBack) => (dispatch,getState) => {
    const {
        date,
        list = [],
        tabValue,
        // weekStr
    } = parmars

    Taro.showLoading({
        title: '加载中',
    })
    // const allShopStockList = getState().shopState.allShopStockList
    const allStockList = list
    const currentShop = getState().userState.currentShop
    const postData = allStockList.map(item => {
        return {
            'stock_id':  { value: item.pricing_stock_id },
            'stock_name':  { value: item.stock_name },
            'stock_number': { value: tabValue === '员工餐' ? item.showValue : (item.showValue / item.number_step) },
            'stock_price': {value: item.pricing_stock_price},
            'supplier_id': { value: item.provider_id },
            'supplier_name': { value: item.provider_name },
        }
    })
    const jsonData = allStockList.map(item => {
        return {
            'goodsId':  item.pricing_stock_id,
            'goodsNum': tabValue === '员工餐' ? item.showValue : (item.showValue / item.number_step),
            'goodsPrice': item.pricing_stock_price,
            'goodsProviderId': item.provider_id,
            'goodsProviderName': item.provider_name,
        }
    })
    const dataArr = postData.reduce((acc, curr, index) => {
        const chunkIndex = Math.floor(index / 200);
        if (!acc[chunkIndex]) {
          acc[chunkIndex] = [];
        }
        acc[chunkIndex].push(curr);
        return acc;
    }, []);
    const jsonDataArr = jsonData.reduce((acc, curr, index) => {
        const chunkIndex = Math.floor(index / 200);
        if (!acc[chunkIndex]) {
          acc[chunkIndex] = [];
        }
        acc[chunkIndex].push(curr);
        return acc;
    }, []);

    for(let i = 0; i < dataArr.length ; i++){
        const _data = {
            app_id: YS_APP_ID,
            entry_id:  YS_SAVE_STOCK_LIST_TABLE_ID,
            data: {
                'date': {value: new Date(date).toISOString()},
                'date_str': {value: date},
                'self_entity_id': {value: currentShop.self_entity_id},
                'storage_area': {value: tabValue},
                'request_id': {value : `${currentShop.self_entity_id}${new Date().getTime()}`},
                'stock_list': {value: dataArr[i]},
                'stock_list_json': {value: JSON.stringify(jsonDataArr[i])}
                // 'stock_list_json': { value: JSON.stringify([
                //     {
                //       "goodsId": "100378747574bf000175f2e20c0704ee",
                //       "goodsNum": "9.91",
                //       "goodsPrice": "1300",
                //       "numUnitId": "unitbase000000000000000000000003",
                //       "priceUnitId": "unitbase000000000000000000000003"
                //     },
                //     {
                //       "goodsId": "10037874686f085b01687356e31955aa",
                //       "goodsNum": "9.91",
                //       "goodsPrice": "450",
                //       "numUnitId": "unitbase000000000000000000000016",
                //       "priceUnitId": "unitbase000000000000000000000016"
                //     },
                //     {
                //       "goodsId": "100378746d5cfe92016f0d9d29b63e67",
                //       "goodsNum": "9.91",
                //       "goodsPrice": "600",
                //       "numUnitId": "unitbase000000000000000000000003",
                //       "priceUnitId": "unitbase000000000000000000000003"
                //     }
                // ])}
            },
            is_start_trigger: true
            
        }
        jdyApi.post('entry/data/create',_data).then((res) => {
            if(i === dataArr.length - 1){
                Taro.hideLoading()
                successBack && successBack()
                dispatch(getStockRecordList({
                    date: date,
                    tabValue
                }))
                
            }
        })
    }

    
    
}

// 跳转叫货确认页面前保存叫货数据
export const changeNeededStockList = ({tabValue,list}) => dispatch => {
    const allStockList = list
    const jsonData = allStockList.map(item => {
        return {
            ...item,
            'goodsNum': tabValue === '员工餐' ? item.showValue : calc(item.showValue,'/' ,item.number_step,2),
        }
    })
    dispatch({
        type: ActionTypes.CHANGE_NEEDED_STOCK_LIST,
        data: jsonData,
        tabValue,
    })
}
export const changeStockPageStatus = (value) => ({
    type: ActionTypes.INIT_SHOP_STATUS_FOR_STOCK,
    shopChanged: value
})
export const changePredictCurrentItem = (item) => ({
    type: ActionTypes.CHANGE_STOCK_POPUP_ITEM,
    item
})