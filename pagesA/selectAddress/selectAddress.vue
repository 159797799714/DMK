<template>
	<view class="content">
		<view class="headerWrapper bg-red dis-flex flex-x-between flex-y-center">
			<view class="inputView">
				<image class="searchIcon" src="../../static/reach.png" mode="" @click="searchAction"></image>
				<input class="reachView" type="text" v-model="searchVal" placeholder="搜索" placeholder-style="color: #D8D8D8;" @confirm="searchAction"/>
			</view>
			<image src="../../static/close.png" class="close" mode="" @click="goIndex"></image>
		</view>
		<view class="areaWrapper">
			<view v-for="(item, index) in list" :key="index" class="listWrapper" @click="selectStore(item)">
				<view class="icon" :class="StoreCode === item.StoreCode?'bg-red': 'bg-ee'"></view>
				<view class="areaLaber">
					<view class="areaTitle" :class="StoreCode === item.StoreCode?'col-red': 'col-33'">{{item.StoreName}}</view>
					<view class="areaDetails">{{item.Address}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			addressList: Array
		},
		watch: {
			addressList(newVal){
				console.log('接受到', newVal)
				this.list= newVal
			}
		},
		data() {
			return {
				StoreCode: 'xxx',
				searchVal: '',
				list: []
			}
		},
		onLoad() {
	
		},
		onHide() {
			console.log('离开了onhide')
		},
		onUnload() {
			console.log('页面卸载onUnload')
		},
		methods: {
			goIndex() {
				this.$emit('close')
			},
			selectStore(item) {
				this.StoreCode= item.StoreCode
				this.$emit('selectAddress', {
					StoreCode: item.StoreCode,
					Longi: item.Longi,
					Lati: item.Lati,
					StoreName: item.StoreName
				})
			},
			async searchAction() {
				let that= this,
					params= {
						"Longi": '',
						"Lati": '',
						"SearchText": this.searchVal
					},
					res = await this.$request(this.$API.GetNearbyShop, params)
					if(res.Data.length < 1) {
						that.$Toast('暂无相关门店')
					}
					that.list= res.Data
			}
			    
		}
	}
</script>

<style lang="scss" scoped>
.content{
	height: 100%;
	background-color: #fff;
}
.headerWrapper {
	padding: 14upx 24upx;
	height: 60upx;
	font-size: 0;
	.inputView {
		position: relative;
		flex: 1;
		margin-right: 20upx;
		height:60upx;
		background:rgba(246,246,246,1);
		border-radius:30upx;
		font-size: 28upx;
		.reachView{
			height: 100%;
			width: 100%;
			box-sizing: border-box;
			padding-left: 68upx;
		}
		.searchIcon{
			z-index: 5;
			position: absolute;
			top: 12upx;
			left: 24upx;
			height: 32upx;
			width: 32upx;
		}
	}
	.close{
		height: 40upx;
		width: 40upx;
	}
	
}
/* areaWrapper */
.areaWrapper {
	width: 702upx;
	margin: 40upx auto 0;
}
.listWrapper {
	font-size: 0;
	position: relative;
	margin-bottom: 47upx;
}
.listWrapper  .icon {
	display: inline-block;
	vertical-align: middle;
	width: 24upx;
	height: 24upx;
	margin-right: 18upx;
	border-radius:50%;
}
.listWrapper .areaLaber {
	display: inline-block;
	vertical-align: middle;
}
.listWrapper .areaLaber .areaTitle {
	font-size:32upx;
	font-weight:bold;
}
.listWrapper .areaLaber .areaDetails {
	font-size:24upx;
	color:rgba(153,153,153,1);
	margin-top: 12upx;
}

</style>
