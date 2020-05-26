<template>
	<view class="content">
		<view class="submitWrapper">
			<view class="list">
				<input type="number" class="phoneNum f-32" v-model="phone" placeholder="输入手机号(新号码自动注册)" placeholder-style="color: #D8D8D8;font-size:32upx;" maxlength="11"/>
				<image v-if="phone" src="../../static/circleClose.png"  class="delIcon bg-D8" @click="phone = ''"></image>
			</view>
			<view class="list">
				<input class="numCode f-32" v-model="code" type="number" placeholder="输入验证码" placeholder-style="color: #D8D8D8;font-size:32upx;" maxlength="5"/>
				<image v-if="code" src="../../static/circleClose.png"  class="delIcon bg-D8" @click="code = ''"></image>
				<view :class="/^1[3456789]\d{9}$/.test(phone) && !isGetCode ? 'hasCode' : 'getCode'"
				  :style="/^1[3456789]\d{9}$/.test(phone) && !isGetCode ?'background-color:'+themeColor: 'color:'+themeColor" @click="getPhoneCode">{{codeText}}{{isGetCode?'S': ''}}
			</view>
		</view>
		</view>
		<button v-if="/^1[3456789]\d{9}$/.test(phone) && phone.length == 11 && code.length == 5 && !isLogining" open-type="getUserInfo" class="col-f hasLogin"
		  :style="{'background': themeColor?themeColor: color}" @getuserinfo="phoneLogin">登录
		</button>
		<button v-else class="col-f login">{{isLogining?'登录中...': '登录'}}</button>
		<view class="helpText" :style="{'color': themeColor}" @click="getCodeAgain">
			收不到验证码？
		</view>
		<view class="noticeWrapper">
			<view class="notice">
				登录注册则代表您同意咕咚熊
				<text :style="{'color': themeColor?themeColor: color}" @click="goServe">《服务协议》</text>
				与
				<text :style="{'color': themeColor?themeColor: color}" @click="goPerson">《隐私政策》</text>
			</view>
		</view>
		
		<uni-popup ref="popup" type="center">
			<view class="popup-main col-red bg-ff">
				<view class="col-33 f-32 t-center line-1">重新获取验证码？</view>
				<view class="btn-box t-center">
					<view class="dis-inline-block btn cancel" :style="{'border-color': themeColor, 'color': themeColor}" @click="close">取消</view>
					<view class="dis-inline-block btn sure col-f" :style="{'background': themeColor, 'border-color': themeColor}" @click="getPhoneCode">确定</view>
				</view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	import {textToast} from '@/common/utils.js'
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import getGlobalCartsGoodsList from '@/mixin/getGlobalCartsGoodsList.js'
	export default {
		mixins: [getGlobalCartsGoodsList],
		components: {
			uniPopup
		},
		data() {
			return {
				codeText: '获取验证码',
				isGetCode: '',           // 是否点击获取验证码
				phone: '',
				code: '',
				pass: '',
				loginCode: '',
				getTime: 0,
				timer: null,
				isLogining: false,       // 是否正在登录过程中
				customerid: uni.getStorageSync('customerid'),
				color: '#FF303B'
			}
		},
		computed: {
			themeColor() {
				return this.$store.state.themeColor
			}
		},
		onLoad(e) {
			console.log('接收到参数', e)
			if(e.isBind) {
				this.loginCode= e.loginCode
				uni.setNavigationBarTitle({
					title: '绑定手机'
				})
			}
		},
		methods: {
			close(){
				this.$refs.popup.close()
			},
			open(){       // 打开选择弹窗
			  this.$refs.popup.open()
			},
			// 重新发送验证码
			getCodeAgain() {
				// 防止快速点击
				if(!this.$stopAction(1)) {
					return
				}
				let status= this.getCode()
				if(status && this.getTime < 1) {
					textToast('请先获取验证码')
					return
				} else if(status && !this.isGetCode && this.getTime > 0) {
					this.open()
				}
			},
			getCode: function(){
				let that = this
				if(!that.phone){
					textToast('请输入手机号码')
					return false
				} else if(that.phone.length < 11) {
					textToast('手机号码需为11位数')
					return false
				} else if(!/^1[3456789]\d{9}$/.test(that.phone)){
					textToast('手机号码格式错误')
					return false
				} else if(that.isGetCode){
					textToast('请稍等'+that.codeText+'S后再试')
					return false
				} else {
					return true
				}
			},
			async getPhoneCode(){
				// 防止快速点击
				if(!this.$stopAction(1, 1000)) {
					return
				}
				this.close()
				let status= this.getCode()
				if(!status) {
					return
				}
				var that= this,
					paramData = {
						"CustomerPhone": Number(this.phone),
						"Password": "{6B576D0F-BD89-4CB7-96C2-CC1797FA6794}",
						"SourceOrder": 1
					}
					
				let res = await that.$request(that.$API.GetVerificationCode, paramData)
				if(res){
					clearInterval(that.timer)
					that.timer= null
					that.getTime += 1
					that.isGetCode= true
					that.codeText= 60
					that.timer= setInterval(function(){
						if(that.codeText< 1) {
							that.isGetCode= false
							that.codeText= '获取验证码'
							clearInterval(that.timer)
							that.timer= null
							return
						}
						that.codeText -= 1
					}, 1000)
					textToast('验证码已发送')
				}
			},
			//手机号登录
			async phoneLogin(e){
				this.isLogining= true
				uni.showLoading({
					title: '登录中...',
					mask: true
				})
				let rawData= JSON.parse(e.detail.rawData)
				console.log('获取到个人信息', rawData, rawData.nickName, rawData.avatarUrl)	
				
				let that= this
				if(that.phone.length != 11){
					textToast('手机号码需为11位数字')
					this.isLogining= false
					return
				} else if(that.code.length != 5){
					textToast('请输入正确的5位验证码')
					this.isLogining= false
					return
				} else if(!that.phone || (!/^1[3456789]\d{9}$/.test(that.phone))){
					textToast('请输入正确的手机号码')
					this.isLogining= false
					return
				} else if(!that.code){
					textToast('验证码不能为空')
					this.isLogining= false
					return
				}
				// 判断是否微信登录
				if(that.loginCode) {
					that.weixinLogin(rawData)
					return
				}
				
				var paramData = {
					"CustomerUid": that.phone, //登录账号-用户手机号码
					"CustomerPaw": that.code, //登录密码、手机验证码 
					"PasswordType": 3,
					"ShareCustomer":that.customerid ? that.customerid :'',
					"SourceOrder": 1
				}
				console.log('paramData',paramData)
				let res= await that.$request(that.$API.CreateToken, paramData, '', true)
				if(res.Success===0) {
					uni.removeStorage({
					    key: 'customerid',
					    success: function (res) {
					        // console.log('success');
					    }
					});
					this.$store.commit('loginIn', res.Data.CustomerPassword)					
					uni.switchTab({						url:'../index/index'
					})	
				} else {
					this.isLogining= false
				}
				
			},
			//微信登录
			async weixinLogin(rawData){
				this.isLogining= true
				uni.showLoading({
					title: '登录中...',
					mask: true
				})
				let that=this,
					paramData= {
						CustomerPhone: that.phone,
						VerificationCode: that.code,
						Appid: 'wxa9178215de3336a6',
						WeixinCode: that.loginCode,
						CustomerNick: rawData.nickName,
						CustomerImages : rawData.avatarUrl
					}
				let res= await that.$request(that.$API.WeixinToken, paramData, '', true)
				if(res.Success===0) {
					that.$store.commit('loginIn', loginRes.Data.CustomerPassword)
					that.setGlobalCartsGoodsList()
					uni.switchTab({
						url:'../index/index'
					})	
				} else {
					this.isLogining= false
				}
				
			},
			// 查看隐私说明
			goPerson() {
				uni.navigateTo({
					url: '../../pagesA/web-view/web-view?url=https://www.gudongxiong.com/PrivacyForm.aspx'
				})
			},
			goServe() {
				uni.navigateTo({
					url: '../../pagesA/web-view/web-view?url=https://www.gudongxiong.com/TeamServiceForm.aspx'
				})
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.submitWrapper {
		padding: 20upx 40upx 0;
	}
	.submitWrapper .list {
		width: 100%;
		height: 89upx;
		line-height: 89upx;
		border-bottom: 1upx solid #EAEAEA;
		position: relative;
	}
	.submitWrapper .phoneNum  {
		display: inline-block;
		vertical-align: middle;
		width: calc(100% - 60upx);
	}
	.list{
		.numCode{
			display: inline-block;
			vertical-align: middle;
			width: 50%;
		}
		.getCode {
			position: absolute;
			right: 0;
			top: 50%;
			margin-top: -31upx;
			width:188upx;
			height:62upx;
			line-height: 62upx;
			text-align: center;
			background: #E8E8E8;
			border-radius:30upx;
			font-size:28upx;
			opacity:0.3;
		}
		.hasCode {
			position: absolute;
			right: 0;
			top: 50%;
			margin-top: -31upx;
			width:188upx;
			height:62upx;
			line-height: 62upx;
			text-align: center;
			border-radius:30upx;
			font-size:28upx;
			color:#FFFFFF;
		}
	}
	.delIcon{
		display: inline-block;
		vertical-align: middle;
		height: 40upx;
		width: 40upx;
		border-radius: 50%;
	}
	.login {
		width:670upx;
		height:92upx;
		line-height: 92upx;
		text-align: center;
		background: #D8D8D8;
		border-radius:46px;
		font-size:32upx;
		margin: 60upx auto 17upx;
	}
	.hasLogin {
		width:670upx;
		height:92upx;
		line-height: 92upx;
		text-align: center;
		border-radius:46px;
		font-size:32upx;
		margin: 60upx auto 17upx;
	}
	.helpText {
		width: 670upx;
		margin: auto;
		text-align: right;
		font-size:24upx;
	}
	.bottomView {
		width: 100%;
		height: 332upx;
		position: fixed;
		left: 0;
		bottom: 0;
		.title {
			text-align: center;
		}
		.curTitle {
			font-size:24upx;
			color:rgba(153,153,153,1);
			position: relative;
			&::before {
				display: block;
				content: '';
				width:200upx;
				height:1upx;
				background:rgba(234,234,234,1);
				position: absolute;
				left: -252upx;
				top: 50%;
			}
			&::after {
				display: block;
				content: '';
				width:200upx;
				height:1upx;
				background:rgba(234,234,234,1);
				position: absolute;
				right: -252upx;
				top: 50%;
			}
		}
	}
	
	.userButton {
		width: 150upx;
		height: 190upx;
		text-align: center;
		padding-top: 39upx;
		.icon {
			display: block;
			width: 96upx;
			height: 96upx;
			background-color: #4CD964;
			border-radius: 50%;
			margin: auto;
		}
	}
	.noticeWrapper {
		position: fixed;
		bottom: 69upx;
		left: 0;
		width: 100%;
		font-size:28upx;
		line-height: 30upx;
		color:rgba(153,153,153,1);
		text-align: center;
		.color {
			color: $color-red;
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
