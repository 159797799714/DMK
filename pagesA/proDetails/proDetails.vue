<template>
	<view class="content">
		<commonBox>
			<view class="flex flex-r flex-center tab_v">
				<view class="flexs flex-r" style="width: 86%;">
					<view class="w112 p-re" v-for="(item,i) in tab_list" :key="i" :style="item.id == select_tab?'color:'+themeColor : ''" @click="selectTab(i)">
						{{item.title}}
						<view v-if="item.id == select_tab" class="red_thread" :style="item.id == select_tab?'background:'+themeColor : ''"></view>
					</view>
					<!-- <view  class="red_thread" :style="'transform: translateX('+left_distance+'px); -webkit-transform: translateX('+left_distance+'px);background:'+themeColor"/> -->
				</view>
			</view>
			<scroll-view v-if="detail" scroll-y="true" class="scroll-Y" :scroll-top="scrollTop" @scroll="mainScroll" :style="'height:'+scroll_height+'px;'"
			 scroll-with-animation="true" :scroll-into-view="view_id" :data-v='dataset_v'>
				<view class="proImage box p-re" id="item-1">
					<swiper class="swiper" 
						:autoplay="autoplay" 
						:interval="interval"  
						@change="swiperChange" 
						:duration="duration" 
						:style="{height: SwiperHeight + 'px'}"
					>
						<block v-if="detail.GoodsImages.length > 0">
							<swiper-item class="swiper-item" v-for="(item,index) in detail.GoodsImages" :key='index' :style="{height: SwiperHeight + 'px'}">
								<image class="proBg" :src="item.NetPath" mode="widthFix" @click="preview(detail.GoodsImages, index)"></image>
							</swiper-item>	
						</block>
						<block v-else>
							<swiper-item class="swiper-item" :style="{height: SwiperHeight + 'px'}">
								<image class="proBg" :src="detail.ImageUrl" mode="widthFix" @click="preview(detail['ImageUrl'], 0)"></image>
							</swiper-item>
						</block>
					</swiper>
					<view class="indicator">
						<text v-for="num in detail.GoodsImages.length" :key="num" class="point" :style="{'background': swiperIndex == num?themeColor: '#fff'}"></text>
					</view>
				</view>
				<view class="proList">
					<view>
						<view class="proTitle">{{detail.GoodsName}} {{detail.WeightShort}}</view>
						<image :src="'../../static/collect'+(detail.Iscare?'ed':'')+'.png'" mode="" class="collect-icon" @click="collectAction(detail.GoodsCode, detail.Iscare)"></image>
					</view>
					<view class="priceAndNum">
						<!-- 折扣价 -->
						<view class="price line-1 dis-flex flex-y-end">
							<block v-if="detail.DiscountPrice > 0">
								<view class="twoPrice dis-inline-block">
									<view class="truePrice dis-flex flex-y-end">
										¥<text class="big">{{splitPrice(detail.DiscountPrice)[0]}}.</text>
										<text class="f-24">{{splitPrice(detail.DiscountPrice)[1]}}</text>
									</view>
								</view>	
							</block>
							
							<!-- 原价 -->
							<block v-else-if="detail.DiscountPrice < 1 && detail.MembershipPrice < 1">
								<view class="twoPrice dis-inline-block">
									<view class="truePrice dis-flex flex-y-end">
										¥<text class="big">{{splitPrice(detail.MarketPrice)[0]}}.</text>
										<text class="f-24">{{splitPrice(detail.MarketPrice)[1]}}</text>
									</view>
								</view>	
							</block>
							
							<!-- 会员价 -->
							<block v-if="detail.DiscountPrice < 1 && detail.MembershipPrice > 1">
								<view class="min-price m-l-12 dis-inline-block f-28 col-blue">
									¥{{toFixed(detail.MembershipPrice)}}
								</view>
								<view class="member-price dis-inline-block bg-blue col-f f-20">会员价</view>	
							</block>
							
							<!-- 划线价 -->
							<view v-if="detail.Price != detail.MarketPrice" class="originalPrice">
								¥{{toFixed(detail.MarketPrice)}}
							</view>
							
						</view>
						<view class="proNum">
							销量:{{detail.SalesQuantity}}
						</view>
					</view>
					<view class="noticeTime dis-flex flex-x-between">
						<view>
							<image class="icon" src="../../static/timeLock.png" mode=""></image>
							<text>{{detail.DeliverySection}}</text>
						</view>
						<view v-if="GroupOrders.length > 0" class="col-33 f-28" @click.stop="lookAllGroup">
							全部<image src="../../static/next.png" mode="" class="moreIcon"></image>
						</view>
					</view> 
					<view v-if="GroupOrders.length > 0" class="groupBox p-re over-hidden">
						<swiper vertical="true" :autoplay="true" :interval="2000" :duration="1000" :circular="true" :display-multiple-items="GroupOrders.length > 1? 2: 1" class="groupSwiper" 
						:style="GroupOrders.length > 1?'height: 440rpx': 'height: 220rpx'">
							<swiper-item v-for="(item, index) in GroupOrders" :key="index" class="groupSwiperItem" :class="GroupOrders.length === index?'': 'bottom-border'">
								<view class="groupList dis-flex flex-x-between flex-y-center">
									<view>
										<view class="nickName col-red f-24">
											¥<text class="f-40">{{splitPrice(toFixed(item.CurrentPrice))[0]}}.</text>
											<text class="f-24">{{splitPrice(toFixed(item.CurrentPrice))[1]}}</text>
										</view>
									</view>
									<view class="activity">
										<view class="groupNum">已有<text class="color">{{item.CurrentQuantity}}人</text>参与拼团</view>
										<view v-if="item.leave_time" class="time">剩余{{item.leave_time}}</view>
									</view>
									<view class="addGroup" :class="item.IsJoinGroup?'bg-D8': ''"
									 :style="item.IsJoinGroup?'':'background: '+ themeColor" @click="goAddGroup(item)">{{item.IsJoinGroup?'已参团': '去参团'}}</view>
								</view>
								<view class="groupWay dis-flex col-33 f-24">
									<view v-for="(obj, num) in item.discountGrade" :key="num">
										{{obj.section}}团
										<text class="col-red f-32">{{obj.Discount}}</text>折{{num + 1 == item.discountGrade.length?'': '；'}}
									</view>
									<!-- 2人团<text class="col-red f-32"> 9.5 </text>折；3-5人团<text class="col-red f-32"> 9.5 </text> 折；5人起团<text class="col-red f-32"> 5 </text> 折 -->
								</view>
							</swiper-item>
						</swiper>
					</view>
					
					<view class="specWrapper box" id="item-2">
						<view class="specTitle">规格</view>
						<view class="specCon">
							<view v-if="detail.WeightShort" class="specList">
								<view class="label">净含量</view>
								<view class="cur">{{detail.WeightShort}}</view>
							</view>
							<view v-if="detail.ProductPlace" class="specList">
								<view class="label">产地</view>
								<view class="cur">{{detail.ProductPlace}}</view>
							</view>
							<view v-if="detail.StorageMethods" class="specList">
								<view class="label">储存条件</view>
								<view class="cur">{{detail.StorageMethods}}</view>
							</view>
						</view>
					</view>
			
					<view class="produceDetails box" id="item-3">
						<view class="title">商品详情</view>
						<rich-text :nodes="detail.GoodsDetail"></rich-text>
					</view>
			
					<view class="comments box" id="item-4">
						<view class="title">
							商品评价({{detail.GoodsComment.length?detail.GoodsComment.length: 0}})
							<view v-if="detail.GoodsComment.length" class="rightItem dis-inline-block col-33 f-28 f-right" @click="lookAllComment">
								全部<image src="../../static/next.png" mode="" class="moreIcon"></image>
							</view>
						</view>
						<view v-if="outGoodsComment.length > 0" class="comment-content">
							<view class="comment-item" v-for="(item, index) in outGoodsComment" :key="index">
								<view class="item-header dis-flex flex-y-center">
									<image :src="item.CustomerImage?item.CustomerImage:'../../static/userIcon.png'" mode="" class="user-img bg-ff"></image>
									<view>
										<view class="col-33 f-24">{{item.CustomerName}}</view>
										<view class="star dis-flex">
											<image v-for="imgItem in item.CommentStar" :key="imgItem" src="../../static/star_yes.png" mode=""></image>
										</view>
									</view>
								</view>
								<view class="comment-words f-28 col-33 twoline-hidden">{{item.Content}}</view>
								<view class="comment-images">
									<image v-for="(obj, num) in item.CommontImages" :key="num" :src="obj.NetPath" :class="item.CommontImages.length < 4?'b-radius-12': ''" mode="" @click="preview(item.CommontImages, num)"></image>	
								</view>
							</view>
						</view>
					</view>
					<!-- @touchstart="change(5)" -->
					<view class="recommendWrapper box" id="item-5">
						<view class="title">推荐食谱</view>
						<view class="recommendCon">
							<view class="Wrapper" v-for="(item, index) in detail.GoodsRecipes" :key="index" @click="goCookery(item.RecipesId)">
								<view class="listBox">
									<image class="icon" :src="item.ImageUrl" mode="aspectFill"></image>
									<view class="desc">{{item.RecipesName}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view v-show="detail" class="buttonGroup">
				<block v-if="ShareId">
					<view class="addCar" :style="'background: '+ themeColor" @click="goAddGroup(GroupOrders[0])">立即参团</view>
				</block>
				<block v-else>
					<view class="creatGroup" :class="isGrouping?'bg-yellow': 'bg-D8'" @click="createGroupOrder">
						创建团购
					</view>
					<view class="attendGroup"  :style="'background: '+ themeColor" @click="goAddCart(detail.GoodsCode)">
						加入购物车
					</view>
					<view class="addCar" @click="buyNow" :style="'background: '+ themeColor">
						立即购买
					</view>	
				</block>
				
			</view>
			
			<!-- 全部团购单弹窗 -->
			<uni-popup ref="popup" type="center">
				<view class="popup-main">
					<view class="main">
						<scroll-view scroll-y="true" class="itemMain" style="height: 100%">
							<view  v-for="(item, index) in GroupOrders" :key="index" class="groupBox p-re over-hidden b-b">
								<view class="groupList dis-flex flex-x-between flex-y-center">
									<view>
										<view class="nickName col-red f-24">
											¥<text class="f-44">{{splitPrice(toFixed(item.CurrentPrice))[0]}}.</text>
											<text class="f-24">{{splitPrice(toFixed(item.CurrentPrice))[1]}}</text>
										</view>
									</view>
									<view class="activity">
										<view class="groupNum">已有<text class="color">{{item.CurrentQuantity}}人</text>参与拼团</view>
										<view v-if="item.leave_time" class="time">剩余{{item.leave_time}}</view>
									</view>
									<view class="addGroup" :class="item.IsJoinGroup?'bg-D8': ''"  
									:style="item.IsJoinGroup?'':'background: '+ themeColor" @click="goAddGroup(item)">{{item.IsJoinGroup?'已参团': '去参团'}}</view>
								</view>
								<view class="groupWay dis-flex col-33 f-24">
									<view v-for="(obj, num) in item.discountGrade" :key="num">
										{{obj.section}}团<text class="col-red f-32">{{obj.Discount}}</text>折{{num + 1 == item.discountGrade.length?'': '；'}}
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
					<view class="closeIcon" @click="close">
						<image src="../../static/circleClose.png" mode=""></image>
					</view>
				</view>
			</uni-popup>
		</commonBox>
		
		<cartIconfk class="cart-icon-fk" ref="cartIconFk" :style="'position: fixed;bottom: '+ bottom+ 'px;right:'+ right +'px;' " @touchMove="cartIconMove"></cartIconfk>
	</view>
</template>

<script>
	import {curtTime,splitPrice} from '@/common/utils.js'
	import commonBox from "@/components/commonBox.vue"
	import cartIconfk from "@/components/cartIconfk.vue"
	import themeColors from '@/mixin/themeColors.js'
	
	export default {
		mixins: [themeColors],
		components: {
			commonBox,
			cartIconfk
		},
		data() {
			return {
				splitPrice: splitPrice,
				toFixed: this.helper.toFixed,
				preview:this.helper.preview,
				view_id: 'item-1',
				id: '',
				dataset_v:0,
				left_distance: 0,
				select_tab: 1,
				detail: '',
				GroupOrders: '',                 // 正在进行的团购单
				groupSwiperArr: [],              // 正在进行的团购单
				isGrouping: true,                // 是否支持团购
				autoplay: true,
				interval: 5000,
				duration: 500,
				SwiperWidth: 375,
				SwiperHeight: 375,
				swiperIndex: 0,                  // 轮播图指示点
				outGoodsComment: [],             // 外面显示的两个评论的列表
				strings: '', // 商品详情富文本信息
				tab_list: [{
						id: 1,
						title: '宝贝'
					},{
						id: 2,
						title: '规格'
					},{
						id: 3,
						title: '详情'
					},{
						id: 4,
						title: '评论'
					},{
						id: 5,
						title: '食谱'
					}
				],
				scroll_height: '',
				topArr: [],
				left_w: '',
				scrollTop: 0,
				ShareId: '',
				bottomDefault: 81,
				rightDefault: 10,          // 购物车默认偏移量
				cartDom: {
					offsetL: 0,
					maxRight: 0,
					minRight: 0,
					maxBottom: 0,
					minBottom: 0
				},
				bottom: 81,
				right: 10
			}
		},
		async onLoad(e) {
			let that= this 
			if(e.q){
				console.log(decodeURIComponent(e.q))
				let url=decodeURIComponent(e.q)
				let param=this.$getParamsFromUrl(url)
				console.log('param',param)
				that.id=param.id
				that.ShareId=param.shareId
			} else{
				if(e.id){
					console.log('商品id',e, e.id)
					that.id = e.id
				}
				if(e.shareId) {
					console.log('接收到shareId', e.shareId)
					that.ShareId= e.shareId
				}
			}
		
			uni.getSystemInfo({
				success: function(res) {
					console.log('获取到页面信息', res)
					that.scroll_height = res.windowHeight - uni.getStorageSync('statusBarHeight') - 44
					that.SwiperWidth = that.winW = res.windowWidth
					that.SwiperHeight = res.windowWidth
					that.winH = res.windowHeight
				}
			})
			that.getCartBoundary()
			that.getProDetails()

		},
		onReady() {
			let _this = this
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
			}
			this.timeoutId = setTimeout(function() { //节流
				_this.getHeightList();
			}, 1000)
		},
		onUnload() {
			console.log('执行了onUnload')
			this.clearAllInterval()
		},
		onHide() {
			console.log('执行了onHide')
			this.clearAllInterval()
		},
		methods: {
			// 滑动轮播图
			swiperChange(e) {
				this.swiperIndex= e.detail.current
				//this.setSwiperHeight(e.detail.current)
			},
			
			getCartBoundary(){
				const that = this
				setTimeout(()=>{
					let query = uni.createSelectorQuery().in(that)
					query.select(".cart-icon-fk").fields({
						rect: true,
						size: true
					}, res => {
						this.cartDom.offsetL = res.width/2
						this.cartDom.maxRight = this.winW - res.width
						this.cartDom.minRight = 0
						this.cartDom.maxBottom = this.winH - res.width
					}).exec();
					
					query.select(".buttonGroup").boundingClientRect(res=>{
						console.log( '底部面板', res)
						this.cartDom.minBottom = res.height
					}).exec()
				}, 200)
			},
			// 购物车图标拖动
			cartIconMove(shortX, shortY) {
				this.bottom = Math.max(Math.min(this.bottomDefault + shortY, this.cartDom.maxBottom), this.cartDom.minBottom)
				this.right= Math.max(Math.min(this.cartDom.offsetL + shortX, this.cartDom.maxRight), this.cartDom.minRight)
			},
			// 食谱详情
			goCookery(RecipesId) {
				uni.redirectTo({
					url: '/pagesA/cookeryDetails/cookeryDetails?id=' + RecipesId
				})
			},
			close(){
				this.$refs.popup.close()
			},
			open(){       // 打开选择弹窗
			  this.$refs.popup.open()
			},
			jump_message(){
				uni.navigateTo({
					url:"/pagesB/message/message"
				})
			},
			// 清除所有定时器
			clearAllInterval() {
				if(this.GroupOrders.length < 1 || !this.GroupOrders) {
					return
				}
				this.GroupOrders.forEach((item, index) => {
					clearInterval(item.timer)
					item.timer= null
				})
			},
			// 查看所有团购订单
			lookAllGroup() {
				this.open()
			},
			setSwiperHeight(index) {
				// 按照屏幕的嘴大60%显示
				// let Height= this.detail.GoodsImages[index].ImageHeight / this.detail.GoodsImages[index].ImageWidth * this.SwiperWidth,
				// 	maxHeight= this.SwiperHeight * 0.6
				// this.SwiperHeight = Height > maxHeight? Height: maxHeight
				// console.log('Height', Height, this.SwiperHeight)
			},
			getHeightList() {
				let _this = this;
				let h1 = 0
				let selectorQuery = uni.createSelectorQuery();
				selectorQuery.selectAll('.tab_v').boundingClientRect(function(rects) {
					console.log("tab_v", rects)
					h1 = rects[0].height
				})
				selectorQuery.selectAll('.box').boundingClientRect(function(rects) {
					let arr = [];
					let top = 0;
					console.log("rects", rects)
					rects.forEach(function(rect) {
						let top = rect.top - h1
						arr.push(top)
					})
					console.log(arr)
					_this.topArr = arr
				}).exec()
				uni.hideLoading();
			},
			/* 主区域滚动监听 */
			mainScroll(e) {
				if(e.currentTarget.dataset.v>=0){
					this.dataset_v = e.currentTarget.dataset.v+1
				}
				let _this = this
				if (this.timeoutId) {
					clearTimeout(this.timeoutId);
				}
				this.timeoutId = setTimeout(function() { //节流
					let top = e.detail.scrollTop
					let id
					/* 查找当前滚动距离 */
					for (let i = _this.topArr.length - 1; i >= 0; i--) {
						/* 在部分安卓设备上，因手机逻辑分辨率与upx单位计算不是整数，滚动距离与有误差，增加2px来完善该问题 */
						if (top >= _this.topArr[i]-80) {
							id = i + 1
							break;
						}
					}
					if(e.currentTarget.dataset.v>1){
						_this.select_tab = id
						let left_w = _this.left_w
						_this.left_distance = (left_w.w1 - left_w.w2) / 2 + (id - 1) * left_w.w1
					}
					_this.timeoutId = undefined;
				}, 100)
			},
			
			selectTab(index) {
				this.dataset_v=0
				this.view_id = "item-" + (index + 1)
				this.select_tab = index + 1
				let left_w = this.left_w
				this.left_distance = (left_w.w1 - left_w.w2) / 2 + index * left_w.w1
				//this.scrollTop == this.topArr[index] ? this.scrollTop = this.scrollTop+1 : this.scrollTop = this.topArr[index]//防止两次相等造成点击不触发滚动时间
			},
			lookAllComment() {
				let obj= {
					arr: this.detail.GoodsComment
				}
				let str= JSON.stringify(obj)
				uni.navigateTo({
					url: '/pagesB/comment/comment?obj=' + encodeURIComponent(str)
				})
			},
			// 收藏，取消收藏
			collectAction(GoodsCode, Iscare) {
				let that = this
				if(!that.$stopAction()) {
					return
				}
				let	params = {
						GoodsCode: GoodsCode,
						SourceOrder: 1
					}
				if (Iscare) {
					that.$request(that.$API.DeleteCareGoods, {
						GoodsCode: [GoodsCode],
						SourceOrder: 1
					}).then(res => {
						that.detail.Iscare = false
					})
					return
				}
				that.$request(that.$API.MycareGoods, params).then(res => {
					that.detail.Iscare = true
				})
			},
			// 加入购物车
			goAddCart(GoodsCode, isBuy) {
				var that = this
				if(!that.$stopAction()) {
					return
				}
				that.$createCart(GoodsCode, isBuy).then(res=>{
					if(!res)return;
					that.$store.commit('buy', {goods:that.detail})
					this.$refs.cartIconFk.getCartNumAgain()
				})
			},
			// 去参团
			goAddGroup(item) {
				let that= this
				if(!item.leave_time) {
					return
				}
				if(item.IsJoinGroup) {
					return
				}
				let obj= {
					MarketPrice: item.MarketPrice,
					GoodsCode: that.detail.GoodsCode,
					WeightShort: item.WeightShort,
					GoodsName: item.GoodsName,
					PayType: 1,
					GroupCode: item.GroupCode,
					ImageUrl: that.detail.ImageUrl?that.detail.ImageUrl: '',
					ShareId: that.ShareId?that.ShareId: '',
					Quantity: 1
				}
				uni.navigateTo({
					url: '/pagesA/firmOrder/firmOrder?type=joinGroup&obj=' + JSON.stringify(obj)
				})
			},
			onShareAppMessage(res) {
				if (res.from === 'button') {// 来自页面内分享按钮
					console.log(res.target)
				}
				return {
					title: this.detail.GoodsName,
					path: '/pagesA/proDetails/proDetails?id='+ this.detail.GoodsCode,
					imageUrl: this.detail.ImageUrl
				}
			},
			getProDetails() {
				let that = this,
					paramData = {
						"GoodsCode": that.id,
						"ShareId": that.ShareId?that.ShareId: ''
					};
					console.log('id',that.id, '获取详情时ShareId', that.ShareId)
				that.$request(that.$API.GetStoreGoodsDetail, paramData).then(res => {
					console.log('商品详情',res)
					if (res.Success == 0) {
						res.Data.GoodsDetail = res.Data.GoodsDetail.replace(/width:[^;]+;/gi, 'max-width:100%;display: block;');
						res.Data.Price = this.helper.filter_fields(res.Data)
						that.detail = res.Data
						that.getCartBoundary()
						if(res.Data.GoodsComment.length > 1) {
							let arr= []
							arr.push(res.Data.GoodsComment[0])
							arr.push(res.Data.GoodsComment[1])
							that.outGoodsComment= arr
						} else {
							that.outGoodsComment= res.Data.GoodsComment
						}
						if(res.Data.GoodsImages.length > 0) {
							// 初始化设置swiper高度
							that.setSwiperHeight(0)
						}
						that.imageArr= res.Data.GoodsImages
						
						// 判断是否支持团购
						that.setGrouping()
						
						let GroupOrders= res.Data.GroupOrders,
							groupSwiperArr= []
						
						GroupOrders.forEach((item, index) => {
							that.filterGrade(item, index, (response) => {
								item.discountGrade= response
							})
							let Index= index + 1
							if(index > 0 && Index % 2 === 0) {
								groupSwiperArr.push(GroupOrders.slice(Index - 2, Index))
							} else if(Index === GroupOrders.length){
								groupSwiperArr.push(GroupOrders.slice(Index - 1, Index))
							}
							item.leave_time= null
							item.timer= null
						})
						that.groupSwiperArr= groupSwiperArr
						console.log('groupSwiperArr', groupSwiperArr)
						that.filterList(GroupOrders)
					}
				})
			},
			// 处理返回商品列表
			filterList(datas) {
				let that= this
				that.GroupOrders= datas
				
				// 批量处理倒计时
				async function mapCurtTime(CreateDate, EffectiveTime, index) {
					that.GroupOrders[index].timer= setInterval(function(){
						curtTime(CreateDate, EffectiveTime, function(response) {
							if(!response) {
								clearInterval(that.GroupOrders[index].timer)
								that.GroupOrders[index].timer= null
								return
							}
							let item= that.GroupOrders[index]
							if(response[3]) {
								let day= response[3] + '天'
								response.pop()
								item['leave_time']= response? day + response.join(':') : null
							} else {
								item['leave_time']= response? response.join(':') : null
							}
							that.GroupOrders.splice(index, 1, item)
						})
					}.bind(this), 1000)
				}
				datas.forEach((item, index) => {
					mapCurtTime(item.CreateDate, item.EffectiveTime, index)
				})
				
			},
			// 判断是否支持团购
			setGrouping() {
				if(!this.detail.GroupCaseId || this.detail.IsJoinGroup) {
					this.isGrouping= false
					return
				}
				let startTime = Date.parse(new Date(this.detail.GroupStarDate)),
				  endTime = Date.parse(new Date(this.detail.GroupEndDate)),
					nowTime = Date.parse(new Date())
					
				if (startTime > nowTime || endTime < nowTime) {
					this.isGrouping= false
				}
			},
			
			// 创建团购
			createGroupOrder() {
				if(this.detail.IsJoinGroup) {
					this.$Toast('你已创建过该商品团购活动哦')
					return
				} else if(!this.isGrouping) {
					this.$Toast('该商品暂不支持团购')
					return
				}
				let obj = {
					MarketPrice: this.detail.MarketPrice,
					GoodsWeight: this.detail.GoodsWeight,
					WeightShort: this.detail.WeightShort,
					GoodsName: this.detail.GoodsName,
					GoodsCode: this.detail.GoodsCode,
					ImageUrl: this.detail.ImageUrl?this.detail.ImageUrl: '',
					Quantity: 1
				}
				uni.navigateTo({
					url: '/pagesA/firmOrder/firmOrder?type=createGroup&obj=' + JSON.stringify(obj)
				})
			},
			// 处理团购阶段
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
							section: obj['CustomerQuantityStep'+ (maxNum + m)] != (obj['CustomerQuantityStep'+ (maxNum + m + 1)] - 1)?
								obj['CustomerQuantityStep'+ (maxNum + m)] + '-' + (obj['CustomerQuantityStep'+ (maxNum + m + 1)] - 1) + '人':
								obj['CustomerQuantityStep'+ (maxNum + m)] + '人'
						})
					}	
				} else {
					switch(differNum) {
						case 2:
							discountGrade.push({
								Discount: obj['CustomerDiscountStep'+ (gradeNum - 2)] * 100 / 10,
								section: obj['CustomerQuantityStep'+ (gradeNum - 2)] != (obj['CustomerQuantityStep'+ (gradeNum - 1)] - 1) ?
									obj['CustomerQuantityStep'+ (gradeNum - 2)] + '-' + (obj['CustomerQuantityStep'+ (gradeNum - 1)] - 1) + '人': 
									obj['CustomerQuantityStep'+ (gradeNum - 2)] + '人'
							})
						case 1:
							discountGrade.push({
								Discount: obj['CustomerDiscountStep'+ (gradeNum - 1)] * 100 / 10,
								section: obj['CustomerQuantityStep'+ (gradeNum - 1) ] != (obj['CustomerQuantityStep'+ gradeNum] - 1)?
									obj['CustomerQuantityStep'+ (gradeNum - 1) ] + '-' + (obj['CustomerQuantityStep'+ gradeNum] - 1) + '人':
									obj['CustomerQuantityStep'+ (gradeNum - 1) ] + '人'
							})
						case 0:
							discountGrade.push({
								Discount: obj['CustomerDiscountStep'+ gradeNum ] * 100 / 10,
								section: obj['CustomerQuantityStep'+ gradeNum] + '人起'
							})
							break
					}
				}
				callback(discountGrade)
			},
			// 立即购买
			buyNow() {
				let that = this,
						arr = [],
						obj = {};
				if(that.detail.StoreQuantity < 1) {
					that.$Toast('库存不足，无法购买')
					return
				}
				function buy() {
					for (var i in that.detail) {
						if (i === 'GoodsImages') {
							console.log('xxx', obj[i])
							obj.GoodsImage = {NetPath: obj[i]?obj[i][0].NetPath: that.detail.ImageUrl}
						} else if (i !== 'GoodsDetail') {
							obj[i] = that.detail[i]
						}
					}
					
					// 先加入购物车
					that.goAddCart(that.detail.GoodsCode, true)
					
					// 获取商品在购物车的cartid
					that.$request(that.$API.GetCustomerCart, {SourceOrder: 1}).then(res => {
						res.Data.forEach(item => {
							if (item.GoodsCode === that.detail.GoodsCode) {
								obj.CartId = item.CartId
								obj.Quantity = 1
								arr.push(obj)
								let str= JSON.stringify(arr)
									
								uni.navigateTo({
									url: '/pagesA/firmOrder/firmOrder?order_list=' + encodeURIComponent(str)
								})	
							}
						})
					})
				}
				// 为今日免费商品
				if(that.detail.IsFree) {
					uni.showModal({
						title: '温馨提示',
						content: '确认购买今日免费商品？',
						success: function (response) {
							if (response.confirm) {
								buy()
							} else if (response.cancel) {
								return
							}
						}
					})
					return
				}
				
				buy()
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cover-view{
		position: fixed;
		top: 0;
		bottom: 0;
		height: 100%;
		width: 100%;
		background: rgba($color: #000000, $alpha: 0.9);
		z-index: 20;
	}
	.tab_v {
		width: 100%;
		z-index: 10;
		font-size: 28upx;
	}

	.w112 {
		padding-bottom: 20upx;
		width: 20%;
		text-align: center;
		line-height: 48upx;
	}

	.tab_vs {
		font-size: 32upx;
	}

	.red_thread {
		display: block;
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 50rpx;
		height: 4rpx;
	}

	.proImage {
		width: 100%;
	}

	.proImage .swiper {
		width: 100%;
	}
	.proImage .proBg {
		display: block;
		width: 100%;
	}

	/* proList */
	.proList {
		width: 702upx;
		// height: 165upx;
		margin: 40upx auto 0;
	}

	.proList .proTitle {
		display: inline-block;
		box-sizing: border-box;
		width: calc(100% - 80upx);
		font-size: 36upx;
		line-height: 38upx;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		padding-bottom: 23upx;
	}

	.collect-icon {
		height: 40upx;
		width: 40upx;
		float: right;
	}

	.proList .priceAndNum {
		display: flex;
		margin-bottom: 50upx;
		line-height: 1;
	}

	.priceAndNum .price {
		flex: 1;
		.min-price{
			line-height: 24upx;
		}
	}

	.priceAndNum .price .twoPrice {
		font-size: 0;
		.truePrice {
			font-size: 24upx;
			color: $color-red;
		}
		
		.truePrice .big {
			font-size: 40upx;
			line-height: 36upx;
			color: $color-red;
		}
	}
	.originalPrice {
		display: inline-block;
		vertical-align: bottom;
		font-size: 24upx;
		text-decoration: line-through;
		color: rgba(177, 177, 177, 1);
		margin-left: 16upx;
	}
	.member-price{
		margin-left: 6upx;
		padding: 2upx 7upx;
		border-radius: 4upx;
	}

	.priceAndNum .proNum {
		flex: 1;
		text-align: right;
		font-size: 24upx;
		color: rgba(156, 156, 156, 1);
	}

	/* noticeTime */
	.noticeTime {
		margin-bottom: 22upx;
		width: 702upx;
		height: 30upx;
		line-height: 1;
		font-size: 0;
		.icon {
			display: inline-block;
			width: 30upx;
			height: 30upx;
			border-radius: 50%;
			/* margin-left: 24upx; */
		}
		text {
			display: inline-block;
			font-size: 28upx;
			color: rgba(51, 51, 51, 1);
			padding-left: 13upx;
			line-height: 30upx;
		}
	}
	.moreIcon{
		display: inline-block;
		height: 20upx;
		width: 12upx;
		margin-left: 8upx;
		font-weight: 400;
	}
	
	// groupWay
	.groupWay{
		height: 56upx;
		padding: 0 24upx;
		vertical-align: middle;
		line-height: 56upx;
		background-color: #E6E6EB;
		border-radius: 12upx;
		text{
			margin: 0 10upx;
		}
	}
	
	/* groupActivity */
	.groupBox{
		margin-bottom: 50upx;
		width: 100%;
		box-sizing: border-box;
		padding: 0 24upx;
		border-radius: 12upx;
		background-color: #F0F0F5;
		.groupSwiper{
			.groupSwiperItem{
				height: 50%;
			}
		}
	}

	.groupList {
		width: 100%;
		height: 122upx;
		box-sizing: border-box;
		padding-top: 14upx;
	}
	.bottom-border{
		border-bottom: 1upx solid #DEDEDE;
	}

	.groupList .userIcon {
		display: inline-block;
		vertical-align: middle;
		width: 72upx;
		height: 72upx;
	}

	.groupList .nickName {
		display: inline-block;
		vertical-align: middle;
		width: 130upx;
	}

	.groupList .activity {
		flex: 1;
		display: inline-block;
		vertical-align: middle;
		text-align: right;
	}

	.groupList .activity .groupNum {
		font-size: 28upx;
		color: rgba(51, 51, 51, 1);
	}

	.groupList .activity .groupNum .color {
		color: $color-red;
	}

	.groupList .activity .time {
		font-size: 28upx;
		color: rgba(153, 153, 153, 1);
		margin-top: 8upx;
	}

	.groupList .addGroup {
		display: inline-block;
		vertical-align: middle;
		width: 120upx;
		height: 52upx;
		line-height: 52upx;
		text-align: center;
		background: $linear-red;
		border-radius: 26upx;
		font-size: 28upx;
		color: rgba(255, 255, 255, 1);
		margin-left: 24upx;
	}

/* noticeTime */
	.noticeTime {
		margin-bottom: 12upx;
		width:702upx;
		height:30upx;
		font-size: 0;
	}
	.noticeTime .icon {
		display: inline-block;
		vertical-align: middle;
		width: 30upx;
		height: 30upx;
		border-radius: 50%;
		/* margin-left: 24upx; */
	}
	.noticeTime text {
		display: inline-block;
		vertical-align: middle;
		font-size:28upx;
		color:rgba(51,51,51,1);
		padding-left: 13upx;
		line-height: 30upx;
	}


	/* specWrapper */
	.specWrapper {
		width: 702upx;
		margin: auto;
	}

	.specWrapper .specTitle {
		font-size: 36upx;
		line-height: 36upx;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		margin-bottom: 24upx;
	}

	.specWrapper .specCon {
		width: 654upx;
		/* height:360upx; */
		background: rgba(240, 240, 245, 1);
		border-radius: 12upx;
		padding: 0 24upx;
	}

	.specWrapper .specCon .specList {
		width: 100%;
		height: 88upx;
		line-height: 88upx;
		border-bottom: 1upx solid #DEDEDE;
	}

	.specCon .specList .label {
		display: inline-block;
		vertical-align: middle;
		width: 154upx;
	}

	.specCon .specList .label {
		display: inline-block;
		vertical-align: middle;
		width: 154upx;
		font-size: 28upx;
		color: rgba(177, 177, 177, 1);
	}

	.specCon .specList .cur {
		display: inline-block;
		vertical-align: middle;
		width: 500upx;
		font-size: 28upx;
		color: rgba(51, 51, 51, 1);
	}

	/* produceDetails */
	.produceDetails {
		display: block;
		font-size: 0;
		width: 100%;
	}
	.comments{
		line-height: 1;
	}
	.title {
		font-size: 36upx;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		padding: 40upx 0 24upx 0upx;
		.rightItem{
			font-weight: 400;
			line-height: 1;
			padding-top: 4upx;
		}
	}

	.produceImages image {
		width: 100%;
	}

	// comments
	.comment-content {
		padding: 0 24upx 20upx;
		border-radius: 12upx;
		background-color: #f0f0f5;
		line-height: 1em;

		.comment-item {
			padding: 32upx 0 39upx;
			border-bottom: 1upx solid #dedede;

			&:last-of-type {
				border-bottom: 0;
			}

			.item-header {
				height: 60upx;

				.user-img {
					margin-right: 20upx;
					height: 60upx;
					width: 60upx;
					border-radius: 100%;
				}

				.star {
					margin-top: 7upx;

					&>image {
						height: 22upx;
						width: 22upx;
						margin-right: 12upx;
					}
				}
			}

			.comment-words {
				margin: 20upx 0;
				line-height: 36upx;
			}
			.b-radius-12{
				border-radius: 12upx;
			}
			.comment-images {
				width: 100%;
				max-height: 162upx;
				border-radius: 12upx;
				overflow: auto;
				white-space: nowrap;

				&>image {
					margin-right: 2upx;
					height: 162upx;
					width: 162upx;
					display: inline-block;
					&:nth-child(4n) {
						margin-right: 0;
					}
				}
			}
		}
	}

	/* recommendWrapper */
	.recommendWrapper {
		width: 706upx;
		margin: 0 auto 76upx;
	}

	.recommendWrapper .title {
		font-size: 36upx;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		padding: 40upx 0 24upx 0upx;
		
	}

	.recommendWrapper .recommendCon {
		font-size: 0;
	}

	.recommendCon .Wrapper {
		display: inline-block;
		vertical-align: top;
		width: 344upx;
		margin-right: 18upx;

		&:nth-of-type(2n) {
			margin-right: 0;
		}
	}

	.listBox {
		width: 344upx;
	}

	.listBox .icon {
		display: block;
		width: 344upx;
		height: 280upx;
		border-radius: 8upx;
		background-color: #f5f5f5;
	}

	.listBox .desc {
		width: 344upx;
		height: 94upx;
		font-size: 32upx;
		line-height: 32upx;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		padding: 23upx 0 0 12upx;
	}

	/* buttonGroup */
	.buttonGroup {
		width: 702upx;
		height: 76upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0upx -1upx 0upx 0upx rgba(240, 240, 240, 1);
		padding: 11upx 24upx;
		position: absolute;
		left: 0;
		bottom: 0;
		text-align: right;
	}
	.buttonGroup .addCar {
		display: inline-block;
		vertical-align: middle;
		width: 250upx;
		height: 76upx;
		line-height: 76upx;
		text-align: center;
		background: $linear-red;
		border-radius: 38upx;
		font-size: 32upx;
		color: #FFFFFF;
	}

	.buttonGroup .creatGroup {
		display: inline-block;
		vertical-align: middle;
		width: 214upx;
		height: 76upx;
		line-height: 76upx;
		text-align: center;
		opacity: 0.75;
		border-radius: 38upx 0px 0px 38upx;
		font-size: 32upx;
		color: rgba(255, 255, 255, 1);
	}
	.bg-yellow{
		background: linear-gradient(-90deg, rgba(255, 150, 0, 1), rgba(255, 192, 0, 1));
	}

	.buttonGroup .attendGroup {
		display: inline-block;
		vertical-align: middle;
		width: 214upx;
		height: 76upx;
		line-height: 76upx;
		text-align: center;
		// background: linear-gradient(-90deg, rgba(249, 90, 75, 1), rgba(241, 81, 66, 1));
		// opacity: 0.75;
		border-radius: 0upx 38upx 38upx 0upx;
		font-size: 32upx;
		color: rgba(255, 255, 255, 1);
		margin-right: 24upx;
	}
	
	.popup-main{
		position: fixed;
		top: 80upx;
		left: 0;
		right: 0;
		margin: 0 auto;
		height: calc(100% - 110upx);
		width: calc(100% - 48upx);
		box-sizing: border-box;
		padding: 24upx 0;
		.main{
			width: 100%;
			height: calc(100% - 150upx);
			background-color: #F0F0F5;
			border-radius: 12upx;
		}
		.closeIcon{
			margin: 0 auto;
			height: 60upx;
			width: 60upx;
			padding: 45upx 0;
			&>image{
				height: 60upx;
				width: 60upx;
			}
		}
		.groupBox{
			box-sizing: border-box;
			padding-bottom: 40upx;
			margin-bottom: 0;
		}
	}
	
	.b-b{
		border-bottom: 1rpx solid #DEDEDE;
	}
	
	@-webkit-keyframes slide{
	  0%  {
	    top: 0;
	  }
	  20%  {
	    top: -20%;
	    z-index: 0;
	  }
	  40% {
	    top: -40%;
	    z-index: 0;
	  }
	  70% {
	    top: -70%;
	    z-index: 1;
	  }
	  100% {
	    top: -100%;
	    z-index: 1;
	  }
	}
	.indicator{
		position: absolute;
		bottom: 20upx;
		left: 0;
		right: 0;
		margin: 0 auto;
		text-align: center;
		.point{
			display: inline-block;
			height: 16upx;
			width: 16upx;
			margin: 0 10upx;
			border-radius: 8upx;
		}
	}
</style>
<style>
	swiper-item{
		height: auto;
	}
	text{
		line-height: 1;
	}
</style>
