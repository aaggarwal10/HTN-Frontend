const state = () => ({
  loggedIn: false
})

const mutations = {
  setloggedIn (state, flag) {
    state.loggedIn = flag
  }
}

export default {
  state,
  mutations
}
