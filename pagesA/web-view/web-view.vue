<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				url: 'https://www.gudongxiong.com'
			}
		},
		onLoad(opt) {
			if(opt.url) {
				this.url= opt.url
			} else {
				let HomeSite= uni.getStorageSync('HomeSite')
				this.url= HomeSite? HomeSite: 'https://www.gudongxiong.com'
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
