<template>
	<view class="content" @click="goBack">
		<image src="../../static/noInternet.png" class="bg-img" mode=""></image>
		<view class="t-center line-1 col-99 f-32">网络异常，点击重新加载</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				
			}
		},
		methods: {
			goBack() {
				let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
				let curRoute = routes[routes.length - 2].route // 获取当前页面路由，也就是最后一个打开的页面路由
				let indexArr= ['pages/index/index', 'pages/menu/menu', 'pages/cookery/cookery', 'pages/group/group', 'pages/mine/mine']
				console.log(routes, curRoute)
				
				console.log(indexArr.indexOf(curRoute))
				if(indexArr.indexOf(curRoute) !== -1) {
					uni.switchTab({
						url: '/'+ curRoute
					})
					return
				}
				uni.redirectTo({
					url: '/'+ curRoute
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		padding-top: 272upx;
		.bg-img{
			display: block;
			width: 690upx;
			height: 600upx;
			margin: 0 auto;
		}
	}
</style>
