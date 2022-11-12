<template>
	<view>
		<view class="grade-info">
			<image src="/static/images/topbg.png" ></image>
			<view class="title">
				<text>报考信息</text>  
			</view>  
			<view>
				<text>报考院校:</text>
				<text class="val">{{sPaths && sPaths.p2.name}}</text>
			</view>
			<view>
				<text>报考院系:</text>
				<text  class="val">{{sPaths && sPaths.p3.name}}</text>
			</view>
			<view>
				<text>报考专业:</text>
				<text class="val">{{sPaths && sPaths.p4.name}}</text>
			</view>
		</view>
		<view class="grade">
			<view class="grade-field">
				<view class="field-label">姓名</view>
				<view class="field-val">
					<u--input v-model="name" placeholder="请输入姓名" inputAlign="right" border="none"></u--input>
				</view>
			</view>
			<view class="grade-field" v-for="(item, index) in grades" :key="index">
				<view class="field-label">{{item.name}}</view>
				<view class="field-val score">
					<u--input :customStyle="{'margin-right':'12rpx'}" v-model="item.grade" type="number" inputAlign="right" placeholder="请输入分数" border="none"></u--input>
					<text>分</text>
				</view>
			</view>
		</view>
		
		<view class="grade-img">
			<view class="text">上传成绩截图</view>
			<view class="upload-filed">
				<view class="img-upload">
					<u-upload
						accept="image"
						:fileList="fileList"
						:maxCount="1"
						:maxSize="5242880"
						:deletable="true" 
						:previewImage="true"
						@afterRead="afterRead"
						@delete="deletePic"
						@oversize="overSize"
					></u-upload>
				</view>
				<view class="img-info">
					<view>【重要说明】</view>
					<view>1、需要有姓名，准考证号信息部分可以马赛克；</view>
					<view>2、仅提取成绩信息，不会透漏姓名等隐私；</view>
					<view>3、只能提交一个成绩，提交成功无法撤回；</view>
					<view>4、不按规则上传，将被永久禁用使用权限！</view>
				</view>
				
			</view>
		</view>
		
		<view class="grade-footer">
			<view class="btn-1">
				<u-button v-if="phone" shape="circle" type="primary" text="查询排名" @click="queryHandle"></u-button>
				<u-button v-else shape="circle" type="primary" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">查询排名</u-button>
			</view>
			<u-button shape="circle" text="重新查询" @click="reset"></u-button>
		</view> 
		<u-modal :show="modelShow" title="提示" content='请确认一下, 你确定需要重新查询吗？' :showCancelButton="true" @confirm="resetHandle" @cancel="modelShow=false"></u-modal>
		<u-notify ref="uNotify"></u-notify>
	</view>
</template>

<script>
	import WXBizDataCrypt from "@/utils/WXBizDataCrypt.js"
	
	export default {
		data() {
			return {
				sPaths:{
					p2:{},
					p3:{},
					p4:{}
				},
				name:'',
				grades:[],
				fileList: [],
				imgUrl:'',
				phone:'',
				modelShow: false
			}
		},
		onLoad() {
			this.sPaths = uni.getStorageSync('s-paths');
			if(!this.sPaths){
				uni.navigateTo({
					url:'/pages/index/index'
				})
				return false
			}
			this.phone = uni.getStorageSync('phone');
			this.initData()
		},
		methods: {
			initData: function(){
				if(this.sPaths){
					var id = JSON.stringify(this.sPaths.p6.id)  
					this.$utils.post('getSelData', id).then(res=>{
						if(res.data.data){
							var arr = []
							res.data.data.forEach(item => {
								var obj = {}
								obj.id = item.id
								obj.name = item.name
								obj.grade = item.grade
								arr.push(obj)
							});
							this.grades = arr
						}
					})
				}
			},
			async afterRead(e){
				console.log(e)
				let file = e.file
				this.fileList.push({url: file.url})
				let url = await this.base64(file.url)
				let data={
					base64Url: url
				}
				this.$utils.post('uploadFilesBase64', data).then(function(res){
					console.log(res);
					if(res.data.data){
						this.imgUrl = res.data.data.url
					}
				})
				// this.base64(e.file.url')
			},
			overSize: function(file){
				this.$refs.uNotify.warning('图片过大，请上传小于5M的图片');
			},
			deletePic(e){
				console.log(e);
				this.fileList.splice(e.index, 1)
			},
			queryHandle: function(){
				var flag = true
				// console.log(this.grades, this.name)
				this.grades.forEach( item => {
					if(item.grade === ''){
						flag = false
					}
				})
				if(!flag || !this.name || this.fileList.length <=0){
					this.$refs.uNotify.warning('请先填写完整信息在查询！' );        
					return
				}
				
				this.completeHandle()
			},
					
			onGetPhoneNumber(e){
				if(e.detail.errMsg == "getPhoneNumber:ok"){
					// console.log("用户点击了接受")
					// console.log(e.detail);
					let errMsg = e.detail.errMsg
					
					let encryptedData = e.detail.encryptedData
					let iv = e.detail.iv   
					let sessionKey = uni.getStorageSync('sessionKey');
				
				  let pc = new WXBizDataCrypt('wxcc9c3cbe25a6b340', sessionKey);
				  let data = pc.decryptData(encryptedData , iv);  
				  // console.log(data)
					this.phone = data.phoneNumber
					uni.setStorageSync('phone', data.phoneNumber)
					
					var flag = true
					this.grades.forEach( item => {
						if(item.grade === ''){
							flag = false
						}
					})
					if(!flag || !this.name || this.fileList.length <=0){
						this.$refs.uNotify.warning('请先填写完整信息在查询！' );        
						return
					}
					this.completeHandle()
				}else{
					// console.log("用户点击了拒绝")
				}   
			},
			completeHandle: function(){
				var data = {
					tel: this.phone,
					name: this.name,
					spath: this.sPaths,
					grades: this.grades,
					image: this.imgUrl
				}
				this.$utils.post('complete', data).then(res=>{
					if(res.data.data){
						uni.setStorageSync('uinfo', res.data.data)
						uni.navigateTo({
							url:'/pages/rank/rank'
						})
					}
				})
			},
			reset: function(){
				this.modelShow=true
			},
			resetHandle(){
				uni.navigateBack({
					delta: 1
				});
			},
			base64(url, type='jpeg') {
				return new Promise((resolve, reject) => {
						if (!!uni.getFileSystemManager()) {
							uni.getFileSystemManager().readFile({
								filePath: url, //选择图片返回的相对路径
								encoding: "base64", //编码格式
								success: (res) => {
										// console.log(res.data, 88989)
										resolve(
												"data:image/" +
														type.toLocaleLowerCase() +
														";base64," +
														res.data
										);
								},
								fail: (res) => reject(res.errMsg),
							});
						} else {
							uni.request({
								url: url,
								method: "GET",
								responseType: "arraybuffer",
								success: (res) => {
									let base64 = wx.arrayBufferToBase64(res.data); //把arraybuffer转成base64
									base64 = "data:image/jpeg;base64," + base64; //不加上这串字符，在页面无法显示的哦
									// console.log(base64)
									resolve(base64);
								},
								fail: (res) => reject(res.errMsg),
							});
						}
				});
			}
		}
	}
</script>

<style lang="scss">
	.grade-info{
		position: relative;
	  height: 320rpx;
	  color: #fff;
		font-size: 28rpx;
		overflow: hidden;
		image{
			position: absolute;
			width: 100%;
			height: 100%;
			z-index: -1;
		}
		&>view{
		  // margin-bottom: 16rpx;
			margin: 30rpx 0;
			padding: 0 20rpx;
		}
		.title{
		  font-size: 35rpx;
			// padding-top: 20rpx;
		  font-weight: 700;
		}
		.val{
		  padding-left: 16rpx;
		}
	}
	.grade{
		padding: 12rpx 20rpx;
		background-color: #fff;
		.grade-field{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 80rpx;;
			border-bottom: 1px solid #E7E7EB;
			.field-label{
				flex: 0 0 360rpx;
			}
			.field-val{
				flex: 0 0 200rpx;
				&.score{
					flex: 0 0 200rpx;
					display: flex;
					justify-content: space-between;
				}
			}
		}
	}
	.grade-img{
		padding: 12rpx 20rpx;
		.text{
			padding-bottom:10rpx;
		}
		.upload-filed{
			display: flex;
			.img-upload{
				// flex:1;
			}
			.img-info{
				margin-left: 8rpx;
				font-size: 22rpx;
				font-weight: 500;
			}
		}
	}
	.grade-footer{
		padding: 12rpx 20rpx;
		.btn-1{
			margin-bottom:20rpx;
		}
	}
	
</style>
