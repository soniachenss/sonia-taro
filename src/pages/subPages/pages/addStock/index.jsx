import { useState, useRef } from 'react';
import Taro from '@tarojs/taro'
import { View,  ScrollView } from '@tarojs/components'

import { FixedView, Search, Button } from "@taroify/core"
import NavBar from '@/parts/NavBar'
import PanWrap from '../../../shop/PanWrap';

import './index.scss'
export default function Index() {
    
    const [value, setValue] = useState("")
    const changeDataRef = useRef(null) 
    return (
        <View className='ys-stock-add'>
            <NavBar 
                successBack={(shopId)=>{
                    // dispatch(getShopStockList({ date: today_str, isJp: tabValue === 'JP', shopId}))
                }}
            />
            <FixedView position="top">
                <Search
                    value={value}
                    placeholder="请输入搜索关键词"
                    onChange={(e) => setValue(e.detail.value)}
                />
            </FixedView>
            <PanWrap 
                changeDataRef={changeDataRef}
                idFiledName={'swiperAddStock'} 
                viewHeight={'70px'}
                distance={30}
                pageName={'addStock'}
                className='ys-stock-add-more'
                valueFieldName={'showValue'}
            />
            <FixedView position="bottom" className='bottom-btns'>
                <View className='bottom-btns-content'>
                    <Button
                        size='small'
                        onClick={() => {
                            Taro.switchTab({
                                url: `/pages/stock/index`
                            })
                        }}
                    >取消</Button>
                    <Button
                        color="primary"
                        size='small'
                        onClick={() => {
                            Taro.switchTab({
                                url: `/pages/stock/index`
                            })
                        }}
                    >追加</Button>
                </View>
            </FixedView>
        </View>
    )
}
