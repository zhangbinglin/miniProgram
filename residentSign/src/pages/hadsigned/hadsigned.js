// 获取全局应用程序实例对象
// const app = getApp()
let util = require('../../utils/util.js')
// let tcity = require("../../utils/citys.js")
Page({
    data: {
        imgReqUrl: 'http://122.224.131.235:9088/hcn-web/upload/',
        signedPersonInfo: {},
        applyId: '',
        applySignInfo: {},
        applyPackageInfo: [],
        doctorNameAndteamName: '',
        orgName: '',
        hadsignedArr: [],
        signDate: '',
        signdetailShow: true,
        docteamdetailShow: false,
        packagesinfoShow: false,
        doctorDetailInfoObj: {},
        packagesInfoObj: {}
    },
    onLoad(options) {
        let personInfo = JSON.parse(options.personinfo)
        this.setData({
            signedPersonInfo: personInfo,
            applyId: personInfo.applyId
        })
        this.queryFamily()
        this.getSignRecordDetail()
    },
    tapSignedPerson(e) {
        this.setData({
            applyId: e.currentTarget.dataset.item.applyId
        })
        this.getSignRecordDetail()
    },
    queryFamily() {
        let params = ["hcn.shenzhen", 'cec402c4-4693-4d28-a0c8-6684a1a33dec']
        util.commonAjaxKy(JSON.stringify(params), 'pcn.residentSignService', 'queryFamily')
          .then(res => {
            if (res.code === 200) {
                let hadsignedArr = res.body.filter(item => {
                    return item.status === '2'
                })
              this.setData({
                hadsignedArr: hadsignedArr
              })
            }
          })
    },
    getSignRecordDetail() {
        let params = [this.data.applyId]
        util.commonAjaxKy(JSON.stringify(params), 'pcn.residentSignService', 'getSignRecordDetail')
            .then(res => {
                if (res.code === 200) {
                    let applySignInfo = res.body.applySignInfo
                    let applyPackageInfo = res.body.applyPackageInfo
                    this.setData({
                        applySignInfo: applySignInfo,
                        applyPackageInfo: applyPackageInfo,
                        doctorNameAndteamName: applySignInfo.doctorName + ' ' + applySignInfo.teamName,
                        orgName: applySignInfo.orgName,
                        signDate: res.body.signDate
                    })
                }
            })
    },
    selectedHomeDocteam(e) {
        wx.setNavigationBarTitle({
            title: '家医详情'
        })
        let applySignInfo = this.data.applySignInfo
        let params = ["hcn.shenzhen", applySignInfo.teamId, applySignInfo.doctorId]
        util.commonAjax(params, 'pcn.residentSignService', 'getDoctorDetail')
            .then(res => {
                if (res.code === 200) {
                    let docTypeDic = ['', '全科医生', '全科护士', '公卫医生', '公卫护士', '计生医生', '中医师', '', '', '其他']
                    let obj = {
                        avatarFileId: res.body.docInfo.avatarFileId,
                        name: res.body.docInfo.name,
                        docType: docTypeDic[parseInt(res.body.docInfo.docType)],
                        orgName: applySignInfo.orgName,
                        teamName: applySignInfo.teamName,
                        teamId: applySignInfo.teamId,
                        teamLeaderId: res.body.teamLeaderId,
                        signNum: res.body.signNum,
                        phoneNo: res.body.docInfo.phoneNo,
                        docNum: res.body.docNum,
                        packNum: res.body.packNum,
                        imgReqUrl: 'http://122.224.131.235:9088/hcn-web/upload/'
                    }
                    this.setData({
                        doctorDetailInfoObj: obj,
                        signdetailShow: false,
                        packagesinfoShow: false,
                        docteamdetailShow: true
                    })
                }
            })
    },
    selectedTeamId(e) {
        wx.setNavigationBarTitle({
            title: '家医服务'
        })
        this.setData({
            signdetailShow: true,
            packagesinfoShow: false,
            docteamdetailShow: false
        })
    },
    selectedPackagesInfo(e) {
        wx.setNavigationBarTitle({
            title: '服务包'
        })
        let obj = {
            packagesArr: this.data.applyPackageInfo
        }
        this.setData({
            packagesInfoObj: obj,
            signdetailShow: false,
            packagesinfoShow: true,
            docteamdetailShow: false
        })
    },
    goBack() {
        wx.setNavigationBarTitle({
            title: '家医服务'
        })
        this.setData({
            signdetailShow: true,
            packagesinfoShow: false,
            docteamdetailShow: false
        })
    },
    onReady() {},
    onShow() {},
    onHide() {},

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
