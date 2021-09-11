import Toast from '@vant/weapp/toast/toast';
const app = getApp();
Page({
  data: {
    branchList:[],    //每个分类下的产品
    productList:[],   //右侧产品列表
    array:[
      {text:'请选择校区'},
      {text:'广二师——海珠(敬请期待)'},
      {text:'广二师——花都'},
      {text:'华工广州学院'}
    ],
    position:'请选择校区',    //地区
    show:false,           //是否展示地区选择器 
    user:{},    //用户信息，存入缓存
    loginCode:'',  //登录随机号
    loginStatus:false,
    a:1,
    goodList:['热卖','护肤','数码','生活','餐厨','穿搭','学习','虚拟','零食','创意','其他'],

    // 导航及商品
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    list: [],
    load: true,

    //轮播图
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://img14.360buyimg.com/pop/jfs/t1/193563/34/7920/52949/60c5a92aE2f97a6f2/ccd6615c2ce24a5f.jpg'
    }, {
      id: 1,
        type: 'image',
        url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fa.vpimg2.com%2Fupload%2Fmerchandise%2F69563%2FDANZI-6922726988-2.jpg&refer=http%3A%2F%2Fa.vpimg2.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1633316889&t=60b95dd8fd1086d7777d774626e82eff',
    }, {
      id: 2,
      type: 'image',
      url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimgservice2.suning.cn%2Fuimg1%2Fb2c%2Fimage%2F_5Vna-U0iDBykh0REgWpkA.png&refer=http%3A%2F%2Fimgservice2.suning.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1633318655&t=e45f5f15f08c86139a29'
    }, {
      id: 3,
      type: 'image',
      url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201602%2F14%2F20160214100114_BNMdA.thumb.700_0.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1633318920&t=b9aaf618'
    }, {
      id: 4,
      type: 'image',
      url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.alicdn.com%2Fimgextra%2Fi1%2FTB2.aWNAhuTBuNkHFNRXXc9qpXa_%21%212572264631.jpg_400x400.jpg&refer=http%3A%2F%2Fimg.alicdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1633319132&t=ad27ef'
    }, {
      id: 5,
      type: 'image',
      url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg10.360buyimg.com%2Fn1%2Fjfs%2Ft1912%2F325%2F2139378791%2F396811%2F89d4dedb%2F56f0a0bbNf2984380.jpg&refer=http%3A%2F%2Fimg10.360buyimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=163331'
    }, {
      id: 6,
      type: 'image',
      url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.tbw-xie.com%2FtuxieJDEwLmFsaWNkbi5jb20vaTEvMTcxMTYxMTAvVEIyaTdiUFg1d0lMMUpqU1pGc1hYY1hGRlhhXyEhMTcxMTYxMTAkOQ.jpg&refer=http%3A%2F%2Fwww.tbw-xie.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpe'
    }],
  },
  
  onLoad() {
    if(!app.globalData.tokenId || app.globalData.tokenId==""){  //回调函数确保app.js执行完才执行这个onload
      app.tokenIdCallBack=tokenId=>{
        if(tokenId!=""){
          const token = wx.getStorageSync("token");
          const user = wx.getStorageSync("user");
          const school = wx.getStorageSync("school");
          if(!school || ""==school){
            //用户选择校区
            this.setData({ show:true })
          }else{
            this.setData({position:school})
            this.queryProduct();
          }
          if(!user || user==""){  //无缓存，未登录
            this.setData({ loginStatus:false})
          }else{
            this.setData({
              loginStatus:'true',
            })
          }
        }
      }
    }else{
      const user = wx.getStorageSync("user");
          if(!user || user==""){  //无缓存，未登录
            this.setData({ loginStatus:false})
          }else{
            this.setData({
              loginStatus:'true',
            })
          }
    }
    
    this.initColor();
  },

  //初始化框架
  initColor(){
    // 商品及导航
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    let list = [{}];
    for (let i = 0; i < this.data.goodList.length; i++) {
      list[i] = {};
      list[i].name = this.data.goodList[i];
      list[i].id = i;
      list[i].products = [];
    }
    this.setData({
      list: list,
      listCur: list[0]
    })
    // 轮播
    this.towerSwiper('swiperList'); // 初始化towerSwiper 传已有的数组名即可
  },

  onReady(){
    wx.hideLoading()
  },

  // 展示商品
  queryProduct(){
    let that = this;
    wx.request({
      url: 'http://localhost:8888/ZXS/product/getProductList',
      data:{reqMsg:this.data.position},
      method:"POST",
      success:res=>{
        console.log("res",res);
        that.setData({
          productList:res.data
        })
        for(var a = 1;a<that.data.list.length;a++){
          for(var i = 0; i<res.data.length;i++){
            if(that.data.list[a].name == res.data[i].productType){
              that.data.list[a].products.push(res.data[i])
            }
          }
        }
        this.setData({
          list:that.data.list
        })
      },
      fail:res=>{
        console.log(res)
      }
    })
  },

  /**
   * 【我的小店】登录后跳回首页，隐藏登录按钮
   */
  onShow(){
    const user = wx.getStorageSync("user");
          if(!user || user==""){  //无缓存，未登录
            this.setData({ loginStatus:false})
          }else{
            this.setData({
              loginStatus:'true',
            })
          }
  },

  /**
   * 获取用户登录信息
   */
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    let that = this;
    wx.getUserProfile({
      desc: '获取你的昵称、头像、地区及性别', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          user:{
            nickName:res.userInfo.nickName,
            gender:res.userInfo.gender,
            province:res.userInfo.province,
            city:res.userInfo.city,
            avatarUrl:res.userInfo.avatarUrl,
            loginCode:this.data.loginCode,
          },
          loginStatus:true
        })
        wx.setStorageSync("user",this.data.user);
      },
      fail: (res) => {
        console.log("用户未授权")
      }
    })
  },

  //弹出弹出框
  showPopup(){
    this.setData({ show:true })
  },

  //弹出框关闭
  onClose(){
    this.setData({ show:false })
  },

  //关闭选择器
  onCancel(event){
    const { picker, value, index } = event.detail;
    if(index==0){
      wx.showToast({
        title: '因未选择校区，首页所展示的数据为模拟数据，望悉知',
        icon:'none'
      })
    }
    this.setData({ show:false})

  },

  //选择器确认
  onConfirm(event){
    const { picker, value, index } = event.detail;
    wx.setStorageSync("school",value.text);
    this.setData({
      position:value.text,
      show:false
    })
    if(index==0){
      wx.showToast({
        title: '因未选择校区，首页所展示的数据为模拟数据，望悉知',
        icon:'none'
      })
      return
    }
    this.queryProduct();
  },

  // 商品导航栏--
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },

  //商品导航栏--
  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;     
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  },

  //轮播
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  }

})
