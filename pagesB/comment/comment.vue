<template>
	<view class="content">
		<view class="comments">
			<view v-for="(item, index) in commentList" :key="index" class="comment-content">
				<view class="comment-item">
					<view class="item-header dis-flex flex-y-center flex-x-between">
						<view class="dis-flex flex-y-center">
							<image :src="item.CustomerImage?item.CustomerImage: '../../static/userIcon.png'" mode="" class="user-img bg-f5"></image>
							<view>
								<view class="col-33 f-24">{{item.CustomerName}}</view>
								<view class="star dis-flex">
									<image v-for="imgItem in item.CommentStar" :key="imgItem" src="../../static/star_yes.png"></image>
								</view>
							</view>	
						</view>
						<view class="f-right time col-99 f-24">{{item.CreateDate}}</view>
					</view>
					<view class="comment-words f-28 col-33 twoline-hidden">{{item.Content}}</view>
					<view class="comment-images">
						<image  v-for="(obj, num) in item.CommontImages" :key="num" :src="obj.NetPath" @click="preview(item.CommontImages, num)"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {textToast} from '@/common/utils.js'
	export default{
		data() {
			return{
				preview:this.helper.preview,
				commentList: [],
				imageArr: [],
				isPreviewImage: false,
				currentDefault: 0
			}
		},
		onLoad(e) {
			if(e.obj) {
				let object= decodeURIComponent(e.obj)
				object= JSON.parse(object)
				let list= object.arr
				list.map(item => {
					item.CreateDate= item.CreateDate.slice(0,10)
				})
				this.commentList= list
				console.log('接收到的列表', list)
			}
			
		},
		methods: {
			goViewImg(list, index) {
				this.imageArr= list
				this.currentDefault= index
				this.previewImage()
			},
			// 查看大图
			previewImage() {
				this.isPreviewImage= !this.isPreviewImage
			},
		}
	}
</script>

<style lang="scss" scoped>
	.cover-view{
		position: fixed;
		top: 0;
		bottom: 0;
		height: 100%;
		width: 100%;
		background: rgba($color: #000000, $alpha: 0.9);
		z-index: 20;
	}
	.content{
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		padding: 20upx 24upx;
	}
	// comments
	.comment-content{
		margin-bottom: 20upx;
		padding: 0 24upx 20upx;
		border-radius: 12upx;
		background-color: #fff;
		line-height: 1em;
		.comment-item{
			padding: 32upx 0 20upx;
			.item-header{
				height:60upx;
				.user-img{
					margin-right: 20upx;
					height: 60upx;
					width: 60upx;
					border-radius: 100%;
				}
				.star{
					margin-top: 7upx;
					&>image{
						height: 22upx;
						width: 22upx;
						margin-right: 12upx;
					}
				}
				.time{
					line-height: 60upx;
				}
			}
			.comment-words{
				margin: 20upx 0;
				line-height: 36upx;
			}
			.comment-images{
				width: 100%;
				max-height: 162upx;
				border-radius: 12upx;
				overflow: auto;
				white-space: nowrap;
				&>image{
					margin-right: 2upx;
					height: 162upx;
					width: 162upx;
					display: inline-block;
					&:nth-child(4n) {
						margin-right: 0;
					}
				}
			}
		}
	}
</style>
<style>
	page{
		height: 100%;
		width: 100%;
		background-color: #f5f5f5;
	}
</style>
