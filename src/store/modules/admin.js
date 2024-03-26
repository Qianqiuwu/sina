export default {
  namespaced: true,
  action: {},
  mutations: {
    SET_COMPANY_AUTH_INFO(state, data) {
      state.admin = data
      sessionStorage.setItem('admin', JSON.stringify(data))
    },
    SET_token(state, data) {
      state.tokens = data
      localStorage.setItem('tokens', JSON.stringify(data))
    },
    Exit(state) {
      state.admin = {}
      state.tokens = ''
    },
  },
  state: {
    admin: JSON.parse(sessionStorage.getItem('admin')) || {},
    tokens: JSON.parse(localStorage.getItem('tokens')) || {},
  },
  getters: {
    admin(state) {
      return state.admin
    },
    tokens(state) {
      return state.tokens
    },
  },
}
