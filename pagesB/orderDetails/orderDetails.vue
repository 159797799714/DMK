<template>
	<commonBox>
	<view v-if="order !== ''" class="content">
		<!-- <view class="orderStatusWrapper">
			<view class="label">订单已完成</view>
			<view class="addBuy">再次购买</view> 
		</view> -->
		<view class="top_v flexs flex-center">{{order.OrderStatusText}}</view>
		<view class="proListWrapper ">
			<view v-for="(item,i) in order.OrderGoods" :key="i" class="">
				<view class="list flex-x-between flexs flex-r" @click.stop="jump_details(item.GoodsCode)">
					<view class="iconWrapper">
						<image class="icon" :src="item.ImageUrl" mode="widthFix"></image>
					</view>
					<view class="descWrapper">
						<view class="title">
							{{item.GoodsName}} {{item.WeightShort}} 
							<text class="m-l-20 col-99 f-28"> x {{item.Quantity}}</text>
						</view>
						<view class="price col-33 f-24">
							<text class="m-r-15">实付 </text>
							¥<text class="f-32">
								{{splitPrice(item.SumActualPrice)[0]}}.
							</text>
							{{splitPrice(item.SumActualPrice)[1]}}
						</view>
					</view>
					<view class="priceWrapper">
						<block v-if="item.IsFree && !item.SumAmount">
							<text class="f-32">免费</text>
						</block>
						<block v-else>
							¥<text class="big">{{splitPrice(item.SumAmount)[0]}}.</text>
							<text class="f-24">{{splitPrice(item.SumAmount)[1]}}</text>	
						</block>
					</view>
				</view>
			
				<view class="flexs flex-end" v-if="order.OrderStatus>=30  && order.OrderStatus<40 && order.OrderStatus" 
				@click.stop="jump_refund(item)">
					<view class="apply grey">{{item.IsAftermarket ? '已':''}}申请售后</view> 
				</view>
			</view>

			<view class="totalWrapper">
				<view class="totalList">
					<view class="label">商品总价</view>
					<view class="totalPrice">¥ {{toFixed(order.SumAmount)}}</view>
				</view>
				<view v-if="order.SumTicketAmount > 0" class="totalList">
					<view class="label">优惠券</view>
					<view class="totalPrice">- ¥ {{order.SumTicketAmount}}</view>
				</view>
				<!-- <view class="totalList">
					<view class="label">运费</view>
					<view class="totalPrice">+ ¥ 0.0</view>
				</view> -->
			</view>
			<view class="payWrapper">
				<view class="label">实付款</view>
				<view class="payNum">
					¥
					<text class="big">{{splitPrice(toFixed(order.SumActualPrice))[0]}}.</text>
					<text class="f-24">{{splitPrice(toFixed(order.SumActualPrice))[1]}}</text>
				</view>
			</view>
		</view>
		<view class="addressWrapper line-1">
			<view class="topList list">
				<view class="label">收货地址:</view>
				<view class="main">
					<view class="adDesc">{{order.CustomerName}} {{order.CustomerPhone}}</view>
					<view class="adDesc">{{order.CityText}}{{order.DistrictText}}{{order.Floor}}{{order.Address}}</view>
				</view>
			</view>
			<view v-if="order.CustomerMemo" class="list">
				<view class="label">客户备注:</view>
				<view class="main">
					<view class="adDesc">{{order.CustomerMemo}}</view>
				</view>
			</view>
			<view class="list">
				<view class="label">下单时间:</view>
				<view class="main">
					<view class="adDesc">{{order.CreateDate}}</view>
				</view>
			</view>
			<view class="list"  v-if="order.ArriveDate && order.OrderStatus>=30">
				  <view class="label">送达时间:</view>
				  <view class="main">
				  	<view class="adDesc">{{order.ArriveDate}}</view>
				  </view>
			</view>
			<view class="list">
				<view class="label">订单编号:</view>
				<view class="main">
					<view class="adDesc">{{order.OrderNumber}}</view>
				</view>
				<view class="copy f-24" :style="'border-color: '+themeColor+';color:'+themeColor" @click.stop="copy(order.OrderNumber)">复制</view>
			</view>
		</view>
		<view class="bottom-v flexs flex-r flex-end" v-if="order.OrderStatus!=10">
			<block v-if="order.OrderStatus===0">
				<view class="apply" @click.stop="goPay(order.OrderNumber)" :style="'border-color:'+themeColor+';color:'+themeColor">
					去支付(剩余{{PETime}})
				</view>
			</block>
			<!-- <block v-else-if="order.OrderStatus>0 && order.OrderStatus<=30">
				
			</block> -->
			<block v-if="order.OrderStatus>10  && order.OrderStatus<=20">
				<view class="apply" :style="'border-color:'+themeColor+';color:'+themeColor" @click.stop="confirm_receipt(order.OrderNumber)">
					确认收货
				</view>
			</block>
			<block v-if="order.OrderStatus>=30 && order.OrderStatus<=40">
				<view class="apply grey" @click.stop="jump_batch" v-if="order.OrderStatus<40 && !allRefund">
					批量售后
				</view>
				<view class="apply grey" v-if="order.OrderStatus<40 && !order.OrderGoods[0].IsComment" @click.stop="jumpComment(order.OrderNumber)">
					立即评价
				</view>
				<view class="apply" :style="'border-color:'+themeColor+';color:'+themeColor" v-if="order.OrderStatus<=40" @click.stop="repurchase(order)">
					再次购买
				</view>
			</block>
		</view>
	</view>
	</commonBox>
</template>

<script>
	import {splitPrice} from "@/common/utils.js"
	import commonBox from "@/components/commonBox.vue"
	export default {
		components: {
			commonBox
		},
		data(){
			return{
				toFixed:this.helper.toFixed,
				order:'',		
				totil:'',
				PETime:'00:00',
				curtTimes:function(){},
				allRefund:false,
				splitPrice: splitPrice,
				themeColor: this.$store.state.themeColor
			}
		},
		onLoad(options) {
			if(options.OrderNumber){
				console.log('order',options.OrderNumber)
				let OrderNumber=options.OrderNumber
				uni.showLoading({
					title:"加载中..."
				})
				this.OrderNumber=OrderNumber
				this.getOrderDetail(OrderNumber) 
			}
		},
		onShow() {
			this.$setNavigatorBg()
			this.getOrderDetail(this.OrderNumber) 
		},
		// onHide() {
		// 	clearInterval(this.curtTimes)
			
			
		// },
		onUnload() {
			clearInterval(this.curtTimes)
			
		},
		methods:{
			jumpComment(OrderNumber){
			  uni.navigateTo({
			  	url:"/pagesB/releaseComment/releaseComment?OrderNumber="+OrderNumber
			  })
			},
			jump_details(id){
				uni.navigateTo({
					url:"/pagesA/proDetails/proDetails?id="+id
				})
			},
			// 复制订单号
			copy(orderNumber) {
				uni.setClipboardData({
					data: orderNumber,
					success: function () {
						uni.showToast({
							title: '复制成功',
							icon: 'success'
						})
					}
				})
			},
			async confirm_receipt(OrderNumber){
				let s=await this.showT('提示','确定确认收货？',1)
				if(!s)return
				let pram={
				  "OrderNumber": OrderNumber
				}
				let res=await this.$request(this.$API.ConfirmMyOrder,pram)
				if(res.Success===0){
					this.OrderList= []
				  // this.selectTab(this.tabIndex)
				  this.$Toast('确认成功')
					this.getOrderDetail(this.OrderNumber) 
				}
			},
			async getOrderDetail(order_num){
				let param={
				  "OrderNumber": order_num
				}
				this.$request(this.$API.GetOrderDetail, param).then( res => {
					console.log('订单详情', res)
					let e=res.Data
					if(e.OrderStatus===0){
						e.OrderStatusText="待支付"
						let c_date= new Date(e.CreateDate).getTime() + 60*30*1000 
						// console.log('c_date',c_date)
						let _this=this
						this.curtTimes=setInterval(async function() {
							let res=await _this.helper.CurtTime(new Date(c_date))
							if(res){
								_this.PETime=res[1]+':'+res[2]
							}else{
								clearInterval(_this.curtTimes)
								e.OrderStatus=70
								e.OrderStatusText="已取消"
							}
						},1000)
					}
					this.totil= e.SumAmount
					let num=0
					e.OrderGoods.forEach((el)=>{
						if(el.IsAftermarket){
							num++
						}
					})
					if(num==e.OrderGoods.length){
						this.allRefund=true
					}else{
						this.allRefund=false
					}
					let CreateDate  = e.CreateDate.slice(0, 16)
					e.CreateDate= CreateDate.replace('T', ' ')
					if(e.OrderStatus >0){
						if(e.CreateDate) {
							e.PayDate = e.CreateDate.replace('T', ' ')
							e.PayDate = e.CreateDate.slice(0, 16)	
						} else {
							e.PayDate = null
						}
					}
					if(e.OrderStatus >=10 && e.OrderStatus <=20){
						if(e.CreateDate) {
							e.DeliveryDate  = e.CreateDate.replace('T', ' ')
							e.DeliveryDate  = e.CreateDate.slice(0, 16)	
						} else {
							e.DeliveryDate  = null
						}
					}
					if(e.OrderStatus >=30){
						if(e.ArriveDate) {
							e.ArriveDate = e.ArriveDate.replace('T', ' ')
							e.ArriveDate = e.ArriveDate.slice(0, 16)
						} else {
							e.ArriveDate= null
						}
						
					}			
					this.order=e
				})
				
				 uni.hideLoading();
			},
			jump_refund(item){
				if(item.IsAftermarket){
					uni.navigateTo({
						url:'/pagesB/refund/refund'	
					})
					return
				}
				uni.navigateTo({
					url:'/pagesB/applyRefund/applyRefund?order='+JSON.stringify(item)+'&OrderNumber='+this.order.OrderNumber
					
				})
				
			},
			jump_batch(){			
				let list=this.order.OrderGoods.filter(function (item) {
							if(!item.IsAftermarket){
								return item
							}   
				    }); 
				console.log('list',list,this.order)
				uni.navigateTo({
					url:'/pagesB/chooseGoods/chooseGoods?goods_list='+JSON.stringify(list)+'&OrderNumber='+this.order.OrderNumber
				})
			},
			
			async repurchase(item){  //再次购买
			  let OrderGoods=item.OrderGoods								
				let CartGoods=[]
				let arr=[]
				OrderGoods.forEach((e)=>{
					CartGoods.push({
						 "GoodsCode": e.GoodsCode,
						 "Quantity": e.Quantity
					})
				})
				// 先加入购物车
				//that.goAddCart(that.detail.GoodsCode)
				let StoreCode=uni.getStorageSync('StoreCode')
				let param={
				  "StoreCode": StoreCode,
				  "Longi": uni.getStorageSync('longitude'),
				  "Lati":  uni.getStorageSync('latitude'),
				  "CartGoods": CartGoods, 
				}
				let resp=await this.$request(this.$API.CreateMultipleCustomerCart,param)
				if(resp.Success===0){
				 let res=await this.$request(this.$API.GetCustomerCart)
				 console.log('购物车列表',res)
				
				 CartGoods.forEach((e)=>{
					res.Data.forEach(function (item) {
						if(item.GoodsCode==e.GoodsCode){
							item.Quantity=e.Quantity
							arr.push(item) 
						}
					})
				 })
				}
				// 获取商品在购物车的cartid
				console.log('arr',arr)
					uni.navigateTo({
						url: '/pagesA/firmOrder/firmOrder?order_list=' + JSON.stringify(arr) 
					})
			},
			async goPay(OrderNumber) {
				let that= this,
					params= {
						"PayType": 1,
						"OrderNumber": OrderNumber,
						"Appip": "",
						"CustomerCode": ''
					}
				let resCode= await this.helper.getLoginCode()
				params.CustomerCode= resCode
				let res= await this.$request(this.$API.PayMyOrder, params)
				
				that.payAction(res.Data.OrderNumber, JSON.parse(res.Data.JsonRequest))
				
			},
			// 支付操作
			async payAction(OrderNumber, JsonRequest) {
				let that= this
				let response= await that.$WxPay(JsonRequest)
				if (response) {
					that.$Toast('支付成功')
					that.checkPayStatus(OrderNumber, JsonRequest)
				} else {
					that.$Toast('取消支付')
				}
			},
			// 查询支付结果
			async checkPayStatus(OrderNumber, payJson, num) {
				num= num?num: 0
				let that= this,
					paramData= {"OrderNumber": OrderNumber}
				let response= await that.$request(that.$API.CheckMyOrderPay, paramData)
				if(response) {
					uni.reLaunch({
						url: '/pagesB/payState/payState?type=1&OrderNumber=' + OrderNumber
					})	
				} else if(num < 5){
					that.checkPayStatus(OrderNumber, payJson, num)
					num++
				} else {
					uni.reLaunch({
						url: '/pagesB/payState/payState?type=0&OrderNumber=' + OrderNumber + '&payJson=' + payJson
					})
				}
			},
			
		}
		
	}
</script>

<style lang="scss">
	.content{
		padding: 20upx 20upx 80upx 20upx;
		box-sizing: border-box;
		height: 100%;
		overflow: scroll;
		background-color: #F3F3F3;
	}
	.top_v{
		background:rgba(255,255,255,1);
		border-radius:12upx;	
		padding: 20upx;
		margin-bottom: 20upx;
		font-size:40upx;
		line-height: 40upx;
		font-weight:bold;
		color:rgba(51,51,51,1);
	}
    .bottom-v{
		position: absolute;
		bottom:0;
		width: 100%;
		padding: 20upx 0upx;
		left:0;
		width: 100%;
		background-color: #fff;
	}
	.grey{
		border: 2rpx solid rgba(216, 216, 216, 1);
		color: rgba(153, 153, 153, 1);
	}
	.apply {
		display: inline-block;
		vertical-align: middle;
		padding: 10upx 40upx;
		margin-right: 20upx;
		text-align: center;
		background: rgba(0, 0, 0, 0);
		border-width: 1upx;
		border-style: solid;
		border-radius: 36rpx;
		font-size: 28rpx;
	}

.goPay {
	display: inline-block;
	vertical-align: middle;
	text-align: center;
	padding: 10upx 40upx;
	border: 1upx solid $color-red;
	border-radius: 36upx;
	font-size: 28upx;
	color: $color-red;
}
.proListWrapper {
	width: 654upx;
	padding: 8upx 24upx 0;
	margin: 0 auto;
	background-color: #FFFFFF;
	border-radius:12upx;
	.list {
		font-size: 0;
		position: relative;
		margin-top: 32upx;
		.iconWrapper {
			display: inline-block;
			vertical-align: middle;
			width:100upx;
			height:100upx;
			background:rgba(204,204,204,1);
			border-radius:8upx;
			margin-right: 31upx;
			.icon {
				display: block;
				width:100upx;
				height:100upx;
				border-radius:8upx;
			}
		}
		.descWrapper {
			display: inline-block;
			vertical-align: middle;
			.title {
				font-size:32upx;
				color:rgba(51,51,51,1);
				margin-bottom: 21upx;
				 text-overflow: -o-ellipsis-lastline;
				  overflow: hidden;
				  text-overflow: ellipsis;
				  display: -webkit-box;
				  -webkit-line-clamp: 2;
				  line-clamp: 2;
				  -webkit-box-orient: vertical;
				  width: 400upx;
			}
			.price {
				
			}
		}
		.priceWrapper {
			font-size:24upx;
			color:rgba(51,51,51,1);
			.big {
				font-size:32upx;
				color:rgba(51,51,51,1);
			}
		}
	}
	.totalWrapper{
		margin: 29upx 0 5upx;
		border-bottom: 1upx solid #EAEAEA;
		.totalList{
			display: flex;
			margin-bottom: 24upx;
			.label {
				flex: 1;
				font-size:28upx;
				color:rgba(153,153,153,1);
			}
			.totalPrice {
				flex: 1;
				text-align: right;
				font-size:28upx;
				color:rgba(153,153,153,1);
			}
		}
	}
	.payWrapper {
		display: flex;
		line-height: 98upx;
		.label {
			flex: 1;
			font-size:28upx;
			color:rgba(51,51,51,1);
		}
		.payNum {
			flex: 1;
			text-align: right;
			font-size:24upx;
			color: $color-red;
			.big{
				font-size: 40upx;
			}
		}
	}
	
}

.addressWrapper {
	margin: 20upx auto 0;
	width: 656upx;
	padding: 10upx 23upx 32upx;
	background-color: #FFFFFF;
	font-size: 0;
	border-radius: 12upx;
	.list {
		display: flex;
		line-height: 40upx;
		margin-top: 23rpx;
		.label {
			flex: 0 0 176upx;
			font-size:28upx;
			color:rgba(102,102,102,1);
		}
		.main {
			flex:1;
			font-size:28upx;
			color:rgba(102,102,102,1);
			
		}
		.copy{
			height: 38upx;
			width: 80upx;
			text-align: center;
			border-radius: 20upx;
			line-height: 38upx;
			border-width: 1upx;
			border-style: solid;
		}
	}
	.topList {
		.main {
			font-size:28upx;
			line-height: 40upx;
			color:rgba(102,102,102,1);
		}
	}
}

	
</style>
