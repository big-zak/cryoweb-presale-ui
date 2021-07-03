import { createStore } from 'vuex'

export default createStore({
  state: {
    isWalletConnected: false,
    walletInfo: null
  },
  mutations: {
    setWalletConnectInfo: (state,payload) => {
       state.isWalletConnected = payload.isWalletConnected;
       state.walletInfo = payload.walletInfo;
    },
  },
  actions: {
  },
  modules: {
  }
})
