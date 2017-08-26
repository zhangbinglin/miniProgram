const app = getApp()
let util = require('../../utils/util.js')
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
    teamId: '',
    teamLeaderId: '',
    phoneNo: '',
    packagesName: '请查看',
    isAgree: false,
    isDisabled: true,
    doctorTeamMembers: []
  },
  editPhoneNo(e) {
    this.setData({
      phoneNo: e.detail.value
    })
  },
  gotoSelectAddress(e) {
    if (this.data.phoneNo && /^1[34578]\d{9}$/.test(this.data.phoneNo)) {
      wx.navigateTo({
        url: '../citypicker/citypicker'
      })
    } else {
      this.toastModal('手机号码格式有误')
    }
  },
  gotoSelectHomeDoctor(e) {
    if (this.data.addressValue !== '请输入') {
      wx.navigateTo({
        url: '../selectdoctorteam/selectdoctorteam'
      })
    } else {
      this.toastModal('请先输入地址')
    }
  },
  gotoSelectPackages(e) {
    if (this.data.teamId) {
      wx.navigateTo({
        url: '../selectpackages/selectpackages?teamId=' + this.data.teamId
      })
    } else {
      this.toastModal('请先选择家庭医生')
    }
  },
  bindAgreeChange(e) {
    this.setData({
      isAgree: !this.data.isAgree
    })
  },
  checkAgreement(e) {
    if (!this.data.isDisabled) {
      //请求服务团队成员信息
      let requestTeamMemberParams = [this.data.teamId, this.data.teamLeaderId]
      util.commonAjax(requestTeamMemberParams, 'pcn.residentSignService', 'querySignDoctor')
        .then(res => {
          if (res.code === 200) {
            this.setData({
              doctorTeamMembers: res.body
            })
          }
        })
        .then(() => {
          let params = [{
            "signId": "",
            "teamId": this.data.teamId,
            "person": {
              "idCardType": this.data.dosignPersonInfo.idType,
              "personName": this.data.dosignPersonInfo.personName,
              "idCard": this.data.dosignPersonInfo.idOrNo,
              "phoneNo": this.data.phoneNo,
              "address": this.data.addressValue
            }
          }]
          util.commonAjax(params, 'pcn.signProtocalService', 'getSignProtocal')
            .then(res => {
              if (res.code === 200) {
                let teamMemberStr = ''
                this.data.doctorTeamMembers.forEach(item => {
                  teamMemberStr += item.name + ' '
                })
                let teamLeaderName = this.data.doctorNameAndteamName.split(' ')[0]
                let result = res.body.protocalText.replace(/%signTeamLeader%&nbsp;/g, teamMemberStr).replace(/%signTeamLeader%/g, teamLeaderName)
                console.log(result)
                app.global.agreementContent = {
                  content: result
                }
                wx.navigateTo({
                  url: '../agreement/agreement'  // 这里服务器返回的html代码无法在小程序中运行
                })
              }
            })
        })
    } else {
      this.toastModal('请填写完整信息')
    }
  },
  submit(e) {
    let params = [{
        "address": this.data.addressValue,
        "district": this.zbl_address.regionCode,
        "street": this.zbl_address.streetKeyCode,
        "province": this.zbl_address.parentCode,
        "city": this.zbl_address.cityCode,
        "signApply": {
            "signCycle": 1,
            "personGroup": null,
            "teamId": this.data.teamId,
            "status": 1,
            "mpiId": this.mpiId,
            "tenantId": "hcn.shenzhen",
            "tel": this.data.phoneNo,
            "orgId": this.orgId,
            "doctorId": this.data.teamLeaderId,
            "contactName": "",
            "applyDt": this.date,
            "applyUser": sessionStorage.getItem('zbl_applyUser'), //主人的mpiId
            "contactPhone": ""
        },
        "pcnApplyPack": packagesParamsArr
    }]
    commonAjax(params, 'pcn.residentSignService', 'confirmSign')
      .then(res => {
        if (res.code === 200) {

        } else if (res.code === 0) {
            this.toastModal(res.msg)
        } else if (res.code === 610) {
            this.toastModal(res.msg)
        } else {
          this.toastModal('服务出错啦，请重试')
        }
    })
  },
  toastModal(content) {
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: false
    })
  },
  onLoad(options) {
    if (wx.getStorageSync('dosignPersonInfo')) {
      this.setData({
        dosignPersonInfo: JSON.parse(wx.getStorageSync('dosignPersonInfo')),
      })
      this.setData({
        personAge: new Date().getFullYear() - this.data.dosignPersonInfo.dob.split('-')[0],
        phoneNo: this.data.dosignPersonInfo.phoneNo
      })
    }
  },
  onReady() {},
  onShow() {
    if (app.globalData.userAddressInfo.regionCode) {
      let gUserAddressInfo = app.globalData.userAddressInfo
      this.setData({
        addressValue: gUserAddressInfo.compeleteAddress,
        regionCode: gUserAddressInfo.regionCode
      })
    }
    if (app.globalData.doctorTeamInfo.teamId) {
      let gDoctorTeamInfo = app.globalData.doctorTeamInfo
      this.setData({
        teamId: gDoctorTeamInfo.teamId,
        doctorNameAndteamName: gDoctorTeamInfo.doctorNameAndteamName,
        orgName: gDoctorTeamInfo.orgName,
        teamLeaderId: gDoctorTeamInfo.teamLeaderId
      })
    }
    if (Object.keys(app.globalData.selectedPackagesInfo).length) {
      let tempObj = app.globalData.selectedPackagesInfo
      let tempArr = []
      for (let prop in tempObj) {
        tempArr.push(tempObj[prop])
      }
      let spPackNameArr = []
      tempArr.forEach(item => {
        spPackNameArr.push(item.spPackName)
      })
      this.setData({
        packagesName: spPackNameArr.join(' '),
        isDisabled: false
      })
    }
  },
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {}
})
