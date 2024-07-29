import { memo, useCallback } from 'react'
import { View } from '@tarojs/components'
import {  Button, Input, } from "@taroify/core"
import { Arrow } from "@taroify/icons"
import calc from '@/utils/calculate'
import { useSelector, useDispatch } from 'react-redux'
import {
    changePredictCurrentItem,
} from '@/reducers/stock/action'
import {
    changePageContentIsModify,
} from '@/reducers/home/action'
import './index.scss'
const StockItem = (props) => {
    const { 
        index,
        className = '',
        id,
        date,
        stockName, 
        spec,
        showValue,
        actualNumber,
        stockUnit,
        numberStep = 1,
        latestCheckTime,
        changeItemValue,
        predictNumber,
        isStaff,
        tableNumber,
        yesterdayNumber,
        yesterdayTheoreticalNumber,
        todayNumber,
        todayTheoreticalConsume,
        stockSuggestion,
        todayPredictiveCoefficients,
        predictiveCoefficients,
    } = props

    const dispatch = useDispatch()
    const isModify = useSelector(state => state.homeState.isModify)
    const dataModifiedFun  = useCallback(
        () => {
            if(!isModify){
                dispatch(changePageContentIsModify(true))
            }
        },
        [isModify],
    )
    const decreaseFun = ()=>{
        const _showValue = isStaff ? calc(showValue,'-', 1,2) :  calc(showValue,'-', numberStep,2)
        changeItemValue && changeItemValue({
            id,
            showValue: _showValue
        })
        dataModifiedFun && dataModifiedFun()
    }
    const addFun = ()=>{
        const _showValue = isStaff ? calc(showValue,'+', 1,2) :  calc(showValue,'+', numberStep, 2)
        changeItemValue && changeItemValue({
            id,
            showValue: _showValue
        })
        dataModifiedFun && dataModifiedFun()
    }
    // const changeFun = (e)=>{
    //     changeItemValue && changeItemValue({
    //         id,
    //         index,
    //         showValue: e.detail.value,

    //     })
    // }

    const changePredictCurrentItemFun = ()=>{
        dispatch(changePredictCurrentItem({
            index,
            stockName,
            stockUnit,
            date: date,
            yesterdayNumber,
            yesterdayTheoreticalNumber,
            todayNumber,
            todayTheoreticalConsume,
            predictNumber,
            todayPredictiveCoefficients,
            predictiveCoefficients,
        }))
    }

    return (
        <View className={`ys-shop-jh-item ${className}`} key={id}>
            <View className='item-top'>
                <View className="top-left">{stockName}</View>
                <View className="top-right">
                    {
                        isStaff ? 
                        <>
                            {numberStep}{stockUnit} * {tableNumber}
                        </> : 
                        <View className='right-spec'>规格：{spec}</View>
                    }
                </View>
            </View>
            <View className='item-center'>
                <View className="center-left">
                    <View className='ys-stepper'>
                        <Button 
                            size='small'
                            color="primary"
                            disabled={!showValue || showValue === '0'}
                            onClick={decreaseFun}
                        >
                            -
                        </Button>
                        <Input 
                            disabled={true}
                            type="number"
                            // defaultValue={predictTheoreticalNumber}
                            value={showValue}
                            // onChange={changeFun}
                        />
                        <Button 
                            disabled={isStaff && showValue >= calc(numberStep, '*', tableNumber, 2)}
                            size='small'
                            color="primary"
                            onClick={addFun}
                        >
                            +
                        </Button>
                    </View>

                    {stockUnit}
                </View>
                <View className="center-right">
                    {
                        actualNumber !== null && actualNumber !== undefined  ?
                        <>
                            <View className='right-number'>最新库存：{actualNumber} {stockUnit}</View>
                            <View className='right-date'>(更新于{latestCheckTime.slice(5,16)})</View>
                        </> 
                        : ''
                    }
                </View>
            </View>
            {
                <View className='item-bottom'>
                    <View className='item-bottom-left'>
                        {
                            !isStaff && predictNumber ? 
                            <>
                                明日消耗：{predictNumber} {stockUnit}
                            </> :''
                        }
                        
                    </View>
                    <View 
                        className='item-bottom-right'
                        onClick={changePredictCurrentItemFun}
                    >
                        <View className='label'>叫货预测:</View> <View className='ellipsis number'>{stockSuggestion}</View> {stockUnit} <Arrow />
                    </View>
                </View>
            }
           
        </View>
    );
};

export default memo(StockItem);