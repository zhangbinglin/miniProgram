//index.js
//获取应用实例
let tcity = require("../../utils/citys.js")
let util = require("../../utils/util.js")
// var app = getApp()
Page({
  data: {
    provinces: [],
    province: "选择省市区",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    areaAjaxResultArr: [],
    areaAjaxResultShow: false,
    selectedStreetText: ''
  },
  openActionsheet: function() {
      let params = `parentKey=${440303000000}&sliceType=4`
      let tempArr = []
      util.areaAjax(params).then(res => {
          res.items.forEach(item => {
              let obj = {
                  regionText: item.text,
                  regionCode: item.properties.regionCode
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
  },
  selectedStreet(e) {
      this.setData({
          areaAjaxResultShow: false,
          selectedStreetText: e.currentTarget.dataset.region.regionText
      })
      console.log(e.currentTarget.dataset.region.regionCode);
  },
  bindChange: function(e) {
    //console.log(e);
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if(val[0] !== t[0]){
      console.log('province no ');
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
        value:[val[0],0,0]
      })

      return;
    }
    if(val[1] !== t[1]){
      console.log('city no');
      const countys = [];

      for (let i = 0 ; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys:countys,
        values: val,
        value:[val[0],val[1],0]
      })
      return;
    }
    if(val[2] !== t[2]){
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
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
    console.log('省份完成');
    for (let i = 0 ; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    console.log('city完成');
    for (let i = 0 ; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }

    that.setData({
      'provinces': provinces,
      'citys':citys,
      'countys':countys,
      'province':cityData[0].name,
      'city':cityData[0].sub[0].name,
      'county':cityData[0].sub[0].sub[0].name
    })
    console.log('初始化完成');

  }
})