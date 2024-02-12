<template>
    <header class="navbar navbar-sticky sticky-bg-color--darkblue navbar-expand-lg navbar-dark">
        <div class="container-fluid position-relative">
            <a class="navbar-brand" href="#">
                <img class="navbar-brand__regular" style="width:200px;" src="logo.png" alt="brand-logo">
                <img class="navbar-brand__sticky" style="width:200px;" src="logo.png" alt="sticky brand-logo">
            </a>
            <!--  End of brand logo -->
            <button class="navbar-toggler d-lg-none" type="button" data-toggle="navbarToggler" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <!-- end of Nav toggler -->

            <div class="navbar-inner ml-lg-auto">
                <!--  Nav close button inside off-canvas/ mobile menu -->
                <button class="navbar-toggler d-lg-none" type="button" data-toggle="navbarToggler" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <!-- end of Nav Toggoler -->
                <nav>
                    <ul class="navbar-nav" id="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="#presale">Buy Tok Seed Sale</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#features">Features</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#team">Team</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#faq">FAQ</a>
                        </li>
                    </ul>
                    <!-- end of nav menu items -->
                </nav>
            </div>
            <div class="d-flex flex-column flex-sm-row align-items-center d-sm-inline-block ml-lg-1 ml-xl-2 mr-5 mr-sm-6 m-lg-0">
                <a href="#" 
                    class="btn btn-size--md btn-bg--primary rounded--full btn-hover--3d btn-hover--splash"
                    @click.prevent="connectToWallet" v-show="!isWalletConnected"
                >
                    <span class="btn__text d-flex align-items-center">
                        Connect Wallet
                    </span>
                </a>
                <a href="#" 
                    @click.prevent v-show="isWalletConnected"
                    class="btn btn-size--md btn-bg--primary rounded--full btn-hover--3d btn-hover--splash"
                >
                    <span class="btn__text d-flex align-items-center">
                        {{addressShort}}
                    </span>
                </a>
            </div>
            <!-- end of nav cta button -->
        </div>
        <!-- end of container -->
    </header>
    <!-- =========== End of Navigation (main menu)  ============ -->
</template>

<script>

import {mapState} from "vuex"

export default {

    data(){return{
        addressShort: ""
    }},

    watch: {
        isWalletConnected(){
            this.getShortenedAddr();
        }
    },

    computed: {
        ...mapState([
            "isWalletConnected",
            "walletInfo"
        ])
    },

  methods: {
      connectToWallet(){
          window.dispatchEvent(new CustomEvent('connect-wallet'));
      },

       getShortenedAddr(){

            if(!this.isWalletConnected) return "";

            let addr = this.walletInfo;

            this.addressShort = `${addr.substr(0,4)}..${addr.substr(-4)}`

            return this.addressShort;
        },

  } 
}
</script>

