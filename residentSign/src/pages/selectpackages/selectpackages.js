// 获取全局应用程序实例对象
const app = getApp()
let util = require('../../utils/util.js')
// 创建页面实例对象
Page({
  data: {
    packagesArr: [],
    keepResultObj: {}
  },
  checkboxChange(e) {
      let spId = e.currentTarget.dataset.spid
      let packageInfo = e.currentTarget.dataset.packageinfo
      if(e.detail.value.length) {
          this.data.keepResultObj[spId] = packageInfo
    } else {
        delete this.data.keepResultObj[spId]
    }
    console.log(this.data.keepResultObj)
  },
  selectedPackages(e) {
      if(Object.keys(this.data.keepResultObj).length) {
          app.globalData.selectedPackagesInfo = this.data.keepResultObj
          wx.navigateBack({})
      } else {
          wx.showModal({
              title: '提示',
              content: '请至少选择一个服务包',
              showCancel: false
          })
      }
      console.log(app.globalData);
  },
  onLoad(options) {
    let params = [{
    //   "spId": options.teamId,
      "spId": '11',
      "spType": "2"
    }]
    util.commonAjax(params, 'pcn.pcnSpPackService', 'spPackList').then(res => {
      if (res.code === 200) {
        this.setData({
            packagesArr: res.body
        })
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
