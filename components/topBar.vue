<template>
	<view class="topBar" :class="isFixed?'p-fix': 'p-re'" :style="{'padding-top': statusBarHeight+'px','background': themeColor}">
		<view v-if="!isIndex" class="back" @click="goBack">
			<image :src="'../static/back_'+iconColor+'.png'" mode="heightFix" class="backIcon"></image>
		</view>
		<view class="title f-36" style=" position: relative;" :style="{color: textColor}">
			<view v-if="title">{{title}}</view>
			<slot/>
		</view>
	</view>
</template>

<script>
	export default{
		props: {
			bgColor: {
				type: String,
				default: 'rgba(0, 0,0,0)'
			},
			textColor: {
				type: String,
				default: '#fff'
			},
			isIndex: {
				type: Boolean,
				default: false
			},
			isFixed: {
				type: Boolean,
				default: false
			},
			title: String,
			iconColor: {
				type: String,        // 只支持white和black
				default: 'white'
			}
		},
		data() {
			return{
				statusBarHeight: 0,
				themeColor: ''
			}
		},
		watch: {
			bgColor: {
				handler: function(newVal) {
					this.themeColor= newVal
				},
				immediate: true
			}
		},
		beforeMount() {
			this.statusBarHeight= uni.getStorageSync('statusBarHeight')
		},
		methods: {
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			setThemeColor() {
				let that= this
				that.$nextTick(() => {
					that.themeColor= that.$store.state.themeColor
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.topBar{
		z-index: 10000;
		width: 100%;
		height: 44px;
		line-height: 44px;
		text-align: center;
		.back{
			display: inline-block;
			z-index: 100;
			vertical-align: center;
			position: absolute;
			bottom: 0;
			left: 24upx;
			height: 44px;
			width: 22px;
			text-align: left;
			.backIcon{
				margin-top: 13px;
				height: 18px;
				width: 18px;
			}
		}
		.title{
			z-index: 10;
			width: 100%;
			height: 44px;
			text-align: center;
			line-height: 44px;
		}
	}
</style>
