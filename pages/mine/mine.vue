<template>
	<view class="content">
			<view class="personalList" :style="'padding-top:'+statusBarHeight+';background:'+mineData.ThemeColor+ ' url(' + mineBg1_base64 + ') no-repeat'">
				<view class="userIcon" @click="open">
					<image :src="mineData.CustomerImages?mineData.CustomerImages: '../../static/userIcon.png'" mode=""></image>
				</view>
				<block v-if="token">
					<view class="nickWrapper">
						<view class="nickname">
							<text>{{mineData.CustomerNick}}</text>
							<text v-if="mineData.CustomerVipName" class="vipName col-f f-24">{{mineData.CustomerVipName}}</text>
							<!-- <text class="brand f-20" :class="{'b-red': mineData.CustomerRank === 0,'b-gold': mineData.CustomerRank === 1,'b-black': mineData.CustomerRank === 2 }">{{CustomerRankName}}</text> -->
						</view>
						<view class="phoneNum">{{mineData.CustomerPhone}}</view>
					</view>	
				</block>
				<block v-else>
					<view class="nickWrapper" @click="login">
						<view class="nickname">
							<text class="loginBtn col-f f-24">点击登录</text>
						</view>
						<view class="col-f line-1 f-28">请登录/注册您的账号</view>
					</view>	
				</block>
				
			</view>
			<view class="personalWrapper" :style="'margin-top:'+menuTop +';background:'+mineData.ThemeColor+ ' url('+ mineBg2_base64 + ') no-repeat'">
				<view class="mineNumList">
           <navigator class="numBox">
						 <!-- url="/pagesB/myPoints/myPoints" -->						<view class="num">{{mineData.CustomerPoint}}</view>
						<view class="label">积分</view>
					</navigator>
					<navigator url="/pagesB/coupon/coupon" class="numBox">
						<view class="num">{{mineData.CouponQuantity}}</view>
						<view class="label">优惠券</view>
					</navigator>
					<navigator url="/pagesB/follow/follow?noSearch=true" class="numBox">
						<view class="num">{{mineData.GoodsQuantity}}</view>
						<view class="label">商品关注</view>
					</navigator>
					<navigator url="/pagesB/myCookery/myCookery" class="numBox">
						<view class="num">{{mineData.RecipesQuantity}}</view>
						<view class="label">食谱关注</view>
					</navigator>
				</view>
			</view>
			<view class="mineListWrapper">
				<view class="member over-hidden" @click="goMemberCenter">
					<view class="f-left dis-flex">
						<image src="../../static/mine/member.png" mode="" class="memberIcon"></image>
						<text class="f-28 dis-inline-block f-bold">会员中心</text>
					</view>
					<view class="f-right dis-flex">
						<text class="f-24">立即查看</text>
						<image src="../../static/next.png" mode="" class="moreIcon"></image>
					</view>
				</view>
				<view class="orderWrapper">
					<navigator :url="item.path+'?name='+item.iconClassName" class="order" v-for="(item, index) in orderListArr" :key="index">
						<view class="icon p-re">
							<text class="icon iconfont f-52" :style="{'color': index === 4?'#FF2D38': '#5B5B5B'}">{{item.iconName}}</text>
							<view v-if="index == 0 && mineData.UnpayQuantity" class="numInfo col-f f-20">{{mineData.UnpayQuantity}}</view>
							<view v-if="index == 1 && mineData.WaitQuantity" class="numInfo col-f f-20">{{mineData.WaitQuantity}}</view>
						</view>
						<view class="label">{{item.name}}</view>
					</navigator>
				</view>
				<view class="mineSettingWrapper flex-wrap">
					<!-- open-type="share" -->
					<button  class="list" @click="openShare">
						<image class="icon" src="../../static/mine/addUser.png" mode=""></image>
						<text class="text">邀请好友</text>
					</button>
					<block v-for="(item, index) in mineSettingList" :key="index" >
					<navigator :url="item.path" class="list pr" v-if="item.path">
						<view class="icon p-re">
							<view v-if="item.name === '联系客服' && mineData.IsReplyMessage" class="numInfo col-f f-20">1</view>
							<view v-if="item.name === '我的团购' && mineData.OngoingGroupQuantity" class="numInfo col-f f-20">{{mineData.OngoingGroupQuantity}}</view>
							<image :src="item.iconUrl" mode=""></image>
						</view>
						<text class="text">{{item.name}}</text>
					</navigator>
					<view class="list pr" v-else @click.stop="item_bind(item.type)">
						<view class="icon">
							<image :src="item.iconUrl" mode=""></image>
						</view>
						<text class="text">{{item.name}}</text>
					</view>
					</block>
				</view>
			</view>
		</block>
		
		<uni-popup ref="popup" type="bottom">
			<view class="upload t-center bg-ff f-32">
				<text @click="SelectUploadImg">上传头像</text>
			</view>
		</uni-popup>
		
		<canvas canvas-id="canvas" :style="'width:'+cWidth+'px;height:'+cHeight+'px;position: absolute;left:-100%;'"></canvas>
		<!-- 猜你喜欢 -->
		<view class="likeList">
			<view class="title">
				<text class="centerTitle">推荐</text>
			</view>
			<view class="likeWrapper">
				<GoodTwoColumn :allProduceArr="allProduceArr" @buy="buy"></GoodTwoColumn>
			</view>
		</view>
		
		<cartIcon ref="cartIcon"></cartIcon>
		
		<uni-popup ref="popup_share" type="bottom">
			<view class="flexs flex-r flex2 popup_top b_f">
				<text></text>
				<text style="font-size: 36rpx; font-weight: 600;">分享</text>
				<text class="close" @click="closeS()">+</text>
			</view>
			<view class="flexs flex-r b_f flex-center" style="padding-bottom: 40rpx;">
				<view class="p20 popup_v">
					<button open-type="share" class="flexs flex-v flex-center flex-line">
						<image class="icon" src="../../static/ic_wechat.png" mode="widthFix" style="width: 120rpx;"></image>
						<text class="text" style="margin-top: 10rpx;">分享给好友</text>
					</button>
				</view>
				<view class="p20 popup_v" >
					<button  class="flexs flex-v flex-center flex-line" @click="jump_share">
						<image class="icon" src="../../static/ic_code.png" mode="widthFix" style="width: 120rpx;"></image>
						<text class="text" style="margin-top: 10rpx;">分享二维码</text>
					</button>
				</view>
			</view>
		</uni-popup>
		<fly-cart ref="inCart" :cartBasketRect="cartBasketRect"></fly-cart>
	</view>
</template>

<script>
	import {getBase64Image} from "@/common/utils.js"
	import GoodTwoColumn from "@/components/GoodTwoColumn.vue"
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import topBar from "@/components/topBar.vue"
	import cartIcon from "@/components/cartIcon.vue"
	import flyCarts from '@/mixin/flyCarts.js'
	
	export default {
		mixins: [flyCarts],
		components: {
			uniPopup,
			GoodTwoColumn,
			uniPopup,
			topBar,
			cartIcon
		},
		data() {
			return {
				token: '',
				userInfo:'',
				mineData: {
					ThemeColor: this.$store.state.themeColor,
					CustomerBalance: '-',
					GoodsQuantity: '-',
					RecipesQuantity: '-',
					CouponQuantity: '-',
					CustomerPoint: '-'
				},
				orderListArr: [{
					iconClassName: 'dfk',
					path: '/pagesA/mineOrder/mineOrder',
					iconName: '\ue60c',
					name: '待付款'
				}, {
					iconClassName: 'dsh',
					path: '/pagesA/mineOrder/mineOrder',
					iconName: '\ue610',
					name: '待收货'
				}, {
					iconClassName: 'pj',
					path: '/pagesB/commentCenter/commentCenter',
					iconName: '\ue613',
					name: '评价',
				}, {
					iconClassName: 'tk',
					path: '/pagesB/refund/refund',
					iconName: '\ue612',
					name: '退款/售后'
				}, {
					iconClassName: 'all',
					path: '/pagesA/mineOrder/mineOrder',
					iconName: '\ue611',
					name: '全部订单'
				}],
				// 订单一栏
				mineSettingList: [{
					path: '/pagesA/groupOrder/groupOrder',
					iconUrl: require('@/static/mine/mineGroup.png'),
					name: '我的团购'
				}, {
					path: '/pagesA/addressList/addressList',
					iconUrl: require('@/static/mine/adressIcon.png'),
					name: '我的地址'
				}, {
					path: '/pagesA/setting/setting',
					iconUrl:  require('@/static/mine/settingIcon.png'),
					name: '我的设置'
				}, {
					path: '/pagesB/message/message',
					iconUrl:  require('@/static/mine/ic_mine_ service.png'),
					name: '联系客服'
				},{
					type: 'Call',
					iconUrl:  require('@/static/mine/ic_mine_call.png'),
					name: '联系电话'
				},{
					type: 'download',
					path: '/pagesA/web-view/web-view',
					iconUrl:  require('@/static/mine/ic_mine_adress.png'),
					name: '下载APP'
				},
				// , {
				// 	path: '/pages/group/group',
				// 	iconUrl: require('@/static/mine/colonel.png'),
				// 	name: '升级团长'
				// }
				],
				allProduceArr: [],           // 推荐商品列表
				CurrentPage: 1,
				TotalPage: 0,
				CustomerRankName: '普通',    // 会员等级名称
				cHeight: 0,
				cWidth: 0,
				clickTime: 0,               // 点击底部tab次数
				cartNum: 0,
				bottomDefault: 32,
				rightDefault: 10,          // 购物车默认偏移量
				bottom: 32,
				right: 10,                 // 购物车图标偏移量
				shareDate:'',
				mineBg2_base64: 'data:image/png;base64,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',
				mineBg1_base64: 'data:image/png;base64,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'
			}
		},
		computed: {
			statusBarHeight: function () {
				return uni.getStorageSync('statusBarHeight') + 44 + 'px'
			},
			menuTop: function() {
				return uni.getStorageSync('statusBarHeight') + 124 + 'px'
			}
		},
		async onShow() {
			this.bottom= 32
			this.right= 10
			let token= this.$store.state.token
			this.token= token
			if(token) {
				this.GetMyData()
			} else {
				this.mineData= {
					ThemeColor: this.$store.state.themeColor,
					CustomerBalance: '-',
					GoodsQuantity: '-',
					RecipesQuantity: '-',
					CouponQuantity: '-',
					CustomerPoint: '-'
				}
			}
			this.GetGuessYou('refresh')
		},
		onShareAppMessage(res){
			console.log('分享',res)
			if(res.from=='button'){
				 console.log('share',this.shareDate)
				
			}
			this.close()
			return {
					title: this.shareDate.title,
					path: this.shareDate.WXMiniProgramObject.path,
					imageUrl:this.shareDate.thumbData
				}
		},
		onPageScroll() {
			this.$refs.cartIcon.isScroll()
		},
		onReachBottom() {
			// 上拉加载更多
			if(this.CurrentPage < this.TotalPage) {
				this.CurrentPage += 1
				this.GetGuessYou()
				return
			}
		},
		onPullDownRefresh() {
			this.requestAgain()
		},
		// 双击tab刷新
		onTabItemTap(e) {
			this.clickTime += 1
			if(this.clickTime > 1) {
				this.requestAgain()
			}
			setTimeout(function () {
				this.clickTime= 0
			}.bind(this), 1000)
		},
		methods: {
			buy(obj){
				this.add(obj.e, obj.id)
			},
			async jump_share(){
				let item=this.shareDate
				let param={
					"ShareType": 2,
					"Parameter": '123'
				}
				let res=await this.$request(this.$API.CustomerShareQr,param) 
				console.log('res',res)
				this.close()
				uni.navigateTo({
					url:"/pagesB/share_code/share_code?QrcodeUrl="+encodeURIComponent(res.Data.QrcodeUrl)+'&sharetype=2',
					//+ res.Data.QrcodeUrl +"&ShareType=2"
				})
			},
			closeS(){
				this.$refs.popup_share.close()
			},
			async openShare(){
				let res=await this.$request(this.$API.CustomerShare,{"ShareType": 2,"Parameter":'123'},'',)
				console.log('微信分享',res)
				if(res.Success===0){
					console.log(res)
					this.shareDate=res.Data
					this.$refs.popup_share.open()
				}
			},
			requestAgain() {
				this.$refresh()
				this.$refs.cartIcon.updateBottom()
				this.GetGuessYou(true)
				if(this.token) {
					this.GetMyData()
				}
				
			},
			item_bind(type){
				switch(type){
					case "Call":
					this.makePhoneCall()
					break
					case "Download":
					this.Download()
					break
				}
			},
			login(){
				uni.navigateTo({
					url: '../login/login'
				})
			},
			makePhoneCall(){
				uni.makePhoneCall({
				    phoneNumber: '0755-28885514' //仅为示例
				});
			},
			close(){
				this.$refs.popup.close()
			},
			//打开上传头像弹窗
			open(){
				if(!this.token) {
					this.login()
					return
				}
			  this.$refs.popup.open()
			},
			// 选择上传头像
			SelectUploadImg() {
				let that= this
				that.close()
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					success(response) {
						console.log(response.tempFiles[0].size)
						console.log(JSON.stringify(response.tempFilePaths))
						
						// 判断大小确保压缩后小于2m 大于等于时压缩，小于时不压缩
						let maxSize= (response.tempFiles[0].size / 2048000).toFixed(0)
						let ratio= 1
						for(var i= 0; i< maxSize;i++) {
							console.log('进来了i的值是', i)
						}
						console.log('最终的i为maxSize', i)
						ratio= i + 1
						// 获取图片类型和高度宽度
						uni.getImageInfo({
							src: response.tempFilePaths[0],
							success: function (res) {
								console.log('获取到图片参数res', res)
								// 大于2m
								if(maxSize >= 1) {
									console.log('超过2m时')
									var canvasWidth = res.width / ratio //图片原始长宽
									var canvasHeight = res.height / ratio
									that.cWidth=canvasWidth
									that.cHeight=canvasHeight
									//----------绘制图形并取出图片路径--------------
									var ctx = uni.createCanvasContext('canvas')
									ctx.clearRect(0, 0, canvasWidth, canvasHeight)
									ctx.drawImage(res.path, 0, 0, canvasWidth, canvasHeight)
									ctx.draw(false, () => {
										uni.canvasToTempFilePath({
											canvasId: 'canvas',
											destWidth: canvasWidth,
											destHeight: canvasHeight,
											fileType:'jpg',
											quality:0.5,
											success: function (reserve) {
												console.log('tempFilePath',reserve.tempFilePath)//最终图片路径
												getBase64Image(reserve.tempFilePath).then((base64) => {
													that.UploadMy(base64, 'jpg')
												})
											}
										})
									})
								}
								// 小于2m
								else {
									console.log('没有超过2m时')
									getBase64Image(response.tempFiles[0].path).then((base64) => {
										that.UploadMy(base64, 'jpg')
									})
								}
							}
						})
					}
				})
			},
			// 上传头像
			async UploadMy(base64, type) {
				let that= this,
					params= {
						"ImageContent": base64,
						"ExtraName": '.'+ type
					}
				let res = await that.$request(that.$API.UploadMy, params)
				that.$Toast('上传成功')
				that.mineData.CustomerImages= res.Data.AbsoluteUri 
			},
			goMemberCenter() {
				let obj= {
					CustomerNick: this.mineData.CustomerNick,
					CustomerImages: this.mineData.CustomerImages?this.mineData.CustomerImages: '../../static/mine/userIcon.png',
					CustomerRank: this.mineData.CustomerRank,
					CustomerRankName: this.CustomerRankName,
					CustomerPoint: this.mineData.CustomerPoint,
					CustomerDiscount : this.mineData.CustomerDiscount>0 ?this.mineData.CustomerDiscount*10: '',
					CustomerDiscountEndDate : this.mineData.CustomerDiscountEndDate?this.mineData.CustomerDiscountEndDate.slice(0, 10): '',
					CustomerPrivilege: this.mineData.CustomerPrivilege?this.mineData.CustomerPrivilege: '',
					VipColor: this.mineData.VipColor?this.mineData.VipColor: '',
					CustomerVipName: this.mineData.CustomerVipName?this.mineData.CustomerVipName: ''
				}
				uni.navigateTo({
					url: '/pagesA/memberCenter/memberCenter?info=' + JSON.stringify(obj)
				})
			},
			goMineOrder() {
				uni.navigateTo({
					url: '../mineOrder/mineOrder'
				})
			},
			//获取我的数据
			GetMyData() {
				let that= this
				that.$request(that.$API.GetMyData).then(res => {
					console.log(res)
					if (res.Success == 0) {
						res.Data.ThemeColor= res.Data.ThemeColor?res.Data.ThemeColor: this.$store.state.themeColor
						that.mineData = res.Data
						that.CustomerRankName= res.Data.CustomerRank > 0? (res.Data.CustomerRank > 1 ?'黑金': '黄金'): '普通'
					}
				})
			},
			// 获取推荐商品
			GetGuessYou(isRefresh) {
				this.CurrentPage= isRefresh?1: this.CurrentPage
				let that= this,
				params= {
					"CurrentPage": that.CurrentPage,
					"PageSize": 0
				}
				
				that.$request(that.$API['GetHomeRecommendGoods'], params).then(res => {
					that.TotalPage= res.Data.TotalPage
					that.allProduceArr= isRefresh?res.Data.Datas: that.allProduceArr.concat(res.Data.Datas)
				})
			},
		}
	}
</script>

<style lang="scss">
	.popup_top{
		padding: 40rpx;
		text{
			color: #333333;
		}
		.close{
			transform: rotate(45deg);
			font-size: 60rpx; 
			line-height: 36rpx;
			color: #666;
		}
	}
	.popup_v{
		button{
			border: none;
			font-size: 28rpx;
			background-color: #fff;
		}
		button:after{
				border: none;
		}
	}
	.content{
		width: 100%;
		margin-top: 0;
		vertical-align: center;
		overflow-y: scroll;
		overflow-x: hidden ;
	}
	.pr{
		position: relative;
	}
	.personalWrapper {
		width: calc(100% - 46upx);
		height: 380upx;
		margin: 0 auto;
		padding: 0 24upx;
		background-size: cover;
	}

	.personalList {
		z-index: 10;
		position: fixed;
		padding: 0 24upx;
		height: 80px;
		width: calc(100% - 46upx);
		background-size: cover;
	}

	.personalList .userIcon {
		display: inline-block;
		vertical-align: middle;
		margin-right: 20upx;
		width: 120upx;
		height: 120upx;
		border-radius: 50%;
		overflow: hidden;
		background-color: rgba($color: #fff, $alpha: 0.2);
		&>image{
			height: 100%;
			width: 100%;
		}
	}

	.personalList .nickWrapper {
		display: inline-block;
		vertical-align: middle;
		max-width: 520upx;
		overflow: hidden;
	}

	.personalList .nickWrapper .nickname {
		display: flex;
		align-items: center;
		margin-bottom: 10upx;
		font-size: 36upx;
		font-weight: bold;
		line-height: 36upx;
		color: #FFFFFF;
		.loginBtn{
			padding: 8upx 19upx;
			height: 24upx;
			font-weight: 400;
			line-height: 1;
			border-radius: 20upx;
			background-color: rgba($color: #000000, $alpha: 0.1);
		}
		.vipName{
			margin-left: 12upx;
			padding: 0 18upx;
			line-height: 32upx;
			border-radius:2upx 16upx 2upx 16upx;
			background: rgba(#fff, 0.3);
		}
		.brand{
			display: inline-block;
			vertical-align: center;
			padding: 0 12upx;
			margin-left: 12upx;
			border-radius: 10upx;
			line-height: 32upx;
		}
		.b-red{
			background-color: #DE3E2F;
		}
		.b-gold{
			background-color: #EDD9AE;
		}
		.b-black{
			background-color: #53360B;
		}
	}

	.personalList .nickWrapper .phoneNum {
		font-size: 28upx;
		color: #FFFFFF;
	}

	.edito {
		position: absolute;
		width: 40upx;
		height: 40upx;
		right: 0upx;
		top: 50%;
		margin-top: -20upx;
	}

	.edito .editoIcon {
		display: block;
		width: 40upx;
		height: 40upx;
		right: 24upx;
	}

	.mineNumList {
		display: flex;
		padding-top: 20upx;
	}

	.mineNumList .numBox {
		flex: 1;
		text-align: center;
		padding: 20upx 0;
	}

	.mineNumList .numBox .num {
		font-size: 40upx;
		line-height: 40upx;
		font-weight: bold;
		color: rgba(255, 255, 255, 1);	
	}

	.mineNumList .numBox .label {
		font-size: 24upx;
		line-height: 24upx;
		margin-top: 31upx;
		color: rgba(255, 255, 255, 1);
		opacity: 0.75;
	}

	/* mineListWrapper */
	.mineListWrapper {
		width: 702upx;
		margin: -175upx auto 0;
		border-radius: 12upx 12upx 0 0;
		overflow: hidden;
		.member{
			padding: 24upx 24upx;
			background-color: #EDD9AE;
			color: #53360B;
			text{
				line-height: 42upx;
			}
			.memberIcon{
				margin-right: 20upx;
				height: 42upx;
				width: 49upx;
			}
			.moreIcon{
				display: inline-block;
				margin: 11upx 0 0 12upx;
				width: 12upx;
				height: 20upx;
				vertical-align: center;
			}
		}
		.orderWrapper {
			width: 702upx;
			height: 174upx;
			background: rgba(255, 255, 255, 1);
			border-radius: 0 0 12upx 12upx;
			display: flex;
			margin-bottom: 20upx;

			.order {
				flex: 1;
				text-align: center;
				.icon {
					display: block;
					margin: 40upx auto 24upx;
					line-height: 52upx;
					height: 52upx;
					width: 52upx;
				}
				.label {
					font-size: 24upx;
					color: rgba(153, 153, 153, 1);
				}
			}
		}
		.numInfo{
			position: absolute;
			left: 40upx;
			top: -12upx;
			display: inline-block;
			padding: 5upx 12upx;
			line-height: 1;
			border-radius: 12upx;
			background-color: $color-red;
		}

		.mineSettingWrapper {
			width: 702upx;
			background: rgba(255, 255, 255, 1);
			border-radius: 12upx;
			display: flex;
			margin-bottom: 28upx;
			&>button{
				display: block;
				background-color: #fff;
				padding: 0;
				font-size: 24upx;
				line-height: 75upx;
				&::after{
					border: 0;
				}
			}
			.list {
				padding: 41upx 0 12upx;
				display: flex;
				flex-direction: column;
				// flex: 1;
				width: 25%;
				text-align: center;
				.icon {
					position: relative;
					width: 48upx;
					height: 48upx;
					margin: 0 auto;
					&>image{
						height: 100%;
						width: 100%;
					}
					.newMessage{
						position: absolute;
						height: 40upx;
						width: 40upx;
						right: -20upx;
						top: -20upx;
					}
				}
				.text {
					display: block;
					font-size: 24upx;
					color: rgba(153, 153, 153, 1);
					line-height: 75upx;
					margin: 0;
				}
				
				
			}
		}

		.recommendWrapper {
			.titleWrapper {
				width: 100%;
				height: 92upx;
				line-height: 92upx;
				font-size: 32upx;
				font-weight: bold;
				text-align: center;
				color: rgba(51, 51, 51, 1);

				.title {
					position: relative;

					&::after {
						display: block;
						content: '';
						width: 122upx;
						height: 2upx;
						background: rgba(206, 206, 206, 1);
						position: absolute;
						left: -148upx;
						top: 50%;
						margin-top: -1upx;
					}

					&::before {
						display: block;
						content: '';
						width: 122upx;
						height: 2upx;
						background: rgba(206, 206, 206, 1);
						position: absolute;
						right: -148upx;
						top: 50%;
						margin-top: -1upx;
					}
				}
			}

		}
	}

	/* contentListWrapper */
	.contentListWrapper {
		font-size: 0;
		width: 100%;
	}
	.login-btn{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		width: 250upx;
		height: 76upx;
		line-height: 76upx;
		text-align: center;
		border-radius: 38upx;
		font-size: 32upx;
		color: #fff;
		background-color: $color-red;
	}
	.upload{
		padding: 30upx 0 100upx;
		&>text{
			display: inline-block;
			padding: 0 280upx;
			line-height: 80upx;
			border: 1px solid #ccc;
			border-radius: 10upx;
		}
	}
/* likeList */
	.likeList {
		width: 702upx;
		margin: auto;
	}

	.likeList .title {
		width: 100%;
		line-height: 92upx;
		font-size: 32upx;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		text-align: center;
	}

	.likeList .title .centerTitle {
		position: relative;
	}

	.likeList .title .centerTitle::after {
		display: block;
		content: '';
		width: 90upx;
		height: 2upx;
		background: rgba(206, 206, 206, 1);
		position: absolute;
		left: -104upx;
		top: 50%;
		margin-top: -1upx;
	}

	.likeList .title .centerTitle::before {
		display: block;
		content: '';
		width: 90upx;
		height: 2upx;
		background: rgba(206, 206, 206, 1);
		position: absolute;
		right: -104upx;
		top: 50%;
		margin-top: -1upx;
	}
	.likeWrapper {
		font-size: 0;
		width: 100%;
	}
	
	.likeWrapper .leftWrapper {
		display: inline-block;
		vertical-align: top;
		width: 344upx;
		margin-right: 14upx;
	
	}
	
	.likeWrapper .rightWrapper {
		display: inline-block;
		vertical-align: top;
		width: 344upx;
		height: 100upx;
	
	}
</style>
<style>
	page{
		background-color: #F3F3F3;
	}
</style>
