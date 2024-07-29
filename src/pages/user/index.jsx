import { useEffect, useState } from 'react';
import { ScrollView, View, Text } from '@tarojs/components'
import { Avatar, ActionSheet, Navbar, Toast } from "@taroify/core"
import { SettingOutlined, ManagerOutlined } from "@taroify/icons"
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import BottomBar from '@/parts/BottomBar'
import './index.scss'
import { useDispatch, useSelector } from 'react-redux';
import {
    getAdminInfo,
    changeUserPageStatus,
} from '@/reducers/user/action'
import {
    loginOut,
    modifyLoginOpenId,
} from '@/reducers/home/action'
export default function Index() {

    const dispatch = useDispatch()
    const userState = useSelector(state => state.userState)
    const homeState = useSelector(state => state.homeState)


    const {
        adminList,
        shopList,
        shopChanged,
    } = userState
    const userInfo = homeState.userInfo || {}
    const [open, setOpen] = useState(false)
    const [refresherTriggered, setRefresherTriggered] = useState(false)
    const isAdmin = userInfo.is_admin === '是'

    useLoad(() => {
        dispatch(getAdminInfo())
        dispatch(changeUserPageStatus(false))

    })
    useDidShow(()=>{
        if(shopChanged){
            dispatch(getAdminInfo())
            dispatch(changeUserPageStatus(false))
        }
    })
    return (
        <>
            <Toast id="toast" duration='2000' />
            <View className='ys-navbar'><Navbar title="个人中心" /></View>
            <ScrollView
                className='ys-user'
                refresherEnabled
                onRefresherRefresh={() => {
                    setRefresherTriggered(true)
                    dispatch(getAdminInfo(() => {
                        setRefresherTriggered(false)
                    }))
                }}
                refresherTriggered={refresherTriggered}

            >


                <View className='user-info'>
                    <View className='info-avatar'>
                        <Avatar style={{ background: '#F0F6FF' }}>
                            <ManagerOutlined />
                        </Avatar>
                    </View>
                    <View className='info-msg'>
                        <View className='msg-name'>{userInfo.user_name}</View>
                        <View className='msg-phone'>手机号：{userInfo.phone}</View>
                    </View>
                    <View className='info-btn' onClick={() => setOpen(true)}>
                        <SettingOutlined />
                        设置
                    </View>
                </View>

                <ScrollView scrollY className='user-shops-wrap'>
                <View className='user-company'>
                    <View className='company-name'>长沙欢呼供应链有限公司</View>
                    <View className='company-admin'>信息管理员： {adminList.map(item => item.user_name).join('、')}</View>
                </View>
                <View className='user-shops'>
                    {
                        shopList.map((item, index) => {
                            return (
                                <View className='shops-item'>
                                    <View className='item-left'>
                                        <View>门店：{item.entity_name}</View>
                                        <View>叫货员： {(item.order_user_list || []).map(user => user.user_name).join('、')}</View>
                                    </View>
                                    {
                                        isAdmin ?
                                            <View
                                                className='item-right'
                                                onClick={() => {
                                                    Taro.navigateTo({
                                                        url: `/pages/subPages/pages/manage/index?key=${item.self_entity_id}`
                                                    });
                                                }}
                                            >
                                                <SettingOutlined /> 管理
                                    </View> : ''
                                    }

                                </View>
                            )
                        })
                    }

                </View>
                </ScrollView>
                <ActionSheet
                    className='ys-login-out-btn'
                    open={open}
                    onSelect={(e) => {
                        if (e.value === '1') {
                            Taro.clearStorage()
                            dispatch(modifyLoginOpenId({
                                // phone: homeState.phoneNumber,
                                openId: '',
                                dataId: userInfo._id
                            }))
                            dispatch(loginOut())
                            setOpen(false)
                        }
                    }}
                    onClose={setOpen}
                >
                    {/* <ActionSheet.Header>设置</ActionSheet.Header> */}
                    <ActionSheet.Action value="1" name="退出登录" />
                </ActionSheet>

                <BottomBar />
            </ScrollView>
        </>
    )
}
