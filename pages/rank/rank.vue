<template>
	<view class="rank-page">
		<view class="grade-info">
			<image src="/static/images/topbg.png"></image>
			<view class="title">
				<text>报考信息</text>  
			</view>  
			<view>
				<text>姓名:</text>
				<text class="val">{{userInfo.RealName}}</text>
			</view>
			<view>
				<text>报考院校:</text>
				<text  class="val">{{userInfo.p2name}}</text>
			</view>
			<view>
				<text>报考院系:</text>
				<text class="val">{{userInfo.p3name}}</text>
			</view>
			<view>
				<text>总分:</text>
				<text class="val">
					{{userInfo.TotalGrade/100}}
					<text style="color: #E6A23C; margin-left:5px;" v-if="userInfo.Status == '待核实'">未核实</text>
					<text style="color: #F56C6C; margin-left:5px;" v-if="userInfo.Status == '垃圾箱'">审核未通过</text>
				</text>
			</view>
		</view>
		
		<view class="section">
			<view class="tips">
				<text style="margin-right:6rpx;" >温馨提示: 参与排名人数越多排名越准哦~</text>
				<view class="share">
					<view class="shareBtn">
						<u-button open-type="share"></u-button>
					</view>
					<u--image src="/static/images/share.png" width="32rpx" height="32rpx"></u--image>
				</view>
			</view>
			
			<view class="rank-info">
				<u-row gutter="8">
					<u-col span="4">
						<view class="rank-type school">
							<view class="img">
								<u--image src="/static/images/school.png" width="100%" height="240rpx"></u--image>
							</view>
							<view class="rank-val">{{userInfo.Total2||'--'}}</view>
							<view class="rank-text">校内统计人数</view>
						</view>
					</u-col>
					<u-col span="4">
						<view class="rank-type compound">
							<view class="img">
								<u--image src="/static/images/compound.png" width="100%" height="240rpx"></u--image>
							</view>
							<view class="rank-val">{{userInfo.Total3||'--'}}</view>
							<view class="rank-text">院内统计人数</view>
						</view>
					</u-col>
					<u-col span="4">
							<view class="rank-type major">
								<view class="img">
									<u--image src="/static/images/major.png" width="100%" height="240rpx"></u--image>
								</view>
								<view class="rank-val">{{userInfo.Total4||'--'}}</view>
								<view class="rank-text">专业统计人数</view>
							</view>
					</u-col>
				</u-row>
			</view>
			
			<view class="remark">注: 此报告生成时间为 {{userInfo.RankTime}}</view>
		
			<view>
				<!-- ，科目分数可进下面复试群了解 -->
				<view style="font-size: 26rpx;color:#7677EA;margin-bottom: 10rpx;">以下为专业总分排名</view>
				<!-- <view style="margin-bottom: 12rpx;">
					<u-row>
						<u-col span="2">排名</u-col>
						<u-col span="3">姓名</u-col>
						<u-col span="4">总分</u-col>
						<u-col span="3">状态</u-col>
					</u-row>  
				</view>
				<view :class="{'list-active':item.RealName==userInfo.RealName}" style="margin-bottom: 16rpx;" v-for="(item, index) in list" :key="item" >
					<u-row>
						<u-col span="2">{{index + 1}}</u-col>
						<u-col span="3">{{item.RealName}}</u-col>
						<u-col span="4">{{item.TotalGrade}} </u-col>
						<u-col span="3" style="color:#409EFF;">{{item.Status}}</u-col>
					</u-row>
				</view> -->
				<view class="table">
					<view class="tr">
						<view class="th">排名</view>
						<view class="th">姓名</view>
						<view class="th">总分</view>
						<view class="th">状态</view>
					</view>
					<view class="tr" :class="{'list-active':item.RealName==userInfo.RealName}" v-for="(item, index) in list" :key="index" >
						<view class="td">{{index + 1}}</view>
						<view class="td">{{item.RealName}}</view>
						<view class="td">{{item.TotalGrade}}</view>
						<view class="td" :class="{'ok':item.Status=='已核实', 'no':item.Status=='待核实'}">{{item.Status}}</view>
					</view>
				</view>
			</view>
			
			

			
			<view v-if="content" class="diy-content">
				<u-divider textColor="#FEBB29" lineColor="#FEBB29" text="专业相关信息"></u-divider>
				<view class="rich-content">
					<u-parse :content="content" @linkTap="richLink"></u-parse>
					<!-- <rich-text :nodes="content" space="ensp" catchtap="catchImage"></rich-text> -->
				</view>
			</view>
		</view>
			
		<view class="footer">
			<view class="btn btn-group">
				<view class="item">
					<u-button shape="circle" @click="reset" type="primary">重新查询</u-button>
				</view>
				<view class="item">
					<u-button shape="circle" @click="updateHandle" type="primary">刷新排名</u-button>
				</view>
			</view>
			<view class="btn">
				<u-button open-type="contact" shape="circle">对排名有异议?</u-button>
			</view>
		</view>
		
		<u-modal :show="existShow" title="温馨提示" content='您好，您之前录入的数据已经通过审核，不能再次更新，如需要更新数据请联系群里的管理员协助处理，谢谢。'  @confirm="existShow=false"></u-modal>
		
		<u-modal :show="modelShow" title="提示" content='请确认一下, 你确定需要重新查询吗？' :showCancelButton="true" @confirm="resetHandle" @cancel="modelShow=false"></u-modal>
	</view>
</template>

<script>
	// let codeObj={
	//   '1-10032':{name:'北语',code1:'@/static/images/1-10032/销售码.jpg', code2:'@/static/images/1-10032/复试群.jpg'},
	//   '1-10036':{name:'贸大',code1:'@/static/images/1-10036/销售码.jpg', code2:'@/static/images/1-10036/复试群.jpg'},
	//   '1-10038':{name:'首经贸',code1:'@/static/images/1-10038/销售码.jpg', code2:'@/static/images/1-10038/复试群.jpg'},
	//   '1-10052':{name:'民大',code1:'@/static/images/1-10052/销售码.jpg', code2:'@/static/images/1-10052/复试群.jpg'},
	//   '2-10068':{name:'天外',code1:'@/static/images/2-10068/销售码.jpg', code2:'@/static/images/2-10068/复试群.jpg'},
	//   '2-10070':{name:'天财',code1:'@/static/images/2-10070/销售码.jpg', code2:'@/static/images/2-10070/复试群.jpg'},
	//   '15-10423':{name:'海大',code1:'@/static/images/15-10423/销售码.png', code2:'@/static/images/15-10423/复试群.jpg'},
	//   '15-10422':{name:'山大',code1:'@/static/images/15-10422/销售码.png', code2:'@/static/images/15-10422/复试群.jpg'},
	//   '15-11065':{name:'青大',code1:'@/static/images/15-11065/销售码.jpg', code2:'@/static/images/15-11065/复试群.jpg'},
	//   '19-10574':{name:'华师',code1:'@/static/images/19-10574/销售码.jpg', code2:'@/static/images/19-10574/复试群.jpg'},
	//   '25-10673':{name:'云大',code1:'@/static/images/25-10673/销售码.png', code2:'@/static/images/25-10673/复试群.jpg'},
	//   'other':{name:'其他',code1:'@/static/images/other/销售码.jpg', code2:'./static/images/other/复试群.jpg'}
	// }
	
	export default {
		data() {
			return {
				uinfo:null,
				existShow:false,
				modelShow: false,
				userInfo: {},
				list: [],
				content:'',
				// code1:'',
				// code2:'',
				// imgarr:[]
			}
		},
		onLoad() {
			this.uinfo = uni.getStorageSync('uinfo');
			console.log(this.uinfo)
			if(!this.uinfo){
				uni.navigateTo({
					url:'/pages/index/index'
				})
				return false
			}
			let telPhone = this.uinfo
			if(typeof this.uinfo=='string'){
				this.uinfo={
					exist: false,
					tel: telPhone
				}
			}
			if(this.uinfo.exist){
				this.existShow = true
			}
			
			this.initData()
		},
		onShow() {
			wx.hideHomeButton();
		},
		methods: {
			initData: function(){
				let tel = JSON.stringify(this.uinfo.tel)
				this.$utils.post('getRank', tel).then(res=>{
					this.userInfo = res.data.data
					// let schoolCode=this.userInfo.p2id
					// if(codeObj[schoolCode]){
					// 	this.code1=codeObj[schoolCode].code1
					// 	this.code2=codeObj[schoolCode].code2
					// }else{
					// 	this.code1=codeObj['other'].code1
					// 	this.code2=codeObj['other'].code2
					// }
					this.getContent();
					this.getList()
					uni.setStorageSync('rank', res.data.data);
				})
			}, 
			getList() {
				let tel = JSON.stringify(this.uinfo.tel)
				this.$utils.post('getRankList', tel).then(res => {
					this.list = res.data.data || []
					// this.list = [{RealName:'李测试',  TotalGrade:'362', Status:'已通过审核'}]
				})
			},
			richLink(obj){
				console.log(obj)
				let href = obj.href
				uni.navigateTo({
					url:'/pages/webview/webview?href='+encodeURIComponent(href)
				})
			},
			getContent: function(){
				var data={
					p1id: this.userInfo.p1id,
					p2id: this.userInfo.p2id,
					p3id: this.userInfo.p3id,
					p4id: this.userInfo.p4id
				}
				this.$utils.post('getContent', data).then(res=>{
					if(res.data.data){
						this.content= this.formatRichText(res.data.data.Content)  
					}
				})
			},
			formatRichText(html) {
				let newContent = html.replace(/<img[^>]*>/gi, function(match,capture) {
					match = match.replace(/style="[^"]+"/gi, "").replace(/style='[^']+'/gi, "");
					match = match.replace(/width="[^"]+"/gi, "").replace(/width='[^']+'/gi, "");
					match = match.replace(/height="[^"]+"/gi, "").replace(/height='[^']+'/gi, "");
					return match;
				});
				newContent = newContent.replace(/style="[^"]+"/gi, function(
						match,
						capture
				) {
						match = match
								.replace(/width:[^;]+;/gi, "max-width:100%;")
								.replace(/width:[^;]+;/gi, "max-width:100%;");
						return match;
				});
				newContent = newContent.replace(/<br[^>]*\/>/gi, "");
				newContent = newContent.replace(
						/\<img/gi,
						'<img style="max-width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"'
				);
				return newContent;
			},
			updateHandle: function () {
				this.initData()
			},
			reset: function(){
				this.modelShow=true
			},
			resetHandle(){
				uni.navigateTo({
					url:'/pages/index/index'
				})
			}
		}
	}
</script>

<style lang="scss">
	.rank-page{
		padding-bottom: 186rpx;
		.grade-info{
			font-size: 28rpx;
			overflow: hidden;
			position: relative;
		  height: 320rpx;
		  color: #fff;
			// padding-top: 16rpx;
			image{
				position: absolute;
				width: 100%;
				height: 100%;
				z-index: -1;
			}
			&>view{
			  margin: 20rpx 0;
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
		
		.section{
		  padding: 6rpx 16rpx;
		  font-size: 26rpx;
			.tips{
				display: flex;
				align-items: center;
			  background: #F7F3FF;
			  color: #416DEF;
			  height: 70rpx;
			  line-height: 70rpx;
			  padding: 0 30rpx;
			  border-radius: 26rpx;
			  border-top-left-radius: 0;
			  margin-bottom: 20rpx;
				.share {
					position: relative;
					margin-left: 10rpx;
					.shareBtn{
						width: 100%;
						height: 100%;
						position: absolute;
						top: 0;
						left: 0;
						opacity: 0;
						z-index: 10;
					}
				}
			}
			
			.rank-type{
			  height: 240rpx;
			  border-radius: 6rpx;
			  color: #7677EA;
			  text-align: center;
				position: relative;
				&.compound{
				  color: #3EC8B7;
				}
				&.major{
				  color: #FEBB29;
				}
				.img{
					position: absolute;
					z-index: -1;
					width: 100%;
					height: 100%;
				}
				
				.rank-val{
				  font-size: 70rpx;
				  margin-bottom: 16rpx;
				  padding-top: 32rpx;
				  font-weight: 700;
				}
				.rank-text{
				  font-size: 30rpx;
				  font-weight: 700;
				}
				.rank-total{
				  font-size: 22rpx;
				}
			}
			
			.remark{
			  color: #A5A6BD;
			  font-size: 26rpx;
			  padding: 20rpx 0;
			}
			
			.diy-content{
				line-height: 40rpx;
				img{width:100%}
			} 
		}
		
		.table {
			width: 100%;
			border-radius: 8rpx;
			display: table;
			border: 1px solid #DFE2E5;
			border-collapse: collapse;
			.th {
				text-align: center;
				padding: 10rpx 0;
				font-weight: bolder;
				display: table-cell;
				background: #F7F7F7;
				border: 1px solid #DFE2E5
			}
			.td {
				text-align: center;
				background: #FFFFFF;
				padding: 10rpx 0;
				display: table-cell;
				border: 1px solid #DFE2E5;
				
				&.ok{
					color: #3EC8B7;
				}
				&.no{
					color: #FEBB29;
				}
			}
			.tr {
				display: table-row;
				&.list-active{
					.td{
						background: #EAEBFB;
					}
				}
			}
		}
		 
			
		.footer{
			background-color: #fff;
			padding: 10rpx 16rpx;
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			.btn-group{
			  display: flex;
				margin-bottom: 16rpx;
				.item{
				  width: 50%;
					margin: 0 8rpx;
				}
			}
		}
		
	}
</style>
