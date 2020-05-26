export default {
	computed: {
		token: function() {
			return uni.getStorageSync('token')
		},
		isCartsInit() {
			return this.$store.state.isCartsInit
		}
	},
	methods: {
		setGlobalCartsGoodsList(force = false) {
			let token= this.$store.state.token
			// 设置全局购物车
			if(this.isCartsInit || !token){
				return
			}
			this.$request(this.$API.GetCustomerCart).then(res=>{
				let goodsList = res.Data
				this.$store.commit('setCartsGoodsList', res.Data)
				console.log('设置全局购物车Data2222222222', this.$store.state.cartsDictionaries)
			})
		}
	}
}