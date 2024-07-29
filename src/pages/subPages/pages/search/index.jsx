import { Fragment, useState, useCallback, useEffect, useRef } from 'react'
import { ScrollView, View, Text } from '@tarojs/components'
import Taro, { useUnload } from '@tarojs/taro'
import { Search, Navbar } from "@taroify/core"
import StockItem from '@/parts/Common/StockItem'
import { useSelector, useDispatch } from 'react-redux'
import calc from '@/utils/calculate'

import {
    changeShopStockList,
    changeShopPopupIndex,
} from '@/reducers/shop/action'
import {
    changePageContentIsModify,
    changeKeyBoardShow,
} from '@/reducers/home/action'
import './index.scss'
export default function Index() {
    const dispatch = useDispatch()
    const shopState = useSelector(state => state.shopState)
    const isModify = useSelector(state => state.homeState.isModify)
    const keyBoardActiveValue = useSelector(state => state.homeState.keyBoardActiveValue)
    const systemInfo = useSelector(state => state.homeState.systemInfo)

    const {
        allShopStockList = [],
        showPopIndex,
    } = shopState
    
    const [value, setValue] = useState("")
    const [searchList, setSearchList] = useState([])
    const valueList = allShopStockList.map(item => item.predict_theoretical_number)
    const onSearch = () => {
        if(value){
            const newList = allShopStockList.filter(item => item.stock_name.indexOf(value) > -1)
            setSearchList([...newList])
        }else{
            setSearchList([])
        }
        
    }
    const onClear = () => setSearchList([])
    // const changeDataFun = useCallback(
    //     (data) => {
    //         dispatch(changeShopStockListItem(data))
    //         if(!isModify){
    //             dispatch(changePageContentIsModify(true))
    //         }
            
    //     },
    //     [],
    // )
    const [scrollValue, setScrollValue] = useState(0)
    const scrollRef = useRef(null)
    const handleScroll = (e) => {
        scrollRef.current = e.detail.scrollTop
    }
    const changeDataFun = useCallback(
        (data) => {
            // dataModifiedFun && dataModifiedFun()
            if(!isModify){
                dispatch(changePageContentIsModify(true))
            }
            setSearchList(preState => {
                return preState.map(cur => {
                    if (cur._id === data.id) {
                        return {
                            ...cur,
                            predict_theoretical_number: data.predict_theoretical_number
                        }
                    }
                    return cur
                }) 
            })
            changeDataRef.current = (changeDataRef.current || allShopStockList).map(cur => {
                if (cur._id === data.id) {
                    return {
                        ...cur,
                        predict_theoretical_number: data.predict_theoretical_number
                    }
                }
                return cur
            })
           
            setScrollValue(scrollRef.current)
        },
        [scrollRef.current, isModify],
    )
    const changeDataRef = useRef(null)

    useEffect(() => {
        changeDataRef.current = [...allShopStockList]
    }, [allShopStockList.length])

    useEffect(() => {
        if(value){
            const newList = allShopStockList.filter(item => item.stock_name.indexOf(value) > -1)
            setSearchList([...newList])
        }
    }, [...valueList])
    useUnload(() => {
        dispatch(changeShopStockList(changeDataRef.current))
    })
    const handleClick = (event)=> {
        if(keyBoardActiveValue){
            dispatch(changeKeyBoardShow(''))
        }
        
    }
    const changePopupIndexFun = useCallback(
        (value) => {
            dispatch(changeShopPopupIndex(value))
        },
        [],
    )
    const effectCallback = useCallback(
        (index) => {
            
            setTimeout(()=>{
                const winHeight = systemInfo.safeArea.height
                const domHeight = 200 / transUnit * index
                const keyboardHeight = 488 / transUnit
                const showAreaHeight = winHeight - keyboardHeight - 106 / transUnit
                const scrollTop = scrollRef.current || 0
                if(domHeight - scrollTop < showAreaHeight){
                    const value = domHeight - showAreaHeight + keyboardHeight - 160 / transUnit
                    setScrollValue(value)
                }
            })
            
        },
        [scrollRef.current],
    )
    return (
        <View className='ys-search-page' id='searchPageId' catchMove>
            <View className='ys-navbar' onClick={handleClick}><Navbar title=""><Navbar.NavLeft onClick={()=>Taro.switchTab({url:'/pages/shop/index'})}>返回</Navbar.NavLeft></Navbar></View>
            <Search
                focus={true}
                clearTrigger='always'
                value={value}
                placeholder="请输入搜索关键词"
                onChange={(e) => setValue(e.detail.value)}
                action={<View onClick={() => Taro.switchTab({url: '/pages/shop/index'})} className='search-back'>返回</View>}
                onSearch={onSearch}
                onClear={onClear}
            />
            <ScrollView 
                className='search-page-content'
                scrollY
                scrollWithAnimation
                scrollTop={scrollValue}
                onScroll={handleScroll}
            >
                {
                    searchList.map((item,index) => {

                        const yesterdayNumber = item.yesterday_theoretical_number ? item.yesterday_theoretical_number : item.yesterday_gross_number || 0
                        //【实际消耗量】=【期初库存】+【入库】-【实际库存】
                        const realityNumber =  calc(calc(yesterdayNumber,'+', item.today_number, 2), '-',item.predict_theoretical_number, 2)
                        // 【与理论消耗的差量】=【实际消耗量】-【理论消耗量】
                        const diffConsume = calc(realityNumber,'-', item.today_theoretical_consume, 2)
                        // 【与理论消耗的偏差百分比】=【与理论消耗的差量】/【理论消耗量】
                        const diffPoint = item.today_theoretical_consume ? calc(diffConsume, '/', item.today_theoretical_consume,4) : 0
                        const diffPersent =  calc(diffPoint, '*', 100,2)

                        const itemFaultValue = item.fault_tolerance_value
                        const itemFaultPersent = item.fault_tolerance_persent

                        const showWarning = Math.abs(diffConsume) > Math.abs(itemFaultValue) || Math.abs(diffPoint) > Math.abs(itemFaultPersent) ? true : false
                        const isDangerous = Math.abs(diffPersent) >= calc(Math.abs(itemFaultPersent),'*',2,2) ? true : false
                        return (
                            <Fragment key={item}>
                                <StockItem 
                                    className='search-page-item'
                                    stockName={item.stock_name}
                                    spec={item.spec}
                                    predictTheoreticalNumber={item.predict_theoretical_number}
                                    stockUnit={item.stock_unit}
                                    predictGrossNumber={item.predict_gross_number}
                                    yesterdayTheoreticalNumber={item.yesterday_theoretical_number}
                                    // yesterdayGrossNumber={item.yesterday_gross_number}
                                    todayNumber={item.today_number}
                                    todayTheoreticalConsume={item.today_theoretical_consume}
                                    date={item.date_str}
                                    index={index}
                                    changeItemValue={changeDataFun}
                                    id={item._id}
                                    ysPageId={'searchPageId'}
                                    changePopupIndexFun={changePopupIndexFun}
                                    effectCallback={effectCallback}
                                    showPopIndex={showPopIndex}

                                    realityNumber={realityNumber}
                                    diffConsume={diffConsume}
                                    diffPersent={diffPersent}
                                    showWarning={showWarning}
                                    isDangerous={isDangerous}
                                    yesterdayNumber={yesterdayNumber}
                                />
                            </Fragment>
                        )
                    })
                }
            </ScrollView>
            
        </View>
    )
}
