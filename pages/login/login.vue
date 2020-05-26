<template>
	<view class="content">
		<view class="logo">
			<image src="../../static/logo.png" mode="" class="logonIcon"></image>
		</view>
		 <!-- @click="login" -->
		<button class="userButton" open-type="getUserInfo" @getuserinfo="login" :style="{'background': isLogining? '#d8d8d8': themeColor}">{{isLogining?'登录中': '微信用户一键登录'}}</button>
		<navigator hover-class="none" :url="'../phoneLogin/phoneLogin?customerid='+customerid" class="f-28 phoneLogin t-center">手机验证码登录/注册</navigator>
		<view class="noticeWrapper">
			<view class="notice">
				登录注册则代表您同意咕咚熊
				<text :style="{'color': themeColor?themeColor: color}" @click="goServe">《服务协议》</text>
				与
				<text :style="{'color': themeColor?themeColor: color}" @click="goPerson">《隐私政策》</text>
			</view>
		</view>
	</view>
</template>

<script>
	import getGlobalCartsGoodsList from '@/mixin/getGlobalCartsGoodsList.js'
	export default {
		mixins: [getGlobalCartsGoodsList],
		data() {
			return {
				isLogining: false, // 是否正在登录
				customerid:'',
				color: '#FF303B'
			}
		},
		onLoad(opt) {
			 if(opt.q){
			 	console.log(decodeURIComponent(opt.q))
			 	let url=decodeURIComponent(opt.q)
			 	let param=this.$getParamsFromUrl(url)
				this.customerid=param.customerid
			 	console.log('param',param)
				uni.setStorageSync('customerid', param.customerid)
			 }
		},
		onShow() {
			let that= this
			that.customerid= uni.getStorageSync('customerid')
		},
		computed: {
			themeColor() {
				return this.$store.state.themeColor
			}
		},
		methods: {
			login(e) {
				let userInfo=e.detail
				this.isLogining= true
				uni.showLoading({
					title: '登录中...',
					mask: true
				})
				let that= this
				console.log('that.customerid', that.customerid)
				uni.login({
				  provider: 'weixin',
				  success: async function (res) {
						let params= {
							"CustomerUid": "wxa9178215de3336a6",
							"CustomerPaw": res.code,
							"PasswordType": 2,
							"ShareCustomer":that.customerid ? that.customerid:'',
							"EncryptedData": userInfo.encryptedData,
							"Iv": userInfo.iv,
						},
						loginRes= await that.$request(that.$API.CreateToken, params, null, '1003')
						uni.hideLoading()
						that.isLogining= false
						if(loginRes.Success === 1003 ) {
							that.$Toast('请绑定手机', null, 2000)
							uni.navigateTo({
								url: '../phoneLogin/phoneLogin?isBind=true&loginCode=' + res.code
							})
						} else if(loginRes.Success === 0) {
							that.$store.commit('loginIn', loginRes.Data.CustomerPassword)
							
							let AppThemeColor= loginRes.Data.AppThemeColor
							that.$store.commit('setThemeColor', AppThemeColor)
							
							that.setGlobalCartsGoodsList()
							
							uni.switchTab({
								url:'../index/index'
							})	
						}
				  },
					fail() {
						that.$Toast('获取登录信息失败,请重试')
						that.isLogining= false
					}
				})
			},
			
			// 查看隐私说明
			goPerson() {
				uni.navigateTo({
					url: '/pagesA/web-view/web-view?url=https://www.gudongxiong.com/PrivacyForm.aspx'
				})
			},
			goServe() {
				uni.navigateTo({
					url: '/pagesA/web-view/web-view?url=https://www.gudongxiong.com/TeamServiceForm.aspx'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.content{
	padding-top: 195rpx;
}
.logo {
	margin: 0 auto 205rpx;
	width:188rpx;
	height:188rpx;
	border-radius:16rpx;
	overflow: hidden;
	background: $linear-red;
	.logonIcon{
		height: 100%;
		width: 100%;
	}
}	
.userButton {
	width:670rpx;
	height:92rpx;
	line-height: 92rpx;
	text-align: center;
	border-radius:46rpx;
	font-size:32rpx;
	color:rgba(255,255,255,1);
	margin: auto;
}
.phoneLogin{
	margin-top: 40upx;
	color: #7488AF;
}
.noticeWrapper {
	width: 100%;
	font-size:28rpx;
	line-height: 30rpx;
	color:rgba(153,153,153,1);
	position: fixed;
	left: 0;
	bottom: 70rpx;
	text-align: center;
}
</style>
