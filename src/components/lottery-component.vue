<template>
    <div class="lottery">
        <h1 style="color: red">This is a test contract in the Ropsten Test Network. Please do not send Eth to this contract from other networks.</h1>
        <h1>Welcome to the Eth Lottery</h1>
        <h4>The Eth lottery currently runs each {{lotteryDuration}} hours</h4>
        <p>Current round started at {{lotteryStart}}</p>
        <h3>Current Prize: {{poolPrize}} Eth!</h3>
        <div id="countdown">
            <countdown :date="lotteryEnd"></countdown>
        </div>
        <div v-if="lotteryEnded">
            <button class="btn btn-buy col-md-2" @click="endLottery">Check Winner</button>
        </div>
        <img v-if="pendingEnd" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif">

        <hr>

        <h5>The current ticket price is {{ticketPrice}} Eth</h5>
        <div class="form-group col-sm-12">
            <div class="col-sm-12">
                Number of tickets to purchase: <input type="number" v-model="ticketsToPurchase" placeholder="Tickets to Purchase" class="form-group number-input">
            </div>
            <button class="form-control btn btn-buy col-sm-3" @click="buyTickets">
                Buy {{ticketsToPurchase}} Tickets for {{ticketsPrice}} Eth
            </button>
        </div>
        <img v-if="pendingBuy" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif">

        <hr>

        <div id="optionsCarousel" class="carousel slide" data-ride="carousel">
            <ol class="carousel-indicators">
                <li data-target="#optionsCarousel" data-slide-to="0" class="active"></li>
                <li data-target="#optionsCarousel" data-slide-to="1"></li>
                <li data-target="#optionsCarousel" data-slide-to="2"></li>
            </ol>
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <div class="row options">
                        <div class="form-group col-sm-4">
                            <div class="col-sm-12">
                                <h6>If you want to contribute to the winning prize without participating you can donate to the prize pool.
                                    The donations amount go entirely to the prize pool. <br></h6>
                                <h5>Amount of Eth to donate:</h5> <input type="number" v-model="ethToDonate" placeholder="Eth to donate" class="form-group number-input">
                            </div>
                            <button class="form-control btn btn-buy col-sm-8" @click="donate">
                                Donate Eth
                            </button>
                        </div>
                        <div v-if="approvedBalance" class="col-sm-4">
                            <br>
                            <div v-if="approvedBalance > 0">
                                <h5>You have a prize of {{approvedBalance}} Eth that can be withdrawn.<br></h5>
                                <button class="btn btn-info col-sm-8" @click="withdraw">Withdraw now</button>
                            </div>
                            <div v-else>
                                You do not have any unclaimed prize at this moment. Keep playing, and may the luck be on your side!
                            </div>
                        </div>
                        <div v-else class="col-sm-4">
                            <h6>You can check if there is any prize from previous rounds that you did not already cashout.</h6>
                            <button class="form-control btn btn-display col-sm-8" @click="getApprovedBalance">Check my prizes</button>
                        </div>
                        <div class="form-group col-sm-4">
                            <div class="col-sm-12">
                                <h6>If you want to be Internet famous you can set a nickname for your address.
                                    Your name will be displayed in the winners and participatns list instead of your address.</h6>
                            </div>
                            <div v-if="nameChangePrice" class="col-sm-12">
                                <h5>Change your address name for {{nameChangePrice}} Eth.</h5>
                                <input type="text" v-model="addressName" placeholder="Your nickname" class="form-group number-input" maxlength="42">
                                <button class="form-control btn btn-buy col-sm-8" @click="changeAddressName">
                                    Change Address Name
                                </button>
                            </div>
                            <div v-else class="col-sm-4">
                                <h6>You can check if there is any prize from previous rounds that you did not already cashout.</h6>
                                <button class="form-control btn btn-display col-sm-8" @click="getApprovedBalance">Check my prizes</button>
                            </div>
                        </div>
                        <img v-if="pendingWithdraw || pendingDonate || pendingChangeName" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif">
                    </div>
                </div>
                <div class="carousel-item">
                    <div class="row options">
                        <div class="col-sm-4">
                            <button class="form-control btn btn-display col-sm-9" @click="displayAwardedWinners = !displayAwardedWinners">See the list of winners</button>
                        </div>
                        <div class="col-sm-4">
                            <button class="form-control btn btn-display col-sm-9" @click="computeTicketsBought">See the tickets distribution</button>
                        </div>
                        <div class="col-sm-4">
                            <button class="form-control btn btn-display col-sm-9" @click="computePurchaseHistory">Purchase history</button>
                        </div>
                        <div class="col-sm-4">
                            <div v-show="displayAwardedWinners">
                                Winners: <br>
                                <div v-for="winner in awardedWinners" >
                                <span v-if="winner">
                                    <span v-if="winner.name">{{winner.name}}</span>
                                    <span v-else>{{winner.address}}</span>
                                    got {{winner.prize}} Eth!
                                </span>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div v-show="displayTicketsIssued">
                                Tickets: <br>
                                <div v-for="ticket in ticketsIssued" >
                                <span v-if="ticket">
                                    <span v-if="ticket.name">{{ticket.name}}</span>
                                    <span v-else>{{ticket.address}}</span>
                                    bought {{ticket.quantity}} tickets!
                                </span>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div v-show="displayPurchaseHistory">
                                <div v-if="myTickets > 0">
									Tickets: <br>
									<h5>You have {{myTickets}} tickets of the {{totalTickets}} issued, which means your chances of winning are {{chanceToWin}} %</h5>
									<div v-for="ticket in ticketsOwned" >
										<span v-if="ticket">
											You bought {{ticket.quantity}} tickets at block #{{ticket.blockNumber}}!
										</span>
									</div>
								</div>
								<div v-else>
									You do not have any tickets purchased this round yet.
								</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-item">
                    <div class="row options">
                        <div class="col-sm-6 mx-auto">
                            How does it work: <br>
                            The Eth lottery dapp is a decentralized application that runs in the Eth blockchain. <br>
                            This means that every transaction made to this contract address is recorded in the blockchain and cannot be modified. <br>
                            You can check every interaction with the contract in the explorer. <br>
                            To have a chance at winning a prize you have two options: <br>
                            You purchase any number of tickets by clicking the buy button or sending Eth directly to the contract. This will add the price of the tickets purchased to the prize pool, except for a small fee which will be used for development.<br>
                            You are the first person to check the winner. This method uses a little amount of gas to compute the lottery winner, so in order to compensate you for the work, you will get one free ticket. <br>
                            After a winner is announced the lottery will restart and all previous purchased tickets will be discarded. <br>
                            If you want to donate to the pool prize you can do so by using the donate button. The amount of the donation will revert entirely to the prize pool. <br>
                            Thank you for using the Eth Lottery dapp. <br>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Countdown from '@/components/countdown'
    export default {
        name: 'lottery',
        data () {
            return {
                lotteryStart: "Loading...",
                lotteryDuration: "Loading...",
                poolPrize: "Loading...",
                totalPrizeAwarded: "Loading...",
                ticketPrice: 0,
                ownerFee: "Loading...",
                nameChangePrice: null,
                contractOwner: "Loading...",
                ticketHolders: [],
                approvedBalance: null,
                addressName: '',
                addresses: '',

                ticketsToPurchase: 1,
                ethToDonate: 1,
                pendingBuy: false,
                pendingWithdraw: false,
                pendingEnd: false,
                pendingDonate: false,
                pendingChangeName: false,

                ticketsIssued: [],
                ticketsOwned: [],
                awardedWinners: [],
                myTickets: 0,
                totalTickets: 0,
                chanceToWin: 0,
                currentLotteryBlock: 0,
                displayAwardedWinners: false,
                displayTicketsIssued: false,
                displayTicketsOwned: false,
                displayPurchaseHistory: false,
            }
        },
        components: {
            'countdown' : Countdown,
        },
        created : function() {

        },
        computed: {
            ticketsPrice: function () {
                if(this.ticketPrice) {
                    return (this.ticketPrice * this.ticketsToPurchase).toFixed(1);
                }
                return "Loading...";
            },
            lotteryEnd: function () {
                let endDate = new Date(this.lotteryStart);
                endDate.setDate(endDate.getDate() + this.lotteryDuration / 24);
                let d = new Date(endDate);
                return d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString())+" "+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString())+":"+((parseInt(d.getMinutes()/5)*5).toString().length==2?(parseInt(d.getMinutes()/5)*5).toString():"0"+(parseInt(d.getMinutes()/5)*5).toString())+":00";
            },
            lotteryEnded: function () {
                let endDate = new Date(this.lotteryStart);
                endDate.setDate(endDate.getDate() + this.lotteryDuration / 24);
                let now = Date.now();
                return now >= endDate;
            },

        },
        mounted () {
            //console.log('dispatching getContractInstance');
            let self = this;
            this.$store.dispatch('getContractInstance').then(setTimeout( () => {
                self.getLotteryStart();
                self.getLotteryDuration();
                self.getPoolPrize();
                self.getTotalPrizeAwarded();
                self.getTicketPrice();
                self.getOwnerFee();
                self.getNameChangePrice();
                self.getContractOwner();
                self.getOwnAddressName();
                self.watchAllEvents();
            }, 500));
        },
        methods: {
            updateLottery: function () {
                this.getLotteryStart();
                this.getLotteryDuration();
                this.getTotalPrizeAwarded();
            },
            getLotteryStart: function () {
                this.$store.state.contractInstance().lotteryStart((error, result) => {
                    if (error) {
                        console.log(error);
                    } else {
                        this.lotteryStart = (new Date(result*1000)).toUTCString();
                    }
                });
            },
            getLotteryDuration: function () {
                this.$store.state.contractInstance().lotteryDuration((error, result) => {
                    if (error) {
                        console.log(error);
                    } else {
                        this.lotteryDuration = result / 3600;
                    }
                });
            },
            getPoolPrize: function () {
                this.$store.state.contractInstance().poolPrize((error, result) => {
                    if (error) {
                        console.log(error);
                    } else {
                        this.poolPrize = web3.fromWei(parseInt(result, 10), "ether");
                    }
                });
            },
            getTotalPrizeAwarded: function () {
                this.$store.state.contractInstance().totalPrizeAwarded((error, result) => {
                    if (error) {
                        console.log(error);
                    } else {
                        this.totalPrizeAwarded = web3.fromWei(parseInt(result, 10), "ether");
                    }
                });
            },
            getTicketPrice: function () {
                this.$store.state.contractInstance().ticketPrice((error, result) => {
                    if (error) {
                        console.log(error);
                    } else {
                        this.ticketPrice = web3.fromWei(parseInt(result, 10), "ether");
                    }
                });
            },
            getOwnerFee: function () {
                this.$store.state.contractInstance().ownerFee((error, result) => {
                    if (error) {
                        console.log(error);
                    } else {
                        this.ownerFee = result;
                    }
                });
            },
            getNameChangePrice: function () {
                this.$store.state.contractInstance().nameChangePrice((error, result) => {
                    if (error) {
                        console.log(error);
                    } else {
                        this.nameChangePrice = web3.fromWei(parseInt(result, 10), "ether");
                    }
                });
            },
            getContractOwner: function () {
                this.$store.state.contractInstance().owner((error, result) => {
                    if (error) {
                        console.log(error);
                    } else {
                        this.contractOwner = result;
                    }
                });
            },
            getAddressName: function (address) {
                this.$store.state.contractInstance().addressToName(address, (error, result) => {
                    if (error) {
                        console.log(error);
                        return '';
                    } else {
                        return result;
                    }
                });
            },
            getOwnAddressName: function () {
				//console.log(this.$store.state.web3.coinbase);
                this.$store.state.contractInstance().addressToName(this.$store.state.web3.coinbase, (error, result) => {
                    if (error) {
                        console.log(error);
                        return '';
                    } else {
                        this.addressName = result;
                    }
                });
            },
            changeAddressName: function () {
                this.pendingChangeName = true;
                this.$store.state.contractInstance().changeAddressName(this.addressName, {
                    gas: 300000,
                    value: this.$store.state.web3.web3Instance().toWei(this.nameChangePrice, 'ether'),
                    from: this.$store.state.web3.coinbase
                }, (error, result) => {
                    if (error) {
                        console.log(error);
                        this.pendingChangeName = false;
                    } else {
                        this.pendingChangeName = false;
                    }
                });
            },
            getApprovedBalance: function () {
				let self = this;
                this.$store.state.contractInstance().approvedBalance(this.$store.state.web3.coinbase, (error, result) => {
                    if (error) {
                        console.log(error);
                    } else {
                        self.approvedBalance = web3.fromWei(parseInt(result, 10), "ether");
                    }
                });
            },
            buyTickets: function () {
				let self = this;
                this.pendingBuy = true;
                this.$store.state.contractInstance().buyTickets({
                    gas: 300000,
                    value: this.$store.state.web3.web3Instance().toWei(this.ticketPrice * this.ticketsToPurchase, 'ether'),
                    from: this.$store.state.web3.coinbase
                }, (error, result) => {
                    if (error) {
                        console.log(error);
                        self.pendingBuy = false;
                    } else {
                        self.pendingBuy = false;
                    }
                });
            },
            donate: function () {
				let self = this;
                this.pendingDonate = true;
                this.$store.state.contractInstance().donate({
                    gas: 300000,
                    value: this.$store.state.web3.web3Instance().toWei(this.ethToDonate, 'ether'),
                    from: this.$store.state.web3.coinbase
                }, (error, result) => {
                    if (error) {
                        console.log(error);
                        self.pendingDonate = false;
                    } else {
                        self.pendingDonate = false;
                    }
                })
            },
            endLottery: function () {
				let self = this;
                this.pendingEnd = true;
                this.$store.state.contractInstance().generateWinner({
                    gas: 300000,
                    value: 0,
                    from: this.$store.state.web3.coinbase
                }, (error, result) => {
                    if (error) {
                        console.log(error);
                        self.pendingEnd = false;
                    } else {
                        self.updateLottery();
                        self.pendingEnd = false;
                    }
                })
            },
            withdraw: function () {
				let self = this;
                this.pendingWithdraw = true;
                this.$store.state.contractInstance().withdraw({
                    gas: 300000,
                    value: 0,
                    from: this.$store.state.web3.coinbase
                }, (error, result) => {
                    if (error) {
                        console.log(error);
                        self.pendingWithdraw = false;
                    } else {
                        self.getArrpovedBalance();
                        self.pendingWithdraw = false;
                    }
                })
            },
            computeMyTickets: function () {
                let count = 0;
                this.ticketsOwned.forEach( function (ticket) {
                    count += ticket.quantity;
                });
                this.myTickets = count;
            },
            computeTotalTickets: function () {
                let count = 0;
                this.ticketsIssued.forEach( function (ticket) {
                    count += ticket.quantity;
                });
                this.totalTickets = count;
            },
            computeChanceToWin: function () {
                this.chanceToWin = (this.myTickets / this.totalTickets) * 100;
            },
            computePurchaseHistory: function () {
                this.eventMyTicketsBought();
				this.displayPurchaseHistory = !this.displayPurchaseHistory;
				//this.computeMyTickets();
				//this.computeTotalTickets();
				//this.computeChanceToWin();
			},
			computeTicketsBought: function () {
				this.eventTicketsBought();
				this.displayTicketsIssued = !this.displayTicketsIssued;
			},
            watchAllEvents: function () {
                this.eventNewLottery();
                this.eventAwardWinnings();
                this.eventTicketsBought();
                /*let self = this;
                var events = this.$store.state.contractInstance().allEvents({fromBlock: 0, toBlock: 'latest'});
                events.watch(function(error, result){
                    if(error) {
                        console.log(error);
                    } else {
                        console.log(result);
                    }
                });*/
            },
            eventTicketsBought: function () {
                let self = this;
                var event = this.$store.state.contractInstance().TicketsBought({},{fromBlock: (this.currentLotteryBlock+1), toBlock: 'latest'});
                event.watch(function(error, result){
                    if (error) {
                        console.log(error);
                    } else {
						//console.log(result);
                        self.ticketsIssued[result.transactionIndex] = {
                            'address' : result.args._from,
                            'quantity' : parseInt(result.args._quantity, 10),
                            'name' : self.getAddressName(result.args._from),
                        };
                    }

                });
            },
            eventMyTicketsBought: function () {
                let self = this;
                var event = this.$store.state.contractInstance().TicketsBought({}, {fromBlock: (this.currentLotteryBlock+1), toBlock: 'latest'});
                event.watch(function(error, result){
                    if (error) {
                        console.log(error);
                    } else {
                        //filtering events not working, applying manual filter
                        if(result.args._from == self.$store.state.web3.coinbase)
                        {
                            self.ticketsOwned[result.transactionIndex] = {
                                'address' : result.args._from,
                                'quantity' : parseInt(result.args._quantity, 10),
                                'blockNumber' : result.blockNumber
                            };
                            self.computeMyTickets();
                            self.computeTotalTickets();
                            self.computeChanceToWin();
                        }
                    }

                });
            },
            eventAwardWinnings: function () {
                let self = this;
                var event = this.$store.state.contractInstance().AwardWinnings({},{fromBlock: 0, toBlock: 'latest'});
                event.watch(function(error, result){
                    if (error) {
                        console.log(error);
                    } else {
                        self.awardedWinners[result.transactionIndex] = {
                            'address' : result.args._to,
                            'prize' : web3.fromWei(parseInt(result.args._winnings, 10), "ether"),
                            'name' : self.getAddressName(result.args._to)
                        };
                        //console.log(result);
                    }

                });
            },
            eventNewLottery: function () {
                // Or pass a callback to start watching immediately
                let self = this;
                var event = this.$store.state.contractInstance().NewLottery({},{fromBlock: 0, toBlock: 'latest'});
                event.watch(function(error, result){
                    if (error) {
                        console.log(error);
                    } else {
                        if(result.blockNumber > self.currentLotteryBlock) {
                            self.currentLotteryBlock = result.blockNumber;
                        }
                        //console.log(result);
                    }

                });
            },

        }
    }

</script>
<style scoped>
    .lottery {
        margin-top: 50px;
        text-align:center;
    }
    .options {
        height: 350px;
    }
    .number-input {
        text-align: center;
    }
    .btn-buy {
        box-shadow: 0 0 0 0.2rem rgba(40,167,69,.5);
        background-color: #ffffff;
        border-color: #80bdff;
    }
    .btn-display {
        background-color: #ffffff;
        border-color: #17a2b8;
    }
    .btn-display :focus :hover {
        box-shadow: 0 0 0 0.2rem #17a2b8;
    }
    .carousel {
        background: #32373e;
        color: #d0f7ff;
    }
</style>
