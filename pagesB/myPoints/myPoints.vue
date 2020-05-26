<template>
	<view class="content bg-ee">
		<view class="points-wrap" :style="{backgroundImage: bg}">
			<view class="points">
				<view class="text">36</view>
				<view class="small-text">当前积分</view>
			</view>
			<view class="bottom">
				<navigator url="/pagesB/pointsDetail/pointsDetail" class="btn">
					积分明细
				</navigator>
				<view class="btn">
					兑换记录
				</view>
			</view>
		</view>
		<view class="points-shops">
			<view class="title">
				<text class="centerTitle">积分商城</text>
			</view>
			<view class="goods-list">
				<GoodTwoColumn :allProduceArr="pointsShops" :hasCart="false" :hasPoints="true"></GoodTwoColumn>
				<view v-if="CurrentPage >= TotalPage && TotalPage !== 0" class="noMore t-center col-66 f-24">亲！只有这么多了哦！</view>
			</view>
		</view>
	</view>
</template>

<script>
	import GoodTwoColumn from "@/components/GoodTwoColumn.vue";
	export default {
		components: {
			GoodTwoColumn
		},
		data() {
			return {
				pointsShops: [],
				TotalPage: 1,
				CurrentPage: 1,
				bg: `url(data:image/png;base64,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)`
			};
		},
		onShow(){
			this.getAllList()
		},
		// 触底加载更多
		onReachBottom() {
			this.loadMore()
		},
		methods: {

			// 上拉加载更多
			loadMore() {
				let that= this
				if(that.CurrentPage < that.TotalPage) {
					that.CurrentPage += 1
					that.getAllList()
					return
				}
			},
			getAllList(){
				let that= this,
					paramData = {
						"CurrentPage": that.CurrentPage,
						"PageSize": 10
					}
				that.$request(that.$API['GetHomeGoods'], paramData).then(res => {
					if(res.Data.Datas.length < 1) {
						that.$Toast('抱歉！暂无该分类商品')
					}
					that.TotalPage= res.Data.TotalPage
					if(that.CurrentPage > 1) {
						that.pointsShops = that.pointsShops.concat(res.Data.Datas)
						return
					}
					that.pointsShops = res.Data.Datas
					console.log(that.pointsShops)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.content{
	min-height: 100%;
	padding: 20upx 24upx;
	font-family:PingFang SC;
}

.points-wrap{
	background-size: 100%;
	width: 100%;
	height: 300upx;
	padding-top: 48upx;
	box-sizing: border-box;
}
.points-wrap .points{
	margin-bottom: 43upx;
	color:rgba(255,255,255,1);
	text-align: center;
	font-weight:500;
}
.points-wrap .points .text{
	height:54upx;
	font-size:54upx;
}
.points-wrap .points .small-text{
	margin-top: 24upx;
	height:23upx;
	font-size:24upx;
	opacity:0.75;
}
.points-wrap .bottom{
	width: 100%;
	display: flex;
	justify-content: space-between;
	padding: 0 112upx;
	box-sizing: border-box;
}
.points-wrap .bottom .btn{
	width:192upx;
	height:60upx;
	border:2upx solid rgba(255, 255, 255, 1);
	border-radius:30upx;
	line-height: 60upx;
	text-align: center;
	font-size:28upx;
	font-weight:500;
	color:rgba(255,255,255,1);
}

/* 我的积分 */
.points-shops, .points-shops .title{
	background: inherit;
}
.points-shops {
	width: 100%;
	margin-top: 60upx;
}

.points-shops .title{
	position: relative;
	width: 100%;
	height:30upx;
	line-height: 30upx;
	text-align: center;
	color:rgba(51,51,51,1);
	margin-bottom: 35upx;
}
.points-shops .title .centerTitle{
	position: relative;
	font-size:32upx;
	font-weight:bold;
	padding: 0 24upx;
	background: inherit;
	z-index: 2;
}
.points-shops .title::after{
	content: '';
	display: block;
	height: 2upx;
	width: 418upx;
	position: absolute;
	top: 50%;
	left: 50%;
	margin-top: -1upx;
	margin-left: -209upx;
	background:rgba(206,206,206,1);
	z-index: 0;
}


.goods-list{
	width: 100%;
}
.goods{

}

</style>
