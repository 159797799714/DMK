<template>
	<view class="content" :style="'padding-top:'+ topHeight+'px;'+ themeBg">
			<view class="headWrapper" :style="'background-color:'+themeColor+';background-image:'+ ' url('+ bg1_base64 +');background-repeat: no-repeat'">
				<topBar ref="topBar" isIndex="true">
					<view class="topBox dis-flex flex-y-center">
						<view class="reachView" @click="goSearch">
							<text>搜索</text>
							<image class="searchIcon" src="../../static/reach.png" mode=""></image>
						</view>	
					</view>
				</topBar>
				<!-- <image class="cart" src="../../static/cart_white.png" mode="" @click.stop="goCart"></image> -->
			</view>
			<view class="container bg-ee">
				<view class="backgroundWrapper dis-flex flex-column" :style="'background:'+themeColor+ ' url('+ bg2_base64 +') no-repeat'">
					<view class="sortlistWrapper">
						<view v-if="banners.length > 0" class="blankBox"></view>
					</view>
				</view>
				<!-- 大banner图 -->
				<view v-if="banners.length > 0" class="bannerWrapper">
					<swiper class="swiper" 
						:autoplay="autoplay" 
						:interval="interval" 
						:circular="true" 
						:duration="duration" 
						indicator-dots="true" 
						:indicator-active-color="themeColor" 
						:indicator-color="letThemeColor"
					>
						<swiper-item v-for="(item,index) in banners" :key='index'>
							<image class="bg" :src="item.SystemSetValue" mode="aspectFill"></image>
						</swiper-item>
					</swiper>
				</view>
				
				<view v-if="Adverts.length > 0" class="animation-word" :style="'background: '+ rgbaColor">
					<!-- <image src="../../static/animation.png" mode=""></image> -->
					<text class="iconfont f-32" :style="fontThemeColor">&#xe615;</text>
					<view class="word">
						<swiper :autoplay="true" :interval="3000" :duration="2000" :vertical="true" :circular="true">
							<swiper-item v-for="(item, index) in Adverts" :key="index">
								<view class="swiper-item">
									<text class="oneline-hidden" :style="fontThemeColor">{{item.SystemSetValue}}</text>
								</view>
							</swiper-item>
						</swiper>
					</view>
				</view>
				
				<view class="menu_v">
					<scroll-view class="foodNavWrapper" scroll-x="true" >
						<view :class="'flex-r '+ [firstData.length == 10 ? 'flex-wrap flexs' : '']">						
							<view v-for="(item, index) in firstData" :key="index" :class="firstData.length == 10 ? 'sortWrappers col-33 flexs flex-center flex-v flex-line' : 'sortWrappers sortWrapper'" 
							@click="goMenu(item.CategoriesCode)" :style="firstData.length == 10 && index > 4 ? 'margin-top:40rpx':''">
								<image class="icon" :src="item.CategoriesImages" mode=""></image>
								<view class="text">{{item.CategoriesName}}</view>
							</view>
						</view>
					</scroll-view>
				</view>
				<!-- 限时抢购 -->
				<view v-if="leave_time || leave_time === null? buyingGoodsList.length > 0: false" class="limit-buy">
					<view class="limit-head">
						<view class="dis-flex flex-y-center">
							<text class="head-title">限时抢购</text>
							<view class="time f-24" :style="fontThemeColor">
								<block v-if="leave_time && leave_time[3]">
									<text class="time-item" :style="themeBg">{{leave_time[3]}}</text>天
								</block>
								<text class="time-item" :style="themeBg">{{leave_time? leave_time[0]: '00'}}</text>时
								<text class="time-item" :style="themeBg">{{leave_time? leave_time[1]: '00'}}</text>分
								<text class="time-item" :style="themeBg">{{leave_time? leave_time[2]: '00'}}</text>秒
							</view>
						</view>
					</view>
					<scroll-view scroll-x="true" class="limit-good" :scroll-top="buyingScrollTop" @scrolltolower="discountLoadMore">
						<view class="dis-flex flex-x-between">
							<view v-for="(item, index) in buyingGoodsList" :key="index" class="limit-item" @click="goProDetails(item.GoodsCode)">
								<view class="good-img">
									<image :src="item.NetPath" mode="aspectFill"></image>
									<view class="discount">限时{{item.Discount}}折</view>
									<view v-if="item.StoreQuantity < 1" class="blank">已抢光</view>
								</view>
								<view class="limit-good-name f-24 col-33 twoline-hidden">{{item.GoodsName+' '}}{{ item.WeightShort?item.WeightShort: ''}}</view>
								<view class="good-foot">
									<view class="oneline-hidden">
										<view class="min-price col-red f-24">￥
											<text class="f-36">{{splitPrice(item)[0]}}.</text>
											<text class="f-24">{{splitPrice(item)[1]}}</text>
										</view>
										<view v-if="item.DiscountPrice > 0 || item.MembershipPrice > 0" class="line-price f-24 col-B1 text-line">￥{{toFixed(item.MarketPrice)}}</view>
		
									</view>
									<view class="cart-img">
										<view v-show="item.CurrentCartQuantity> 0" class="num-info">{{item.CurrentCartQuantity}}</view>
										<image src="../../static/cart.png" mode="" @click.stop="createCustomerCart(item.GoodsCode, index)"></image>
									</view>
								</view>
							</view>
							<view v-if="buyingGoodsList.length === 2" class="limit-item"></view>
						</view>
						
					</scroll-view>
				</view>
				
				<!-- 会员每日送 -->
				<view v-if="freeGoodsList.length > 0" class="limit-buy">
					<view class="limit-head">
						<view class="dis-flex flex-y-center">
							<text class="head-title">会员每日送</text>
							<view class="info f-24 col-99">单选</view>
						</view>
					</view>
					<scroll-view scroll-x="true" class="limit-good">
						<view class="dis-flex flex-x-between">
							<view v-for="(item, index) in freeGoodsList" :key="index" class="limit-item" @click="goProDetails(item.GoodsCode)">
								<view class="good-img">
									<image :src="item.NetPath" mode="aspectFill"></image>
									<view v-if="item.StoreQuantity < 1" class="blank">已抢光</view>
								</view>
									<view class="limit-good-name f-24 col-33 twoline-hidden">{{item.GoodsName+' '}} {{item.WeightShort}}</view>
								<view class="good-foot">
									<view>
										<view class="min-price col-red f-28 f-bold">免费</view>
										<view class="line-price f-24 col-B1 text-line">￥{{toFixed(item.MarketPrice)}}</view>
									</view>
								</view>
							</view>
							<view v-if="freeGoodsList.length === 2" class="limit-item"></view>
						</view>
					</scroll-view>
				</view>
				<!-- 分类商品 -->
				<view ref="tabWrapper" class="tabWrapper" :style="'min-height:'+windowHeight" @touchstart="touchStart" @touchend="touchEnd">
					<view :style="tabNavGoodsList !== ''?'visibility: visible': 'visibility: hidden'">
						<view v-if="isFixed" class="tabNavWrapper"></view>
						<scroll-view  scroll-x="true" class="tabNavWrapper" :class="isFixed?'p-fix': ''" :style="isFixed?'top:'+topHeight+'px': 'top: 0;'+ tabStyleStr">
							<view class="sortTitle" v-for="(item,index) in tabNavArr" :key="index" @click="tabSlide(item.path, index)">
								<text :style="index == tabIndex ?fontThemeColor: ''" class="navText">{{item.title}}</text>
							</view>
						</scroll-view>
						<view class="contentList">
							<GoodTwoColumn :allProduceArr="newTabNavGoodsList" :isRequired="isRequired" @buy="buy"></GoodTwoColumn>							
							<view v-if="CurrentPage >= TotalPage && TotalPage !== 0" class="noMore t-center col-66 f-24">亲！只有这么多了哦！</view>
						</view>
					</view>
				</view>
			</view>
			
			<cartIcon ref="cartIcon"></cartIcon>
			<fly-cart ref="inCart" :cartBasketRect="cartBasketRect"></fly-cart>
	</view>
</template>

<script>
	import GoodTwoColumn from "@/components/GoodTwoColumn.vue"
	import topBar from "@/components/topBar.vue"
	import { curtTime, splitPrice, hexToRgba } from '@/common/utils.js'
	import updateProductStatus from '@/mixin/updateProductStatus.js'
	import getGlobalCartsGoodsList from '@/mixin/getGlobalCartsGoodsList.js'
	import flyCarts from '@/mixin/flyCarts.js'
	import themeColors from '@/mixin/themeColors.js'
	
	import cartIcon from "@/components/cartIcon.vue"
	export default {
		mixins: [getGlobalCartsGoodsList, updateProductStatus, flyCarts, themeColors],
		components: {
			GoodTwoColumn,
			cartIcon,
			topBar
		},
		data() {
			return {
				toFixed:this.helper.toFixed,
				scroll_id:'',
				windowHeight:'',
				topHeight: '',              // 搜索框高度
				scrollHeight: '',           // 页面滚动高度
				goodListScrollTop: 0,         // 商品列表滚动顶部距离
				firstData: '',               //一级分类
				indicatorDots: true,
				
				// 轮播图
				autoplay: true,
				interval: 2000,
				duration: 500,
				banners: [],
				
				Adverts: '',                // 小喇叭广告词
				buyingGoodsList: '',        // 限时抢购商品列表
				buyingCurrent: 1,           // 限时抢购当前页码
				buyingScrollTop: '',         // 限时抢购滚动位置
				buyingTotalPage: 0,         // 限时抢购最大页码
				leave_time: null,           // 限时抢购剩余时间
				freeGoodsList: null,        // 免费商品列表
				tabNavArr: [{
						"id": 1,
						"title": "全品",
						"path": 'GetHomeGoods'
					}, {
						"id": 3,
						"title": "新品",
						"path": 'GetHomeNewGoods'
					}, {
						"id": 4,
						"title": "折扣",
						"path": 'GetHomeDiscountGoods'
					}, {
						"id": 5,
						"title": "团购",
						"path": 'GetHomeGroupGoods'
					}, {
						"id": 2,
						"title": "爆款",
						"path": 'GetHomeExplosiveGoods'
				}],
				tabNavGoodsList: '',
				newTabNavGoodsList: [],
				
				tabTop: '',                // 分类tab距离顶部距离
				scrollTop: 0,              // 整个页面滚动距离
				tabHeight: 0,              // 分类高度
				isFixed: false,            // 分类tab是否固定
				GuessType: '',             // 默认为分类第一个请求api名字
				tabIndex: 0,
				// allProduceArr: '',      // 最下面商品列表
				CurrentPage: 1,            // 当前页码
				TotalPage: 0,              // 当前分类总页码（以15条一页为标准）
				timer: null,               // 倒计时定时器
				clickTime: 0,              // 点击底部tab的次数
				num: 0,                    // 获取tab顶部距离次数
				pageTop: 0,                // 页面滚动顶部距离
				isOnScroll: null,          // 是否触发滚动监听
				isOnMove: false,           // 是否触摸
				startY: 0,                 // 初始滚动距离
				endY: 0,
				splitPrice: splitPrice,
				rgbaColor: '',                                       // 主题色rgba
				themeBg: '',                                         // 主题背景色字符串如 background: #fff;
				fontThemeColor: '',                                  // 主题字体颜色字符串如 color: #fff;
				bg1_base64: 'data:image/png;base64,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',  // base64
				bg2_base64: 'data:image/png;base64,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',
				isRequired: false,          // 是否请求
				tabStyleStr: 'visibility: hidden;'
			}
		},
		onPullDownRefresh() {
			this.$refresh()
			this.requestAgain()
		},
		onLoad() {
			//获取一级分类
			this.getFirstLevel()
			this.getAdList()
			this.tabSlide(this.tabNavArr[0].path, 0)
		},
		async onShow(){
			this.setGlobalCartsGoodsList()
			let that= this,
				themeColor= this.themeColor
			that.CurrentPage= 1
			that.buyingCurrent= 1
			that.buyingScrollTop= 0
			
			that.themeBg= 'background:'+ themeColor+';'
			that.fontThemeColor= 'color:'+ themeColor+';'
			let GuessType= this.GuessType?this.GuessType: this.tabNavArr[0].path
			
			this.getFreeGoods()
			this.getBuyingGoods()
			this.tabSlide(GuessType, that.tabIndex, false)
    },
		async onReady() {
			let that= this
			let h1= await that.helper.getNodeInfo('.tabNavWrapper',0,'height')
			let topHeight= await that.helper.getNodeInfo('.headWrapper',0,'height')
			that.topHeight= topHeight
			that.tabHeight= h1
			uni.getSystemInfo({
				success: (res) => {
					console.log('获取到设备信息', res)
					/* 设置当前滚动容器的高，若非窗口的高度，请自行修改 */
					that.windowHeight=res.windowHeight + 'px'
					that.scrollHeight = res.windowHeight - topHeight - h1 + 'px'
				}
			})
		},
		onShareAppMessage(res) {
			return {
				title: '咕咚熊喊你来买菜啦！',
				path: '/pages/index/index'
			}
		},

		// 页面滚动
		async onPageScroll(e) {
			let that= this
			that.$refs.cartIcon.isScroll()
			if(that.isFixed && that.pageTop < e.scrollTop) {
				return
			}
			that.pageTop= e.scrollTop
			// 节流
			clearTimeout(that.isOnScroll)
			that.isOnScroll= null
			that.isFixed= false
			
			that.isOnScroll= setTimeout(async function() {
				let scrollTop= await that.helper.getNodeInfo('.tabWrapper',0,'top')
				if(scrollTop < that.topHeight) {
					that.isFixed= true
				} else {
					that.isFixed= false
				}
			}.bind(that), 50)
			
		},
		// 双击tab刷新
		onTabItemTap(e) {
			this.clickTime += 1
			if(this.clickTime > 1) {
				this.$refresh()
				this.requestAgain()
			}
			setTimeout(function () {
				this.clickTime= 0
			}.bind(this), 1000)
		},
		// 触底加载更多
		onReachBottom() {
			this.loadMore()
		},
		methods: {
			buy(obj){
				this.add(obj.e, obj.id)
			},
			touchStart(e) {
				this.isOnMove= true
				this.startY= e.changedTouches[0].clientY
				let tabTop = e.currentTarget.offsetTop
				if(this.tabTop && this.tabTop == tabTop) {
					return
				}
				this.tabTop= e.currentTarget.offsetTop
			},
			touchEnd(e) {
				let short= Math.abs(e.changedTouches[0].clientY - this.startY)
				if( short < 50) {
					return
				}
				this.isOnMove= false
				
			},
			// 重新请求
			requestAgain() {
				this.num= 0
				this.CurrentPage= 1
				this.buyingCurrent= 1
				this.bottom= 32
				this.right= 10
				this.getFirstLevel()
				this.getAdList()
				this.getBuyingGoods()
				this.getFreeGoods()
				this.tabSlide(this.tabNavArr[0].path, 0)
				this.$refs.cartIcon.updateBottom()
			},
			goSearch(){
				uni.navigateTo({
					url:'/pagesA/search/search'
				})
			},
			// 点击一级分类跳转
			goMenu(code) {
				uni.setStorage({
					key: 'CategoriesCode',
					data: code,
					success() {
						uni.switchTab({
							url: '../menu/menu'
						})
					}
				})
			},
			// 查看详情
			goProDetails(GoodsCode) {
				console.log(GoodsCode) 
				uni.navigateTo({
					url:'/pagesA/proDetails/proDetails?id=' + GoodsCode
				})
			},
			// 加入购物车
			createCustomerCart(id, index) {
				let that= this
				if(!that.$stopAction()) {
					return
				}
				if(!that.$createCart(id)) {
					return
				}
				that.buyingGoodsList[index].CurrentCartQuantity += 1
				this.$store.commit('buy', {goods:that.buyingGoodsList[index]})			
			},
			updateList(){
				this.newTabNavGoodsList = this.updateListItemQuantity(this.tabNavGoodsList)
			},
			//切换tab
			tabSlide(path, index, scroll0 = true) {
				const that = this
				if(this.isFixed && scroll0) {
					uni.pageScrollTo({
						scrollTop: this.tabTop
					})	
				}
				if(!scroll0){
					return
				}
				this.CurrentPage= 1
				this.GuessType = path
				this.tabIndex= index
				this.getAllList(path, true)
			},
			// 限时抢购加载更多
			discountLoadMore() {
				let that= this
				if(that.buyingCurrent < that.buyingTotalPage) {
					that.buyingCurrent += 1
					that.getBuyingGoods()
					return
				}
			},
			//获取一级分类
			getFirstLevel() {
				let that= this
				that.$request(that.$API.GetCategoriesFirst).then(res => {
					that.firstData = res.Data
					that.vue_g.firstData=res.Data
				})
			},
			// 上拉加载更多
			loadMore() {
				let that= this
				if(that.CurrentPage < that.TotalPage) {
					that.CurrentPage += 1
					that.getAllList(that.GuessType)
					return
				}
			},
			
			//首页-获取全品、爆款,新品，折扣，团购
			getAllList(GuessType, refresh){
				let that= this,
					paramData = {
						"CurrentPage": that.CurrentPage,
						"PageSize": 10
					}
				that.$request(that.$API[GuessType], paramData).then(res => {
					that.isRequired= true
					that.tabStyleStr= 'visibility: visible;'
					if(res.Data.Datas.length < 1) {
						that.$Toast('抱歉！暂无该分类商品')
					}
					that.TotalPage= res.Data.TotalPage
					if(that.CurrentPage > 1) {
						that.tabNavGoodsList = that.tabNavGoodsList.concat(res.Data.Datas)
						return
					}
					that.tabNavGoodsList = res.Data.Datas
				})
			},
			
			//首页-获取用户系统配置Banners、最大距离限制、广告词*/
			getAdList: function() {
				
				var that= this
				that.$request(that.$API.GetSystemSet).then(res => {
					console.log(55555555, res);
					that.banners = res.Data.Banners
					that.Adverts= res.Data.Adverts
					let AppThemeColor= res.Data.AppThemeColor?res.Data.AppThemeColor: '#FF303B'
					that.rgbaColor= hexToRgba(AppThemeColor, 0.3)
					that.themeBg= 'background:'+ AppThemeColor+';'
					that.fontThemeColor= 'color:'+ AppThemeColor+';'
					uni.setStorageSync({
						key: 'HomeSite',
						data: res.Data.HomeSite
					})
					that.$refs.cartIcon.setBg()
					that.$store.commit('setThemeColor', AppThemeColor)
				})
			},
			
			// 获取限时抢购商品列表
			getBuyingGoods() {
				let that= this,
					params= {
						"CurrentPage": that.buyingCurrent,
						"PageSize": 0
					}
				that.$request(that.$API.GetBuyingGoods, params).then(res => {
					var arr= [],
						data= res.Data.Datas
						that.buyingTotalPage= res.Data.TotalPage
						console.log('限时抢购列表', data)
						// 处理倒计时
						if(res.Data.Datas.length == 0) {
							return
						}
						that.timer= setInterval(function(){
							curtTime(data[0].DiscountEndDate, null, function(res) {
								if(!res) {
									clearInterval(that.timer)
									that.timer= null
								}
								that.leave_time= res
							})
						}.bind(this), 1000)
					data.map((item) =>{
						item.DiscountPrice= item.DiscountPrice?item.DiscountPrice: 0
						item.Discount= item.Discount * 10
						item.NetPath = item.ImageUrl? item.ImageUrl: ''
						item.GoodsCode= item.GoodsCode
						item.MembershipPrice= item.MembershipPrice? item.MembershipPrice: 0
						item.MarketPrice= item.MarketPrice? item.MarketPrice: 0
					})
					that.buyingGoodsList= that.buyingCurrent > 1?that.buyingGoodsList.concat(data): data
					
				})
			},
			
			// 获取免费商品列表
			getFreeGoods() {
				let that= this,
					params= {
						"CurrentPage": 1,
						"PageSize": 0
					}
				that.$request(that.$API.GetFreeGoods, params).then(res => {
					let arr = [],
						data= res.Data.Datas
            if (data) {
							data.map((item) => {						
								let obj= {
									GoodsName: item.GoodsName,
									MarketPrice : item.MarketPrice?item.MarketPrice: '',
									NetPath : item.ImageUrl? item.ImageUrl: '',
									WeightShort: item.WeightShort?item.WeightShort: '',
									GoodsCode: item.GoodsCode,
									GoodsWeight: item.GoodsWeight?item.GoodsWeight: ''	
								}		
								arr.push(obj) 
							})
					}
					that.freeGoodsList= arr
				})
			}
		},
		onHide() {
			clearInterval(this.timer)
			this.timer= null
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		width: 100%;
		height: 100%;
		position: relative;
		-webkit-overflow-scrolling: touch;
	}
	.homeLogo{
		display: inline-block;
		margin-bottom: 20upx;
		height: 55upx;
		width: 163upx;
		vertical-align: bottom;
	}

	.menu_v{
		width: calc(100% - 48rpx);
		font-size: 0;
		white-space: nowrap;
		margin: auto;
		padding: 40rpx 0 20upx;

	}

	.backgroundWrapper {
		width: 100%;
		background-size: cover;
		.blankBox{
			height: 170upx;
		}
	}

	.headWrapper {
		z-index: 10;
		position: fixed;
		top: 0;
		left: 0;
		min-height: 74upx;
		width: 100%;
		box-sizing: border-box;
		font-size: 0;
		padding: 0 24upx 14upx;
		background-size: cover;
		background-repeat: no-repeat;
	}
	.topBox{
		height: 44px;
	}
	.headWrapper .reachView {
		position: relative;
		display: inline-block;
		padding-left: 68upx;
		width: 490upx;
		box-sizing: border-box;
		height: 60upx;
		background:	#fff;
		text-align: left;
		border-radius:	30upx;
		line-height: 60upx;
		font-size: 28upx;
		color: #D8D8D8;
	}
	.cart {
		display: inline-block;
		vertical-align: middle;
		width: 40upx;
		height: 40upx;
		margin-left: 24upx;
	}

	.headWrapper .reachView .searchIcon {
		display: block;
		width: 32upx;
		height: 32upx;
		position: absolute;
		left: 24upx;
		top: 50%;
		margin-top: -16upx;
	}
	
	
	/* sortlistWrapper */
	.sortlistWrapper {
		width: calc(100% - 48upx);
		font-size: 0;
		white-space: nowrap;
		margin: auto;
		padding: 0upx 24upx 20upx;
	}
	.sortWrappers{
		width:20%;
	}
	.sortWrapper {
		display: inline-block;
		vertical-align: top;
		width: 20%;
	}

	.sortWrappers .icon {
		width: 108upx;
		height: 108upx;
		margin-bottom: 23upx;
	}

	.sortWrappers .text {
		font-size:24upx;
		text-align: center;
		color:#333;
		width: 108upx;
	}

	.sortWrapper:nth-last-child(1){
		margin-right: 0;
	}

	/* bannerWrapper */
	.bannerWrapper {
		-webkit-backface-visibility: hidden;
		-webkit-transform: translate3d(0, 0, 0);
		width:702upx;
		height:302upx;
		border-radius:24upx;
		-webkit-border-radius:24upx;
		margin: -172upx auto 0;
		overflow: hidden;

		&>swiper{
			height: 302upx;
			width: 100%;
			border-radius:24upx;
			-webkit-border-radius:24upx;
			overflow: hidden;
			&>swiper-item{
				-webkit-border-radius:24upx;
				border-radius:24upx;
				overflow: hidden;
			}
		}
	}

	.bannerWrapper .bg{
		display: block;
		width:702upx;
		height:302upx;
	}
	
	.animation-word{
		display: flex;
		padding: 12upx 24upx;
		margin: 12upx 24upx 0;
		border-radius: 10upx;
		line-height: 36upx;
		.iconfont{
			display: inline-block;
			height: 36upx;
			width: 36upx;
			margin-right:24upx;
		}

		.word{
			height: 36upx;
			width: 100%;
			line-height: $f-36;
			font-size: $f-28;
			color: $color-red;
		}

		swiper{
			height: 36upx;
			width: 100%;
		}

		.swiper-item{
			height: 36upx;
			width: 100%;
		}
	}
	
	.limit-buy{
		margin: 20upx 24upx 0;
		padding: 32upx 24upx 0;
		background-color: #fff;
		border-radius: 12upx;

		.limit-head{
			margin-bottom: 40upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.head-title{
				margin-right: 8upx;
				font-size: $f-36;
				line-height: 1;
				height: 34upx;
				color: $color-33;
				font-weight: bold;
			}

			.time{
				height: 28upx;
				.time-item{
					display: inline-block;
					margin: 0 12upx;
					min-width: 40upx;
					padding: 2upx 0;
					font-size: $f-24;
					color: #fff;
					text-align: center;
					border-radius: 4upx;
					line-height: 1em;
				}
			}

			.info{
				display: inline-block;
				margin-left: 20upx;
			}
		}

		.limit-good{
			.limit-item{
				display: block;
				margin-right: 20upx;
				width: 180upx;
				padding-bottom: 32upx;
				.good-img{
					position: relative;
					margin-bottom: 11upx;
					height: 180upx;
					width: 180upx;

					&>image{
						height: 100%;
						width: 100%;
						margin-top: 50%;
						transform: translateY(-50%);
						border-radius: 16upx;
					}	

					.discount{
						position: absolute;
						right: 0;
						top: 5px;
						-webkit-transform: rotate(6deg);
						transform: rotate(6deg);
					}

					.blank{
						position: absolute;
						bottom: 0;
						left: 0;
						width: 100%;
						height: 44upx;
						line-height: 44upx;
						text-align: center;
						color: #fff;
						font-size: 28upx;
						background-color: rgba($color: #000000, $alpha: 0.5);
						border-radius:0 0 16upx 16upx;
					}
				}
				
				.limit-good-name{
					height: 63upx;
					width: 180upx;
					line-height: 26upx;
					}

				.good-foot{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.min-price{
						vertical-align: bottom;
						height: 27upx;
						&>text{
							line-height: 1;
						}
						.member-price{
							margin-left: 4upx;
							padding: 0 7upx;
							border-radius: 4upx;
						}
					}

					.line-price{
						margin-top: 17upx;
						line-height: 20upx;
					}

					.cart-img{
						position: relative;
						height: 48upx;
						width: 48upx;

						&>image{
							height: 100%;
							width: 100%;
						}

						// 购物车角标
						.num-info{
							position: absolute;
							top: -12upx;
							right: -16upx;
							padding: 2upx 12upx;
							border-radius: 14upx;
							color: #fff;
							font-size: 20upx;
							line-height: 20upx;
							border: 2upx solid #fff;
						}
					}
				}
			}
		}
	}
	
	/* tabWrapper */
	.tabWrapper {
		position: relative;
		width: 702upx;
		margin: 35upx auto 0;
		overflow: hidden;
	}

	.tabWrapper .tabNavWrapper {
		z-index: 2;
		left: 24upx;
		width: 100%;
		height: 82upx;
		background-color: #eee;
		transition: 100ms;
	}
	.contentList{
		box-sizing: border-box;
		width: calc(100% + 50upx);
		overflow: hidden;
	}

	.tabNavWrapper .sortTitle {
		display: inline-block;
		vertical-align: middle;
		width: 140upx;
		height: 82upx;
		line-height: 82upx;
		text-align: center;
		font-size: 32upx;
		font-weight:bold;
		color:rgba(51,51,51,1);
	}

	.tabNavWrapper .activeSortTitle {
		display: inline-block;
		vertical-align: middle;
		width: 140upx;
		height: 102upx;
		line-height: 102upx;
		text-align: center;
		font-size: 32upx;
		font-weight:bold;
		color: $color-red;
	}

	.tabNavWrapper .sortTitle .navText {
		position: relative;
		display: block;
		width: 140upx; 
		line-height: 82upx;
		position: relative;
	}

	.tabNavWrapper .sortTitle .navText::after {
		display: block;
		content: '';
		width: 1upx;
		height: 32upx;
		background-color: #DDDDDD;
		position: absolute;
		right: 0;
		top: 50%;
		margin-top: -16upx;
	}

	.tabNavWrapper .sortTitle:last-child .navText::after {
		width: 0;
	}

	.noMore{
		padding-right: 50upx;
	}
</style>
<style>
	page{
		z-index: 10;
		height: 100%;
		overflow: scroll;
	}
</style>
