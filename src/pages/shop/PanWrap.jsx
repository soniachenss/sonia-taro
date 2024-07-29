
import { useState  } from 'react'
import Taro  from '@tarojs/taro'
import { View } from '@tarojs/components'
import { Sidebar } from "@taroify/core"
import { Bars } from "@taroify/icons"
import { useSelector, useDispatch } from 'react-redux'
import {
    getShopStockList,
    getShopStockListFromCtgy,
    changeShopStockList,
} from '@/reducers/shop/action'


// const stockList = {
//     '全部': [
//         { stock_name: '101_全部', spec: '斤', predict_theoretical_number: '20', adjust: '-1' },
//         { stock_name: '102_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '103_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '104_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '105_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '106_全部', spec: '斤', predict_theoretical_number: '20', adjust: '-1' },
//         { stock_name: '107_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '108_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '109_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '110_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '111_全部', spec: '斤', predict_theoretical_number: '20', adjust: '-1' },
//         { stock_name: '112_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '113_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '114_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '115_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '116_全部', spec: '斤', predict_theoretical_number: '20', adjust: '-1' },
//         { stock_name: '117_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '118_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '119_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '120_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '121_全部', spec: '斤', predict_theoretical_number: '20', adjust: '-1' },
//         { stock_name: '122_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '123_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '124_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '125_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '126_全部', spec: '斤', predict_theoretical_number: '20', adjust: '-1' },
//         { stock_name: '127_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '128_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '129_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '130_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '131_全部', spec: '斤', predict_theoretical_number: '20', adjust: '-1' },
//         { stock_name: '132_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '133_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '134_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '135_全部', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//     ],
//     '每日盘点': [
//         { stock_name: '101_每日盘点', spec: '斤', predict_theoretical_number: '20', adjust: '-1' },
//         { stock_name: '102_每日盘点', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '103_每日盘点', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '104_每日盘点', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '105_每日盘点', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '106_每日盘点', spec: '斤', predict_theoretical_number: '20', adjust: '-1' },
//         { stock_name: '107_每日盘点', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '108_每日盘点', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '109_每日盘点', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '110_每日盘点', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//     ],
//     '生鲜品': [
//         { stock_name: '111_生鲜品', spec: '斤', predict_theoretical_number: '20', adjust: '-1' },
//         { stock_name: '112_生鲜品', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '113_生鲜品', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//     ],
//     '冷藏柜': [
//         { stock_name: '114_冷藏柜', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '115_冷藏柜', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '116_冷藏柜', spec: '斤', predict_theoretical_number: '20', adjust: '-1' },
//         { stock_name: '117_冷藏柜', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '118_冷藏柜', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '119_冷藏柜', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '120_冷藏柜', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//     ],
//     '冷冻品1': [
//         { stock_name: '121_冷冻品1', spec: '斤', predict_theoretical_number: '20', adjust: '-1' },
//         { stock_name: '122_冷冻品1', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '123_冷冻品1', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '124_冷冻品1', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '125_冷冻品1', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//     ],
//     '冷冻品2': [
//         { stock_name: '126_冷冻品2', spec: '斤', predict_theoretical_number: '20', adjust: '-1' },
//         { stock_name: '127_冷冻品2', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '128_冷冻品2', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//     ],
//     '冷冻品3': [
//         { stock_name: '129_冷冻品3', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '130_冷冻品3', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '131_冷冻品3', spec: '斤', predict_theoretical_number: '20', adjust: '-1' },
//         { stock_name: '132_冷冻品3', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '133_冷冻品3', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '134_冷冻品3', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//         { stock_name: '135_冷冻品3', spec: '筐', predict_theoretical_number: '100', adjust: '-21' },
//     ],
// }
import './pandian.scss'
import StockContent from './StockContent'


const PanWrap = (props) => {
    const {
        idFiledName,
        viewHeight,
        distance = 40,
        tabValue = 'QP',
        today_str,
        valueFieldName,
        className = '',
        changeDataRef,
    } = props
    const dispatch = useDispatch()
    const shopState = useSelector(state => state.shopState)
    const {
        shopStockCtgyList = [],
        shopCtgyName,
    } = shopState
    const ctgyList = [
        { storage_area: '全部' },
    ].concat(shopStockCtgyList)
    const ctgyIndex = ctgyList.findIndex(item => item.storage_area === shopCtgyName)
    

    // 侧边栏
    const [showSideBar, setShowSideBar] = useState(false)
    const changeBubbleShow = () => {
        setShowSideBar(!showSideBar)
    }



    // 处理触摸结束事件（用于触发上拉/下拉动作）
    const handleTouchEnd = () => {
        if(tabValue === 'QP'){
            const query = Taro.createSelectorQuery()
            query.select(`#${idFiledName}`).boundingClientRect()
            query.selectViewport().scrollOffset()
    
            query.exec(function (res) {
                if (res[0].top - 55 > distance) {
                    pullDownAction() //上一分类
                } else if (res[0].top - 55 < -distance) {
                    pullUpAction() //下一分类
    
                } else if (res[0].top - 55 === 0) {
                    // setScrollValue(scrollRef.current)
                }
            })
        }
        
    }
    // 下拉动作
    const pullDownAction = () => {
        // TODO: 刷新数据或执行其他下拉动作
        // if (ctgyIndex > 0) {
            Taro.showLoading({
                title: '加载中',
            })
            dispatch(changeShopStockList(changeDataRef.current))
            dispatch(getShopStockListFromCtgy({
                isJp: tabValue === 'JP',
                ctgyName: ctgyIndex > 0 ? ctgyList[ctgyIndex - 1].storage_area : '全部'
            }, () => {
                Taro.hideLoading()
            }))

            // setScrollValue(0)
        // } else {
        //     dispatch(getShopStockList({
        //         date: today_str,
        //         isJp: value === 'JP',
        //         ctgyName: '全部'
        //     }))
        //     dispatch(changeTabPageIsModify(false))
        // }
    }

    // 上拉动作
    const pullUpAction = () => {
        // TODO: 跳转到下一分类或执行其他上拉动作
        const nextIndex = ctgyIndex < ctgyList.length - 1 ? ctgyIndex + 1 : 0
        Taro.showLoading({
            title: '加载中',
        })
        dispatch(changeShopStockList(changeDataRef.current))
        // setScrollValue(0)
        dispatch(getShopStockListFromCtgy({
            date: today_str,
            isJp: tabValue === 'JP',
            ctgyName: ctgyList[nextIndex].storage_area
        }, () => {
            Taro.hideLoading()
        }))

    }
    
    


    return (
        <View 
            className={`ys-stock-container ${className}`} 
            onTouchEnd={handleTouchEnd}
        >
            {/* <View style={{ height: '80px' }} className='swiper-more'>
                {
                    ctgyIndex === 0 ?
                        <Text>已经到顶啦~</Text> :
                        <Text>下拉查看上一分类</Text>
                }
            </View> */}
            <StockContent 
                changeDataRef={changeDataRef}
                ctgyIndex={ctgyIndex}
                ctgyList={ctgyList}
                idFiledName={idFiledName}
                viewHeight={viewHeight}
                valueFieldName={valueFieldName}
                tabValue={tabValue}
            />
            
            {
                <View className={`stock-left ${showSideBar ? 'show' : ''}`}>
                    <Sidebar
                        value={shopCtgyName}
                        className="stock-left-sidebar"
                        onChange={(value) => {
                            // setScrollValue(0)
                            Taro.showLoading({
                                title: '加载中',
                            })
                            dispatch(changeShopStockList(changeDataRef.current))
                            dispatch(getShopStockListFromCtgy({
                                isJp: tabValue === 'JP',
                                ctgyName: value
                            }, () => {
                                Taro.hideLoading()
                            }))
                        }}
                    >
                        {
                            ctgyList.map((v) => {
                                return <Sidebar.Tab value={v.storage_area}>{v.storage_area}</Sidebar.Tab>
                            })
                        }
                    </Sidebar>

                </View>
            }

            <View
                className={`floating-bubble ${showSideBar ? 'floating-bubble-show' : 'floating-bubble-hide'}`}
                onClick={changeBubbleShow}
            >
                <Bars />
            </View>
        </View>
    );
};

export default PanWrap;