<template>
	<view class="groupBox" :style="{'right': right}">
		<view class="groupBar col-f f-32 line-1" :style="{'background': themeColor, 'bottom': bottom + 'px'}" @click.stop="goGroup" @touchmove.stop="touchMove">团购中</view>
	</view>
</template>

<script>
	export default{
		name: 'cartIcon',
		props: {
			height: Number
		},
		watch: {
			cartNum: {
				handler(newVal) {
					console.log('接受到新参数值newVal', newVal)
					this.cartNum= newVal
				},
				immediate: true
			}
		},
		data() {
			return{
				right: 0,
				clientX: 0,
				clientY: 0,
				timer: null,
				bottom: 50,
				themeColor: '',
				windowHeight: 600
			}
		},
		async created() {
			let that= this
			let themeColor= that.$store.state.themeColor
			that.themeColor= themeColor?themeColor: '#FF303B'
			
			uni.getSystemInfo({
				success(res) {
					console.log('cartIcon获取到系统信息', res.windowHeight)
					that.windowHeight= res.windowHeight - 136
				}
			})
		},
		methods: {
			updateBottom() {
				let that= this
				this.$nextTick(() => {
					this.bottom= 50
				})
			},
			async isScroll() {
				this.right= '-100%'
				clearTimeout(this.timer)
				this.timer= null
				this.timer= setTimeout(function(){
					this.right= 0
				}.bind(this), 1000)
			},
			setBg() {
				let that= this
				this.$nextTick(() => {
					let themeColor= this.$store.state.themeColor
					that.themeColor= themeColor?themeColor: '#FF303B'
				})
				
			},
			goGroup() {
				uni.navigateTo({
					url: '/pages/group/group'
				})
			},
			touchMove(e) {
				let X= e.changedTouches[0].clientX,
					Y= e.changedTouches[0].clientY
					
				this.clientX= this.clientX? this.clientX: X
				this.clientY= this.clientY? this.clientY: Y
				
				let shortX=this.clientX - X,     // 向左向上为正
					shortY=this.clientY - Y,
					bot= 50 + shortY,
					maxHeight= this.windowHeight;
				console.log('bot', bot)
				bot= bot < 0 ? 0: bot
				bot= bot > maxHeight ? maxHeight : bot
				this.bottom= bot
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.groupBox{
		z-index: 100;
		position: fixed;
		right: 0;
		bottom: 0;
		height: calc(100% - 88px);
		width: 160upx;
		transition: 500ms;
		pointer-events: none;
		// overflow: hidden;
		.groupBar{
			position: absolute;
			rigth: 0;
			bottom: 100upx;
			padding: 20upx 25upx 20upx 45upx;
			border-radius: 36upx 0 0 36upx;
			white-space: nowrap;
			pointer-events: auto;
		}
	}
</style>
