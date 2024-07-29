import { useState } from 'react'
import { Tabbar } from "@taroify/core"
import Taro, { setStorageSync } from '@tarojs/taro'
import { FriendsOutlined, Logistics, ShopOutlined } from "@taroify/icons"
import { useDispatch, useSelector } from 'react-redux';
import './style.scss'

import {
    changeTabFun,
    changePageContentIsModify,
} from '@/reducers/home/action'

const BottomBar = () => {

    const dispatch = useDispatch()
    const homeState = useSelector(state => state.homeState)
    const {
        isModify,
        tabValue
    } = homeState
    return (
        <>
            <Tabbar 
                defaultValue={'shop'}
                value={tabValue}
                className="custom-color" 
                fixed
                // style={{height: 122}}
                onChange={(value)=>{
                    setStorageSync('pageStatus', 'INIT');
                    if(isModify){
                        Taro.showModal({
                            title: '提示',
                            content: '您在当前页面的更改尚未保存，切换将导致所有未保存的更改丢失，是否继续切换？',
                            success: function (res) {
                              if (res.confirm) {
                                dispatch(changeTabFun(value))
                                Taro.switchTab({
                                    url: `/pages/${value}/index`
                                });
                                dispatch(changePageContentIsModify(false))
                              } else if (res.cancel) {
                                
                              }
                            }
                          })
                    }else{
                        dispatch(changeTabFun(value))
                        Taro.switchTab({
                            url: `/pages/${value}/index`
                        });
                    }
                    
                }}
            >
                <Tabbar.TabItem value='shop' icon={<ShopOutlined />}>门店</Tabbar.TabItem>
                <Tabbar.TabItem value='stock' icon={<Logistics />}>叫货</Tabbar.TabItem>
                <Tabbar.TabItem value='user' icon={<FriendsOutlined />}>我的</Tabbar.TabItem>
            </Tabbar>
        </>
    );
};

export default BottomBar;