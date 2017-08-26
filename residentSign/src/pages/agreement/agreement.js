const app = getApp()

Page({
  data: {
    agreementContent: ''
  },
  onLoad (options) {
    this.setData({
      agreementContent: app.globalData.agreementContent.content
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    // TODO: onShow
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
    // TODO: onHide
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {
    // TODO: onUnload
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // TODO: onPullDownRefresh
  }
})
