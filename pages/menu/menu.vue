<template>
	<view class="content">
		<view class="headWrapper">
			<view class="seachWrapper" @click="goSearch">
				<view class="inputView">请输入</view>
				<image class="icon" src="../../static/reach.png" mode=""></image>
			</view>
			<!-- <image class="cart" src="../../static/cart_black.png" mode="" @click.stop="goCart"></image> -->
		</view>

		<view class="list_box">
			<view class="left">
				<scroll-view scroll-y="true" style="width: calc(100% + 20rpx);padding-right: 20rpx;" :style="'height:'+scrollHeight+'px;'" :scroll-top="leftTopHeight" scroll-with-animation="true">
					<view class="item" v-for="(item,index) in firstData" :key="index" :class="{ 'active':item.CategoriesCode== CategoriesCode }"
					 :data-index="index" @click="selectFirst(item.CategoriesCode, index)">
						{{item.CategoriesName}}
						<view class="before" :style="item.CategoriesCode== CategoriesCode?'background:'+themeColor: ''"></view>
					</view>
				</scroll-view>
			</view>
			<view class="main">
				
				<view class="pr w100 top_v b_f">
					<view class="w100 flexs flex-r flex-line flex-center" style="z-index: 4;padding-bottom: 20rpx;">
						<scroll-view scroll-x="true" class="sortlistWrapper " :scroll-into-view="topId" scroll-with-animation="true">
							<view class="sortWrapper_t" v-for="(item, index) in leftArray" :key="index" :id="'item-'+index"
							 :class="topIndex===index ? '':'no_select_bg'" :style="topIndex===index ?'color:'+themeColor+';background-color:'+rgbaColor:''"  @click="leftTap(index, item)">
								<view class="text">{{item.CategoriesName}}</view>
							</view>
						</scroll-view>
						
						<view class="flexs flex-center flex-line pr" style="width: 12%;" @click="open"  v-if="leftArray.length">						
							 <image class="arrow_menu" src="../../static/shadow.png"></image>
							 <view :class="'arrow_b ' + a_class"  :style="'margin-top:'+[traction ? '':'-']+'10rpx'"></view>
						</view>
					</view>
          <view style="overflow: hidden;">
						<scroll-view scroll-y="true"  v-if="up_down" class="w100 flexs flex-r flex-wrap  b_f" :class="traction ? 'traction_c':'traction_d'"
						 style="padding: 10rpx 0 20rpx 0; overflow: hidden;z-index: 3; max-height:300rpx;" >
							<view class="sortWrapper" v-for="(item, indexs) in leftArray" :key="indexs"
							:class="topIndex===indexs ? '':'no_select_bg'" :style="topIndex===indexs ?'color:'+themeColor+';background-color:'+rgbaColor:''"
							  @click="leftTap(indexs, item)">
								<view class="text">{{item.CategoriesName}}</view>
							</view>	
						</scroll-view>
					 </view>
				</view>
				
				<view :style="'height:'+h1+'px;'">
					<scroll-view v-if="GoodsList.length" :scroll-y="!up_down ? true:false"  style="height:100%;width: calc(100% + 20upx);" :scroll-top="topHeight"
					 class="pr" :data-v='dataset_v' @scrolltolower="lowerScroll" @scroll="menuScroll">
					 <!-- :scroll-into-view="code" -->
					  <view class="opacity_v w100 h100" v-if="up_down" style="z-index: 2;"> </view>
					 <!-- :id="item1_2.CategoriesCode" -->
					  <!-- <view class="scroll_v" v-for="(item1_2,index1_2) in leftArray" :key="index1_2"   > -->
						<view  v-for="(item2,index2) in GoodsList" :key="index2" class="item" style="z-index: 1;">
							<view class="goods" @click="goDetail(item2.GoodsCode)">
								<view class="iconWrapper p-re">
									<!-- <image class="proIcon" :src="item2.ImageUrl" mode="aspectFill"></image> -->
									<u-lazy-load class="proIcon" :image="item2.ImageUrl" mode="aspectFill"></u-lazy-load>
									<view v-if="item2.IsRecommendSales" class="recommendIcon">推荐</view>
									<view v-if="item2.IsExplosiveSales" class="baokuan">爆款</view>
									<view v-if="item2.Discount" class="discount">限时{{item2.Discount*10}}折</view>
									<view v-if="item2.StoreQuantity < 1" class="noStore">已抢光</view>
								</view>

								<view class="proList">
									<view class="statusWrapper line-1">	
											<view v-if="item2.GroupPrice > 0" class="status">团购中</view>
											<view class="proTitle  break_all two_lines" :style="item2.GroupPrice > 0 ? 'max-width: 220rpx;':'max-width:100%;'"
											>{{item2.GoodsName}} {{item2.WeightShort?item2.WeightShort: ''}}</view>
									</view>
									<view class="flexs flex-r flex2 line-1" style="padding: 10rpx 0 29rpx 0;">
										<view  class="num">{{item2.ProductPlace ? '产地:'+item2.ProductPlace :''}}</view>
										<view class="num">已售:{{item2.SalesQuantity}}</view>
									</view>
									<view class="flexs flex-r flex2 flex-line flex-wrap line-1">
										<view class=" flexs flex-r flex-line">
											<view class="word_r col-red"  style="max-width: 160upx;">
												￥<text class="big word_r" >{{splitPrice(item2)[0]}}.</text>
												<text style="font-size:28rpx;margin-right:21upx;">{{splitPrice(item2)[1]}}</text>
											</view>
											<view style="max-width: 100upx;" class="nativePrice word_r" 
											 v-if="item2.DiscountPrice>0 && item2.DiscountPrice<item2.MarketPrice">¥ {{toFixed(item2.MarketPrice)}}</view>
										</view> 
										
										<view class="cart pr">
											<view v-if="item2.CurrentCartQuantity> 0" class="num-info">{{item2.CurrentCartQuantity}}</view>
											<image src="../../static/cart.png" mode="" @click.stop="createCustomerCart(item2, $event)"></image>
										</view>
									</view>
									<view v-if="item2.MembershipPrice>0" class="flexs flex-r flex-line" style="margin-top: 10upx;">
											<view class="col-blue f-28">¥ {{toFixed(item2.MembershipPrice)}}</view>
											<view class="member-info col-f f-20 bg-blue">会员价</view>	
									</view>
								</view>
								
							</view>
						</view>
						<view class="p20 textcenter" v-if="GoodsList.length>0 && CurrentPage*10 >=PagData.length">
							没有更多数据了
						</view>
						<!-- </view> -->
					</scroll-view>
					<view v-else-if="loading" class="flexs flex-center flex-line" style="width: 100%;height: 100%;"></view>
					<view v-else class="blank"></view>
					
				</view>
				
			</view>
		</view>
		
		<cartIcon ref="cartIcon"></cartIcon>
		<fly-cart ref="inCart" :cartBasketRect="cartBasketRect"></fly-cart>
	</view>
</template>

<script>
	import {textToast,splitPrice, hexToRgba} from '@/common/utils.js'
	import cartIcon from "@/components/cartIcon.vue"
	import flyCarts from '@/mixin/flyCarts.js'
	
	export default {
		mixins: [flyCarts],
		components: {
			cartIcon
		},
		data() {
			return {
				loading:true,
				CategoriesCode: 'B51188D4-F927-47FF-B672-729AC6DE5FFA',         // 选中的一级分类code
				firstData: [],              // 一级分类列表
				isClickScroll: false,       // 是否是点击侧边栏触发商品区域滚动监听
				isGotTop: false,            // 是否获取每个元素的距离顶部偏移量
				scrollHeight: 0,
				leftArray: [],
				mainArray: [],
				topArr: [],                 // 所有商品的距离顶部的偏移量的数组
				topIndex: 0,
				scrollInto: '',
				headWrapperHeight: 0,
				sortlistWrapperHeight: 0,
				topHeight:0,
				leftTopHeight: 0,
				up_down:false,
				traction:false,
				h1:0,
				topId:'',
				code:'',
				dataset_v:0,
				clickTime: 0,              // 点击底部tab次数
				a_class:'',
				splitPrice:splitPrice,
				toFixed:this.helper.toFixed,
				bottomDefault: 32,
				rightDefault: 10,          // 购物车默认偏移量
				bottom: 32,
				right: 10,                 // 购物车图标偏移量
				GoodsList:[],
				PagData:[],
				CurrentPage:1,
				themeColor: this.$store.state.themeColor
			}
		},
		computed: {
			token: function() {
				return this.$store.state.token
			},
			rgbaColor: function() {
				return hexToRgba(this.themeColor, 0.3)
			}
		},
		onLoad() {
			this.getFirstLevel()
		},
		onShow() {
			this.bottom= 32
			this.right= 10
			this.$setNavigatorBg()
			let CategoriesCode= uni.getStorageSync('CategoriesCode')
			// 判断是否是从首页跳入
			if(CategoriesCode) {
				this.CategoriesCode= CategoriesCode
				this.firstData.forEach((item, index) => {
					if(item.CategoriesCode === CategoriesCode) {
						this.selectFirst(CategoriesCode, index)
					}
				})
				uni.removeStorageSync('CategoriesCode')
			}
			this.getStoreGoods()
		},
		async onReady() {
			let _this = this
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
			}
			let h1=await this.helper.getNodeInfo('.list_box',0,'height')
			this.scrollHeight=h1
			console.log('h1',h1)
			let h2=await this.helper.getNodeInfo('.top_v',0,'height')
			console.log('h2',h2)
			this.h1=h1-h2
		},
		onPullDownRefresh() {
			this.$refresh()
			this.selectFirst(this.CategoriesCode)
			this.getFirstLevel()
			this.getStoreGoods()
		},
		// 双击tab刷新
		onTabItemTap(e) {
			this.clickTime += 1
			if(this.clickTime > 1) {
				this.$refresh()
				this.getFirstLevel()
				this.getStoreGoods()
			}
			setTimeout(function () {
				this.clickTime= 0
			}.bind(this), 1000)
		},
		methods: {
			open(){
				let _p=this
				this.traction=!this.traction
				if(this.traction){
					this.a_class='box_up'
				}else{
					this.a_class='box_down'
				}
				if(this.traction){
				 _p.up_down=true
				}else{
					setTimeout(function(){
						_p.up_down=!_p.up_down
					},500)
				}
			},
			scroll_v(e){
				// if(this.topHeight===-1)return
				
			},
			// 加入购物车
			createCustomerCart(item, e) {
				let that= this
				// 防止快速点击
				if(!that.$stopAction()) {
					return
				}
				if(!that.$createCart(item.GoodsCode)) {
					return
				}
				item.CurrentCartQuantity += 1
				this.$store.commit('buy', {goods: item, count: item.CurrentCartQuantity})
				this.add(e, item.GoodsCode)
			},
			goSearch: function(){
				uni.navigateTo({
					url:'/pagesA/search/search'
				})
			},
			//获取一级分类
			getFirstLevel(status){
				let that= this
				that.$request(that.$API.GetGoodsFirstCategories).then(res => {
					that.firstData = res.Data
				})
			},
			// 选择一级分类
			selectFirst(CategoriesCode, index) {
				this.a_class=''
				if(index > 4) {
					this.leftTopHeight= (index - 4) * 90
				} else {
					this.leftTopHeight= 0
				}
				this.dataset_v=0
				this.topHeight=this.topHeight+0.001
				this.CategoriesCode= CategoriesCode
				this.getStoreGoods('selectFirst')
				this.traction=false
				this.up_down=false
				this.topIndex = 0
				this.topId='item-'+0
				this.code=CategoriesCode
			},
			
			// 获取二级列表数据
			getStoreGoods(isSelectFirst) {
				this.loading=true
				this.CurrentPage=1
				if(isSelectFirst) {
					uni.showLoading({
						title: '加载中..',
						mask: true
					})
				}
				let that= this,
					params= {
						"CategoriesCode": that.CategoriesCode,
						"StoreCode": uni.getStorageSync('StoreCode'),
						"Longi": uni.getStorageSync('longitude'),
						"Lati": uni.getStorageSync('latitude'),
						"SourceOrder": 1
					}
					
				that.$request(that.$API.GetStoreGoods, params).then(res => {
					this.leftArray= isSelectFirst? []: this.leftArray
					if(res.Data.length>0){
						let new_list=[]
						res.Data.forEach((e)=>{
							// new_list=[...new_list,...e.Goods]
							e.Goods.forEach((obj) => {
								new_list.push(obj)
							})
						})
						console.log('new_list', new_list)
						let all=[{'CategoriesCode':'',
							 'CategoriesName': '全部','Goods':new_list}]
						// that.leftArray=[...all,...res.Data] 
						that.leftArray= all.concat(res.Data) 
						if(new_list.length>10){
							that.PagData=new_list
							that.GoodsList=this.pagination(this.CurrentPage,10,new_list) 
						}else{
							that.PagData=new_list
							that.GoodsList=new_list
						}
						console.log('PagData',that.PagData)
						this.loading=false
						// setTimeout(function(){
						// 	that.getHeightList();	
						// },300)		
					}
					uni.hideLoading()
				})
			},
			
			pagination(pageNo, pageSize, array) {
				let offset = (pageNo - 1) * pageSize;
				// console.log('offset',offset)
				// console.log('截取的数组',offset + pageSize >= array.length, array.slice(offset, array.length) ,array.slice(offset, offset + pageSize))
				return (offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize);
			},
			menuScroll() {
				this.$refs.cartIcon.isScroll()
			},
			lowerScroll(){
				if(this.CurrentPage*10 >= this.PagData.length)return
				uni.showLoading({
					title:'加载中...'
				})
				this.CurrentPage++
				let new_list=this.pagination(this.CurrentPage,10,this.PagData)
				this.GoodsList=this.GoodsList.concat(new_list)
				uni.hideLoading();
			},
			/* 左侧导航点击 */
			leftTap(index, item) {
				this.topHeight=this.topHeight+0.001
				this.CurrentPage=1
				//this.GoodsList=that.leftArray[index]
				console.log('item',item)
				let new_list=item.Goods
				if(new_list.length>10){
					this.PagData=new_list
					this.GoodsList=this.pagination(this.CurrentPage,10,new_list) 
					//console.log('数据大于10',this.GoodsList)
				}else{
					this.PagData=new_list
					this.GoodsList=new_list
					//console.log('数据小于10',this.GoodsList)
				} 
				this.a_class='box_down'
				this.dataset_v=0
				this.traction=false
				this.up_down=false			
				this.topIndex = index
				this.topId='item-'+index
				this.code=item.CategoriesCode
			},
			goCart() {
				uni.switchTab({
					url: '/pages/cart/cart'
				})
			},
			// 去商品详情
			goDetail(GoodsCode) {
				uni.navigateTo({
					url:'/pagesA/proDetails/proDetails?id=' + GoodsCode
				})
			},
			/* 主区域滚动监听 */
			mainScroll(e) {
				//console.log(e)
				if(e.currentTarget.dataset.v>=0){
					this.dataset_v = e.currentTarget.dataset.v+1
				}
				
				let _this = this
				if (this.timeoutId) {
					clearTimeout(this.timeoutId);
				}
				this.timeoutId = setTimeout(function() { //节流
					let top = e.detail.scrollTop
					//console.log('scrollTop', e.detail.scrollTop)
					let id
					/* 查找当前滚动距离 */
					for (let i = _this.topArr.length - 1; i >= 0; i--) {
						//console.log('top',_this.topArr[i])
						/* 在部分安卓设备上，因手机逻辑分辨率与upx单位计算不是整数，滚动距离与有误差，增加2px来完善该问题 */
						if (top >= _this.topArr[i]-80) {
							id = i 
							//console.log(i,id)
							break;
						}
					}
					if(e.currentTarget.dataset.v>1){
						//console.log('进来了')
						_this.topIndex = id
						_this.topId='item-'+id
						//console.log('id', _this.topIndex)
					}
					_this.timeoutId = undefined;
				}, 100)
			},
			getHeightList() {
				let _this = this;
				let h1 = 0
				let selectorQuery = uni.createSelectorQuery();
				selectorQuery.selectAll('.top_v').boundingClientRect(function(rects) {
					//console.log("top_v", rects)
					h1 = rects[0].height
				})
				selectorQuery.selectAll('.scroll_v').boundingClientRect(function(rects) {
					let arr = [];
					let top = 0;
					//console.log("scroll_v", rects)
					rects.forEach(function(rect) {
						let top = rect.top - h1
						arr.push(top)
					})
					//console.log('arr',arr)
					_this.topArr = arr
				}).exec()
				uni.hideLoading();
			},
		}
	}
</script>

<style lang="scss" scoped>
	.opacity_v{
		position: fixed;
	}
	.arrow_b{
		width: 24upx;
		height: 24upx;
	}
	.select_bg{
		background-color: #FFF3F3;
	}
	.no_select_bg{
		background-color: #F3F3F3;
	}
	.up{
		
	}
	.top_v{
		height: 80upx;
		z-index: 1000;
	}
	.content{
		height: 100%;
		width: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.arrow_menu{
		width: 42upx;
		height: 98upx;	
		z-index: 2;
		position: absolute;
		left: -12upx;
	}
	.headWrapper {
		width: 100%;
		height: 60upx;
		padding: 20upx;
	}

	.headWrapper .seachWrapper {
		display: inline-block;
		vertical-align: middle;
		width: 702upx;
		height: 60upx;
		box-sizing: border-box;
		background: rgba(246, 246, 246, 1);
		border-radius: 30upx;
		padding-left: 68upx;
		position: relative;
	}

	.headWrapper .seachWrapper .inputView {
		width: 570upx;
		height: 60upx;
		font-size: 28upx;
		color: #D8D8D8;
		line-height: 60upx;
	}

	.headWrapper .seachWrapper .icon {
		display: block;
		width: 32upx;
		height: 32upx;
		position: absolute;
		left: 24upx;
		top: 50%;
		margin-top: -16upx;
	}

	.headWrapper .cart {
		display: inline-block;
		vertical-align: middle;
		width: 40upx;
		height: 40upx;
		margin-left: 24upx;
	}

	/* sortlistWrapper */
	.sortlistWrapper {
		// width: 702upx;
		width: 88%;
		font-size: 0;	
		white-space: nowrap;
	}
    .sortWrapper_t{
		display: inline-block;
		vertical-align: top;
		width: 168upx;
		padding: 12upx 0;
		margin-right: 11upx;
		// background-color: #F3F3F3;
		border-radius: 8upx;
		z-index: 1;
	}
	.sortWrapper {
		display: inline-block;
		vertical-align: top;
		width: 168upx;
		padding: 15upx 0;
		margin: 0 11upx 10upx 0;
		// background-color: #F3F3F3;
		border-radius: 8upx;
	}

	.sortWrapper:nth-last-child(1),.sortWrapper_t:nth-last-child(1){
		margin-right: 0;
	}

	.sortWrapper .icon,.sortWrapper_t .icon {
		width: 96upx;
		height: 96upx;
		background-color: #FFFFFF;
		border-radius: 50%;
		margin-bottom: 23upx;
	}
    .sortWrapper{
		color: #333333;
	}
	.sortWrapper .text,.sortWrapper_t .text {
		font-size: 24upx;
		
		text-align: center;

	}


	.list_box {
		display: flex;
		flex: 1;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: flex-start;
		align-content: flex-start;
		font-size: 28upx;
		// padding-top: 10px;
		overflow: hidden;
		.left {
			width: 180upx;
			background-color: #f6f6f6;
			line-height: 110upx;
			box-sizing: border-box;
			font-size: 28upx;
			color: #2E2D2D;
			height: 100%;
			overflow: hidden;
			.item {
				text-align: center;
				position: relative;
				padding-right: 20upx;
				&:not(:first-child) {
					margin-top: 1px;

					&::after {
						content: '';
						display: block;
						height: 0;
						width: 620upx;
						position: absolute;
						top: -1px;
						right: 0;
						// transform:scaleY(0.5);	/* 1px像素 */
					}
				}

				&.active {
					font-size: 32upx;
					font-weight: bold;
					background-color: #fff;
					position: relative;
					
				}
				.before {
					z-index: 10;
					display: block;
					content: '';
					width: 8upx;
					height: 30upx;
					position: absolute;
					left: 0;
					top: 50%;
					margin-top: -15upx;
				}	
			}
		}

		.main {
			background-color: #fff;
			padding-left: 20upx;
			width: 0;
			flex-grow: 1;
			box-sizing: border-box;
			height: 100%;
			// overflow: hidden;
			.title {
				line-height: 64upx;
				font-size: 24upx;
				font-weight: bold;
				color: #666;
				background-color: #fff;
				position: sticky;
				top: 0;
				z-index: 19;
			}
			.item {
				// border-bottom: #eee solid 1px;
				padding-right: 20upx;
			}

			.goods {
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				justify-content: flex-start;
				align-content: center;
				margin-bottom: 10upx;
				padding-top: 35upx;

				.iconWrapper {
					display: inline-block;
					vertical-align: middle;
					width: 166upx;
					height: 166upx;
					margin-right: 24upx;
					position: relative;
					.baokuan{
						position: absolute;
						right: 0;
						bottom: -19upx;
						width:72upx;
						text-align: center;
						color: #fff;
						font-size: 24upx;
						line-height: 38upx;
						background:linear-gradient(90deg,rgba(219,62,239,1),rgba(164,61,236,1));
						border-radius:0upx 19upx 19upx 19upx;
						animation: animate 2s ease infinite;
					}
					.proIcon {
						display: block;
						width: 166upx;
						height: 166upx;
						background-color: #FFFFFF;
					}
					.recommendIcon {
						position: absolute;
						left: 0;
						top: -19upx;
						padding: 0 12upx;
						text-align: center;
						color: #fff;
						font-size: 24upx;
						line-height: 38upx;
						background:linear-gradient(90deg,rgba(249,90,75,1),rgba(250,123,111,1));
						border-radius:19upx 19upx 0 19upx;
						animation: animate 2s ease infinite;
					}
					.discount{
						position: absolute;
						left: 0;
						bottom: 0;
						transform: rotate(-12deg);
					}
					.noStore{
						position: absolute;
						bottom: 0;
						left: 0;
						width: 166upx;
						height: 44upx;
						line-height: 44upx;
						text-align: center;
						color: #fff;
						font-size: 28upx;
						background-color: rgba($color: #000000, $alpha: 0.4);
						border-radius: 0 0 12upx 12upx;
					}
				}

				.proList {
					display: inline-block;
					vertical-align: middle;
					width: 339upx;
					border-bottom: 1upx solid #EAEAEA;
					padding-right: 24upx;
					padding-bottom: 35upx;

					.statusWrapper {
						font-size: 0;
						line-height: 1.3;
						.status {
							display: inline-block;
							width: 96upx;
							height: 38upx;
							vertical-align: top;
							line-height: 38upx;
							text-align: center;
							background: rgba(253, 205, 201, 1);
							border-radius: 19upx;
							font-size: 24upx;
							
							font-weight: bold;
							color: $color-red;
							margin-right: 13upx;
							animation: animate 2s ease infinite;
						}
						.proTitle {
							display: inline-block;
							vertical-align: top;
							font-size: 28upx;
							
							font-weight: bold;
							color: rgba(51, 51, 51, 1);
						}
					}
					.num {  
						color: #9C9C9C;
						font-size: 24upx;
					}
					.nativePrice {
						font-size: 24upx;
						text-decoration: line-through;
						color: rgba(177, 177, 177, 1);
						margin-top: 6upx;
					}
					
					.cart {
						float: right;
						width: 48upx;
						height: 48upx;
						&>image{
							width: 48upx;
							height: 48upx;
						}
					}
					.big {
						font-size: 40upx;
						color: $color-red;
						
						// padding-left: 12upx;
						// padding-right: 21upx;
					}
					.member-info {
						margin-left: 10upx;
						padding: 2upx 7upx;
						line-height: 20upx;
						border-radius: 4upx;
					}
					.proNum {
						font-size: 0;
						margin-top: 12upx;
						margin-bottom: 23upx;
						.production {
							display: inline-block;
							vertical-align: middle;
							width: 50%;
							text-align: right;
							font-size: 24upx;
							color: rgba(156, 156, 156, 1);
						}
					}

					.priceWrapper {
						position: relative;
						line-height: 1;
						text {
							line-height: 1;
						}
						.priceList {
							position: relative;
							font-size: 24upx;
							color: rgba(249, 90, 75, 1);
							line-height: 48upx;
							&>view{
								display: inline-block;
							}
							

							.saleNum {
								font-size: 20upx;
								color: rgba(249, 90, 75, 1);
							}

							
						}
					}
				}
			}
		}
	}
	.traction_c {
	     -webkit-animation-name: traction;
	    /*动画名称*/
	     -webkit-animation-duration: 0.5s;
	    /*动画持续时间*/
	     -webkit-animation-iteration-count:1;
	    /*动画次数*/
	     -webkit-animation-delay: 0s;
	    /*延迟时间*/
	     animation-timing-function:ease-out;
		   /* 动画速度*/
	    animation-fill-mode:forwards;
	    /*动画停留在最后一帧*/
	}
	@-webkit-keyframes traction{
	
	     0% {
	       transform:translateY(-300px);
	       -webkit-transform: translateY(-300px);
	       -moz-transform: translateY(-300px);
	       -o-transform: translateY(-300px);
	       -ms-transform: translateY(-300px); 
	      
	    }
	    
	     100% {
			 transform:translateY(0);
			 -webkit-transform: translateY(0);
			 -moz-transform: translateY(0);
			 -o-transform: translateY(0);
			 -ms-transform: translateY(0);
	    }
	}
	.traction_d {
	     -webkit-animation-name: traction_d;
	    /*动画名称*/
	     -webkit-animation-duration: 0.5s;
	    /*动画持续时间*/
	     -webkit-animation-iteration-count:1;
	    /*动画次数*/
	     -webkit-animation-delay: 0s;
	    /*延迟时间*/
	     animation-timing-function:ease-in-out;
		   /* 动画速度*/
	    animation-fill-mode:forwards;
	    /*动画停留在最后一帧*/
	}
	@-webkit-keyframes traction_d{
	
	     0% {
	      transform:translateY(0);
	      -webkit-transform: translateY(0);
	      -moz-transform: translateY(0);
	      -o-transform: translateY(0);
	      -ms-transform: translateY(0);
	    }
	    
	     100% {
	         transform:translateY(-300px);
	         -webkit-transform: translateY(-300px);
	         -moz-transform: translateY(-300px);
	         -o-transform: translateY(-300px);
	         -ms-transform: translateY(-300px);		 
	    }
	}
	// 动画
	@keyframes animate{
		25%{transform: scale(0.9);opacity: 0.5;}
		50%{transform: scale(0.8);opacity: 0.1;}
		75%{transform: scale(1.1);opacity: 0.5;}
		100%{transform: scale(1.0);opacity: 1;}
	}
	@-webkit-keyframes rotate_up{
	
	     0% {
	            transform: rotate(45deg);
	          -webkit-transform: rotate(45deg);
	          -moz-transform: rotate(45deg);
	          -o-transform: rotate(45deg);
	          -ms-transform: rotate(45deg);
	        /*初始状态 透明度为0*/
	    }
	    
	     100% {
	            transform: rotate(225deg);
	          -webkit-transform: rotate(225deg);
	          -moz-transform: rotate(225deg);
	          -o-transform: rotate(225deg);
	          -ms-transform: rotate(225deg);
	        /*结尾状态 透明度为1*/
	    }
	}
	@-webkit-keyframes rotate_down{
	
	     0% {
	         transform: rotate(225deg);
	         -webkit-transform: rotate(225deg);
	         -moz-transform: rotate(225deg);
	         -o-transform: rotate(225deg);
	         -ms-transform: rotate(225deg);  
	        /*初始状态 透明度为0*/
	    }
	    
	     100% {
	           
			  transform: rotate(45deg);
			  -webkit-transform: rotate(45deg);
			  -moz-transform: rotate(45deg);
			  -o-transform: rotate(45deg);
			  -ms-transform: rotate(45deg);
	        /*结尾状态 透明度为1*/
	    }
	}
	 .box_down {
	     -webkit-animation-name: rotate_down;
	    /*动画名称*/
	     -webkit-animation-duration: 0.5s;
	    /*动画持续时间*/
	     -webkit-animation-iteration-count:1;
	    /*动画次数*/
	     -webkit-animation-delay: 0s;
	    /*延迟时间*/
	     animation-timing-function:linear;
		   /* 动画速度*/
	    animation-fill-mode:forwards;
	    /*动画停留在最后一帧*/
	}
	.box_up {
	     -webkit-animation-name: rotate_up;
	    /*动画名称*/
	     -webkit-animation-duration: 0.5s;
	    /*动画持续时间*/
	     -webkit-animation-iteration-count:1;
	    /*动画次数*/
	     -webkit-animation-delay: 0s;
	    /*延迟时间*/
	     animation-timing-function:linear;
		   /* 动画速度*/
	    animation-fill-mode:forwards;
	    /*动画停留在最后一帧*/
	}
	@import '../../common/k_common.scss';
</style>
<style>
	page{
		height: 100%;
		width: 100%;
	}
</style>
