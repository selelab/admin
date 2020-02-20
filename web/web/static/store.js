const store = new Vuex.Store({
    state: {
        count: 0,
        sessionid:"",
    },
    mutations: {
        increment(state) {
            state.count++
        },
        setSessionid(sessionid){
            state.sessionid = sessionid;
        },
        getSessionid(){
          return state.sessionid;
        }
    }
});

export { store };
