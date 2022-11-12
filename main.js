import App from './App'
import Vue from 'vue'
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

import utils from '@/utils/index.js'
Vue.prototype.$utils = utils

let mpShare = require('@/utils/mpShare.js');
Vue.mixin(mpShare)

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
