 <!-- uni兼职开发加qq1844014810  -->
<template>
	<view class="relative">
		<view  class="ball" v-for="(d,i) in balls" :key="i" :style=" d.inited ? 'transition: transform 1s ease-in; transform: translate3d(0, ' + offsetY + 'px,0); top: ' + ballY + 'px;' : '' ">
			<view class="inner arbg" 
				:style="d.inited ? 'transition: transform 1s linear; transform: translate3d( ' + offsetX + 'px,0,0); left: ' + ballX + 'px; opacity: 1;' : '' "
			></view>
		</view>
	</view>
</template>
 
<script>
	// 引入mixin, 生命动画组件, 调用add(事件对象)
	export default {
		props:{
			cartBasketRect:Object,// 购物车篮的rect信息
			
		},
		data() { 
			return {
				// 距离购物车节点的距离，用于tanslate3d
				offsetX: 0,
				offsetY: 0,
				// 小球自己的距离
				ballX: 0,
				ballY: 0,
				balls: {},
				// //避免抖动
				// lastEvent:'',
				// lastId:''
			}
		},
		  created() {
				let balls = [];
				for (let i = 0; i < 5; i++) {
					balls.push({ inited: false });
				}
				this.balls = balls
		  },
		  methods:{
			  getBalls() {
			  	return balls;
			  },
			  addToCart (e,id) {
				  // if(!id){
					 //  this.lastId  = ''
					 //  return
				  // }
				  
				  const self = this
				  // if(this.lastId == id){
					 //  e = this.lastEvent
				  // }else{
					 //  this.lastId  = id
					 //  this.lastEvent = e
				  // }
					
						let ballX = e.touches[0].clientX - 10
			  		let	ballY = e.touches[0].clientY - 9;
						
						const cartH = this.cartBasketRect.height
						const cartW = this.cartBasketRect.width
						// this.offsetX = Math.abs(this.cartBasketRect.left - ballX + 10)
						// this.offsetY = -Math.abs(this.cartBasketRect.top - ballY +(this.cartBasketRect.height/1.5))
						this.offsetX = this.cartBasketRect.left - ballX + cartH / 2
						this.offsetY = this.cartBasketRect.top - ballY + cartW / 2
						this.ballX = ballX
						this.ballY = ballY
						
						for (let i = 0; i < 5; i++) {
							if (!this.balls[i].inited) {
							this.balls[i].inited = true
								setTimeout(() => {
									self.balls[i].inited= false
								}, 1200);
								break;
							}
						}
			  }
		  }
		  
		  
	}
</script>

 
<style scoped>
.ball {
	position: fixed;
	z-index:8;
}
.ball .inner {
	background: #ff9900;
	width: 30rpx;
	height: 30rpx;
	position: fixed;
	border-radius: 50%;
	opacity: 0;
}
</style> 