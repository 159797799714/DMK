<template>
	<view class="content">
		<view class="headWrapper" :class="{'isHidden': isHidden}">
			<view class="seachWrapper p-re">
				<input class="inputView" type="text" v-model="seachValue" placeholder="搜索" placeholder-style="color: #d8d8d8; fontSize: 28rpx;" @confirm="searchAction"/>
				<image class="icon" src="../../static/reach.png" mode=""></image>
				<image v-if="seachValue" src="../../static/circleClose.png" class="delIcon" mode="" @click.stop="delSearchInfo"></image>
			</view>
		</view>
		<view class="listWrapper">
			<scroll-view :scroll-left="scrollLeft" scroll-x="true" class="scroll-X" :scroll-with-animation="true">
				<view class="wrapper_top flexs flex-r">
					<block v-for="(item,index) in menuArray" :key="index">
						<view class="wrapper_top_item" :style="index === active?'color:'+themeColor: ''" @click="current(item,index)">
							{{item.CategoriesName}}
						</view>					
					</block>
				</view>
			</scroll-view>
			<view class="wrapper_cen">
				<view class="listBox">
					<view class="list" v-for="(item,index) in goodList" :key="index" @click="jump_dalite(item.GoodsCode, item.leave_time, item.IsJoinGroup)">
						<view class="leftWrapper">
							<image class="pro" :src="item.ImageUrl?item.ImageUrl: ''" mode="aspectFill"></image>
						</view>
						<view class="rightWrapper">
							<view class="proTitle">{{item.GoodsName}}{{item.WeightShort}}</view>
							<view class="priceWrapper">
								<view class="realWrapper">
									<view class="realPrice">
										¥<text class="big">{{splitPrice(item.MarketPrice)[0]}}.</text>
										<text class="f-24">{{splitPrice(item.MarketPrice)[1]}}</text>
									</view>
									<image class="addGroupIcon" src="../../static/groupOn.png" mode=""></image>
								</view>
								<!-- <view class="nativePrice">¥{{item.MarketPrice}}</view> -->
							</view>
							<view class="groupPreferential">
								<view class="preList" v-for="(obj, num) in item.discountGrade" :key="num">
									<view class="leftWrapper1 col-red">{{obj.Discount.toFixed(1)}}折</view>
									<view class="rightWrapper1">[{{obj.section}}人团]</view>
								</view>
							</view>
							<view class="stepView" :style="'background:'+rgbaColor">
								<view v-if="item.width > 0 " class="step" :style="'width:'+ item.width + '%;'+ 'background: '+ themeColor">
								</view>
							</view>
							<view class="countDown">
								<text class="label">剩余</text>
								<text>{{item.leave_time?item.leave_time: '00:00:00'}}</text>
							</view>
							<view class="bottomList flexs flex-r flex2">
								<view class="address flexs flex-r flex-line">
									<view>
										<image v-if="item.Address" class="icon" src="../../static/smallArea.png" mode=""></image>
									</view>
									<text class="text oneline-hidden">{{item.Address?item.Address: ''}}</text>
								</view>
								<view class="addGroup" :class="item.IsJoinGroup || !item.leave_time?'bg-D8': ''"
								   :style="item.IsJoinGroup || !item.leave_time?'':'background: '+ themeColor"  @click.stop="goAddGroup(item)">
									{{item.IsJoinGroup?'已参团': '去参团'}}
								</view>
							</view>
						</view>
					</view>
					<!-- 空白 -->
					<view v-if="goodList.length < 1 && goodList !== null" class="blank"></view>
					<view v-if="CurrentPage >= TotalPage && TotalPage !== 0" class="noMore t-center col-66 f-24">亲！只有这么多了哦！</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {curtTime, splitPrice, hexToRgba, mapCurtTime} from '@/common/utils.js'
	export default {
		data() {
			return {
				toFixed: this.helper.toFixed,
				seachValue:'', 						//搜索框值
				scrollLeft:0,  						//左右滚动值
				active: 0,               //分类标识值
				time: 30 * 60 * 60 * 1000,
				menuArray:[],            //分类列表
				CurrentPage: 1,          // 团购商品当前页面
				TotalPage: 0,            // 总页数
				goodList: null,          // 团购商品列表
				CategoriesCode:'',       // 商品分类代码
				isHidden: false,
				timerIntervalArr: [],    // 定时器列表
				isClearing: false,
				scrollTimer: null,
				splitPrice: splitPrice,
				bottomDefault: 32,
				rightDefault: 10,          // 购物车默认偏移量
				bottom: 32,
				right: 10,                 // 购物车图标偏移量
				themeColor: this.$store.state.themeColor,
				rgbaColor: hexToRgba()
			}
		},
		computed: {
			token: function() {
				return this.$store.state.token
			}
		},
		async onLoad() {
			this.getFirstLevel()
		},
		async onShow() {
			this.$setNavigatorBg()
			uni.showLoading({
				title:"加载中..."
			})
			this.bottom= 32
			this.right= 10
			this.CurrentPage= 1
			this.GetGroupOrder()
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.$refresh()
			this.seachValue= ''
			this.bottom= 32
			this.right= 10
			this.CurrentPage= 1
			this.current({
				CategoriesName: '全部',
				CategoriesCode: null
			}, 0)
		},
		onReachBottom() {
			this.loadMore()
		},
		// 双击tab刷新
		onTabItemTap(e) {
			this.clickTime += 1
			if(this.clickTime > 1) {
				this.$refresh()
				this.seachValue= ''
				this.current({
					CategoriesName: '全部',
					CategoriesCode: null
				}, 0)
			}
			setTimeout(function () {
				this.clickTime= 0
			}.bind(this), 1000)
		},
		methods: {
			// 购物车图标拖动
			cartIconMove(shortX, shortY) {
				console.log('外面', shortX, shortY)
				this.bottom= this.bottomDefault + shortY
				this.right= this.rightDefault + shortX
			},
			delSearchInfo() {
				this.seachValue= ''
				this.C
				this.searchAction()
			},
			//切换tab分类
			async current(item,e){  
				if(this.$stopAction(1, 700)) {
					let clearRes= await this.clearAllInterval()
					console.log('清完了', clearRes, this.goodList)
					this.CurrentPage=1
					this.active=e
					if(e > 2){
						this.scrollLeft= (e - 3) * 95
					} else{
						this.scrollLeft= 0
					}
					this.CategoriesCode= item.CategoriesCode
					this.GetGroupOrder()	
				}
			},
			async searchAction() {
				let clearRes= await this.clearAllInterval()
				this.CurrentPage=1
				this.active= ''
				if(this.seachValue) {
					this.searchGroup()
				} else {
					// 输入框为空默认请求全部
					this.current({
						CategoriesName: '全部',
						CategoriesCode: null
					}, 0)
				}
			},
			// 输入框输入后点击完成搜索
			async searchGroup() {
				let that= this,
					params= {
						"SearchText": that.seachValue,
						"CurrentPage": that.CurrentPage,
						"PageSize": 0
					},
					res= await that.$request(that.$API.QureyGroupOrder, params)
					let datas= res.Data.Datas
					that.TotalPage= res.Data.TotalPage
					if(datas.length < 1) {
						this.$Toast('抱歉，暂无相关商品')
					}
					that.filterList(datas, res)
			},
			pageOnscroll(e) {
				// this.isHidden= e.detail.scrollTop > this.topHeight? true: false
				// this.topHeight= e.detail.scrollTop
			},
			jump_dalite(id, leave_time){  //跳转到详情
				if(!leave_time) {
					return
				}
			  uni.navigateTo({
			   	url:'/pagesA/proDetails/proDetails?id=' + id
			  })
			},
			//获取一级分类
			getFirstLevel: function(){
				let that= this
				that.$request(that.$API.GetCategoriesFirst).then(res => {
					this.vue_g.firstData=res.Data
					console.log('商品一級分類',res.Data)
					res.Data.unshift({
						CategoriesName: '全部',
						CategoriesCode: null
					})
					this.menuArray=res.Data
				})
			},
			// 加载更多
			loadMore() {
				let that= this
				console.log(that.CurrentPage, that.TotalPage)
				if(that.CurrentPage < that.TotalPage) {
					that.CurrentPage += 1
					if(that.active !== '') {
						that.GetGroupOrder()
						return
					}
					that.searchGroup()
					return
				}
			},
			
			// 处理返回商品列表
			filterList(datas, res) {
				let that= this
				datas.forEach((item, index) => {
					item.leave_time= ''
					item.width= 0
					that.filterGrade(item, index, (response) => {
						item.discountGrade= response
					})
				})
				
				if(datas.length) {
					datas.forEach((item, index) => {
						mapCurtTime(item.CreateDate, item.EffectiveTime, item)
					})
				}
				uni.hideLoading()
				
				if(that.CurrentPage > 1) {
					that.goodList= that.goodList.concat(datas)
				} else {
					that.goodList= datas
				}
				
			},
			
			// 获取团购订单
			GetGroupOrder() {
				uni.showLoading({
					title: '加载中..',
					mask: true
				})
				var that= this,
					params= {
					"CategoriesCode": that.CategoriesCode,
					"SourceOrder": 1,
					"CurrentPage": that.CurrentPage,
					"PageSize": 6
				}
				that.$request(that.$API.GetGroupOrder, params).then(res => {
					console.log('团购信息', res)
					that.TotalPage= res.Data.TotalPage
					let datas= res.Data.Datas
					that.filterList(datas, res)
				})
			}, 
			// 过滤团购阶段
			filterGrade(obj, index, callback) {
				let that= this,
					gradeNum= 6,    // 拼团等级最大不为零的第几个等级
					maxNum= 6      // 超过的最多人数的第几个等级
				for(var i=1; i<7;i++) {
					if(obj['CustomerQuantityStep'+ i] < 1) {
						gradeNum= i
						break
					}
				}
				for(var j= 1; j<= gradeNum; j++) {
					if(obj.CurrentQuantity < obj['CustomerQuantityStep'+ j]) {
						maxNum= j - 1
						break
					}
				}
				let discountGrade= [],
					differNum= gradeNum - maxNum      // 可用的团购区间
				if(differNum >= 3) {
					for(var m= 0; m < 3; m++) {
						maxNum= maxNum?maxNum: 1
						discountGrade.push({
							Discount: obj['CustomerDiscountStep'+ (maxNum + m)] * 100 / 10,
							section: obj['CustomerQuantityStep'+ (maxNum + m)] + '-' + (obj['CustomerQuantityStep'+ (maxNum + m + 1)] - 1)
						})
					}	
				} else {
					switch(differNum) {
						case 2:
							discountGrade.push({
								Discount: obj['CustomerDiscountStep'+ (gradeNum - 2)] * 100 / 10,
								section: obj['CustomerQuantityStep'+ (gradeNum - 2)] + '-' + (obj['CustomerQuantityStep'+ (gradeNum - 1)] - 1)
							})
						case 1:
							discountGrade.push({
								Discount: obj['CustomerDiscountStep'+ (gradeNum - 1)] * 100 / 10,
								section: obj['CustomerQuantityStep'+ (gradeNum - 1) ] + '-' + (obj['CustomerQuantityStep'+ gradeNum] - 1)
							})
						case 0:
							discountGrade.push({
								Discount: obj['CustomerDiscountStep'+ gradeNum ] * 100 / 10,
								section: obj['CustomerQuantityStep'+ gradeNum] + '起'
							})
							break
					}
				}
				callback(discountGrade)
			},
			goCart() {
				uni.switchTab({
					url: "/pages/cart/cart"
				})
			},
			// 清除所有定时器
			clearAllInterval() {
				let that= this
				return new Promise((resolve, reject) => {
					uni.showLoading({
						title: '数据处理中...',
						mask: true
					})
					let goodList= that.goodList
					goodList.forEach((item, index) => {
						clearInterval(item.timer)
						item.timer= null
						item.leave_time= ''
						if(index === goodList.length - 1) {
							uni.hideLoading()
							resolve(true)
						}
					})
				})
			},
			// 参加团购
			goAddGroup(item) {
				if(!item.leave_time) {
					this.$Toast('抱歉，团购已结束')
					return
				}
				if(item.IsJoinGroup) {
					this.$Toast('你已加入此团购中')
					return
				}
				console.log('xxxxxxx', item)
				let obj = {
					MarketPrice: item.MarketPrice,
					WeightShort: item.WeightShort,
					GoodsName: item.GoodsName,
					GroupCode: item.GroupCode,
					ImageUrl: item.ImageUrl?item.ImageUrl: '',
					Quantity: 1
				}
				uni.navigateTo({
					url: '/pagesA/firmOrder/firmOrder?type=joinGroup&obj=' + JSON.stringify(obj)
				})
			}
		},
		onHide() {
			console.log('执行了onHide清除所有定时器')
			this.clearAllInterval()
		},
		onUnload() {
			console.log('执行了onUnload清除所有定时器')
			this.clearAllInterval()
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		height: 100%;
	}
    .wrapper_top{
		.wrapper_top_item{
			padding: 30upx 25upx;
			font-size: 28upx;
			white-space:nowrap;
		}
	}
	.headWrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 702upx;
		height: 60upx;
		padding: 20upx 24upx 14upx;
		background-color: #FFFFFF;
		transition: 300ms;
		z-index: 4;
	}
	.isHidden{
		top: -94upx;
	}
	.listWrapper{
		padding-top: 80upx;
	}

	.headWrapper .seachWrapper {
		display: inline-block;
		vertical-align: middle;
		width: 702upx;
		box-sizing: border-box;
		height: 60upx;
		background: rgba(246, 246, 246, 1);
		border-radius: 30upx;
		padding-left: 68upx;
		.delIcon{
			z-index: 10;
			position: absolute;
			top: 10upx;
			right: 30upx;
			height: 40upx;
			width: 40upx;
			border-radius: 50%;
			background-color: #ccc;
		}
	}

	.headWrapper .seachWrapper .inputView {
		display: block;
		width: 550upx;
		height: 60upx;
		font-size: 28upx;
		
		color:#000;
	}

	.headWrapper .seachWrapper .icon {
		display: block;
		width: 32upx;
		height: 32upx;
		position: absolute;
		left: 24upx;
		top: 50%;
		margin-top: -16upx;
	}

	.headWrapper .cart {
		display: inline-block;
		vertical-align: middle;
		width: 40upx;
		height: 40upx;
		margin-left: 24upx;
		background-image: url('../../static/cart_black.png');
		background-size: cover;
	}

	.van-tab--active {
		color: $color-red !important;
	}

	/* list */
	.list {
		width: 702upx;
		background-color: #FFFFFF;
		padding: 24upx;
		font-size: 0;
		border-bottom: 20upx solid #f5f5f5;
	}

	.list .leftWrapper {
		display: inline-block;
		vertical-align: top;
		width: 369upx;
		height: 357upx;
		margin-right: 14upx;
		overflow: hidden;
	}

	.list .leftWrapper .pro {
		display: block;
		width: 380upx;
		height: 380upx;
	}

	.list .rightWrapper {
		position: relative;
		display: inline-block;
		vertical-align: top;
		width: 308upx;
		height: 380upx;
	}

	.list .rightWrapper .proTitle {
		width: 276upx;
		font-size: 32upx;
		
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		line-height: 36upx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.list .rightWrapper .priceWrapper {
		width: 273upx;
		font-size: 0;
		margin: 20upx 0;
	}

	.list .rightWrapper .priceWrapper .realWrapper {
		width: 70%;
		display: inline-block;
		vertical-align: bottom;
	}

	.priceWrapper .realWrapper .realPrice {
		display: inline-block;
		vertical-align: bottom;
		font-size: 24upx;
		color: $color-red;
	}

	.realWrapper .realPrice .big {
		font-size: 40upx;
		padding-left: 8upx;
		line-height: 1em;
	}

	.priceWrapper .realWrapper .addGroupIcon {
		display: inline-block;
		vertical-align: bottom;
		width: 24upx;
		height: 24upx;
		margin-left: 12upx;
		margin-bottom: 9upx;
	}

	.list .rightWrapper .priceWrapper .nativePrice {
		width: 30%;
		display: inline-block;
		vertical-align: bottom;
		text-align: right;
		font-size: 24upx;
		font-weight: 400;
		text-decoration: line-through;
		color: rgba(102, 102, 102, 1);
	}

	.groupPreferential {
		display: inline-block;
		min-width: 180upx;
		padding: 5upx 19upx;
		background: rgba(242, 138, 7, 0.2);
		border-radius: 10upx;
	}

	.groupPreferential .preList {
		font-size: 0;
		line-height: 34upx;
	}

	.groupPreferential .preList .leftWrapper1 {
		display: inline-block;
		vertical-align: middle;
		width: 70upx;
		font-size: 24upx;
		
		font-weight: bold;
		color: $color-red;
	}

	.groupPreferential .preList .rightWrapper1 {
		display: inline-block;
		vertical-align: middle;
		min-width: 106upx;
		font-size: 24upx;
		
		color: rgba(85, 85, 85, 1);
	}

	.stepView {
		width: 218upx;
		height: 12upx;
		/* 	opacity:0.3; */
		border-radius: 6upx;
		position: relative;
		margin: 12upx 0 5upx;
	}

	.stepView .step {
		width: 0%;
		height: 12upx;
		border-radius: 6upx;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 2;
		transition: 300ms;
	}

	.countDown {
		padding-left: 8upx;
		font-size: 24upx;
		color: rgba(51, 51, 51, 1);
	}

	.countDown .label {
		font-size: 24upx;
	}

	.countTime {
		display: inline-block;
		font-size: 24upx;
	}


	.bottomList {
		font-size: 0;
		position: absolute;
		right: 0;
		bottom: 0;
		width:100%;
	}

	.bottomList .address {
		// display: inline-block;
		// vertical-align: middle;
	}

	.bottomList .address .icon {
		display: inline-block;
		vertical-align: middle;
		width: 20upx;
		height: 24upx;
		margin-right: 9upx;
	}

	.bottomList .address .text {
		display: inline-block;
		vertical-align: middle;
		font-size: 24upx;
		
		text-decoration: underline;
		color: rgba(51, 51, 51, 1);
		width: 140upx;
	}
	.bottomList .addGroup {
		display: inline-block;
		vertical-align: middle;
		width: 120upx;
		height: 52upx;
		line-height: 52upx;
		text-align: center;
		background: linear-gradient(-90deg, rgba(255,48,59,1),rgba(255,62,72,1));
		border-radius: 26upx;
		margin-left: 22upx;
		font-size: 28upx;
		
		color: rgba(255, 255, 255, 1);
	}
</style>
<style>
	page{
		overflow: scroll;
	}
</style>
