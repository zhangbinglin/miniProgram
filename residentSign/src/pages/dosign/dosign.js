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
        teamId: '',
        phoneNo: '',
        packagesName: '请查看'
    },
    editPhoneNo(e) {
        this.setData({
            phoneNo: e.detail.value
        })
    },
    gotoSelectAddress(e) {
        if (this.data.phoneNo && /^1[34578]\d{9}$/.test(this.data.phoneNo)) {
            wx.navigateTo({
                url: '../city-picker/city-picker'
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '手机号码格式有误',
                showCancel: false
            })
        }
    },
    gotoSelectHomeDoctor(e) {
        if (this.data.addressValue !== '请输入') {
            wx.navigateTo({
                url: '../selectdoctorteam/selectdoctorteam'
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '请先输入地址',
                showCancel: false
            })
        }
    },
    gotoSelectPackages(e) {
        if (this.data.teamId) {
            wx.navigateTo({
                url: '../selectpackages/selectpackages?teamId=' + this.data.teamId
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '请先选择家庭医生',
                showCancel: false
            })
        }
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
        if (app.globalData.doctorTeamInfo.teamId) {
            this.setData({
                teamId: app.globalData.doctorTeamInfo.teamId,
                doctorNameAndteamName: app.globalData.doctorTeamInfo.doctorNameAndteamName,
                orgName: app.globalData.doctorTeamInfo.orgName
            })
        }
        if (app.globalData.selectedPackagesInfo) {
            let tempArr = Object.values(app.globalData.selectedPackagesInfo)
            let spPackNameArr = []
            tempArr.forEach(item => {
                spPackNameArr.push(item.spPackName)
            })
            this.setData({
                packagesName: spPackNameArr.join(' ')
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
