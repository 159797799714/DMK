<template>
	<view class="content">
		<view class="list" v-for="(item,i) in refund_list" :key="i">
			<view class="proList">
				<view class="produce" :key="i">
					<view>
						<image class="proIcon" :src="item.ImageUrl" mode=""></image>
						<view class="desc">
							<view class="title">
								{{item.GoodsName}} {{item.WeightShort}}
								<text class="m-l-20 col-99 f-28"> x {{item.Quantity}}</text>
							</view>
							<view class="num col-33 f-24">
								<text class="m-r-15">实付 </text>
								¥<text class="f-32">
									{{splitPrice(toFixed(item.SumActualPrice))[0]}}.
								</text>
								{{splitPrice(toFixed(item.SumActualPrice))[1]}}
							</view>
						</view>
					</view>
					<view class="price">
						¥
						<text class="big">{{splitPrice(toFixed(item.SumAmount))[0]}}.</text>
						{{splitPrice(toFixed(item.SumAmount))[1]}}
					</view>
				</view>
				
				<view class="bottom-info ">
					<text class="bottom-title">{{item.MyAftermarket.AftermarketTypeText}}</text>
					<text class="small">{{item.MyAftermarket.AftermarketTypeText}}{{item.MyAftermarket.AftermarketStatus ? '成功':'中'}}</text>
					<text class="small-price">¥{{toFixed(item.SumActualPrice)}}</text>
				</view>
			</view>
		</view>
		<view v-if="refund_list !== '' && refund_list.length < 1" class="flexs flex-center flex-line flex-v" style="padding-top: 56rpx;">
			<image src="../../static/zerolist.png" mode="widthFix" style="width: 690rpx;"></image>
			<text style="color: #999999; font-size: 32rpx;">还没有订单哦</text>
		</view>
		<view v-else-if="CurrentPage >= TotalPage && TotalPage !== 0" class="noMore t-center col-66 f-24">亲！只有这么多了哦！</view>
	</view>
</template>

<script>
	import {splitPrice} from "../../common/utils.js"
	export default{
		data() {
			return{
				toFixed:this.helper.toFixed,
				CurrentPage:1,
				TotalPage: 0,
				refund_list: '',
				splitPrice: splitPrice
			}
		},
		onLoad() {
			this.GetMyAftermarketOrder()
		},
		onReachBottom() {
			this.loadMore()
		},
		methods: {// 上拉加载更多
			loadMore() {
				let that = this
				if (that.CurrentPage < that.TotalPage) {
					that.CurrentPage += 1
					this.GetMyAftermarketOrder()
					return
				}
			},
			async GetMyAftermarketOrder(){
				let param={
				  "CurrentPage": this.CurrentPage,
				  "PageSize": 15
				}
				let res=await this.$request(this.$API.GetMyAftermarketOrder,param)
				console.log('res',res)
				let Datas= res.Data.Datas
				this.TotalPage= res.Data.TotalPage
				this.filterRes(Datas)
			},
			filterRes(Datas) {
				let array= []
				Datas.forEach((item, index) => {
					item.OrderGoods.forEach(obj => {
						array.push(obj)
					})
				})
				if(this.refund_list !== [] && this.refund_list) {
					this.refund_list= []
				}
				this.refund_list= this.CurrentPage > 1?this.refund_list.concat(array): array
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
	.content{
		padding: 20upx 0;
		min-height: 100%;
		width: 100%;
		background: #f5f5f5;
	}
	.list {
		width: 654upx;
		background: rgba(255, 255, 255, 1);
		border-radius: 12upx;
		padding: 0 24upx;
		margin: 0 auto 20upx;
	}
	.produce {
		padding-top: 30upx;
		margin-bottom: 20upx;
		display: flex;
		justify-content: space-between;
		font-size: 0;
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
		margin-left: 31upx;
	}
	
	.produce .desc .title {
		font-size: 32upx;
		color: rgba(51, 51, 51, 1);
	}
	
	.produce .desc .num {
		margin-top: 20upx;
		letter-spacing: 2upx;
	}
	
	.produce .price {
		display: inline-block;
		vertical-align: middle;
		font-size: 24upx;
		color: rgba(51, 51, 51, 1);
		letter-spacing: 2upx;
	}
	
	.produce .price .big {
		font-size: 32upx;
	}
	.bottom-info{
		height: 94upx;
		line-height: 94upx;
		font-size: $f-32;
		color: $color-33;
		font-weight: bold;
		border-top: 1upx solid #eaeaea;
		.bottom-title{
			display: inline-block;
			width: 130upx;
		}
		.small,.small-price{
			color: #666;
			font-size: $f-28;
			font-weight: normal;
		}
		.small-price{
			margin-left: 20upx;
		}
		
	}
	
</style>
<style>
	page{
		height: 100%;
		width: 100%;
	}
</style>