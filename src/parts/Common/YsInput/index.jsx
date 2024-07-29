import {  useCallback } from 'react'
import { createPortal } from "@tarojs/react";
import { View, Input } from '@tarojs/components'
import {  NumberKeyboard,  } from "@taroify/core"
import { useSelector, useDispatch  } from 'react-redux'

import CursorBlink from './CursorBlink'
import './style.scss'
import {
    changeKeyBoardShow,
} from '@/reducers/home/action'
const YsInput = (props) => {
    const {
        className='',
        value,
        onChange,
        index,
        ysPageId = 'shopPageId',
        effectCallback,
    } = props

    const dispatch = useDispatch()
    const keyBoardActiveValue = useSelector(state => state.homeState.keyBoardActiveValue)

    const onKeyPress = (key)=>{
        let result = ''
        if([1,2,3,4,5,6,7,8,9,0,'.'].indexOf(key) > -1){
            result=`${value}${key}`
            onChange(result)
        }else if(key === '清空'){
            result = ''
            onChange(result)
        }
        
    }
    const deleteLast = () => {
        const _value = typeof value === 'number' ? value.toString() : value
        onChange(_value.slice(0,-1))
    }


    // const [openIndex, setOpenIndex] = useState(keyBoardActiveValue)
    const portalElement = document.getElementById(ysPageId);
    return (
        <View className={`ys-number-input ${className}`} key={index}>
            {
                keyBoardActiveValue === index ?
                <View className='ys-keyboard-mask' 
                    onClick={(e)=>{
                        e.stopPropagation()
                        dispatch(changeKeyBoardShow(''))
                        if(!value){
                            onChange(0)
                        }
                    }}
                    onTouchStart={()=>{
                        dispatch(changeKeyBoardShow(''))
                        if(!value){
                            onChange(0)
                        }
                    }}
                ></View> : ''
            }
             
            <View className='taroify-input ys-input' onClick={(e)=>{
                e.stopPropagation()
                effectCallback && effectCallback(index)
                if(value <= 0 || value === '0' || typeof value === 'string' && value.indexOf('-')> -1 ){
                    onChange('')
                }
                dispatch(changeKeyBoardShow(index))
            }}>
                <View>{value}</View>
                {
                    keyBoardActiveValue === index ? 
                    <CursorBlink /> : ''
                }
            </View>
            {/* <Input 
                className='taroify-input ys-input'
                focus={open}
                cursor={-1}
                ref={inputRef}
                value={value}
                onFocus={handleFocus}
                bindinput={(e)=>{
                    console.log(e);
                }}
                // onBlur={()=>setOpen(false)}
            /> */}
            {
                keyBoardActiveValue === index &&
                createPortal(
                    <View onClick={(e)=>e.stopPropagation()}>
                       
                        <NumberKeyboard
                            // value={value}
                            open={keyBoardActiveValue === index}
                            extraKey={[".","清空"]}
                            onKeyPress={onKeyPress}
                            onHide={() => dispatch(changeKeyBoardShow(''))}
                            onBackspace={()=> deleteLast()}
                        >
                            <NumberKeyboard.Sidebar>
                                <NumberKeyboard.Key size="large" code="backspace"/>
                                <NumberKeyboard.Key size="large" code="keyboard-hide" color="blue">
                                    完成
                                </NumberKeyboard.Key>
                            </NumberKeyboard.Sidebar>
                        </NumberKeyboard>
                    </View>,
                    portalElement
                )
            }
            
        </View>
        
    );
};

export default YsInput;