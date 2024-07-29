// import { Fragment, useRef, useState } from 'react'
// import { RootPortal, ScrollView, View } from '@tarojs/components'
// import { IndexList, Stepper, Sidebar, ConfigProvider } from "@taroify/core"
// import { pageScrollTo } from '@tarojs/taro'
// import StockItem from '@/parts/Common/StockItem'

// import './index.scss'
// import StockWrap from './StockWrap'

// const PdContent = (props) => {
//     const {
//         needPortal,
//     } = props

//     const indexRef = useRef(null)
//     const customIndexList = ['分类1', '分类2', '分类3', '分类4', '分类5', '分类6']
//     const stockList = {
//         '': [
//             { name: '101_肉蟹煲', unit: '斤', number: '20', adjust: '-1' },
//             { name: '102_土豆', unit: '筐', number: '100', adjust: '-21' },
//             { name: '103_土豆', unit: '筐', number: '100', adjust: '-21' },
//             { name: '104_土豆', unit: '筐', number: '100', adjust: '-21' },
//             { name: '105_土豆', unit: '筐', number: '100', adjust: '-21' },
//         ],
//         '分类1': [
//             { name: '106_肉蟹煲', unit: '斤', number: '20', adjust: '-1' },
//             { name: '107_土豆', unit: '筐', number: '100', adjust: '-21' },
//             { name: '108_土豆', unit: '筐', number: '100', adjust: '-21' },
//             { name: '109_土豆', unit: '筐', number: '100', adjust: '-21' },
//             { name: '110_土豆', unit: '筐', number: '100', adjust: '-21' },
//         ],
//         '分类2': [
//             { name: '111_肉蟹煲', unit: '斤', number: '20', adjust: '-1' },
//             { name: '112_土豆', unit: '筐', number: '100', adjust: '-21' },
//             { name: '113_土豆', unit: '筐', number: '100', adjust: '-21' },
//         ],
//         '分类3': [
//             { name: '114_土豆', unit: '筐', number: '100', adjust: '-21' },
//             { name: '115_土豆', unit: '筐', number: '100', adjust: '-21' },
//             { name: '116_肉蟹煲', unit: '斤', number: '20', adjust: '-1' },
//             { name: '117_土豆', unit: '筐', number: '100', adjust: '-21' },
//             { name: '118_土豆', unit: '筐', number: '100', adjust: '-21' },
//             { name: '119_土豆', unit: '筐', number: '100', adjust: '-21' },
//             { name: '120_土豆', unit: '筐', number: '100', adjust: '-21' },
//         ],
//         '分类4': [
//             { name: '121_肉蟹煲', unit: '斤', number: '20', adjust: '-1' },
//             { name: '122_土豆', unit: '筐', number: '100', adjust: '-21' },
//             { name: '123_土豆', unit: '筐', number: '100', adjust: '-21' },
//             { name: '124_土豆', unit: '筐', number: '100', adjust: '-21' },
//             { name: '125_土豆', unit: '筐', number: '100', adjust: '-21' },
//         ],
//         '分类5': [
//             { name: '126_肉蟹煲', unit: '斤', number: '20', adjust: '-1' },
//             { name: '127_土豆', unit: '筐', number: '100', adjust: '-21' },
//             { name: '128_土豆', unit: '筐', number: '100', adjust: '-21' },
//         ],
//         '分类6': [
//             { name: '129_土豆', unit: '筐', number: '100', adjust: '-21' },
//             { name: '130_土豆', unit: '筐', number: '100', adjust: '-21' },
//             { name: '131_肉蟹煲', unit: '斤', number: '20', adjust: '-1' },
//             { name: '132_土豆', unit: '筐', number: '100', adjust: '-21' },
//             { name: '133_土豆', unit: '筐', number: '100', adjust: '-21' },
//             { name: '134_土豆', unit: '筐', number: '100', adjust: '-21' },
//             { name: '135_土豆', unit: '筐', number: '100', adjust: '-21' },
//         ],
//     }
//     const [index, setIndex] = useState(1)


//     return (
//         <View className='stock-body-wrap'>
//             <View className='stock-left'>
//                 <Sidebar
//                     value={index}
//                     className="stock-left-sidebar"
//                     onChange={(value) => {
//                         console.log('fff', value, indexRef.current.scrollTo);
//                         setIndex(value)
//                         indexRef.current?.scrollTo && indexRef.current.scrollTo(value)
//                     }}
//                 >
//                     {
//                         customIndexList.map((v) => {
//                             return <Sidebar.Tab>{v}</Sidebar.Tab>
//                         })
//                     }
//                 </Sidebar>
//             </View>
//             <View className='stock-right'>
//                 {
//                     needPortal ?
//                     <RootPortal className='ys-portal-index-bar'>
//                         {/* <ScrollView scrollY> */}
//                         <StockWrap 
//                             setIndex={setIndex}
//                             indexRef={indexRef}
//                             customIndexList={customIndexList}
//                             stockList={stockList}
//                         />
//                         {/* </ScrollView> */}
//                     </RootPortal> :
//                     <StockWrap 
//                         setIndex={setIndex}
//                         indexRef={indexRef}
//                         customIndexList={customIndexList}
//                         stockList={stockList}
//                     />
//                 }
                
//             </View>

//         </View>

//     );
// };

// export default PdContent;