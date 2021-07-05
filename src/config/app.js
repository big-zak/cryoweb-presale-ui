export default {
    
    appName: "wPokadot",
    
    presaleEndDate: "Sep 30, 2021",

    pricePerAirdropInBNB: 0.002,

    numberOfTokensPerBNB: 90_000_000_000,

    minBuyAmountInBNB: 0.1,

    tokenSymbol: "CFuel",

    tokenDecimal: 18,

    // if referral is not available, use this
    //defaultReferralAddres: "0x0d7395E4fad66a6f56B62b3318185647768eA5F7",
    defaultReferralAddres: "0x361D17BA6e13E5FA19DE449503cd3A49BD5b1b1c",

    // contract address
    contractAddress: "0xd5E653B1bFc4284A217fD12e631b0B0F8C6a910f",

    //supportedChainId: 0x38 // 56 is Binance Smart chain

    // comment this if not on testnet
    supportedChainId: 0x61,//kovan for testing

    publicRPC: "https://data-seed-prebsc-1-s1.binance.org:8545"

}