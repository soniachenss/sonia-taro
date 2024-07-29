export const formatNumber = (n) => {
    n = n.toString()
    return n[1] ? n : '0' + n
}
export const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
  
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }


export const  getTomorrowDate = () => {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    let formattedDate = tomorrow.toISOString().split('T')[0];
    return formattedDate;
}
export const getPreviousDay = (dateString) => {  
    // 首先，将给定的日期字符串转换为Date对象  
    // 注意：这里假设dateString是有效的日期字符串，比如 "2023-04-01"  
    const date = new Date(dateString);  
    
    // 然后，将日期减去一天的毫秒数（一天有24小时，每小时3600000毫秒，即24*3600000毫秒）  
    // 注意：直接减去毫秒数比使用setDate()方法更为直接，因为setDate()可能需要处理月份和年份的变化  
    date.setDate(date.getDate() - 1);  
    
    // 最后，将调整后的Date对象转换回你想要的日期格式  
    // 这里使用了toISOString()，它会返回一个ISO 8601格式的字符串（例如："2023-03-31T00:00:00.000Z"）  
    // 如果你想要一个不同的格式，你可能需要使用额外的库（如moment.js）或手动格式化字符串  
    // 例如，如果你只需要日期部分（"YYYY-MM-DD"），你可以这样做：  
    const year = date.getFullYear();  
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的  
    const day = String(date.getDate()).padStart(2, '0');  
    return `${month}-${day}`;  
  } 
export const getDayOfWeek = (date) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const dayIndex = date.getDay();
    return days[dayIndex];
}
let timeout;
export function debounce(func, wait=600, immediate=true) {

    return function () {
        let context = this;
        let args = arguments;
      
        if (timeout) {
            clearTimeout(timeout);
        }

        if (immediate) {
            var callNow = !timeout;
            timeout = setTimeout(() => {
                timeout = null;
            }, wait)

            if (callNow) func.apply(context, args)
        } else {
            timeout = setTimeout(function(){
                func.apply(context, args)
            }, wait);
        }
    }
}

export const throttle = (fn, delay=500) => {//函数节流 时间戳实现
    let preTime = 0;
    return (...args) => {
        const nowTime = Date.now();
        if(nowTime - preTime > delay) {
            preTime = Date.now();
            fn.apply(this, args);
        }
    }
}