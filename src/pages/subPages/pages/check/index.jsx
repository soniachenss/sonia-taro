import { View,ScrollView, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { NoticeBar, FixedView, Button, Toast, Navbar } from "@taroify/core"
import { useSelector, useDispatch } from 'react-redux'
import {  getDayOfWeek } from '@/utils/common'
import calc from '@/utils/calculate'
import './index.scss'
import {
    saveShopStockList,
} from '@/reducers/shop/action'
import {
    changePageContentIsModify,
} from '@/reducers/home/action'
import {
    getShopInfo,
} from '@/reducers/user/action'
export default function Index() {
    
    const shopState = useSelector(state => state.shopState)
    const currentShop = useSelector(state => state.userState.currentShop)
    const dispatch = useDispatch()
    const {
        allShopStockList = [],
    } = shopState
    const today = new Date();
    const today_str = today.toISOString().split('T')[0];
    const today_time = `${today.getHours() < 10 ? `0${today.getHours()}` : today.getHours()}:${today.getMinutes() < 10 ? `0${today.getMinutes()}` : today.getMinutes()}`
    const weekDay = getDayOfWeek(new Date(today_str))

    return (
        <View className='ys-stock-check'>
            <View className='ys-navbar'><Navbar title="库存更新"><Navbar.NavLeft onClick={()=>Taro.switchTab({url:'/pages/shop/index'})}>返回</Navbar.NavLeft></Navbar></View>
            <Toast id="toast" duration='2000'/>
            <NoticeBar wordwrap={false} scrollable={false}>
                <View className='check-notice'>
                    <View className='notice-shop'>{currentShop.entity_name}</View>
                    <View className='notice-date'>更新日期：{today_str} {today_time}({weekDay})</View>
                </View>
            </NoticeBar>

            <ScrollView scrollY  className='ys-check-scroll-view'> 
                <View>
                    {
                        allShopStockList.map(item => {
                            const diff = calc(item.predict_theoretical_number, '-', item.predict_gross_number)
                            return (
                                <View className='ys-stock-check-item' key={item}>
                                    <View className='item-top'>
                                        <View className="top-left">{item.stock_name}</View>
                                        <View className="top-right">规格：{item.spec}</View>
                                    </View>
                                    <View className='item-center'>
                                        <View className="center-left">实际库存： {item.predict_theoretical_number} {item.stock_unit}</View>
                                        <View className="center-right">预测库存：{item.predict_gross_number} {item.stock_unit}</View>
                                    </View>
                                    <View className='item-bottom'>
                                        <View className="bottom-left"></View>
                                        <View className="bottom-right">差异：<Text className={diff === 0 ? 'text-normal' : 'text-danger'}>{diff} </Text>{item.stock_unit}</View>
                                    </View>
                                </View>
                            )
                        })
                    }
                    <View style={{height: '90px'}}></View>
                </View>
            </ScrollView>
            <FixedView position="bottom" className='check-bottom-btns'>
                <View className='bottom-btns-left'>
                    纠偏小计：<Text>{allShopStockList.length}</Text>项
                </View>
                <View className='bottom-btns-right'>
                    <Button
                        color="primary"
                        size='small'
                        onClick={() => {
                            dispatch(saveShopStockList({
                                type: 'SUBMIT',
                                date: today_str,
                                list: allShopStockList
                            },()=>{
                                Toast.open("纠偏成功，已同步更新库存数据",)
                                setTimeout(()=>{
                                    dispatch(getShopInfo(currentShop.self_entity_id))
                                    Taro.switchTab({
                                        url: `/pages/shop/index`
                                    });
                                    // dispatch(getShopStockList({
                                    //     date,
                                    //     isJp: pageTabValue === 'JP'
                                    // }))
                                },2000)
                                dispatch(changePageContentIsModify(false))
                            }))
                            
                        }}
                    >提交</Button>
                </View>
            </FixedView>
        </View>
    )
}
