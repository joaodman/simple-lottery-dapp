<template>
    <div>
        <div class="countdown" id="countdown">
            <div class="block">
                <p class="digit">{{ days | two_digits }}</p>
                <p class="text">Days</p>
            </div>
            <div class="block">
                <p class="digit">{{ hours | two_digits }}</p>
                <p class="text">Hours</p>
            </div>
            <div class="block">
                <p class="digit">{{ minutes | two_digits }}</p>
                <p class="text">Minutes</p>
            </div>
            <div class="block">
                <p class="digit">{{ seconds | two_digits }}</p>
                <p class="text">Seconds</p>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    Vue.filter('two_digits', (value) => {
        if (value < 0) {
            return '00';
        }
        if (value.toString().length <= 1) {
            return `0${value}`;
        }
        return value;
    });
    export default {
        name: 'countdown',
        mounted() {
            window.setInterval(() => {
                this.now = Math.trunc((new Date()).getTime() / 1000);
            },1000);
        },
        props: {
            date: {
                type: String
            }
        },
        data() {
            return {
                now: Math.trunc((new Date()).getTime() / 1000)
            }
        },
        computed: {
            dateInMilliseconds() {
                return Math.trunc(Date.parse(this.date) / 1000)
            },
            seconds() {
                return (this.dateInMilliseconds - this.now) % 60;
            },
            minutes() {
                return Math.trunc((this.dateInMilliseconds - this.now) / 60) % 60;
            },
            hours() {
                return Math.trunc((this.dateInMilliseconds - this.now) / 60 / 60) % 24;
            },
            days() {
                return Math.trunc((this.dateInMilliseconds - this.now) / 60 / 60 / 24);
            }
        }
    }

</script>

<style scoped>
    #countdown {
        align-items: center;
        bottom: 0;
        display: flex;
        background: #31373e;
        justify-content: center;
        left: 0;
        right: 0;
        top:0;
    }

    .countdown {
        display: flex;
    }

    .block {
        display: flex;
        flex-direction: column;
        margin: 20px;
    }

    .text {
        color: #33a1b8;
        font-size: 15px;
        font-family: 'Roboto Condensed', serif;
        margin-top:10px;
        margin-bottom: 10px;
        text-align: center;
    }

    .digit {
        color: #ecf0f1;
        font-size: 80px;
        font-weight: 100;
        font-family: 'Roboto', serif;
        margin: 10px;
        text-align: center;
    }
</style>
