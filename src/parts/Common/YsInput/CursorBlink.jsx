import React, { useState, useEffect, useRef } from 'react';
import { View } from '@tarojs/components'

const CursorBlink = () => {
    const [cursorVisible, setCursorVisible] = useState(true);
    const intervalRef = useRef(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCursorVisible(visible => !visible);
        }, 500); // 每500毫秒切换一次显示状态
        intervalRef.current = intervalId;
        return () => clearInterval(intervalRef.current);
    }, []);

    return (
        <View
            className='ys-cursor'
            style={{
                backgroundColor: cursorVisible ? '#000' : '#FFF'
            }}
        >

        </View>
    );
}

export default CursorBlink;