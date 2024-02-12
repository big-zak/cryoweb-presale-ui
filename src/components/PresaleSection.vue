<template>
   <section class="space about about--v1 section--darkblue bg-gradient--darkblue--2" id="about">
        <div class="container">
            <div class="row justify-content-md-center">

               <div class="col-12  my-4">
                    <div class="card p-6 dark-card" v-if="accountBalance != 0">
                         <h3 class="text-center m2 mb-2">Balance</h3>
                            <div class="text-center mb-2">
                                <h4>{{toMoneyValue(accountBalance)}} {{_appConfig.tokenSymbol}} </h4>
                            </div>
                            <div>
                            <div class="d-flex justify-content-center align-items-center">    
                                <button
                                    @click.prevent="withdrawBalance"
                                    class="btn  btn-size--md btn-border btn-border--width--2 btn-border--color--primary color--white rounded--full btn-hover--3d btn-hover--splash"
                                    >
                                        Withdraw Balanace
                                </button>
                            </div>
                        </div>
                    </div>
               </div> 

                <div class="col-12 col-lg-7 col-md-6">
                    <div class="card p-6 dark-card">
                        <div class="card-content p2">
                            <h2 class="text-center m2 mb-4">TOK Token Seed Sale</h2>
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
                            <br><center>1 BNB is the minimum for the seed sale. <br>The seed sale will only be 4 Million TOK Token (50 Million total supply)</center>
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

import { utils as ethersUtils, Contract, providers as ethersProviders, BigNumber } from "ethers";

import contractAbi from "../data/contractAbi.json";

import WalletConnect from "@walletconnect/web3-provider";


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
        noOfTokensPerAmount: 0,
        accountBalance: 0
    }},

    mounted(){

        let _this = this;


        window.addEventListener("connect-wallet", () => {
            _this.connectToWallet();
        })

       
        this.connectToWallet();

        this.calculateFinalTokens();

        this.loadUserBalance();
        
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
            this.loadUserBalance();
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
                 walletconnect: {
                    connect_text: "Sync with WalletConnect",
                    name: "WalletConnect",
                    package: WalletConnect,
                   
                    options: {
                        //infuraId,
                         rpc: {
                            56: "https://bsc-dataseed.binance.org/"
                        },
                        mobileLinks: [ 
                            "rainbow",
                            "metamask",
                            "argent",
                            "trust",
                            "imtoken",
                            "pillar",
                        ],
                    }
                }
            };

            this._walletProvider = new WalletProvider({
                cacheProvider: true,
                providers,
                debug: true
            });

            this.handleWalletProviderEvents();

            await  this._walletProvider.connect();

        },

        async loadUserBalance() {
           
           try{
                if(!this.isConnected){
                    return false;
                }

                let result = await this.contractInstance.balanceOf(this.walletAccount);

                if(result.eq(BigNumber.from(0))){
                    this.accountBalance = 0;
                    return false;
                }

                this.accountBalance = this.toHumanReadable(result).toString();
           } catch(e){
               console.log("loadUserBalance Error ==>",e, e.stack)
           }
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

        async withdrawBalance() {

            try {
                
                if(this.contractInstance == null){
                    this.connectToWallet();
                    return;
                }

                //lets check if presale or event has completed 
                let hasEventEnded = await this.contractInstance.hasEventEnded();

                if(!hasEventEnded){
                    Swal.fire({
                        icon: 'info',
                        title: 'Oops...',
                        text: `You can only withdraw after the event has ended`,
                    })

                    return;
                }   

                Swal.fire({
                    title: 'Processing..',
                    text: 'Kindly wait whiles we process your withdrawal',
                    timerProgressBar: true,
                    didOpen: () => Swal.showLoading(),
                    allowOutsideClick: false,
                    allowEscapeKey: false
                })

                let result = await this.contractInstance.withdrawTokens();

                await result.wait();

                await this.loadUserBalance();

                Swal.close();

                 Swal.fire({
                    icon: 'success',
                    title: 'Hurray !',
                    text: `Tokens withdrawal successful`,
                })

            } catch(e){

                // console.log("withdraw Balance ===>>>>", e, e.stack)
                Swal.close();
                
                let errMsg = e.data.message || e.mssage;

                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Withdrawal Failed to complete (${errMsg})`,
                })
                    
            }
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
                didOpen: () => Swal.showLoading(),
                allowOutsideClick: false,
                allowEscapeKey: false
            })

            try{

                let result = await this.contractInstance.airdrop( this.getVisitorsReferrer(), {value: airdropFeeWei})

                await result.wait();

                await this.loadUserBalance();

                Swal.close();

                 Swal.fire({
                    icon: 'success',
                    title: 'Hurray !',
                    text: `Operation completed successfully`,
                })
            } catch (e){

                Swal.close();

                let errMsg = e.data.message || e.mssage;
                
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Operation Failed to complete (${errMsg})`,
                })
                    	
                console.log("Operation Error", e, e.stack)
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

                //console.log(this.buyAmountInBNB)
                let amountToBuyInBNBWei = ethersUtils.parseEther(this.buyAmountInBNB.toString());

                Swal.fire({
                    title: 'Processing Request',
                    text: 'Confirm from your wallet',
                    timerProgressBar: true,
                    didOpen: () => Swal.showLoading(),
                    allowOutsideClick: false,
                    allowEscapeKey: false
                })

                //console.log(this.getVisitorsReferrer())

                 let result = await this.contractInstance.buyPreSale( this.getVisitorsReferrer(), { value: amountToBuyInBNBWei })

                 await result.wait();

                await this.loadUserBalance();

                Swal.close();

                Swal.fire({ icon: 'success',title: 'Hurray !', text: `Token Buy Successful, You can withdraw the tokens after the event completed` })

            } catch (e){

                Swal.close();
                
                 let errMsg = e.data.message || e.mssage;

                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Operation Failed to complete (${errMsg})`,
                })
                    	
                console.log("Operation Error", e, e.stack)
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