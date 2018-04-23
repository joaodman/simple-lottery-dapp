<template>
    <div>
        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <!-- Brand and toggle get grouped for better mobile display -->
                    <button type="button" class="btn btn-toggle btn-block" data-toggle="collapse" data-target="#network-navbar">
                        Toggle Network Details
                    </button>

                <!-- Collect the nav links, forms, and other content for toggling -->
                <div class="collapse navbar-collapse show bg-colored" id="network-navbar" aria-expanded="true">
                    <metamask-component/>
                </div><!-- /.navbar-collapse -->
            </div><!-- /.container-fluid -->
        </nav>

        <div id="content">
            <lottery-component/>
        </div>
    </div>
</template>
<script>
    import MetamaskComponent from '@/components/metamask-component';
    import LotteryComponent from '@/components/lottery-component'
    export default {
        name: 'lottery-dapp',
        data () {
            return {isActive: true}
        },
        beforeCreate () {
            //console.log('registerWeb3 Action dispatched from lottery-dapp.vue');
            this.$store.dispatch('registerWeb3');
        },
        components: {
            'metamask-component': MetamaskComponent,
            'lottery-component': LotteryComponent,
        }
    }
</script>
<style scoped>
    .bg-colored {
        background: #ecf8fb;
    }
    .btn-toggle {
        box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
        background: #ffffff;
    }
</style>