import { useRef, useEffect, useState, useCallback } from 'react';
import { View, ScrollView  } from '@tarojs/components'
import { Popup, Search, Button, Input } from "@taroify/core"
import calc from '@/utils/calculate'
import Item from './Item'


const AddStock = (props) => {
    const {
        open,
        stockList,
        isStaff,
        weekStr,
        tableNumber,
        tabValue,

        setIsAdd,
        setOpen,
        setStockList,
        setTableNumber,
        // decreaseFun,
        // addFun,
    } = props
    const [value, setValue] = useState("")
    const [showStockList, setShowStockList] = useState([...stockList])
    useEffect(() => {
        setShowStockList([...stockList])
    }, [JSON.stringify(stockList)])
    const showList = value ? showStockList.filter(item=> item.stock_name.indexOf(value) > -1) : showStockList
    const [scrollValue, setScrollValue] = useState(0)
    const scrollRef = useRef(null)
    const handleScroll = (e) => {
        scrollRef.current = e.detail.scrollTop
    }
    const changeItemFun = useCallback(
        (data) => {
            setShowStockList((preState) => {
                return preState.map(cur => {
                    if (cur._id === data.id) {
                        return {
                            ...cur,
                            showValue: data.showValue
                        }
                    }
                    return cur
                })
            })
            setScrollValue(scrollRef.current)
        },
        [],
    )


    const decreaseFun = useCallback(
        () => {
            const value = tableNumber - 1 < 0 ? 0 : tableNumber - 1
            changeStaffValue(value)
        },
        [tableNumber,weekStr],
    )
    const addFun = useCallback(
        () => {
            const value = tableNumber + 1
            changeStaffValue(value)
        },
        [tableNumber,weekStr],
    )
    const changeStaffValue = (value) => {
        setTableNumber(value)
        setShowStockList((preState) => {
            return preState.map(cur => {
                return {
                    ...cur,
                    showValue: calc(value, '*', Number(cur.number_step),2)
                }
            })
        })
    }
    return (
        <Popup
            open={open}
            closeable={true}
            placement="bottom"
            style={{ height: "85%" }}
            lock={true}
            className='ys-addstock-popup'
            onClose={() => {
                const newList = showStockList.filter(item => item.showValue)
                setStockList([...newList])
                if(newList.length){
                    setIsAdd(false)
                }
                setOpen(false)
            }}
        >
            <View className='addstock-search'>
                <Search
                    value={value}
                    placeholder="请输入搜索关键词"
                    onChange={(e) => setValue(e.detail.value)}
                />
            </View>
            {
                tabValue === '员工餐' ?
                    <View className='stock-sub-table'>
                        <View>用餐桌数：</View>
                        <View className='ys-stepper'>
                            <Button
                                size='small'
                                color="default"
                                // disabled={!predictTheoreticalNumber}
                                onClick={decreaseFun}
                            >
                                -
                            </Button>
                            <Input
                                type="number"
                                // defaultValue={predictTheoreticalNumber}
                                value={tableNumber}
                            // onChange={changeFun}
                            />
                            <Button
                                size='small'
                                color="default"
                                onClick={addFun}
                            >
                                +
                            </Button>
                        </View>

                    </View> : ''
            }

            <ScrollView 
                scrollY
                scrollTop={scrollValue}
                onScroll={handleScroll}
                className='add-wrap'
            >
                {
                    showList.map((item) => {
                        return (
                            <Item
                                id={item._id}
                                stockName={item.stock_name}
                                spec={item.spec}
                                showValue={item.showValue}
                                actualNumber={item.actual_number}
                                stockUnit={item.stock_unit}
                                numberStep={item.number_step}
                                predictNumber={item.predict_number}
                                latestCheckTime={item.latest_check_time_str}
                                changeItemValue={changeItemFun}
                                isStaff={isStaff}
                                tableNumber={tableNumber}

                            />
                        )
                    })
                }
            </ScrollView>
        </Popup>
    );
};

export default AddStock;