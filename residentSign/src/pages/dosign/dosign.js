const app = getApp()
let util = require('../../utils/util.js')
let tcity = require("../../utils/citys.js")
Page({
    data: {
        dosignPersonInfo: {},
        imgReqUrl: 'http://122.224.131.235:9088/hcn-web/upload/',
        sexImg: ['../../assets/img/zbl_male.png', '../../assets/img/zbl_female.png'],
        personAge: '',
        provinceCode: '',
        cityCode: '',
        districtCode: '',
        streetCode: '',
        areaTextDetail: '',
        addressValue: '',
        doctorNameAndteamName: '请选择',
        orgName: '请输入',
        orgId: '',
        teamId: '',
        teamLeaderId: '',
        phoneNo: '',
        packagesName: '请查看',
        packagesInfo: [],
        isAgree: false,
        isDisabled: true,
        doctorTeamMembers: [],
        mpiId: '',
        applyUserMpiId: ''
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
                url: '../selectdoctorteam/selectdoctorteam?streetCode=' + this.data.streetCode
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
                                app.globalData.agreementContent = {
                                    content: result
                                }
                                wx.navigateTo({
                                    url: '../agreement/agreement' // 这里服务器返回的html代码无法在小程序中运行
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
            "address": this.data.areaTextDetail,
            "district": this.data.districtCode,
            "street": this.data.streetCode,
            "province": this.data.provinceCode,
            "city": this.data.cityCode,
            "signApply": {
                "signCycle": 1,
                "personGroup": null,
                "teamId": this.data.teamId,
                "status": 1,
                "mpiId": this.data.mpiId,
                "tenantId": "hcn.shenzhen",
                "tel": this.data.phoneNo,
                "orgId": this.data.orgId,
                "doctorId": this.data.teamLeaderId,
                "contactName": "",
                "applyDt": this.getCurrentDayTime(),
                "applyUser": this.data.applyUserMpiId, //账号主体的mpiId
                "contactPhone": ""
            },
            "pcnApplyPack": this.processSubmitPackagesInfo()
        }]
        console.log(params)
        util.commonAjax(params, 'pcn.residentSignService', 'confirmSign')
            .then(res => {
                if (res.code === 200) {
                    this.toastModal('提交成功')
                        .then(() => {
                            wx.navigateBack({})
                        })
                } else if (res.code === 0) {
                    this.toastModal(res.msg)
                        .then(() => {
                            wx.navigateBack({})
                        })
                } else if (res.code === 610) {
                    this.toastModal(res.msg)
                        .then(() => {
                            wx.navigateBack({})
                        })
                } else {
                    this.toastModal('服务出错啦，请重试')
                        .then(() => {
                            wx.navigateBack({})
                        })
                }
            })
    },
    processSubmitPackagesInfo() {
        let resultArr = []
        this.data.packagesInfo.forEach(item => {
            resultArr.push({
                serviceName: item.spPackName,
                personGroup: item.suitableObject,
                price: item.price,
                serviceId: item.spPackId,
                tenantId: "hcn.shenzhen"
            })
        })
        return resultArr
    },
    getCurrentDayTime() {
        let now = new Date()
        let year = now.getFullYear()
        let month = now.getMonth() + 1
        let date = now.getDate()
        let hour = now.getHours()
        let minu = now.getMinutes()
        let sec = now.getSeconds()
        if (month < 10) month = "0" + month
        if (date < 10) date = "0" + date
        if (hour < 10) hour = "0" + hour
        if (minu < 10) minu = "0" + minu
        if (sec < 10) sec = "0" + sec
        return year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec
    },
    toastModal(content) {
        return new Promise((resolve, reject) => {
            wx.showModal({
                title: '提示',
                content: content,
                showCancel: false,
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
        let personInfo = this.data.dosignPersonInfo
        let province = addressDic.filter(item => {
            return item.code === personInfo.province.slice(0,6)
        })
        let city = province[0].sub.filter(item => {
            return item.code === personInfo.city.slice(0,6)
        })
        let district = city[0].sub.filter(item => {
            return item.code === personInfo.district.slice(0,6)
        })
        let params = `parentKey=${personInfo.district}&sliceType=4`
        let street = []
        util.areaAjax(params).then(res => {
            street = res.items.filter(item => {
                return item.key === personInfo.street
            })
        }).then(() => {
            let defaultAddress = province[0].name + city[0].name + district[0].name + street[0].text +  personInfo.address
            this.setData({
                addressValue: defaultAddress
            })
        })
    },
    onLoad(options) {
        if (wx.getStorageSync('dosignPersonInfo')) {
            this.setData({
                dosignPersonInfo: JSON.parse(wx.getStorageSync('dosignPersonInfo')),
            })
            let personInfo = this.data.dosignPersonInfo
            this.setData({
                personAge: new Date().getFullYear() - personInfo.dob.split('-')[0],
                phoneNo: personInfo.phoneNo,
                mpiId: personInfo.mpiId
            })
        }
        util.commonAjaxKy(JSON.stringify([]), 'hcn.device', 'getAppInfoByDevice')
            .then(res => {
                if (res.code === 200) {
                    if (res.body.user.mpiId) {
                        this.setData({
                            applyUserMpiId: res.body.user.mpiId
                        })
                    } else {
                        this.toastModal('请先完善个人信息')
                    }
                }
            })
    },
    onReady() {},
    onShow() {
        if (app.globalData.userAddressInfo.streetCode) {
            let gUserAddressInfo = app.globalData.userAddressInfo
            this.setData({
                addressValue: gUserAddressInfo.compeleteAddress,
                provinceCode: gUserAddressInfo.provinceCode,
                cityCode: gUserAddressInfo.cityCode,
                districtCode: gUserAddressInfo.districtCode,
                streetCode: gUserAddressInfo.streetCode,
                areaTextDetail: gUserAddressInfo.areaTextDetail
            })
        } else {
            this.getDefaultAddress()
        }
        if (app.globalData.doctorTeamInfo.teamId) {
            let gDoctorTeamInfo = app.globalData.doctorTeamInfo
            this.setData({
                teamId: gDoctorTeamInfo.teamId,
                doctorNameAndteamName: gDoctorTeamInfo.doctorNameAndteamName,
                orgName: gDoctorTeamInfo.orgName,
                orgId: gDoctorTeamInfo.orgId,
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
                packagesInfo: tempArr,
                isDisabled: false
            })
        }
    },
    onHide() {},
    onUnload() {},
    onPullDownRefresh() {}
})
