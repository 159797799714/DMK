<template>
	<view class="contentListWrapper">
		<block v-if="goodList.length > 0">
			<!-- 左侧 -->
			<view class="leftBox">
				<view class="listBox" v-for="(item,index) in leftArr" :key="index" @click="goProDetails(item.GoodsCode)">
					<view class="product">
						<!-- <image :src="item.NetPath" mode="widthFix" class="img"></image> -->
						<u-lazy-load mode="widthFix" :image="item.NetPath" class="img"></u-lazy-load>
						<view class="discount" v-if="item.Discount>0">限时{{item.Discount}}折</view>
						<view v-if="item.StoreQuantity < 1" class="noStore">已抢光</view>
					</view>
					<!-- 标题 -->
					<view class="proTitle">
						{{item.GoodsName}}  {{item.WeightShort}}
					</view>
					
					<view class="proWarehose dis-flex flex-x-between oneline-hidden">
						<block v-if="!hasPoints">
							<view class="warehose oneline-hidden">
								产地:{{item.ProductPlace?item.ProductPlace: '其他'}}
							</view>
							<view class="produce oneline-hidden">
								已售:{{item.SalesQuantity}}
							</view>
						</block>
						<block v-else>
							<view class="produce oneline-hidden">
								库存:{{item.SalesQuantity}}
							</view>
							<view class="warehose oneline-hidden">
								产地:{{item.ProductPlace?item.ProductPlace: '其他'}}
							</view>
						</block>
					</view>
					
					<view class="priceWrapper dis-flex flex-y-center">
						<view class="priceBox">
							<view class="priceSale oneline-hidden">
								<block v-if="!hasPoints">
									<view class="price">
										<text>¥</text>
										<text class="priceNum">{{splitPrice(item)[0]}}.</text>
										<text class="f-28">{{splitPrice(item)[1]}}</text>
										<text v-if="item.DiscountPrice && item.DiscountPrice != item.MarketPrice" class="m-l-12 col-B1 f-24 text-line">¥{{item.MarketPrice}}</text>
									</view>
									<view v-if="item.MembershipPrice" class="min-price f-28 col-blue">
									¥{{item.MembershipPrice}}
										<text class="member-price bg-blue col-f f-20">会员价</text>
									</view>
								</block>
								<block v-else>
									<view class="price">
										<text>¥</text>
										<text class="priceNum">{{splitPrice(item)[0]}}</text>
										<text class="f-28">积分</text>
									</view>
									<view v-if="item.MembershipPrice" class="min-price f-28 col-blue">
										<text class="m-l-12 col-B1 f-24 text-line">¥{{item.MarketPrice}}</text>
									</view>
								</block>
							</view>
							<!-- <view v-if="item.DiscountPrice && !item.MembershipPrice" class="nativePrice">¥ {{item.MarketPrice}}</view> -->
						</view>
						<view class="rightbox">
							<view class="addCar">
								<view v-show="item.CurrentCartQuantity> 0 && hasCart" class="num-info bg-red">{{item.CurrentCartQuantity}}</view>
								<image  class="car" :class="hasCart ? '': 'v-hidden'" src="../static/cart.png" mode="" @click.stop="createCustomerCart(item.GoodsCode, index, 'leftArr', $event);"></image>
							</view>
						</view>
					</view>
					
				</view>
			</view>
			
			<!-- 右侧 -->
			<view class="rightBox">
				<view class="listBox" v-for="(item,index) in rightArr" :key="index" @click="goProDetails(item.GoodsCode)">
					<view class="product">
						<!-- <image :src="item.NetPath" mode="widthFix" class="img"></image> -->
						<u-lazy-load mode="widthFix" :image="item.NetPath" class="img"></u-lazy-load>
						<view class="discount" v-if="item.Discount>0">限时{{item.Discount}}折</view>
						<view v-if="item.StoreQuantity < 1" class="noStore">已抢光</view>
					</view>
					<!-- 标题 -->
					<view class="proTitle">
						{{item.GoodsName}}  {{item.WeightShort}}
					</view>
					<!-- 标题下的信息 -->
					<view class="proWarehose dis-flex flex-x-between oneline-hidden">
						<block v-if="!hasPoints">
							<view class="warehose oneline-hidden">
								产地:{{item.ProductPlace?item.ProductPlace: '其他'}}
							</view>
							<view class="produce oneline-hidden">
								已售:{{item.SalesQuantity}}
							</view>
						</block>
						<block v-else>
							<view class="produce oneline-hidden">
								库存:{{item.SalesQuantity}}
							</view>
							<view class="warehose oneline-hidden">
								产地:{{item.ProductPlace?item.ProductPlace: '其他'}}
							</view>
						</block>
					</view>
					<!-- 价格信息 -->
					<view class="priceWrapper dis-flex flex-y-center">
						<view class="priceBox">
							<view class="priceSale">
								<block v-if="!hasPoints">
									<view class="price">
										<text>¥</text>
										<text class="priceNum">{{splitPrice(item)[0]}}.</text>
										<text class="f-28">{{splitPrice(item)[1]}}</text>
										<text v-if="item.DiscountPrice && item.DiscountPrice != item.MarketPrice" class="m-l-12 col-B1 f-24 text-line">¥{{item.MarketPrice}}</text>
									</view>
									<view v-if="item.MembershipPrice" class="min-price f-28 col-blue">
										¥{{item.MembershipPrice}}
										<text class="member-price bg-blue col-f f-20">会员价</text>
									</view>
								</block>
								<block v-else>
									<view class="price">
										<text>¥</text>
										<text class="priceNum">{{splitPrice(item)[0]}}</text>
										<text class="f-28">积分</text>
									</view>
									<view v-if="item.MembershipPrice" class="min-price f-28 col-blue">
										<text class="m-l-12 col-B1 f-24 text-line">¥{{item.MarketPrice}}</text>
									</view>
								</block>
							</view>
							
							<!-- <view v-if="item.DiscountPrice && !item.MembershipPrice" class="nativePrice">¥ {{item.MarketPrice}}</view> -->
						</view>
						<view class="rightbox">
							<view class="addCar">
								<view v-show="item.CurrentCartQuantity> 0 && hasCart" class="num-info bg-red">{{item.CurrentCartQuantity}}</view>
								<image  class="car" :class="hasCart ? '': 'v-hidden'" src="../static/cart.png" mode="" @click.stop="createCustomerCart(item.GoodsCode, index, 'rightArr', $event)" @touchstart="cartTouch"></image>
							</view>
						</view>
					</view>
				
				</view>
			</view>
		</block>
		
		<block v-else-if="isRequired">
			<view class="blank"></view>
		</block>
	</view>
</template>

<script>
	import {splitPrice} from "../common/utils.js"
	export default {
		name: 'GoodTwoColumn',
		props: {
			allProduceArr: Array,
			hasCart: {
				type: Boolean,
				default: true
			},
			hasPoints: {
				type: Boolean,
				default: false
			},
			isRequired: Boolean
		},
		watch: {
			allProduceArr(newVal, oldVal) {
				console.log('新数组', newVal)
				if(newVal.length > 0) {
					this.isRequired= true
				}
				this.sortArr(newVal)
			}
		},
		data() {
			return {
				leftArr: [],
				rightArr: [],
				goodList: '',
				clickTime: false,
				splitPrice: splitPrice,
				themeBg: '',               // 主题背景色字符串如 background: #fff;
				fontThemeColor: '',        // 主题字体颜色字符串如 color: #fff;
			}
		},
		created() {
			this.themeBg= this.themeColor_g?'background:'+ this.themeColor_g+';': 'background: #FF303B;'
			this.fontThemeColor= this.themeColor_g?'color:'+ this.themeColor_g+';': 'color: #FF303B;'
		},
		methods: {
			// 将列表分成左右两列
			async sortArr(arr) {
				var array= arr
				array.map((item, index) => {
					item.DiscountPrice = item.DiscountPrice ? this.helper.toFixed(item.DiscountPrice) : 0
					item.Discount = item.Discount * 10
					item.NetPath = item.ImageUrl?item.ImageUrl: ''
					item.GoodsCode = item.GoodsCode
					item.MembershipPrice = item.MembershipPrice ? this.helper.toFixed(item.MembershipPrice) : 0
					item.MarketPrice = item.MarketPrice ? this.helper.toFixed(item.MarketPrice) : 0
					item.WeightShort = item.WeightShort ? item.WeightShort : ''
					
				})
				this.goodList= array
				this.leftArr = array.filter((_item, index) => index % 2 === 0);
				this.rightArr = array.filter((_item, index) => index % 2 !== 0);
				console.log('商品列表组件数据', this.leftArr, this.rightArr)
			},
			// 查看详情
			goProDetails(id) {
				uni.navigateTo({
					url:'/pagesA/proDetails/proDetails?id=' + id
				})
			},
			// 触摸
			cartTouch(e) {
				console.log('触摸了点击了', e)
			},
			// 加入购物车
			createCustomerCart(id, index, str, e) {
				let that= this
				// 防止快速点击
				if(!that.$stopAction()) {
					return
				}	
				that.$createCart(id, true).then(res=>{
					console.log('添加成功', res)
					if(!res)return;
					let num;
					if(str === 'leftArr') {
						that.leftArr[index].CurrentCartQuantity += 1
						num = that.leftArr[index].CurrentCartQuantity
						that.$store.commit('buy', {goods:that.leftArr[index], count:that.leftArr[index].CurrentCartQuantity})
					} else {
						that.rightArr[index].CurrentCartQuantity += 1
						num = that.rightArr[index].CurrentCartQuantity
						that.$store.commit('buy', {goods:that.rightArr[index], count:that.rightArr[index].CurrentCartQuantity})
					}	
					that.$emit('cartChange', true)
					that.$emit('buy', {e, id})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>	
.contentListWrapper {
		width: 100%;
		padding-bottom: 20upx;
	}
	.leftBox{
		display: inline-block;
		vertical-align: top;
		width: 338upx;
		min-height: 0;
	}
	.rightBox{
		display: inline-block;
		vertical-align: top;
		width: 338upx;
		min-height: 0;
	}
	.leftBox{
		margin-right: 20upx;
	}
	.listBox {
		margin-bottom: 25upx;
		background: #fff;
		border-radius:16upx;
		.product {
			position: relative;
			display: block;
			width: 338upx;
			border-radius: 16upx 16upx 0 0;
			overflow: hidden;
			.img{
				width: 338upx;
				min-height: 200upx;
			}
			.discount{
				position: absolute;
				left: 24upx;
				bottom: 25%;
				transform: rotate(-12deg);
			}
			.noStore{
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%);
				width: 200upx;
				height: 44upx;
				line-height: 44upx;
				text-align: center;
				color: #fff;
				font-size: 28upx;
				background-color: rgba($color: #000000, $alpha: 0.4);
				border-radius: 22upx;
			}
		}
		.proTitle {
			margin-left: 20upx;
			padding-top: 24upx;
			display: inline-block;
			font-size:28upx;
			color:rgba(51,51,51,1);
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
		.proWarehose {
			padding: 0 24upx 0 20upx;
			font-size: 0;
			margin-top: 10upx;
			.warehose {
				display: inline-block;
				vertical-align: middle;
				max-width: 60%;
				font-size:24upx;
				line-height: 24upx;
				color:rgba(156,156,156,1);
			}
			.produce {
				display: inline-block;
				vertical-align: middle;
				max-width: 40%;
				text-align: right;
				font-size:24upx;
				line-height: 24upx;
				color:rgba(156,156,156,1);
			}
			
		}
	}
	
	.listBox .priceWrapper {
		font-size: 0;
		padding: 26upx 24upx 24upx;
		display: flex;
	}
	.listBox .priceWrapper  .priceBox {
		display: inline-block;
		width: 70%;
	}
	.priceWrapper  .priceBox .nativePrice {
		font-size:24upx;
		font-weight:500;
		text-decoration:line-through;
		color:rgba(177,177,177,1);
		line-height: 1;
	}
	.priceSale {
		.min-price{
			display: flex;
			height: 30upx;
			align-items: center;
			margin-bottom: 10upx;
		}
	}
	 .priceBox .priceSale .price {
		 font-size:28upx;
		 height: 40upx;
		 margin-right: 20upx;
		 margin-bottom: 10upx;
		 color: $color-red;
		 text{
			 line-height: 1;
		 }
	 }
	 .priceSale{
		 .member-price{
		 	margin-left: 4upx;
		 	padding: 0 7upx;
		 	line-height: 24upx;
		 	border-radius: 4upx;
		 }
	 }
	 .priceNum {
		 margin-left: 5upx;
		 font-size:40upx;
	 }
	.rightbox{
		position: relative;
		display: inline-block;
		width: 30%;
		vertical-align: center;
		.addCar{
			text-align: right;
			.sale {
				 display: inline-block;
				 margin-top: 6upx;
				 text-align: right;
				 font-size:20upx;
				 color:rgba(249,90,75,1);
				 white-space: nowrap;
			}
		}
	}
	
	
	.addCar .car {
		display: inline-block;
		width: 48upx;
		height: 48upx;
		border-radius: 50%;
		background: $linear-red;
	}
	.v-hidden{
		visibility: hidden;
	}
</style>
