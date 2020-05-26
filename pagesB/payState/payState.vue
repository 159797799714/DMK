<template>
	<view class="content">
		<view class="state-bg" :class="type == 0?'fail': 'success'"></view>
		<view class="col-33 t-center f-36">{{buyVip?'会员购买': '订单支付'}}{{type == 0?'失败': '成功'}}</view>
		<view class="btn-row dis-flex flex-x-center col-f f-36">
			<view v-if="isGroup !== null" class="btn leftBtn" :style="'background:'+themeColor+';border-color:'+themeColor" @click="ClickAction">{{type == 1?'查看订单':'重新支付' }}</view>
			<navigator url="/pages/index/index" open-type="switchTab" :style="'color:'+themeColor+';border-color:'+themeColor" class="btn bg-ff">返回首页</navigator>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				type: '',
				isGroup: null,
				OrderNumber: '',
				params: '',        // 订单请求参数
				JsonRequest: '',   // 没有的时候为订单列表跳入，有的时候代表填写订单跳入
				themeColor: this.$store.state.themeColor,
				buyVip: ''
			}
		},
		onLoad(e) {
			console.log('支付接收到', e)
			this.type= Number(e.type)
			if(this.type === 0) {
				uni.setNavigationBarTitle({
				    title: '支付失败'
				})
			}
			let Json= uni.getStorageSync('JsonRequest')
			console.log('Json', Json)
			this.JsonRequest= Json ?Json: ''
			uni.removeStorageSync('JsonRequest')
			
			if(e.GroupOrderNumber) {
				this.isGroup= true
				this.OrderNumber= e.GroupOrderNumber
			} else if(e.OrderNumber) {
				this.isGroup= false
				this.OrderNumber= e.OrderNumber
			} else if(e.buyVip) {
				this.buyVip= true
			}
			this.params= e.params?JSON.parse(e.params): ''
		},
		methods: {
			async ClickAction() {
				console.log(this.type)
				let that= this,
					resCode= await that.helper.getLoginCode()
					
				switch(that.type) {
					// 未支付
					case 0:
						// 团购支付
						this.params.CustomerCode= resCode
						
						let JsonRequestParams= this.JsonRequest,
							OrderNumber= this.OrderNumber
						if(this.isGroup && !JsonRequestParams) {
							let res= await that.$request(that.$API.PayMyGroup, that.params)
							JsonRequestParams= JSON.parse(res.Data.JsonRequest)
							OrderNumber= res.Data.OrderNumber
						}
						that.GroupPayAction(OrderNumber, JsonRequestParams)
						break
						
					// 已支付
					case 1:
						if(this.isGroup) {
							uni.redirectTo({
								url: '/pagesA/groupOrder/groupOrder'
							})
						} else {
							uni.redirectTo({
								url: '/pagesA/mineOrder/mineOrder?name=dsh' 
							})
						}
						break
				}
			},
			
			// 团购支付操作
			async GroupPayAction(OrderNumber, JsonRequest) {
				let that= this
				let response= await that.$WxPay(JsonRequest)
				uni.hideLoading()
				if (response) {
					that.checkPayGroupStatus(OrderNumber, JsonRequest)
				} else {
					that.$Toast('取消支付')
					uni.redirectTo({
						url: '/pagesA/groupOrder/groupOrder'
					})
				}
			},
			// 查询团购支付结果
			async checkPayGroupStatus(OrderNumber, payJson, callbackNum) {
				let num= callbackNum?callbackNum: 1
				let that= this,
					paramData= {"GroupCode": OrderNumber},
					response= await that.$request(that.$API.CheckMyGroupOrderPay, paramData)
				if(response) {
					that.$Toast('支付成功', 'success')
					uni.setNavigationBarTitle({
					    title: '支付成功'
					})
					that.type= 1
				} else if(num < 5){
					num += 1
					that.checkPayStatus(OrderNumber, payJson, num)
					return
				} else {
					uni.setNavigationBarTitle({
					    title: '支付失败'
					})
					that.$Toast('重新支付失败')
				}
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	.content{
		padding-top: 103upx;
		line-height: 1em;
		.state-bg{
			height: 280upx;
			width: 500upx;
			margin: 0 auto 70upx;
			&>image{
				height: 100%;
				width: 100%;
			}
		}
		.btn-row{
			margin-top: 94upx;
			height: 72upx;
			padding: 0 98upx;
			.btn{
				display: inline-block;
				height: 72upx;
				line-height: 72upx;
				padding: 0 49upx;
				border-radius: 36upx;
				border-width: 2upx;
				border-style: solid;
			}
			.leftBtn{
				margin-right: 64upx;
			}
		}
	}
	.fail{
		background-image: url(../../static/fail.png);
		background-size: cover;
	}
	.success{
		background-image: url(../../static/success.png);
		background-size: cover;
	}
</style>
