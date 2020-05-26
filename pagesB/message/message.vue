<template>
	<!-- <commonBox> -->
	<view class="content" >
		<scroll-view class="chat top_v" scroll-y="true" :scroll-top="scroll_top" 
		:style="'height:'+[isHidden ? windowHeight-b_v1 : windowHeight-b_v]+'px;'" @scrolltolower="scrolltolower">
		<view class="flexs flex-v flex-end" style="min-height: 100%; padding: 20rpx; box-sizing: border-box;">
		 <view style="width: 100%;">
			<block v-for="(item,i) in data_list" :key="i">
				
				<view :class="'chat_item flexs top_v '+ [item.IsCustomerMessage ? 'flex-end':'flex-start']">
					<block v-if="item.MessageType===0">
						<view :class="'chat_item_text word_r '+[item.IsCustomerMessage ? 'chat_item_right':'chat_item_left']">
							<text selectable>{{item.MessageContent}}</text> 
						</view> 
					</block>
					<block v-else-if="item.MessageType===1">
						<view class="chat_item_text word_r top_v top_v1" @click.stop="preview(item.MessageUrl)">
							<image :src="item.MessageUrl" mode="widthFix" style="max-width: 300rpx; max-height: 500rpx; border-radius: 16rpx;"></image>						
						</view> 
					</block>
					<block v-else>
						<view class="flexs flex-r flex-line b_f order_v top_v top_v1" @click.stop="jump_order(item)">
							<view class="">
								<image :src="item.Order.ImageUrl"  style="width: 140rpx; height: 140rpx;"></image>
							</view>
							<view class="flexs flex-v flex2" style="margin-left: 20rpx;  height: 140rpx; width: calc(100% - 140rpx)">
								<view class="">
									{{item.Order.GoodsName}}
								</view>
								<view class="flexs flex2">
									<text class="col-red" style="font-size: 28rpx;">¥{{item.Order.TotalPrice}}</text> 
									<text class="col-99" style="font-size: 28rpx;">{{item.Order.OrderStatusText}}</text>
								</view>
							</view>
						</view>
					</block>
				</view>
				<view class="time_v flexs flex-center top_v" v-if="item.showTime">
					<view class="time_v_item">
						{{item.CreateTime}}
					</view> 
				</view>
			</block>
			</view>
			</view>
		</scroll-view>
		<view class="scorll_b"> </view>
		<view class="bottom" :style="'bottom:'+ [isHidden ? h1:0] +'px;' + [show ? '' :'visibility: hidden;']" >
			<view class="bottom_v flexs flex-r flex-line">
				<view :class="'input_v '+[text_value ? 'w2':'w1']" >
					<input class="input_item" type="text" v-model="text_value" placeholder="请输入您要咨询的问题" :cursor-spacing='cursor_h' />
				</view>
				<view v-if="!text_value" :class="'add_v  flexs flex-center flex-line'" 
				@click="unfold" :style="!isHidden ? 'transform: rotate(-45deg);':'transform: rotate(0deg);'">
					<view class="update_vs flexs flex-center flex-line">
						<image src="../../static/ic_add.png" mode="widthFix" class="w100 h100"></image>
					</view>
				</view>
				<view class="btn_v" v-else>
					<button type="warn" @click="enter">发送</button>
				</view>
			</view>
			<view class="pop_v flexs flex-r">
				<navigator class="flexs flex-v pop_v_item" url="/pagesA/mineOrder/mineOrder?type=message">
					<image src="../../static/ic_test_chat.png" mode="widthFix"></image>
					<text class=""> 订单 </text>
				</navigator>
				<view class="flexs flex-v pop_v_item" @click="open_phont(0)">
					<image src="../../static/ic_photo_chat.png" mode="widthFix"></image>
					<text class=""> 图片 </text>
				</view>
				<view class="flexs flex-v pop_v_item" @click="open_phont(1)" >
					<image src="../../static/ic_camera_chat.png" mode="widthFix"></image>
					<text class=""> 拍照 </text>
				</view>
			</view>
		</view>
		<canvas canvas-id="canvas" :style="'width:'+cWidth+'px;height:'+cHeight+'px;position: absolute;left:-1000px;top:-1000px;'"></canvas>
	</view>
<!-- 	</commonBox> -->
</template>

<script>
	import commonBox from "@/components/commonBox.vue"
	export default {
		components: {
			commonBox
		},
		data(){
			return{
				toFixed:this.helper.toFixed,
				scroll_top:0,
				cWidth:0,
				cHeight:0,
				data_list:[
					// {text:'16:20',type:'time'},				
					// {text:'你好,咕咚熊在的,请问有什么可以帮助您的呢~',type:'service'},
				],
				isHidden:true,
				h1:0,
				show:false,
				text_value:'',
				param:{
					"CurrentPage": 1,
					"PageSize": 10,
				},
				b_v:0,
				b_v1:0,
				TotalPage:0,
				content_h1:0,
				content_h2:0,
				windowHeight:0,
				cursor_h:0,
			}
		},
		onLoad(){
			this.GetCustomerMessage()
			uni.getSystemInfo({
			    success:(res)=> {					
			      this.windowHeight=res.windowHeight;
			       
			    }
			});
		},
		async onShow() {
			let input_v=await this.helper.getNodeInfo('.input_item',0,'height')
			this.b_v=await this.helper.getNodeInfo('.bottom',0,'height')
			this.b_v1=await this.helper.getNodeInfo('.bottom_v',0,'height')
		  this.cursor_h=(this.b_v1-input_v)/2
			console.log('input_item',this.cursor_h)
			// this.scroll_top= this.windowHeight-this.b_v
			console.log('b_v',this.b_v1)
			let h1=await this.helper.getNodeInfo('.pop_v',0,'height')
			this.h1=-h1
			let _p=this
			setTimeout(function(){
				_p.show=true
			},500)
			if(this.vue_g.message_item){
				console.log('message_item',this.vue_g.message_item)
				this.sendMessage(this.vue_g.message_item,2)
			}
			
			//this.pageScrollTo()	
		},

		methods:{	
			scrolltolower(){
				  console.log('触底了')
						if(this.TotalPage<=this.param.CurrentPage)return
						console.log(this.TotalPage,this.param.CurrentPage)
						uni.showLoading({
							title:'加载中...'
						})
						this.param.CurrentPage++
						this.GetCustomerMessage()
			},
			unfold(){
				this.isHidden=!this.isHidden
			},
			async pageScrollTo(){
			 let top=await this.helper.getNodeInfo('.content',0,'height')
				uni.pageScrollTo({
				    scrollTop:top,
						duration:300
				});
			},
			//获取客服消息
			async GetCustomerMessage(){
				let resp=await this.$request(this.$API.GetCustomerMessage,this.param)
				console.log('resp',resp)	
				this.TotalPage=resp.Data.TotalPage
				let list=[]
				if(this.param.CurrentPage===1){
					list=resp.Data.Datas
				}else{
					list=resp.Data.Datas
				}			
				let _p=this
				list.forEach((e,i)=>{
					let date1=new Date(e.CreateTime).getTime()/1000
					
						if(list[i+1]){
							let date2=new Date(list[i+1].CreateTime).getTime()/1000
							console.log(i,'date1',date1,'date2',date2)
							 if(date1-date2>600){
								 e.showTime=true
							 }
						}
					
					if(i==list.length-1 && this.param.CurrentPage>1){
						e.showTime=true
					}
					e.CreateTime = _p.helper.getDataTime(date1)
				})
				if(this.param.CurrentPage>1){
					this.data_list=[...this.data_list,...list]
					uni.hideLoading();
				}else{
					this.data_list=list
				}
				
			},
			async open_phont(e){
				let sourceType=[]
				if(e){
					sourceType.push('camera')
				}else{
					sourceType.push('album')
				}
				let resp = await this.getCanvasImg(this,sourceType)
			  console.log('resp',resp);
				this.sendMessage(resp,1)				
			},
			//发送图文消息
			async sendMessage(data,type){
				console.log('data',data) 
				//return
				let param={
					'MessageType':type,
				}
				let img=''
				if(type===1){
					img = data.ImageContent
					data.ImageContent=uni.getFileSystemManager().readFileSync(data.ImageContent, 'base64')
					param.MessageImage=data
				}else{
					param.OrderNumber=data.OrderNumber
				}
				let resp=await this.$request(this.$API.CreateCustomerMessage,param)
				console.log('resp',resp)
				if(resp.Success===0){
					let item
					let CreateTime=new Date().getTime()/1000
					//let CreateTime1=new Date(this.data_list[0].CreateTime).getTime()/1000
					let showTime=false
					if(type===2){
						this.vue_g.message_item=''
						let order_d=data.OrderGoods[0]
						
						item={
							  CreateTime:this.helper.getDataTime(CreateTime),
								IsCustomerMessage: true,
								MessageType:type,
								Order:{
									CreateDate:order_d.CreateDate,
									CustomerMemo: order_d.CustomerMemo,
									GoodsName:order_d.GoodsName,
									ImageUrl: order_d.ImageUrl,
									OrderNumber:order_d.OrderNumber,
									OrderStatus:order_d.OrderStatus,
									OrderStatusText:data.OrderStatusText,
									TotalPrice:data.SumActualPrice,
								},
								OrderNumber: order_d.OrderNumber,
								showTime:showTime
						}
					}else{
					  item={
					  	  CreateTime:this.helper.getDataTime(CreateTime),
					  		IsCustomerMessage: true,
					  		MessageType:type,
					  		MessageUrl:img,
					  		showTime:showTime
					  }
					}
					this.data_list.unshift(item)
					console.log('this.data_list', this.data_list)
					this.isHidden=!this.isHidden
					//this.GetCustomerMessage()
				}
			},
			//发送文本消息
			async enter(){
				let value=this.text_value
				let param={
					'MessageType':0,
					"MessageContent":value
				}
				let resp=await this.$request(this.$API.CreateCustomerMessage,param)
				console.log('发送消息',resp)
				let CreateTime=new Date().getTime()/1000
				let CreateTime1
				if(this.data_list[0]){
					 CreateTime1=new Date(this.data_list[0].CreateTime).getTime()/1000
				}else{
					CreateTime1=0
				}
				let showTime=false
				if(CreateTime-CreateTime1>600){
					showTime=true
				}
				if(resp.Success===0){
					this.data_list.unshift({
						  CreateTime:this.helper.getDataTime(CreateTime),
							IsCustomerMessage: true,
							MessageType: 0,
							MessageContent:value,
							showTime:showTime
					})
					//this.GetCustomerMessage()
				}
				this.isHidden=true
				this.text_value=''			
			},
			jump_order(item){   //订单跳转
				console.log('订单跳转',item)
				uni.navigateTo({
					url:'/pagesB/orderDetails/orderDetails?OrderNumber=' + item.OrderNumber
				})
			},
			preview(url){
				this.helper.preview(url)
			},
				async getCanvasImg(that,sourceType) {
				 return await new Promise((resolve, reject) => {	
					uni.chooseImage({
						count: 1, // 默认9
						sizeType: ['compressed'], // 指定只能为压缩图，首先进行一次默认压缩
						sourceType:sourceType, // 可以指定来源是相册还是相机，默认二者都有
						success: function(photo) {
				
							//-----返回选定照片的本地文件路径列表，获取照片信息-----------
							// photo.tempFilePaths.forEach((eImg)=>{
							uni.getImageInfo({
								src: photo.tempFilePaths[0],
								success: function(res) {
									//---------利用canvas压缩图片--------------
									uni.getFileInfo({
										filePath: photo.tempFilePaths[0],
										success: function(resImg) {
											console.log('图片信息', resImg)
											let quotient = 2000000 / resImg.size
											console.log('系数', quotient)
											if (resImg.size < 2000000) {
												console.log('退出', res)
												resolve({
													ImageContent: res.path,
													ExtraName: res.type == 'jpeg' ? '.jpg' : '.'+res.type
												})
				
											} else {
												var ratio = 2;
												var canvasWidth = res.width //图片原始长宽
												var canvasHeight = res.height
												while (canvasWidth > 400 || canvasHeight > 400) { // 保证宽高在400以内
													canvasWidth = Math.trunc(res.width / ratio)
													canvasHeight = Math.trunc(res.height / ratio)
													ratio++;
												}
												that.cWidth = canvasWidth,
													that.cHeight = canvasHeight
												//----------绘制图形并取出图片路径--------------
												var ctx = uni.createCanvasContext('canvas')
												ctx.clearRect(0, 0, canvasWidth, canvasHeight)
												ctx.drawImage(res.path, 0, 0, canvasWidth, canvasHeight)
				
												ctx.draw(false, setTimeout(function() {
													uni.canvasToTempFilePath({
														canvasId: 'canvas',
														destWidth: canvasWidth,
														destHeight: canvasHeight,
														fileType: 'jpg',
														quality: quotient,
														success: function(res) {
															console.log('tempFilePath', res.tempFilePath) //最终图片路径
															uni.getFileInfo({
																filePath: res.tempFilePath,
																success: function(resInfo) {
																	console.log('压缩后的图片大小', resInfo) //最终图片路径
																}
															})
															resolve({
																ImageContent: res.tempFilePath,
																ExtraName: '.jpg'
															})
														},
														fail: function(res) {
															console.log(res.errMsg)
														}
													})
												}, 200)) //留一定的时间绘制canvas
											}
										}
									})
				
								}
							})
				
						}
					})
					})
		  }
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #EEEEEE;
	}
	.order_v{
		padding: 20rpx; border-radius:24rpx  2rpx 24rpx  24rpx; min-width: 560rpx; margin-bottom: 20rpx;
	}
 .content{
	 background-color: #EEEEEE;
	 position: relative;
	 .top_v{
		transform: rotateX(180deg);
		-ms-transform: rotateX(180deg);		/* IE 9 */
		-webkit-transform: rotateX(180deg);	/* Safari and Chrome */
		-o-transform: rotateX(180deg);		/* Opera */
		-moz-transform: rotateX(180deg);		/* Firefox */
	 }
	 .top_v1{
		 transform: rotateX(180deg);
		 -ms-transform: rotateX(180deg);		/* IE 9 */
		 -webkit-transform: rotateX(180deg);	/* Safari and Chrome */
		 -o-transform: rotateX(180deg);		/* Opera */
		 -moz-transform: rotateX(180deg);		/* Firefox */
		 transform: rotateZ(0deg);
     -ms-transform: rotateZ(0deg);		/* IE 9 */
     -webkit-transform: rotateZ(0deg);	/* Safari and Chrome */
     -o-transform: rotateZ(0deg);		/* Opera */
     -moz-transform: rotateZ(0deg);		/* Firefox */
	 }
	 .chat{
		 .time_v{
			 margin: 40upx 0;
			 .time_v_item{
				 background-color: #DFDFE6;
				 border-radius: 28upx;
				 color: #fff;
				 padding: 10upx 20upx;
			 }
		 }
		.chat_item{
			.chat_item_text{
				margin-bottom: 20upx;
				max-width: 50%;
			}
			.chat_item_right{
				padding: 20upx;
				background-color: $color-red;
				color: #FFFFFF;
				border-radius:24upx  2upx   24upx  24upx;
			}
			.chat_item_left{
				padding: 20upx;
				background-color: #FFFFFF;
				border-radius: 2upx  24upx   24upx  24upx;
			}
		} 
	 }
	 .bottom{
		 position: fixed;	
		 bottom: 0;
		 width: 100%;
		 background-color:#F3F3F3;
		 -webkit-transition: 500ms;
		 transition: 500ms;
	 }
	 .pop_v{
		 padding:40upx;
		 .pop_v_item {
			 margin-right: 60upx;
			image{
			 width: 64upx;
			 height: 64upx;
			} 
			text{
				font-size: 28upx;
				margin-top: 20upx;
			}
		 }
	 }
	 .bottom_v{
		 padding:20rpx; 
		 box-sizing: border-box;
		 .btn_v{
			 width: 120rpx;
			 margin-left: 20upx;
			 button{
				 width: 100%;
				 line-height: 1;
				 padding: 24rpx 0rpx;
				 font-size: 28rpx;
				 border-radius: 40rpx;
			 }
		 }
		 .w1{
			 width:85%;
		 }
		 .w2{
			 width:calc(100% - 120rpx); 
		 }
		 .add_v{
			 width: 15%;
			 margin-left: 20upx;
			 -webkit-transition: 300ms;
			 transition: 500ms;
			 .update_vs{
			 	width: 76upx;
			 	height: 76upx;
			 	background-color: #fff;
			 	position: relative;
			 	border-radius: 100%;
				&>image{
					height: 100%;
					width: 100%;
					border-radius: 100%;
				}
			 }
		 }
		
		 .input_v{
			 padding: 15rpx;background-color: #fff;
			 border-radius: 40upx;
		 }
	 }
 }	
 
</style>
