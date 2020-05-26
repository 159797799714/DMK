<template>
	<view class="content">
		<view class="tabs">
			<view v-for="(item, index) in titleArr" :key="index" :class="tabIndex === index?'active': ''" :style="tabIndex === index?'color:'+themeColor: ''" class="tab" @click="selectTab(index)">{{item.title}}</view>
			<view class="sliper" :style="'left:'+ sliperLeft+ ';background:'+themeColor"></view>
		</view>
		<scroll-view scroll-y="true" class="listBox" style="height: calc(100% - 88upx);">
			<view v-for="(item, index) in couponList" :key="index" class="coupon-item" :class="tabIndex === 0? '': 'used'">
				<view class="leftBox dis-flex flex-column flex-x-center flex-y-center flex-x-center">
					<view class="coupon-num oneline-hidden">¥<text>{{item.TicketAmount}}</text></view>
					<view class="limit">{{item.PriceRule}}</view>
				</view>
				<view class="rightBox dis-flex flex-column flex-center">
					<view class="dis-flex flex-x-between">
						<view class="f-36 col-33 f-bold coupon-info twoline-hidden">{{item.GoodsRule}}</view>
						<view v-if="tabIndex === 0" class="btn" :style="'border-color:'+themeColor+';color:'+themeColor" @click="useAction(item)">立即使用</view>
						<view v-else class="invalid-icon" :class="tabIndex === 1?'used-icon': ''"/>
					</view>
					<view class="time">{{item.StarDate.replace(/-/gi, '.')}}-{{item.EndDate.replace(/-/gi, '.')}}</view>
				</view>
			</view>
			
		</scroll-view>
	</view>
</template>

<script>
	import {textToast} from "@/common/utils.js"
	export default {
		data() {
			return {
				tabIndex: 0,   // 默认选中未使用
				titleArr: [{
					title: '未使用',
					apiName: 'GetMyUnUseTicket'
				}, {
					title: '已使用',
					apiName: 'GetMyUseTicket'
				}, {
					title: '已过期',
					apiName: 'GetMyInvalidTicket'
				}],
				sliperLeft: '',            // tab底部小滑块偏移量
				leftArray: [],             // 导航栏tab偏移量数组
				tabWidth: '',              // tab的宽度
				requestParams: {
					"CurrentPage": 1,
					"PageSize": 15,
					"SourceOrder": 1
				},
				TotalPage: 0,
				couponList:[],
				themeColor: this.$store.state.themeColor
			}
		},
		onLoad() {
			let that= this,
				view = uni.createSelectorQuery().in(this).selectAll(".tab");
			view.boundingClientRect(data => {
			  console.log("得到布局位置信息" + JSON.stringify(data[0]))
				that.tabWidth= data[0].width
				data.map(item => {
					let left = item.left + item.width / 2
					that.leftArray.push(left)
				})
				that.selectTab(0)
			}).exec()
		},
		methods: {
			selectTab(index) {
				let that= this
				that.tabIndex= index
				that.sliperLeft= that.leftArray[index] + 'px'
				that.getCouponList(that.titleArr[index].apiName)
			},
			// // 上拉加载更多
			// loadMore() {
			// 	let that= this
			// 	if(that.CurrentPage < that.TotalPage) {
			// 		that.requestParams.CurrentPage += 1
			// 		that.selectTab(that.requestParams.CurrentPage)
			// 		console.log('触发加载更多')
			// 		return
			// }
			// 	textToast('亲！只有这么多了哦！')
			// },
			async getCouponList(apiName) {
				let that= this,
					res= await that.$request(that.$API[apiName])
				if(res) {
					console.log(res.Data)
					res.Data.forEach((item, index) => {
						item.EndDate= item.EndDate.slice(0, 10)
						item.StarDate= item.StarDate.slice(0, 10)
					})
					
					that.couponList= res.Data
				}
			},
			useAction(item) {
				if(!item.GoodsCode && !item.CategoriesCode) {
					uni.switchTab({
						url: '/pages/menu/menu'
					})
					return
				}
				let params= {
					GoodsCode: item.GoodsCode,
					CategoriesCode: item.CategoriesCode
				}
				uni.navigateTo({
					url: '/pagesA/search/search?couponParams=' + JSON.stringify(params)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		height: 100%;
		background: #f3f3f3;
		overflow: hidden;
	}
	.tabs{
		position: relative;
		display: flex;
		padding: 0 48upx;
		height: 88upx;
		line-height: 88upx;
		background: #fff;
		.tab{
			flex: 1;
			white-space: nowrap;
			overflow: auto;
			line-height: 88upx;
			text-align: center;
			color: $color-33;
			font-size: $f-28;
		}
		.active{
			font-weight: bold;
		}
		.sliper{
			position: absolute;
			bottom: 0;
			left: 0;
			height: 4upx;
			width: 76upx;
			transition: 300ms;
			transform: translateX(-38upx);
			border-radius: 2upx;
		}
	}
	.listBox{
		box-sizing: border-box;
		padding: 20upx 24upx;
		.coupon-item{
			height: 220upx;
			width: 100%;
			margin-bottom: 20upx;
			background-image: url('../../static/coupon_red.png');
			background-size: cover;
			.leftBox{
				float: left;
				width: 240upx;
				height: 100%;
				text-align: center;
				color: #fff;
				.coupon-num{
					font-size: 40upx;
					vertical-align: bottom;
					line-height: 60upx;
					&>text{
						font-size: 80upx;
					}
				}
				.limit{
					margin-top: 32upx;
					font-size: 24upx;
					line-height: 1em;
				}
			}
			.rightBox{
				float: right;
				position: relative;
				width: 372upx;
				padding: 0 40upx;
				height: 100%;
				.coupon-info{
					padding-right: 5upx;
					line-height: 40upx;
					min-width: 220upx;
					max-width: 400upx;
				}
				.btn{
					padding: 0 18upx;
					border-width: 1upx;
					border-style: solid;
					border-radius: 24upx;
					line-height: 48upx;
					height: 48upx;
					font-size: 24upx;
					white-space: nowrap;
				}
				.time{
					margin-top: 23upx;
					color: #999;
					font-size: 24upx;
					line-height: 20upx;
				}
				.invalid-icon{
					position: absolute;
					height: 132upx;
					width: 132upx;
					right: 0;
					top: 20upx;
					background-size: cover;
					background-image: url(../../static/invalid.png);
				}
				.used-icon{
					background-image: url(../../static/used.png)
				}
			}
		}
		.used{
			background-image: url('../../static/coupon_gray.png');
		}
	}
	
</style>

