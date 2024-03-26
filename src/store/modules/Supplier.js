export default {
  namespaced: true,
  action: {},
  mutations: {
    SET_COMPANY_AUTH_INFO(state, data) {
      state.Supplier = data
      sessionStorage.setItem('Supplier', JSON.stringify(data))
    },
    SET_token(state, data) {
      state.tokens = data
      localStorage.setItem('tokens', JSON.stringify(data))
    },
    Exit(state) {
      state.Employees = {}
      state.tokens = ''
    },
  },
  state: {
    Supplier: JSON.parse(sessionStorage.getItem('Supplier')) || {},
    tokens: JSON.parse(localStorage.getItem('tokens')) || {},
  },
  getters: {
    Supplier(state) {
      return state.Supplier
    },
    tokens(state) {
      return state.tokens
    },
  },
}
