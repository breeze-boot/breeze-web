<template>
  <div class="login-container">
    <div class="login-card">
      <div class="other-login-group">
        <el-row>
          <el-col :span="5" class="other-login-btn">
            <custom-icon icon-name="svg-user" icon-style="cursor: pointer" @click.native="handleUserLogin"/>
          </el-col>
          <el-col :span="5" class="other-login-btn">
            <custom-icon icon-name="svg-phone" icon-style="cursor: pointer; font-size: 1.8rem;"
                         @click.native="handlePhoneLogin"/>
          </el-col>
          <el-col :span="5" class="other-login-btn">
            <custom-icon icon-name="svg-gitee" icon-style="cursor: pointer" @click.native="handleGiteeLogin"/>
          </el-col>
          <el-col :span="5" class="other-login-btn">
            <custom-icon icon-name="svg-github" icon-style="cursor: pointer; font-size: 1.8rem;"
                         @click.native="handleGithubLogin"/>
          </el-col>
          <el-col :span="4" class="other-login-btn">
            <custom-icon icon-name="svg-wechat" icon-style="cursor: pointer; font-size: 1.8rem;"
                         @click.native="handleWeChatLogin"/>
          </el-col>
        </el-row>
      </div>
      <UserLogin v-show="showLoginType === 'user'"
                 :style="{animationName: (showLoginType === 'phone' ? 'fadeOut' : 'flipInX'), animationDuration: (showLoginType === 'phone' ? 0 : 1) + 's'}"/>
      <PhoneLogin v-show="showLoginType === 'phone'"
                  :style="{animationName: (showLoginType === 'user' ? 'fadeOut' : 'flipInX'), animationDuration: (showLoginType === 'user' ? 0 : 1) + 's'}"/>
    </div>
  </div>
</template>

<script>
import UserLogin from '@/components/login/UserLogin.vue'
import PhoneLogin from '@/components/login/PhoneLogin.vue'
import { authUrl } from '@/api/login/login'
import 'animate.css'

export default {
  name: 'LoginView',
  components: {
    UserLogin,
    PhoneLogin
  },
  data () {
    return {
      showLoginType: 'user'
    }
  },
  beforeCreate () {
    localStorage.clear()
  },
  methods: {
    handleGiteeLogin () {
      authUrl('gitee').then(response => {
        window.location.href = response.data
      })
    },
    handleGithubLogin () {
      authUrl('github').then(response => {
        window.location.href = response.data
      })
    },
    handleUserLogin () {
      this.showLoginType = 'user'
    },
    handlePhoneLogin () {
      this.showLoginType = 'phone'
    },
    handleWeChatLogin () {
    }
  }
}
</script>

<style lang="scss" scoped>

.login-container {
  height: 100vh;
  width: 100vw;
  position: relative;
  /* 背景渐变色 */
  background: linear-gradient(-45deg, rgb(9, 63, 107), rgba(9, 63, 107, 0.5), rgb(9, 63, 107), rgb(9, 63, 107));
  /* 背景尺寸 */
  background-size: 600% 600%;
  /* 循环动画 */
  animation: gradientBG 5s ease infinite;

  .login-card {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -55%);
    background-clip: padding-box;
    background: rgb(228, 231, 235);

    .other-login-group {
      position: absolute;
      bottom: 0;
      width: 100%;

      .other-login-btn {
        margin: 10px 0;
        text-align: center;
      }
    }
  }
}

@keyframes gradientBG {
  0% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>
