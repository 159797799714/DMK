<template>
	<view class="content">
		<view class="contentList"  v-if="allProduceArr.length"> 
			<view class="contentList_v">
				<view class="flexs flex-r flex-end"  @click="edit=!edit"
				:style="'padding: 20rpx 40rpx; background-color:#fff;color:'+[edit ? themeColor:'#333333']+';'">
					{{edit ? '完成':'编辑'}}	
				</view>
				
				<view class="flexs flex-r goods_v" v-for="(item,i) in allProduceArr" :key="i" style="position: relative;" @click="goDetail(item.GoodsCode)">
					<view class="flexs flex-line" v-if="edit">
						<view class="radio">
							<label class="radio"  @click.stop="selectCart(item)">
								<radio color="#FF303B" :value="item.radio" :checked="item.radio"  />
							</label>
						</view>
					</view>
					<view class="goods_v_left">
						<image :src="item.ImageUrl" mode="" ></image>
					</view>
					<view class="goods_v_right flexs flex-v flex2">
						
						<view class="top_v">
							<text class="top_txet" :class="item.IsInvalid?'col-99':'col-33'">{{item.GoodsName}} {{item.WeightShort}}</text> 
						</view>
						<view class="flexs flex-r flex2">
							<view :class="item.IsInvalid?'col-99':'col-red'">
								<text style="font-size: 24rpx;">¥</text>
								<text class="left_text">{{toFixed(item.MarketPrice)}}</text>
							</view>
							<view v-if="!item.IsInvalid" class="cart-box">
								<view v-show="item.CurrentCartQuantity> 0" class="num-info">{{item.CurrentCartQuantity}}</view>
								<image style="width: 48rpx;height: 48rpx;"  src="../../static/cart.png" mode="" @click.stop="createCustomerCart(item.GoodsCode, i)"></image>
							</view>
							<view v-else class="IsInvalid col-f f-24">已失效</view>
						</view>
					</view>
				</view>
				
			</view>
		</view>
		<view class="blank" v-else>
			
		</view>
		<!-- 底部按钮 -->
		<view class="submitList flexs flex-r flex-line flex2"  v-if="edit">
			<view class="selectAll">
			 	
				<label class="radio" @click="selectAll" style="margin-top:10rpx">
					<radio value="" color="#FF303B" :checked="isSelectAll"/>
				</label>
				<text style="margin-left:20rpx">全选</text>
			</view>
			
			<view class="flexs flex-r totalList flex2 flex-line" v-if="selectList.length">
				<view class="submitButton" :style="'background:'+themeColor" @click="delectAction">删除</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default{
		data() {
			return {
				toFixed: this.helper.toFixed,
				allProduceArr: [],
				CurrentPage: 1,
				TicketGoodsCodes: '',
				TicketCategoriesCodes: '',
				hasCart: true,
				edit:false,
				isSelectAll:false,
				selectList:[],
				GoodsCodeArr: [],          // 选中商品code数组
				themeColor: this.$store.state.themeColor
			}
		},
		onLoad(opt) {
			this.GetMyCareGoods()
		},
		methods: {
			// 底部选择全部/取消全选
			selectAll() {
				let _p=this
				this.isSelectAll=!this.isSelectAll
				let arr=[]
				if(!this.isSelectAll){
					arr=[]
				}
				this.allProduceArr.forEach((e)=>{
					if(_p.isSelectAll){
						  e.radio=true
						  arr.push(e)							
					}else{					
						  e.radio=false
					}
				})
				this.selectList=arr
			},	
			// 加入购物车
			createCustomerCart(id, index) {
				var that= this
				if(!that.$createCart(id)) {
					return
				}
				that.allProduceArr[index].CurrentCartQuantity += 1
				that.$store.commit('buy', {goods:that.allProduceArr[index]})
			},
			selectCart(item){
				
				item.radio=!item.radio
				if(item.radio){
					this.selectList.push(item)
					if(this.selectList.length==this.allProduceArr.length){
						this.isSelectAll=true
					}
				} else{
					this.isSelectAll=false
					let selectList=JSON.parse(JSON.stringify(this.selectList)) 
					selectList.forEach((items,i) => {
						if(items.CategoriesCode==item.CategoriesCode){
							console.log('执行了')
							selectList.splice(i,1);
						}
					})
					this.selectList=selectList
				}
				console.log(this.selectList)
				
			},
			goDetail(e) {
				uni.navigateTo({
					url: '/pagesA/proDetails/proDetails?id=' + e
				})
			},
			// 获取关注商品列表
			async GetMyCareGoods() {
				let that= this,
					params= {
						"CurrentPage": that.CurrentPage,
						"PageSize": 0
					},
					res= await that.$request(that.$API.GetMyCareGoods, params)
					if(res.Data.Datas.length == 0) {
						// that.$Toast('抱歉，暂无关注商品')
						that.allProduceArr= []
						this.edit=false
						return
					}
					let Datas= res.Data.Datas
					Datas.forEach((item, index) => {
						item.MarketPrice= item.MarketPrice
						item.radio=false
					})
					that.allProduceArr= Datas
			},
			// 取消关注
			async delectAction(GoodsCode, Iscare) {
				let GoodsCodeArr= []
				let delShop = []
				this.selectList.forEach(item => {
					GoodsCodeArr.push(item.GoodsCode)
					delShop.push(item)
				})
				let s=await this.showT('提示','确定删除选中关注商品?',1)
				if(s){
					let that = this,
						res = await that.$request(that.$API.DeleteCareGoods, {GoodsCode:GoodsCodeArr})
					if(res) {
						that.$Toast('删除成功')
						this.selectList=[]
						that.GetMyCareGoods()
						that.$store.commit('clearShop', delShop)
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	/* submitList */
	.submitList {
		width: 100%;
		height: 116upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0upx -1upx 0upx 0upx rgba(240, 240, 240, 1);
		position: fixed;
		left: 0;
		bottom: 0;
	}
	.submitButton {
		display: inline-block;
		vertical-align: middle;
		padding: 0 49upx;
		height: 76upx;
		line-height: 76upx;
		text-align: center;
		border-radius: 38upx;
		font-size: 32upx;
		color: rgba(255, 255, 255, 1);
		margin-left: 30upx;
	}
	.submitList .selectAll {
		padding-left: 48upx;
	}
	
	.submitList .totalList {
		padding: 0 20upx;
	
	}
	.radio {
		width: 36upx;
		height: 36upx;
		margin-right: 30rpx;
		&>radio {
			width: 36upx;
			height: 36upx;
			transform: scale(0.85);
		}
	}
	.goods_v{
		padding: 20rpx;
		background-color: #fff;
	}
	.goods_v_left{
		image{
			width: 180rpx;
			height: 180rpx;
		}
	}
	.IsInvalid{
		display: inline-block;
		line-height: 30upx;
		height: 30upx;
		padding: 8upx 12upx;
		border-radius: 20upx;
		background: #bebebe;
	}
	.goods_v_right{
		padding-left: 20rpx;
		width: calc(100% - 180rpx);
	}
	.left_text{
		font-size: 40rpx;
	}
    .right_text{
		text-decoration:line-through;
		color: #B1B1B1;
		font-size: 24rpx;
	}
	.top_txet{
		font-weight: 6000;
		 font-size: 28rpx;
	}
	.cart-box{
		position: relative;
	}
	.num-info{
		position: absolute;
		top: -12upx;
		right: -16upx;
		padding: 4upx 12upx;
		border-radius: 12upx;
		color: #fff;
		font-size: 20upx;
		line-height: 20upx;
		border: 2upx solid #fff;
	}
	.headWrapper {
		padding: 14upx 24upx;
		height: 60upx;
		background-color: #fff;
	}
	/* contentList */
	.contentList{
		width: 100%;
		padding: 20upx 24upx 100upx;
		box-sizing: border-box;
	}
	.contentList_v{
		border-radius: 16rpx;
		overflow: hidden;
	}
</style>
<style>
	page{
		height: 100%;
	}
	page{
		background-color: #f6f6f6;
	}
</style>
