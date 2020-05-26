<template>
	<view class="content">
		<view class="addList">
			<view class="list">
				<view class="label">
					联系人
				</view>
				<view class="inputView">
					<input class="entry" type="text" value="" v-model="form.CustomerName" placeholder="请填写姓名" placeholder-style="color: #D8D8D8;" />
				</view>
			</view>
			<view class="list">
				<view class="label" />
				<view class="inputView">
					<radio-group @change="radioChange">
						<label class="radio">
							<radio :color="bgColor" value="(先生)" :checked="isMan" />先生
						</label>
						<label class="radio">
							<radio :color="bgColor" value="(女士)" :checked="!isMan" />女士
						</label>
					</radio-group>
				</view>
			</view>
			<view class="list">
				<view class="label">
					手机号
				</view>
				<view class="inputView">
					<input type="text" class="entry" value="" v-model="form.CustomerPhone" placeholder="请填写手机号码" placeholder-style="color: #D8D8D8;"
					 maxlength="11" />
				</view>
			</view>
			<view class="list"> 
				<view class="label"> 
					收货地址
				</view>
				<view class="inputView">
					<input type="text" class="entry" v-model="form.Floor" placeholder="点击选择" placeholder-style="color: #D8D8D8;" :disabled="true"
					 @click.stop="goSelectAddress" />
				</view>
			</view>
			<view class="list">
				<view class="label">
					门牌号
				</view>
				<view class="inputView">
					<input type="text" value="" v-model="form.Address" class="entry" placeholder="如1号楼101室" placeholder-style="color: #D8D8D8;" />
				</view>
			</view>
		</view>
		<view class="addButton" :style="'background: '+themeColor" @click="creatAddress">保存地址</view>
		<view v-if="isEdit" class="addButton deleteButton" @click="DeleteCustomerAddr(itemData.CustomerAddressId)">删除地址</view>
	</view>
</template>

<script>
	import {textToast} from '@/common/utils.js'
	export default {
		data() {
			return {
				isEdit: false,
				itemData: {},              // 编辑地址时的原始参数信息
				isMan: true,
				longitude: '',             // 自动获取到的进度
				latitude: '',              // 纬度
				form: {
					"CustomerName": '',
					"CustomerPhone": '',
					"ProvinceId": '',
					"ProvinceText": '',
					"CityId": '',
					"CityText": '',
					"DistrictId": '',
					"DistrictText": '',
					"Floor": '',
					"Address": '',
					"Longi": 0,
					"lati": 0,
					"SourceOrder": 1
				},
				bgColor: '#FF303B',
				themeColor: this.$store.state.themeColor
			}
		},
		onLoad(opt) {
			let that= this
			if(opt.item) {
				uni.setNavigationBarTitle({
				    title: '编辑地址'
				})
				that.isEdit= true
				var item= JSON.parse(opt.item)
				that.itemData= item
				if (item.CustomerName.indexOf('(先生)') !== -1) {
					item.CustomerName= item.CustomerName.slice(0, -4)
				} else if(item.CustomerName.indexOf('(女士)') !== -1) {
					item.CustomerName= item.CustomerName.slice(0, -4)
					that.isMan= false
				}
				console.log(item.CustomerName)
				for(var i in that.form) {
					that.form[i]= item[i]
				}
			}
		},
		onShow() {
			let that= this
			uni.getLocation({
				type: 'wgs84',
				success: function(res) {
					console.log('获取到位置信息', res)
					that.longitude= res.longitude
					that.latitude= res.latitude
				},
				fail(err) {
					that.$Toast('请点击右上角开启位置权限')
				}
			})
		},
		methods: {
			goSelectAddress() {
				let that = this
				uni.chooseLocation({
					longitude: that.longitude,
					latitude: that.latitude,
					success: function(res) {
						console.log('获取到信息', JSON.stringify(res))
						that.form.Longi = res.longitude
						that.form.lati = res.latitude
						var indexArr = [],
							address = res.address;
						for (var i = 0; i < address.length; i++) {
							if (address.charAt(i) === '省') {
								indexArr.push(i + 1)
							} else if (address.charAt(i) === '市') {
								indexArr.push(i + 1)
							} else if (address.charAt(i) === '区' || address.charAt(i) === '县') {
								indexArr.push(i + 1)
							}
						}
						console.log('indexArr', indexArr)

						that.form.ProvinceText = address.slice(0, indexArr[0])
						that.form.CityText = address.slice(indexArr[0], indexArr[1])
						that.form.DistrictText = address.slice(indexArr[1], indexArr[2])
						that.form.Floor = address.slice(indexArr[2]) + res.name
					},
					fail() {
						that.$Toast('请点击右上角开启位置权限')
					}
				})
			},
			radioChange(e) {
				this.isMan= !this.isMan
			},
			async creatAddress() {
				let that = this
				if (!that.form.CustomerName) {
					textToast('请输入姓名')
					return
				} else if (!that.form.CustomerPhone) {
					textToast('请输入手机号码')
					return
				} else if (!that.form.Floor) {
					textToast('请选择地址')
					return
				} else if (!that.form.Address) {
					textToast('请填写门牌号信息')
					return
				}
				that.$stopAction(1)
				console.log(that.isMan)
				if(that.isMan) {
					that.form.CustomerName += '(先生)'
				} else {
					that.form.CustomerName += '(女士)'
				}
				// 编辑地址
				if(that.isEdit) {
					let params= that.form
					params.CustomerAddressId= that.itemData.CustomerAddressId
					let res= await that.$request(that.$API.UpdateCustomerAddr, that.form)
					console.log(res)
					textToast('修改成功')
					uni.navigateBack({
						delta: 1
					})
					return
				}
				// 新增地址
				let res=await that.$request(that.$API.CreateCustomerAddr, that.form)
				console.log(res)
				textToast('添加成功')
				uni.navigateBack({
					delta: 1
				})
			},
			// 删除该地址
			DeleteCustomerAddr(CustomerAddressId) {
				let that= this
				uni.showModal({
					title: '提示',
					content: '确认删除？',
					success: function (res) {
						if (res.confirm) {
							var params= {
								"CustomerAddressId": CustomerAddressId,
								"SourceOrder": 1
							}
							that.$request(that.$API.DeleteCustomerAddr, params).then(res => {
								uni.navigateBack({
									delta: 1
								})
							})
						}
					}
			});
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		padding-top: 20upx;
	}

	/* addList */
	.addList {
		width: 654upx;
		background: rgba(255, 255, 255, 1);
		border-radius: 12upx;
		padding: 0 24upx;
		margin: auto;
	}

	.addList .list {
		line-height: 95upx;
		border-bottom: 1upx solid #EAEAEA;
		display: flex;
	}
	.radio {
		margin-right: 100upx;
		line-height: 100%;
	}

	.addList .list .label {
		flex: 3;
		font-size: 32upx;
		color: rgba(153, 153, 153, 1);
	}

	.addList .list .inputView {
		flex: 7;
	}

	.list .inputView .entry {
		display: block;
		width: 100%;
		height: 95upx;
		line-height: 95upx;
	}

	.addButton {
		width: 702upx;
		height: 92upx;
		line-height: 92upx;
		text-align: center;
		border-radius: 46upx;
		font-size: 32upx;
		color: rgba(255, 255, 255, 1);
		margin: 120upx auto 0;
	}
	.deleteButton{
		margin: 40upx auto 0;
		background: #ccc;
		color: #333;
	}
</style>

<style>
	radio {
		display: inline-block;
		margin-right: 12upx;
		height: 36upx;
		width: 36upx;
		transform: scale(0.75);
	}
</style>
<template>
	<view class="content">
		<view class="addList">
			<view class="list">
				<view class="label">
					联系人
				</view>
				<view class="inputView">
					<input class="entry" type="text" value="" v-model="form.CustomerName" placeholder="请填写姓名" placeholder-style="color: #D8D8D8;" />
				</view>
			</view>
			<view class="list">
				<view class="label" />
				<view class="inputView">
					<radio-group @change="radioChange">
						<label class="radio">
							<radio :color="bgColor" value="(先生)" :checked="isMan" />先生
						</label>
						<label class="radio">
							<radio :color="bgColor" value="(女士)" :checked="!isMan" />女士
						</label>
					</radio-group>
				</view>
			</view>
			<view class="list">
				<view class="label">
					手机号
				</view>
				<view class="inputView">
					<input type="text" class="entry" value="" v-model="form.CustomerPhone" placeholder="请填写手机号码" placeholder-style="color: #D8D8D8;"
					 maxlength="11" />
				</view>
			</view>
			<view class="list"> 
				<view class="label"> 
					收货地址
				</view>
				<view class="inputView">
					<input type="text" class="entry" v-model="form.Floor" placeholder="点击选择" placeholder-style="color: #D8D8D8;" :disabled="true"
					 @click="goSelectAddress" />
				</view>
			</view>
			<view class="list">
				<view class="label">
					门牌号
				</view>
				<view class="inputView">
					<input type="text" value="" v-model="form.Address" class="entry" placeholder="如1号楼101室" placeholder-style="color: #D8D8D8;" />
				</view>
			</view>
		</view>
		<view class="addButton" :style="'background: '+themeColor" @click="creatAddress">保存地址</view>
		<view v-if="isEdit" class="addButton deleteButton" @click="DeleteCustomerAddr(itemData.CustomerAddressId)">删除地址</view>
	</view>
</template>

<script>
	import {textToast} from '@/common/utils.js'
	export default {
		data() {
			return {
				isEdit: false,
				itemData: {},              // 编辑地址时的原始参数信息
				isMan: true,
				longitude: '',             // 自动获取到的进度
				latitude: '',              // 纬度
				form: {
					"CustomerName": '',
					"CustomerAddressId": '',
					"CustomerPhone": '',
					"ProvinceId": '',
					"ProvinceText": '',
					"CityId": '',
					"CityText": '',
					"DistrictId": '',
					"DistrictText": '',
					"Floor": '',
					"Address": '',
					"Longi": 0,
					"lati": 0,
					"SourceOrder": 1
				},
				bgColor: '#FF303B',
				themeColor: this.$store.state.themeColor
			}
		},
		onLoad(opt) {
			console.log('opt', opt)
			let that= this
			if(opt.edit) {
				uni.setNavigationBarTitle({
				    title: '编辑地址'
				})
				that.isEdit= true
			}
			if(opt.item) {
				var item= JSON.parse(opt.item)
				that.itemData= item
				if (item.CustomerName.indexOf('(先生)') !== -1) {
					item.CustomerName= item.CustomerName.replace(/\([^\)]*\)/gi, "")
				} else if(item.CustomerName.indexOf('(女士)') !== -1) {
					item.CustomerName= item.CustomerName.replace(/\([^\)]*\)/gi, "")
					that.isMan= false
				}
				for(var i in that.form) {
					that.form[i]= item[i]
				}
			}
		},
		methods: {
			goSelectAddress() {
				let that = this
				that.$stopAction(1)
				uni.getSetting({
					success(res) {
						if(res.authSetting['scope.userLocation']) {
							uni.chooseLocation({
								success: function(result) {
									console.log('获取到信息', JSON.stringify(result))
									that.setAddress(result)
								},
								fail() {
									that.$Toast('取消选择')
								}
							})
						} else {
							// 定位权限未开启，引导设置
							uni.showModal({
								title: '位置权限未开启',
								content: '无法自动获取定位，是否去开启？',
								confirmText: '去开启',
								cancelText: '手动选择',
								success(res){
									if (res.confirm) {
										// 打开小程序的设置
										uni.openSetting()
									} else if (res.cancel) {
										// that.$Toast('暂不支持手动选择，敬请期待')
										let editStr= that.isEdit?'&edit=true': ''
										console.log('editStr', editStr)
										uni.redirectTo({
											url: '/pagesB/openMap/openMap?item=' + JSON.stringify(that.form) + editStr
										})
									}
								}
							})
						}
					}
				})
				
			},
			// 设置选择的地址
			setAddress(addressObj) {
				let that= this
				that.form.Longi = addressObj.longitude
				that.form.lati = addressObj.latitude
				var indexArr = [],
					address = addressObj.address;
				for (var i = 0; i < address.length; i++) {
					if (address.charAt(i) === '省') {
						indexArr.push(i + 1)
					} else if (address.charAt(i) === '市') {
						indexArr.push(i + 1)
					} else if (address.charAt(i) === '区' || address.charAt(i) === '县') {
						indexArr.push(i + 1)
					}
				}
				that.form.ProvinceText = address.slice(0, indexArr[0])
				that.form.CityText = address.slice(indexArr[0], indexArr[1])
				that.form.DistrictText = address.slice(indexArr[1], indexArr[2])
				that.form.Floor = address.slice(indexArr[2]) + addressObj.name
			},
			radioChange(e) {
				this.isMan= !this.isMan
			},
			async creatAddress() {
				let that = this
				if (!that.form.CustomerName) {
					textToast('请输入姓名')
					return
				} else if (!that.form.CustomerPhone) {
					textToast('请输入手机号码')
					return
				} else if (!that.form.Floor) {
					textToast('请选择地址')
					return
				} else if (!that.form.Address) {
					textToast('请填写门牌号信息')
					return
				}
				console.log(that.isMan)
				that.form.CustomerName= that.form.CustomerName.replace(/\([^\)]*\)/gi, "")
				if(that.isMan) {
					that.form.CustomerName += '(先生)'
				} else {
					that.form.CustomerName += '(女士)'
				}
				// 编辑地址
				if(that.isEdit) {
					let params= that.form
					params.CustomerAddressId= that.itemData.CustomerAddressId
					let res= await that.$request(that.$API.UpdateCustomerAddr, that.form)
					console.log(res)
					textToast('修改成功')
					uni.navigateBack({
						delta: 1
					})
					return
				}
				// 新增地址
				let res=await that.$request(that.$API.CreateCustomerAddr, that.form)
				console.log(res)
				textToast('添加成功')
				uni.navigateBack({
					delta: 1
				})
			},
			// 删除该地址
			DeleteCustomerAddr(CustomerAddressId) {
				let that= this
				uni.showModal({
					title: '提示',
					content: '确认删除？',
					success: function (res) {
						if (res.confirm) {
							var params= {
								"CustomerAddressId": CustomerAddressId,
								"SourceOrder": 1
							}
							that.$request(that.$API.DeleteCustomerAddr, params).then(res => {
								uni.navigateBack({
									delta: 1
								})
							})
						}
					}
			});
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		padding-top: 20upx;
	}

	/* addList */
	.addList {
		width: 654upx;
		background: rgba(255, 255, 255, 1);
		border-radius: 12upx;
		padding: 0 24upx;
		margin: auto;
	}

	.addList .list {
		line-height: 95upx;
		border-bottom: 1upx solid #EAEAEA;
		display: flex;
	}
	.radio {
		margin-right: 100upx;
		line-height: 100%;
	}

	.addList .list .label {
		flex: 3;
		font-size: 32upx;
		color: rgba(153, 153, 153, 1);
	}

	.addList .list .inputView {
		flex: 7;
	}

	.list .inputView .entry {
		display: block;
		width: 100%;
		height: 95upx;
		line-height: 95upx;
	}

	.addButton {
		width: 702upx;
		height: 92upx;
		line-height: 92upx;
		text-align: center;
		border-radius: 46upx;
		font-size: 32upx;
		color: rgba(255, 255, 255, 1);
		margin: 120upx auto 0;
	}
	.deleteButton{
		margin: 40upx auto 0;
		background: #ccc;
		color: #333;
	}
</style>

<style>
	radio {
		display: inline-block;
		margin-right: 12upx;
		height: 36upx;
		width: 36upx;
		transform: scale(0.75);
	}
</style>
