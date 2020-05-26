// const regeneratorRuntime = require('./runtime.js');
const now = Date.now || function() {
	return new Date().getTime();
};
const isArray = Array.isArray || function(obj) {
	return obj instanceof Array;
};
const toFixed = function(num) {
	if(!num) {
		return '0.00'
	}
	num= Number(num)
	num= num.toFixed(3)
	let arr = num.split('.'),
		int= arr[0],
		float= arr[1].substring(0, 2),
		str= int + '.' + float;
	return str

}

const filter_fields = function(e) {
	if (e.DiscountPrice > 0) {
		// console.log('DiscountPrice',e.DiscountPrice)
		return e.DiscountPrice
	}
	if (e.MembershipPrice > 0) {
		// console.log('MembershipPrice',e.MembershipPrice)
		return e.MembershipPrice
	}
	if (e.MarketPrice > 0) {
		// console.log('MarketPrice',e.MarketPrice)
		return e.MarketPrice
	}

};
const merged_array = function(list) {
	var listArr = [];
	list.forEach(function(el, index) {

		for (let i = 0; i < listArr.length; i++) {
			// 对比相同的字段key，相同放入对应的数组
			if (listArr[i].child_id == el.child_id) {
				listArr[i].listInfo.push(el);
				return;
			}
		}
		// 第一次对比没有参照，放入参照
		listArr.push({
			child_id: el.child_id,
			listInfo: [el]
		});

	})
	return listArr
}
const getLoginCode = function getLoginCode(_p){
	return new Promise((resolve, reject) => {
	uni.login({
	  provider: 'weixin',
	  success: function (loginRes) {
	    console.log(loginRes);
		  resolve(loginRes.code)
	  }
	});
	})
}
const getDataTime = function formatUnixtimestamp(unixtimestamp) { //时间戳转换yy-mm-dd hh-mm-ss
	var unixtimestamp = new Date(unixtimestamp * 1000);
	var year = 1900 + unixtimestamp.getYear();
	var month = "0" + (unixtimestamp.getMonth() + 1);
	var date = "0" + unixtimestamp.getDate();
	var hour = "0" + unixtimestamp.getHours();
	var minute = "0" + unixtimestamp.getMinutes();
	var second = "0" + unixtimestamp.getSeconds();
	return year + "-" + month.substring(month.length - 2, month.length) + "-" + date.substring(date.length - 2, date.length) +
		" " + hour.substring(hour.length - 2, hour.length) + ":" +
		minute.substring(minute.length - 2, minute.length) + ":" +
		second.substring(second.length - 2, second.length);

}
const getNodeInfo = async function(ble, number, str) { //传入class名和差异数值，获取div高度
	return await new Promise((resolve, reject) => {
		let value = 0
		let view = uni.createSelectorQuery().select(ble);
		view.fields({
			size: true,
			scrollOffset: true,
			rect: true
		}, async data => {
			value = data[str] + number
			resolve(value)
		}).exec();
	})
}

const merged_ick = function(list) { //遍历数组合并相同字段值例如 taste_type

	var listArr = [];
	list.forEach(function(el, index) {
		for (let i = 0; i < listArr.length; i++) {
			// 对比相同的字段key，相同放入对应的数组
			if (listArr[i].taste_type == el.taste_type) {

				listArr[i].list.push(el);
				return;
			}
		}

		// 第一次对比没有参照，放入参照
		listArr.push({
			taste_type: el.taste_type,
			list: [el]
		});

	})
	return listArr
}


const compare = function compare(property) {
	return function(a, b) {
		var value1 = a[property];
		var value2 = b[property];
		return value2 - value1;
	};
}
// 计算剩余时间返回倒计时
const CurtTime = function async (endTime) {
	
	return new Promise((resolve, reject) => {
		if (endTime === "") {
			resolve(0)
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
			resolve(0)
		}
		var leftTime = (countDown) - (new Date()); //计算剩余的毫秒数 

		var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数 
		var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时 
		var minutes = parseInt(leftTime / 1000 / 60 % 60, 10); //计算剩余的分钟 
		var seconds = parseInt(leftTime / 1000 % 60, 10); //计算剩余的秒数 
		// days = checkTime(days);
		if (days == 0) {
			hours = checkTime(hours);
		}
		minutes = checkTime(minutes);
		seconds = checkTime(seconds);

		// let nowTime = (days == 0 ? '' : (days * 24)) + hours + ":" + minutes + ":" + seconds
		let hour = days == 0 ? '00' : (days * 24) + hours

		resolve([hour, minutes, seconds])

		// if (hours == '00' && minutes == '00' && seconds == '00') {
		//   clearInterval(countDownName);
		// }
		// }, 1000)
	})
}
const preview = function preview(list, i) {
	console.log(typeof(list), list, i)
	let array= []
	switch(typeof(list)) {
		case 'string':
			array.push({
				path: list
			})
			break
		case 'object':
			array= list
			break
	}
	let path = []
	array.forEach((e) => {
		if (e.path) {
			path.push(e.path)
		}
		if (e.NetPath) {
			path.push(e.NetPath)
		}
	})
	uni.previewImage({
		current: i,
		urls: path,
		longPressActions: {
			itemList: ['发送给朋友', '保存图片', '收藏'],
			success: function(data) {
				console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
			},
			fail: function(err) {
				console.log(err.errMsg);
			}
		}
	});
}
const getCanvasImg = function(that, item, count) {
	uni.chooseImage({
		count: count?count: 5,       // 默认9
		sizeType: ['compressed'], // 指定只能为压缩图，首先进行一次默认压缩
		success: function(photo) {
     for(let i=0;i< photo.tempFilePaths.length;i++){
			//-----返回选定照片的本地文件路径列表，获取照片信息-----------
			// photo.tempFilePaths.forEach((eImg)=>{
			uni.getImageInfo({
				src: photo.tempFilePaths[i],
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
								item.updataImgList.push({
									path: res.path,
									type: res.type == 'jpeg' ? 'jpg' : res.type
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
											item.updataImgList.push({
												path: res.tempFilePath,
												type: 'jpg'
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
		}
	})
}
/**
 * 解决两个数相加精度丢失问题
 * @param a
 * @param b
 * @returns {Number}
 */
const floatAdd=function floatAdd(a, b) {
    var c, d, e;
    if(undefined==a||null==a||""==a||isNaN(a)){a=0;}
    if(undefined==b||null==b||""==b||isNaN(b)){b=0;}
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    e = Math.pow(10, Math.max(c, d));
    return  (floatMul(a, e) + floatMul(b, e)) / e;
}
/**
 * 解决两个数相减精度丢失问题
 * @param a
 * @param b
 * @returns {Number}
 */
const floatSub=function floatSub(a, b) {
    var c, d, e;
    if(undefined==a||null==a||""==a||isNaN(a)){a=0;}
    if(undefined==b||null==b||""==b||isNaN(b)){b=0;}
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    e = Math.pow(10, Math.max(c, d));
    return (floatMul(a, e) - floatMul(b, e)) / e;
}
/**
 * 解决两个数相乘精度丢失问题
 * @param a
 * @param b
 * @returns {Number}
 */
const floatMul=function floatMul(a, b) {
    var c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) {}
    try {
        c += e.split(".")[1].length;
    } catch (f) {}
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}
/**
 * 解决两个数相除精度丢失问题
 * @param a
 * @param b
 * @returns
 */
const floatDiv=function floatDiv(a, b) {
    var c, d, e = 0,
        f = 0;
    try {
        e = a.toString().split(".")[1].length;
    } catch (g) {}
    try {
        f = b.toString().split(".")[1].length;
    } catch (g) {}
    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), floatMul(c / d, Math.pow(10, f - e));
}
export default {
	floatDiv,
	floatMul,
	floatSub,
	floatAdd,
	now,
	isArray,
	merged_array,
	merged_ick,
	getNodeInfo,
	getDataTime,
	compare,
	toFixed,
	filter_fields,
	CurtTime,
	getCanvasImg,
	preview,
	getLoginCode
}
