export function textToast(text, icon, time) {
	uni.showToast({
		title: text,
		duration: time ? Number(time) : 1500,
		icon: icon ? icon : 'none'
	})
}
export function loading() {
	uni.showLoading({
		title: '加载中',
		mask: true
	})
}
export function getQueryString(url, name) {
	console.log("url = " + url)
	console.log("name = " + name)
	var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
	var r = url.substr(1).match(reg)
	if (r != null) {
		console.log("r = " + r)
		console.log("r[2] = " + r[2])
		return r[2]
	}
	return null;
}

// 设置单航栏背景色
export function setNavigatorBg(that) {
	that= that?that: this
	console.log('that', that)
	console.log('调用了', that.$store, that.$store.state.themeColor)
	uni.setNavigationBarColor({
		frontColor: '#ffffff',
		backgroundColor: that.$store.state.themeColor,
		animation: {
			duration: 400,
			timingFunc: 'linear'
		}
	})
}

// 将16进制颜色转成rgba
export function hexToRgba(hex, opacity) {
	hex= hex?hex: uni.getStorageSync('AppThemeColor')
	opacity= opacity?opacity: 0.3
	return 'rgba(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ','
	+ parseInt('0x' + hex.slice(5, 7)) + ',' + opacity + ')';
}

export function getParamsFromUrl(url) {
	if (url.indexOf("?") != -1) {
		var index = url.indexOf('?') + 1;
		// 得到？后的字符串
		var str = url.substr(index); // postid=10457794&actiontip=保存修改成功')
		var paramsObj = {};
		// 字符串通过&标识，转为数组
		console.log('str', str)
		let arrs = str.split("&"); // ["postid=10457794", "actiontip=保存修改成功"]
		for (var i = 0; i < arrs.length; i++) {
			// 分别将 = 左右两边拆分为数组, 动态变为键值对
			paramsObj[arrs[i].split("=")[0]] = arrs[i].split("=")[1]
			//  arrs[i].split("=")   ["postid", "10457794"]
		}
	}
	return paramsObj
}
// 刷新前动画
export function refresh() {
	uni.showLoading({
		title: '刷新中...',
		mask: true
	})
	uni.pageScrollTo({
		scrollTop: 0
	})	

	setTimeout(function() {
		uni.stopPullDownRefresh();
		uni.hideLoading();
	}, 1000);
}

// 处理价格，将小数点前面和后面分割开
export function splitPrice(item) {
	if(!item) {
		return [0,'00']
	}
	let price= item
	if(typeof(item) == 'object') {
		price= item.DiscountPrice?item.DiscountPrice: item.MarketPrice
	}
	price= Number(price)
	price= price.toFixed(3)
	let arr = price.split('.'),
		int= arr[0],
		float= arr[1].substring(0, 2);
	return [int, float]
	
}

// 加入购物车
export async function CreateCustomerCart(code, isBuy) {
	let that = this,
		params = {
			"GoodsCode": code,
			"Quantity": 1,
			"SourceOrder": 1
		},
		res = await that.$request(that.$API.CreateCustomerCart, params)
	if (res) {
		if(!isBuy) {
			that.$Toast('添加成功', 'none', 2000)
		}
		return true
	}
	that.$Toast('添加失败')
	return false
}
let clickCartTime = 0

// 点击节流，形参time为时间内点击次数， sectionTime为多长时间内点击
export const stopAction = function stopAction(time, sectionTime, title) {
	let that = this
	title= title?title: '操作过于频繁'
	sectionTime= sectionTime? sectionTime: 1000
	time = time ? time : 2
	clickCartTime += 1
	// 节流每秒最多点两次
	if (clickCartTime > time) {
		that.$Toast(title)
		return false
	}
	setTimeout(function() {
		clickCartTime = 0
	}, sectionTime)
	return true
}

// 计算剩余时间返回倒计时
export async function curtTime(CreateDate, EffectiveTime, callback) {
	// 兼容ios端8小时时差问题
	CreateDate= CreateDate.slice(0,19)
	CreateDate= CreateDate.replace(/-/g, "/")
	CreateDate= CreateDate.replace(/T/g, " ")
	
	let Effective = EffectiveTime ? EffectiveTime * 3600000 : 0,
		endTime = Date.parse(new Date(CreateDate)) + Effective

	if (endTime === "") {
		return
	}

	function checkTime(i) { //将0-9的数字前面加上0，例1变为01 
		if (i < 10) {
			i = "0" + i;
		}
		return i;
	}
	let countDown = Date.parse(new Date(endTime)),
		nowTime = Date.parse(new Date())
	if (countDown < nowTime) {
		callback('')
		return
	}
	var leftTime = (countDown) - (new Date()); //计算剩余的毫秒数 

	var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数 
	var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时 
	var minutes = parseInt(leftTime / 1000 / 60 % 60, 10); //计算剩余的分钟 
	var seconds = parseInt(leftTime / 1000 % 60, 10); //计算剩余的秒数 
	// days = checkTime(days);

	hours = checkTime(hours)
	minutes = checkTime(minutes);
	seconds = checkTime(seconds);
	
	// let nowTime = (days == 0 ? '' : (days * 24)) + hours + ":" + minutes + ":" + seconds
	// let hour = days == 0 ? hours : (days * 24) + hours

	let arr = days == 0 ? [hours, minutes, seconds] : [hours, minutes, seconds, days]
	callback(arr)

	if (hours == '00' && minutes == '00' && seconds == '00') {
		callback('')
	}

}

// 批量处理倒计时(返回格式array[时，分，秒，天]) 并返回倒计时剩余时间与有效期时长比例
export async function mapCurtTime(CreateDate, EffectiveTime, item) {
	item.timer= setInterval(function(){
		curtTime(CreateDate, EffectiveTime, function(response) {
			let second = response[3]? (Number(response[3]) * 86400) + (Number(response[0]) * 3600) + (Number(response[1]) * 60) + Number(response[2]): 
				(Number(response[0]) * 3600) + (Number(response[1]) * 60) + Number(response[2])
			if(!response) {
				clearInterval(item.timer)
				item.timer= {}
			} else if(response[3]) {
				let day= response[3] + '天'
				response.pop()
				item['leave_time']= response? day + response.join(':') : ''
			} else {
				item['leave_time']= response? response.join(':') : ''
			}
			// 比例
			let proportion= (second / 3600 / EffectiveTime).toFixed(3) * 100
			item['width']= proportion > 100 ? 100: proportion
		})
	}, 1000)
}


export async function showT(tit, msg, s) {
	return new Promise((resolve, reject) => {
		uni.showModal({
			title: tit,
			content: msg,
			showCancel: s,
			success: function(res) {
				if (res.confirm) {
					resolve(1)
				} else if (res.cancel) {
					resolve(0)
				}
			}
		})
	})
}

export async function getProvider(service, type) {
	return new Promise((resolve, reject) => {
		uni.getProvider({
			service: service,
			success: function(res) {
				console.log(res.provider)
				if (~res.provider.indexOf(type)) {
					resolve(res.provider)
				} else {
					reject(0)
				}
			}
		})
	})
}
export async function WxPay(params) {
	console.log(params)
	return new Promise((resolve, reject) => {
		uni.requestPayment({
			provider: 'wxpay',
			timeStamp: params.timeStamp,
			nonceStr: params.nonceStr,
			package: params.package,
			signType: params.signType,
			paySign: params.sign,
			success: function(res) {
				console.log('支付success:' + JSON.stringify(res));
				resolve(res)
			},
			fail: function(err) {
				console.log('支付fail:' + JSON.stringify(err));
				resolve('')
			}
		})
	})
}
export async function getLocation() {
	return new Promise((resolve, reject) => {
		uni.getLocation({
			type: 'wgs84',
			success: function(res) {
				resolve(res)
			},
			fail(err) {
				reject(err)
			}
		})
	})
}

export async function getBase64Image(imgPath) {
	return new Promise((resolve, reject) => {
		uni.getFileSystemManager().readFile({
			filePath: imgPath, //选择图片返回的相对路径
			encoding: 'base64', //编码格式
			success: res => { //成功的回调
				resolve(res.data)
			}
		})
	})
}
