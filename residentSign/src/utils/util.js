let base = 'http://122.224.131.235:9090'

function commonAjax(params, ServiceId, ServiceMethod) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${base}/pcn-core/*.jsonRequest`,
      method: 'POST',
      data: params,
      header: {
        "X-Access-Token": '55cf67c7-0933-4ed3-b5f6-6fb6e52467bc',
        "X-Service-Id": ServiceId,
        "X-Service-Method": ServiceMethod,
        "Content-Type": "application/json"
      },
      success: function(res, error) {
        res.data ? resolve(res.data) : reject(error)
      }
    })
  })
}

function commonAjaxKy(params, ServiceId, ServiceMethod) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${base}/pcn-core/dataProxyController/hcnJsonRequestProxy?short_url=*.jsonRequest&params=${params}`,
      method: 'POST',
      data: {},
      header: {
        "X-Access-Token": '55cf67c7-0933-4ed3-b5f6-6fb6e52467bc',
        "X-Service-Id": ServiceId,
        "X-Service-Method": ServiceMethod,
        "Content-Type": "application/json"
      },
      success: function(res, error) {
        res.data ? resolve(res.data) : reject(error)
      }
    })
  })
}

function areaAjax(params) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${base}/pcn-core/dataProxyController/dictionaryServiceProxy?short_url=hcn.base.dictionary.region.dic?${params}`,
        data: {},
        header: {
          "X-Access-Token": '55cf67c7-0933-4ed3-b5f6-6fb6e52467bc',
          "Content-Type": "application/json"
        },
        success: function(res, error) {
          res.data ? resolve(res.data) : reject(error)
        }
      })
    })
}


// function formatTime(date) {
//   var year = date.getFullYear()
//   var month = date.getMonth() + 1
//   var day = date.getDate()
//
//   var hour = date.getHours()
//   var minute = date.getMinutes()
//   var second = date.getSeconds()
//
//
//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }
//
// function formatNumber(n) {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }

module.exports = {
  commonAjax: commonAjax,
  commonAjaxKy: commonAjaxKy,
  areaAjax: areaAjax
}
