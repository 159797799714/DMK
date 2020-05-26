<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onLoad: function() {
			uni.getSystemInfo({
				success(res) {
					console.log('系统信息', res)
					console.log('状态栏高度', res.statusBarHeight)
					uni.setStorageSync('statusBarHeight', res.statusBarHeight)
					this.statusBarHeight= res.statusBarHeight
				}
			})
		},
		onShow() {
			// 小程序版本检测更新
			const updateManager = uni.getUpdateManager()
			updateManager.onCheckForUpdate(function (res) {
				console.log('版本信息', res)
			  // 请求完新版本信息的回调
				console.log('请求完整新版本成功', res)
				if(!res.hasUpdate) {
					return
				}
				updateManager.onUpdateReady(function (res) {
				  uni.showModal({
				    title: '更新提示',
				    content: '新版本已经准备好，是否重启应用？',
				    success(res) {
				      if (res.confirm) {
				        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
				        updateManager.applyUpdate()
				      }
				    }
				  })
				})
			})
			updateManager.onUpdateFailed(function (res) {
			  // 新的版本下载失败
				// 请求完新版本信息的回调
				uni.showToast({
					title: '请求版本信息失败',
					icon: 'none'
				})
			})
			
			// 获取保存状态栏高度
			uni.getSystemInfo({
				success(res) {
					console.log('系统信息', res)
					console.log('状态栏高度', res.statusBarHeight)
					uni.setStorageSync('statusBarHeight', res.statusBarHeight)
				}
			})
			// 调用授权接口
			uni.authorize({
				scope: 'scope.userLocation',
				success() {
					
				}
			})
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	page{
		height: 100%;
		width: 100%;
		/* font-family: PingFang SC; */
	}
	/*每个页面公共css */
	@font-face {
	  font-family: 'iconfont';  /* project id 1814957 */
	  src: url('//at.alicdn.com/t/font_1814957_4gxlpa9h4e.eot');
	  src: url('//at.alicdn.com/t/font_1814957_4gxlpa9h4e.eot?#iefix') format('embedded-opentype'),
	  url('//at.alicdn.com/t/font_1814957_4gxlpa9h4e.woff2') format('woff2'),
	  url('//at.alicdn.com/t/font_1814957_4gxlpa9h4e.woff') format('woff'),
	  url('//at.alicdn.com/t/font_1814957_4gxlpa9h4e.ttf') format('truetype'),
	  url('//at.alicdn.com/t/font_1814957_4gxlpa9h4e.svg#iconfont') format('svg');
	}
	.iconfont {
	  font-family: "iconfont" !important;
	  font-size: 32upx;
	  font-style: normal;
	  -webkit-font-smoothing: antialiased;
	  -moz-osx-font-smoothing: grayscale;
	}
		.flex-L{-webkit-align-items:center;-ms-flex-align:center;align-items: center;-webkit-align-items:center;-moz-box-align:center;}
		.flex-wrap{-webkit-box-flex-wrap: wrap;-webkit-flex-wrap: wrap;flex-wrap: wrap} 
		.flexs{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;}
		.flex {display: -webkit-box; display: -ms-flexbox; display: flex;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content: space-around;}
		.flex2 {display: -webkit-box; display: -ms-flexbox; display: flex;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content: space-between;}
		.flex-line {display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-align: center;-ms-flex-align: center;align-items: center;}
		.flex-line-start {display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-align: flex-start;-ms-flex-align: flex-start;align-items: flex-start;}
		.flex-line-end {display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-align: flex-end;-ms-flex-align: flex-end;align-items: flex-end;}
		.flex-start{display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-align: flex-start;-ms-flex-align: flex-start;align-items: flex-start; justify-content: flex-start;}
		.flex-end{display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-align: flex-end;-ms-flex-align: flex-end;align-items: flex-end; justify-content: flex-end;}
		.flex-1 {-webkit-box-flex: 1;-webkit-flex: 1;flex: 1}
		.flex-fixed {position:fixed;left:0;top:0;right:0;bottom:0;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;z-index:10}
		.flex-v{-webkit-box-orient:vertical;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;}
		/* .flex-r{-webkit-box-orient:vertical;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;} */
		.flex-r{-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;}
		.flex-right {-webkit-justify-content: flex-end;-moz-box-pack:end;-webkit--moz-box-pack:end;justify-content: flex-end}
		/* .flex-center {-webkit-justify-content:center;-moz-box-pack:center;-webkit--moz-box-pack:center;box-pack:center;justify-content:center} */
		.flex-center{-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;}
		.p20{padding: 20upx;}
		.pr{position: relative;}
		.pa{position: absolute;}
		.b_f{background-color: #fff;}
		
		.blank{
			position: relative;
			height: 150upx;
			width: 150upx;
			margin: 200upx auto 0;
			background-size: cover;
			background-image: url(static/blank.png)
		}
		.blank::after{
			content: '暂无数据';
			position: absolute;
			bottom: -80upx;
			left: -25upx;
			display: inline-block;
			width: 200upx;
			text-align: center;
			line-height: 40upx;
			font-size: 28upx;
			color: #ccc;
		}
		.floatCart{
			position: fixed;
			right: 20upx;
			bottom: 56upx;
			border-radius: 50%;
			background-color: #fff;
			text-align: center;
			box-shadow:0upx 4upx 10upx 0upx rgba(28,29,40,0.12);
		}
		// 购物车角标
		.num-info{
			position: absolute;
			top: -12upx;
			right: -16upx;
			padding: 4upx 12upx;
			border-radius: 16upx;
			background: #F95A4B;
			color: #fff;
			font-size: 20upx;
			line-height: 20upx;
			border: 2upx solid #fff;
		}
		.noMore{
			line-height: 80upx;
		}
		.m-l-12{margin-left: 12upx;}
		.m-l-20{margin-left: 20upx;}
		.m-r-15{margin-right: 15upx;}
		</style>
