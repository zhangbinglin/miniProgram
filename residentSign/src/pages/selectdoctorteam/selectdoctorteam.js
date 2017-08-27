// 获取全局应用程序实例对象
const app = getApp()
let util = require('../../utils/util.js')
// 创建页面实例对象
Page({
    data: {
        name: '',
        teamId: '',
        teamName: '',
        teamLeaderId: '',
        orgTeam: [],
        orgName: '',
        orgId: '',
        teamCounts: '',
        docteams: [],
        selectorgShow: true,
        homedocteamShow: false,
        docteamdetailShow: false,
        doctorDetailInfoObj: {}
    },
    selectedOrganization(e) {
        wx.setNavigationBarTitle({
            title: '选择家医'
        })
        let orgId = e.currentTarget.dataset.orgid
        this.setData({
            orgId: orgId
        })
        util.commonAjax([orgId], 'pcn.teamService', 'getOrgVOByOrgId').then(res => {
            if (res.code === 200) {
                this.setData({
                    orgName: e.currentTarget.dataset.orgname,
                    teamCounts: res.body.teamCounts,
                    docteams: res.body.teams,
                    selectorgShow: false,
                    homedocteamShow: true,
                    docteamdetailShow: false
                })
            }
        })
    },
    selectedHomeDocteam(e) {
        wx.setNavigationBarTitle({
            title: '家医详情'
        })
        let teamInfo = e.currentTarget.dataset.teaminfo
        let params = ["hcn.shenzhen", teamInfo.teamId, teamInfo.teamLeaderId]
        util.commonAjax(params, 'pcn.residentSignService', 'getDoctorDetail').then(res => {
            if (res.code === 200) {
                let docTypeDic = ['', '全科医生', '全科护士', '公卫医生', '公卫护士', '计生医生', '中医师', '', '', '其他']
                let obj = {
                    avatarFileId: res.body.docInfo.avatarFileId,
                    name: res.body.docInfo.name,
                    docType: docTypeDic[parseInt(res.body.docInfo.docType)],
                    orgName: teamInfo.orgName,
                    teamName: teamInfo.teamName,
                    teamId: teamInfo.teamId,
                    teamLeaderId: res.body.teamLeaderId,
                    signNum: res.body.signNum,
                    phoneNo: res.body.docInfo.phoneNo,
                    docNum: res.body.docNum,
                    packNum: res.body.packNum,
                    imgReqUrl: 'http://122.224.131.235:9088/hcn-web/upload/'
                }
                this.setData({
                    name: res.body.docInfo.name,
                    teamId: teamInfo.teamId,
                    teamName: teamInfo.teamName,
                    teamLeaderId: res.body.teamLeaderId,
                    doctorDetailInfoObj: obj,
                    selectorgShow: false,
                    homedocteamShow: false,
                    docteamdetailShow: true
                })
            }
        })
    },
    selectedTeamId(e) {
        app.globalData.doctorTeamInfo = {
            teamId: this.data.teamId,
            doctorNameAndteamName: this.data.name + ' ' + this.data.teamName,
            orgName: this.data.orgName,
            orgId: this.data.orgId,
            teamLeaderId: this.data.teamLeaderId
        }
        wx.navigateBack({
            //   delta: 2
        })
    },
    onLoad(options) {
        let params = [{
            "areaId": options.streetCode
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
    onReady() {},
    onShow() {},
    onHide() {},
    onUnload() {},
    onPullDownRefresh() {}
})
