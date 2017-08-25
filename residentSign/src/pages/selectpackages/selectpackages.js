// 获取全局应用程序实例对象
// const app = getApp()
let util = require('../../utils/util.js')
// 创建页面实例对象
Page({
  data: {
    title: 'selectpackages'
  },
  onLoad(options) {
    let params = [{
      "spId": options.teamId,
      "spType": "2"
    }]
    console.log(params);
    util.commonAjax(params, 'pcn.pcnSpPackService', 'spPackList').then(res => {
      if (res.code === 200) {
        console.log(res.body)
      }
    })
  },
  onReady() {
    // TODO: onReady
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // TODO: onShow
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    // TODO: onHide
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // TODO: onUnload
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    // TODO: onPullDownRefresh
  }
})
