<template>
	<scroll-view scroll-y="true" class="content" style="height: 100%;" @scrolltolower="loadMore">
		<view class="tab_v flexs flex-r flex-center">
			<view class=" flexs flex-center flex-v flex-line" v-for="(item, index) in tabs" :key="index">
				<view class="tab_v_item" :style="tabIndex === index?'color:'+themeColor: ''"  @click="selectTab(index)">{{item}}</view>
				<view :style="tabIndex === index?'width: 40%;height: 2rpx;background:'+themeColor: 'width: 40%;height: 2rpx;background:#fff;'"/>
			</view>
		</view>
		<view class="list">
			<view class="proList" v-for="(item, index) in orderList" :key="index">
				<view class="produce-wrap" v-for="(ite, indexs) in item.OrderGoods" :key="indexs" :style="indexs==0 ? '':'margin-top:20rpx;'">
					<view class="produce">						
						<view class="produce-info">
							<image class="proIcon" :src="ite.ImageUrl" mode=""></image>
							<view class="desc">
								<view class="title">
									{{ite.GoodsName}} {{ite.WeightShort }}
									<text class="m-l-20 col-99 f-28"> x {{ ite.Quantity}}</text>
								</view>
								<view class="num col-33 f-24">
									<text class="m-r-15">实付 </text>
									¥ <text class="f-32">
										{{ splitPrice(toFixed(ite.SumActualPrice))[0]}}.
									</text>
									{{splitPrice(toFixed(ite.SumActualPrice))[1]}}
								</view>
							</view>
						</view>
						<view class="price">
							¥<text class="big f-32">{{splitPrice(toFixed(ite.SumAmount))[0]}}.</text>
							{{splitPrice(toFixed(ite.SumAmount))[1]}}
						</view>
					</view>
					<view v-if="ite.IsComment">
						<view class="stars dis-flex">
							<image v-for="item in ite.MyComment.CommentStar" :key="item" src="../../static/star_yes.png" mode=""></image>
						</view>
						<view class="comment-words col-33 f-28" style="padding: 10rpx 0;">{{ite.MyComment.Content}}</view>
						<!-- <view class="flexs flex-r flex-wrap" style="padding: 20rpx 0;" >
							 <image v-for="(imgs,g) in ite.MyComment.CommontImages" :key="imgs" :src="imgs.NetPath" mode="widthFix"
							  style="width: 25%; margin-right: 20rpx;" @click="preview(ite.MyComment.CommontImages,g)"></image>	
						</view> -->
						<view class="comment-images">
							<image v-for="(obj, num) in ite.MyComment.CommontImages" :key="num" :src="obj.NetPath" mode="" @click="preview(ite.MyComment.CommontImages, num)"></image>
						</view>
					</view>
				</view>
				<view v-if="tabIndex === 0" class="buttonGroup">
					<view class="goPay" :style="'border-color:'+themeColor+';color:'+themeColor" @click="goComment(item.OrderNumber)">立即评价</view>
				</view>
				
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import {splitPrice} from "../../common/utils.js"
	import {textToast} from '@/common/utils.js'
	export default{
		data() {
			return{
				preview:this.helper.preview,
				toFixed:this.helper.toFixed,
				tabIndex: 0,
				sliperLeft: 8,
				tabs: ['待评价', '已评价'],
				params: {
					"CurrentPage": 1,
					"PageSize": 0,
					"SourceOrder": 1
				},
				TotalPage: '',
				orderList: [],
				themeColor: this.$store.state.themeColor,
				splitPrice: splitPrice
			}
		},
		onShow() {
			this.params.CurrentPage= 1
			let index= this.tabIndex?this.tabIndex: 0
			this.selectTab(index)
		},
		methods: {
			loadMore() {
				let that= this
				if(that.params.CurrentPage < that.TotalPage) {
					that.params.CurrentPage += 1
					that.selectTab(that.tabIndex)
					return
				}
				textToast('亲！只有这么多了哦！')
			},
			goComment(OrderNumber) {
				uni.navigateTo({
					url: '/pagesB/releaseComment/releaseComment?OrderNumber='+OrderNumber
				})
			},
			selectTab(index) {
				let that= this
				that.tabIndex= index
				that.orderList= []
				switch(index) {
					case 0:
						that.GetUnCommentOrder()
						break
					case 1:
						that.GetCommentOrder()
						break
				}
			},
			// 已评价订单
			async GetCommentOrder() {
				var that= this
				var res = await that.$request(that.$API.GetCommentOrder, that.params)
				console.log('已评价订单', res)
				that.orderList= that.orderList.concat(res.Data.Datas)
				that.TotalPage= res.Data.TotalPage
			},
			
			// 等待评价订单
			async GetUnCommentOrder() {
				let that= this
				let res= await that.$request(that.$API.GetUnCommentOrder, that.params)
				console.log('待评价订单', res)
				that.orderList= that.orderList.concat(res.Data.Datas)
				that.TotalPage= res.Data.TotalPage
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
		// padding: 20upx 0;
		height: 100%;
		width: 100%;
		background: #f5f5f5;
	}
	.comment-images {
		width: 100%;
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
	.active{
		color: $color-red;
		font-weight: bold;
	}
	.bor_f{
		border-bottom: 2upx #fff solid;
	}
	.bor_r{
		border-bottom: 2upx $color-red solid;
	}
	.sliper{
		position: absolute;
		bottom: 0;
		left: 0;
		height: 4upx;
		width: 24px;
		background-color: $color-red;
		transition: 300ms;
		transform: translateX(-12px);
		border-radius: 2upx;
	}
	.tab_v{
		position: relative;
		background-color: #fff;
		margin-bottom: 20upx;
	}
	.tab_v_item{
		 padding: 20upx;
		 margin: 0 20upx;
		// border-width:30upx;
	}
	.tabs .sliper{
		position: absolute;
		bottom: 0;
		left: 0;
		height: 4rpx;
		width: 24px;
		background-color: $color-red;
		-webkit-transition: 300ms;
		transition: 300ms;
		-webkit-transform: translateX(-12px);
		transform: translateX(-12px);
		border-radius: 2rpx;
	}
	.list {
		// width: 654upx;
		// background: rgba(255, 255, 255, 1);
		border-radius: 12upx;
		padding: 0 24upx;
		margin: 0 auto;
	}
	.stars{
		padding: 10upx 0;
		&>image{
			margin-right: 28upx;
			height: 24upx;
			width: 26upx;
		}
	}
	.proList{
		margin-bottom: 30upx;
		padding:30upx 20upx;
		background-color: #fff;
		border-radius: 20upx;
	}
	
	.produce-wrap{
		border-top: 1px solid #c9d0d8;
		padding-top: 20upx;
	}
	.proList .produce-wrap:first-child{
		border-top: none;
	}
	
	.produce {		
		margin-bottom: 20upx;
		display: flex;
		justify-content: space-between;
		font-size: 0;
	}
	
	.produce-info{
		display: flex;
	}
	
	.produce .desc{
		flex: 1;
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
		text{
			display: inline-block;
		}
	}
	
	.produce .desc .num {
		font-size: 28upx;
		font-weight: 400;
		margin-top: 20upx;
	}
	
	.produce .price {
		display: inline-block;
		vertical-align: middle;
		font-size: 24upx;
		color: rgba(51, 51, 51, 1);
	}
	.produce .comment-words{
		line-height: 36upx;
	}
	
	/* buttonGroup */
	.buttonGroup {
		margin-top: 24upx;
		font-size: 0;
		text-align: right;
	}
	
	.buttonGroup .goPay {
		display: inline-block;
		vertical-align: middle;
		padding: 0 37upx;
		height: 60upx;
		line-height:60upx;
		border-width: 1upx;
		border-style: solid;
		border-radius: 30upx;
		font-size: 28upx;
		color: $color-red;
	}
	
</style>
<style>
	page{
		height: 100%;
		width: 100%;
	}
</style>