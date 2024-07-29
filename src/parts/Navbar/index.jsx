import { useState, useCallback } from 'react'
import { View } from '@tarojs/components'
// import Taro, { useLoad } from '@tarojs/taro'
import {  Navbar, ActionSheet } from "@taroify/core"
import { ShopOutlined, Arrow } from "@taroify/icons"
import { useSelector, useDispatch } from 'react-redux'
import {
    getShopInfo,
    changeCurrentShop,
} from '@/reducers/user/action'
import {
    changeKeyBoardShow,
} from '@/reducers/home/action'
import './index.scss'
const index = (props) => {
    const {
        successBack,
    } = props
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const homeState = useSelector(state => state.homeState)
    const userState = useSelector(state => state.userState)
    const {
        userShopList
    } = homeState
    const {
        currentShop
    } = userState
    return (
        <View className='ys-navbar' onClick={()=>dispatch(changeKeyBoardShow(''))}>
                <Navbar className='navbar-wrap'>
                    <Navbar.NavLeft 
                        icon={<ShopOutlined />}
                        onClick={()=>{
                            setOpen(!open)
                        }}
                    >
                        <ActionSheet 
                            open={open} 
                            onSelect={(value) => {
                                dispatch(getShopInfo(value.value,()=>{
                                    setOpen(false)
                                    dispatch(changeCurrentShop())
                                    successBack && successBack(value.value)
                                }))
                            }} 
                            onClose={setOpen}
                        >
                            {
                                userShopList.map(item => {
                                    return (
                                    <ActionSheet.Action value={item.self_entity_id} name={item.entity_name} />
                                    )
                                })
                            }
                        </ActionSheet>
                        {currentShop.entity_name} <Arrow />
                    </Navbar.NavLeft>
                    {/* <Navbar.Title>标题</Navbar.Title> */}
                    {/* <Navbar.NavRight /> */}
                </Navbar>
            </View>
            
    );
};

export default index;