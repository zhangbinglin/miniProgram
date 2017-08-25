// 获取全局应用程序实例对象
const app = getApp()
Page({
  data: {
    dosignPersonInfo: {},
    imgReqUrl: 'http://122.224.131.235:9088/hcn-web/upload/',
    sexImg: ['../../assets/img/zbl_male.png', '../../assets/img/zbl_female.png'],
    personAge: '',
    regionCode: '',
    addressValue: '请输入',
    doctorNameAndteamName: '请选择',
    orgName: '请输入',
    teamId: ''
  },
  gotoSelectPackages(e) {
    wx.navigateTo({
      url: '../selectpackages/selectpackages?teamId=' + e.currentTarget.dataset.teamid
    })
  },

  onLoad(options) {
    if (wx.getStorageSync('dosignPersonInfo')) {
      this.setData({
        dosignPersonInfo: JSON.parse(wx.getStorageSync('dosignPersonInfo')),
      })
      this.setData({
        personAge: new Date().getFullYear() - this.data.dosignPersonInfo.dob.split('-')[0]
      })
    }
  },

  onReady() {
    // TODO: onReady
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (app.globalData.userAddressInfo.regionCode) {
      this.setData({
        addressValue: app.globalData.userAddressInfo.compeleteAddress,
        regionCode: app.globalData.userAddressInfo.regionCode
      })
    }
    if(app.globalData.doctorTeamInfo.teamId) {
      this.setData({
        teamId: app.globalData.doctorTeamInfo.teamId,
        doctorNameAndteamName: app.globalData.doctorTeamInfo.doctorNameAndteamName,
        orgName: app.globalData.doctorTeamInfo.orgName
      })
    }
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
