<template>
	<view class="main dis-flex flex-column">
		<topBar iconColor="black">
			<view class="userImg">
				<image :src="CreateImageUrl?CreateImageUrl: '../../static/userIcon.png'" mode=""></image>
				<text class="col-33 f-28">{{detail.CreateName}}</text>
			</view>
		</topBar>
		<view class="content flex-1" style="overflow: scroll;">
			<view class="proImages p-re" style="padding-top: 20rpx;">
				<!-- <image class="pro" src="" mode=""></image> -->
				<swiper :autoplay="true" :duration="500" @change="swiperChange" :style="{height: SwiperHeight + 'px'}">
					<swiper-item v-for="(item, index) in detail.RecipesImages" :key="index" @click="preview(detail.RecipesImages,index)">
						<image class="pro bg-pink" :src="item.NetPath" mode="widthFix"></image>
					</swiper-item>
				</swiper>
				<view class="indicator">
					<text v-for="num in detail.RecipesImages.length" :key="num" class="point" :style="{'background': swiperIndex == num?themeColor: '#fff'}"></text>
				</view>
			</view>
			<view class="header">
				<view class="oneTitle">{{detail.RecipesName}}</view>
				<view class="collect-icon">
					<view class="collectIcon" :class="detail.IsCare?'collected': 'collect'" @click="collectCookery(detail.RecipesId, detail.IsCare)"></view>
				</view>
			</view>
			<view class="descWrapper" style="padding-bottom: 87rpx;">
				<rich-text :nodes="detail.RecipesDetail"></rich-text>
				<view class="foodWrapper" v-if="RecipesGoods.length>0">
					<view class="label">食材</view>
		
					<!-- 不展开横向滚动 -->
					<view v-if="!isMore">
						<scroll-view style="width: 100%;" scroll-x="true" scroll-left="0">
							<view class="">
								<view class="flexs flex-r">
		
									<view  class="flexs flex-r goods_v" v-for=" (item,index) in RecipesGoods" :key="index" style="position: relative;min-width: 238px; margin-right: 20rpx;" @click="goDetail(item.GoodsCode)">
										<view class="">
											<image class="foodIcon" :src="item.ImageUrl" mode="" style="width: 120rpx;height: 120rpx;"></image>
										</view>
										<view class="flexs flex-v flex2" style="width:calc(100% - 120rpx); padding-left: 20rpx;">
											<view class="twoline-hidden col-33 f-bold f-28">
												{{item.GoodsName }} {{item.WeightShort}}
											</view>
											<view class="flexs flex-r flex2">
												<view class="col-red f-28">
													￥<text class="big">{{splitPrice(filterPrice(item))[0]}}.</text>
													<text>{{splitPrice(filterPrice(item))[1]}}</text>
													<text v-if="item.DiscountPrice && item.DiscountPrice != item.MarketPrice" class="m-l-12 col-B1 f-24 text-line">¥{{item.MarketPrice}}</text>
												</view>
												
												<view class="p-re">
													<view v-show="item.CurrentCartQuantity> 0" class="num-info">{{item.CurrentCartQuantity}}</view>
													<image style="width: 48rpx;height: 48rpx;" src="../../static/cart.png" mode="" @click.stop="createCustomerCart(item.GoodsCode, index)"></image>
												</view>
											</view>
										</view>
		
									</view>
		
								</view>
							</view>
						</scroll-view>
		
					</view>
		
					<!-- 展开竖向滚动 -->
					<view v-else class="goodList dis-flex flex-x-between flex-wrap">
						<navigator v-for=" (item,index) in RecipesGoods" :key="index" :url="'/pages/proDetails/proDetails?id='+item.GoodsCode"
						 class="good-item">
							<image class="good-img" :src="item.ImageUrl" mode="aspectFill"></image>
							<view class="good-info">
								<view class="good-name col-33 f-28 f-bold two_lines">{{item.GoodsName }} {{item.WeightShort}}</view>
								<view class="dis-flex flex-x-between flex-y-center">
									<view class="price">
										<view class="salePrice col-red f-24">
											￥<text class="big f-40">{{splitPrice(filterPrice(item))[0]}}.</text>
											<text class="f-28">{{splitPrice(filterPrice(item))[1]}}</text>
										</view>
										<!-- <view class="nativePrice col-B1 f-24 text-line">
											￥{{filterPrice(item)}}
										</view> -->
									</view>
									<view class="cart" style="position: relative;">
										<view v-show="item.CurrentCartQuantity> 0" class="num-info">{{item.CurrentCartQuantity}}</view>
										<image src="../../static/cart.png" mode="" @click.stop="createCustomerCart(item.GoodsCode, index)"></image>
									</view>
								</view>
							</view>
						</navigator>
					</view>
				</view>
				<view v-if="RecipesGoods.length>0 && RecipesGoods.length>1" class="loadMoreWrapper">
					<view class="label" @click="isMore = !isMore">{{isMore?'收起': '点击查看更多'}}</view>
					<image class="downIcon" :class="isMore?'rotate-180': ''" src="../../static/moreDown.png" mode=""></image>
				</view>
			</view>
			<view class="bottomView" v-if="RecipesGoods.length>0">
				<view class="addMenu" :style="'background: '+ themeColor" @click="open">购买食材</view>
			</view>
		
			<!--弹窗 -->
			<uni-popup ref="popup" type="bottom">
				<view class="popup-main col-33">
					<view class="title f-36 t-center f-bold">购买食材</view>
					<scroll-view scroll-y="true" class="food-main" style="height: 750upx">
						<view v-for="(item, index) in RecipesGoods" :key="index" class="food-item" @click.stop="selectItem(item.GoodsCode, index)">
							<view class="food-name f-left f-32" :style="item.selected?'color: #333': 'color: #9c9c9c'">
								<text :style="item.selected?'background:'+themeColor: 'background: #c9c9c9'"></text>
								{{item.GoodsName}}</view>
							<view class="weight f-right f-28" :class="item.selected?'col-red': 'col-9c'">￥{{filterPrice(item)}}</view>
						</view>
					</scroll-view>
					<view class="sure-btn col-f f-32 t-center" :style="isNoSelected? 'background: #D8D8D8':'background:'+themeColor" @click.stop="sureSubmit">确定</view>
				</view>
			</uni-popup>
		</view>
		
		<cartIconfk ref="cartIconfk" :style="'position: fixed;bottom: '+ bottom+ 'px;right:'+ right +'px;' " @touchMove="cartIconMove"></cartIconfk>
	</view>
	
</template>

<script>
	import {splitPrice} from "@/common/utils.js"
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import cartIconfk from "@/components/cartIconfk.vue"
	import topBar from "@/components/topBar.vue"
	export default {
		components: {
			uniPopup,
			topBar,
			cartIconfk
		},
		data() {
			return {
				preview: this.helper.preview,
				filterPrice: this.helper.filter_fields,
				RecipesId: '',
				CreateImageUrl: '',       // 作者头像
				detail: '',
				RecipesGoods: [], // 食材列表
				isMore: false, // 默认不展开全部食材
				selectedArr: [],
				cartGoods: [], // 选中的商品code数组,
				isNoSelected: false, // 选中是否为空
				isPreviewImage: false, // 图片预览
				currentDefault: 0, // 预览图片序列号
				SwiperHeight: 375,
				SwiperWidth: 375,
				swiperIndex: 0,        // 轮播图点选中索引值
				splitPrice: splitPrice,
				bottomDefault: 81,
				rightDefault: 10,          // 购物车默认偏移量
				bottom: 81,
				right: 10,  
				themeColor: this.$store.state.themeColor
			}
		},
		onLoad(opt) {
			let _this = this
			uni.getSystemInfo({
				success: function(res) {
					_this.SwiperWidth = res.windowWidth
					_this.SwiperHeight = res.windowHeight
				}
			})
			this.RecipesId = opt.id
			this.CreateImageUrl= opt.CreateImageUrl
		},
		onShow() {
			this.getRecipesDetail(this.RecipesId)
			this.getCartNum()
		},
		methods: {
			// 购物车图标拖动
			cartIconMove(shortX, shortY) {
				console.log('外面', shortX, shortY)
				this.bottom= this.bottomDefault + shortY
				this.right= this.rightDefault + shortX
			},
			// 滑动轮播图
			swiperChange(e) {
				this.swiperIndex= e.detail.current
			},
			setSwiperHeight(index) {
				let Height= this.detail.RecipesImages[index].ImageHeight / this.detail.RecipesImages[index].ImageWidth * this.SwiperWidth,
					maxHeight= this.SwiperWidth * 1.4
				this.SwiperHeight = Height > maxHeight? maxHeight: Height
				console.log('Height', Height, this.SwiperHeight)
				
				
				// let Height= this.detail.RecipesImages[index].ImageHeight / this.detail.RecipesImages[index].ImageWidth * this.SwiperWidth / 0.6
				// console.log('Height', Height, this.SwiperHeight)
				// this.SwiperHeight = Height < this.SwiperHeight? Height: this.SwiperHeight * 0.6
			},
			richHTML() {
				var self = this;
				this.detail.RecipesDetail = this.detail.RecipesDetail.replace(/\<img/g,
						'<img style="width:100%;height:auto;display:block"')
					.replace(/em;/g, 'rpx;')
					.replace(/<section/g, '<div').replace(/\/section>/g, '/div>');
			},
			close() {
				this.$refs.popup.close()
			},
			open() { //打开选择弹窗
				this.$refs.popup.open()
			},
			goDetail(GoodsCode) {
				uni.redirectTo({
					url: '/pagesA/proDetails/proDetails?id=' + GoodsCode
				})
			},
			// 触发重新加载购物车数量
			getCartNum() {
				this.$refs.cartIconfk.getCartNumAgain()
			},
			// 批量加入购物车
			async batch_addition() {
				let goods = this.detail.RecipesGoods
				let new_list = []
				goods.map((e) => {
					new_list.push({
						GoodsCode: e.GoodsCode,
						Quantity: e.Quantity
					})
				})
				let code = uni.getStorageSync('StoreCode')
				if (!code) code = ''
				let that = this,
					params = {
						"CartGoods": new_list,
						"SourceOrder": 1
					}
				let res = await that.$request(that.$API.CreateMultipleCustomerCart, params)
				console.log('res', res)
				if (res.Data) {
					uni.switchTab({
						url: "/pages/cart/cart"
					})
				}
			},
			// 单个加入购物车
			async createCustomerCart(id, index) {
				var that = this
				if(!that.$createCart(id)) {
					return
				}
				that.RecipesGoods[index].CurrentCartQuantity += 1
				that.getCartNum()
			},
			async getRecipesDetail(id) {
				let that = this,
					params = {
						"RecipesId": id,
						"CurrentPage": 1,
						"PageSize": 0,
						"StoreCode": uni.getStorageSync('StoreCode')
					}
				let res = await that.$request(that.$API.GetRecipesDetail, params)
				that.detail = res.Data
				res.Data.RecipesGoods.map(item => {
					item.selected = true
				})
				that.RecipesGoods = res.Data.RecipesGoods
				that.richHTML()
				that.compute()
				this.setSwiperHeight(0)
			},
			// 收藏或者取消收藏食谱
			collectCookery(id, IsCare) {
				let that = this
				if(!that.$stopAction()) {
					return
				}
				let	params = {
						"RecipesId": id
					}
				if (IsCare) {
					that.$request(that.$API.DeleteRecipes, {
						"RecipesId": [id]
					}).then(res => {
						that.detail.IsCare = !IsCare
						that.$Toast('取消关注成功')
						uni.setStorageSync('IsCare', !IsCare)
					})
					return
				}
				that.$request(that.$API.MycareRecipes, params).then(res => {
					that.detail.IsCare = !IsCare
					that.$Toast('关注成功')
					uni.setStorageSync('IsCare', !IsCare)
				})
			},
			// 选择商品加入清单
			selectItem(code, index) {
				let that = this
				let arr = []
				that.RecipesGoods.map((item, num) => {
					if (num === index) {
						item.selected = !item.selected
					}
					arr.push(item)
				})
				that.RecipesGoods = arr
				that.compute()
			},
			// 选择后将选中商品信息添加到cartGoods
			compute() {
				console.log('调用了')
				let that = this
				let arr = []
				that.RecipesGoods.map((item, num) => {
					if (item.selected) {
						arr.push({
							"GoodsCode": item.GoodsCode,
							"Quantity": 1
						})
					}
				})
				that.cartGoods = arr
				that.isNoSelected = arr.length < 1
			},
			// 确认批量添加购物车
			sureSubmit() {
				let that = this
				if (that.isNoSelected) {
					that.$Toast('请选择要加入的商品')
					return
				}
				let params = {
					"StoreCode": "",
					"Longi": uni.getStorageSync('longitude'),
					"Lati": uni.getStorageSync('latitude'),
					"CartGoods": that.cartGoods
				}
				that.$request(that.$API.CreateMultipleCustomerCart, params).then(res => {
					that.$Toast('添加成功')
					uni.switchTab({
						url: "/pages/cart/cart"
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main{
		height: 100%;
		overflow: hidden;
	}
	.content{
		padding-bottom: 30upx;
	}
	.userImg{
		padding-left: 84upx;
		padding-bottom: 20upx;
		height: 88upx;
		text-align: left;
		&>image{
			display: inline-block;
			vertical-align: middle;
			margin-right: 11upx;
			height: 68upx;
			width: 68upx;
			border-radius: 50%;
		}
		&>text{
			display: inline-block;
			vertical-align: middle;
			line-height: 88upx;
		}
	}
	.word_r {
		word-wrap: break-word;
		word-break: normal;
	}

	.break_all {
		//强制数字或字母不换行
		word-break: break-all;
	}

	.col-9c {
		color: #9c9c9c;
	}

	.bg-9c {
		background: #9c9c9c;
	}

	.cover-view {
		position: fixed;
		top: 0;
		bottom: 0;
		height: 100%;
		width: 100%;
		background: rgba($color: #000000, $alpha: 0.9);
	}

	.proImages {
		margin-bottom: 39upx;
	}

	.proImages .pro {
		display: block;
		width: 100%;
		margin: auto;
	}

	.header {
		position: relative;
		padding: 0 24upx;

		.oneTitle {
			width: 570upx;
			margin-bottom: 36upx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
			font-size: 40upx;
			
			font-weight: bold;
			color: rgba(51, 51, 51, 1);
			line-height: 50upx;
		}

		.collect-icon {
			position: absolute;
			right: 24upx;
			top: 5upx;

			.collectIcon {
				height: 44upx;
				width: 44upx;
			}

			.collect {
				background-image: url('../../static/collect.png');
				background-size: cover;
			}

			.collected {
				background-image: url('../../static/collected.png');
				background-size: cover;
			}
		}
	}

	/* descWrapper */
	.descWrapper {
		display: block;
		font-size: 0;
		width: 702upx;
		margin: auto;
		overflow: hidden;
		padding-bottom: 87upx;
	}

	.descWrapper .title {
		font-size: 32upx;
		
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		line-height: 90upx;
		border-bottom: 1upx solid #EFEEEE;
	}

	.descWrapper .stepList {
		font-size: 28upx;
		
		color: rgba(51, 51, 51, 1);
		line-height: 50upx;
		margin-bottom: 20upx;
	}

	.foodWrapper .label {
		font-size: 32upx;
		
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		line-height: 82upx;
		margin-bottom: 20upx;
	}

	.descWrapper .foodList .foodTitle {
		font-size: 24upx;
		
		color: rgba(51, 51, 51, 1);
		line-height: 82upx;
	}

	.goods {
		display: inline-block;
	}

	.foodList .foodNavWrapper .foodDesc {
		display: inline-block;
		padding: 24upx;
		height: 120upx;
		background: rgba(255, 255, 255, 1);
		border: 1upx solid rgba(239, 239, 239, 1);
		border-radius: 10upx;
		padding: 24upx;
		margin-right: 20upx;
	}

	.foodNavWrapper .foodDesc .foodIcon {
		display: inline-block;
		width: 120upx;
		height: 120upx;
		margin-right: 24upx;
		background-color: #f5f5f5;
	}

	.foodNavWrapper .foodDesc .desc {
		display: inline-block;
		vertical-align: top;
		width: 236upx;
	}

	.foodDesc .desc .curTitle {
		font-size: 28upx;
		line-height: 28upx;
		
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		margin-top: 11upx;
		margin-bottom: 22upx;
	}

	.foodDesc .desc .price {
		font-size: 0;
	}

	.foodDesc .desc .price .salePrice {
		display: inline-block;
		vertical-align: middle;
		font-size: 24upx;
		color: rgba(249, 90, 75, 1);
	}

	.big {
		font-size: 40upx;
	}

	.foodDesc .desc .price .nativePrice {
		display: inline-block;
		vertical-align: middle;
		font-size: 24upx;
		text-decoration: line-through;
		color: rgba(177, 177, 177, 1);
		margin-left: 23upx;
	}

	.foodNavWrapper .foodDesc .cart {
		position: relative;
		display: inline-block;
		vertical-align: top;
		margin-top: 60upx;
		transform: translateY(0upx);
		width: 48upx;
		height: 48upx;
		border-radius: 50%;

		&>image {
			height: 100%;
			width: 100%;
		}

	}

	// 展开食材的样式
	.goodList {
		.good-item {
			margin-bottom: 14upx;

			width: calc(50% - 6upx);
			border: 1px solid $color-f6;
			border-radius: 10upx;

			.good-img {
				height: 240upx;
				width: 100%;
				background-color: #f5f5f5;

				&>image {
					width: 100%;
					height: 100%;
				}
			}

			.good-info {
				padding: 7upx 24upx 31upx;

				.good-name {
					height: 80rpx;
				}

				.salePrice {
					// line-height: 30upx;
					margin-top: 15upx;
				}

				.nativePrice {
					line-height: 20upx;
				}

				.cart {
					height: 48upx;
					width: 48upx;

					&>image {
						height: 100%;
						width: 100%;
					}
				}
			}

		}
	}

	/* loadMoreWrapper */
	.loadMoreWrapper {
		width: 100%;
		height: 92upx;
		line-height: 92upx;
		text-align: center;
		font-size: 0;
	}

	.loadMoreWrapper .label {
		display: inline-block;
		vertical-align: middle;
		font-size: 28upx;
		
		color: rgba(102, 102, 102, 1);
	}

	.loadMoreWrapper .downIcon {
		display: inline-block;
		vertical-align: middle;
		width: 20upx;
		height: 12upx;
		margin-left: 11upx;
		transition: 500ms;
	}

	.rotate-180 {
		transform: rotate(180deg);
		transform-origin: center;
	}

	/* bottomView */
	.bottomView {
		width: 702upx;
		height: 87upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0upx -1upx 0upx 0upx rgba(240, 240, 240, 1);
		text-align: right;
		padding: 11upx 24upx 0;
		position: fixed;
		left: 0;
		bottom: 0;
	}

	.bottomView .addMenu {
		display: inline-block;
		width: 280upx;
		height: 76upx;
		line-height: 76upx;
		text-align: center;
		border-radius: 38upx;
		font-size: 32upx;
		
		color: rgba(255, 255, 255, 1);
	}

	.popup-main {
		padding: 50upx 30upx 16upx;
		max-height: 80%;
		background-color: #fff;
		border-radius: 20upx 20upx 0 0;

		.title {
			padding-bottom: 30upx;
			line-height: 34upx;
		}

		.food-main {
			max-height: 750upx;

			.food-item {
				line-height: 96upx;
				overflow: hidden;

				.food-name {
					&>text {
						margin-right: 27upx;
						display: inline-block;
						height: 16upx;
						width: 16upx;
						border-radius: 100%;
					}
				}
			}
		}

		.sure-btn {
			line-height: 92upx;
			border-radius: 46upx;
		}
	}

	.two_lines {
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.num-info {
		position: absolute;
		top: -12upx;
		right: -16upx;
		padding: 4upx 12upx;
		border-radius: 12upx;
		color: #fff;
		font-size: 20upx;
		line-height: 20upx;
		border: 2upx solid #fff;
	}

	.goods_v {
		border: 1rpx solid #EFEFEF;
		padding: 24rpx;
	}
	.floatCart{
		bottom: 130upx;
	}
	.indicator{
		position: absolute;
		bottom: 20upx;
		left: 0;
		right: 0;
		margin: 0 auto;
		text-align: center;
		.point{
			display: inline-block;
			height: 16upx;
			width: 16upx;
			margin: 0 10upx;
			border-radius: 8upx;
		}
	}
</style>
