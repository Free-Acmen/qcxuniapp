<template>
	<view class="index-page">
		<u--image @click="bannerLink" src="/static/images/banner.png" width="100%" height="320rpx" :lazy-load="true"></u--image>
		<view class="section">				
			<u-cell @click="cellHandel('city')"  title="省市" isLink :value="city||'请选择省市'"></u-cell>
			<u-cell @click="cellHandel('colleges', 'city')" title="院校" is-link :value="colleges||'请选择院校'"></u-cell>
			<u-cell @click="cellHandel('system', 'colleges')" title="院系" is-link :value="system||'请选择院系'"></u-cell>
			<u-cell @click="cellHandel('major', 'system')" title="专业" is-link :value="major || '请选择专业'"></u-cell>
			<u-cell @click="cellHandel('direction', 'major')" title="方向" is-link :value="direction ||'请选择方向'"></u-cell>
			<u-cell @click="cellHandel('subject', 'direction')" title="科目" is-link :value="subject ? subject.slice(0,18)+'...':'请选择科目'"></u-cell>
		</view>
			
			
		<view class="footer">
			<view class="btn">
				<view class="mini-btn">
					<u-button open-type="contact"><u-icon name="kefu-ermai" size="26"></u-icon></u-button>
				</view>
				<view class="mini-btn">
					<u-button v-if="!userLoginFlag" @click="login">登录</u-button>
					<u-button  v-else @click="search">查询</u-button>
					<!-- <u-button v-else open-type="getUserInfo" @getuserinfo="userinfoHandle">查询</u-button> -->
				</view>
				<view class="big-btn">
					<u-button type="primary" text="确认提交" @click="submit"></u-button>
				</view>
			</view>
		</view>  
		
		<u-picker :show="cityFlag" :loading="loading" show-toolbar title="省市" :columns="cityList" @cancel="cancel('city')" @confirm="cityConfirm"></u-picker> 
		<u-picker :show="collegesFlag" :loading="loading" show-toolbar title="院校" :columns="collegesList" @cancel="cancel('colleges')" @confirm="collegesConfirm"></u-picker>
		<u-picker :show="systemFlag" :loading="loading" show-toolbar title="院系" :columns="systemList" @cancel="cancel('system')" @confirm="systemConfirm"></u-picker>
		<u-picker :show="majorFlag" :loading="loading" show-toolbar title="专业" :columns="majorList" @cancel="cancel('major')" @confirm="majorConfirm"></u-picker>
		<u-picker :show="directionFlag" :loading="loading" show-toolbar title="方向" :columns="directionList" @cancel="cancel('direction')" @confirm="directionConfirm"></u-picker>
		
		<view class="subject-pop">
			<u-popup :show="subjectFlag" mode="right" :customStyle="{width:'100%'}">
				<view class="subject-list">
					<view class="subject-title">选择科目</view>
					<view class="subject-item" @click="subjectSel = index" v-for="(item, index) in subjectList[0]" :key="index">
						{{item}}
						<!-- <text class="sel" v-if="subjectSel == index"></text> -->
						<view class="sel" v-if="subjectSel == index">
							<u--image src="/static/images/sel.png" width="60rpx" height="50rpx"></u--image>
						</view>
					</view>
					<view class="subject-btn">
						<u-button type="primary" shape="circle" @click="subjectConfirm(subjectSel)">确认</u-button>
					</view>
				</view>
			</u-popup>
		</view>
		
		<u-notify ref="uNotify"></u-notify>
	</view>
</template>

<script>
	// import WXBizDataCrypt from "@/utils/WXBizDataCrypt.js"
	
	let listkeys={
		cityKey: {},
		collegesKey: {},  
		systemKey: {},   
		majorKey: {},   
		directionKey: {},  
		subjectKey: {}
	} 
	
	export default {
		data() {
			return {
				title: '前程校',
				params:{},
				height: '568px',
				cityFlag: false,
				collegesFlag: false,
				systemFlag: false,
				majorFlag: false,
				directionFlag: false,
				subjectFlag: false,
				loading: false,
				
				city:'',
				colleges: '',
				system: '',
				major: '',
				direction: '',
				subject: '',
				
				cityList: [[]],
				collegesList: [[]],
				systemList: [[]],
				majorList: [[]],
				directionList: [[]],
				subjectList: [[]],
				subjectSel: 0,
				userLoginFlag: true,
			}
		},
		onLoad() {
			let phone = uni.getStorageSync('phone');
			// console.log(phone)
			
			if(phone){
				this.userLoginFlag = true;
			}else{
				wx.checkSession({
					success: () => {
						this.userLoginFlag = true;
						console.log('登录未过期');
					},
					fail: () => {
						console.log('登录已过期');
						this.userLoginFlag = false;
					}
				})
			}
			this.getInitData()
		},
		methods: {
			getInitData: function(){
				//省市数据调用  
				this.$utils.post('getSelData', '0').then(res => {
					// console.log(res)
					if(res.data.data){
						var obj = {}, arr = []
						res.data.data.forEach(item => {
							arr.push(item.name)
							obj[item.name] = item
						});
						listkeys.cityKey = obj
						this.cityList = [arr]
					}
				})
			},
			bannerLink: function() {
				let href = 'https://mp.weixin.qq.com/s/DRqEjv3fCKdaOvW3DR42qg'
				uni.navigateTo({
					url:'/pages/webview/webview?href='+encodeURIComponent(href)
				})
			},
			cellHandel: function(key, dataKey){
				this.resetFlag()
				var keys = key + 'Flag'
				this[keys] = true
				if(key != 'city'){
					if(!listkeys[dataKey+'Key'][this[dataKey]]){
						this.$refs.uNotify.warning('请先选择上级数据！')
						// vant.Notify({ type: 'warning', message: '请先选择上级数据！' });
						this[keys] = false
						return
					}
					var id = listkeys[dataKey+'Key'][this[dataKey]].id
					this.loading = true
					
					// console.log(JSON.stringify(id))
					this.$utils.post('getSelData', JSON.stringify(id)).then(res=>{
						var list =  key + 'List';
						if(res.data.data){
							var obj = {}, arr = []
							res.data.data.forEach(item => {
								arr.push(item.name)
								obj[item.name] = item
							});
							listkeys[key + 'Key'] = obj
							this[list] = [arr]
						}
						this.loading = false;
					})
				}
			},
			cancel: function(key){
				var keys = key + 'Flag'
				this[keys] = false
			},
			resetFlag: function(){
				this.cityFlag = false
				this.collegesFlag = false
				this.systemFlag = false
				this.majorFlag = false
				this.directionFlag = false
				this.subjectFlag = false
			},
			restVal(arr){
				arr.forEach(key=>{
					this[key]=''
					this[key+'List']=[[]]
				})
			},
			cityConfirm: function(value, index){
				console.log(value, index)
				this.city = value.value[0]
				this.cityFlag = false
				this.restVal(['colleges','system','major','direction','subject'])
			},
			collegesConfirm: function(value, index){
				this.colleges = value.value[0]
				this.collegesFlag = false
				this.restVal(['system','major','direction','subject'])
			},
			systemConfirm: function(value, index){
				this.system = value.value[0]
				this.systemFlag = false
				this.restVal(['major','direction','subject'])
			},
			majorConfirm: function(value, index){
				this.major = value.value[0]
				this.majorFlag = false
				this.restVal(['direction','subject'])
			},
			directionConfirm: function(value, index){
				this.direction = value.value[0]
				this.directionFlag = false
				this.restVal(['subject'])
			},
			subjectConfirm: function(index){
				this.subject = this.subjectList[0][index]
				this.subjectFlag = false
			},
			submit: async function(){
				if(!(this.city&&this.colleges&&this.system&&this.major&&this.direction&&this.subject)){
					this.$refs.uNotify.error('请先填写完整信息在提交！')
					return
				}
				var data = {
					p1: { id: listkeys.cityKey[this.city].id, name: this.city},
					p2: { id: listkeys.collegesKey[this.colleges].id, name: this.colleges},
					p3: { id: listkeys.systemKey[this.system].id, name: this.system},
					p4: { id: listkeys.majorKey[this.major].id, name: this.major},
					p5: { id: listkeys.directionKey[this.direction].id, name: this.direction},
					p6: { id: listkeys.subjectKey[this.subject].id, name: this.subject}
				}
				
				if(this.userLoginFlag){
					uni.setStorageSync('s-paths', data)
					uni.navigateTo({
						url:'/pages/grade/grade'
					})
				}else{
					let code = await this.login()
					// let cts = await this.getsessinKey()
					uni.setStorageSync('s-paths', data)
					
					uni.navigateTo({
						url:'/pages/grade/grade'
					})
				}
			},
			login(){
				return new Promise(reslove=>{
					uni.login({
					    provider:'weixin',
					    success: data=>{
					        // console.log(data);
									this.userLoginFlag=true
									uni.setStorageSync('wxCode', data.code);
									this.getsessinKey()
									reslove(data.code)
					    },
					    fail(err) {
					      console.log(err);
					    }
					})
				})
			},
			search(){
				let phone = uni.getStorageSync('phone');
				if(phone){
					this.$utils.post('checkTel', JSON.stringify(phone)).then(res => {
						if(res.data.message == 'OK'){
							this.completeHandle(phone)
						}else{
							this.$refs.uNotify.warning('没有检测到你的排名记录，请重新录入！')
						}
					})	
				}else{
					this.$refs.uNotify.warning('没有检测到你的排名记录，请重新录入！')
				}
			},
			// userinfoHandle(e){
			// 	console.log(e)
			// 	if(e.detail.errMsg == "getUserInfo:ok"){
					
			// 	}else{
			// 		console.log("获取用户信息失败")
			// 	}
			// },
			getsessinKey(){
				return new Promise(reslove=>{
					let code = uni.getStorageSync('wxCode');
					// let data={
					// 	code: code
					// }
					// this.$utils.post('getSessionkey', data).then(function(res){
					// 	if(res.data.data){
					// 		console.log('获取信息1',res);  // 换取成功后 暂存这些数据 留作后续操作
					// 		let cts = res.data.data
					// 		uni.setStorageSync('openid', cts.openid)
					// 		uni.setStorageSync('sessionKey', cts.session_key)
					// 		reslove({openid:cts.openid, sessionKey:cts.session_key})
					// 	}
					// })
					uni.request({
						url: 'https://api.weixin.qq.com/sns/jscode2session',
						method:'GET',
						data: {
							appid: 'wxcc9c3cbe25a6b340',        //你的小程序的APPID
							secret: '87e0512b22f7193cb61f79d6dfc4d7a8',    //你的小程序秘钥secret,  
							js_code: code,    //wx.login 登录成功后的code
							grant_type:'authorization_code'
						},
						success: (cts) => {
							console.log('获取信息',cts);  // 换取成功后 暂存这些数据 留作后续操作
							// this.openid=cts.data.openid    //openid 用户唯一标识
							// this.session_key=cts.data.session_key    //session_key  会话密钥
							uni.setStorageSync('openid', cts.data.openid)
							uni.setStorageSync('sessionKey', cts.data.session_key)
							reslove({openid:cts.data.openid, sessionKey:cts.data.session_key})
						}
					});
				})
			},
			
			completeHandle: function(phone){
				var data = {
					tel: phone,
					// code: this.code
				}
				this.$utils.post('getInfoExist', data).then(res=>{
					// console.log(res)
					var sPaths = {
						p1: { id: res.data.p1id, name: res.data.p1name},
						p2: { id: res.data.p2id, name: res.data.p2name},
						p3: { id: res.data.p3id, name: res.data.p3name},
						p4: { id: res.data.p4id, name: res.data.p4name},
						p5: { id: res.data.p5id, name: res.data.p5name},
						p6: { id: res.data.p6id, name: res.data.p6name}
					}
					
					uni.setStorageSync('s-paths', sPaths)
					uni.setStorageSync('uinfo', res.data.data.Id)
					uni.setStorageSync('rank', res.data.data)
					
					uni.navigateTo({
						url:'/pages/rank/rank'
					})
				})
			},
		}
	}
</script>

<style lang="scss">
	.footer{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		.btn{
			display:flex;
			align-items: center;
			.mini-btn{
				width: 120rpx;
			}
			.big-btn{
				flex: 1 0 auto;
			}
		}
	}
	.subject-pop{
		.u-slide-right-enter-to{
			left: 0;
		}
		
		.subject-list{
		  padding: 16rpx 20rpx;
		  font-size: 30rpx;
		  color: #1A1651;
		  background: #F7F3FF;
		  height: 100%;
		  position: relative;
		}
		.subject-title{
		  font-size: 46rpx;
		  margin-bottom: 16rpx;
		  font-weight: 700;
		}
		
		.subject-item{
		  margin-bottom: 24rpx;
		  background: #fff;
		  padding: 2% 10% 2% 4%;
		  line-height: 50rpx;
		  border-radius: 12rpx;
		  position: relative;
		}
		.subject-item .sel{
		  position: absolute;
		  top: 0;
		  right: 0;
		  width: 60rpx;
		  height: 50rpx;
		}
		
		// .subject-btn{
		// 	margin-top: 10rpx;
		// }
	}
</style>
