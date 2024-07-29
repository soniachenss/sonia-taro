// import { Fragment } from 'react'
// import { IndexList, } from "@taroify/core"
// import StockItem from '@/parts/Common/StockItem'

// const StockWrap = (props) => {
//     const {
//         setIndex,
//         indexRef,
//         customIndexList,
//         stockList,
//     } = props
//     return (
//         <IndexList
//             inner
//             ref={indexRef}
//             showSidebar={false}
//             sticky={false}
//             stickyOffsetTop={100}
//             onChange={(index, anchor) => {
//                 setIndex(index)
//                 // setTimeout(()=>{
//                 //     pageScrollTo({
//                 //         scrollTop: indexRef.current?.scrollTop,
//                 //         duration: 300
//                 //     })
//                 // })
//             }}
//         >
//             {customIndexList.map((item, index) => {
//                 return (
//                     <Fragment key={item}>
//                         <IndexList.Anchor index={item}></IndexList.Anchor>
//                         {
//                             stockList[item].map((item, index) => {
//                                 return (
//                                     <StockItem item={item}/>
//                                 )
//                             })
//                         }
//                     </Fragment>
//                 )
//             })}
//         </IndexList>
//     );
// };

// export default StockWrap;