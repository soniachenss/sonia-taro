import { View,ScrollView, Text } from '@tarojs/components'
import Taro, { useDidHide } from '@tarojs/taro'
import { FixedView, Button, Toast, Navbar, Tag } from "@taroify/core"
import { useSelector, useDispatch } from 'react-redux'
import {  getDayOfWeek } from '@/utils/common'
import './index.scss'
import {
    saveCallStockList,
    changeNeededStockList,
    changeStockPageStatus,
} from '@/reducers/stock/action'
import {
    changePageContentIsModify,
} from '@/reducers/home/action'
export default function Index() {
    const dispatch = useDispatch()
    const stockState = useSelector(state => state.stockState)
    const currentShop = useSelector(state => state.userState.currentShop)
    const {
        predictIncomeInfo,
        tabValue,
        orderList,
    } = stockState
    const tomorrowDate = predictIncomeInfo.predict_date_str
    const tomorrow = tomorrowDate ? getDayOfWeek(new Date(tomorrowDate)) : ''
    const dayType = predictIncomeInfo.predict_date_type

    useDidHide(()=>{
        dispatch(changeNeededStockList({list:[],tabValue}))
    })

    return (
        <View className='ys-stock-order'>
            <View className='ys-navbar'><Navbar title=""><Navbar.NavLeft onClick={()=>Taro.switchTab({url:'/pages/stock/index'})}>返回</Navbar.NavLeft></Navbar></View>
            <Toast id="toast" duration='2000'/>
            <View wordwrap={false} scrollable={false} className={'order-notice-wrap'}>
                <View className='order-notice'>
                    <View className='notice-shop'>
                        <View>送货日期：{tomorrowDate}</View>
                        <View className='notice-tag'>
                                <Tag color="danger" variant="outlined" size="large">{tomorrow}</Tag>
                                <Tag color="danger" variant="outlined" size="large">{dayType}</Tag>
                            </View>
                        </View>
                    <View className='notice-date'>门店：{currentShop.entity_name}</View>
                </View>
            </View>

            <ScrollView scrollY  className='ys-order-scroll-view'> 
                <View>
                    {
                        orderList.map(item => {
                            return (
                                <View className='ys-stock-order-item' key={item}>
                                    <View className='item-top'>
                                        <View className="top-left">{item.stock_name}</View>
                                        <View className="top-right">{item.spec}</View>
                                    </View>
                                    <View className='item-bottom'>
                                        <View className="bottom-left">{item.showValue} {item.stock_unit}</View>
                                        <View className="bottom-right">{item.goodsNum} {item.spec?.split('/')[1] || item.spec}</View>
                                    </View>
                                </View>
                            )
                        })
                    }
                    <View style={{height: '90px'}}></View>
                </View>
            </ScrollView>
            <FixedView position="bottom" className='order-bottom-btns'>
                <View className='bottom-btns-left'>
                    小计：<Text>{orderList.length}</Text>项
                </View>
                <View className='bottom-btns-right'>
                    <Button
                        color="primary"
                        size='small'
                        onClick={() => {
                            dispatch(saveCallStockList({
                                date: tomorrowDate,
                                tabValue: tabValue,
                                list: orderList,
                            }, () => {
                                // setIsAdd(true)
                                // setTableNumber(0)
                                Toast.open(`${tabValue}叫货成功，已同步生成二维火的采购订单`)
                                dispatch(changeStockPageStatus(false))
                                dispatch(changePageContentIsModify(false))
                                setTimeout(()=>{
                                    Taro.switchTab({
                                        url: '/pages/stock/index'
                                    })
                                },2000)
                                
                            }))
                            
                        }}
                    >确定</Button>
                </View>
            </FixedView>
        </View>
    )
}
