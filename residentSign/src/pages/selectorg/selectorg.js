// 获取全局应用程序实例对象
// const app = getApp()
let util = require('../../utils/util.js')
// 创建页面实例对象
Page({
  data: {
    orgTeam: []
  },
  selectedOrganization(e) {
    wx.navigateTo({
      url: '../homedocteam/homedocteam?orgId=' + e.currentTarget.dataset.orgid + '&orgName=' + e.currentTarget.dataset.orgname
    })
  },
  onLoad() {
    let params = [{
      "areaId": '440303001000'
    }]
    util.commonAjax(params, 'pcn.searchOrgDeptTeamService', 'queryOrgsByAreaId')
      .then(res => {
        if (res.code === 200) {
          this.setData({
            orgTeam: res.body
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
