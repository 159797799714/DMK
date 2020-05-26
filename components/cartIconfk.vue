<template>
	<view class="cartBox bg-red" @click="goCart" @touchmove.stop="touchMove">
		<view class="cartIcon">
			<image src="../static/cart_white.png" mode=""></image>
			<text v-if="cartNum" class="cartNum">{{cartNum}}</text>
		</view>
	</view>
</template>

<script>
	export default{
		name: 'cartIcon',
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
				cartNum: '',
				x: 1000,
				y: 1000,
				clientX: 0,
				clientY: 0,
				onMove: null,
				themeColor: '#FF303B',
				themeBg: '',               // 主题背景色字符串如 background: #fff;
				fontThemeColor: '',        // 主题字体颜色字符串如 color: #fff;
			}
		},
		async created() {
			this.getCartNum()
			this.setBg()
		},
		methods: {
			async getCartNum() {
				let token= uni.getStorageSync('token')
				if(!token) {
					this.cartNum= 0
					return
				}
				let that= this,
					res= await that.$request(that.$API.GetCustomerCartQuantity)
					that.cartNum= res.Data
			},
			setBg() {
				let that= this
				this.$nextTick(() => {
					// let themeColor= uni.getStorageSync('AppThemeColor')
					// that.themeColor= themeColor?themeColor: '#FF303B'
				})
				
			},
			getCartNumAgain() {
				this.$nextTick(() => {
					this.getCartNum()
				})
			},
			goCart() {
				console.log('点击了购物车图标')
				uni.switchTab({
					url: '/pages/cart/cart'
				})
			},
			touchMove(e) {
			// 	if(this.onMove) {
			// 		return
			// 	}
			// 	this.onMove= setTimeout(function() {
			// 		clearTimeout(this.onMove)
			// 		this.onMove= null
			// 	}.bind(this), 100)
				// console.log(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
				let X= e.changedTouches[0].clientX,
					Y= e.changedTouches[0].clientY
					
				this.clientX= this.clientX? this.clientX: X
				this.clientY= this.clientY? this.clientY: Y
				
				let shortX=this.clientX - X,     // 向左向上为正
					shortY=this.clientY - Y  
				
				this.$emit('touchMove', shortX, shortY)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cartBox{
		display: inline-block;
		padding: 28upx;
		border-radius: 50%;
		box-shadow:0px 4px 10px 0px rgba(219,40,49,0.45);
		.cartIcon{
			height: 40upx;
			width: 40upx;
			position: relative;
		}
		.cartIcon>image{
			height: 100%;
			width: 100%;
		}
		.cartNum{
			position: absolute;
			// top: -14upx;
			// left: -19upx;
			top: -29upx;
			left: -25upx;
			color: #fff;
			background-color: $color-orange;
			line-height: 1em;
			font-size: 20upx;
			padding: 4upx 10upx;
			border-radius: 14upx;
			border: 2upx solid #fff;
		}	
	}
	
</style>
