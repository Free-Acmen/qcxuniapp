module.exports = {
	onLoad() {
		// 设置默认的转发参数
		uni.$u.mpShare = {
			title: '', // 默认为小程序名称
			path: '', // 默认为当前页面路径
			imageUrl: '' // 默认为当前页面的截图
		}
		uni.$u.mpShareTime = {
			title: '前程校2022考研初试排名查询',
			summary:'我刚在这里查询了考研初试排名，很好用，你也来查一下吧！知己知彼，复试无忧！',
			imageUrl: 'https://tyimg.esells.cn/others/TemporaryFile/Product/20220220/8ddfd05fb1a3438f85d62d6d9034eabc.jpg' // 默认为当前页面的截图
		}
	},
	onShareAppMessage() {
		return uni.$u.mpShare
	},
	onShareTimeline(res) {
		return uni.$u.mpShareTime
	}
}
