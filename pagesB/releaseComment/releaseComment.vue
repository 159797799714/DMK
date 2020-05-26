<template>
	<view class="content">
		<view class="good" v-for="(item,i) in GoodList" :key="i"  style="margin-bottom: 20rpx;">
			<view class="header">
				<view class="good-img f-left">
					<image :src="item.ImageUrl" mode=""></image>
				</view>
				<view class="f-left">
					<view class="f-28 col-33 name">{{item.GoodsName }}<text class="m-l-12">{{item.WeightShort}}</text></view>
					<view class="stars">
						<!-- <image src="../../static/collected.png" mode=""></image> -->
						<image v-for="(ite, index) in item.imgArr" :key="index" 
						:src="index <= item.select_index ? ite.sIconUrl : ite.iconUrl" mode="" @click.stop="select(item,index)"></image>
						<text v-if="item.select_index==0" class="col-99 f-28">非常差</text>
						<text v-if="item.select_index==1" class="col-99 f-28">很差</text>
						<text v-if="item.select_index==2" class="col-99 f-28">一般</text>
						<text v-if="item.select_index==3" class="col-99 f-28">很好</text>
						<text v-if="item.select_index==4" class="col-99 f-28">非常好</text>
					</view>
				</view>
			</view>
			<textarea v-model="item.comment" placeholder="亲，请写下你的评论，可以帮助更多小伙伴哦！" placeholder-style="{color: #999, font-size: 28upx}" />
			<view class="flexs flex-r flex-wrap">
				<view class="update_v" v-for="(itemImg,j) in item.updataImgList" :key="j" v-if="item.updataImgList.length>0" style="margin:0 20upx 20upx 0;">
					<image style="width: 100%; height: 100%;" :src="itemImg.path" @click.stop="preview(item.updataImgList,j)"></image>
					<!-- <view class="u-icon flexs flex-center" @click.stop="delete_img(j)">x</view> -->
					<image class="u-icon" src="../../static/ic_delect.png" mode="widthFix"  @click.stop="delete_img(i,j)"></image>
				</view>
				<view class="flexs flex-v flex-end update_v" @click.stop="getPhoto(item)" >
					<image style="width: 100%; height: 100%; position: absolute; top: 0;" src="../../static/photo.png" mode="widthFix"></image>
					<view class="text_v">上传照片</view>
				</view>	
			</view>
		</view>
		
		<button class="btn_v" :style="'color: #fff;background:'+themeColor"  @click.stop="submit">提交</button>
		<canvas canvas-id="canvas" :style="'width:'+cWidth+'px;height:'+cHeight+'px;position: absolute;left:-1000px;top:-1000px;'"></canvas>

	</view>
</template>

<script>
	import {getBase64Image,textToast} from '@/common/utils.js'
	export default{
		data() {
			return{
				cWidth:0,
				cHeight:0,
				base64_url:'',
				OrderInfo:'',
				GoodList:[],
				updataImgList:[],
				imgArr: [{
					iconUrl: require("@/static/star_no.png"),
					sIconUrl: require("@/static/star_yes.png"),
				}, {
					iconUrl: require("@/static/star_no.png"),
					sIconUrl: require("@/static/star_yes.png"),
				}, {
					iconUrl: require("@/static/star_no.png"),
					sIconUrl: require("@/static/star_yes.png"),
				}, {
					iconUrl: require("@/static/star_no.png"),
					sIconUrl: require("@/static/star_yes.png"),
				}, {
					iconUrl: require("@/static/star_no.png"),
					sIconUrl: require("@/static/star_yes.png"),
				}],
				preview:this.helper.preview,
				themeColor: this.$store.state.themeColor
			}
		},
		onLoad(opt) {
			if(opt.OrderNumber){
				this.getOrderInfo(opt.OrderNumber)
			}
		},
		methods: {
			
			submit(){
				uni.showLoading({
					title:"加载中..."
				})
				console.log('OrderInfo',this.GoodList)
				let list=this.GoodList
				let param={OrderNumber:this.OrderInfo.OrderNumber}
				let OrderGoods=[]
				let status=1
				list.forEach((e)=>{
					if(e.select_index===-1){
						textToast('请填写评星等级')
						status=0
						return
					}
					console.log(e)
					if(!e.comment){
						textToast('请填写评论')
						status=0
						return
					}
					
					let Images=[]
					if(e.updataImgList.length>0){
						e.updataImgList.forEach(async (el)=>{
							console.log('el',el.path)
							let base64 = uni.getFileSystemManager().readFileSync(el.path, 'base64') 
							console.log('base64',base64)	
							let ImageContent=base64			
							Images.push({
									"ImageContent":ImageContent,
									"ExtraName": "."+el.type
							})
							console.log('Images',Images)
						})
					}
					  OrderGoods.push( {
					      "Images":Images.length>0 ? Images:[],
					      "OrderGoodsId": e.OrderGoodsId,
					      "Content": e.comment,
					      "CommentStar": e.select_index+1,
					      "GoodsCode": e.GoodsCode
					    })
				})
				if(!status)return
				param.OrderGoods=OrderGoods
				console.log('param',param)
				this.CommentMyOrder(param)
			},
			async CommentMyOrder(param){	
			   let res = await this.$request(this.$API.CommentMyOrder,param)
			   console.log('res',res)
			   if(res.Success===0){
				   uni.hideLoading();
				   uni.showToast({
				   	icon:"success",
					title:'上传成功',
					duration:1600
				   })
				   uni.navigateBack({
				   	delta: 1
				   })
			   }
			},

			select(e,index){
				e.select_index=index
				
			},
			delete_img(i,j){  //删除图片
			    let item=this.GoodList[i]
				console.log(this.GoodList,item.updataImgList)
				item.updataImgList.splice(j,1)
			 },
			async getOrderInfo(OrderNumber){
				let param={
					"OrderNumber":OrderNumber
				}
				let res =await this.$request(this.$API.GetOrderDetail,param)
				if(res.Success===0){
					console.log(res)
					let list=res.Data.OrderGoods
					let _p=this
					list.forEach((e)=>{
						e.comment=''
						e.updataImgList=[]
						e.imgArr=_p.imgArr
						e.select_index=-1
					})
					
					this.GoodList=list				
					this.OrderInfo=res.Data
				}
			},
			getPhoto(item){
				
				if(item.updataImgList.length>=5){
					this.$Toast('最多只能传5张图片哦')
					return
				}
				this.helper.getCanvasImg(this,item, 5 - item.updataImgList.length)
			}
				
		}
		
	}
</script>

<style lang="scss" scoped>
	.btn_v{
		position: fixed;
		display: block;
		bottom: 20upx;
		left: 24upx;
		right: 24upx;
		border-radius: 20upx;
	}
	.p40{
		padding: 40upx;
	}
	.stars_v{
		margin-left: 28upx;
		&>image{
			width: 36upx;
			height: 34upx;
			margin-right: 28rpx;
		}
	}
	.content{
		padding: 20upx 24upx 100upx;
		.good{
			padding: 32upx 24upx;
			border-radius: 12upx;
			background-color: #fff;
			.header{
				height: 120upx;
				width: 100%;
				.good-img{
					margin-right: 24upx;
					height: 120upx;
					width: 120upx;
					&>image{
						height: 120upx;
						width: 120upx;
					}
				}
				.name{
					line-height: 60upx;
				}
				.stars{
					display: flex;
					align-items: center;
					margin-top: 9upx;
					height: 34upx;
					overflow: hidden;
					&>image{
						display: inline-block;
						margin-right: 28upx;
						height: 34upx;
						width: 36upx;
					}
				}
			}
			&>textarea{
				box-sizing: border-box;
				margin: 32upx 0;
				padding: 32upx 23upx;
				height: 260upx;
				width: 100%;
				background-color: #f0f0f5;
				border-radius: 10upx;
			}
			.photo{
				position: relative;
				&>image{
					margin: 0 8upx 8upx 0;
					height: 160upx;
					width: 160upx;
				}
				.word{
					position: absolute;
					width: 160upx;
					bottom: 32upx;
					line-height: 24upx;
				}
			}
		}
	}
</style>
<style lang="scss">
	page{
		height: 100%;
		width: 100%;
		background: #f5f5f5;
	}
	text{
		line-height: 1;
	}
	.update_v{
		width: 140upx;
		height: 140upx;
		position: relative;
	}
	
	.text_v{
		width: 100%;
		text-align: center;
		font-size: 24upx;
		padding-bottom: 20upx;
		color: #999999;
	}
	.u-icon{
		position: absolute;
		right: -10upx;
		top: -10upx;
		border-radius: 50%;
		width: 40upx;
		height: 40upx;
	}
</style>
