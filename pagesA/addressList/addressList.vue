<template>
	<commonBox>
	<view class="content">
		<view v-if="list.length > 0 || list === ''" class="listWrapper">
			<view class="listBox">
				<view class="addressList" v-for="(item, index) in list" :key="index" :style="selectDefaultId === item.CustomerAddressId?'border-color:'+themeColor: 'border-color: #fff;border-bottom-color: #EAEAEA'" @click="jump_firmOrder(item)">
					<view class="addressName">{{item.Floor}}</view>
					<view class="detailName">{{item.Address}}</view>
					<view class="name">
						<text>{{item.CustomerName}}</text>
						<text class="phone">{{item.CustomerPhone}}</text>
					</view>
					<view class="editoIcon" @click.stop="editAddress(item)">
						<image class="icon" src="../../static/edito.png" mode=""></image>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="noDataWrapper">
			<image class="noDataBg" src="../../static/noData.png" mode="widthFix"></image>
			<view class="title">
				您还没添加过地址哦
			</view>
			<view class="addWrapper">
				<navigator url="/pagesA/addAddress/addAddress" class="addButton" :style="'background: '+themeColor">
					添加新地址
				</navigator>
			</view>
		</view>
		<!-- <view class="outList">
			<view class="title">
				以下地址超出配送范围
			</view>
			<view class="addressList">
				<view class="addressName">
					TOD科技中心
				</view>
				<view class="detailName">2栋2楼</view>
				<view class="name">
					<text>小花花(女士) </text>
					<text class="phone">15912345678</text>
				</view>
				<view class="editoIcon">
					<image class="icon" src="../../static/edito.png" mode=""></image>
				</view>
			</view>
		</view> -->
		<view v-if="list.length > 0" class="addAddress">
			<view class="add"  :style="'background: '+themeColor" @click="addAddress">
				添加新地址
			</view>
		</view>
	</view>
	</commonBox>
</template>

<script>
	import commonBox from "@/components/commonBox.vue"
	export default {
		components: {
			commonBox
		},
		data() {
			return {
				list: '',
				type:'',
				selectDefaultId: '',
				themeColor: this.$store.state.themeColor
			}
		},
		onLoad(e) {
			if(e.type=="Sorder"){
				this.type=e.type
			}
			if(e.addressId) {
				this.selectDefaultId= e.addressId
			}
		},
		onShow() {
			this.getMineAddress()
		},
		methods: {
			jump_firmOrder(item){
				if(this.type=="Sorder"){
					this.vue_g.AddressId=item.CustomerAddressId
					uni.navigateBack({
						delta:1
					})
				}
			},
			addAddress: function(){
				console.log('xxxxxxxxxxxxxxxxxxx')
				uni.navigateTo({
					url:'/pagesA/addAddress/addAddress'
				})
			},
			// 编辑收货地址
			editAddress(item) {
				uni.navigateTo({
					url:'/pagesA/addAddress/addAddress?edit=true&item=' + JSON.stringify(item)
				})
			},
			//获取地址列表
			async getMineAddress(){
				var paramData = {
					"SourceOrder": 1
				}
				let res= await this.$request(this.$API.GetCustomerAddr, paramData)
				this.list = res.Data
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #F3F3F3;
	}
	.content{
		height: 100%;
		overflow: scroll;
	}
.noDataBg {
	display: block;
	width: 634rpx;
	height: 604rpx;
	margin: 200rpx auto 67rpx;
}
.noDataWrapper .title  {
	font-size:32rpx;
	color:rgba(153,153,153,1);
	text-align: center;
	margin-top: -100rpx;
	margin-bottom: 100rpx;
}
.addWrapper .addButton {
	width:480rpx;
	height:92rpx;
	line-height: 92rpx;
	text-align: center;
	border-radius:46rpx;
	-webkit-border-radius:46rpx;
	font-size:32rpx;
	color:rgba(255,255,255,1);
	margin: auto;
}
/* listWrapper */
.listWrapper {
	width: 702rpx;
	background:rgba(255,255,255,1);
	border-radius:12rpx;
	margin: 20rpx auto 100upx; 
}
.listWrapper .listBox {
	
}
.addressList {
	position: relative;
	padding: 0 24rpx;
	border-width: 1upx;
	border-style: solid;
	border-radius: 12upx;
}
.addressList .addressName {
	font-size:32rpx;
	font-weight:bold;
	color:rgba(51,51,51,1);
	padding: 20rpx 20upx 0 0;
	margin-bottom: 27rpx;
}
.addressList .detailName {
	width: 600upx;
	font-size:28rpx;
	color:rgba(102,102,102,1);
	margin-bottom: 23rpx;
	overflow: auto;
}
 .addressList .name {
	font-size:28rpx;
	color:rgba(153,153,153,1);
	margin-bottom: 39rpx;
}
 .addressList .name .phone {
	padding-left: 10rpx;
}
 .addressList .editoIcon {
	width: 40rpx;
	height: 40rpx;
	position: absolute;
	right: 24rpx;
	top: 50%;
	margin-top: -20rpx;
}
 .addressList .editoIcon .icon {
	display: block;
	width: 40rpx;
	height: 40rpx;
}
/* outList */
.outList {
	width: 654rpx;
	background:rgba(255,255,255,1);
	border-radius:12rpx;
	padding: 0 24rpx;
	margin: 20rpx auto 0;
	display: none;
	
}
.outList .title {
	font-size:28rpx;
	line-height: 28rpx;
	font-weight:bold;
	color:rgba(51,51,51,1);
	padding-top: 32rpx;
	margin-bottom: 39rpx;
}
.outList .addressList {
	position: relative;
}
.outList .addressList .addressName {
	font-size:32rpx;
	font-weight:bold;
	color:#999999;
	padding-top: 0;
}
/* addAddress */
.addAddress {
	width:750rpx;
	height:124rpx;
	background:rgba(255,255,255,1);
	box-shadow:0rpx -1rpx 0rpx 0rpx rgba(240,240,240,1);
	position: absolute;
	left: 0;
	bottom: 0;
}
.addAddress .add{
	width:686rpx;
	height:92rpx;
	line-height: 92rpx;
	text-align: center;
	border-radius:46rpx;
	margin: 16rpx auto 0;
	font-size:32rpx;
	color:rgba(255,255,255,1);
}
	
</style>
