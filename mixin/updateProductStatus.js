function t(code){
	return `t${code}`
}
export default {
	onShow(){
			this.updateBottomTabCarts()
	},
	computed: {
		cartsVersionNo(){
			this.updateList()
			return this.$store.state.cartsVersionNo
		},
	},
	methods: {
		// 参考购物车，更新商品列表数量。
		updateListItemQuantity (goodsList) {
			if(!Array.isArray(goodsList)){
				return []
			}
			return this.$store.getters.updateListItemQuantity(goodsList)
		},
		updateBottomTabCarts(){
			if(!this.$store.getters.cartsTotal()){
				uni.removeTabBarBadge({
					index: 3
				})
				return
			}
			uni.setTabBarBadge({
				index: 3, 
				text: this.$store.getters.cartsTotal() + '',
			})
		}
		
	}
}