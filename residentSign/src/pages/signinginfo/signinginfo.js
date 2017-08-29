// const app = getApp()
let util = require('../../utils/util.js')
let tcity = require("../../utils/citys.js")
Page({
    data: {
        signingPersonInfo: {},
        imgReqUrl: 'http://122.224.131.235:9088/hcn-web/upload/',
        sexImg: ['../../assets/img/zbl_male.png', '../../assets/img/zbl_female.png'],
        personAge: '',
        addressValue: '',
        doctorNameAndteamName: '',
        orgName: '',
        applyId: '',
        applyDt: '',
        packagesName: '',
        applySignInfo: {},
        applyPackageInfo: [],
        signdetailShow: true,
        docteamdetailShow: false,
        packagesinfoShow: false,
        doctorDetailInfoObj: {},
        packagesInfoObj: {}
    },
    onLoad(options) {
        let personInfo = JSON.parse(options.personinfo)
        this.setData({
            signingPersonInfo: personInfo,
            personAge: new Date().getFullYear() - personInfo.dob.split('-')[0],
            applyId: personInfo.applyId
        })
        this.getDefaultAddress()
        this.getSignRecordDetail()
    },
    getSignRecordDetail() {
        let params = [this.data.applyId]
        util.commonAjaxKy(JSON.stringify(params), 'pcn.residentSignService', 'getSignRecordDetail')
            .then(res => {
                if (res.code === 200) {
                    let applySignInfo = res.body.applySignInfo
                    let applyPackageInfo = res.body.applyPackageInfo
                    let tempArr = []
                    applyPackageInfo.forEach(item => {
                        tempArr.push(item.serviceName)
                    })
                    this.setData({
                        applySignInfo: applySignInfo,
                        applyPackageInfo: applyPackageInfo,
                        doctorNameAndteamName: applySignInfo.doctorName + ' ' + applySignInfo.teamName,
                        orgName: applySignInfo.orgName,
                        applyDt: applySignInfo.applyDt,
                        packagesName: tempArr.join(' ')
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
    cancelSigning() {
        this.toastModal('确认取消吗?', true).then(() => {
            let params = [this.data.applyId]
            util.commonAjax(params, 'pcn.residentSignService', 'cancelSign')
                .then(res => {
                    if(res.code === 200) {
                        this.toastModal('取消成功', false).then(() => {
                            wx.reLaunch({
                              url: '../signstatus/signstatus'
                            })
                        })
                    } else {}
                })
        })
    },
    toastModal(content, isShowCancel = false) {
        return new Promise((resolve, reject) => {
            wx.showModal({
                title: '提示',
                content: content,
                showCancel: isShowCancel,
                success(res) {
                    if (res.confirm) {
                        resolve()
                    } else if (res.cancel) {}
                }
            })
        })
    },
    getDefaultAddress() {
        let that = this
        tcity.init(that)
        let addressDic = that.data.cityData
        let personInfo = this.data.signingPersonInfo
        let province = addressDic.filter(item => {
            return item.code === personInfo.province.slice(0, 6)
        })
        let city = province[0].sub.filter(item => {
            return item.code === personInfo.city.slice(0, 6)
        })
        let district = city[0].sub.filter(item => {
            return item.code === personInfo.district.slice(0, 6)
        })
        let params = `parentKey=${personInfo.district}&sliceType=4`
        let street = []
        util.areaAjax(params).then(res => {
            street = res.items.filter(item => {
                return item.key === personInfo.street
            })
        }).then(() => {
            let defaultAddress = province[0].name + city[0].name + district[0].name + street[0].text + personInfo.address
            this.setData({
                addressValue: defaultAddress
            })
        })
    },
    onReady() {},
    onShow() {
        // TODO: onShow
    },
    onHide() {},
    onUnload() {},
    onPullDownRefresh() {}
})
