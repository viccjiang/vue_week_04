import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const baseUrl = 'https://vue3-course-api.hexschool.io'

const app = createApp({
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    login() {
      const api = `${baseUrl}/admin/signin`;
      axios.post(api, this.user).then((response) => {
        // 取出 token, expired
        const { token, expired } = response.data;
        // 寫入 cookie token
        // expires 設置有效時間 (到期日)
        document.cookie = `jiangvue3=${token}; expires=${new Date(expired)};`;
        // 轉址
        window.location = 'products.html';
      }).catch((err) => {
        alert(err.data.message);
      });
    },
  },
})

app.mount('#app');