<template>
	<view class="content">
			<view class="listBox">
				<view class="list" v-for="(item,index) in OrderList" :key="index">
					<view class="dis-flex pr">
						<image v-if="item.IsPay && item.leave_time" class="share pa" src="../../static/ic_share.png" mode="widthFix" style="width: 40rpx;height: 40rpx;" @click="open(item)"></image>
						<view class="leftWrapper">
							<image :src="item.ImageUrl" mode="aspectFill"></image>
						</view>
						<view class="rightWrapper flex-1">
							<view class="proTitle col-33 f-32 twoline-hidden">{{item.GoodsName }} {{item.WeightShort}}</view> 
							<view class="realPrice f-24 col-red">
									¥<text class="f-40">{{splitPrice(item.CurrentPrice)[0]}}.</text>
									<text class="f-24">{{splitPrice(item.CurrentPrice)[1]}}</text>
							</view>
							<view class="f-28 col-33">已有<text class="col-red">{{item.CurrentQuantity}}人</text>参与拼团</view>
							<view class="stepView" :style="'background:'+rgbaColor">
								<view class="step" :style="{width: item.width + '%;'+ 'background: '+ themeColor}">
								</view>
							</view>
							<view class="countDown col-33 f-24">
								<text class="label">剩余</text>
								<text>{{item.leave_time?item.leave_time: '00:00:00'}}</text>
							</view>
						</view>
					</view>
					<view class="address bg-f5 col-66 f-28">
						<view class="name-phone">{{item.CustomerName}} {{item.CustomerPhone}}</view>
						<view class="address-info">{{item.ProvinceText}}{{item.CityText}}{{item.DistrictText}}{{item.Floor}}</view>
					</view>
					<view v-if="item.GroupStatus === 1 && !item.IsPay" class="bottomList">
						<view v-if="item.pay_time" class="addGroup" :style="'border-color:'+themeColor+';color:'+themeColor" @click.stop="payGroup(item)">去支付{{item.pay_time}}</view>
					</view>
					<view class="group-info col-66 f-28">
						<view class="info-item dis-flex">
							<view class="item-name">团购时间:</view>
							<view class="item-info">
								<view class="dis-inline-block hour">{{item.JoinDate.slice(0,10)}} </view>
								{{item.JoinDate.slice(11,16)}}
							</view>
							<view></view>
						</view>
						<view class="info-item dis-flex">
							<view class="item-name">团购状态:</view>
							<view class="item-info">
								<view class="dis-inline-block" :style="'color:'+themeColor">{{item.CustomerGroupStatusText}}</view>
							</view>
							<view></view>
						</view>
						<view class="info-item dis-flex flex-x-between flex-y-center">
							<view class="dis-flex">
								<view class="item-name">团购单号:</view>
								<view class="item-info">{{item.GroupCode}}</view>
							</view>
							<view class="t-center copy f-24" :style="'border-color:'+themeColor+';color:'+themeColor" @click="copy(item.GroupCode)">复制</view>
						</view>
					</view>
				</view>
				
				<view v-if="OrderList !== '' && OrderList.length < 1" class="flexs flex-center flex-line flex-v" style="padding-top: 56rpx;">
					<image src="../../static/zerolist.png" mode="widthFix" style="width: 690rpx;"></image>
					<text style="color: #999999; font-size: 32rpx;">还没有订单哦</text>
				</view>
				<!-- <view v-if="OrderList !== '' && OrderList.length < 1" class="blank"></view> -->
				<view v-if="requestParams.CurrentPage >= TotalPage && TotalPage !== 0" class="noMore t-center col-66 f-24">亲！只有这么多了哦！</view>
				
			</view>
			
			
			<uni-popup ref="popup" type="bottom">
				<view class="flexs flex-r flex2 popup_top b_f">
					<text></text>
					<text style="font-size: 36rpx; font-weight: 600;">分享</text>
					<text class="close" @click="close()">+</text>
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
	</view>
</template>

<script>
	import {curtTime,hexToRgba, splitPrice, mapCurtTime } from "@/common/utils.js";
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	export default {
		components: {uniPopup},
		data() {
			return {
				splitPrice: splitPrice,
				requestParams: {
					"CurrentPage": 1,
					"PageSize": 6,
					"SourceOrder": 1
				},
				TotalPage: 0,
				OrderList: '',
        share:'',
				shareDate:'',
				themeColor: this.$store.state.themeColor,
				rgbaColor: hexToRgba()
			}
		},
		onShow() {
			this.getMyGroupOrder(true)
		},
		onPullDownRefresh() {
			this.$refresh()
			this.requestParams.CurrentPage= 1
			this.getMyGroupOrder(true)
		},
		onReachBottom() {
			console.log('触底')
			this.loadMore()
		},
		methods: {
			async open(item){
				let res=await this.$request(this.$API.CustomerShare,{"ShareType": 1,"Parameter":item.GroupCode})
				console.log('微信分享',res)
				this.shareDate=res.Data
				this.share=item
				this.$refs.popup.open()
			},
			close(){
				this.$refs.popup.close()
			},
			copy(GroupCode) {
				uni.setClipboardData({
					data: GroupCode,
					success: function () {
						uni.showToast({
							title: '复制成功',
							icon: 'success'
						})
					}
				})
			},
			// 上拉加载更多
			loadMore() {
				let that = this
				console.log(that.requestParams.CurrentPage , that.TotalPage)
				if (that.requestParams.CurrentPage < that.TotalPage) {
					that.requestParams.CurrentPage += 1
					that.getMyGroupOrder()
					console.log('触发加载更多')
					return
				}
			},

			// 获取所有订单
			async getMyGroupOrder(isRefresh) {
				// 清除所有定时器
				this.clearAllInterval()
				uni.showLoading({
					title: '加载中'
				})
				let that= this,
					res = await this.$request(this.$API.GetMyGroupOrder, this.requestParams)
					let listDatas= res.Data.Datas
				listDatas.ImageUrl= listDatas.GoodsImages? listDatas.GoodsImages[0].NetPath: ''
				that.TotalPage= res.Data.TotalPage
				
				// 批量处理支付倒计时
				async function mapPayTime(CreateDate, EffectiveTime, item) {
					let _that= that
					curtTime(CreateDate, EffectiveTime, function(res) {
						if(!res) {
							clearInterval(item['timer2'])
							item['timer2']= null
						}
						item['pay_time']= res? res[1] + ':' + res[2]: ''
					})
				}
				listDatas.forEach((item, index) => {
					item.leave_time= ''
					item.pay_time= ''
					item.width= 0
					// 剩余时间团购
					item.timer= setInterval(function() {
						mapCurtTime(item.CreateDate, item.EffectiveTime, item)
					}, 1000)
					// 剩余支付时间
					item.timer2= setInterval(function() {
						mapPayTime(item.JoinDate, 0.5, item)
					}, 1000)
					
				})
				that.OrderList= isRefresh?listDatas: that.OrderList.concat(listDatas)
				uni.hideLoading()
			},
			// 支付
			async payGroup(item) {
				console.log('点击了去支付', item)
				let that= this,
					params= {
						"PayType": 1,
						"OrderNumber": item.GroupCode,
						"Appip": '',
						"CustomerCode": ''
					}
				let resCode= await that.helper.getLoginCode()
				params.CustomerCode= resCode
					
				let res= await that.$request(that.$API.PayMyGroup, params)
				let JsonRequest= JSON.parse(res.Data.JsonRequest)
				
				that.payAction(res.Data.OrderNumber, JsonRequest, params)
			},
			// 加入团购支付操作
			async payAction(OrderNumber, JsonRequest, params) {
				let that= this
				let response= await that.$WxPay(JsonRequest)
				uni.hideLoading()
				if (response) {
					that.$Toast('支付成功')
					this.checkPayStatus(OrderNumber, params)
				} else {
					that.$Toast('取消支付')
				}
			},
			// 查询支付结果
			async checkPayStatus(OrderNumber, params, callbackNum) {
				let num= callbackNum?callbackNum: 1
				console.log('num', num, callbackNum)
				let that= this,
					paramData= {"GroupCode": OrderNumber},
					response= await that.$request(that.$API.CheckMyGroupOrderPay, paramData)
					console.log('response.Data', response.Data)
				if(response.Data) {
					uni.redirectTo({
						url: '/pagesB/payState/payState?type=1&GroupOrderNumber=' + OrderNumber
					})	
				} else if(num < 5){
					num += 1
					that.checkPayStatus(OrderNumber, params, num)
					return
				} else {
					uni.redirectTo({
						url: '/pagesB/payState/payState?type=0&GroupOrderNumber=' + OrderNumber  + '&params=' + JSON.stringify(params)
					})	
				}
			},
			clearAllInterval() {
				if(this.OrderList.length > 0) {
				this.OrderList.map((item, index) => {
					clearInterval(item.timer)
					clearInterval(item.timer2)
					item.timer= null
					item.timer2= null
				})
				}
			},
			async jump_share(){
				let item=this.share
				let param={
					"ShareType": 1,
					"Parameter": item.GroupCode
				}
				let res=await this.$request(this.$API.CustomerShareQr,param) 
				console.log('res',res)
				this.close()
				uni.navigateTo({
					url:"/pagesB/share_code/share_code?QrcodeUrl="+ encodeURIComponent(res.Data.QrcodeUrl) 
				})
			}
		},
		onUnload() {
			console.log('执行了onUnload清除所有定时器')
			this.clearAllInterval()
		},
		onHide() {
			console.log('执行了onHide清除所有定时器')
			this.clearAllInterval()
		},
		 onShareAppMessage(res){
			console.log('分享',res)
			if(res.from=='button'){
				 console.log('share',this.share)
				
			}
			this.close()
			return {
					title: this.shareDate.title,
					path: this.shareDate.WXMiniProgramObject.path,
					imageUrl:this.share.ImageUrl
				}
		}
	}
</script>
<style>
	page{
		background-color: #F3F3F3;
	}
</style>
<style lang="scss" scoped>
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
	.content {
		overflow: scroll;
	}
	.listBox {
		padding: 0 20upx;
		box-sizing: border-box;
	}
  .share{
		position: absolute;
		right: 0;
		top:0;
	}
	/* list */
	.list {
		background-color: #FFFFFF;
		padding: 40upx 24upx 24upx;
		font-size: 0;
		border-radius: 12upx;
		margin-top: 20upx;
		.leftWrapper {
			display: inline-block;
			vertical-align: top;
			width: 260upx;
			height: 260upx;
			margin-right: 33upx;
			overflow: hidden;
			&>image{
				height: 100%;
				width: 100%;
				background-color: $color-f6;
			}
		}
		.rightWrapper {
			vertical-align: top;
			width: 308upx;
			line-height: 1;
			.proTitle {
				line-height: 36upx;
				height: 76upx;
				width: 280upx;
			}
			.realPrice {
				padding: 20upx 0 48upx;
				line-height: 31upx;
				&>text{
					line-height: 31upx;
				}
			}
			.stepView {
				position: relative;
				width: 218upx;
				height: 12upx;
				/* 	opacity:0.3; */
				border-radius: 6upx;
				margin: 11upx 0 4upx;
				.step {
					width: 0%;
					height: 12upx;
					border-radius: 6upx;
					position: absolute;
					left: 0;
					top: 0;
					z-index: 2;
					transition: 300ms;
				}
			}
		}
		.address{
			margin-top: 20upx;
			padding: 23upx 24upx;
			line-height: 1;
			border-radius: 10upx;
			.name-phone{
				margin-bottom: 12upx;
			}
		}
		.bottomList{
			// height: 60upx;
			text-align: right;
			padding: 24upx 0 8upx;
			.addGroup {
				display: inline-block;
				vertical-align: middle;
				height: 60upx;
				padding: 0 34upx;
				line-height: 60upx;
				text-align: center;
				border-radius: 30upx;
				margin-left: 22upx;
				font-size: 28upx;
				color: $color-red;
				border-width: 1upx;
				border-style: solid;
			}
		}
		// <view class="group-info col-66">
		// 	<view class="info-item">
		// 		<text class="item-name">团购时间:</text>
		// 		<text class="item-info">{{item.CreateDate.slice(0,10)}} {{item.CreateDate.slice(11,16)}}</text>
		// 	</view>
		.group-info{
			padding-top: 12upx;
			.info-item{
				height: 54upx;
				line-height: 54upx;
				.item-name{
					margin-right: 60upx;
				}
				.item-info{
					width: 380upx;
					white-space: nowrap;
					overflow: auto;
					.hour{
						margin-right: 10upx;
					}
				}
				.copy{
					width: 80upx;
					height: 40upx;
					line-height: 40upx;
					border-radius: 20upx;
					border-width: 1upx;
					border-style: solid;
				}
			}
		}
	}
	
</style>
