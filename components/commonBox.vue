<template>
	<view class="main bg-ff" :style="maxHeight">
		<slot/>
	</view>
</template>

<script>
	export default{
		data() {
			return{
				 
			}
		},
		computed: {
			maxHeight: function() {
				let height= ''
				uni.getSystemInfo({
					success(res) {
						console.log('commonBox系统信息', res)
						height= res.windowHeight - res.statusBarHeight + 20 + 'px;'
					}
				})
				return 'height: ' + height
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		height: 100%;
		background-color: #fff;
	}
	.main{
		box-sizing: border-box;
		position: relative;
		overflow: hidden;
	}
</style>
