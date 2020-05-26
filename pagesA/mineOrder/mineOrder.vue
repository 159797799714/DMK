<template>
	<view class="content" :style="status!=0 ? '':'background-color:#F3F3F3;'">
		<view class="tabs b_f">
			<view v-for="(item, index) in titleArr" :key="index" :style="tabIndex == index?'color:'+themeColor: ''" class="tab" @click="selectTab(index)">{{item.title}}</view>
			<view class="sliper" :style="{'left': sliperLeft + '%', 'background': themeColor}"></view>
		</view>
		<view class="listBox"  v-if="status==1">
			<scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="loadMore" class="scroll-main">
				<view class="list" @click.stop="goOrderDetails(item)" :style="i!=0 ? 'margin-top:20upx;':''" v-for="(item,i) in OrderList"
				 :key="i">
					<view class="headerBox">
						<view class="timeWrapper">{{item.CreateDate}}</view>
						<view v-if="item.OrderStatus==50 && item.OrderGoods[0].IsComment" class="orderStatus" :style="'color:'+themeColor">已完成</view>
						<view v-else class="orderStatus" :style="'color:'+themeColor">{{item.OrderGoods[0].IsComment ? '已评价' : item.OrderStatusText}}</view>

					</view>
					<view class="proList">
						<view class="produce" v-for="(ite,j) in item.OrderGoods" :key="j">
							<image class="proIcon" :src="ite.ImageUrl" mode=""></image>
							<view class="desc">
								<view class="title">
									{{ite.GoodsName}} {{ite.WeightShort ? ite.WeightShort :''}}
									<text class="m-l-20 col-99 f-28"> x {{ite.Quantity}}</text>
								</view>
								<view class="num col-33 f-24">
									<text class="m-r-15">实付 </text>
									¥<text class="f-32">
										{{splitPrice(ite.SumActualPrice)[0]}}.
									</text>
									{{splitPrice(ite.SumActualPrice)[1]}}
								</view>
							</view>
							<view class="price">
								<block v-if="ite.IsFree && !ite.SumAmount">
									<text class="f-32">免费</text>
								</block>
								<block v-else>
									¥<text class="big">{{splitPrice(toFixed(ite.SumAmount))[0]}}.</text>
									<text class="f-24">{{splitPrice(toFixed(ite.SumAmount))[1]}}</text>
								</block>
							</view>
						</view>
						<view class="totalDesc col-33 f-24">
							共{{item.OrderGoods.length}}件商品，总价¥{{toFixed(item.SumAmount)}},{{item.SumTicketAmount >0?'优惠¥'+toFixed(item.SumTicketAmount)+',': '' }}
							<text class="small m-7 col-red">{{item.payText}}¥</text>
							<text class="big col-red">{{splitPrice(toFixed(item.SumActualPrice))[0]}}.</text>
							<text class="small col-red">{{splitPrice(toFixed(item.SumActualPrice))[1]}}</text>
						</view>
						<view v-if="item.Memo" class="memo">
							<view class="col-33 f-28 line-1 words">{{item.Memo}}</view>
						</view>
						<view class="buttonGroup">
							<block v-if="item &&  item.OrderStatus"></block>
							<block v-if="item.OrderStatus === 0">
								<view class="cancelOrder padding-l-r-34" @click.stop="cancelOrder(item.OrderNumber)">取消订单</view>
								<view class="goPay padding-l-r-34" @click.stop="goPay(item.OrderNumber)" :style="'border-color:'+themeColor+';color:'+themeColor">去支付(剩余{{item.PETime}})</view>
							</block>
							<block v-if="tabIndex == 2">
								<view class="cancelOrder padding-l-r-34" @click.stop="cancelPayOrder(item.OrderNumber)">取消订单</view>
							</block>
							<block v-if="item.OrderStatus >=20 && item.OrderStatus <30">
								<view class="goPay" @click.stop="confirm_receipt(item.OrderNumber)" :style="'border-color:'+themeColor+';color:'+themeColor">确认收货</view>
							</block>
							<block v-if="item.OrderStatus>=30">

								<view v-if="item.OrderStatus<40 && !item.OrderGoods[0].IsComment" class="cancelOrder padding-l-r-34"
								 :style="'margin-right: 20upx;border-color:'+themeColor+';color:'+themeColor"
								 @click.stop="jumpComment(item.OrderNumber)">
									立即评价
								</view>
								<view class="goPay" v-if="item.OrderStatus<=40" @click.stop="repurchase(item,i)" :style="'border-color:'+themeColor+';color:'+themeColor">
									再次购买
								</view>
							</block>
							<!-- <block v-else-if="item.OrderStatus === 60">
							<view class="goPay">再次购买</view>
						</block> -->
						</view>
					</view>
				</view>
				
			</scroll-view>
		</view>
		<view v-else-if="status==-1">
			
		</view>
		<view class="flexs flex-center flex-line flex-v"  v-else style="padding-top: 56rpx;">
			<image src="../../static/zerolist.png" mode="widthFix" style="width: 690rpx;"></image>
			<text style="color: #999999; font-size: 32rpx;">还没有订单哦</text>
		</view>
	</view>
</template>

<script>
	import {splitPrice} from "@/common/utils.js"
	export default {
		data() {
			return {
				splitPrice: splitPrice,
				toFixed: this.helper.toFixed,
        select:false,
				tabIndex: '', // 默认选中全部
				titleArr: [{
					title: '全部',
					apiName: 'GetAllOrder'
				}, {
					title: '待支付',
					apiName: 'GetUnpayOrder'
				}, {
					title: '待收货',
					apiName: 'GetWaitOrder'
				}, {
					title: '已完成',
					apiName: 'GetCompleteOrder'
				}, {
					title: '已取消',
					apiName: 'GetCancelOrder'
				}],
				sliperLeft: 0, // tab底部小滑块偏移量
				requestParams: {
					"CurrentPage": 1,
					"PageSize": 15,
					"SourceOrder": 1
				},
				TotalPage: 0,
				OrderList: [],
				curtTimes: [],
				status:-1,
				themeColor: this.$store.state.themeColor
			}
		},
		onLoad(opt) {
			if(opt.type=='message'){
				this.select=true
			}
			console.log(opt)
			if (opt.name) {
				switch (opt.name) {
					case 'dfk':
						this.tabIndex = 1
						this.selectTab(1)
						break;
					case 'dsh':
						this.tabIndex = 2
						this.selectTab(2)
						break;
					case 'tk':
						this.tabIndex = 4
						this.selectTab(4)
						break;
					case 'all':
						this.tabIndex = 0
						this.selectTab(0)
						break;
				}
			} else {
				// 初始化sliper偏移量
				this.selectTab(0)
			}
		},
		onPullDownRefresh() {
			this.$refresh()
			this.getOrderList(this.titleArr[this.tabIndex].apiName)
		},
		onUnload() {
			if (this.curtTimes.length > 0) {
				this.curtTimes.forEach((e) => {
					clearInterval(e)
				})
			}
		},
		watch: {
			tabIndex(newVal, oldVal) {
				this.OrderList = []
			}
		},
		methods: {
			jumpComment(OrderNumber) {
				uni.navigateTo({
					url: "/pagesB/releaseComment/releaseComment?OrderNumber=" + OrderNumber
				})
			},
			async confirm_receipt(OrderNumber) {
				let s = await this.showT('提示', '确定确认收货？', 1)
				if (!s) return
				let pram = {
					"OrderNumber": OrderNumber
				}
				let res = await this.$request(this.$API.ConfirmMyOrder, pram)
				if (res.Success === 0) {
					this.OrderList = []
					this.selectTab(this.tabIndex)
					this.$Toast('确认成功')
				}
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
				
				that.payAction(res.Data.OrderNumber, JSON.parse(res.Data.JsonRequest), params)
				
			},
			// 支付操作
			async payAction(OrderNumber, JsonRequest, params) {
				let that= this
				let response= await that.$WxPay(JsonRequest)
				if (response) {
					that.$Toast('支付成功')
					that.checkPayStatus(OrderNumber, params)
				} else {
					that.$Toast('取消支付')
				}
			},
			// 查询支付结果
			async checkPayStatus(OrderNumber, payJson, params, callbackNum) {
				let num= callbackNum?callbackNum: 1
				let that= this,
					paramData= {"OrderNumber": OrderNumber}
				let response= await that.$request(that.$API.CheckMyOrderPay, paramData)
				if(response) {
					uni.redirectTo({
						url: '/pagesB/payState/payState?type=1&OrderNumber=' + OrderNumber
					})
				} else if(num < 5){
					callbackNum += 1
					that.checkPayStatus(OrderNumber, payJson, num)
					return
				} else {
					uni.redirectTo({
						url: '/pagesB/payState/payState?type=0&OrderNumber=' + OrderNumber + '&params=' + JSON.stringify(params)
					})
				}
			},
			
			//取消订单
			async cancelOrder(OrderNumber) {
				let s = await this.showT('提示', '确定取消这笔订单？', 1)
				if (!s) return
				let pram = {
					"OrderNumber": OrderNumber
				}
				let res = await this.$request(this.$API.CancelMyOrder, pram)
				if (res.Success === 0) {

					this.selectTab(this.tabIndex)
					this.$Toast('取消成功')
				}
			},
			//取消待收货已付款订单
			async cancelPayOrder(OrderNumber) {
				let s = await this.showT('提示', '确定取消这笔订单？', 1)
				if (!s) return
				let pram = {
					"OrderNumber": OrderNumber
				}
				let res = await this.$request(this.$API.CancelMyPayOrder, pram)
				if (res.Success === 0) {
			
					this.selectTab(this.tabIndex)
					this.$Toast('取消成功')
				}
			},
			
			
			selectTab(index) {
				console.log(index)
				this.status=-1
				if (this.curtTimes.length > 0) {
					this.curtTimes.forEach((e) => {
						clearInterval(e)
					})
				}
				let that = this
				that.tabIndex = index
				that.sliperLeft = 20 * index + 10
				uni.showLoading({
					title: '加载中...'
				})
				that.getOrderList(that.titleArr[index].apiName)
			},

			// 上拉加载更多
			loadMore() {
				let that = this
				if (that.CurrentPage < that.TotalPage) {
					that.requestParams.CurrentPage += 1
					that.selectTab(that.requestParams.CurrentPage)
					console.log('触发加载更多')
					return
				}
				that.$Toast('亲！只有这么多了哦！')
			},
			curtTime(e, i,new_date) {
				//console.log('e',e)
				let c_date = new_date + 60 * 30 * 1000
				//console.log('c_date',c_date)
				let OrderList = this.OrderList
				let _this = this
				let curtTimes = setInterval(async function() {
					let res = await _this.helper.CurtTime(c_date)
					//console.log('res',res)
					if (res) {
						// let time = res[0]+':'+res[1]+':'+res[2]
						// OrderList[i].PETime=res[0]+':'+res[1]+':'+res[2]
						// _this.$set(_this.OrderList[i],'PETime',time)
						// console.log(_this.OrderList)
						e.PETime = res[1] + ':' + res[2]
					} else {
						clearInterval(curtTimes)
						// e.OrderStatus=70
						// e.OrderStatusText="已取消"
					}
				}, 1000)
				//console.log('curtTimes',curtTimes)
				this.curtTimes.push(curtTimes)
			},
			// 赋值
			asinValue(res) {
				let _p = this
				let list = res.Data.Datas
				list.forEach((e, i) => {
					if(e.OrderStatus === 0) {
						e.payText= '待支付'
					} else if(e.OrderStatus === 40) {
						e.payText= '未支付'
					} else {
						e.payText= '实付款'
					}
					console.log('e.CreateDate', e.CreateDate)
					
					e.CreateDate= e.CreateDate.slice(0,19)
					e.CreateDate= e.CreateDate.replace(/-/g, "/")
					e.CreateDate= e.CreateDate.replace(/T/g, " ")
					
					let new_date = new Date(e.CreateDate).getTime()
					e.CreateDate = _p.helper.getDataTime(new Date(e.CreateDate).getTime() / 1000)
					if (e.OrderStatus === 0) {
						e.PETime = ''
						_p.curtTime(e, i ,new_date)
					}
				})
				if (res.Data.CurrentPage <= 1) {
					this.OrderList = []
					this.OrderList = list
				} else {
					this.OrderList = this.OrderList.concat(list)
				}
				this.TotalPage = res.Data.TotalPage
				uni.hideLoading()
			},
			// 获取订单列表
			async getOrderList(apiName) {
				let resp = await this.$request(this.$API[apiName], this.requestParams);
				console.log('apiName', this.$API[apiName])
				if(resp.Data.Datas.length){
					this.status=1
				}else{
				  this.status=0
				}
				this.asinValue(resp)
			},
			goOrderDetails: function(item) {
				if(this.select){
					this.vue_g.message_item=item
					uni.navigateBack({
						delta:-1
					})
				}else{
					uni.navigateTo({
						url: '/pagesB/orderDetails/orderDetails?OrderNumber=' + item.OrderNumber
					})
				}
			},
			async repurchase(item, i) { //再次购买


				let OrderGoods = item.OrderGoods
				let CartGoods = []
				let arr = []
				OrderGoods.forEach((e) => {
					CartGoods.push({
						"GoodsCode": e.GoodsCode,
						"Quantity": e.Quantity
					})
				})
				// 先加入购物车
				//that.goAddCart(that.detail.GoodsCode)
				let StoreCode = uni.getStorageSync('StoreCode')
				let param = {
					"CartGoods": CartGoods,
				}
				let resp = await this.$request(this.$API.CreateMultipleCustomerCart, param)
				if (resp.Success === 0) {
					let res = await this.$request(this.$API.GetCustomerCart)
					console.log('购物车列表', res)

					CartGoods.forEach((e) => {
						res.Data.forEach(function(item) {
							if (item.GoodsCode == e.GoodsCode) {
								item.Quantity = e.Quantity
								arr.push(item)
							}
						})
					})
				}
				// 获取商品在购物车的cartid
				console.log('arr', arr)
				uni.navigateTo({
					url: '/pagesA/firmOrder/firmOrder?order_list=' + JSON.stringify(arr)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.m-l-20{
		margin-left: 20upx;
	}
	.m-r-15{
		margin-right: 15upx;
	}
	.content {
		height: 100%;
		overflow: hidden;
	}

	.tabs {
		position: relative;
		height: 88upx;
		line-height: 88upx;
		-webkit-overflow-scrolling: touch;

		.tab {
			display: inline-block;
			width: 20%;
			white-space: nowrap;
			overflow: auto;
			text-align: center;
			color: $color-33;
			font-size: $f-28;
			-webkit-overflow-scrolling: touch;
		}

		.active {
			font-weight: bold;
		}

		.sliper {
			position: absolute;
			bottom: 0;
			left: 0;
			height: 4upx;
			width: 24px;
			transition: 300ms;
			transform: translateX(-12px);
			border-radius: 2upx;
		}
	}

	.listBox {
		background-color: #F3F3F3;
		padding: 0 20upx;
		height: calc(100% - 88upx);
		box-sizing: border-box;
		overflow: hidden;
	}

	.list {
		background: rgba(255, 255, 255, 1);
		border-radius: 12upx;
		padding: 0 24upx 30upx;
		margin-bottom: 20upx;
	}

	.list .headerBox {
		display: flex;
		height: 95upx;
		line-height: 95upx;
		border-bottom: 1upx solid #EAEAEA;
	}

	.scroll-main {
		padding-top: 20upx;
		box-sizing: border-box;
	}

	.list .headerBox .timeWrapper {
		flex: 7;
		font-size: 28upx;
		font-weight: 400;
		color: rgba(102, 102, 102, 1);
	}

	.list .headerBox .orderStatus {
		flex: 3;
		font-size: 28upx;
		font-weight: bold;
		text-align: right;
	}

	.produce {
		display: flex;
		justify-content: space-between;
		font-size: 0;
		margin-top: 30upx;
	}

	.produce .proIcon {
		display: inline-block;
		vertical-align: middle;
		width: 100upx;
		height: 100upx;
		background: rgba(204, 204, 204, 1);
		border-radius: 8upx;
	}

	.produce .desc {
		display: inline-block;
		vertical-align: middle;
		text-align: left;
		margin-left: 31upx;
		flex: 1;
	}

	.produce .desc .title {
		font-size: 32upx;
		color: rgba(51, 51, 51, 1);
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		width: 400upx;
	}

	.produce .desc .num {
		margin-top: 20upx;
		letter-spacing: 1upx;
	}

	.produce .price {
		display: inline-block;
		vertical-align: middle;
		font-size: 24upx;
		color: rgba(51, 51, 51, 1);
	}

	.produce .price .big {
		font-size: 32upx;
	}

	.totalDesc {
		line-height: 110upx;
		text-align: right;
		letter-spacing: 1upx;
		.small {
			font-size: 24upx;
		}
		.big {
			font-size: 36upx;
		}
	}
	
	.memo{
		margin-bottom: 40upx;
		padding: 26upx 24upx;
		background-color: #F0F0F5;
		border-radius: 20upx;
		.words{
			line-height: 34upx;
		}
	}

	/* buttonGroup */
	.buttonGroup {
		font-size: 0;
		text-align: right;
	}

	.padding-l-r-34 {
		padding: 0 34upx;
	}
	.m-7{
		margin: 0 7upx;
	}

	.buttonGroup .cancelOrder {
		display: inline-block;
		vertical-align: middle;
		padding: 10upx 40upx;
		background: rgba(0, 0, 0, 0);
		border: 2upx solid rgba(216, 216, 216, 1);
		border-radius: 36upx;
		font-size: 28upx;
		color: rgba(153, 153, 153, 1);
		margin-right: 20upx;
	}

	.buttonGroup .goPay {
		display: inline-block;
		vertical-align: middle;
		text-align: center;
		padding: 10upx 40upx;
		border-width: 1upx;
		border-style: solid;
		border-radius: 36upx;
		font-size: 28upx;
		color: $color-red;
	}

	.buttonGroup .refund {
		display: inline-block;
		vertical-align: middle;
		padding: 10upx 40upx;
		text-align: center;
		background: rgba(0, 0, 0, 0);
		border: 2upx solid rgba(216, 216, 216, 1);
		border-radius: 36upx;
		font-size: 28upx;
		color: rgba(153, 153, 153, 1);
		margin-right: 20upx;
	}

	.buttonGroup .confirm {
		display: inline-block;
		vertical-align: middle;
		padding: 10upx 40upx;
		text-align: center;
		border-width: 1upx;
		border-style: solid;
		border-radius: 36upx;
		font-size: 28upx;
		color: $color-red;
	}
</style>
