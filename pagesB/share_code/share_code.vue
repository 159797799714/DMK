<template>
	<view class="content" :style="'background-color:'+themeColor">		<!-- <canvas id=""></canvas> -->
		<view class="cen_code_v b_f flexs flex-center flex-v flex-line flex2">
			<view class="" style=" font-size: 32rpx;">
				扫一扫,{{sharetype==1 ? '打开商品详情':'邀请好友注册'}} 
			</view>
			<view class="qr_code">
				<canvas canvas-id="qrcode" style="width: 100%;height:100%;" />
			</view>
			<view class="col-red" style="font-size: 32rpx;" @click="save_img">
				保存{{sharetype==1 ? '商品':'邀请'}}二维码
			</view>
		</view>
	</view>
</template>

<script>
	import uQRCode from '@/js_sdk/Sansnn-uQRCode/uqrcode.js'
	export default{
		data(){
			return{
				QrcodeUrl:'',
				img_url:'',
				sharetype:1,

				themeColor: this.$store.state.themeColor
			}
		},
		onLoad(opt) {
			console.log(opt)
			opt.QrcodeUrl=decodeURIComponent(opt.QrcodeUrl)
			if(opt.QrcodeUrl){
				this.QrcodeUrl= opt.QrcodeUrl 
				
			}
			if(opt.sharetype){
				this.sharetype=opt.sharetype
			}
		},
		onShow() {
			this.$setNavigatorBg()
		},
		async onReady() {
			let size=await this.helper.getNodeInfo('.qr_code',0,'width')
			this.make(size)
		},
		methods:{
			 make(size) {
			      uQRCode.make({
			        canvasId: 'qrcode',
			        componentInstance: this,
			        text: this.QrcodeUrl,
			        size: size,
			        margin: 10,
			        backgroundColor: '#ffffff',
			        foregroundColor: '#000000',
			        fileType: 'jpg',
			        correctLevel: uQRCode.defaults.correctLevel,
			        success: res => {
			          console.log(res)
								this.img_url=res
			        }
			      })
			    },
			save_img(){
				uni.showLoading({
					title:'保存中...'
				})
				uni.saveImageToPhotosAlbum({
						filePath: this.img_url,
						success: ()=> {
							 uni.showToast({
								title:'保存成功',
								icon:"success",
								duration:1600
							 })
						},
						complete:()=>{
							uni.hideLoading();
						}
				});
			}		
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		box-sizing: border-box;
		background-color: $color-red;		height: 100%;
		width: 100%;
		position: absolute;
		overflow: hidden;
		padding: 60rpx 30rpx 0 30rpx;
		.cen_code_v{
			border-radius: 12rpx;
			box-sizing: border-box;
			position: relative;
			width: 100%;
			padding:80rpx 80rpx 160rpx 80rpx;
			.qr_code{
				width: 400rpx;
				height: 400rpx;
				margin: 100rpx 0;
				background-color: #EEEEEE;
			}
		}
	}
</style>
