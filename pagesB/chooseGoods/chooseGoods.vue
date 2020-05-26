<template>
	<view class="content">
		<view class="item_v" >
			<view class="flexs flex-r flex-line" v-for="(item ,i) in goods_list" :key="i"  :style="i > 0 ? 'margin-top:20rpx;':''">
				<view class="radio" style="margin-right:40upx; margin-top:-20upx;" @click="slectGoods(item)">
					<label class="radio" >
						<radio color="#FF303B"  :checked="item.radio" />
					</label>
				</view>
				<view class="iconWrapper">
					<image class="icon" :src="item.ImageUrl" mode=""></image>
				</view>
				<view class="flexs flex-v flex2" style="line-height: 2rem;">
					<view class="">
						<text>{{item.GoodsName}}</text> <text class="m-l-20">{{item.WeightShort}}</text>
						<text class="m-l-20 col-99 f-28"> x {{item.Quantity}}</text>
					</view>
					<view class="">
						<text class="m-r-15">实付 </text>
						¥<text class="f-32">
							{{splitPrice(toFixed(item.SumActualPrice))[0]}}.
						</text>
						{{splitPrice(toFixed(item.SumActualPrice))[1]}}
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-v b_f flexs flex-r flex-line flex2">
			<view class="flexs flex-r flex-line">
				<view class="radio flexs flex-r" style="margin-right:20upx; margin-top:-10upx;" @click="allElection">
					<label class="radio" >
						<radio color="#FF303B" :checked="isSelectAll" />
					</label>
				</view>
				<view>全选</view>
			</view>
			
			<button class="define" :style="'background: '+themeColor" @click="jump_refund">
				确定
			</button>
		</view>
	</view>
</template>

<script>
	import {splitPrice} from "@/common/utils.js"
	export default{
		data(){
			return{
				toFixed:this.helper.toFixed,
				splitPrice: splitPrice,
				goods_list:[],
				isSelectAll:true,
				is:true,
				selectArr:[],
				OrderNumber:'',
				themeColor: this.$store.state.themeColor
			}
		},
		onLoad(options) {
			let _p = this
			if(options.goods_list){
				this.goods_list=JSON.parse(options.goods_list)
				this.goods_list.forEach((e,i)=>{
					e.radio=true
					e.CartId=i+1
					_p.selectArr.push(e)
					e.TotalPrice =_p.helper.toFixed(e.TotalPrice)
				})
				console.log('选中的数组',this.selectArr)	
			}
			if(options.OrderNumber){
				this.OrderNumber=options.OrderNumber
			}
		},
		onShow() {
			this.$setNavigatorBg()
		},
		methods:{
			allElection(){
				this.isSelectAll=!this.isSelectAll
				let arr=[]
				if(this.isSelectAll){
					this.goods_list.forEach((e)=>{
						
						e.radio=true
						
						arr.push(e)
					})
					this.selectArr=arr
				}else{
					this.goods_list.forEach((e)=>{
						
						e.radio=false
						
					})
					this.selectArr=[]
				}


				console.log('选中的数组',this.selectArr)	
			},
			//
			slectGoods(item,i) {    //选中需要售后的商品
				item.radio=!item.radio
				if(item.radio){
					this.selectArr.push(item)
					
				}else{
					let selectArr=JSON.parse(JSON.stringify(this.selectArr)) 
					selectArr.forEach((items,j) => {
						if(items.CartId==item.CartId){
							selectArr.splice(j,1);
						}
					})
					this.selectArr=selectArr
				}
				if(this.selectArr.length==this.goods_list.length){
					this.isSelectAll=true
				}else{
					this.isSelectAll=false
				}
				console.log('选中的selectArr',this.selectArr)
			},
			jump_refund(){  //确定跳转到售后页面
				if(this.selectArr.length < 1) {
					this.$Toast('请选择需要售后的商品')
					return
				}
				uni.redirectTo({
					url:"/pagesB/applyRefund/applyRefund?goods_list="+JSON.stringify(this.selectArr)+'&OrderNumber='+this.OrderNumber
				})
			}
			
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F3F3F3;
	}
	.define{
		color: #FFF;
		border-radius: 30px;
		width: 100px;
		margin: 0;
		line-height: 2;
	}
	.bottom-v{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		padding:20upx 40upx;
		box-sizing: border-box;
	}
	.content{
		padding: 20upx 20upx 80upx 20upx;
		box-sizing: border-box;
	}
	.item_v{
		background-color: #fff;
		padding: 30upx;
		border-radius: 12upx;
	}
	.iconWrapper{
		width:100upx;
		height:100upx;
		background:rgba(204,204,204,1);
		border-radius:8upx;
		margin-right: 31upx;
	}
	.icon{
		width: 100upx;
		height: 100upx;
	}
	.radio {
		width: 36upx;
		height: 36upx;
	
		&>radio {
			width: 36upx;
			height: 36upx;
			transform: scale(0.85);
		}
	}
</style>
