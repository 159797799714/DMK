<template>
	<view class="content">
		<view  style="padding-bottom:150upx;">
		<block v-for="(item, index) in goodList" :key="index">
		
				<view class="flexs flex-r item_v" :style="index>0 ? 'margin-top: 20rpx;':''">
					<view class="iconWrapper">
						<image class="icon" :src="item.ImageUrl" mode=""></image>
					</view>
					<view class="flexs flex-v flex2">
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
				
				<view class="info_v b_f">
					<view class="flexs flex-r p30">
						<text class="left_t" >商品金额</text><text class="moeny">¥{{toFixed(item.SumAmount)}}</text>
					</view>
					<view class="flexs flex-r flex-line p30 bor_top"  @click="open(index)">
						 <view class="left_t">售后类型</view>
						 <view class="flexs flex-line flex2 r_text">
							 <block v-if="item.type">
								 <text>{{item.type.text}}</text>
								 <image class="r_img" src="../../static/moreIcon.png" mode="widthFix"></image>
							 </block>
							 <block v-else>
								 <text>请选择售后类型</text>
								 <image class="r_img" src="../../static/moreIcon.png" mode="widthFix"></image>
							 </block>
							
						 </view>
					</view>
				</view>
				
				<view class="explain_v b_f" v-if="item.type">
					<view class="p30 flexs flex-r">
						<text class="left_t" >{{item.type.text}}说明</text>
						<input type="text" v-model="item.e_input" style="color: #000000; z-index: 1;" placeholder-style="color:999999;"  :placeholder="'请填写'+ item.type.text +'说明'"/>
					</view>
					<view class="p30 flexs flex-r bor_top flex-line">
						<text class="left_t" >上传凭证</text>
						<view class="flexs flex-r flex-wrap" style="width: 75%;">
						
							<view class="update_v" v-for="(ite,i) in item.updataImgList" :key="i" v-if="item.updataImgList.length>0" style="margin:0 20upx 20upx 0;"> 
								<image style="width: 100%; height: 100%;" :src="ite.path"></image>
								<image class="u-icon" src="../../static/ic_delect.png" mode="widthFix"  @click="delete_img(index,i)"></image>
								<!-- <view class="u-icon flexs flex-center" @click="delete_img(i)">x</view> -->
							</view>
							<view class="flexs flex-v update_v flex-end" @click="getPhoto(item)"  v-if="item.updataImgList.length==0">
								<image style="width: 100%; height: 100%; position: absolute;" src="../../static/photo.png" mode="widthFix"></image>
								<view class="text_v">上传凭证</view>
							</view>
							<view class=" update_vs flexs flex-center flex-line" @click="getPhoto(item)" v-if="item.updataImgList.length>0">
								 <view class="" style="width: 1%;height: 60%; border-right: #999999 solid 2upx; position: absolute;">
									
								 </view>
								 <view class=""  style="width: 60%;height: 1%; border-bottom: #999999 solid 2upx; position: absolute;">
									
								 </view>
							</view>
							
						</view> 	
					</view>
				</view>
		</block>		
		</view>
		
		
		<view class="bottom-v flexs flex-line">
			<button :style="'background:'+themeColor" @click="sbumit">提交</button>
		</view>
		<uni-popup ref="popup" type="bottom">
			<view class="p20 b_f pop_v">
				<view class="p20" style="text-align: center;">
					售后类型
				</view>
				<view class="item flexs flex2 flex-line" @click="select_type(item,i)" v-for="(item,i) in type_lst" :key="i">
					<text>{{item.text}}</text>  
					<label class="radio">
						<radio color="#FF303B" value="" :checked="item.radio" /><text></text>
					</label>
				</view>
			    <view class="p20">
			    	<button class="col-f" :style="'background:'+themeColor"  @click="close_pop" style="border-radius: 46upx;">关闭</button>
			    </view>
			</view>
		</uni-popup>
		<canvas canvas-id="canvas" :style="'width:'+cWidth+'px;height:'+cHeight+'px;position: absolute;left:-1000px;top:-1000px;'"></canvas>
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import {splitPrice} from "@/common/utils.js"
	export default{
		 components: {uniPopup},
		data(){
			return{
				splitPrice: splitPrice,
				toFixed:this.helper.toFixed,
				cWidth:0,
				cHeight:0,
				type_lst:[
					{id:1,text:'退货',radio:false},
					{id:2,text:'换货',radio:false},
					{id:3,text:'投诉',radio:false}
				],
				e_input:'',
				updataImgList:[],
				type:'',
				reason:'',
				goodList:[],
				s_index:-1,
				OrderNumber:'',
				themeColor: this.$store.state.themeColor
			}
		},
		onLoad(opt) {
			this.toFixed=this.helper.toFixed
			if(opt.goods_list){
				let list=JSON.parse(opt.goods_list)
			    list.forEach((e)=>{
					e.type=''
					e.e_input=''
					e.updataImgList=[]
				})	
				this.goodList=list
			}
			if(opt.order){
				let order=JSON.parse(opt.order)
				order.type=''
				order.type=''
				order.updataImgList=[]
				this.goodList.push(order)
			}
			//console.log(this.goodList)
			if(opt.OrderNumber){
				this.OrderNumber=opt.OrderNumber
			}
			
		},
		methods:{
			select_type(e,i){  //选择售后类型
			
				this.goodList[this.s_index].type=e
				//console.log('s',this.goodList,this.s_index,this.goodList[this.s_index])
				e.radio=!e.radio
				this.type_lst.forEach((e,j)=>{
					if(i!=j){
						e.radio=false
					}
				})
				this.$refs.popup.close()
			},
			close_pop(){
				this.$refs.popup.close()	
			},
			open(index){       //打开选择弹窗
			    this.$refs.popup.open()
				this.s_index=index
			},
			// delete_img(i){  //删除图片
			// 	this.updataImgList.splice(i,1)
			//  },
			 delete_img(i,j){  //删除图片
			     let item=this.goodList[i]
			 	//console.log(this.goodList,item.updataImgList)
			 	item.updataImgList.splice(j,1)
			  },
        async CreateAftermarketOrderMultiple(param){
				let res=await this.$request(this.$API.CreateAftermarketOrderMultiple,param);
				//console.log('res',res)
				uni.hideLoading()
				if(res.Success==0){
					this.$Toast('提交成功')
					uni.redirectTo({
						url:'/pagesB/refund/refund'
					})
				}
			},
			sbumit(){  //提交
			    let that=this
			    let dataList=this.goodList
				for(let i=0;i<dataList.length;i++){
					if(!dataList[i].type){
						that.showT('提示','请选择售后类型',0)
						return
					} 
					if(!dataList[i].e_input){
						that.showT('提示','请填写售后说明',0)
						return
					} 
				}
				uni.showLoading({
					titile:'提交中...'
				})
				
				let AftermarketOrders=[]
				AftermarketOrders=dataList.map((els)=>{
					let Images=[]
					if(els.updataImgList.length>0){
						Images=els.updataImgList.map((el)=>{
							console.log('el',el.path)
							let base64 = uni.getFileSystemManager().readFileSync(el.path, 'base64') 
							console.log('base64',base64)	
							let ImageContent=base64			
							return {
									"ImageContent":ImageContent,
									"ExtraName": "."+el.type
							}
						})
					}
					return{
						"OrderGoodsId": els.OrderGoodsId,
						"AftermarketType": els.type.id,
						"AftermarketCause": els.e_input,
						"Images":Images
					 }
				})
				let param={
					"OrderNumber": that.OrderNumber,
					"AftermarketOrders": AftermarketOrders
				}
			//	console.log('param',param)
			//	console.log('param',JSON.stringify(param))
				that.CreateAftermarketOrderMultiple(param)
				
			    	
			},
			getPhoto(item){
				if(item.updataImgList.length>=5){
					this.$Toast('最多只能传5张图片哦')
					return
				}
				this.helper.getCanvasImg(this,item, 5 - item.updataImgList.length)
				//console.log(this.goodList,item)
			},
				 
		}
	}
</script>

<style lang="scss" scoped>
	.m-l-20{
		margin-left: 20upx;
	}
	.m-r-15{
		margin-right: 15upx;
	}

	.u-icon{
		position: absolute;
		right: -10upx;
		top: -10upx;
		border-radius: 50%;
		width: 40upx;
		height: 40upx;
	}
	.p30{
		padding: 30upx 0;
	}

	.content{
		padding: 20upx;
		box-sizing: border-box;
	}
	.r_img{
		
		width: 40rpx;
		height: 40rpx;

	}
	.pop_v{
		width: 100%;
		box-sizing: border-box;
		border-radius: 20upx  20upx   0  0;
		.item{
            padding: 20upx;
			margin: 20upx;
			border-bottom: 2upx #EAEAEA solid;
		}
		
	}
	.update_v_text{
		font-size: 36upx;
	}
	.update_vs{
		width: 140upx;
		height: 140upx;
		border: dashed 2upx #999999;
		position: relative;
		border-radius: 20upx;
	}
	.update_v{
		width: 140upx;
		height: 140upx;
		position: relative;
		
		.text_v{
			width: 100%;
			text-align: center;
			font-size: 24upx;
			padding-bottom: 20upx;
		}
	}
	.icon{
		width: 100upx;
		height: 100upx;
	}
	.bottom-v{
		z-index: 2;
		position: fixed;
		bottom:0;
		width: 100% ;
		height: 132upx;
		line-height: 132upx;	
		padding:0 40upx;
		left:0;
		background-color: #fff;
		box-sizing: border-box;
		button{
			width: 100%;
			background-color: $color-red;
			color: #FFFFFF;
			border-radius: 40upx;
			
		}	
	}
	.info_v{
		margin-bottom: 20upx;
		border-radius: 12upx;
	}

	.info_v , .explain_v{
		
		border-radius: 12upx;
		padding: 0 20upx;
		color: #999999;
		font-size: 32upx;
		.left_t{
			width: 25%; 
			padding-left:20upx; 
		}
		.r_text{
			width: 75%;
		}
		.moeny{
			color: $color-red;
			width:75%;
		}
		.bor_top{
			border-top: 2upx solid #EAEAEA;
		}
	}
	.item_v{
		background-color: #fff;
		padding: 30upx;
		margin-bottom: 20upx;
		border-radius: 12upx;
	}
	.iconWrapper{
		width:100upx;
		height:100upx;
		background:rgba(204,204,204,1);
		border-radius:8upx;
		margin-right: 31upx;
	}
</style>
<style>
	page {
		background-color: #F3F3F3;
	}
</style>