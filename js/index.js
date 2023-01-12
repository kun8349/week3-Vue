const {createApp} = Vue;

let productModal = null;
let delProductModal = null;

const app = {
    data() {
        return {
           productList:{},
           tempProduct:{
            imagesUrl:[],
           },
           isNew:true,
        }
    },
    methods: {
        //確認登入資訊
        check(){
            axios.post(`${url}api/user/check`)
                .then(res=>{
                    this.getProducts();
                })
                .catch(err=>{
                    alert(err.response.data.message);
                })
        },
        //取得產品資訊
        getProducts(){
            axios.get(`${url}api/${path}/admin/products`)
                .then(res=>{
                    this.productList = {...res.data.products};
                })
                .catch(err=>{
                    alert(err.response.data.message);
                })
        },
        //用v-on綁在model btn上,判斷isNew為true執行post新增產品api,false執行put編輯產品api
        updateProduct(){
            if(this.isNew === true){
                axios.post(`${url}api/${path}/admin/product`,{data:this.tempProduct})
                    .then(res=>{
                        alert(res.data.message);
                        this.getProducts();
                        productModal.hide();
                    })
                    .catch(err=>{
                        alert(err.response.data.message);
                    })
            }else if(this.isNew === false){
                const id = this.tempProduct.id;
                axios.put(`${url}api/${path}/admin/product/${id}`,{data:this.tempProduct})
                    .then(res=>{
                        alert(res.data.message);
                        this.getProducts();
                        productModal.hide();
                    })
                    .catch(err=>{
                        alert(err.response.data.message);
                    })
            }
           
        },
        //刪除api
        removeProduct(){
            const id = this.tempProduct.id;
            axios.delete(`${url}api/${path}/admin/product/${id}`)
                .then(res=>{
                    alert(res.data.message);
                    this.getProducts();
                    delProductModal.hide();
                })
                .catch(err=>{
                    alert(err.response.data.message);
                })
        },
        //判斷開啟的model為新增 編輯 刪除,並將資料傳至tempProduct裡
        openModel(isNew,item){
            if(isNew === 'new'){
                this.tempProduct = {
                    imagesUrl:[],
                };
                this.isNew = true;
                productModal.show();
            }else if(isNew === 'edit'){
                this.tempProduct = {...item};
                this.isNew = false;
                productModal.show();
            }else if(isNew === 'del'){
                this.tempProduct = {...item};
                this.isNew = false;
                delProductModal.show();
            }
        },
        createImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        },
    },
    mounted() {
        //bootstrap 語法 不是很懂,大致上看的出來,把他丟到對應的id上可控制modal的開關,要先新增變數let productModal = null;
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
          });
      
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false
          });
        //驗證cookie
        const token = 
        document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;
        this.check();
    },
};
createApp(app).mount('#app');
