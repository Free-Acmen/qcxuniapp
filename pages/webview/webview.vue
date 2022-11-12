<template>
	<view>
		<web-view :src="href"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				href:''
			}
		},
		onLoad(option) {
			this.href = decodeURIComponent(option.href)
		}
	}
</script>

<style>

</style>
