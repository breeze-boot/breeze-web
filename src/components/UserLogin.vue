<template>
  <div>
    <el-form
      ref="userLogin"
      :model="userLogin"
      :rules="rules"
      class="userLogin"
      size="small">
      <h3>登录中心</h3>
      <el-form-item prop="username">
        <el-input
          v-model="userLogin.username"
          auto-complete="false"
          placeholder="账号"
          type="text"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="userLogin.password"
          auto-complete="false"
          placeholder="密码"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="width: 100%" type="primary" @click="onSubmit"
        >{{ loginBtn }}
        </el-button>
      </el-form-item>
    </el-form>

    <Verify
      ref="verify"
      :captchaType="'blockPuzzle'"
      :imgSize="{ width: '330px', height: '155px' }"
      :mode="'pop'"
      @success="success"
    ></Verify>
  </div>
</template>

<script>
import Verify from '@/components/verifition/Verify'
import { jwtToken } from '@/api/admin/login'

export default {
  name: 'userLogin',
  components: {
    Verify
  },
  data () {
    return {
      loginBtn: '登录',
      userLogin: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入登录账户',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入登录密码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    success () {
      jwtToken(this.userLogin).then((response) => {
        if (response) {
          localStorage.setItem('access_token', response.data.access_token)
          // const path = this.$route.query.redirect
          // this.$router.replace(path === '/' || path === undefined ? 'welcome' : path)
          this.$router.push('welcome')
        }
      })
    },
    onSubmit () {
      this.$refs.userLogin.validate((valid) => {
        if (valid) {
          this.$refs.verify.show()
        } else {
          this.$message({
            showClose: true,
            message: '登录失败',
            type: 'error'
          })
          localStorage.removeItem('access_token')
          return false
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.userLogin {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -70%);
  background: rgba(236, 236, 236, 0.5);
  border-radius: 15px;
  background-clip: padding-box;
  padding: 2vh 2vw;
  width: 18vw;
  border: 1px #eaeaea solid;
  box-shadow: 0 0 10px #9b9b9b;
}

.userLogin > h3 {
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 20px;
  padding: 10px 0;
}
</style>
