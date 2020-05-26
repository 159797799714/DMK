<template>
	<view class="content bg-ee">
		<view class="points-logs-list">
			<view class="points-log" v-for="(item, k) in [1,2,3,4]" :key="k">
				<view class="left">
					<view class="text">完成订单</view>
					<view class="date">2020-09-17</view>
				</view>
				<view class="right">
					+10
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.content{
	height: 100%;
	padding-top: 10upx;
	box-sizing: border-box;
}
.points-logs-list{
	padding: 0 32upx;
	background:rgba(255,255,255,1);
	color:rgba(51,51,51,1);
	height: 100%;
}
.points-logs-list .points-log{
	height: 125upx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1upx solid rgba(234,234,234,1);
}
// .points-logs-list .points-log:last-child{
// 	border: none;
// }
.points-logs-list .points-log .left{
	font-weight:500;
}
.points-logs-list .points-log .left .text{
	font-size:28upx;
	margin-bottom: 19upx;
}
.points-logs-list .points-log .left .date{
	font-size:24upx;
	color:rgba(153,153,153,1);
}
.points-logs-list .points-log .right{
	font-size:40upx;
	color:rgba(39,143,207,1);
	font-weight:bold;
}


</style>
