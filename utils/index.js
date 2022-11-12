uni.$u.http.setConfig((config) => {
	/* config 为默认全局配置*/
	config.baseURL = 'https://adm.kaoyanxiao.com/api/'; 
	return config
})

export default {
	HOST:'//adm.kaoyanxiao.com:8099',
	baseUrl: 'https://adm.kaoyanxiao.com/api/',
	Interface:{
		'uploadFilesBase64': {
		  url: 'File/UploadFilesBase64',
		  method: 'POST'
		},
		'getSessionkey':{
			url: 'HYJY/Paths/GetSessionkey',
			method: 'POST'
		},
		'getSelData': {
		  url: 'HYJY/Paths/GetNextPaths',
		  method: 'POST'
		},
		'checkTel': {//验证手机号是否存在
		  url: 'HYJY/Paths/CheckTel',
		  method: 'POST'
		},
		// 'sendVCodeLogin': {// 报考信息页面获取验证码
		//   url: 'HYJY/Paths/SendVCodeLogin',
		//   method: 'POST'
		// },
		'getInfoExist': {
		  url: 'HYJY/Paths/GetInfoExist',
		  method: 'POST'
		},
		// 'getCode': {// 报考信息页面获取验证码
		//   url: 'HYJY/Paths/SendVCode',
		//   method: 'POST'
		// },
		'complete': {  //验证码填写完成接口
		  url: 'HYJY/Paths/GetRank',
		  method: 'POST'
		},
		'getRank': {//排名页面数据
		  url: 'HYJY/Paths/GetInfo',
		  method: 'POST'
		},
		// 'getWxConfig': {
		//   url: 'HYJY/Paths/GetWxConfig',
		//   method: 'POST'
		// },
		'getRankList': {
		  url: 'HYJY/Paths/GetUsers',
		  method: 'POST'
		},
		'getContent':{
		  url: 'HYJY/History/GetContent',
		  method: 'POST'
		}
	},
	post: function(name, params, config){
		let url = this.Interface[name].url
		return uni.$u.http.post(url, params, config={})
	},
	get: function(name, params){
		let url = this.Interface[name].url
		return uni.$u.http.get(url, params)
	}
}

