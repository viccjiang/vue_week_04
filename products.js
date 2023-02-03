import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import pagination from './pagination.js';
import productmodal from './prodcutModal.js';
import delproductmodal from './delProdcutModal.js'

let productModal = null;
let delProductModal = null;


const app = createApp({
  components: {
    pagination,
    productmodal,
    delproductmodal
  },
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'jiangs2023',
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      pagination: {},
      isNew: false,
    }
  },
  mounted() {
    
    // 1. 初始化 new bootstrap
    // 2. 呼叫方法 .show .hide
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false,
      backdrop: 'static',
    });
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false,
      backdrop: 'static',
    });
    // 取出 cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)jiangvue3\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    // token 加到 headers (axios 請求時，headers 預設帶上 token)
    axios.defaults.headers.common.Authorization = token;
    // 驗證是否登入
    this.checkAdmin();
  },
  methods: {
    checkAdmin() {
      const url = `${this.apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
          // 取得產品列表
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message)
          window.location = 'index.html';
        })
    },
    getData(page = 1) {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;

      axios.get(url)
        .then((response) => {
          // 先把 products pagination資料存起來
          const { products, pagination } = response.data;
          this.products = products;
          this.pagination = pagination;
        }).catch((err) => {
          alert(err.data.message);
          window.location = 'index.html';
        })
    },
    openModal(status, product) {
      if (status === 'new') { // 傳入的變數是新增
        this.tempProduct = { // 帶入初始資料
          imagesUrl: [],
        };
        this.isNew = true; // 新增的
        productModal.show();
      } else if (status === 'edit') { // 傳入的變數是編輯 
        this.tempProduct = { ...product }; // 帶入當前要編輯的資料
        this.isNew = false; // 不是新增的
        productModal.show();
      } else if (status === 'delete') { //傳入的變數是刪除
        this.tempProduct = { ...product }; // 帶入當前要刪除的資料
        delProductModal.show()
      }
    },
    updateProduct() {

      // 新增商品
      let api = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let httpMethod = 'post';

      // 用 isNew 判斷 API 如何運行

      // 當不是新增商品時則切換成編輯商品 API
      if (!this.isNew) {
        api = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        httpMethod = 'put';
      }
      // 帶入請求方法變數 httpMethod
      axios[httpMethod](api, { data: this.tempProduct })
      .then((response) => {
        alert(response.data.message);
        // 重新取得列表
        this.getData()
        // 按下確定更新取值之後關閉 modal
        productModal.hide();
      }).catch((err) => {
        alert(err.data.message);
      });
    },
    delProduct() {
      axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`).then((response) => {
        // 重新取得列表
        this.getData()
        // 按下確定更新取值之後關閉 modal
        delProductModal.hide();
        // this.$emit('update');
      }).catch((err) => {
        alert(err.data.message);
      });
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },
  },
});

// 分頁元件
// app.component('pagination', {
//   template: '#pagination',
//   props: ['pages'],
//   methods: {
//     emitPages(item) {
//       this.$emit('emit-pages', item);
//     },
//   },
// });

// 產品新增/編輯元件
// app.component('productModal', {
//   template: '#productModal',
//   props: ['product', 'isNew'],
//   data() {
//     return {
//       apiUrl: 'https://vue3-course-api.hexschool.io/v2',
//       apiPath: 'jiangs2023',
//     };
//   },
//   mounted() {
//     productModal = new bootstrap.Modal(document.getElementById('productModal'), {
//       keyboard: false,
//       backdrop: 'static'
//     });
//   },
//   methods: {
//     updateProduct() {
//       // 新增商品
//       let api = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
//       let httpMethod = 'post';
//       // 當不是新增商品時則切換成編輯商品 API
//       if (!this.isNew) {
//         api = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.product.id}`;
//         httpMethod = 'put';
//       }

//       axios[httpMethod](api, { data: this.product }).then((response) => {
//         alert(response.data.message);
//         this.hideModal();
//         this.$emit('update');
//       }).catch((err) => {
//         alert(err.response.data.message);
//       });
//     },
//     createImages() {
//       this.product.imagesUrl = [];
//       this.product.imagesUrl.push('');
//     },
//     openModal() {
//       productModal.show();
//     },
//     hideModal() {
//       productModal.hide();
//     },
//   },
// })
// 產品刪除元件
// app.component('delProductModal', {
//   template: '#delProductModal',
//   props: ['item'],
//   data() {
//     return {
//       apiUrl: 'https://vue3-course-api.hexschool.io/v2',
//       apiPath: 'jiangs2023',
//     };
//   },
//   mounted() {
//     delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
//       keyboard: false,
//       backdrop: 'static',
//     });
//   },
//   methods: {
//     delProduct() {
//       axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.item.id}`).then((response) => {
//         this.hideModal();
//         this.$emit('update');
//       }).catch((err) => {
//         alert(err.response.data.message);
//       });
//     },
//     openModal() {
//       delProductModal.show();
//     },
//     hideModal() {
//       delProductModal.hide();
//     },
//   },
// });

app.mount('#app');