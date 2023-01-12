const {createApp} = Vue;

const app = {
    data() {
        return {
           user:{
                username:'',
                password:'',
           },
        }
    },
    methods: {
        login(){
            axios.post(`${url}admin/signin`,this.user)
                .then(res=>{
                    const { token,expired } =res.data;
                    document.cookie = `myToken=${token}; expires=${new Date(expired)};`;
                    window.location='index.html';
                })
                .catch(err=>{
                    alert(err.response.data.message);
                })
        },
    },
};
createApp(app).mount('#app');
