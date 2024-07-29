import { memo, useRef, useCallback } from 'react'
import { createPortal } from "@tarojs/react";
import { View } from '@tarojs/components'
import {  Button, Toast, Popup } from "@taroify/core"
import { WarningOutlined, Arrow } from "@taroify/icons"
import { useSelector, useDispatch  } from 'react-redux'
import { getPreviousDay } from '@/utils/common'
import calc from '@/utils/calculate'
import YsInput  from '../YsInput'

import {
    changePageContentIsModify,
} from '@/reducers/home/action'

import './style.scss'
const StockItem = (props) => {
    const { 
        stockName,
        spec,
        predictTheoreticalNumber = 0, //今天实际库存
        stockUnit,
        yesterdayTheoreticalNumber = 0, //昨天实际库存
        // yesterdayGrossNumber = 0,       //昨天理论库存
        todayNumber = 0,                //今天入库
        todayTheoreticalConsume = 0,    //今天理论消耗
        predictGrossNumber = 0,         //今天理论库存
        date,
        index,
        className = '',
        id,
        changeItemValue,
        ysPageId,
        showPopIndex,
        effectCallback,
        changePopupIndexFun,

        realityNumber,
        diffConsume,
        diffPersent,
        showWarning,
        isDangerous,
        yesterdayNumber,
        hideCheck,

    } = props
    const dispatch = useDispatch()
    const isModify = useSelector(state => state.homeState.isModify)
    const systemInfo = useSelector(state => state.homeState.systemInfo)
    const screenWidth = systemInfo.screenWidth || 375
    const transUnit = calc(750,'/',screenWidth) 
    const decreaseFun = ()=>{
        if(!isModify){
            dispatch(changePageContentIsModify(true))
        }
        const hasPoint = String(predictTheoreticalNumber).includes('.')
        changeItemValue && changeItemValue({
            id,
            index,
            predict_theoretical_number: hasPoint ? Math.floor(Number(predictTheoreticalNumber)) : calc(Number(predictTheoreticalNumber),'-',1),
        })
    }
    const addFun = ()=>{
        if(!isModify){
            dispatch(changePageContentIsModify(true))
        }
        const hasPoint = String(predictTheoreticalNumber).includes('.')
        changeItemValue && changeItemValue({
            id,
            index,
            predict_theoretical_number: hasPoint ? Math.ceil(Number(predictTheoreticalNumber)) : calc(Number(predictTheoreticalNumber),'+',1),
        })
    }
    const today = date.slice(5)
    const yesterday = getPreviousDay(date)
    // const changeFun = (e)=>{
    //     if(!isModify){
    //         dispatch(changePageContentIsModify(true))
    //     }
    //     changeItemValue && changeItemValue({
    //         id,
    //         index,
    //         predict_theoretical_number: e.detail.value,
    //     })
        
    // }
    const changeFun = useCallback(
        (value)=>{
            if(!isModify){
                dispatch(changePageContentIsModify(true))
            }
            // const reg = /^(?:[1-9]\d*|0)?(\.\d+)?$/
            const str = `(^\\d{0,14}(\\.\\d{0,4})\?)$`;
			const reg = new RegExp(str);
            if(!reg.test(value)){
                Toast.open("数字不合法")
            }else{
                const _value = value.length > 0 && value[value.length-1] === '.'  || value == '' ? value : Number(value)
                changeItemValue && changeItemValue({
                    id,
                    index,
                    predict_theoretical_number: _value,
                })
            }
            
            
        },
        [isModify],
    )
    const inputRef = useRef(null)
    const handleFocus = (e) => {
        if(!e.detail.value || e.detail.value === '0'){
            changeItemValue && changeItemValue({
                id,
                index,
                predict_theoretical_number: '',
            })
        }
        // if (inputInstance) {
        //   // 延迟设置选中范围，确保输入框已经渲染并获取焦点
        //   setTimeout(() => {
        //     inputInstance.setSelectionRange(0, inputInstance.value.length)
        //   }, 0)
        // }
    }
    
    const portalElement = document.getElementById(ysPageId);
    // const yesterdayNumber = yesterdayTheoreticalNumber ? yesterdayTheoreticalNumber : yesterdayGrossNumber || 0
    // //【实际消耗量】=【期初库存】+【入库】-【实际库存】
    // const realityNumber =  calc(calc(yesterdayNumber,'+', todayNumber, 2), '-',predictTheoreticalNumber, 2)
    // // 【与理论消耗的差量】=【实际消耗量】-【理论消耗量】
    // const diffConsume = calc(realityNumber,'-', todayTheoreticalConsume, 2)
    // // 【与理论消耗的偏差百分比】=【与理论消耗的差量】/【理论消耗量】
    // const diffPersent = todayTheoreticalConsume ? calc(calc(diffConsume, '/', todayTheoreticalConsume,4), '*', 100,2) : 0
    // // console.log(diffConsume, todayTheoreticalConsume, diffPersent); 
    // const showWarning = Math.abs(diffPersent) > 5 ? true : false
    // const isDangerous = Math.abs(diffPersent) > 10 ? true : false



    return (
        <View className={`ys-shop-stock-item ${className}`} key={index}>
            <View className='item-top'>
                <View className="top-left">{stockName}</View>
                <View className="top-right">规格：{spec}</View>
            </View>
            <View className='item-bottom'>
                <View className='bottom-left'>
                    <View className='bottom-stepper'>
                        <Button 
                            color='primary'
                            size='small'
                            // color="default"
                            disabled={!predictTheoreticalNumber || predictTheoreticalNumber === '0'}
                            onClick={decreaseFun}
                        >
                            -
                        </Button>
                            <YsInput 
                                index={index}
                                value={predictTheoreticalNumber}
                                onChange={changeFun}
                                ysPageId={ysPageId}
                                effectCallback={effectCallback}
                            />
                        {/* <Input 
                            clear
                            cursor={-1}
                            ref={inputRef}
                            type="digit"
                            onFocus={handleFocus}
                            // defaultValue={predictTheoreticalNumber}
                            value={predictTheoreticalNumber}
                            onChange={changeFun}
                        /> */}
                        <Button 
                            color='primary'
                            size='small'
                            // color="default"
                            onClick={addFun}
                        >
                            +
                        </Button>
                    </View>
                    
                    {/* <Stepper 
                        value={predictTheoreticalNumber}
                        // step={1} 
                        size={30} 
                        className='ys-stepper'
                        onChange={(value)=>{
                            console.log('value',value);
                            changeItemValue && changeItemValue({
                                id,
                                predict_theoretical_number: value,

                            })
                        }}
                    /> */}
                    {stockUnit}
                 </View>
                <View 
                    className='bottom-right'
                    onClick={()=>changePopupIndexFun(index)}
                > <View className='content'><View className='label'>理论库存:</View><View className='ellipsis number'>{predictGrossNumber}{stockUnit}</View> </View><Arrow /></View>
            </View>
            {
                showWarning ?
                <View className={`item-warning ${isDangerous ? 'text-danger' : 'warning-info'}`}>
                    <WarningOutlined /> 今天消耗{realityNumber}{stockUnit},相差{diffConsume}{stockUnit}、{diffPersent}%{`${hideCheck ? '' : ',请检查'}`}
                </View> : ''
            }
            
            {
                showPopIndex === index ? 
                createPortal(
                <Popup 
                    open={true} 
                    placement="bottom" 
                    style={{ height: `${calc(500,'/',transUnit)}px` }} 
                    onClose={()=>changePopupIndexFun('')}
                >
                    <View className='ys-shop-popup'>
                        <View className='popup-item'>
                            <View className='item-date'></View>
                            <View className='item-content'></View>
                            <View className='item-number'>{stockName}</View>
                        </View>
                        <View className='popup-item'>
                            <View className='item-date'>{yesterday}日</View>
                            <View className='item-content'>库存 <View className='item-content-gray'>({yesterdayTheoreticalNumber ? '手动更新' : '系统预测'})</View></View>
                            <View className='item-number'>{yesterdayNumber} {stockUnit}</View>
                        </View>
                        <View className='popup-item'>
                            <View className='item-date'>{today}日</View>
                            <View className='item-content'>入库</View>
                            <View className='item-number'>{todayNumber} {stockUnit}</View>
                        </View>
                        <View className='popup-item'>
                            <View className='item-date'></View>
                            <View className='item-content'>理论消耗</View>
                            <View className='item-number'>{todayTheoreticalConsume} {stockUnit}</View>
                        </View>
                        <View className='popup-divider'></View>
                        <View className='popup-item'>
                            <View className='item-date'>{today}日</View>
                            <View className='item-content'>理论库存</View>
                            <View className='item-number'>{predictGrossNumber} {stockUnit}</View>
                        </View>

                    </View>

                </Popup>,portalElement) : ''
            }
            
        </View>
    );
};

export default memo(StockItem);