const store = new Vuex.Store({
    state: {
        sessionid:"",
    },
    mutations: {
        setSessionid(sessionid){
            state.sessionid = sessionid;
        },
        getSessionid(){
          return state.sessionid;
        }
    }
});

export { store };
