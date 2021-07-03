<template>
   <section class="space about about--v1 section--darkblue bg-gradient--darkblue--2" id="about">
        <div class="container">
            <div class="row justify-content-md-center">
                <div class="col-12 col-lg-7 col-md-6">
                    <div class="card p-6 dark-card">
                        <div class="card-content p2">
                            <h2 class="text-center m2 mb-4">CryoFuel Presale</h2>
                            <div class="px-2 ei-newslatter-form">
                                
                                <div class="input-group my-4  input-group-lg">
                                    <input type="number" 
                                        v-model="buyAmountInBNB" 
                                        class="form-control"
                                        @keyup="calculateFinalTokens"
                                    >
                                    <div class="input-group-append">
                                        <span class="input-group-text">BNB</span>
                                    </div>
                                </div>

                                <div class="d-flex justify-content-end mb-3 text-sm" v-if="buyAmountInBNB > 0">
                                        {{buyAmountInBNB}} BNB = {{noOfTokensPerAmount.toLocaleString()}} {{_appConfig.tokenSymbol}}       
                                </div>

                                <div>
                                    <button 
                                        class="btn btn btn-size--md btn-block btn-bg--primary rounded--full btn-hover--3d btn-hover--splash"
                                        @click.prevent="processBuyToken"
                                    >
                                        Buy
                                    </button>
                                </div>

                            </div>

                            <div class="pt-4 d-flex justify-content-center">
                                <h5 class="center-text text-sm">1 BNB = {{_appConfig.numberOfTokensPerBNB.toLocaleString()}} {{_appConfig.tokenSymbol}}</h5>
                            </div> 
                        </div>
                    </div>
                </div>

                <div class="col-12 col-lg-5 col-md-6">
                    <div class="card p-4 dark-card">
                        <div class="card-content">
                            <div class="text-center my-2">
                                <h2>Refer & Get</h2>
                                <h5>5% BNB + 10% {{_appConfig.tokenSymbol}}</h5>
                            </div>
                            <div class="ei-newslatter-form">
                                    <div class="form-group">
                                    <label for="referral_code">Get Your Airdrop Referral Link</label>
                                    <input 
                                        type="text" id="referral_code" 
                                        style="font-size:16px !important;"  
                                        v-model="affLinkAddress" 
                                        class="form-control form-control-lg  ref-form mb-2"
                                    >
                                </div>

                                <div>
                                    <button
                                        @click.prevent="copyAffLink"
                                        class="btn btn-block btn-size--md btn-border btn-border--width--2 btn-border--color--primary color--white rounded--full btn-hover--3d btn-hover--splash d-none d-sm-inline-block"
                                     >
                                        Copy Link
                                    </button>
                                </div>
                            </div>
                            <div style="height: 110px;"></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
</template>

<script>

import Swal from 'sweetalert2/dist/sweetalert2.js'

import 'sweetalert2/src/sweetalert2.scss'

import appConfig from "../config/app"

import WalletProvider from "@libertypie/wallet-provider"

import { utils as ethersUtils, Contract, providers as ethersProviders } from "ethers";

import contractAbi from "../data/contractAbi.json";

export default {
    
    data(){return {
        _appConfig: appConfig,
        showAll: false,
        buyAmountInBNB: appConfig.minBuyAmountInBNB,
        _walletProvider: null,
        isConnected: false,
        walletAccount: null,
        web3Provider: null,
        web3: null,
        contractInstance: null,
        affLinkAddress: "",
        affLink: this.getCurHost(),
        noOfTokensPerAmount: 0
    }},

    mounted(){

        let _this = this;


        window.addEventListener("connect-wallet", () => {
            _this.connectToWallet();
        })

       
        this.connectToWallet();

        this.calculateFinalTokens();

    },

    watch: {

        affLinkAddress(){
            //lets get address
            if(this.affLinkAddress == "" || !ethersUtils.isAddress(this.affLinkAddress)) return;

            //let addressB64 =  window.btoa(this.affLinkAddress);

            this.affLink = `${this.getCurHost()}/${this.affLinkAddress}`
        },

        isConnected() {
            this.updateState();
        },

        walletAccount() {
            this.affLinkAddress = this.walletAccount;
             this.updateState();
        }
    },



    methods: {

        calculateFinalTokens() {
            this.noOfTokensPerAmount = this.buyAmountInBNB * appConfig.numberOfTokensPerBNB;
        },

        getVisitorsReferrer(){

            let refAddress = this.$route.params.affId || "";

            if(refAddress.length > 0 && ethersUtils.isAddress(refAddress)){
                return refAddress;
            }

            return appConfig.defaultReferralAddres;
        },

        getCurHost(){
            let port = window.location.port;
            let url = `${window.location.hostname}`;

            if(port.toString() != "" && ![80,443].includes(port)){
                url = `${url}:${port}`;
            }

            return url;
        },

        copyAffLink() {
            
            if(!this.isConnected){
                this.connectToWallet();
                return false;
            }

            if(this.affLink == ""){
                this.affLink = this.getCurHost();
            }

            navigator.clipboard.writeText(this.affLink);

            Swal.fire(
                '',
                'Affiliate link copied to clipboard',
                'success'
            )
        },
        
        updateState(){
            
            this.$store.commit("setWalletConnectInfo",{
                isWalletConnected: this.isConnected,
                walletInfo: this.walletAccount
            });
        },

        async connectToWallet(){

              let providers = {
                "web3_wallets": {
                    connect_text: "Connect with Metamask or TrustWallet"
                },
                "binance_chain_wallet": {
                    connect_text: "Connect with  Binance Chain Wallet"
                },
            };

            this._walletProvider = new WalletProvider({
                cacheProvider: true,
                providers,
                debug: true
            });

            this.handleWalletProviderEvents();

            await  this._walletProvider.connect();

        },

        handleWalletProviderEvents() {

            this._walletProvider.on("connect",({provider,chainId,account})=>{
                
                if(!this.isSupportedChain(chainId)){
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Unsupported Chain, Kindly Switch to Binance Smart Chain',
                     })

                    this.isConnected = false;
                    this.web3Provider = null;
                    this.walletAccount = null;

                    return false;
                } //end if

                this.web3Provider = provider;
                
                this.isConnected = true;

                this.walletAccount = account;

                let signer = (new ethersProviders.Web3Provider(provider)).getSigner();

                //lets initialize contract
                this.contractInstance = new Contract( appConfig.contractAddress , contractAbi , signer );

            });  

            this._walletProvider.on("accountsChanged",(accountsArray)=>{
                this.walletAccount = accountsArray[0];
            })

            //wallet's current chain is changed
            //@param Array<string> accounts
            this._walletProvider.on("chainChanged",(chainId)=>{
                if(!this.isSupportedChain(chainId)){
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Unsupported Chain, Kindly Switch to Binance Smart Chain',
                     })
                    
                    this.isConnected = false;
                    this.walletAccount = null;

                    return false;
                }

                this._walletProvider.connect();
            })

            //wallet or web3 disconnected
            this._walletProvider.on("disconnect",(error)=>{
                window.location.reload();
            })  
        },

        isSupportedChain(chainId){
            return (chainId == appConfig.supportedChainId);
        },

        async processAirdrop(){

            if(this.contractInstance == null){
                this.connectToWallet();
                return;
            }

            let airdropFee = (appConfig.pricePerAirdropInBNB || 0).toString()

            let airdropFeeWei = ethersUtils.parseEther(airdropFee);

            Swal.fire({
                title: 'Processing Airdrop',
                text: 'Confirm from your wallet',
                timerProgressBar: true,
                didOpen: () => Swal.showLoading()
            })

            try{

                let result = await this.contractInstance.airdrop( this.getVisitorsReferrer(), {value: airdropFeeWei})

                Swal.close();

                 Swal.fire({
                    icon: 'success',
                    title: 'Hurray !',
                    text: `Airdrop completed successfully`,
                })
            } catch (e){

                Swal.close();
                
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Airdrop Failed to complete (${e.message})`,
                })
                    	
                console.log("Airdrop Error", e, e.stack)
            }
        }, //end airdrop
    
        async processBuyToken() {


            if(this.contractInstance == null){
                this.connectToWallet();
                return;
            }

            if(this.buyAmountInBNB < appConfig.minBuyAmountInBNB){
                Swal.fire({icon: 'error', text: `Amount cannot be less than ${appConfig.minBuyAmountInBNB} BNB`})
                return;
            }

            try {

                console.log(this.buyAmountInBNB)
                let amountToBuyInBNBWei = ethersUtils.parseEther(this.buyAmountInBNB.toString());

                Swal.fire({
                    title: 'Processing Request',
                    text: 'Confirm from your wallet',
                    timerProgressBar: true,
                    didOpen: () => Swal.showLoading()
                })

                console.log(this.getVisitorsReferrer())

                 let result = await this.contractInstance.buyPreSale( this.getVisitorsReferrer(), { value: amountToBuyInBNBWei })

                Swal.close();

                Swal.fire({ icon: 'success',title: 'Hurray !', text: `Token Buy Successful` })

            } catch (e){

                Swal.close();
                
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Airdrop Failed to complete (${e.message})`,
                })
                    	
                console.log("Airdrop Error", e, e.stack)
            }
        } //end 
    }
}


</script>


<style lang="scss">

:focus {outline:none !important; }

.dark-card {
    background:#080e5e;
    *{
        color: #fff !important;
        color: rgba(255,255,255, 0.8) !important;
    }

    input{ 
       
        border: none !important;
        height: 60px; 
        background:#0c0f34;
        position: relative; 
        top: 8px;
        outline: none;
        border-radius: 30px;
        &:focus{  
            outline-style: none;
            box-shadow: none;
            border-color: transparent; 
             background:#0c0f34;
        }
    }

   .input-group {
       height: 60px;
        background:#0c0f34 !important;
        border: none !important;
        div, span { background:#0c0f34 !important; border: none !important;}
        border-radius: 30px;
        overflow: hidden;
        input{ border-radius: none !important; }
    }

    .text-sm {font-size: 14px;}
}
</style>