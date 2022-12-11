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
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="userLogin.password"
          auto-complete="false"
          placeholder="密码"
          show-password
          type="password"
        />
      </el-form-item>
      <el-form-item id="tenant_select" prop="tenant" size="mini">
        <el-select v-model="userLogin.tenantId" placeholder="请选择租户" @change="handleTenant">
          <el-option
            v-for="item in tenantOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
import { selectTenant } from '@/api/sys/tenant'
import { mapActions, mapMutations } from 'vuex'
import { login } from '@/api/sys/login'

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
        password: '123456',
        tenantId: ''
      },
      tenantOption: [],
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
  created () {
    localStorage.clear()
  },
  mounted () {
    selectTenant().then(rep => {
      if (rep.code === 1) {
        this.tenantOption = rep.data
      }
    })
  },
  methods: {
    ...mapMutations('menu', ['setMenus']),
    ...mapActions('menu', ['loadRoute']),
    ...mapMutations('userInfo', ['setUserInfo']),
    success () {
      login(this.userLogin).then((rep) => {
        if (rep.code === 1) {
          localStorage.setItem('access_token', rep.data.access_token)
          localStorage.setItem('authorities', rep.data.user_info.authorities)
          this.setUserInfo(rep.data.user_info)
          // 获取路由
          this.loadRoute()
        }
      })
    },
    handleTenant () {
      localStorage.setItem('B_TENANT_ID', this.userLogin.tenantId)
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
<style lang="less">
.userLogin {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -70%);
  background: rgba(236, 236, 236, 0.5);
  background-clip: padding-box;
  padding: 2vh 2vw;
  width: 20vw;
  min-width: 300px;
  border: 1px #bdbdbd solid;
  box-shadow: 0 0 5px #9b9b9b;

  h3 {
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 20px;
    padding: 10px 0;
  }
}

#tenant_select {
  .el-select {
    margin: 0 auto;
    width: 100%;
  }
}
</style>
