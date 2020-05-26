<template>
	<view class="content dis-flex flex-column">
		<view class="searchBox dis-flex flex-y-center p-re">
			<view class="cityText col-33 f-32 oneline-hidden">{{CityText}}</view>
			<view class="inputBox flex-1">
				<input type="text" v-model="searchValue" class="ipt" placeholder="请输入关键字" placeholder-style="color: #999;" @confirm="iptConfirm"/>	
			</view>
			<view class="cancel t-center col-33 f-28" @click="delSearch">{{isSearch?'取消': '搜索'}}</view>
		</view>
		<map v-if="windowWidth" id="myMap" show-location="true" scale="16" :controls="controls" :markers="markersArray" :latitude="latitude" :longitude="longitude" 
			:style="'height:'+windowHeight+'px;width:'+windowWidth+'px'" @tap="mapTap" @markertap="markertap" @regionchange="regionchange"/>
		
		<view class="areaWrapper flex-1">
			<view v-for="(item, index) in addressList" :key="index" :class="'listWrapper listWrapper-'+ index" @click="selectStore(item, index)">
				<view class="icon" :class="addressDefault.id === item.id?'bg-red': 'bg-ee'"></view>
				<view class="areaLaber">
					<view class="areaTitle" :class="addressDefault.id === item.id?'col-red': 'col-33'">{{item.title}}</view>
					<view class="areaDetails">{{item.address}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	let wechat = require("@/common/wechat.js");
	let mapCtx;
	export default {
		data() {
			return {
				themeColor: this.$store.state.themeColor,
				windowWidth: 0,
				windowHeight: 0,
				CityText: '',
				latitude: 22.73,
				longitude: 114.27,
				addressList: [],                 // 周边地址
				addressDefault: '',              // 选中的地址
				markersArray: [],
				controls: [],
				searchValue: '',                 // 搜索关键字
				isSelecting: false,              // 是否阻止获取位置
				isSearch: false,                 // 是否是搜索
				itemData: '',                    // 地址页已存在的
				edit: false,                     // 是否是编辑地址
				timer: null,                     // 为null时可搜索，不为null时不能搜索
			}
		},
		onLoad(opt) {
			console.log('opt.item', opt.item, 'opt.edit', opt.edit)
			let that = this
			that.edit= opt.edit?true: false
			that.itemData= opt.item? JSON.parse(opt.item): ''
			
			uni.getSystemInfo({
				success(res) {
					console.log('系统信息', res.windowWidth)
					that.windowWidth = res.windowWidth
					that.windowHeight = res.windowWidth * 2 / 3
					that.controls.push({
						id: 1,
						position: {
							left: res.windowWidth / 2 - 12,
							top: that.windowHeight / 2 - 16,
							width: 24,
							height: 32,
						},
						iconPath: '../../static/locationRed.png'
					}) 
				}
			})
			
		},
		onReady() {
			let that= this
			mapCtx = uni.createMapContext('myMap');
			setTimeout(() => {
				mapCtx.moveToLocation();
			}, 500);
			setTimeout(() => {
				that.getAddress(mapCtx);
			}, 1500);
		},
		onShow() {

		},
		methods: {
			delSearch() {
				if(this.isSearch) {
					this.searchValue= ''
					this.isSearch= false
					return
				}
				this.iptConfirm()
			},
			// 获取附近地址
			getAddress(mapCtx) {
				let that= this
				wechat.getCenterLocation(mapCtx)
					.then(d => {
						console.log(d);
						let {
							latitude,
							longitude
						} = d;
						console.log("当前位置纬度", latitude, "当前位置经度", longitude);
						let url = `https://apis.map.qq.com/ws/geocoder/v1/`;
						let key = 'F6ZBZ-ATERW-KY2RB-RWQKW-UO475-LIF4O';
						let params = {
							location: latitude + "," + longitude,
							key,
							get_poi: 1
						}
						return wechat.request(url, params);
					})
					.then(d => {
						let result= d.data.result,
							pois= result.pois
						console.log("当前地址", result);
						that.CityText= result.ad_info.city
						that.setMarks(pois)
					})
					.catch(e => {
						console.log(e);
					})
			},
			// 设置标识点
			setMarks(pois, move) {
				let that= this,
					array= [];
				that.addressList= pois
				pois.forEach((item, index) => {
					let obj= {
						latitude: item.location.lat,
						longitude: item.location.lng,
						id: item.id,
						iconPath: '',
						height: 32,
						width: 24,
						callout: {
							content: item.title,
							color: '#333',
							bgColor: '#fff'
						}
					}
					array.push(obj)
				})
				
				that.markersArray= array
				that.addressDefault= array[0]
				console.log('markersArray', array)
				
				if(move) {
					console.log('move', move)
					let markers= that.markersArray
					that.latitude = markers[0].latitude
					that.longitude = markers[0].longitude
					mapCtx.moveToLocation(markers)
					mapCtx.translateMarker({
						markerId: markers[0].id,
						destination: {
							latitude: markers[0].latitude,
							longitude: markers[0].longitude
						},
						autoRotate: false,
						rotate: 0,
						animationEnd(e) {
							console.log('成功了', e)
							
						},
						fail(err) {
							console.log('失败了', err)
						}
					})
				}
				
			},
			// 选择地址
			selectStore(item, index) {
				let that= this
				that.isSelecting= true
				that.addressDefault= item
				let obj= that.itemData
				
				let indexArr = [],
					address = item.address;
				for (var i = 0; i < address.length; i++) {
					if (address.charAt(i) === '省') {
						indexArr.push(i + 1)
					} else if (address.charAt(i) === '市') {
						indexArr.push(i + 1)
					} else if (address.charAt(i) === '区' || address.charAt(i) === '县') {
						indexArr.push(i + 1)
					}
				}
				obj.ProvinceText = address.slice(0, indexArr[0])
				obj.CityText = address.slice(indexArr[0], indexArr[1])
				obj.DistrictText = address.slice(indexArr[1], indexArr[2])
				obj.Floor = address.slice(indexArr[2]) + item.title
				obj.Longi= item.location.lng
				obj.lati= item.location.lat
				
				that.latitude = item.location.lat
				that.longitude = item.location.lng
				
				mapCtx.moveToLocation(obj)
				mapCtx.translateMarker({
					markerId: item.id,
					destination: {
						latitude: item.location.lat,
						longitude: item.location.lng
					},
					autoRotate: false,
					rotate: 0,
					animationEnd(e) {
						console.log('成功了', e)
						let editStr= that.edit?'&edit=true': ''
						uni.redirectTo({
							url: '/pagesA/addAddress/addAddress?item=' + JSON.stringify(obj) + editStr
						})
					},
					fail(err) {
						console.log('失败了', err)
					}
				})
			},
			// 点击标识点
			markertap(e) {
				let that= this
				that.addressList.forEach((item, index) => {
					if(item.id === e.detail.markerId) {
						that.addressDefault= item
						uni.pageScrollTo({
							selector: '.areaWrapper-' + index
						})
					}
				})
			},
			regionchange(e) {
				if(this.searchValue || this.timer || this.isSelecting) {
					return
				}
				this.timer= setTimeout(function() {
					clearInterval(this.timer)
					this.timer= null
					this.getAddress(mapCtx)
				}.bind(this), 500)
			},
			// 点击地图
			mapTap(e) {
				console.log('mapTap', e)
				this.isSelecting= false
			},
			// 关键字搜索
			iptConfirm() {
				if(!this.searchValue) {
					return
				}
				this.isSearch= true
				let that= this,
					obj= {
						keyword: that.searchValue,
						key: 'F6ZBZ-ATERW-KY2RB-RWQKW-UO475-LIF4O',
						boundary: 'region('+ that.CityText+',1)'
					},
					url= 'https://apis.map.qq.com/ws/place/v1/search';
				wechat.request(url, obj).then(res => {
					let response= res.data.data,
						obj= {
							latitude: response[0].latitude,
							longitude: response[0].longitude
						}
					// 设置标识点
					that.setMarks(response, 'move')
				})
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	.content{
		height: 100%;
		overflow: hidden;
		.searchBox{
			height: 60upx;
			padding: 14upx 0 14upx 24upx;
			.cityText{
				width: 120upx;
				line-height: 60upx;
			}
			.inputBox{
				.ipt{
					box-sizing: border-box;
					padding: 0 20upx;
					height: 60upx;
					background: #f6f6f6;
					border-radius: 30upx;
				}
			}
			.cancel{
				height: 60upx;
				line-height: 60upx;
				width: 120upx;
			}
		}
		
		/* areaWrapper */
		.areaWrapper {
			width: 100%;
			box-sizing: border-box;
			padding: 40upx 24upx 0;
			overflow-y: scroll;
		}
		.listWrapper {
			font-size: 0;
			position: relative;
			margin-bottom: 47upx;
			.icon {
				display: inline-block;
				vertical-align: middle;
				width: 24upx;
				height: 24upx;
				margin-right: 18upx;
				border-radius:50%;
			}
			.areaLaber {
				display: inline-block;
				vertical-align: middle;
				max-width: 630upx;
				.areaTitle {
					font-size:32upx;
					font-family:PingFang SC;
					font-weight:bold;
				}
				.areaDetails {
					font-size:24upx;
					color:rgba(153,153,153,1);
					margin-top: 12upx;
				}
			}
			
		}
	  
	}
</style>
