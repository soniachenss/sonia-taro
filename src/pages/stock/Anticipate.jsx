import { useState, useEffect } from 'react';
import { View,  ScrollView } from '@tarojs/components'

import { FixedView, Popup, Tag } from "@taroify/core"
import { useDispatch, useSelector } from 'react-redux';
import formatMoney from '@/utils/formatMoney'
import {
    getPredictDishList,
    getPredictStockList,
} from '@/reducers/stock/action'

const AnticipateItem = (props) => {
    const {
        name,
        predictNumber,
        actualNumber,
        stockUnit,
        checkTime,
        tabValue,
    } = props
    return (
        <View className='ys-stock-list-item'>
            <View className='item-left'>
                <View>{name}</View>
                <View>{predictNumber}{tabValue === 'HP' ? stockUnit : '份'}</View>
            </View>
            {
                tabValue === 'HP' && actualNumber !== null ?
                <View className='item-right'>
                <View className='right-number'>最新库存： {actualNumber} {stockUnit}</View>
                <View className='right-date'>(更新于{checkTime.slice(5,16)})</View>
            </View> : ''

            }
            
        </View>
    )
}
const Anticipate = (props) => {
    const {
        open,
        setOpen,
        tomorrowDate,
        tomorrow,
        dayType,
        actualAmount,
        shopName,
        today_str,
    } = props
    const dispatch = useDispatch()
    const predictDishList = useSelector(state => state.stockState.predictDishList)
    const predictStockList = useSelector(state => state.stockState.predictStockList)
    const [tabValue, setTabValue] = useState('HP')
    const changePageTab = (value) => {
        setTabValue(value)
        if(value==='CP'){
            dispatch(getPredictDishList({date: tomorrowDate}))
        }else{
            dispatch(getPredictStockList({date: today_str}))
        }
    }
    useEffect(() => {
        dispatch(getPredictStockList({date: today_str}))
    }, [])

    const predictList = tabValue === 'HP' ? predictStockList : predictDishList
    return (
        <Popup 
            open={open} 
            closeable={true}
            placement="bottom" 
            style={{ height: "85%" }} 
            lock 
            className='ys-anticipate-popup'
            onClose={()=>setOpen(false)}
        >
            <View className='notice-wrap'>
                <View className='notice-top'>
                    <View className='notice-shop'>{shopName}</View>
                    <View className='notice-tag'>
                        <Tag color="danger" variant="outlined" size="large">{tomorrow}</Tag>
                        <Tag color="danger" variant="outlined" size="large">{dayType}</Tag>
                    </View>
                </View>
                <View className='notice-bottom'>
                    <View className="bottom-left">收入目标：{formatMoney(Math.round(actualAmount),0)}元</View>
                    <View className="bottom-right">
                        <View className='right-tabs'>
                            <View className={`tab-item ${tabValue === 'HP' ? 'tab-item-active' : ''}`} onClick={()=>changePageTab('HP')}>货品</View>
                            <View className={`tab-item ${tabValue === 'CP' ? 'tab-item-active' : ''}`} onClick={()=>changePageTab('CP')}>菜品</View>
                        </View>
                    
                    </View>
                </View>
            </View>
                
            <ScrollView 
                className='anticipate-list'
                scrollY
            >
                <View>
                    {
                        predictList.map((item,index) => {
                            return (
                                <AnticipateItem 
                                    name={tabValue === 'HP' ? item.stock_name :item.menu_name}
                                    predictNumber={tabValue === 'HP' ? item.predict_number : item.predict_number_round}
                                    actualNumber={item.actual_number}
                                    checkTime={item.latest_check_time_str}
                                    stockUnit={item.stock_unit}
                                    key={index}
                                    tabValue={tabValue}
                                />
                            )
                        })
                    }
                </View>
            </ScrollView>
        </Popup>
    );
};

export default Anticipate;