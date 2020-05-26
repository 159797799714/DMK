export default {
	data(){
		return {
			// 购物车位置，用于购物小球动画
			cartBasketRect: {},
		}
	},
	mounted(){
		uni.getSystemInfo({
			success: (function(res) {
				this.cartBasketRect = {
					left: (res.windowWidth/5)*3.5,
					top: res.windowHeight,
					width: 0,
					height: 0
				}
			}).bind(this)
		})
	},
	methods: {
		add(e,id){
			this.$refs.inCart.addToCart(e,id);
		},
	}
}