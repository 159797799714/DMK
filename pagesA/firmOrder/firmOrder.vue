<template>
	<commonBox>
	<view class="content">
		<view class="bg" :style="'background: linear-gradient(0deg,rgba(255,48,59,0),'+themeColor+')'">
			
		</view>
		<view class="proList">
			<view class="addressWrapper bg-ff" @click="selectAddress" v-if="!address">
				<image class="addressIcon" src="../../static/location.png" mode="widthFix"></image>
				<view class="desc">请选择收货地址</view>
				<image class="moreIcon" src="../../static/moreIcon.png" mode=""></image>
			</view>
			<view class="listWrapper bg-ff" v-else>
				<view class="listBox" @click="selectAddress">
					<view class="addressList" style="position: relative;">
						<view class="flexs flex-r">
							<view class="addressName twoline-hidden">{{address.Address}}</view>
							<view class="detailName col-33 twoline-hidden">{{address.Floor}}</view>
						</view>
						<view class="name col-66 oneline-hidden">
							<text>{{address.CustomerName}}</text>
							<text class="phone">{{address.CustomerPhone}}</text>
						</view>
						<image class="moreIcon_v" src="../../static/moreIcon.png" mode=""></image>
					</view>
				</view>
			</view>
			<view class="cartList bg-ff">
				<view v-for="(item,index) in order_list" :key="index" class="list dis-flex flex-x-between flex-y-center">
					<view class="proImg" @click="jump_proDetails(item.GoodsCode)">
						<image class="icon" :src="item.ImageUrl" mode=""></image>
					</view>
					<view class="goodList">
						<view class="title twoline-hidden">{{item.GoodsName}} {{item.WeightShort ? item.WeightShort:''}}</view>
						<view class="line-price f-24 col-B1 text-line" v-if="parseFloat(item.MarketPrice) > parseFloat(item.Price)">
						¥{{toFixed(item.MarketPrice)}}</view>
						<view class="priceAndNum col-99">
							<view class="price">
								¥<text style="font-size: 28rpx;">{{splitPrice(toFixed(item.Price))[0]}}.</text>
								<text style="font-size: 24rpx;">{{splitPrice(toFixed(item.Price))[1]}}</text>
							</view>
						</view>
					</view>
					<view class="num">
						<view class="numView">
							<view style="padding-left:20rpx; display: inline-block;" @click.stop="controlNum('curt', item,index)">
							  <view class="reduce">-</view>
							</view>
							<view class="selectNum"><input style="z-index: 1;font-weight: 400;" :disabled="type" type="number" v-model="item.Quantity" @blur="blur(item)"/></view>
						<!-- 	<view class="selectNum">{{item.Quantity || 1}}</view> -->
							<view class="dis-inline-block" @click.stop="controlNum('add', item,index)">
							  <view class="add">+</view>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 免费送 -->
				<view v-if="!type && freeGoodsList.length" class="limit-buy">
					<view class="limit-head">
						<view>
							<text class="head-title">免费送</text>
							<view class="info f-24 col-99">单选</view>
						</view>
					</view>
					<scroll-view scroll-x="true" class="limit-good">
						<view class=" flexs flex-r">
							<view v-for="(item, index) in freeGoodsList" :style="index!=0 ? 'margin-left:20rpx':''"
						:key="index" class="limit-item flexs flex-v" :class="freeGoodsList.length==3 ? 'flex-1':''">
								<view style="width: 100%;" class="flexs flex-center top_item">
									<image :src="item.ImageUrl" mode="aspectFill"  @click="jump_proDetails(item.GoodsCode)"></image>
								</view>
								<view class="limit-good-name f-24 col-33 twoline-hidden">{{item.GoodsName }}
								{{item.WeightShort ? item.WeightShort:''}}</view>
								<view class="good-foot">
									<label class="radio" @click="selectFreeGood(index)" >
										<radio color="#FF303B" :value="index" :checked="freeIndex===index"/>
									</label>
									<view>
										<view class="min-price col-red f-bold f-24">免费</view>
										<view class="line-price f-24 col-B1 text-line">¥{{toFixed(item.MarketPrice,10)}}</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
			
			<view class="dispatchingList bg-ff">
				<view class="list">
					<view class="leftWrapper">
						商品金额
					</view>
					<view class="rightWrapper">
						¥
						<text class="big">{{splitPrice(toFixed(ActualPrice))[0]}}.</text>
						<text  class="f-32">{{splitPrice(toFixed(ActualPrice))[1]}}</text>
						<!-- toFixed( ,10)-->
					</view>
				</view>
				<view class="list">
					<view class="leftWrapper">
						配送费
					</view>
					<view class="rightWrapper">
						<!--¥ <text class="big">{{distribution_fee.toFixed(1)}}</text> -->
						<text style="font-size: 32upx;">免费</text>
					</view>
				</view>
			</view>
		</view>
		<view class="payList">
			<view class="list flexs flex2">
				<view class="leftWrapper">
					支付方式
				</view>
				<view class="rightWrapper">
					<text>微信</text>
					<image class="moreIcon" src="../../static/moreIcon.png" mode=""></image>
				</view>
			</view>
			<view class="list flexs flex2" @click="open">
				<view class="leftWrapper">
					优惠券
				</view>
				<view class="rightWrapper">
					<text v-if="coupon_text">已使用{{coupon_text}}元券</text>
					<text v-else-if="type">团购商品暂不支持使用优惠劵</text>
					<text v-else>{{TicketList.length < 1 ? '暂无优惠劵':'有'+TicketList.length+'张优惠劵'}}</text>
					<image class="moreIcon" src="../../static/moreIcon.png" mode=""></image>
				</view>
			</view>
			<view class="list flexs flex2">
				<view class="leftWrapper">
					订单备注
				</view>
				<view class="rightWrapper oneline-hidden flexs flex-line">					
						<input type="text" v-model="memo"  placeholder="选填"  style="margin-right: 40upx; z-index:1;"/>
				</view>
			</view>
		</view>
		<view class="submitWrapper" style="z-index:2;">
			<view class="totalPrice">
				<view class="label">
					合计:
				</view>
				<view class="price col-red">
					¥
					<text class="big">{{splitPrice(toFixed(total))[0]}}.</text>
					<text  class="f-32">{{splitPrice(toFixed(total))[1]}}</text>
				</view>
			</view>
			<view class="submitButton" :style="'background:'+themeColor" @click="place_order" v-if="order_list.length && total_price>0">
				<!-- place_order  WxPay-->
				提交订单
			</view>
		</view>
		<uni-popup ref="popup" type="bottom">
			<view class="pop_v" style="background-color: #F3F3F3; overflow: hidden;">
				<view class="p20 b_f" style="text-align: center; position: relative;">
					选择优惠卷   <text  style="font-size: 32rpx; position: absolute; right: 20rpx; font-weight: 600; padding:0 40upx;" @click="close">x</text>
				</view>
				
				<scroll-view scroll-y="true" class="listBox" style="height: 700upx">
					<view class=""  v-for="(item, index) in TicketList" :key="index" :style="index!=0 ? 'margin-top:20rpx':''">
					
					<view class="coupon-item" :style="item.IsUse ? 'margin-bottom:20upx':''"
					:class="item.IsUse ? '': 'used'" @click="select_item(item, index)">
						<view class="leftBox dis-flex flex-column flex-x-center flex-y-center flex-x-center">
							<view class="coupon-num">¥<text>{{item.TicketAmount}}</text></view>
							<view class="limit">{{item.PriceRule}}</view>
						</view>
						<view class="rightBox dis-flex flex-column flex-center">
							<view class="dis-flex flex-x-between flex-line">
								<view class="f-36 col-33 f-bold coupon-info">{{item.GoodsRule}}</view>
								<!-- <view v-if="tabIndex === 0" class="btn col-red">立即使用</view>
								<view v-else class="invalid-icon" :class="tabIndex === 1?'used-icon': ''"/> -->
								<label class="radio" v-show="item.IsUse">
									<radio color="#FF303B" value="" :checked="s_index==index ? true:false" /><text></text>
								</label>
							</view>
							<view class="time">{{item.StarDate.replace(/-/gi, '.')}}-{{item.EndDate.replace(/-/gi, '.')}}</view>
						</view>
						
					</view>
					<view class="" style="padding: 10upx; color: #A4A4A4; background-color: #ECECEC;" v-if="!item.IsUse">
						所结算商品未满{{item.OrderAmount}}元
					</view>
					
					</view>
				</scroll-view>
				
			    <view class="p20">
			    	<button :style="'color: #fff;background:'+themeColor" @click="close_pop" style="border-radius: 46upx;">确定</button>
			    </view>
			</view>
		</uni-popup>
		
		<uni-popup ref="groupInfo"  type="center">
			<view class="groupMain col-33">
		   <view class="title t-center f-36">温馨提示</view>
				<view class="words f-32">   团购活动按原价进行拼团，成功后按团购活动实际人数折扣退回差额，不足最低团购人数将全部退还！</view>
				<view class="popup-btn col-f dis-flex flex-x-center">
					<view class="cancelBtn bg-D8" @click="giveUpGroup">放弃团购</view>
					<view class="sureBtn" :style="'background: '+themeColor" @click="closeGroupPopup">确认团购</view>
				</view>
			</view>
		</uni-popup>
		
	</view>
	</commonBox>
</template>

<script>
	import {textToast,splitPrice} from '@/common/utils.js'
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import commonBox from "@/components/commonBox.vue"
	export default{
		components: {uniPopup, commonBox},
		data() {
			return {
				toFixed:this.helper.toFixed,
				order_list:[],  //商品列表
				distribution_fee:0.0, //配送费
				total_price:0,
				ActualPrice: 0,           // 商品总金额
				total:0,
				address:'', //收货地址列表
				type: '',   // 不为空的时候group为团购商品的确认订单操作
				freeGoodsList: [],
				memo:'',
				CurrentPage:1,
				freeIndex:-1,
				TicketList:[],
				status_list:[],
				tabIndex:0,
				s_index:-1,
				id:'',
				couponId:'',
				coupon_text:'',
				getLoginCode:'',
				count:0,
				ShareId: '',
				splitPrice:splitPrice,
				themeColor: this.$store.state.themeColor
			}
		},
		onLoad(e) {
			let _this=this
			if(e.order_list){
				e.order_list= decodeURIComponent(e.order_list)
				e.order_list=JSON.parse(e.order_list)	
				let free_id=''
				if(e.VipGoodsCode){
					free_id=e.VipGoodsCode
				}
				let order_list=[]
				let goodscode=[]
				e.order_list.forEach((el,i)=>{
						order_list.push(el)
					if(!el.Quantity){
						el.Quantity=1
					}
					el.Price=_this.helper.filter_fields(el)
				})
				if(free_id){
					this.free_id=free_id
				}else{
					this.freeIndex=-1
				} 
			   this.order_list=order_list
			   console.log('传过来的list',this.order_list,this.freeGoodsList)
			   this.GetMyUnUseTicket()
			} else if(e.type === 'createGroup') {
				this.openGroupPopup()
				let arr= [],
					obj= JSON.parse(e.obj)
					obj.Price=obj.MarketPrice
				console.log('创建团购', e.type, '传过来的obj', obj)
				arr.push(obj)
				this.order_list= arr
				this.type= e.type
				this.total= obj.MarketPrice
				this.total_price= obj.MarketPrice
				this.ActualPrice= obj.MarketPrice
			}  else if(e.type === 'joinGroup') {
				this.openGroupPopup()
				let arr= [],
					obj= JSON.parse(e.obj)
					obj.Price=obj.MarketPrice
				console.log('加入团购', e.type, '传过来的obj', obj)
				arr.push(obj)
				this.ShareId= obj.ShareId
				this.order_list= arr
				this.type= e.type
				this.ActualPrice= obj.MarketPrice
				this.total_price= obj.MarketPrice
				this.total= obj.MarketPrice
			}
		},
		onShow() {
			this.$setNavigatorBg()
			this.GetMineAddress();
			this.getFreeGoods();
			
		},
		methods: {
			jump_proDetails(id){
				uni.navigateTo({
					url:"/pagesA/proDetails/proDetails?id="+id
				})	
			},
			blur(item){
				console.log(item)
				item.Quantity=parseInt(item.Quantity)
				if(item.Quantity===0){
					item.Quantity=1
					console.log('进来了',item.Quantity)
				}
				if(item.Quantity && item.Quantity>=item.StoreQuantity){
					item.Quantity=item.StoreQuantity
					console.log(item.Quantity,item.StoreQuantity)
				}
				this.compute(this.order_list)
			},
			openGroupPopup() {
				this.$refs.groupInfo.open()
			},
			// 确认团购
			closeGroupPopup() {
				this.$refs.groupInfo.close()
			},
			// 放弃团购
			giveUpGroup() {
				this.$refs.groupInfo.close()
				uni.navigateBack({
					delta: 1
				})
			},
			open(){
				if(this.TicketList.length){
					let t_list=this.TicketList
					t_list.forEach((e)=>{
						if(this.total_price>=e.OrderAmount){
							e.IsUse=true
						}else{
							e.IsUse=false
						}
					})
					this.$refs.popup.open()
				}
			},
			close(){
				this.$refs.popup.close()
			},
			close_pop(){
				if(this.id && this.s_index!=-1){
					this.couponId=this.id
				}else{
					this.couponId=''
					this.coupon_text=''
				}
			    this.$refs.popup.close()
				this.compute(this.order_list)
			},
			select_item(item, index){
				if(index==this.s_index){
					this.s_index=-1
					this.id=''
					return
				}
				this.id=item.TicketId
				this.s_index=index
				this.coupon_text=item.TicketAmount
				
			},
			async GetMyUnUseTicket(){
				let res=await this.$request(this.$API.GetMyUnUseTicket)
				console.log('res可使用的电子卷',res)
				res.Data.forEach((item, index) => {
					item.EndDate= item.EndDate.slice(0, 10)
					item.StarDate= item.StarDate.slice(0, 10)
					item.radio=false
				})							
				this.TicketList=res.Data
				this.getTicketList()
				this.compute(this.order_list)
			},
			// 选择免费单选商品
			selectFreeGood(index){
			 if(this.freeIndex===index){
				 this.freeIndex=-1
			 }else{
				 this.freeIndex=index
			 }
			},
			async WxPay(Data){
				let PayData=JSON.parse(Data.JsonRequest)
				let _p=this
				let resp=await this.$WxPay(PayData)
				console.log('resp',resp)
				if(resp){
					_p.CheckMyOrderPay(Data.OrderNumber )
				}else{
					this.$Toast('支付失败')
					uni.redirectTo({
						url:"/pagesB/orderDetails/orderDetails?OrderNumber=" +  Data.OrderNumber
					})
				}
			},
			async CheckMyOrderPay(OrderNumber){
				let param={"OrderNumber": OrderNumber}
				let resp=await this.$request(this.$API.CheckMyOrderPay,param)
				console.log(resp)
				if(resp.Success==0){
					this.count=0
					uni.hideLoading()
					uni.showToast({
						icon:"success",
						title:'支付成功',
						duration:1600
					})
					setTimeout(function(){
						uni.redirectTo({
							url:"/pagesB/orderDetails/orderDetails?OrderNumber=" + OrderNumber
						})
					},1600)
				}else{
					if(this.count<5){
						this.count++
						this.CheckMyOrderPay(OrderNumber)
					}else{
						this.count=0
						uni.redirectTo({
							url:"/pagesB/orderDetails/orderDetails?OrderNumber="+OrderNumber
						})
					}
					
				}
			},
			async GetMineAddress(){
				let that=this,
					id=this.vue_g.AddressId ? this.vue_g.AddressId:'',
					params = {
						"SourceOrder": 1
					},
					res = await that.$request(that.$API.GetCustomerAddr,params)
					if(res.Data.length>0){
						if(id){
							res.Data.forEach((e,i)=>{
								if(e.CustomerAddressId==id){
									that.address=res.Data[i]
								}
							})
						}else{
							that.address=res.Data[0]
						}
					}
			},
			// 获取免费商品列表
			async getFreeGoods() {
				var that = this,
					paramData = {
						// "StoreCode": '',
						"Longi": uni.getStorageSync('longitude'),
						"Lati": uni.getStorageSync('latitude'),					
						"CurrentPage": that.CurrentPage,
						"PageSize": 0
					}
				let res =await this.$request(this.$API.GetFreeGoods,paramData)
					var arr = [],
						data = res.Data.Datas
						if(!data)return
						let n=0
					if(res.Data.Datas.length > 0) {
						data.map((item,i) => {
							item.Quantity=1
							let obj = item
							if(that.free_id && that.free_id==item.GoodsCode){
								that.freeIndex=i
								n=n+1
							}
							arr.push(obj)
						})	
					}
					if(n===0){
						that.freeIndex=-1
					}
					that.freeGoodsList = arr
					console.log('免费送商品',this.freeGoodsList)
				
			},
			async deleteOrder(CartId_list,index){
				let param={"CartId":CartId_list}
				let res =await this.$request(this.$API.DeleteSigleCustomerCart,param)				
					console.log(res)
					if(res.Success==0){
							uni.showToast({
								icon:"success",
								title:"删除成功",
								duration:1600
							})
							// this.compute([])
							// this.getCustomerCart()
							this.order_list.splice(index,1)
							this.compute(this.order_list)
					}else{
						this.showT('错误',res.Message,0)
					}
			},
			// 控制数量 减curt 加add
			async controlNum(type,item,index) {
				if(this.type) {
					uni.showToast({
						title: '每次团购只能购买一个商品哦',
						icon: 'none'
					})
					return
				}
				console.log(item)
				if(item.StoreQuantity <=item.Quantity && type=="add"){
				  this.$Toast('该商品库存不足')
					return
				}
				if(item.Quantity==1 && type=='curt'){
					if(this.order_list.length<=1){
						return
					}
					let s=await this.showT('提示','确定删除该物品?',1)
					if(s){
						this.$store.commit('clearCartsItem', [item])
						this.deleteOrder([item.CartId],index)
					}
					return
				}
				let that= this
				switch(type){
					case 'curt':
						if(item.Quantity > 1) {
							item.Quantity=parseInt(item.Quantity) - 1
						} else {
							return
							// that.goodList.splice(index, 1)
						}
						break
					case 'add':
						item.Quantity=parseInt(item.Quantity) + 1
						break
				}
				let params= {
						"CartId": item.CartId,
						"Quantity": item.Quantity,
						"SourceOrder": 1
					}
				let res= await that.$request(that.$API.UpdateCustomerCart, params)
				
				this.$store.commit('buy', {goods: item, num:item.Quantity})
				that.order_list[index].Quantity= item.Quantity
				this.compute(that.order_list)
				
			},
			getTicketList(){
				let list = this.order_list
				let t_list = this.TicketList
				let GoodsCodes=[]
				list.forEach((e)=>{
					GoodsCodes.push({
					  "GoodsCode": e.GoodsCode,
					  "Quantity": e.Quantity
					})
				})
				
				let status_list=[]
				t_list.forEach((e,i)=>{
					if(!e.GoodsCode){
						status_list.push(e)
					}else{
						let num=0
						GoodsCodes.forEach((el)=>{
							//console.log('GoodsCodes',e.GoodsCodes)
							let status=e.GoodsCodes.indexOf(el.GoodsCode)
							//console.log('stasus',status)
							if(status!=-1){
								num++
							}						
						})
						if(num==GoodsCodes.length){
							status_list.push(e)
						}
					}
				})
				//console.log('status_list',status_list)
				
				this.TicketList=status_list
			},
			async compute(list, time){
				console.log('list',list)
				let that= this,
					GoodsCodes=[]
			    let total_price=0
					let add=0
				list.forEach((e)=>{
					add=this.helper.floatMul(e.Price,e.Quantity)
					total_price=this.helper.floatAdd(add,total_price)
					GoodsCodes.push({
					  "GoodsCode": e.GoodsCode,
					  "Quantity": e.Quantity
					})
				})
        console.log('优惠卷ID',this.couponId)
				let param={
				  "GoodsCodes":GoodsCodes,
				  "TicketId": this.couponId
				}
				let price_list=[]
				let res=await that.$request(that.$API.GetOrderPrice, param,'',1)
				if(res.Success===0){
					console.log('计算总价',res)
					if(res.Data.OrderPrice<0){
						this.couponId='',
						this.id=''
						this.s_index=-1
						this.coupon_text=''
						this.compute(list)
					}
					res.Data.OrderGoodsPrices.forEach((e)=>{
						price_list.push(e)
					})
					that.total_price=total_price
					that.ActualPrice= res.Data.ActualPrice
					that.total=that.distribution_fee+res.Data.OrderPrice
					
				} else{
					time++
					console.log('失败',res, list)
					this.$Toast(res.Message)
					this.couponId='',
					this.id=''
					this.s_index=-1
					this.coupon_text=''
					
					// this.compute(list, 1)
				}
				
			},
			async place_order(){
				if(!this.$stopAction(1)) {
					return
				}
				
				this.getLoginCode =await this.helper.getLoginCode(this)
				let that= this
				if(that.type === 'createGroup') {
					that.createGroupOrder()
					return
				} else if(that.type === 'joinGroup') {
					that.joinGroupOrder()
					return
				}
				uni.showLoading({
					title:"提交中..."
				})

				let order_list=that.order_list
				let GoodsCodes=[]
				let VipGoodsCode=''
				if(that.freeIndex!=-1){
					 VipGoodsCode=that.freeGoodsList[that.freeIndex].GoodsCode
				}
				order_list.forEach((e)=>{
					GoodsCodes.push({
						"GoodsCode": e.GoodsCode,
						"Quantity":e.Quantity 
					})
				})
				let params={
				  "PayType": 1,
				  "GoodsCodes": GoodsCodes,
				  "CustomerAddressId": that.address.CustomerAddressId,
				  "Longi": uni.getStorageSync('longitude'),
				  "Lati": uni.getStorageSync('latitude'),	
				  "Memo":that.memo ? that.memo : '',
				  "TicketId": this.couponId,
				  "CustomerCode":this.getLoginCode,
					"VipGoodsCode": VipGoodsCode
				}
				console.log('请求参数',params)
				let res= await that.$request(that.$API.CreateOrder, params)
				console.log('订单清空啊啊啊啊啊啊啊啊啊啊啊', res.Data)
				if(res.Success==0){
					this.$store.commit('clearCartsItem', order_list)
					if(res.Data.JsonRequest==null && res.Data.OrderNumber){
						uni.redirectTo({
							url:"/pagesB/orderDetails/orderDetails?OrderNumber="+ res.Data.OrderNumber
						})
					}else{
						this.WxPay(res.Data)
					}
				}
			},
			// 创建团购单
			async createGroupOrder() {
				uni.showLoading()
				let that= this,
					params= {
						"PayType": 1,
						"GoodsCode": that.order_list[0].GoodsCode,
						"CustomerAddressId": that.address.CustomerAddressId,
						"Appip": "",
						"CustomerMemo": that.memo,
						"CustomerCode": ''
					}
				let resCode= await that.helper.getLoginCode()
				params.CustomerCode= resCode	
				
				let orderRes= await that.$request(that.$API.CreateGroupOrder, params)
				console.log('orderRes', orderRes)
				
				let JsonRequest= JSON.parse(orderRes.Data.JsonRequest),
					orderParams= {
						"PayType": 1,
						"OrderNumber": orderRes.Data.OrderNumber,
						"Appip": '',
						"CustomerCode": ''
					}
				// 创建完成进入支付
				that.payAction(orderRes.Data.OrderNumber, JsonRequest, orderParams)
			},
			// 加入团购
			async joinGroupOrder(){
				console.log('this.ShareId', this.ShareId)
				let that= this,
					params= {
						"PayType": 1,
						"GroupCode": that.order_list[0].GroupCode,
						"CustomerAddressId": that.address.CustomerAddressId,
						"Appip": '',
						"CustomerCode": '',
						"ShareId": that.ShareId?that.ShareId: ''
					}
				
				let resCode= await that.helper.getLoginCode()
				params.CustomerCode= resCode
					
				let orderRes= await that.$request(that.$API.JoinGroupOrder, params)
				
				let  JsonRequest= JSON.parse(orderRes.Data.JsonRequest),
					orderParams= {
						"PayType": 1,
						"OrderNumber": orderRes.Data.OrderNumber,
						"Appip": '',
						"CustomerCode": ''
					}
				that.payAction(orderRes.Data.OrderNumber, JsonRequest, orderParams)
				
			},
			// 加入团购支付操作
			async payAction(OrderNumber, JsonRequest, params) {
				let that= this
				let response= await that.$WxPay(JsonRequest)
				uni.hideLoading()
				if(!response) {
					that.$Toast('取消支付')
				}
				this.checkPayStatus(OrderNumber, JsonRequest, params)
			},
			// 查询支付结果
			async checkPayStatus(OrderNumber, JsonRequest, params, callbackNum) {
				let num= callbackNum?callbackNum: 1
				let that= this,
					paramData= {"GroupCode": OrderNumber},
					response= await that.$request(that.$API.CheckMyGroupOrderPay, paramData)
					console.log('response.Data', response.Data)
				if(response.Data) {
					uni.redirectTo({
						url: '/pagesB/payState/payState?type=1&GroupOrderNumber=' + OrderNumber
					})	
				} else if(num < 5){
					num += 1
					that.checkPayStatus(OrderNumber, JsonRequest, params, num)
					return
				} else {
					console.log('JsonRequest', JsonRequest)
					uni.setStorageSync('JsonRequest', JsonRequest)
					uni.redirectTo({
						url: '/pagesB/payState/payState?type=0&GroupOrderNumber=' + OrderNumber + '&params=' + JSON.stringify(params)
					})	
				}
			},
			selectAddress() {
				let that= this
				let addressId= that.address?'&addressId='+ that.address.CustomerAddressId: ''
				uni.navigateTo({
					url:'../addressList/addressList?type=Sorder' + addressId
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		background: #f3f3f3;
		padding-bottom: 120upx;
		box-sizing: border-box;
		height: 100%;
		overflow: scroll;
	}
	.pop_v{	
		width: 100%;
		box-sizing: border-box;
		border-radius: 20upx  20upx   0  0;
	}
	.moreIcon_v{
		position: absolute;
		width: 50upx;
		height: 50upx;
		right: 0;
		top:50rpx;
	}
	.bg {
		width:750rpx;
		height:344rpx;
	}
	.listWrapper {
		width: 100%;
		border-radius:12rpx;
		margin: 0 auto 20rpx; 
	}
	.listWrapper .listBox {
		padding: 0 24rpx;	
	}
	.addressList {
		position: relative;
		padding-top: 20upx;
		border-bottom: 1rpx solid #EAEAEA;
	}
	.addressList .addressName {
		max-width: 150upx;
		font-size:32rpx;
		font-weight:bold;
		color:rgba(51,51,51,1);
		padding: 0 20rpx 0 0;
		margin-bottom: 20rpx;
		// margin-bottom: 27rpx;
	}
	.addressList .detailName {
		font-size:28rpx;
		margin-left: 23rpx;
		padding-right: 60upx;
	}
	 .addressList .name {
		font-size:28rpx;
		margin-bottom: 19rpx;
	}
	 .addressList .name .phone {
		padding-left: 10rpx;
	}
	 .addressList .editoIcon {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		right: 24rpx;
		top: 50%;
		margin-top: -20rpx;
	}
	 .addressList .editoIcon .icon {
		display: block;
		width: 40rpx;
		height: 40rpx;
	}
	.addressWrapper {
		width:669rpx;
		height:116rpx;
		line-height: 116rpx;
		background:rgba(255,255,255,1);
		border-radius:12rpx;
		margin: 0 auto 20rpx;
		padding: 0 9rpx 0 24rpx;
		position: relative;
	}
	.addressWrapper .addressIcon {
		display: inline-block;
		vertical-align: middle;
		width: 20rpx;
		height: 26rpx;
		margin-right: 24rpx;
	}
	.addressWrapper .desc {
		display: inline-block;
		vertical-align: middle;
		font-size:36rpx;
		font-weight:bold;
		color:rgba(51,51,51,1);
	}
	.addressWrapper .moreIcon {
		display: inline-block;
		vertical-align: middle;
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		right: 9rpx;
		top: 50%;
		margin-top: -20rpx;
	}
	/* proList */
	.proList{
		width: 702rpx;
		border-radius: 12rpx;
		margin: -324rpx auto 0;
	}
	.cartList {
		border-radius:12upx 12upx 0 0;
		padding: 0 24upx 28upx;
		.list {
			font-size: 0;
			padding: 30upx 0;
		}
	}
	
	.list .radio {
		display: inline-block;
		vertical-align: middle;
	}
	.radio{
		width:36upx;
		height:36upx;
		transform: scale(0.75);
	}
	.list .radio radio {
		display: block;
	}
	.list .proImg {
		width:128upx;
		height:128upx;
		border-radius:8upx;
		margin-right: 32upx;
		&>image{
			width: 100%;
			height: 100%;
			background: #f5f5f5;
		}
	}
	.list .goodList {
		flex: 1;
		box-sizing: border-box;
		padding-top: 18upx;
		overflow: hidden;
	}
	.list .goodList .title {
		font-size: 32upx;
		// line-height: 34upx;
		color:rgba(51,51,51,1);
		margin-bottom: 13upx;
	}
	.list .goodList .priceAndNum {
		display: flex;
	}
	.goodList .priceAndNum .price {
		flex: 1;
		font-size: 28upx;
	}
	.num {
		margin-left: 20upx;
		font-size: 24upx;
		font-weight: bold;
	}
	.numView {
		display: inline-block;
		font-size: 0;
	}
	.numView .reduce {
		display: inline-block;
		vertical-align: middle;
		width:40upx;
		height:40upx;
		line-height: 40upx;
		text-align: center;
		background:rgba(255,255,255,1);
		border:1upx solid rgba(233, 233, 233, 1);
		border-radius:4upx;
		font-size: 30upx;
		color: #c1c1c1;
	}
	.numView .selectNum {
		display: inline-block;
		vertical-align: middle;
		width: 60upx;
		height: 40upx;
		line-height: 40upx;
		text-align: center;
		font-size:28upx;
		color:rgba(51,51,51,1);
	}
	.numView .add {
		display: inline-block;
		vertical-align: middle;
		width:40upx;
		height:40upx;
		line-height: 40upx;
		background:rgba(255,255,255,1);
		border:1upx solid rgba(233, 233, 233, 1);
		border-radius:4upx;
		font-size: 30upx;
		color: #c1c1c1;
		text-align: center;
	}
	
	// 免费送
	.limit-buy{
		padding-top: 9upx;
		.limit-head{
			margin-bottom: 40upx;
			display: flex;
			justify-content: space-between;
			.head-title{
				margin-right: 8upx;
				font-size: $f-36;
				line-height: $f-34;
				color: $color-33;
			}
			.time{
				display: inline-block;
				color: $color-red;
				.time-item{
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
			.info{
				display: inline-block;
				margin-left: 20upx;
			}
		}
		.limit-good{
			.limit-item {
			  min-width: 180rpx;
				.top_item{
					&>image {
						width: 180rpx;
						height: 180upx;
						overflow: hidden;
					}
				}
				.limit-good-name{
					height: 63upx;
				}
				.good-foot{
					display: flex;
					.line-price{
						margin-top: 12upx;
						line-height: 20upx;
					}
					&>image{
						height: 48upx;
						width: 48upx;
					}
					.radio{
						margin-right: 40upx;
						height: 36upx;
						width: 36upx;
						transform: scale(0.75);
					}
				}
			}
		}
	}
	
	
	.dispatchingList {
		padding:24rpx;
		border-radius: 0 0 12upx 12upx;
	}
	.dispatchingList .list {
		width: 100%;
		height: 95rpx;
		line-height: 95rpx;
		border-top: 1rpx solid #EAEAEA;
		display: flex;
	}
	.dispatchingList .list .leftWrapper {
		flex: 1;
		font-size:32rpx;
		color:rgba(51,51,51,1);
	}
	.dispatchingList .list .rightWrapper {
		flex: 1;
		text-align: right;
		font-size:24rpx;
		color:rgba(51,51,51,1);
	}
	.dispatchingList .list .rightWrapper .big {
		font-size: 40rpx;
	}
	.payList {
		width: 654rpx;
		background:rgba(255,255,255,1);
		border-radius:12rpx;
		padding: 0 24rpx;
		margin: 20rpx auto 0;
	}
	.payList .list {
		width: 100%;
		height: 95rpx;
		line-height: 95rpx;
		border-bottom: 1rpx solid #EAEAEA;
		display: flex;
	}
	.payList .list:nth-last-child(1){
		border-bottom: none;
	}
	.payList .list .leftWrapper {
		// flex: 1;
		font-size:32rpx;
		// font-weight:bold;
		color:rgba(51,51,51,1);
	}
	.payList .list  .rightWrapper {
		// flex: 1;
		text-align: right;
		font-size:32rpx;
		color:rgba(51,51,51,1);
	}
	.payList .list  .rightWrapper .moreIcon{
		display: inline-block;
		vertical-align: middle;
		width: 40rpx;
		height: 40rpx;
	}
	/* submitWrapper */
	.submitWrapper {
		width: 100%;
		box-sizing: border-box;
		padding: 0 24upx;
		height:98rpx;
		line-height: 98rpx;
		background:rgba(255,255,255,1);
		box-shadow:0px -1px 0px 0px rgba(240,240,240,1);
		text-align: right;
		position: absolute;
		left: 0;
		bottom: 0;
	}
	.submitWrapper .totalPrice {
		display: inline-block;
		vertical-align: middle;
	}
	.submitWrapper .totalPrice .label {
		display: inline-block;
		vertical-align: middle;
		font-size:28rpx;
		color:rgba(51,51,51,1);
	}
	.submitWrapper .totalPrice .price {
		display: inline-block;
		vertical-align: middle;
		font-size:24rpx;
	}
	.submitWrapper .totalPrice .price .big {
		font-size: 40rpx;
	}
	.submitWrapper .submitButton {
		display: inline-block;
		vertical-align: middle;
		width:228rpx;
		height:76rpx;
		line-height: 76rpx;
		text-align: center;
		border-radius:38rpx;
		font-size:32rpx;
		color:rgba(255,255,255,1);
		margin: 0 0 7rpx 31upx;
	}
	.listBox{
		box-sizing: border-box;
		padding: 20upx 24upx;
		.coupon-item{
			height: 220upx;
			width: 100%;
			background-image: url('../../static/coupon_red.png');
			background-size: cover;
			.leftBox{
				float: left;
				width: 240upx;
				height: 100%;
				text-align: center;
				color: #fff;
				.coupon-num{
					font-size: 40upx;
					vertical-align: bottom;
					line-height: 60upx;
					&>text{
						font-size: 80upx;
					}
				}
				.limit{
					margin-top: 32upx;
					font-size: 24upx;
					line-height: 1em;
				}
			}
			.rightBox{
				float: right;
				position: relative;
				width: 372upx;
				padding: 0 44upx;
				height: 100%;
				// .coupon-info{
				// 	white-space: nowrap;
				// 	line-height: 48upx;
				// }
				.btn{
					padding: 0 18upx;
					border: 1px solid $color-red;
					border-radius: 24upx;
					line-height: 48upx;
					font-size: 24upx;
					white-space: nowrap;
				}
				.time{
					margin-top: 23upx;
					color: #999;
					font-size: 24upx;
					line-height: 20upx;
				}
				.invalid-icon{
					position: absolute;
					height: 132upx;
					width: 132upx;
					right: 0;
					top: 20upx;
					background-size: cover;
					background-image: url(../../static/invalid.png);
				}
				.used-icon{
					background-image: url(../../static/used.png)
				}
			}
		}
		.used{
			background-image: url('../../static/coupon_gray.png');
		}
	}
	.groupMain{
		box-sizing: border-box;
		padding: 24upx;
		min-height: 450upx;
		width: 550upx;
		background-color: #F0F0F5;
		border-radius: 12upx;
		.title{
			margin-bottom: 20upx;
			line-height: 80upx;
		}
		.word{
			line-height: 45upx;
		}
		.popup-btn{
			margin-top: 100upx;
			width: 100%;
			.cancelBtn,.sureBtn{
				display: inline-block;
				padding: 15upx 30upx;
				vertical-align: center;
				line-height: 1;
				text-align: center;
				border-radius: 50upx;
			}
			.cancelBtn{
				margin-right: 60upx;
			}
		}
	}
</style>
<style>
</style>
