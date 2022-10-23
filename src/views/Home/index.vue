<template>
  <div class="bg">
		<div class="font">
			<p class="font-top">IM&nbsp;,</p>
			<p>TIM</p>
		</div>
		<van-form @submit="onSubmit" class="from">
      <van-field
        v-model="username"
        name="用户名"
        placeholder="请输入用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
        class="ipt"
      />
      <van-field
        v-model="password"
        type="password"
        name="密码"
        clearable
        placeholder="请输入密码"
        :rules="[{ required: true, message: '请填写密码' }]"
        class="ipt"
      />
      <div style="margin: 16px">
        <van-button type="default" block round style="color:#999;">登录</van-button>

        <van-button
          type="default"
          block
          round
          native-type="submit"
          style="border-color: transparent; background-color: transparent;color:#fff;"
          >注册</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import Vue from "vue";
import { Form, Field, button } from "vant";
Vue.use(Form);
Vue.use(Field);
Vue.use(button);
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    onSubmit(values) {
      console.log("submit", values);
    },
  },
};
</script>

<style >
body {
  margin: 0;
  padding: 0;
}
.bg {
  /* display: flex; */
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  background: url(@/views/Home/images/src=http___c-ssl.duitang.com_uploads_item_202003_10_20200310082307_jpees.jpg&refer=http___c-ssl.duitang.webp)
    100% 100% / cover;
  position: relative;
}
.font {
	position: absolute;
	color: #fff;
	line-height: 20px;
	font-weight: 300;
	font-size: 100px;
	padding-left: 50px;
}
.font-top {
	font-weight: 200;
}
.from {
  width: 100%;
  position: absolute;
  bottom: 23%;
	left: 10%;
	width: 80%;
}
.ipt {
  border-color: transparent;
  background-color: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, .7) ;
  color: red !important;
}
.van-field__control::placeholder {
	color: rgba(255, 255, 255, .7) ;
}
</style>
