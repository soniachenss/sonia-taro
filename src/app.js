
import { useLaunch, useLoad } from '@tarojs/taro'
import { Provider } from "react-redux";
import './app.scss'
import configStore from "./store";
import { appLogin } from '@/reducers/home/action'

const store = configStore();
function App({ children }) {
//   useLaunch(() => {
//     const dispatch = useDispatch()
//     dispatch(appLogin())
//     console.log('App launched.')
//   })

  // children 是将要会渲染的页面
  return (
    <Provider store={store}>
        {children}
    </Provider>
  )
}

export default App
