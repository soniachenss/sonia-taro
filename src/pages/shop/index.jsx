import { useRef,useCallback, useEffect } from 'react'
import { View } from '@tarojs/components'
import Taro, { useLoad, useDidShow, useDidHide, getStorageSync } from '@tarojs/taro'
import {  Button, Empty, FixedView, Toast } from "@taroify/core"
import { Search } from "@taroify/icons"
import { useSelector, useDispatch } from 'react-redux'
import BottomBar from '@/parts/BottomBar'
import NavBar from '@/parts/NavBar'
import {
    changeTabFun,
    changePageContentIsModify,
    changeKeyBoardShow,
} from '@/reducers/home/action'
import {
    getShopStockCtgy,
    getShopStockList,
    changeShopStockList,
    saveShopStockList,
    changeShopPageStatus,
    // getShopStockFaultValue,
} from '@/reducers/shop/action'
import PanWrap from './PanWrap'
// import IndexBar from './IndexBar'
import './index.scss'
function convertToT8(time) {
    const hoursToAdd = 8;
    const millisecondsToAdd = hoursToAdd * 60 * 60 * 1000; // 8小时转换为毫秒
    return new Date(time.getTime() + millisecondsToAdd);
}
export default function Index() {

    const dispatch = useDispatch()
    const userShopList = useSelector(state => state.homeState.userShopList)
    const tabValue = useSelector(state => state.shopState.pageTabValue)
    const allShopStockList = useSelector(state => state.shopState.allShopStockList)
    const isModify = useSelector(state => state.homeState.isModify)
    const shopChanged = useSelector(state => state.shopState.shopChanged)
    // const shopInfo = useSelector(state => state.userState.shopInfo)
    const currentShop = useSelector(state => state.userState.currentShop)
    const shopId = currentShop.self_entity_id
    // console.log('currentShop:',currentShop);
    const canEdit = userShopList.find(item => item.self_entity_id === shopId)
    const timeValue =  tabValue === 'JP' ? currentShop.latest_daily_check_time : currentShop.latest_all_check_time
    let modifyDate = ''
    if(timeValue){
        modifyDate = convertToT8(new Date(timeValue)).toISOString().split('T')[0]
    }


    const today = new Date();
    const today_str = today.toISOString().split('T')[0];
    const lastestDate = modifyDate;
    const showNotice = lastestDate === today_str
    // const showNotice = false

    // const [tabValue, setTabValue] = useState(pageTabValue)

    // 是否有修改
    // const [changed, setChanged] = useState(false)

    const changePageTab = (value) => {
        // setTabValue(value)
        if(isModify){
            Taro.showModal({
                title: '提示',
                content: '您在当前页面的更改尚未保存，切换将导致所有未保存的更改丢失，是否继续切换？',
                success: function (res) {
                  if (res.confirm) {
                    dispatch(getShopStockList({
                        date: today_str,
                        isJp: value === 'JP',
                        ctgyName: '全部'
                    }))
                    dispatch(changePageContentIsModify(false))
                  } else if (res.cancel) {
                    
                  }
                }
              })
        }else{
            dispatch(getShopStockList({
                date: today_str,
                isJp: value === 'JP',
                ctgyName: '全部'
            }))
        }
        
    }
    useLoad(() => {
        // if (phoneNumber) {
        //     // 获取门店盘点信息
            // dispatch(getShopInfo(currentShop.self_entity_id))
            dispatch(getShopStockCtgy({}))
            dispatch(getShopStockList({ date: today_str, isJp: true }))
            dispatch(changeShopPageStatus(false))
            // dispatch(getShopStockFaultValue())
        // } else {
        //     dispatch(appLogin(() => {
        //         dispatch(getShopStockCtgy({}))
        //         dispatch(getShopStockList({ date: today_str, isJp: true }))
        //     }))
        // }
    })
    useDidShow(()=>{
        dispatch(changeTabFun('shop'))
        const isInit = getStorageSync('pageStatus') === 'INIT'
        if(shopChanged || isInit){
            dispatch(getShopStockCtgy({}))
            dispatch(getShopStockList({ date: today_str, isJp: true }))
            dispatch(changeShopPageStatus(false))
            // dispatch(getShopStockFaultValue())
            Taro.removeStorage({key: 'pageStatus'})
        }
    })
    useDidHide(()=>{
        dispatch(changeShopStockList(changeDataRef.current))
    })




    const goToSearchPage = () => {
        dispatch(changeShopStockList(changeDataRef.current))
        Taro.navigateTo({
            url: `/pages/subPages/pages/search/index`
        });
    }

    // const changeDataFun = useCallback(
    //     (data, callback) => {
    //         dispatch(changeShopStockListItem(data))
    //         callback && callback()
    //         if(!isModify){
    //             dispatch(changePageContentIsModify(true))
    //         }
            
    //     },
    //     [],
    // )

    const changeDataRef = useRef(null) 
    useEffect(() => {
        changeDataRef.current = [...allShopStockList]
    }, [JSON.stringify(allShopStockList)])


    return (
        <>
            <View className='ys-shop' id='shopPageId'>
                
                <NavBar 
                    successBack={(shopId)=>{
                        dispatch(getShopStockCtgy({shopId}))
                        dispatch(getShopStockList({ date: today_str, isJp: tabValue === 'JP', shopId}))
                    }}
                />
                <Toast id="toast" duration='2000' />
                    <>
                        {
                            !allShopStockList.length ?
                                <>
                                    <Empty className='ys-shop-time-disabled'>
                                        <Empty.Image
                                            className='time-disabled-img'
                                            src={require('@/images/timeDisabled.jpg')}
                                        />
                                        <Empty.Description>当前时段不可纠偏</Empty.Description>
                                    </Empty>
                                    <BottomBar />
                                </> :
                                <>
                                    <FixedView position="top" className='shop-fixed-top' onClick={()=>dispatch(changeKeyBoardShow(''))}>

                                        <View className='shop-btn-line'>
                                            <View className="btn-left">
                                                <View className='btn-tab'>
                                                    <View className={`tab-item ${tabValue === 'JP' ? 'tab-item-active' : ''}`} onClick={() => changePageTab('JP')}>纠偏</View>
                                                    <View className={`tab-item ${tabValue === 'QP' ? 'tab-item-active' : ''}`} onClick={() => changePageTab('QP')}>全盘</View>
                                                </View>
                                            </View>
                                            <View className="btn-right" onClick={goToSearchPage}>
                                                <View className='btn-search'>
                                                    <Search />
                                                    <View>搜索</View>
                                                </View>
                                            </View>


                                        </View>

                                        {/* <Tabs className='shop-top-category' >
                                            {
                                                topCategory.map(item => {
                                                    return (
                                                        <Tabs.TabPane title={
                                                            <View className='list-item'>
                                                                <Avatar src="https://joesch.moe/api/v1/random" />
                                                                <View className='tab-name'>{item.name}</View>
                                                            </View>
                                                        }>
                                                        </Tabs.TabPane>
                                                    )
                                                })
                                            }

                                        </Tabs> */}

                                    </FixedView>
                                    <PanWrap
                                        changeDataRef={changeDataRef}
                                        idFiledName={'swiperCategory'}
                                        viewHeight={showNotice ? '380' : '300'}
                                        distance={40}
                                        tabValue={tabValue}
                                        today_str={today_str}
                                        valueFieldName={'predict_theoretical_number'}
                                        // changeDataFun={changeDataFun}
                                        className={showNotice ? 'ys-stock-index-notice' : 'ys-stock-index'}
                                        
                                    />
                                    {/* <PdContent needPortal={true}/> */}

                                    <FixedView position="bottom" className='ys-index-bottom-btns'>
                                        {
                                            showNotice ?
                                                <View className='bottom-btns-notice'>
                                                    {`今日已提交${tabValue === 'JP' ? '纠偏' : '全盘'}！`}
                                                </View> : ''
                                        }
                                        <View className='bottom-btns-wrap'>

                                            <View className='bottom-btns-left'>
                                                {/* 进度：{ }/30 <WarningOutlined /> */}
                                            </View>
                                            <View className='bottom-btns-right'>
                                            {/* <View className="btn-right" onClick={goToSearchPage}>
                                                <View className='btn-search'>
                                                    <Search />
                                                    <View>搜索</View>
                                                </View>
                                            </View> */}
                                                <Button
                                                    color="default"
                                                    size='small'
                                                    onClick={() => {
                                                        if(canEdit){
                                                            dispatch(saveShopStockList({ type: 'ZC',list: changeDataRef.current }, () => {
                                                                Toast.open("数据已暂存！",)
                                                                dispatch(changePageContentIsModify(false))
                                                            }))
                                                        }else{
                                                            Toast.open("暂存失败，没有权限",)
                                                        }
                                                        
                                                    }}
                                                >暂存</Button>
                                                <Button
                                                    color="primary"
                                                    size='small'
                                                    onClick={() => {
                                                        if(canEdit){
                                                            Taro.navigateTo({
                                                                url: `/pages/subPages/pages/check/index`
                                                            })
                                                            dispatch(changeShopStockList(changeDataRef.current))
                                                        }else{
                                                            Toast.open("纠偏失败，没有权限",)
                                                        }
                                                        
                                                        
                                                    }}
                                                >{`确认${tabValue === 'JP' ? '纠偏' : '全盘'}`}</Button>
                                            </View>
                                        </View>
                                    </FixedView>
                                    <BottomBar />
                                </>

                        }


                    </>
            </View>
        </>

    )
}
