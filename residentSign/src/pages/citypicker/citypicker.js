//index.js
//获取应用实例
let tcity = require("../../utils/citys.js")
let util = require("../../utils/util.js")
var app = getApp()
Page({
    data: {
        provinces: [],
        province: "",
        citys: [],
        city: "",
        countys: [],
        county: '',
        value: [0, 0, 0],
        values: [0, 0, 0],
        condition: false,
        areaAjaxResultArr: [],
        areaAjaxResultShow: false,
        selectedStreetText: '',
        countyCode: '440303',
        streetCode: '',
        areaTextDetail: ''
    },
    onInputTextarea(e) {
        this.setData({
            areaTextDetail: e.detail.value
        })
    },
    saveAddress(e) {
        if (this.data.selectedStreetText && this.data.areaTextDetail) {
            let compeleteAddress = this.data.province + this.data.city + this.data.county + this.data.selectedStreetText + this.data.areaTextDetail
            // 获取省编码
            let filterProvinces = this.data.cityData.filter(prov => {
                return prov.name === this.data.province
            })
            let provinceCode = filterProvinces[0].code + "000000"
            // 获取市编码
            let filterCitys = filterProvinces[0].sub.filter(city => {
                return city.name === this.data.city
            })
            let cityCode = filterCitys[0].code + "000000"
            // 获取区编码
            let filterDistricts = filterCitys[0].sub.filter(district => {
                return district.name === this.data.county
            })
            let districtCode = filterDistricts[0].code + "000000"
            // 获取街道编码
            let streetCode = this.data.streetCode
            // 具体地址
            let areaTextDetail = this.data.areaTextDetail

            app.globalData.userAddressInfo = {
                compeleteAddress: compeleteAddress,
                provinceCode: provinceCode,
                cityCode: cityCode,
                districtCode: districtCode,
                streetCode: streetCode,
                areaTextDetail: areaTextDetail
            }
            wx.navigateBack({})
        } else {
            this.openAlert()
        }
    },
    openActionsheet(e) {
        if (this.data.county) {
            let params = `parentKey=${this.data.countyCode + "000000"}&sliceType=4`
            let tempArr = []
            util.areaAjax(params).then(res => {
                res.items.forEach(item => {
                    let obj = {
                        streetText: item.text,
                        streetCode: item.key
                    }
                    tempArr.push(obj)
                })
                this.setData({
                    areaAjaxResultArr: tempArr
                })
            }).then(() => {
                this.setData({
                    areaAjaxResultShow: true
                })
            })
        } else {
            this.openAlert()
        }
    },
    selectedStreet(e) {
        let streetValue = e.currentTarget.dataset.selectedstreet
        this.setData({
            areaAjaxResultShow: false,
            selectedStreetText: streetValue.streetText,
            streetCode: streetValue.streetCode
        })
    },
    openAlert() {
        wx.showModal({
            content: '请先输入完整地址',
            showCancel: false
        })
    },
    bindChange(e) {
        var val = e.detail.value
        var t = this.data.values;
        var cityData = this.data.cityData;

        if (val[0] !== t[0]) {
            const citys = [];
            const countys = [];

            for (let i = 0; i < cityData[val[0]].sub.length; i++) {
                citys.push(cityData[val[0]].sub[i].name)
            }
            for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
                countys.push(cityData[val[0]].sub[0].sub[i].name)
            }

            this.setData({
                province: this.data.provinces[val[0]],
                city: cityData[val[0]].sub[0].name,
                citys: citys,
                county: cityData[val[0]].sub[0].sub[0].name,
                countys: countys,
                values: val,
                value: [val[0], 0, 0],
                countyCode: cityData[val[0]].sub[0].sub[0].code
            })
            // console.log(this.data.countyCode);
            return;
        }
        if (val[1] !== t[1]) {
            const countys = [];
            for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
                countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
            }

            this.setData({
                city: this.data.citys[val[1]],
                county: cityData[val[0]].sub[val[1]].sub[0].name,
                countys: countys,
                values: val,
                value: [val[0], val[1], 0],
                countyCode: cityData[val[0]].sub[val[1]].sub[0].code
            })
            // console.log(this.data.countyCode);
            return;
        }
        if (val[2] !== t[2]) {
            this.setData({
                county: this.data.countys[val[2]],
                values: val,
                countyCode: cityData[val[0]].sub[val[1]].sub[val[2]].code
            })
            // console.log(this.data.countyCode);
            return;
        }
    },
    open() {
        this.setData({
            condition: !this.data.condition
        })
    },
    onLoad(options) {
        var that = this;
        tcity.init(that);
        var cityData = that.data.cityData;

        const provinces = [];
        const citys = [];
        const countys = [];

        for (let i = 0; i < cityData.length; i++) {
            provinces.push(cityData[i].name);
        }
        // console.log('省份完成');
        for (let i = 0; i < cityData[0].sub.length; i++) {
            citys.push(cityData[0].sub[i].name)
        }
        // console.log('city完成');
        for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
            countys.push(cityData[0].sub[0].sub[i].name)
        }

        that.setData({
            'provinces': provinces,
            'citys': citys,
            'countys': countys,
            'province': cityData[0].name,
            'city': cityData[0].sub[2].name,
            'county': cityData[0].sub[2].sub[1].name
        })
        console.log('初始化完成')

    }
})
