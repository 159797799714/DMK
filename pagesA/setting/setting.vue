<template>
	<commonBox>
		<view class="content t-center">
			<view v-if="token" class="dis-inline-block btn f-32 bg-ff"  :style="'color: '+themeColor" @click="loginOut">退出登录</view>
		</view>
		
		<uni-popup ref="popup" type="center">
			<view class="popup-main col-red bg-ff">
				<view class="col-33 f-32 t-center line-1">确认退出登录？</view>
				<view class="btn-box t-center">
					<view class="dis-inline-block btn cancel" :style="'color: '+themeColor+';border-color: '+themeColor" @click="close">取消</view>
					<view class="dis-inline-block btn sure col-f" :style="'border-color: '+themeColor+';background:'+themeColor" @click="sureLoginOut">确定</view>
				</view>
			</view>
		</uni-popup>
	</commonBox>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import commonBox from "@/components/commonBox.vue"
	export default {
		components: {
			commonBox,
			uniPopup
		},
		data() {
			return {
				token: this.$store.state.token,
				themeColor: this.$store.state.themeColor
			}
		},
		methods: {
			close(){
				this.$refs.popup.close()
			},
			open(){       // 打开选择弹窗
			  this.$refs.popup.open()
			},
			loginOut() {
				let that= this
				this.open()
			},
			sureLoginOut() {
				this.$store.commit('clearCartsItem', 'loginOut')
				this.$store.commit('loginOut')
				this.close()
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.content{
	height: 100%;
	width: 100%;
	vertical-align: bottom;
	background-color: #f3f3f3;
	transform: rotate(180deg);
	.btn{
		width: 100%;
		padding: 32upx 2upx 32upx 0;
		transform: rotate(180deg);
	}
}
.popup-main{
	height: 280upx;
	width: 568upx;
	box-sizing: border-box;
	padding-top: 80upx;
	border-radius: 20upx;
	text-align: center;
	.btn-box{
		margin-top: 50upx;
		.btn{
			height: 60upx;
			width: 180upx;
			text-align: center;
			line-height: 60upx;
			border-radius: 30upx;
			border-width: 2upx;
			border-style: solid;
		}
		.sure{
			margin-left: 47upx;
		}	
	}
	
}
</style>
<style>
	page{
		background-color: #f3f3f3;
	}
</style>
