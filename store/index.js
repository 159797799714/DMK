import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
function t(code){
	return `t${code}`
}
// 计算购物车商品总量
function getTotal(list){
	let num = 0
	for (let i in list) {
		num += list[i].CurrentCartQuantity
	}
	return num
}
function setCartsSign(num, delay = 1000){
	setTimeout(()=>{
		if(!parseInt(num)){
			uni.removeTabBarBadge({
				index: 3
			})
			return
		}
		uni.setTabBarBadge({
			index: 3, 
			text: num
		})
	}, delay)
}
const store = new Vuex.Store({
    state: {
			isCartsInit: false,
			// 用于购物车数量改变自动更新
			cartsVersionNo: 0,
			cartsDictionaries: {}, 
			themeColor: '',
			letThemeColor: 'gray',
			token: uni.getStorageSync('token')
		},
    mutations: {
			// 购买，不传数量，默认加1
			buy(state, {goods, count=false}){				
				if(!state.cartsDictionaries[t(goods.GoodsCode)]){ 
					goods.CurrentCartQuantity = 1
					state.cartsDictionaries[t(goods.GoodsCode)] = goods
					// 设置购物车角标
					state.cartsVersionNo++
					setCartsSign(getTotal(state.cartsDictionaries)+'')
					return
				}
				if(count !== false){
					state.cartsDictionaries[t(goods.GoodsCode)].CurrentCartQuantity = count
				}else{
					state.cartsDictionaries[t(goods.GoodsCode)].CurrentCartQuantity++
				} 
				// 设置购物车角标
				state.cartsVersionNo++
				setCartsSign(getTotal(state.cartsDictionaries)+'')
			},
			// 初始化全局购物车字典
			setCartsGoodsList(state, goodsList) {
				console.log('设置字典')
				if(!state.isCartsInit){
					state.isCartsInit = true
				}
				goodsList.forEach(goods=>{
					state.cartsDictionaries[t(goods.GoodsCode)] = goods
				})
				state.cartsVersionNo++
				setCartsSign(getTotal(state.cartsDictionaries)+'')
			}, 
			clearCartsItem(state, goodsList){
				// 用于登出
				console.log('清除的参数', goodsList)
				if(goodsList === 'all' || goodsList === 'loginOut'){
					state.cartsDictionaries = {}
					state.cartsVersionNo++
					if(goodsList === 'loginOut'){
						state.isCartsInit = false
					}
					setCartsSign(getTotal(state.cartsDictionaries)+'')
					return
				}
				goodsList.forEach(goods=>{
					delete state.cartsDictionaries[t(goods.GoodsCode)]
				})
				state.cartsVersionNo++
				setCartsSign(getTotal(state.cartsDictionaries)+'')
			},
			
			setThemeColor(state, color) {
				color= color?color: '#FF303B'
				state.themeColor= color
				uni.setStorage({
					key: 'themeColor',
					data: color
				})
			},
			loginIn(state, token) {
				state.token= token
				uni.setStorage({
					key: 'token',  
					data: token  
				}) 
			},
			loginOut(state) {
				state.token= ''
				uni.removeStorage({
					key: 'token'  
				})
			}
		},
		actions: {
			
		},
		getters: {
			updateListItemQuantity(state) {
				return (goodsList)=>{
					if(!Array.isArray(goodsList)){
						return []
					}
					goodsList.forEach(goods=>{
						goods.CurrentCartQuantity = 0
						if(state.cartsDictionaries[t(goods.GoodsCode)]){
							goods.CurrentCartQuantity = state.cartsDictionaries[t(goods.GoodsCode)].CurrentCartQuantity
						}
					})
					return goodsList
				}
			},//updateListItemQuantity end
			cartsTotal(state){
				return ()=>{
					return getTotal(state.cartsDictionaries)
				}
			}
		}
})
export default store