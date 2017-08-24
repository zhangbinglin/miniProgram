// 获取全局应用程序实例对象
// let util = require('../../utils/util.js')

// 创建页面实例对象
Page({
  data: {
    // imgReqUrl: 'http://122.224.131.235:9088/hcn-web/upload/',
    // avatarFileId: '',
    // name: '',
    // docType: '',
    // orgName: '',
    // signNum: '',
    // teamName: '',
    // teamId: '',
    // phoneNo: '',
    // docNum: '',
    // packNum: ''
  },
  selectedTeamId(e) {
    //   let conveyTeamInfo = {
    //       teamId: this.data.teamId,
    //       doctorNameAndteamName: this.data.name + ' ' + this.data.teamName,
    //       orgName: this.data.orgName
    //   }
    //   wx.navigateTo({
    //     url: '../dosign/dosign?conveyTeamInfo=' + JSON.stringify(conveyTeamInfo)
    //   })
  },
  onLoad (options) {
    // let optionsArr = options.reqParams.split('--')
    // let params = optionsArr[0].split('_')
    // util.commonAjax(params, 'pcn.residentSignService', 'getDoctorDetail').then(res => {
    //   if (res.code === 200) {
    //     let docTypeDic = ['','全科医生','全科护士','公卫医生','公卫护士','计生医生','中医师','','','其他']
    //     this.setData({
    //         avatarFileId: res.body.docInfo.avatarFileId,
    //         name: res.body.docInfo.name,
    //         docType: docTypeDic[parseInt(res.body.docInfo.docType)],
    //         orgName: optionsArr[1],
    //         teamName: optionsArr[2],
    //         teamId: optionsArr[3],
    //         signNum: res.body.signNum,
    //         phoneNo: res.body.docInfo.phoneNo,
    //         docNum: res.body.docNum,
    //         packNum: res.body.packNum
    //     })
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    // TODO: onReady
  },

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
