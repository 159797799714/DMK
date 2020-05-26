<template>
	<view class="content">
		<view  class="headWrapper">
			<view class="seachWrapper p-re">
				<input class="inputView col-33" type="text" v-model="searchInfo" value="" placeholder="请输入" placeholder-style="color: #d8d8d8; fontSize: 28upx;" @confirm="search()"/>
				<image class="icon" src="../../static/reach.png" mode="" @click="search"></image>
				<image v-if="searchInfo" src="../../static/circleClose.png"  class="delIcon bg-D8" @click="delSearchInfo"></image>
			</view>
			<view class="cart t-center" @click.stop="search">搜索</view>
		</view>
		<view class="contentList">
			<GoodTwoColumn :isRequired="isRequired" :allProduceArr="allProduceArr" @cartChange="changeCart"></GoodTwoColumn>
			
		</view>
		
	</view>
</template>

<script>
	import GoodTwoColumn from "@/components/GoodTwoColumn.vue"
	import {textToast} from "@/common/utils.js"
	export default{
		components: {
			GoodTwoColumn
		},
		data() {
			return {
				allProduceArr: [],
				searchInfo: '',
				CurrentPage: 1,
				TotalPage: '',
				noSearch: false,
				TicketGoodsCodes: '',
				TicketCategoriesCodes: '',
				isRequired: false
			}
		},
		onLoad(opt) {
			console.log('接收到参数', opt)
			if(opt.couponParams) {
				console.log(opt.couponParams)
				let couponParams= JSON.parse(opt.couponParams)
				this.TicketGoodsCodes= couponParams.GoodsCode
				this.TicketCategoriesCodes= couponParams.CategoriesCode
				this.search()
			}
		},
		onShow() {
			this.$setNavigatorBg()
		},
		onReachBottom() {
			let that= this
			if(that.CurrentPage < that.TotalPage) {
				that.CurrentPage += 1
				that.search(true)
				return
			}
		},
		methods: {
			delSearchInfo() {
				this.searchInfo= ''
				this.search()
			},
			async search(loadMore) {
				if(!this.searchInfo) {
					this.TotalPage= 1
					this.allProduceArr= []
					return
				}
				var that= this,
					params= {
						"SearchText": that.searchInfo,
						"CurrentPage": that.CurrentPage,
						"PageSize": 0,
						"SourceOrder": 1,
						"TicketGoodsCodes": that.TicketGoodsCodes,
						"TicketCategoriesCodes": that.TicketCategoriesCodes
					}
				let res = await that.$request(that.$API.AppQueryGoods, params)
				that.isRequired= true
				that.TotalPage= res.Data.TotalPage
				console.log('搜索到商品', res)
				if(res.Data.Datas.length < 1) {
					textToast('抱歉，暂无相关商品')
				}
				that.allProduceArr= loadMore?that.allProduceArr.concat(res.Data.Datas): res.Data.Datas
			},
			goCart() {
				uni.switchTab({
					url: "/pages/cart/cart"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.headWrapper {
		z-index: 5;
		position: fixed;
		top: 0;
		left: 0;
		padding: 14upx 24upx;
		height: 60upx;
		background-color: #fff;
		.seachWrapper {
				display: inline-block;
				vertical-align: middle;
				width: 530upx;
				height:60upx;
				background:rgba(246,246,246,1);
				border-radius:30upx;
				padding-left: 68upx;
				position: relative;
				.inputView {
					display: block;
					width: 420upx;
					height: 60upx;
					font-size:28upx;
				}
				.icon {
					display: block;
					width: 32upx;
					height: 32upx;
					position: absolute;
					left: 24upx;
					top: 50%;
					margin-top: -16upx;
				}
				.delIcon{
					z-index: 10;
					position: absolute;
					top: 10upx;
					right: 30upx;
					height: 40upx;
					width: 40upx;
					border-radius: 50%;
				}
			}
			.cart {
				display: inline-block;
				vertical-align: middle;
				width: 100upx;
				height: 40upx;
			}
	}
	
	/* contentList */
	.contentList{
		font-size: 0;
		width: 100%;
		padding: 100upx 24upx 20upx;
		box-sizing: border-box;
	}
</style>
<style>
	page{
		height: 100%;
	}
	page{
		background-color: #f6f6f6;
	}
</style>
