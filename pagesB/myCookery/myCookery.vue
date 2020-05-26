<template>
	<view class="flexs flex-v conWrapper">
		<view class="contentList_v" v-if="AllList.length">
			<view class="flexs flex-r flex-end" @click="edit=!edit" :style="'padding: 20rpx 40rpx; background-color:#fff;color:'+[edit ? themeColor:'#333333']+';'">
				{{edit ? '完成':'编辑'}}
			</view>

			<view class="flexs flex-r goods_v" v-for="(item,i) in AllList" :key="i" style="position: relative;" @click="jump_cookery(item.RecipesId)">
				<view class="flexs flex-line" v-if="edit">
					<view class="radio">
						<label class="radio" @click.stop="slectCookery(item)">
							<radio color="#FF303B" :value="item.radio" :checked="item.radio" />
						</label>
					</view>
				</view>
				<view class="goods_v_left">
					<image v-show="item.ImageUrl" :src="item.ImageUrl" mode=""></image>
				</view>
				<view class="goods_v_right flexs flex-v flex2">

					<view class="top_v">
						<text class="top_txet two_lines">{{item.RecipesName}}</text>
					</view>
					<view class="flexs flex-r flex2">
						<view class="flexs flex-r flex-line">
							<image class="userIcon" :src="item.CustomerImages ? item.CustomerImages: '../../static/userIcon.png'" mode=""></image>
							<text class="userName">{{item.CreateName}}</text>
						</view>

						<view class="praiseWrapper" @click.stop="collectCookery(item.RecipesId, item.IsCare, i)">
							<view class="zanIcon" :class="item.IsCare?'collected': 'collect'"></view>
							<view class="numText">{{item.CareQuantity}}</view>
						</view>
					</view>
				</view>
				<!-- style="position: absolute; right: 20rpx;bottom:20rpx" -->

			</view>

		</view>
		<view class="blank" v-else>
			
		</view>
		<view class="submitList flexs flex-r flex-line flex2" v-if="edit">
			<view class="selectAll">

				<label class="radio" @click="selectAll" style="margin-top:10rpx">
					<radio value="" color="#FF303B" :checked="isSelectAll" />
				</label>
				<text style="margin-left:20rpx">全选</text>
			</view>

			<view class="flexs flex-r totalList flex2 flex-line"  v-if="selectList.length">
				<view class="submitButton" :style="'background:'+themeColor" @click="delectAction">删除</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				AllList: [],
				TotalPage: 0,
				selectList: [],
				isSelectAll: false,
				params: {
					"CurrentPage": 1,
					"PageSize": 0
				},
				edit: false,
				themeColor: this.$store.state.themeColor
			}
		},
		onLoad() {
			this.GetMyCareRecipes()
		},
		onShow() {
			this.$setNavigatorBg()
		},
		onReachBottom() {
			if (this.params.CurrentPage < this.TotalPage) {
				this.params.CurrentPage += 1
				this.GetMyCareRecipes()
				return
			}
			this.$Toast('亲，只有这么多了哦')
		},
		methods: {
			jump_cookery(id) {
				uni.navigateTo({
					url: "/pagesA/cookeryDetails/cookeryDetails?id=" + id
				})
			},
			// 底部选择全部/取消全选
			selectAll() {
				let _p = this
				this.isSelectAll = !this.isSelectAll
				let arr = []
				if (!this.isSelectAll) {
					arr = []
				}
				this.AllList.forEach((e) => {
					if (_p.isSelectAll) {
						e.radio = true
						arr.push(e)
					} else {
						e.radio = false
					}
				})
				this.selectList = arr
			},
			async GetMyCareRecipes() {
				let that = this,
					res = await that.$request(that.$API.GetMyCareRecipes, that.params)
				if (res.Data.Datas.length == 0) {
					that.AllList = []
					return
				}
				res.Data.Datas.forEach((e) => {
					e.radio = false
				})
				if (this.params.CurrentPage === 1) {
					that.AllList = res.Data.Datas
				} else {
					that.AllList = this.AllList.concat(res.Data.Datas)
				}
				that.TotalPage = res.Data.TotalPage
			},
			// 收藏或者取消收藏食谱
			collectCookery(id, IsCare, index) {
				console.log(id, IsCare, index)
				var that = this
				if (IsCare) {
					that.$request(that.$API.DeleteRecipes, {
						"RecipesId": [id],
						"SourceOrder": 1
					}).then(res => {
						that.AllList[index].IsCare = !IsCare
						that.AllList[index].CareQuantity -= 1
					})
					return
				}
				that.$request(that.$API.MycareRecipes, {
					"RecipesId": id,
					"SourceOrder": 1
				}).then(res => {
					that.AllList[index].IsCare = !IsCare
					that.AllList[index].CareQuantity += 1
				})
			},
			slectCookery(item) {
				let GoodsCodeArr = []
				item.radio = !item.radio
				if (item.radio) {
					this.selectList.push(item)
					if(this.selectList.length==this.AllList.length){
						this.isSelectAll=true
					}
				} else {
					this.isSelectAll=false
					let selectList = JSON.parse(JSON.stringify(this.selectList))
					selectList.forEach((items, i) => {
						if (items.RecipesId == item.RecipesId) {
							selectList.splice(i, 1);
						}
					})
					this.selectList = selectList
				}
				console.log(this.selectList)
				// this.selectList.forEach(item => {
				// 	GoodsCodeArr.push(item.GoodsCode)
				// })
				// this.GoodsCodeArr= GoodsCodeArr
			},
			// 取消关注
			async delectAction() {
				let s = await this.showT('提示', '确定删除选中食谱?', 1)
				if (s) {
					let that = this
					let RecipesId_list = []
					this.selectList.forEach(item => {
						RecipesId_list.push(item.RecipesId)
					})
					// this.GoodsCodeArr= GoodsCodeArr
					let res = await that.$request(that.$API.DeleteRecipes, {
						RecipesId: RecipesId_list
					})
					if (res) {
						that.$Toast('删除成功')
						this.params = {
							"CurrentPage": 1,
							"PageSize": 0
						}
						that.GetMyCareRecipes()
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* conWrapper */
	.contentList_v {
		padding-bottom: 100upx;
		border-radius: 16rpx;
		overflow: hidden;
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

	.radio {
		width: 36upx;
		height: 36upx;
		margin-right: 30rpx;

		&>radio {
			width: 36upx;
			height: 36upx;
			transform: scale(0.85);
		}
	}

	.goods_v {
		padding: 20rpx;
		background-color: #fff;
	}

	.goods_v_left {
		image {
			width: 180rpx;
			height: 180rpx;
		}
	}

	.goods_v_right {
		padding-left: 20rpx;
		width: calc(100% - 180rpx);
	}

	.left_text {
		color: $color-red;
		font-size: 40rpx;
	}

	.right_text {
		text-decoration: line-through;
		color: #B1B1B1;
		font-size: 24rpx;
	}

	.top_txet {
		color: #333333;
		font-weight: 6000;
		font-size: 28rpx;
	}

	.conWrapper {
		padding: 20rpx;
	}

	.listBox {
		width: 344upx;
		border-radius: 8upx 8upx 0px 0px;
		/* 防止多列布局，分页媒体和多区域上下文中的意外中断 */
		break-inside: avoid;
		-webkit-break-inside: avoid;
		background-color: #fff;
		border-radius: 16upx;
	}

	.listBox .pro {
		width: 344upx;
		height: 320upx;
		background-color: #ccc;
	}

	.listBox .desc {
		padding: 16upx 10upx;
		text-align: center;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		font-size: 32upx;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		line-height: 46upx;
	}

	.listBox .totalWrapper {
		padding: 0 10upx;
		margin-bottom: 25upx;
		display: flex;
		line-height: 40upx;
	}

	.listBox .totalWrapper .userWrapper {
		flex: 1;
	}

	.userIcon {
		display: inline-block;
		vertical-align: middle;
		width: 40upx;
		height: 40upx;
		margin-right: 9upx;
		border-radius: 50%;
	}

	.collect {
		background-image: url('../../static/collect.png');
		background-size: cover;
	}

	.collected {
		background-image: url('../../static/collected.png');
		background-size: cover;
	}

	.totalWrapper .userWrapper .userName {
		display: inline-block;
		vertical-align: middle;
		font-size: 28upx;
		color: rgba(93, 93, 93, 1);
	}

	.praiseWrapper {
		flex: 1;
		text-align: right;
	}

	.zanIcon {
		display: inline-block;
		vertical-align: middle;
		width: 30upx;
		height: 30upx;
		margin-right: 8upx;
	}

	.numText {
		display: inline-block;
		vertical-align: middle;
		font-size: 28upx;
		color: rgba(93, 93, 93, 1);
	}

	/* submitList */
	.submitList {
		width: 100%;
		height: 116upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0upx -1upx 0upx 0upx rgba(240, 240, 240, 1);
		position: fixed;
		left: 0;
		bottom: 0;
	}

	.submitButton {
		display: inline-block;
		vertical-align: middle;
		padding: 0 49upx;
		height: 76upx;
		line-height: 76upx;
		text-align: center;
		border-radius: 38upx;
		font-size: 32upx;
		color: rgba(255, 255, 255, 1);
		margin-left: 30upx;
	}

	.submitList .selectAll {
		padding-left: 48upx;
	}

	.submitList .totalList {
		padding: 0 20upx;

	}
</style>
<style>
	page {
		height: 100%;
	}

	page {
		background-color: #f6f6f6;
	}
</style>
