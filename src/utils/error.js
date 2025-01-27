import { formatTime } from './common'
import { Toast } from "@taroify/core"
/**
 *
 * @param {string} name 错误名字
 * @param {string} action 错误动作描述
 * @param {string} info 错误信息，通常是 fail 返回的
 */
// eslint-disable-next-line
export const logError = (name, action, info ) => {
  if (!info) {
    info = 'empty'
  }
  let time = formatTime(new Date())
  if (typeof info === 'object') {
    info = JSON.stringify(info)
  }
  Toast.open(action)
  console.error(time, name, action, info)
}

