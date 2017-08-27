// 获取全局应用程序实例对象
// const app = getApp()
let util = require('../../utils/util.js')
Page({
  data: {
    queryFamilyArr: [],
    queryFamilyArrStatus4: [],
    queryFamilyArrStatus12: [],
    imgReqUrl: 'http://122.224.131.235:9088/hcn-web/upload/'
  },
  waitForSign(e) {
    wx.setStorageSync('dosignPersonInfo', JSON.stringify(e.currentTarget.dataset.item))
    wx.navigateTo({
      url: '../dosign/dosign'
    })
  },
  tapSigningOrSigned(e) {
      let personInfo = e.currentTarget.dataset.personinfo
    //   wx.setStorageSync('dosignPersonInfo', JSON.stringify(personInfo))
      if(personInfo.status === '1') {
          wx.navigateTo({
            url: '../signinginfo/signinginfo?personinfo=' + JSON.stringify(personInfo)
          })
      } else if (personInfo.status === '2') {
          wx.navigateTo({
            url: '../signinginfo/signinginfo'
          })
      }

  },
  onLoad() {
    let params = ["hcn.shenzhen", 'cec402c4-4693-4d28-a0c8-6684a1a33dec']
    util.commonAjaxKy(JSON.stringify(params), 'pcn.residentSignService', 'queryFamily')
      .then(res => {
        if (res.code === 200) {
          console.log(res.body)
          // this.data.queryFamilyArr = res.body
          this.setData({
            queryFamilyArr: res.body
          })
          let that = this
          let tempArr12 = []
          let tempArr4 = []
          this.data.queryFamilyArr.forEach(item => {
            if (item.status === '1' || item.status === '2') { //2为签约完成，1为待签约
              tempArr12.push(item)
            } else {
              tempArr4.push(item)
            }
          })
          that.setData({
            queryFamilyArrStatus12: tempArr12
          })
          that.setData({
            queryFamilyArrStatus4: tempArr4
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // TODO: onReady
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

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
