<template>
  <div class="login">
    <img class="logo" src="@/assets/img/logo.png" alt="" />
    <img
      class="bottom-right-color"
      src="@/assets/img/bottom-right-color.png"
      alt=""
    />
    <img class="top-left-color" src="@/assets/img/top-left-color.png" alt="" />

    <van-form @submit="onSubmit" class="form-submit">
      <!-- 密码登录 -->
      <van-cell-group inset v-if="form.loginType === 0">
        <van-field
          v-model="form.principal"
          name="pattern"
          type="digit"
          label=""
          placeholder="请输入手机号"
          maxlength="11"
          :rules="[
            { required: true, message: '请填写手机号' },
            {
              required: true,
              pattern:
                /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
              message: '请填写正确手机号',
            },
          ]"
        />
        <van-field
          v-if="!open"
          v-model="form.credentials"
          type="password"
          name="credentials"
          label=""
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        >
          <template #button>
            <van-icon
              class="field-icon"
              @click="() => (open = true)"
              name="closed-eye"
            />
          </template>
        </van-field>
        <van-field
          v-else
          v-model="form.credentials"
          name="credentials"
          label=""
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        >
          <template #button>
            <van-icon
              class="field-icon"
              @click="() => (open = false)"
              name="eye-o"
            />
          </template>
        </van-field>
        <van-field style="display: none"></van-field>
      </van-cell-group>
      <!-- 验证码登录 -->
      <van-cell-group inset v-if="form.loginType === 1">
        <van-field
          v-model="form.principal"
          name="pattern"
          type="digit"
          maxlength="11"
          label=""
          placeholder="请输入手机号"
          :rules="[
            { required: true, message: '请填写手机号' },
            {
              required: true,
              pattern:
                /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
              message: '请填写正确手机号',
            },
          ]"
        />
        <van-field
          v-model="form.credentials"
          name="credentials"
          label=""
          placeholder="请输入验证码"
          :rules="[{ required: true, message: '请填写验证码' }]"
        >
          <template #button>
            <span v-if="!isSendTime" class="sendCode" @click="sendCode"
              >发送验证码</span
            >
            <span v-else class="sendCode" style="color: #cccccc"
              >{{ current.seconds }}秒后重新发送</span
            >
          </template>
        </van-field>

        <van-field style="display: none"></van-field>
      </van-cell-group>

      <van-button
        class="submit-btn"
        color="linear-gradient(315deg, #D94726 0%, #E48056 100%)"
        round
        block
        type="success"
        native-type="submit"
        >登录</van-button
      >

      <div
        @click="handleChangeType"
        v-if="form.loginType === 0"
        class="login-type"
      >
        验证码登录 <van-icon name="arrow" />
      </div>
      <div
        @click="handleChangeType"
        v-if="form.loginType === 1"
        class="login-type"
      >
        账号密码登录 <van-icon name="arrow" />
      </div>
      <div v-if="showBtn" class="bottom-tip">
        <van-checkbox v-model="checked" checked-color="#D94726"></van-checkbox>
        <span>勾选表示同意</span>
        <span class="link" @click="handleTip('1')">《服务条款》</span>
        <!-- <span class="link" @click="handleTip('2')">《法律声明》</span> -->
        <span class="link" @click="handleTip('3')">《隐私条款》</span>
      </div>
    </van-form>
  </div>
</template>
<script lang="ts" setup>
// import { Login, sendLoginCode } from "@/http/api/login";
import { useCountDown } from "@vant/use";
import {
CellGroup as vanCellGroup,
Checkbox as vanCheckbox,
Dialog,
Field as vanField,
Form as vanForm,
Icon as vanIcon,
Toast
} from "vant";

import "vant/es/toast/style";
import { onMounted, reactive, ref } from "vue";

const open = ref(false);
const isSendTime = ref(false);
const checked = ref(false);
const clientHeight = ref(document.documentElement.clientHeight);
const showBtn = ref(true);

onMounted(() => {
  window.onresize = () => {
    if (clientHeight.value > document.documentElement.clientHeight) {
      showBtn.value = false;
    } else {
      showBtn.value = true;
    }
  };
});

const geturlparam = () => {
  // window.location.href 获取地址
  const url = window.location.href;
  const p = url.split("?")[1];
  const params = new URLSearchParams(p);
  return params;
};

const form = reactive({
  principal: "", // 手机号
  credentials: "", // 密码或者验证码
  appType: 9, //8 大屏端  9 智家APP
  response_type: "code", //授权方式,这里固定为 code
  loginType: 0, //1 验证码  0 密码
  client_id: "haier_uhome",
  state: geturlparam().get("state"),
  redirect_uri: geturlparam().get("redirect_uri"),
});

const onSubmit = async () => {
  try {
    if (!checked.value) {
      Toast("请先阅读服务条款");
      return;
    }
    Toast.loading({
      forbidClick: true,
      duration: 0,
    });
    return;
  } catch ({ response }) {
    const data = response.data;
    Toast.fail(data.msg);
  }
};

const countDown = useCountDown({
  // 倒计时 60 小时
  time: 10 * 1000,
  onFinish: () => {
    isSendTime.value = false;
    countDown.reset();
  },
});

const current = countDown.current;

const sendCode = async () => {
  if (!form.principal) {
    Toast("请输入手机号");
    return;
  }
  Toast.loading({
    message: "发送验证码",
    forbidClick: true,
    duration: 0,
  });
};

const handleChangeType = () => {
  form.loginType = form.loginType === 0 ? 1 : 0;
};

const handleTip = (type: string) => {
  let txt = "";
  let title = "";
  if (type === "1") {
    // 服务条款
    title = "《服务条款》";
    txt = "222";
  } else if (type === "2") {
    // 法律声明
    title = "《法律声明》";
  } else if (type === "3") {
    // 隐私条款
    title = "《隐私条款》";
    txt = `1111`;
  }
  Dialog.alert({
    title: title,
    allowHtml: true,
    message: txt,
  }).then(() => {
    // on close
  });
};
</script>
<style scoped lang="less">
.login {
  font-family: PingFangSC-Regular, PingFang SC;
  padding-top: 43px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  .form-submit {
    margin: 0 33px;
  }

  .logo {
    width: 120px;
    height: 46px;
    margin: 0 auto 43px;
    display: inherit;
  }
  .bottom-right-color {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 104px;
    height: 144px;
  }
  .top-left-color {
    position: fixed;
    top: 0;
    left: 0;
    width: 193px;
    height: 257px;
  }
  .submit-btn {
    margin-top: 84px;
  }
  .field-icon {
    font-size: 18px;
  }
  .login-type {
    text-align: left;
    font-size: 15px;
    font-weight: 400;
    color: #999999;
    line-height: 21px;
    height: 21px;
    margin-top: 25px;
  }

  .van-form {
    .van-cell-group--inset {
      margin: 0;
      .van-field {
        padding-left: 0;
        padding-right: 0;
        background: transparent;
      }
      .van-cell:after {
        left: 0;
        right: 0;
      }
    }
  }

  .sendCode {
    height: 20px;
    font-size: 14px;
    font-weight: 800;
    color: #db4f2d;
    line-height: 20px;
    margin-right: 3px;
  }

  .bottom-tip {
    position: absolute;
    display: flex;
    justify-content: center;
    height: 22px;
    font-size: 12px;
    font-weight: 400;
    color: #999999;
    line-height: 22px;
    margin-top: 120px;
    left: 0;
    text-align: center;
    width: 100%;
    span {
      margin-left: 4px;
    }
    .link {
      color: #7fafe7;
    }
  }
}
</style>
