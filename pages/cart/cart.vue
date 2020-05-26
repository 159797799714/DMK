<template>
	<!-- <commonBox> -->
	<view class="content">
		<view class="cartList" v-if="status==1">
			<view class="flexs flex-end">
				<view class="" style="padding: 20rpx;" @click="show_edit">
					{{edit ? '完成':'管理'}}
				</view>
			</view>
			<view v-for="(item, index) in goodList" :key="index" class="list dis-flex flex-y-center">
				<view v-if="!item.IsInvalid" class="radio">
					<label class="radio"  @click.stop="slectCart(item)">
						<radio color="#FF303B" :value="item.radio" :checked="item.radio" :disabled="item.StoreQuantity<item.Quantity ? true:false"  />
					</label>
				</view>
				<view v-else class="IsInvalid col-f f-24">失效</view>
				<view class="proImg" @click="jump_proDetails(item.GoodsCode)">
					<image class="icon" :src="item.ImageUrl" mode="aspectFill"></image>
				</view>
				<view class="proList">
					<view class="title twoline-hidden p-re" :class="item.IsInvalid?'col-99': 'col-33'" @click="jump_proDetails(item.GoodsCode)">
						{{item.GoodsName}} {{item.WeightShort ? item.WeightShort:''}}
					</view>
					<image v-if="item.IsInvalid && !edit" src="../../static/delIcon.png" mode="" class="delIcon" @click="delGoods(item)"></image>
					<view class="line-price f-24 col-B1 text-line" v-if="parseFloat(item.MarketPrice) > parseFloat(item.Price)">
					¥{{toFixed(item.MarketPrice,10)}}
					</view>
					<view class="priceAndNum" :class="item.IsInvalid?'col-99': 'col-red'">
						<view class="price">
							¥ <text class="f-36">{{splitPrice(toFixed(item.Price))[0]}}.</text>
							<text class="f-32">{{splitPrice(toFixed(item.Price))[1]}}</text>
						</view>
						
						<view v-if="!item.IsInvalid" class="num">
							<view class="numView">							
								<view style="padding-left:20rpx; display: inline-block;">
									<view class="reduce" @click.stop="controlNum('curt', item, index)">-</view>
								</view>							
								<view class="selectNum"><input style="z-index: 1;font-weight: 400;" type="number" v-model="item.Quantity" @blur="blur(item, index)"/></view>															
								<view style="display: inline-block;">
									<view class="add" @click.stop="controlNum('add', item, index)">+</view>
								</view>
							</view>
						</view>
						
					</view>
				</view>
			</view>

			<!-- 免费送 -->
			<view v-if="freeGoodsList.length > 0" class="limit-buy">
				<view class="limit-head">
					<view>
						<text class="head-title">免费送</text>
						<view class="info f-24 col-99">单选</view>
					</view>
				</view>
				<scroll-view scroll-x="true" class="limit-good">
					<!-- <radio-group @change="selectFreeGood"> -->
					<view class="flexs flex-r">
					<!-- 	<label class="radio">
							<radio color="#FF303B" value="" :checked="freeIndex===-1"/>
						</label> -->
						<!-- <view @click="freeIndex=-1">取消选中</view> -->
						<view v-for="(item, index) in freeGoodsList" :style="index!=0 ? 'margin-left:20rpx':''"
						:key="index" class="limit-item flexs flex-v" :class="freeGoodsList.length==3 ? 'flex-1':''">
							<view style="width: 100%;" class="flexs flex-center top_item">
								<image :src="item.ImageUrl" mode="aspectFill" @click="jump_proDetails(item.GoodsCode)"></image>
							</view>
							<view class="limit-good-name f-24 col-33 twoline-hidden">{{item.GoodsName }} {{item.WeightShort}}</view>
							<view class="good-foot flexs flex-line" @click="selectFreeGood(index)">
								<label class="radio">
									<radio color="#FF303B" :value="index" :checked="freeIndex===index"/>
									<!-- @click.stop="selectFreeGood(index)" -->
								</label>
								<view>
									<view class="min-price col-red f-bold f-24">免费</view>
									<view class="line-price f-24 col-B1 text-line">¥{{toFixed(item.MarketPrice,10)}}</view>
								</view>
							</view>
						</view>
						
					</view>
					<!-- </radio-group> -->
				</scroll-view>
			</view>
		</view>
		<view style="width: 100%; height: 640rpx;" v-else-if="status==-1"></view>
    <view class="white flexs flex-v flex-center flex-line" v-else>	
    	<image src="../../static/zerocart.png" mode="widthFix" style="width: 690rpx;"></image>
			<text v-if="token" style="color:#999999;font-size:32rpx;">您的购物车还是空空的哦</text>
    </view>
		
		<view v-if="!token && token !== null" class="loginBtn col-f f-32 t-center" :style="{'background': themeColor}" @click.stop="goLogin">去登录</view>

		<!-- 猜你喜欢 -->
		<view v-if="token" class="likeList">
			<view class="title">
				<text class="centerTitle">猜你喜欢</text>
			</view>
			<view class="likeWrapper">
				<GoodTwoColumn :allProduceArr="allProduceArr" :isRequired="isRequired" :hasCart="false"></GoodTwoColumn>
			</view>
		</view>

		<!-- 底部提交按钮 -->
		<view v-if="goodList.length > 0" class="submitList flexs flex-r flex-line flex2"  style="z-index: 2;" >
			<view class="selectAll">
			  <block v-if="goodList.length">	
					<label class="radio" @click="selectAll" style="margin-top:10rpx">
						<radio value="" color="#FF303B" :checked="isSelectAll"/>
					</label>
					<text style="margin-left:20rpx">全选</text>
				</block>
			</view>
			<view class="totalList" v-if="!edit && goodList.length">
				<view class="total">
					<text>合计:</text>
					<text class="origin">¥</text>
					<text class="big">{{splitPrice(toFixed(total_price))[0]}}.</text>
					<text class="f-32 col-red">{{splitPrice(toFixed(total_price))[1]}}</text>
					<!-- <text class="big">{{toFixed(total_price)}}</text> -->
				</view>
				
				<view v-if="selectedArr.length>0 && total_price>0"  class="submitButton" :style="'background: '+themeColor" @click="submitOrder" >去结算</view>			</view>
			<view class="flexs flex-r totalList flex2 flex-line" v-else-if="goodList.length">
				<!-- <view class="" @click="deleteCart">
					清空购物车
				</view> -->
				<view class="submitButton" :style="'background: '+themeColor" @click="DeleteOrder">删除</view>
			</view>
		</view>
		
		<cartIcon ref="cartIcon"></cartIcon>
		
	</view>
</template>

<script>
	import GoodTwoColumn from "@/components/GoodTwoColumn.vue"
	import cartIcon from "@/components/cartIcon.vue"
	import {textToast,splitPrice, setNavigatorBg} from '@/common/utils.js'
	import updateProductStatus from '@/mixin/updateProductStatus.js'
	
	export default {
		mixins: [updateProductStatus],
		components: {
			GoodTwoColumn,
			cartIcon
		},
		computed: {
			cartsVersionNo(){
				setTimeout(()=>{
					this.updateBottomTabCarts()
				}, 100)
				return this.$store.state.cartsVersionNo
			}
		},
		data() {
			return {
				status:-1,
				toFixed:this.helper.toFixed,
				edit:false,
				goodList: [],                    // 已加入购物车列表
				selectedArr: [],                 // 购物车商品选中列表[true, fasle]代表第一个选中第2个未选中
				isSelectAll: false,              // 是否选中全部
				freeIndex: -1,                   // 选中的免费商品索引值
				freeGoodsList: [],               // 免费领取商品列表
				allProduceArr: [],               // 猜你喜欢列表
				CurrentPage: 1,
				total_price: 0,
				param:{
				  "GuessType": 1,
				  "Longi": 0,
				  "Lati": 0,
				  "CurrentPage": 1,
				  "PageSize": 6,
				},
				splitPrice: splitPrice,
				isRequired: false,
				token: null
			}
		},
		onShow() {
			this.requestAgain()
			uni.setTabBarBadge({
				index: 3, 
				text: this.$store.getters.cartsTotal(),
				fail(res){
					console.log(1111111222222222333333)
				}
			})
			let token= this.$store.state.token
			this.token= token
			console.log('token', token)
			if(token) {
				this.getCustomerCart()
				this.getFreeGoods()
				this.getGuessYou()
			} else {
				this.goodList= []
				this.selectedArr= []
				this.freeGoodsList= []
				this.allProduceArr= []
				this.CurrentPage= 1
				this.status= 0
			}
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: this.$store.state.themeColor,
				animation: {
					duration: 400,
					timingFunc: 'linear'
				}
			})
		},
		// 双击tab刷新
		onTabItemTap(e) {
			this.clickTime += 1
			if(this.clickTime > 1) {
				this.$refresh()
				this.requestAgain()
			}
			setTimeout(function () {
				this.clickTime= 0
			}.bind(this), 1000)
		},
		computed: {
			themeColor() {
				let color= this.$store.state.themeColor?this.$store.state.themeColor: '#FF303B'
				return color
			}
		},
		// 触底加载更多
		onReachBottom() {
			
			if(this.param.TotalPage>=this.param.CurrentPage){
				this.getGuessYou()
			}
		},
		onPageScroll() {
			this.$refs.cartIcon.isScroll()
		},
		methods: {
			updateList(){},
			async blur(item, index){
				let that= this
				if(!item.Quantity || item.Quantity < 1){
					item.Quantity=1
				}
				if(item.Quantity && item.Quantity>=item.StoreQuantity){
					item.Quantity=item.StoreQuantity
					console.log(item.Quantity,item.StoreQuantity)
				}
				// 更新购物车数量
				let params= {
					"CartId": item.CartId,
					"Quantity": item.Quantity,					
				}
				let res=await that.$request(that.$API.UpdateCustomerCart,params)
				if(res.Success===0){
					that.goodList[index].Quantity= item.Quantity
					that.compute(that.selectedArr)
					that.$store.commit('buy', {goods:that.goodList[index], count:that.goodList[index].Quantity})
				}	
			},
			requestAgain() {
				let token= this.$store.state.token
				this.token= token
				this.$refs.cartIcon.updateBottom()
				if(token) {
					this.getCustomerCart()
					this.getFreeGoods()
					this.getGuessYou()
				} else {
					this.goodList= []
					this.selectedArr= []
					this.freeGoodsList= []
					this.allProduceArr= []
					this.param.CurrentPage= 1
					this.status= 0
				}
			},
			async getGuessYou(){
				
				let param=this.param
				let res=await this.$request(this.$API.GetHomeRecommendGoods,param)
				console.log('猜你喜欢',res)
				if(res.Success===0){
					this.isRequired= true
					this.param.TotalPage=res.Data.TotalPage
					if(param.CurrentPage>1){
						this.allProduceArr=[...this.allProduceArr,...res.Data.Datas]
					}else{
						this.allProduceArr=res.Data.Datas
					}
					if(res.Data.TotalPage>=param.CurrentPage){
						this.param.CurrentPage++
					}
				}
			},
			jump_proDetails(id){
				uni.navigateTo({
					url:"/pagesA/proDetails/proDetails?id="+id
				})	
			},
			goLogin() {
				uni.navigateTo({
					url: '../login/login'
				})
			},
			show_edit(){
				if(this.goodList.length>0){
					this.edit=!this.edit
				}else{
					uni.showToast({
						icon:"none",
						title:"购物车已空",
						duration:1600
					})
				}
			},
			async compute(list){	
				if(list.length==0){
					this.total_price=0.0
					return
				}
				console.log('list',list)
				let GoodsCodes=[]
				list.forEach((e)=>{
					if(!e.IsInvalid) {
						GoodsCodes.push({
							"GoodsCode": e.GoodsCode,
							"Quantity": e.Quantity ? e.Quantity:1
						})	
					}
				})
				let param={
				  "GoodsCodes":GoodsCodes,
				  "TicketId":'',
				  "Longi":uni.getStorageSync('longitude'),
				  "Lati":uni.getStorageSync('latitude'),
				}
				let price_list=[]
				let res=await this.$request(this.$API.GetOrderPrice,param)
				if(res.Success===0){
					console.log('计算总价',res)
					res.Data.OrderGoodsPrices.forEach((e)=>{
						price_list.push(e)
					})
					this.total_price=res.Data.OrderPrice
					console.log('a',res.Data.OrderPrice,'b',this.total_price)
				}		
			},
			// 获取已加入购物车商品列表
			async getCustomerCart() {
				 let that = this,
						res =await this.$request(this.$API.GetCustomerCart)
					if(res.Data.length<1){
						this.edit=false
						this.isSelectAll=false
						this.selectedArr=[]
						that.goodList=[]
						this.status=0
					}else{
						this.status=1
					}
					
					let list=res.Data
					let new_list=[]
					list.forEach((e,i)=>{
						e.radio=false
						e.Price=this.helper.filter_fields(e)
						console.log('Price',e.Price)
						// if(!e.IsFree){
						// 	new_list.push(e)
						// }
						new_list.push(e)
					})
					this.selectedArr.forEach((el)=>{
						for(var i=0; i<new_list.length; i++) {
							if(el.CartId==new_list[i].CartId){
								new_list[i].radio=true
								el.Quantity=new_list[i].Quantity
							}
						}
					})
					that.goodList = new_list
					this.compute(this.selectedArr)
					console.log('Data',new_list)
			},
			// 删除失效商品
			async delGoods(item) {
				let sure=await this.showT('提示','确定删除此物品?',1)
				let param= {
					'CartId': [item.CartId]
				}
				if(sure) {
					let res =await this.$request(this.$API.DeleteSigleCustomerCart,param)
					if(res) {
						uni.showToast({
							icon:"success",
							title:"删除成功",
							duration:1600
						})
						this.compute([])
						this.getCustomerCart()
						this.$store.commit('clearCartsItem', [item])
					}
				}
			},
			// 选择免费单选商品
			selectFreeGood(index){
			 if(this.freeIndex===index){
				 this.freeIndex=-1
			 }else{
				 this.freeIndex=index
			 }
			},
			// 选择购物车商品
			slectCart(item) {
				if( item.Quantity > item.StoreQuantity){
					uni.showToast({
						title:"商品库存不足",
						icon:"none",
						duration:1600
					})
					item.radio=false
					return
				}
				item.radio=!item.radio
				
				if(item.radio){
					this.selectedArr.push(item)
				}else{
					let selectedArr=JSON.parse(JSON.stringify(this.selectedArr)) 
					selectedArr.forEach((items,i) => {
						if(items.CartId==item.CartId){
							selectedArr.splice(i,1);
						}
					})
					this.selectedArr=selectedArr
				}
				if(this.selectedArr.length==this.goodList.length){
					this.isSelectAll=true
				}else{
					this.isSelectAll=false
				}
				console.log('选中的selectedArr',this.selectedArr)
				this.compute(this.selectedArr)
			},
			submitOrder: function() {
				let order_list=this.selectedArr
				let VipGoodsCode=''
				if(this.freeIndex!=-1){
					VipGoodsCode=this.freeGoodsList[this.freeIndex].GoodsCode
				}
				this.selectedArr=[]
				this.isSelectAll=false
				uni.navigateTo({
					url: '/pagesA/firmOrder/firmOrder?order_list='+JSON.stringify(order_list)+'&VipGoodsCode='+VipGoodsCode
				})
			},
			// 底部选择全部/取消全选
			selectAll() {
				let _p=this
				this.isSelectAll=!this.isSelectAll
				let arr=[]
				if(!this.isSelectAll){
					arr=[]
				}
				this.goodList.forEach((e)=>{
					
					if(_p.isSelectAll){
						if(e.IsFree){
							e.Quantity=1
						}
						  e.radio=true
							if(!e.IsInvalid) {
								arr.push(e)
							}							
					} else{					
						  e.radio=false
					}
				})
				this.selectedArr=arr
				this.compute(this.selectedArr)
			},
			
			
			// 获取免费商品列表
			async getFreeGoods() {
				let that = this,
					paramData = {
						"Longi": uni.getStorageSync('longitude'),
						"Lati": uni.getStorageSync('latitude'),					
						"CurrentPage": that.CurrentPage,
						"PageSize": 0
					}
				let res =await that.$request(that.$API.GetFreeGoods,paramData)
					var arr = [],
						data = res.Data.Datas
						if(!data)return
					data.forEach((item) => {
						let obj = item
						arr.push(obj)
					})
					that.freeGoodsList = arr
					console.log('免费送商品',that.freeGoodsList)
				
			},
			async deleteCart(num) {
				let s=await this.showT('提示','确定清空购物车吗?',1)
				if(s){
					let res =await this.$request(this.$API.DeleteAllCustomerCart)
						console.log(res)
						if(res.Success==0){
							uni.showToast({
								icon:"success",
								title:"清除成功",
								duration:1600
							})
							this.getCustomerCart()
							this.edit=false
							this.$store.commit('clearCartsItem', 'all')
						}else{
							this.showT('错误',res.Message,0)
						}
				}
			},
			async DeleteOrder(){
				console.log('所选中删除的商品',this.selectedArr) 
				if(this.selectedArr.length<1){
					uni.showToast({
						icon:"none",
						title:"还没的商品哦",
						duration:1400
					})
					return
				}
				let s=await this.showT('提示','确定删除选中物品?',1)
				if(s){
					let CartId_list=[]
					let delShop = []
					for(let i=0; i<this.selectedArr.length;i++){
						if(!this.selectedArr[i].IsInvalid) {
							CartId_list.push(this.selectedArr[i].CartId)
							delShop.push(this.selectedArr[i])
						}
					}
				  this.selectedArr=[]
				  this.deleteOrder(CartId_list).then(res=>{
						if(res){
							this.$store.commit('clearCartsItem', delShop)
						}
					})	
				}
			},
			async deleteOrder(CartId_list){
				let param={"CartId":CartId_list}
				let res =await this.$request(this.$API.DeleteSigleCustomerCart,param)				
					console.log(res)
					if(res.Success==0){
						uni.showToast({
							icon:"success",
							title:"删除成功",
							duration:1600
						})
						this.compute([])
						this.getCustomerCart()
						this.$store.commit('clearCartsItem', CartId_list)
						return true
					}else{
						this.showT('错误',res.Message,0)
						return false
					}
			},
			// 控制数量 减curt 加add
			async controlNum(type, item, index) {
				if( item.Quantity >= item.StoreQuantity && type=='add'){
					uni.showToast({
						title:"商品库存不足",
						icon:"none",
						duration:1600
					})
					return
				}
				
				if(item.Quantity==1 && type=='curt'){
					
					let s=await this.showT('提示','确定删除该物品?',1)
					if(s){
						this.selectedArr.splice(index, 1)
						this.deleteOrder([item.CartId])
						this.$store.commit('clearCartsItem', [item])
					}
					return
				}                                                              
				let Quantity=item.Quantity
				let CartId=item.CartId
				let that= this
				switch(type){
					case 'curt':
						if(Quantity > 1) {
							Quantity=parseInt(item.Quantity) - 1
						} else {
							return
							// that.goodList.splice(index, 1)
						}
						break
					case 'add':
						Quantity=parseInt(item.Quantity) + 1
						break
				}
				let params= {
						"CartId": CartId,
						"Quantity": Quantity,					
					}
				let res=await this.$request(this.$API.UpdateCustomerCart,params)
				if(res.Success===0){
					console.log(Quantity, '数量', '1111111') 
					that.$store.commit('buy', {goods:that.goodList[index], count:Quantity})
					that.goodList[index].Quantity= Quantity
					that.selectedArr.forEach((e)=>{
						if(CartId==e.CartId){
							e.Quantity=Quantity
						}
					})
					this.compute(that.selectedArr)
				}	
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		// padding-top: 20upx;
		// padding-bottom: 126upx;
		padding:20upx 20rpx 126upx 20rpx;
		width: 100%;
		box-sizing: border-box;
		// overflow: scroll;
	}
	.white{
		margin-bottom: 40upx;
	}
	.loginBtn{
			margin: 0 auto;
			height: 72upx;
			line-height: 72upx;
			width: 180upx;
			border-radius: 36upx;
		}
	.cartList {
		// width: 639upx;
		background-color: #FFFFFF;
		border-radius: 12upx;
		padding: 0upx 24upx 20upx 24upx;
		// margin: 0 auto 28upx;
	}

	.cartList .list {
		font-size: 0;
		margin-bottom: 60upx;
	}

	.radio {
		width: 36upx;
		// height: 36upx;
		&>radio {
			width: 36upx;
			// height: 36upx;
			transform: scale(0.85);
		}
	}
	.IsInvalid{
		line-height: 1;
		padding: 8upx 12upx;
		border-radius: 20upx;
		background: #bebebe;
	}

	.list .radio radio {
		display: block;
	}

	.list .proImg {
		display: inline-block;
		vertical-align: middle;
		width: 134rpx;
		height: 134rpx;
		border: 1rpx solid #e9e9e9;
		border-radius: 8rpx;
		margin-left: 24rpx;
		margin-right: 32rpx;
		padding: 10rpx;
		&>image {
			width: 100%;
			height: 100%;
		}
	}

	.list .proList {
		flex: 1;
		box-sizing: border-box;
		padding-top: 18upx;
	}

	.list .proList .title {
		font-size: 28upx;
		line-height: 30upx;
		height: 60upx;
		margin-bottom: 17upx;
	}
	.delIcon{
		float: right;
		height: 40upx;
		width: 40upx;
		margin-top: -17upx;
	}
	.list .proList .priceAndNum {
		display: flex;
	}

	.proList .priceAndNum .price {
		flex: 1;
		font-size: 24upx;
	}

	.proList .priceAndNum .price .big {
		font-size: 32upx;
	}

	.proList .priceAndNum .num {
		flex: 1;
		font-size: 24upx;
		text-align: right;
	}

	.numView {
		display: inline-block;
		font-size: 0;
	}

	.numView .reduce {
		display: inline-block;
		vertical-align: middle;
		width: 40upx;
		height: 40upx;
		line-height: 40upx;
		text-align: center;
		background: rgba(255, 255, 255, 1);
		border: 1upx solid rgba(233, 233, 233, 1);
		border-radius: 4upx;
		font-size: 30upx;
		color: #333333;
	}

	.numView .selectNum {
		display: inline-block;
		vertical-align: middle;
		width: 60upx;
		height: 40upx;
		line-height: 40upx;
		text-align: center;
		font-size: 28upx;
		color: rgba(51, 51, 51, 1);
	}

	.numView .add {
		display: inline-block;
		vertical-align: middle;
		width: 40upx;
		height: 40upx;
		line-height: 40upx;
		background: rgba(255, 255, 255, 1);
		border: 1upx solid rgba(233, 233, 233, 1);
		border-radius: 4upx;
		font-size: 30upx;
		color: #333333;
		text-align: center;
	}


	/* likeList */
	.likeList {
		width: 702upx;
		margin: auto;
	}

	.likeList .title {
		width: 100%;
		line-height: 92upx;
		font-size: 32upx;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		text-align: center;
	}

	.likeList .title .centerTitle {
		position: relative;
	}

	.likeList .title .centerTitle::after {
		display: block;
		content: '';
		width: 90upx;
		height: 2upx;
		background: rgba(206, 206, 206, 1);
		position: absolute;
		left: -104upx;
		top: 50%;
		margin-top: -1upx;
	}

	.likeList .title .centerTitle::before {
		display: block;
		content: '';
		width: 90upx;
		height: 2upx;
		background: rgba(206, 206, 206, 1);
		position: absolute;
		right: -104upx;
		top: 50%;
		margin-top: -1upx;
	}

	.likeWrapper {
		font-size: 0;
		width: 100%;
	}

	.likeWrapper .leftWrapper {
		display: inline-block;
		vertical-align: top;
		width: 344upx;
		margin-right: 14upx;

	}

	.likeWrapper .rightWrapper {
		display: inline-block;
		vertical-align: top;
		width: 344upx;
		height: 100upx;

	}

	.listBox {
		width: 344upx;
		background: rgba(255, 255, 255, 1);
		border-radius: 16px;
	}

	.listBox .product {
		display: block;
		width: 344upx;
		height: 310upx;
	}

	.listBox .proTitle {
		font-size: 28upx;
		line-height: 29upx;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		margin-left: 20upx;
	}

	.listBox .proWarehose {
		padding: 0 24upx 0 20upx;
		font-size: 0;
		margin-top: 10upx;
	}

	.listBox .proWarehose .warehose {
		display: inline-block;
		vertical-align: middle;
		width: 50%;
		font-size: 24upx;
		line-height: 24upx;
		color: rgba(156, 156, 156, 1);
	}

	.listBox .proWarehose .produce {
		display: inline-block;
		vertical-align: middle;
		width: 50%;
		text-align: right;
		font-size: 24upx;
		line-height: 24upx;
		color: rgba(156, 156, 156, 1);
	}

	.listBox .priceWrapper {
		font-size: 0;
		padding: 0 24upx;
		margin-top: 17upx;
	}

	.listBox .priceWrapper .priceBox {
		display: inline-block;
		vertical-align: middle;
		width: 70%;
	}

	.priceWrapper .priceBox .priceSale {
		font-size: 0;
	}

	.priceWrapper .priceBox .nativePrice {
		font-size: 24upx;
		text-decoration: line-through;
		color: rgba(177, 177, 177, 1);
		margin-bottom: 24upx;
	}

	.priceBox .priceSale .price {
		display: inline-block;
		vertical-align: middle;
		font-size: 24upx;
		color: rgba(249, 90, 75, 1);
		margin-right: 20upx;
	}

	.priceBox .priceSale .price .priceNum {
		font-size: 40upx;
		color: rgba(249, 90, 75, 1);
		margin-left: 5upx;
	}

	.priceBox .priceSale .sale {
		display: inline-block;
		vertical-align: middle;
		font-size: 20upx;
		color: rgba(249, 90, 75, 1);
	}

	.listBox .priceWrapper .addCar {
		display: inline-block;
		vertical-align: middle;
		width: 30%;
		text-align: right;
	}

	.addCar .car {
		display: inline-block;
		width: 48upx;
		height: 48upx;
		border-radius: 50%;
		background: linear-gradient(-90deg, rgba(249, 90, 75, 1), rgba(241, 81, 66, 1));
	}

	// 免费送
	.limit-buy {
		padding-top: 9upx;

		.limit-head {
			margin-bottom: 40upx;
			display: flex;
			justify-content: space-between;

			.head-title {
				margin-right: 8upx;
				font-size: $f-36;
				line-height: $f-34;
				color: $color-33;
			}

			.time {
				display: inline-block;
				color: $color-red;

				.time-item {
					display: inline-block;
					margin: 0 12upx;
					width: 40upx;
					line-height: 28upx;
					font-size: $f-24;
					color: #fff;
					text-align: center;
					border-radius: 4upx;
					background-color: $color-red;
				}
			}

			.info {
				display: inline-block;
				margin-left: 20upx;
			}
		}

		.limit-good {
			.limit-item {
        width: 180rpx;
				padding-bottom: 13rpx;
				.top_item{
					&>image {
						width: 180rpx;
						height: 180upx;
						overflow: hidden;
					}
				}
				

				.limit-good-name {
					height: 70upx;
				}

				.good-foot {
					display: flex;

					.line-price {
						margin-top: 12upx;
						line-height: 20upx;
					}

					&>image {
						height: 48upx;
						width: 48upx;
					}

					.radio {
						margin-right: 40upx;
						// height: 36upx;
						width: 36upx;
					}
				}
			}
		}
	}

	/* submitList */
	.submitList {
		width: 100%;
		height: 98upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0upx -1upx 0upx 0upx rgba(240, 240, 240, 1);
		position: fixed;
		left: 0;
		bottom: 0;
	}

	.submitList .selectAll {
		padding-left: 48upx;
	}

	.submitList .totalList {
		padding: 0 20upx;
	}

	.submitList .totalList .total {
		margin-right: 30rpx;
		display: inline-block;
		vertical-align: middle;
		font-size: 28upx;
		color: rgba(51, 51, 51, 1);
	}

	.submitList .totalList .total .origin {
		font-size: 24upx;
		color: rgba(249, 90, 75, 1);
		padding-left: 10upx;
	}

	.submitList .totalList .total .big {
		font-size: 40upx;
		color: rgba(249, 90, 75, 1);
	}

	.submitList .totalList .submitButton {
		display: inline-block;
		vertical-align: middle;
		width: 228upx;
		height: 76upx;
		line-height: 76upx;
		text-align: center;
		border-radius: 38upx;
		font-size: 32upx;
		color: rgba(255, 255, 255, 1);
	}
</style>
<style>
	page{
		
		background: #f3f3f3;
	}
</style>
