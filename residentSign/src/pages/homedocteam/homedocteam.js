// 获取全局应用程序实例对象
// const app = getApp()
let util = require('../../utils/util.js')
// 创建页面实例对象
Page({
  data: {
    docteams: [],
    teamCounts: '',
    orgName: ''
  },
  selectedHomeDocteam(e) {
    let teamInfo = e.currentTarget.dataset.teaminfo
    let params = "hcn.shenzhen" + '_' + teamInfo.teamId + '_' + teamInfo.teamLeaderId
    wx.navigateTo({
      url: '../docteamdetail/docteamdetail?reqParams=' + params
    })
  },
  onLoad(options) {
    let params = [options.orgId]
    util.commonAjax(params, 'pcn.teamService', 'getOrgVOByOrgId').then(res => {
      if (res.code === 200) {
        this.setData({
          orgName: options.orgName,
          teamCounts: res.body.teamCounts,
          docteams: res.body.teams
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
