<script>
	export default {
		//全局变量
		onLaunch: function() {
			console.log('App Launch')
			//是否判断登录
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		onPageNotFound() {
			
		}
	}
</script>

<style lang="scss">
	@import "@/uni_modules/uview-ui/index.scss";
	
	// page{background-color: #f5f5f5;}
</style>
