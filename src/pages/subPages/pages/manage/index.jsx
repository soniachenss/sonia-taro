import { useState, useEffect } from 'react'
import { ScrollView, View, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { Input, FixedView, Button, Navbar } from "@taroify/core"
import { useDispatch, useSelector } from 'react-redux';
import './index.scss'
import { useRouter } from '@tarojs/taro';
import { DeleteOutlined } from "@taroify/icons"
import {
    modifyShopItem,
} from '@/reducers/user/action'
const ViewItem = (props) => {
    const {
        label,
        children
    } = props
    return (
        <View className='ys-form-item'>
            <View className='item-label'>{label}</View>
            <View className='item-content'>{children}</View>
        </View>
    )
}
export default function Index() {
    const dispatch = useDispatch()
    const router = useRouter()
    const key = router.params.key
    const userState = useSelector(state => state.userState)
    const {
        adminList,
        shopList,
        currentShop,
    } = userState
    const shopData = shopList.find(item => item.self_entity_id === key) || {}
    const _data = {
        ...shopData,
        order_user_list: [...(shopData.order_user_list || [])]
    }
    const [data, setData] = useState(_data)
    // useDidShow(() => {
    //     setData({..._data})
    // })
    return (
        <View className='ys-shop-manage'>
            <View className='ys-navbar'><Navbar title="门店管理" /></View>
            <ScrollView
                scrollY
                className='manage-scroll-wrap'
            >
            <View className='manage-admin'>
                <ViewItem label='信息管理员'>
                    <View className='admin-disable-input'>{adminList.map(item => item.user_name).join('、')}</View>
                </ViewItem>
            </View>
            <View 
                className='manage-form'
            >
                <ViewItem label='门店名称：'>
                    <Input
                        disabled={true}
                        placeholder="请输入"
                        className='ys-input-border'
                        value={data.entity_name}
                        onChange={(e) => setData({
                            ...data,
                            entity_name: e.detail.value
                        })}
                    />
                </ViewItem>
                <ViewItem label='门店ID：'>
                    <Input
                        disabled={true}
                        type="number"
                        className='ys-input-border'
                        placeholder="请输入"
                        value={data.self_entity_id}
                        onChange={(e) => setData({
                            ...data,
                            self_entity_id: e.detail.value
                        })}
                    />
                </ViewItem>
                <View 
                    className='form-list'
                >
                    <View className='list-title'>
                        叫货员：
                    </View>
                    <View className='list-content'>
                        {
                            (data.order_user_list || []).map((item, index) => {
                                return (
                                    <View className='content-item'>
                                        <View className='item-name'>
                                            <Input
                                                className='ys-input-border'
                                                placeholder="请输入"
                                                value={item.user_name}
                                                onChange={(e) => {
                                                    setData(draft => {
                                                        draft.order_user_list[index].user_name = e.detail.value
                                                        return { ...draft }
                                                    })
                                                }}
                                            />
                                        </View>
                                        <View className='item-phone'>
                                            <Input
                                                type="number"
                                                className='ys-input-border'
                                                placeholder="请输入"
                                                value={item.phone}
                                                onChange={(e) => {
                                                    setData(draft => {
                                                        draft.order_user_list[index].phone = e.detail.value
                                                        return { ...draft }
                                                    })
                                                }}
                                            />
                                        </View>
                                        <View
                                            className='item-delete'
                                            onClick={() => {
                                                setData(draft => {
                                                    draft.order_user_list.splice(index, 1)
                                                    draft.order_user_list = draft.order_user_list
                                                    return { ...draft }
                                                })
                                            }}
                                        ><DeleteOutlined /></View>
                                    </View>
                                )
                            })
                        }
                    </View>
                    <View
                        className='list-btn'
                        onClick={() => {
                            setData(draft => {
                                let newList = [...(draft.order_user_list || [])]
                                newList.push({
                                    id: '',
                                    phone: '',
                                    user_name: ''
                                })

                                draft.order_user_list = [...newList]
                                return { ...draft }
                            })
                        }}
                    >+添加叫货员</View>
                </View>
            </View>

            </ScrollView>
            
            <FixedView position="bottom" className='manage-btns'>
                <Button
                    color="default"
                    size={'small'}
                    onClick={() => Taro.switchTab({
                        url: `/pages/user/index`
                    })}
                >取消</Button>
                <Button
                    color="primary"
                    size={'small'}
                    onClick={() => {
                        dispatch(modifyShopItem({
                            data,
                            dataId: shopData._id
                        }))
                    }}
                >保存</Button>
            </FixedView>
        </View>
    )
}
