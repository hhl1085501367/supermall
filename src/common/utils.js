// 防抖函数
export function debounce(func, delay) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    // 如果delay没传，settimeout也会在最后执行，自身带有一定的延时
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

// 格式化时间
export function formatDate(date, fmt) {
  // 获取年份
  // y+ -> 1个或者多个y
  // y* -> 0个或者多个
  // y? -> 0个或者一个
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  // 2.
  // M+ -> 正则表达式的
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

function padLeftZero (str) {
  return ('00' + str).substr(str.length);
};