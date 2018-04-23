import Vue from 'vue'
import Router from 'vue-router'
import LotteryDapp from '@/components/lottery-dapp'
Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '/',
            name: 'lottery-dapp',
            component: LotteryDapp
        }
    ]
})