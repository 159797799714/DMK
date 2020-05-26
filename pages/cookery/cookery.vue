<template>
	<view class="content">
		<view class="headWrapper" :class="{'isHidden': isHidden}">
			<view class="seachWrapper p-re">
				<input class="inputView" type="text" v-model="searchValue" placeholder="搜索" placeholder-style="color: #d8d8d8; fontSize: 28upx;" @confirm="searchAction"/>
				<image class="icon" src="../../static/reach.png" mode="" @click="searchAction"></image>
				<image v-if="searchValue" src="../../static/circleClose.png" class="delIcon" mode="" @click="delSearchInfo"></image>
			</view>
		</view>
		<view class="conWrapper">
			<view  v-for="(item, index) in leftArr" :key="index" class="listBox" @click="goDetail(item.RecipesId, item.CreateImageUrl,  item.IsCare, index, 'left')">
				<view class="cookery-img">
					<image v-if="item.ImageUrl && AllList !== null" :src="item.ImageUrl" mode="widthFix"></image>
				</view>
				<view class="desc">{{item.RecipesName }}</view>
				<view class="totalWrapper">
					<view class="userWrapper">
						<image class="userIcon" src="../../static/userIcon.png"  mode=""></image>
						<view class="userName">{{item.CreateName}}</view>
					</view>
					<view class="praiseWrapper" @click.stop="collectCookery(item.RecipesId, item.IsCare, index, 'left')">
						<view class="zanIcon" :class="item.IsCare?'collected': 'collect'"></view>
						<view class="numText">{{item.CareQuantity}}</view>
					</view>
				</view>
			</view>
			
			<view  v-for="(item, index) in rightArr" :key="index" class="listBox" @click="goDetail(item.RecipesId, item.CreateImageUrl, item.IsCare, index, 'right')">
				<view class="cookery-img">
					<image v-if="item.ImageUrl && AllList !== null" :src="item.ImageUrl" lazy-load="true" mode="aspectFill"></image>
				</view>
				<view class="desc">{{item.RecipesName }}</view>
				<view class="totalWrapper">
					<view class="userWrapper">
						<image class="userIcon" src="../../static/userIcon.png"  mode=""></image>
						<view class="userName">{{item.CreateName}}</view>
					</view>
					<view class="praiseWrapper" @click.stop="collectCookery(item.RecipesId, item.IsCare, index, 'right')">
						<view class="zanIcon" :class="item.IsCare?'collected': 'collect'"></view>
						<view class="numText">{{item.CareQuantity}}</view>
					</view>
				</view>
			</view>
			
		</view>
		<view v-if="AllList.length < 1 && AllList !== null" class="blank"></view>
		
		<view v-if="CurrentPage >= TotalPage && TotalPage !== 0" class="noMore t-center col-66 f-24">亲！只有这么多了哦！</view>
		
		<cartIcon ref="cartIcon"></cartIcon>
	</view>
</template>

<script>
	import {textToast} from '@/common/utils.js'
	import cartIcon from "@/components/cartIcon.vue"
	export default {
		components: {
			cartIcon
		},
		data() {
			return {
				searchValue: '',
				CurrentPage: 1,
				TotalPage: 0,
				AllList: null,
				leftArr: [],
				rightArr: [],
				topHeight: 0,
				isHidden: false,
				clickTime: 0,         // 点击底部tab次数
				cartNum: 0,
				bottomDefault: 32,
				rightDefault: 10,          // 购物车默认偏移量
				bottom: 32,
				right: 10,                 // 购物车图标偏移量
				itemDirection: '',         // 点击的是左边还是右边的，left或者right
				itemIndex: '',             // 点击跳转进详情的索引
				itemIsCare: '',            // 点击跳转进详情的收藏状态
			}
		},
		computed: {
			token: function() {
				return this.$store.state.token
			}
		},
		onLoad() {
			this.GetRecipes('refresh')
			uni.removeStorageSync('IsCare')
			console.log('onLoad', this.itemIndex, this.itemIsCare)
		},
		async onShow() {
			this.bottom= 32
			this.right= 10
			this.$setNavigatorBg()
			let IsCare= uni.getStorageSync('IsCare')
			console.log('IsCare',IsCare)
			if(IsCare !== '') {
				this.setCollectStatus(IsCare)
				uni.removeStorageSync('IsCare')	
			}
		},
		onPageScroll() {
			this.$refs.cartIcon.isScroll()
		},
		// 双击tab刷新
		onTabItemTap(e) {
			this.clickTime += 1
			if(this.clickTime > 1) {
				this.requestAgain()
			}
			setTimeout(function () {
				this.clickTime= 0
			}.bind(this), 1000)
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.requestAgain()
		},
		onReachBottom() {
			this.loadMore()
		},
		onHide() {
			console.log('onHide执行了')
			uni.removeStorageSync('IsCare')
		},
		methods: {
			// 判断收藏状态是否发生改变
			setCollectStatus(IsCare) {
				console.log('index', this.itemIndex, 'IsCare', IsCare, '方向', this.itemDirection)
				let item= ''
				if(this.itemDirection === 'left') {
					item= this.leftArr[this.itemIndex]
					item.IsCare= IsCare
					item.CareQuantity= IsCare?item.CareQuantity + 1: item.CareQuantity - 1
					this.leftArr.splice(this.itemIndex, 1, item)
				} else {
					item= this.rightArr[this.itemIndex]
					item.IsCare= IsCare
					item.CareQuantity= IsCare?item.CareQuantity + 1: item.CareQuantity - 1
					this.rightArr.splice(this.itemIndex, 1, item)
				}
			},
			requestAgain() {
				this.$refresh()
				this.searchValue= ''
				this.CurrentPage= 1
				this.$refs.cartIcon.updateBottom()
				this.GetRecipes('refresh')
			},
			searchAction() {
				this.searchRecipes()
			},
			// 删除关键字
			delSearchInfo() {
				this.searchValue= ''
				this.CurrentPage= 1
				this.GetRecipes('refresh')
			},
			async searchRecipes(loadMore) {
				console.log('loadMore', loadMore)
				if(!this.searchValue) {
					this.delSearchInfo()
					return
				}
				let that= this,
					params= {
						"SearchText": that.searchValue,
						"CurrentPage": that.CurrentPage,
						"PageSize": 0
					},
					res= await that.$request(that.$API.QueryRecipes, params)
					that.TotalPage= res.Data.TotalPage
					that.filterArray(res.Data.Datas, !loadMore)
					
					that.AllList= loadMore ? that.AllList.concat(res.Data.Datas): res.Data.Datas
			},
			
			filterArray(list, refresh) {
				let left= list.filter((_item, index) => index % 2 === 0),
					right = list.filter((_item, index) => index % 2 !== 0);
				this.leftArr= refresh? left: this.leftArr.concat(left)
				this.rightArr= refresh? right: this.rightArr.concat(right)
			},
			goDetail(id, imgUrl, IsCare, index, itemDirection) {
				this.itemIndex= index
				this.itemIsCare= IsCare
				this.itemDirection= itemDirection
				imgUrl= imgUrl?imgUrl: ''
				uni.navigateTo({
					url: '/pagesA/cookeryDetails/cookeryDetails?id=' + id +'&CreateImageUrl=' + imgUrl
				})
			},
			
			// 获取食谱列表
			GetRecipes(refresh) {
				let that= this,
					params= {
						"CurrentPage": that.CurrentPage,
						"PageSize": 0
					}
				that.$request(that.$API.GetRecipes, params).then(res => {
					if(refresh) {
						this.AllList= []
					}
					that.TotalPage= res.Data.TotalPage
					that.filterArray(res.Data.Datas, refresh)
					that.AllList= refresh ? res.Data.Datas: that.AllList.concat(res.Data.Datas)
					return
				})
			},
			loadMore() {
				let that= this
				console.log(that.CurrentPage, that.TotalPage)
				if(that.CurrentPage < that.TotalPage) {
					if(!that.searchValue) {
						that.CurrentPage += 1
						that.GetRecipes()
						return
					}
					that.searchRecipes(true)
				}
			},
			goCart() {
				uni.switchTab({
					url: '/pages/cart/cart'
				})
			},
			// 收藏或者取消收藏食谱
			collectCookery(id, IsCare, index, info) {
				var that= this,
					params= {
						"RecipesId": id,
						"SourceOrder": 1
					}
				if(IsCare) {
					that.$request(that.$API.DeleteRecipes, {
						"RecipesId": [id]
					}).then(res => {
						that.$Toast('取消关注成功')
						switch(info) {
							case 'left':
								that.leftArr[index].IsCare = !IsCare
								that.leftArr[index].CareQuantity -= 1
								break
							case 'right':
								that.rightArr[index].IsCare = !IsCare
								that.rightArr[index].CareQuantity -= 1
								break
						}
					})
					return
				}
				that.$request(that.$API.MycareRecipes, params).then(res => {
					that.$Toast('关注成功')
					switch(info) {
						case 'left':
							that.leftArr[index].IsCare = !IsCare
							that.leftArr[index].CareQuantity += 1
							break
						case 'right':
							that.rightArr[index].IsCare = !IsCare
							that.rightArr[index].CareQuantity += 1
							break
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.headWrapper {
		position: fixed;
		width: 100%;
		height: 60upx;
		top: 0;
		left: 0;
		padding: 20upx 24upx;
		background: #fff;
		transition: 300ms;
	}
	.isHidden{
		top: -100upx;
	}
	.headWrapper .seachWrapper {
		display: inline-block;
		vertical-align: middle;
		width:702upx;
		box-sizing: border-box;
		height:60upx;
		background:rgba(246,246,246,1);
		border-radius:30upx;
		padding-left: 68upx;
		position: relative;
		.delIcon{
			z-index: 10;
			position: absolute;
			top: 10upx;
			right: 30upx;
			height: 40upx;
			width: 40upx;
			border-radius: 50%;
			background-color: #ccc;
		}
	}
	.headWrapper .seachWrapper .inputView {
		display: block;
		width: 550upx;
		height: 60upx;
		font-size:28upx;
		color: #333;
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
	
	/* conWrapper */
	.conWrapper {
		width: 702upx;
		padding: 80upx 0 40upx;
		margin: 0 auto;
		font-size: 0;
		column-count: 2;
		column-width: 344upx;
		column-gap: 14upx;		
		-webkit-column-width: 344upx;
		-webkit-column-count:2;
		-webkit-column-gap: 14upx;
	}
	.listBox {
		padding: 0;
		width: 344upx;
		/* 防止多列布局，分页媒体和多区域上下文中的意外中断 */
		break-inside: avoid;
		-webkit-break-inside: avoid;
		overflow: hidden;
		margin-bottom: 40upx;
	}
	.listBox .cookery-img{
		width: 344upx;
		height: 482upx;
		border-radius:8upx 8upx 0px 0px;
		background-color: #ccc;
		overflow: hidden;
		&>image{
			width: 100%;
			height: 100%;
			margin: 0;
			padding: 0;
		}
	}
	.listBox .desc {
		padding: 20upx 10upx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		font-size:32upx;
		font-weight:bold;
		color:rgba(51,51,51,1);
		line-height:46upx;
	}
	.listBox .totalWrapper {
		padding: 0 10upx;
		display: flex;
		line-height: 40upx;
	}
	.listBox .totalWrapper .userWrapper {
		flex: 1;
	}
	.totalWrapper .userWrapper .userIcon{
		display: inline-block;
		vertical-align: middle;
		width: 48upx;
		height: 48upx;
		margin-right: 9upx;
		border-radius: 50%;
	}
	.collect{
		background-image: url('../../static/collect.png');
		background-size: cover;
	}
	.collected{
		background-image: url('../../static/collected.png');
		background-size: cover;
	}
	.totalWrapper .userWrapper .userName {
		display: inline-block;
		vertical-align: middle;
		font-size:28upx;
		color:rgba(93,93,93,1);
	}
	.listBox .totalWrapper .praiseWrapper {
		flex: 1;
		text-align: right;
	}
	.totalWrapper .praiseWrapper .zanIcon {
		display: inline-block;
		vertical-align: middle;
		width: 30upx;
		height: 30upx;
		margin-right: 8upx;
	}
	.totalWrapper .praiseWrapper .numText {
		display: inline-block;
		vertical-align: middle;
		font-size:28upx;
		color:rgba(93,93,93,1);
	}
</style>
