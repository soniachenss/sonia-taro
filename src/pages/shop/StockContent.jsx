import { useState, useEffect, useCallback, useRef } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text, ScrollView, Swiper, SwiperItem } from '@tarojs/components'
import {  Empty } from "@taroify/core"
import { WarningOutlined } from "@taroify/icons"
import StockItem from '@/parts/Common/StockItem'
import { useSelector, useDispatch  } from 'react-redux'
import calc from '@/utils/calculate'
import {
    changeShopPopupIndex,
} from '@/reducers/shop/action'
const StockContent = (props) => {
    const {
        changeDataRef,
        viewHeight,
        idFiledName,
        valueFieldName,
        ctgyIndex,
        ctgyList,
        tabValue,
    } = props
    const dispatch = useDispatch()
    const shopState = useSelector(state => state.shopState)
    const keyBoardActiveValue = useSelector(state => state.homeState.keyBoardActiveValue)
    const systemInfo = useSelector(state => state.homeState.systemInfo)
    const {
        pageTabValue,
        shopStockList = [],
        allShopStockList = [],
        shopCtgyName,
        showPopIndex,
        sauceFault,
    } = shopState
    const [categories, setCtgyList] = useState([...shopStockList])
    const showValueList = shopStockList.map(item => item.predict_theoretical_number)
    useEffect(() => {
        setCtgyList([...shopStockList])
    }, [pageTabValue,shopCtgyName, ...showValueList])

    useEffect(() => {
        changeDataRef.current = [...allShopStockList]
    }, [allShopStockList.length])

    

    // 滚动处理
    const [scrollValue, setScrollValue] = useState(0)
    useEffect(() => {
        setScrollValue(0)
    }, [tabValue])
    const scrollRef = useRef({current: {}})
    const changePanItemData = useCallback(
        (data) => {
            // changeDataFun(data, () => {
            //     setScrollValue(scrollRef.current)
            // })
            setCtgyList(preState => {
                return preState.map(cur => {
                    if (cur._id === data.id) {
                        return {
                            ...cur,
                            [valueFieldName]: data[valueFieldName]
                        }
                    }
                    return cur
                }) 
            })
            changeDataRef.current = (changeDataRef.current || allShopStockList).map(cur => {
                if (cur._id === data.id) {
                    return {
                        ...cur,
                        [valueFieldName]: data[valueFieldName]
                    }
                }
                return cur
            })
           scrollRef.current.scrollTop && setScrollValue(scrollRef.current.scrollTop)
        },
        [scrollRef.current.scrollTop],
    )
    const handleScroll = (e) => {
        scrollRef.current = e.detail
    }
    
    const screenWidth = systemInfo.screenWidth || 375
    const transUnit = calc(750,'/',screenWidth) //2
    const effectCallback = useCallback(
        (index) => {
            setTimeout(()=>{
                const winHeight = systemInfo.safeArea.height
                const domHeight = 200 / transUnit * index
                const keyboardHeight = 488 / transUnit
                const showAreaHeight = winHeight - keyboardHeight - 106 / transUnit
                const scrollTop = scrollRef.current.scrollTop || 0
                if(domHeight - scrollTop < showAreaHeight){
                    const value = domHeight - showAreaHeight + keyboardHeight - 160 / transUnit + 30
                    setScrollValue(value)
                }
            })
            
            
        },
        [scrollRef.current.scrollTop, screenWidth,transUnit ],
    )

    const changePopupIndexFun = useCallback(
        (value) => {
            dispatch(changeShopPopupIndex(value))
            setScrollValue(scrollRef.current.scrollTop)
        },
        [scrollRef.current.scrollTop],
    )
    // 今天消耗【实际消耗量】？相差【与理论消耗的差量】、【与理论消耗的差量百分比】，请检查！
    // 1、计算逻辑：
    // 【实际消耗量】=【期初库存】+【入库】-【实际库存】
    // 【与理论消耗的差量】=【实际消耗量】-【理论消耗量】
    // 【与理论消耗的偏差百分比】=【与理论消耗的差量】/【理论消耗量】
    // 2、颜色变化：
    // （1）【与理论消耗的差量】少于该货品的盘点容错值，或【与理论消耗的偏差百分比】偏差在正负容错百分比以内，不需要显示“纠偏提示”；
    // （2）1倍容错百分比<=｜【与理论消耗的偏差百分比】｜<2倍容错百分比,文字显示为橙色；（3）2倍容错百分比<=｜【与理论消耗的偏差百分比】｜,文字显示为红色。

    let sourceRealityNumber = 0, sourceTodayTheoreticalConsume = 0, stockUnit = ''
    let needShow = false //是否显示酱汁合计提示

    let sauceTotalValue = 0
    let sauceTotalPersent = 0

    const sauceNameArr = ['虾酱','蟹酱']
    const sauceList = categories.filter(item => sauceNameArr.indexOf(item.stock_name) > -1)

    sauceList.map(item => {
        const yesterdayNumber = item.yesterday_theoretical_number ? item.yesterday_theoretical_number : item.yesterday_gross_number || 0
        sauceTotalValue = calc(sauceTotalValue,'+',item.fault_tolerance_value) 
        sauceTotalPersent = calc(sauceTotalPersent,'+',item.fault_tolerance_persent) 
        sourceRealityNumber = calc(sourceRealityNumber, '+', calc(calc(yesterdayNumber,'+',item.today_number,2),'-',item.predict_theoretical_number,2), 2 )
        sourceTodayTheoreticalConsume = calc(sourceTodayTheoreticalConsume, '+', item.today_theoretical_consume,2)
        stockUnit = item.stock_unit
    })
    const sauceTotalPersent_every = calc(sauceTotalPersent, '/', sauceNameArr.length) //虾蟹合计容错百分比均值
    const sourceDiffConsume = calc(sourceRealityNumber,'-', sourceTodayTheoreticalConsume ,2)
    const sourcePoint = sourceTodayTheoreticalConsume ? calc(sourceDiffConsume, '/', sourceTodayTheoreticalConsume,4) : 0
    const sourceDiffPersent =  calc(sourcePoint,'*',100, 2)

    const sourceIsDangerous = Math.abs(sourcePoint) > calc(2,'*',sauceTotalPersent_every) ? true : false
    // 酱汁是否在合理范围
    const isUnLogical = Math.abs(sauceTotalValue) < Math.abs(sourceDiffConsume) && Math.abs(sauceTotalPersent_every) < Math.abs(sourcePoint)

    const pageContent = categories.map((item, index) => {
        
        const yesterdayNumber = item.yesterday_theoretical_number ? item.yesterday_theoretical_number : item.yesterday_gross_number || 0
        const realityNumber =  calc(calc(yesterdayNumber,'+', item.today_number, 2), '-',item.predict_theoretical_number, 2)
        const diffConsume = calc(realityNumber,'-', item.today_theoretical_consume, 2)
        const diffPoint = item.today_theoretical_consume ? calc(diffConsume, '/', item.today_theoretical_consume,4) : 0
        const diffPersent =  calc(diffPoint, '*', 100,2)
        const itemFaultValue = item.fault_tolerance_value
        const itemFaultPersent = item.fault_tolerance_persent
        // const itemFaultValue = sauceFault.get(item.stock_name)?.value
        // const itemFaultPersent = sauceFault.get(item.stock_name)?.persent
        
        const showWarning = Math.abs(diffConsume) > Math.abs(itemFaultValue) && Math.abs(diffPoint) > Math.abs(itemFaultPersent) ? true : false
        const isDangerous = Math.abs(diffPersent) >= calc(Math.abs(itemFaultPersent),'*',2,2) ? true : false
        let hideCheck = false //是否不显示请检查
        if(['虾酱','蟹酱'].indexOf(item.stock_name) > -1){
            needShow = showWarning || needShow
            hideCheck = !isUnLogical
        }
        return (
            <StockItem
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
                changeItemValue={changePanItemData}
                id={item._id}
                ysPageId={'shopPageId'}
                effectCallback={effectCallback}
                changePopupIndexFun={changePopupIndexFun}
                showPopIndex={showPopIndex}

                realityNumber={realityNumber}
                diffConsume={diffConsume}
                diffPersent={diffPersent}
                showWarning={showWarning}
                isDangerous={isDangerous}
                yesterdayNumber={yesterdayNumber}
                hideCheck={hideCheck}

            />
        )
    })
    useDidShow(() => {
        setCtgyList([...shopStockList])
    })
    return (
        <Swiper className='container-swiper' vertical={true} circular={false}>

                <SwiperItem
                    className='container-swiper-item'
                    id={idFiledName}
                >
                    <View style={{ height: `${160 / transUnit}px` }} className='swiper-more'>
                        {
                            tabValue === 'QP' ?
                            (
                                ctgyIndex === 0 ?
                                <Text>已经到顶啦~</Text> :
                                <Text>下拉查看上一分类</Text>
                            ) : ''
                            
                        }
                    </View>

                    <ScrollView
                        className='scroll-view'
                        scrollY
                        scrollWithAnimation
                        scrollTop={scrollValue}
                        onScroll={handleScroll}
                        id='scrollDom'
                    >
                        {
                            categories.length ?
                                pageContent :
                                <Empty>
                                    <Empty.Image />
                                    <Empty.Description>当前位置无数据</Empty.Description>
                                </Empty>
                        }
                        {
                            needShow ? 
                            <View className={`shop-item-warning ${sourceIsDangerous ? 'text-danger' : 'shop-item-warning-info'}`}>
                                <WarningOutlined /> 酱料合计消耗{sourceRealityNumber}{stockUnit},相差{sourceDiffConsume}{stockUnit}、{sourceDiffPersent}%,{isUnLogical? '请检查！' : '在合理范围内'}
                            </View> 
                            : ''
                        }
                        {
                            <View style={{ height: `${100 / transUnit}px` }} className='swiper-more'>
                                {
                                    tabValue === 'QP' ?
                                        (
                                            ctgyIndex === ctgyList.length - 1 ?
                                            <Text>已经到底啦~</Text> :
                                            <Text>上拉查看下一分类</Text>
                                        ) : ''
                                }

                            </View>
                        }
                        {
                            viewHeight ? <View style={{ height: `${viewHeight / transUnit}px` }}></View> : ''
                        }
                        {
                            keyBoardActiveValue ? <View style={{ height: `${160 / transUnit}px` }}></View> : ''
                        }
                    </ScrollView>

                </SwiperItem>
            </Swiper>
    );
};

export default StockContent;