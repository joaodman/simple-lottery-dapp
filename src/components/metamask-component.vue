<template>
    <div class='metamask-info'>
        <p v-if="isInjected" class="has-metamask"><i aria-hidden="true" class="fa fa-check"></i> Metamask/Mist detected.</p>
        <p v-else class="no-metamask"><i aria-hidden="true" class="fa fa-times"></i> Metamask not found. In order to use the dapp consider installing Metamask extension or using Mist browser.</p>
        <p>Network: {{ network }}</p>
        <p v-show="network != 'Ropsten test network'" class="no-metamask">
            You are not currently in the Ropsten Test Network. This dapp is currently being run in the Ropsten Test Network so that you do not have to spend any real value.
            <br> Do not send Eth to this contract if you are in other networks.
        </p>
        <p>Account: {{ coinbase }}</p>
        <p v-if="balance == '0'" class="no-metamask">Your balance is 0. You may not be able to use this dapp.</p>
        <p v-else>Balance: {{ balance }} Eth </p>
    </div>
</template>

<script>
    import {NETWORKS} from '../util/constants/networks'
    import {mapState} from 'vuex'
    export default {
        name: 'metamask-component',
        computed: mapState({
            isInjected: state => state.web3.isInjected,
            network: state => NETWORKS[state.web3.networkId],
            coinbase: state => state.web3.coinbase,
            balance: state => web3.fromWei(state.web3.balance, "ether")
        })
    }
</script>

<style scoped>
    .has-metamask {
        color: green;
    }
    .no-metamask {
        color:red;
    }</style>
