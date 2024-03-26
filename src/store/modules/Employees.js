export default {
  namespaced: true,
  action: {},
  mutations: {
    SET_COMPANY_AUTH_INFO(state, data) {
      state.Employees = data
      sessionStorage.setItem('Employees', JSON.stringify(data))
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
    Employees: JSON.parse(sessionStorage.getItem('Employees')) || {},
    tokens: JSON.parse(localStorage.getItem('tokens')) || {},
  },
  getters: {
    Employees(state) {
      return state.Employees
    },
    tokens(state) {
      return state.tokens
    },
  },
}
