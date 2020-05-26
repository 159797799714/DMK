import withoutLoginApi from '@/api/withoutLogin.js'
import {textToast} from '../common/utils.js'


// let baseUrl= "http://172.20.1.26:8848/"
let baseUrl= "https://www.gudongxiong.com:8888/"

let isLogin= false
export function request(url,paramData,method,mode) {
	let token = this.$store.state.token,
		tokenDefault= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTb3VyY2VPcmRlciI6MSwiQ3VzdG9tZXJVaWQiOiIxODgxODMyNjA4NyIsIkN1c3RvbWVyUGF3IjoiMTIzNDU2IiwiQWRkciI6Ijo6MSIsIlBsYXRmb3JtIjoiV2luTlQifQ.lOnwcFTVAWYHGlFIw52fdKsG8DOJFXJAXDpdl6ew-2w'
	
	if(!paramData){
		paramData={'SourceOrder': 1}
	}else{
		paramData.SourceOrder=1
	}	
	// 判断是否需要登录
	let needLogin = withoutLoginApi.indexOf(url) === -1
	if (!token && !needLogin) {
		token = tokenDefault
		console.log('不需要登录', url)
	} else if (!token && needLogin) {
		console.log('需要登录', url)
		uni.redirectTo({
			url: '/pages/login/login',
			success() {
				console.log('success')
				isLogin= true
				return null
			}
		})
		return
	}
	
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + url, //仅为示例，并非真实接口地址。
			data: paramData,
			method: method? method: 'POST',
			header: {
				'content-type': 'application/json;charset=utf-8',
				'Authorization': 'Basic ' + token
			},
			timeout: 10000,
			success(res) {
				// 上传头像
				if(res.statusCode === 429) {
					textToast(res.data.message)
					return
				}
				let data = res.data
				switch(data.Success) {
					case 0:
						resolve(data)
						break
					case 1000:
						textToast('请登录')
						uni.redirectTo({
							url: '/pages/login/login'
						})	
						break
					case 1001:
						textToast(data.Message)
						if(mode) {
							resolve(data)
						}
						break
					case 1002:
						textToast(data.Message)
						if(mode) {
							resolve(data)
						}
						break	
					case 1003:
						if(mode) {
							resolve(data)
						}
						break
					case 1004:
						uni.showModal({
							title: '该商品已下架',
							showCancel: false,
							content: '是否返回上一页？',
							success: function (res) {
								if (res.confirm) {
									uni.navigateBack({
										delta: 1
									})
								} else if (res.cancel) {
									return
								}
							}
						})
						break	
					case 9999:
						textToast(data.Message)
						if(mode) {
							resolve(data)
						}
						break	
				}
			},
			fail(err) {
				console.log('错了这里错了', err)
				uni.hideLoading()
				textToast('网络异常，请检查网络设置')
				reject(err)
			}
		})
	})
}