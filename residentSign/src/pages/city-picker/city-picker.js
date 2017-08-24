//index.js
//获取应用实例
let tcity = require("../../utils/citys.js")
let util = require("../../utils/util.js")
// var app = getApp()
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
    regionCode: '',
    areaTextDetail: ''
  },
  onInputTextarea(e) {
    this.setData({
      areaTextDetail: e.detail.value
    })
  },
  saveAddress(e) {
    if(this.data.selectedStreetText && this.data.areaTextDetail) {
      let compeleteAddress = this.data.province + this.data.city + this.data.county + this.data.selectedStreetText + this.data.areaTextDetail
      // wx.setStorageSync('compeleteAddress',tempStr)
      let regionCode = this.data.regionCode
      wx.navigateTo({
        url: '../dosign/dosign?compeleteAddress=' + compeleteAddress + '&regionCode=' + regionCode
      })
    } else {
      this.openAlert()
    }
  },
  openActionsheet: function() {
    if(this.data.county) {
      let params = `parentKey=${this.data.countyCode + "000000"}&sliceType=4`
      let tempArr = []
      util.areaAjax(params).then(res => {
          res.items.forEach(item => {
              let obj = {
                  regionText: item.text,
                  regionCode: item.key
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
      this.setData({
          areaAjaxResultShow: false,
          selectedStreetText: e.currentTarget.dataset.region.regionText,
          regionCode: e.currentTarget.dataset.region.regionCode
      })
  },
  openAlert: function () {
      wx.showModal({
          content: '请先输入完整地址',
          showCancel: false,
          success: function (res) {
              if (res.confirm) {
                  // console.log('用户点击确定')
              }
          }
      })
  },
  bindChange: function(e) {
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if(val[0] !== t[0]){
      const citys = [];
      const countys = [];

      for (let i = 0 ; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0 ; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys:citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys:countys,
        values: val,
        value:[val[0],0,0],
        countyCode: cityData[val[0]].sub[0].sub[0].code
      })
      // console.log(this.data.countyCode);
      return;
    }
    if(val[1] !== t[1]){
      const countys = [];
      for (let i = 0 ; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys:countys,
        values: val,
        value:[val[0],val[1],0],
        countyCode: cityData[val[0]].sub[val[1]].sub[0].code
      })
      // console.log(this.data.countyCode);
      return;
    }
    if(val[2] !== t[2]){
      this.setData({
        county: this.data.countys[val[2]],
        values: val,
        countyCode: cityData[val[0]].sub[val[1]].sub[val[2]].code
      })
      // console.log(this.data.countyCode);
      return;
    }
  },
  open:function(){
    this.setData({
      condition:!this.data.condition
    })
  },
  onLoad: function () {
    var that = this;
    tcity.init(that);
    var cityData = that.data.cityData;

    const provinces = [];
    const citys = [];
    const countys = [];

    for(let i=0;i<cityData.length;i++){
      provinces.push(cityData[i].name);
    }
    // console.log('省份完成');
    for (let i = 0 ; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    // console.log('city完成');
    for (let i = 0 ; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }

    that.setData({
      'provinces': provinces,
      'citys':citys,
      'countys':countys,
      'province':cityData[0].name,
      'city':cityData[0].sub[2].name,
      'county':cityData[0].sub[2].sub[1].name
    })
    console.log('初始化完成')

  }
})
