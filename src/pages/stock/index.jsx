
import { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from "@tarojs/react";
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useLoad, useDidShow, getStorageSync } from '@tarojs/taro'
import { Tabs, FixedView, Button, Tag, Popup, Empty, Toast } from "@taroify/core"
import { Arrow, Checked } from "@taroify/icons"

import { useDispatch, useSelector } from 'react-redux';
import { getDayOfWeek, getPreviousDay, getTomorrowDate } from '@/utils/common'

import YsInput from '@/parts/Common/YsInput'
import BottomBar from '@/parts/BottomBar'
import NavBar from '@/parts/NavBar'
import Item from './Item'
import Anticipate from './Anticipate'
import AddStock from './AddStock'
import './index.scss'
import {
    getStockRecordList,
    getCallStockList,
    getStaffStockList,
    getPredictIncomeList,
    changeStockPageStatus,
    saveCallStockList,
    changeNeededStockList,
    changePredictCurrentItem,
} from '@/reducers/stock/action'
import {
    changePageContentIsModify,
    changeKeyBoardShow,
} from '@/reducers/home/action'
import calc from '@/utils/calculate';

// const stockList = {
//     '冻品': [
//         // { name: '106_肉蟹煲', unit: '斤', number: '20', adjust: '-1' },
//         // { name: '107_土豆', unit: '筐', number: '100', adjust: '-21', isNew: true },
//         // { name: '108_土豆', unit: '筐', number: '100', adjust: '-21' },
//         // { name: '109_土豆', unit: '筐', number: '100', adjust: '-21' },
//         // { name: '110_土豆', unit: '筐', number: '100', adjust: '-21' },
//     ],
//     '生鲜': [
//         { name: '111_肉蟹煲', unit: '斤', number: '20', adjust: '-1' },
//         { name: '112_土豆', unit: '筐', number: '100', adjust: '-21' },
//         { name: '113_土豆', unit: '筐', number: '100', adjust: '-21' },
//     ],
//     '海盐货': [
//         { name: '114_土豆', unit: '筐', number: '100', adjust: '-21' },
//         { name: '115_土豆', unit: '筐', number: '100', adjust: '-21' },
//         { name: '116_肉蟹煲', unit: '斤', number: '20', adjust: '-1' },
//         { name: '117_土豆', unit: '筐', number: '100', adjust: '-21' },
//         { name: '118_土豆', unit: '筐', number: '100', adjust: '-21' },
//         { name: '119_土豆', unit: '筐', number: '100', adjust: '-21' },
//         { name: '120_土豆', unit: '筐', number: '100', adjust: '-21' },
//     ],
//     '员工餐': [
//         { name: '121_肉蟹煲', unit: '斤', number: '20', adjust: '-1' },
//         { name: '122_土豆', unit: '筐', number: '100', adjust: '-21' },
//         { name: '123_土豆', unit: '筐', number: '100', adjust: '-21' },
//         { name: '124_土豆', unit: '筐', number: '100', adjust: '-21' },
//         { name: '125_土豆', unit: '筐', number: '100', adjust: '-21' },
//     ],
// }
// const seaList = {
//     '前厅': [
//         { name: '114_土豆', unit: '筐', number: '100', adjust: '-21' },
//         { name: '115_土豆', unit: '筐', number: '100', adjust: '-21' },
//         { name: '116_肉蟹煲', unit: '斤', number: '20', adjust: '-1' },
//     ],
//     '后厨': [
//         { name: '117_土豆', unit: '筐', number: '100', adjust: '-21' },
//         { name: '118_土豆', unit: '筐', number: '100', adjust: '-21' },
//     ],
//     '冷菜': [
//         { name: '119_土豆', unit: '筐', number: '100', adjust: '-21' },
//         { name: '120_土豆', unit: '筐', number: '100', adjust: '-21' },
//     ],
// }
export default function Index() {
    const dispatch = useDispatch()
    const stockState = useSelector(state => state.stockState)
    const isModify = useSelector(state => state.homeState.isModify)
    const keyBoardActiveValue = useSelector(state => state.homeState.keyBoardActiveValue)
    const systemInfo = useSelector(state => state.homeState.systemInfo)
    const screenWidth = systemInfo.screenWidth || 375
    const transUnit = calc(750,'/',screenWidth) 
    const {
        callStockList = [],
        callAddStockList = [],
        predictIncomeInfo,
        shopChanged,
        hasRecord,
        currentPopItem,
    } = stockState

    const [tabValue, setTabValue] = useState('冻品')
    const [subTabValue, setSubTabValue] = useState('前厅')

    const [stockList, setStockList] = useState([...callStockList])
    useEffect(() => {
        setStockList([...callStockList])
    }, [tabValue, JSON.stringify(callStockList)])
    const customIndexList = ['冻品', '生鲜', '海盐货', '员工餐']
    const seaIndexList = ['前厅', '后厨', '冷菜']

    const [open, setOpen] = useState(false)
    const [addOpen, setAddOpen] = useState(false)

    const [isAdd, setIsAdd] = useState(hasRecord)
    useEffect(() => {
        setIsAdd(hasRecord)
    }, [hasRecord])
    const today = new Date();
    const today_str = today.toISOString().split('T')[0];

  


    const tomorrowDate = predictIncomeInfo.predict_date_str
    const tomorrow = tomorrowDate ? getDayOfWeek(new Date(tomorrowDate)) : ''
    const weekStr = {
        '周一': 'mon',
        '周二': 'tue',
        '周三': 'wed',
        '周四': 'thu',
        '周五': 'fri',
        '周六': 'sat',
        '周日': 'sun',
    }[tomorrow]
    const dayType = predictIncomeInfo.predict_date_type
    const actualAmount = predictIncomeInfo.predict_actual_amount
    const shopName = predictIncomeInfo.self_entity_name

    const [scrollValue, setScrollValue] = useState(0)
    const scrollRef = useRef(null)
    const handleScroll = (e) => {
        scrollRef.current = e.detail.scrollTop
    }
    const changeItemFun = useCallback(
        (data) => {
            setStockList((preState) => {
                return preState.map(cur => {
                    if (cur._id === data.id) {
                        return {
                            ...cur,
                            showValue: data.showValue
                        }
                    }
                    return cur
                })
            })
            setScrollValue(scrollRef.current)
        },
        [],
    )
    function changeSubTab(item) {
        if(isModify){
            Taro.showModal({
                title: '提示',
                content: '您在当前页面的更改尚未保存，切换将导致所有未保存的更改丢失，是否继续切换？',
                success: function (res) {
                  if (res.confirm) {
                    setSubTabValue(item)
                    dispatch(getStockRecordList({
                        date: getTomorrowDate(),
                        tabValue: `海盐货-${item}`,
                        todayStr: today_str,
                    }))
                    dispatch(changePageContentIsModify(false))
                  } else if (res.cancel) {
                    
                  }
                }
            })
        }else{
            setSubTabValue(item)
            dispatch(getStockRecordList({
                date: getTomorrowDate(),
                tabValue: `海盐货-${item}`,
                todayStr: today_str,
            }))
        }
        

    }

    const isStaff = tabValue === '员工餐'
    const [tableNumber, setTableNumber] = useState(0)
    const decreaseFun = useCallback(
        () => {
            const diff = calc(Number(tableNumber),'-',1)
            const value = diff < 0 ? 0 : diff
            changeStaffValue(value)
            !isModify && dispatch(changePageContentIsModify(true))
        },
        [tableNumber, weekStr],
    )
    const addFun = useCallback(
        () => {
            const value = calc(Number(tableNumber),'+',1)
            changeStaffValue(value)
            !isModify && dispatch(changePageContentIsModify(true))
        },
        [tableNumber, weekStr],
    )
    const changeStaffValue = (value) => {
        setTableNumber(value)
        setStockList((preState) => {
            return preState.map(cur => {
                return {
                    ...cur,
                    showValue: calc(value,'*', Number(cur.number_step))
                }
            })
        })
    }

    useLoad(() => {
        dispatch(getStockRecordList({
            date: getTomorrowDate(),
            tabValue,
            todayStr: today_str,
        }))

        dispatch(getPredictIncomeList({
            date: getTomorrowDate()
        }))
        dispatch(changeStockPageStatus(false))
    })
    useDidShow(() => {
        const isInit = getStorageSync('pageStatus') === 'INIT'
        if (shopChanged || isInit ) {
            dispatch(getStockRecordList({
                date: getTomorrowDate(),
                tabValue,
                todayStr: today_str,
            }))

            dispatch(getPredictIncomeList({
                date: getTomorrowDate()
            }))
            dispatch(changeStockPageStatus(false))
            Taro.removeStorage({key: 'pageStatus'})
        }
    })
    const changeFun = useCallback(
        (value) => {
            changeStaffValue(value)
            !isModify && dispatch(changePageContentIsModify(true))
            
        },
        [isModify],
    )
    
    // const changeFun = (e)=>{
    //     changeStaffValue(e.detail.value)
    //     !isModify && dispatch(changePageContentIsModify(true))
    // }
    const handleFocus = (e) => {
        if(!e.detail.value || e.detail.value === '0'){
            changeStaffValue('')
            !isModify && dispatch(changePageContentIsModify(true))
        }
    }
    // const handleClick = ()=> {
    //     if(keyBoardActiveValue){
    //         dispatch(changeKeyBoardShow(''))
    //     }
    // }

    const date = currentPopItem.date

    const pop_today = today_str.slice(5)
    const pop_yesterday = getPreviousDay(date)
    const pop_tomorrow = getTomorrowDate().slice(5)
    const portalElement = document.getElementById('stockPageId');
    console.log(currentPopItem.index);

    const changePopupItemFun = ()=>{
        dispatch(changePredictCurrentItem({}))
    }
    return (
        <View className='ys-stock-wrap' id='stockPageId'>
            <NavBar
                successBack={(shopId) => {
                    dispatch(getStockRecordList({
                        date: getTomorrowDate(),
                        tabValue: tabValue,
                        todayStr: today_str,
                        shopId
                    }))

                    dispatch(getPredictIncomeList({
                        date: getTomorrowDate(),
                        shopId
                    }))
                }}
            />
            <Tabs
                value={tabValue}
                onChange={(value) => {
                    if(isModify){
                        Taro.showModal({
                            title: '提示',
                            content: '您在当前页面的更改尚未保存，切换将导致所有未保存的更改丢失，是否继续切换？',
                            success: function (res) {
                              if (res.confirm) {
                                setTabValue(value)
                                dispatch(getStockRecordList({
                                    date: getTomorrowDate(),
                                    tabValue: value === '海盐货' ? `${value}-${subTabValue}` : value,
                                    todayStr: today_str,
                                }))
                                dispatch(changePageContentIsModify(false))
                              }
                            }
                        })
                    }else{
                        setTabValue(value)
                        // if (value === '员工餐') {
                        //     dispatch(getStockRecordList({
                        //         date: getTomorrowDate(),
                        //         tabValue: `员工餐`,
                        //         weekStr,
                        //         todayStr: tomorrowDate.substr(0, 7),
                        //     }))
    
                        // } else {
                            dispatch(getStockRecordList({
                                date: getTomorrowDate(),
                                tabValue: value === '海盐货' ? `${value}-${subTabValue}` : value,
                                todayStr: today_str,
                            }))
    
                        // }
                        dispatch(changePageContentIsModify(false))
                    }
                    

                }}
                className={`${isAdd ? 'stock-wrap-add' : 'stock-wrap'}`}
            >
                {
                    customIndexList.map(item => {
                        return (
                            <Tabs.TabPane title={item} key={item} value={item}>
                                {
                                    item === '海盐货' ?
                                        <View className='stock-sub-tab'>
                                            {
                                                seaIndexList.map(item => {
                                                    return (
                                                        <View
                                                            className={`sub-tab-item ${subTabValue === item ? 'sub-tab-item-active' : ''}`}
                                                            onClick={() => changeSubTab(item)}
                                                        >{item}</View>
                                                    )
                                                })
                                            }
                                        </View> : ''
                                }
                                {
                                    item === '员工餐' && !hasRecord ?
                                        <View className='stock-sub-table'>
                                            <View>用餐桌数：</View>
                                            <View className='ys-stepper'>
                                                <Button
                                                    size='small'
                                                    color="primary"
                                                    disabled={!tableNumber || tableNumber === '0'}
                                                    onClick={decreaseFun}
                                                >
                                                    -
                                                </Button>
                                                <YsInput 
                                                    index={'tableNumber'}
                                                    value={tableNumber}
                                                    onChange={changeFun}
                                                    ysPageId={'stockPageId'}

                                                />
                                                {/* <Input
                                                    type="number"
                                                    onFocus={handleFocus}
                                                    // defaultValue={predictTheoreticalNumber}
                                                    value={tableNumber}
                                                    onChange={changeFun}
                                                /> */}
                                                <Button
                                                    size='small'
                                                    color="primary"
                                                    onClick={addFun}
                                                >
                                                    +
                                                </Button>
                                            </View>

                                        </View> : ''
                                }
                                <ScrollView
                                    scrollY
                                    className='stock-wrap-list'
                                    scrollTop={scrollValue}
                                    onScroll={handleScroll}
                                >
                                    {
                                        !isAdd ?
                                            <View className='stock-list'>
                                                {
                                                    stockList.length ?
                                                        <>
                                                            {
                                                                stockList.map((item,index) => {
                                                                    const yesterdayNumber = item.yesterday_theoretical_number ? item.yesterday_theoretical_number : item.yesterday_gross_number || 0
                                                                    return (
                                                                        <Item
                                                                            index={index}
                                                                            id={item._id}
                                                                            // stockName={isStaff ? item[`${weekStr}_stock_name`] : item.stock_name}
                                                                            date={item.date_str}
                                                                            stockName={item.stock_name}
                                                                            spec={item.spec}
                                                                            showValue={item.showValue}
                                                                            actualNumber={item.actual_number}
                                                                            // stockUnit={isStaff ? item[`${weekStr}_stock_unit`] : item.stock_unit}
                                                                            stockUnit={item.stock_unit}
                                                                            numberStep={item.number_step}
                                                                            predictNumber={item.predict_number}
                                                                            latestCheckTime={item.latest_check_time_str}
                                                                            stockSuggestion={item.stock_suggestion}
                                                                            changeItemValue={changeItemFun}
                                                                            isStaff={isStaff}
                                                                            tableNumber={tableNumber}
                                                                            // stockNumber={isStaff ? item[`${weekStr}_stock_number`] : ''}
                                                                            // stockNumber={item.stock_number}

                                                                            yesterdayNumber={yesterdayNumber}
                                                                            yesterdayTheoreticalNumber={item.yesterday_theoretical_number}
                                                                            todayNumber={item.today_number}
                                                                            todayTheoreticalConsume={item.today_theoretical_consume}
                                                                            todayPredictiveCoefficients={item.today_predictive_coefficients}
                                                                            predictiveCoefficients={item.predictive_coefficients}

                                                                        />
                                                                    )
                                                                })
                                                            }
                                                        </> :
                                                        <>
                                                           <Empty className='ys-shop-time-disabled'>
                                                                <Empty.Image
                                                                    className='time-disabled-img'
                                                                    src={require('@/images/timeDisabled.jpg')}
                                                                />
                                                                <Empty.Description>当前时段不可叫货</Empty.Description>
                                                            </Empty> 
                                                        </>
                                                }


                                            </View> :
                                            <>
                                                <View className='stock-empty'>
                                                    <View className='empty-image'><Checked /></View>
                                                    <View className="empty-info">今天{tabValue === '海盐货' ? `${tabValue}-${subTabValue}` : tabValue}叫货成功！</View>
                                                    <View className="empty-order">已生成二维火订单xxxxxxxxxxx</View>
                                                </View>
                                            </>
                                    }
                                    {
                                        hasRecord ?
                                            <View
                                                className={'page-btns'}
                                                onClick={() => {
                                                    // Taro.navigateTo({ url: '/pages/subPages/pages/addStock/index' })
                                                    // if (tabValue === '员工餐') {
                                                    //     dispatch(getStaffStockList({
                                                    //         date: getTomorrowDate().substr(0, 7),
                                                    //         weekStr,
                                                    //         isAdd: true,
                                                    //     }, () => {
                                                    //         setAddOpen(true)
                                                    //     }))
                                                    // } else {
                                                        dispatch(getCallStockList({
                                                            date: today_str,
                                                            tabValue,
                                                            isAdd: true,
                                                        }, () => {
                                                            setAddOpen(true)
                                                        }))
                                                    // }
                                                    setScrollValue(scrollRef.current)


                                                }}
                                            >
                                                <View className='btns-text'>追加叫货</View>
                                            </View> : ''
                                    }
                                    <View style={{ height: `${calc(420,'/',transUnit,2)}px`}}></View>
                                    {/* 220 */}

                                </ScrollView>

                            </Tabs.TabPane>
                        )
                    })
                }
            </Tabs>
            <FixedView position="bottom" className='stock-bottom-btns'>
                <View className='bottom-btns-notice'>
                    <View className='check-notice'>
                        <View className='notice-left'>
                            <View className='notice-shop'>{shopName}</View>
                            <View className='notice-tag'>
                                <Tag color="danger" variant="outlined" size="large">{tomorrow}</Tag>
                                <Tag color="danger" variant="outlined" size="large">{dayType}</Tag>
                            </View>
                        </View>
                        <View className='notice-right' onClick={() => setOpen(true)}>点击查看预测清单 <Arrow /></View>

                    </View>
                </View>
                <View className='bottom-btns-wrap'>
                    <View className='bottom-btns-left'>
                        小计：<Text>{stockList.filter(item => item.showValue).length}</Text>项
                    </View>
                    <View className='bottom-btns-right'>
                        <Button
                            color="primary"
                            size='small'
                            onClick={() => {
                                if(!stockList.length){
                                    return Toast.open('当前时段不可叫货')
                                }
                                dispatch(changeNeededStockList({
                                    list: stockList.filter(item => item.showValue),
                                    tabValue: tabValue === '海盐货' ? `${tabValue}-${subTabValue}` : tabValue,
                                }))
                                Taro.navigateTo({
                                    url: '/pages/subPages/pages/order/index'
                                })
                                // dispatch(saveCallStockList({
                                //     date: getTomorrowDate(),
                                //     tabValue: tabValue === '海盐货' ? `${tabValue}-${subTabValue}` : tabValue,
                                //     list: stockList.filter(item => item.showValue),
                                //     weekStr,
                                // }, () => {
                                //     setIsAdd(true)
                                //     setTableNumber(0)
                                // }))
                            }}
                        >{tabValue === '海盐货' ? `${tabValue}-${subTabValue}` : tabValue}叫货</Button>
                    </View>
                </View>

            </FixedView>
            {
                open ?
                <Anticipate
                    open={open}
                    setOpen={setOpen}
                    shopName={shopName}
                    tomorrowDate={tomorrowDate}
                    tomorrow={tomorrow}
                    today_str={today_str}
                    dayType={dayType}
                    actualAmount={actualAmount}
                /> : ''
            }
            
            <AddStock
                tabValue={tabValue}
                weekStr={weekStr}
                open={addOpen}
                stockList={callAddStockList}
                isStaff={isStaff}
                tableNumber={tableNumber}

                setIsAdd={setIsAdd}
                setOpen={setAddOpen}
                changeItemFun={changeItemFun}
                setStockList={setStockList}
                setTableNumber={setTableNumber}
            />
            <BottomBar />

            <>
                {
                    currentPopItem.index !== undefined ?
                    createPortal(
                        <Popup 
                            open={true} 
                            placement="bottom" 
                            style={{ height: `${calc(500,'/',transUnit,2)}px` }} 
                            onClose={()=>changePopupItemFun()}
                        >
                            <View className='ys-stock-popup'>
                                <View className='popup-item'>
                                    <View className='item-date'></View>
                                    <View className='item-content'></View>
                                    <View className='item-number'>{currentPopItem.stockName}</View>
                                </View>
                                <View className='popup-item'>
                                    <View className='item-date'>{pop_yesterday}日</View>
                                    <View className='item-content'>库存 <View className='item-content-gray'>({currentPopItem.yesterdayTheoreticalNumber ? '手动更新' : '系统预测'})</View></View>
                                    <View className='item-number'>{currentPopItem.yesterdayNumber} {currentPopItem.stockUnit}</View>
                                </View>
                                <View className='popup-item'>
                                    <View className='item-date'>{pop_today}日</View>
                                    <View className='item-content'>入库</View>
                                    <View className='item-number'>{currentPopItem.todayNumber} {currentPopItem.stockUnit}</View>
                                </View>
                                <View className='popup-item'>
                                    <View className='item-date'></View>
                                    <View className='item-content'>预测消耗<View className='item-content-gray'>(+{calc(currentPopItem.todayPredictiveCoefficients,'*',100,0)}%)</View></View>
                                    <View className='item-number'>{currentPopItem.todayTheoreticalConsume} {currentPopItem.stockUnit}</View>
                                </View>
                                <View className='popup-divider'></View>
                                <View className='popup-item'>
                                    <View className='item-date'>{pop_tomorrow}日</View>
                                    <View className='item-content'>预测消耗<View className='item-content-gray'>(+{calc(currentPopItem.predictiveCoefficients,'*',100,0)}%)</View></View>
                                    <View className='item-number'>{currentPopItem.predictNumber} {currentPopItem.stockUnit}</View>
                                </View>
        
                            </View>
        
                        </Popup>,portalElement
                    ) : ''
                }
            </>
        </View>
    )
}
