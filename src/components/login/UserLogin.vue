<template>
  <div>
    <el-form
      ref="userLogin"
      :model="userLogin"
      :rules="rules"
      class="user-login"
      size="small">
      <h3>用户登录</h3>
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
      <el-form-item prop="tenantId">
        <el-select v-model="userLogin.tenantId" :popper-append-to-body="false" placeholder="请选择租户">
          <el-option
            v-for="item in tenantOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button style="width: 100%" type="primary" @click="handleLogin">
          登录
        </el-button>
      </el-form-item>
    </el-form>

    <Verify
      ref="verify"
      :captchaType="'blockPuzzle'"
      :imgSize="{ width: '330px', height: '155px' }"
      :mode="'pop'"
      @success="handleSuccess"
    ></Verify>
  </div>
</template>

<script>
import Verify from '@/components/verifition/Verify'
import { selectTenant } from '@/api/auth/tenant'
import { mapMutations } from 'vuex'
import { encrypt } from '@utils/common'

export default {
  name: 'userLogin',
  components: {
    Verify
  },
  data () {
    return {
      userLogin: {
        username: 'admin',
        password: '123456',
        tenantId: 1
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
        ],
        tenantId: [
          {
            required: true,
            message: '请选择租户',
            trigger: 'change'
          }
        ]
      }
    }
  },
  mounted () {
    selectTenant().then(response => {
      if (response.data) {
        this.tenantOption = response.data
      }
    })
  },
  methods: {
    ...mapMutations('menu', ['setMenus']),
    ...mapMutations('userInfo', ['setUserInfo']),
    handleSuccess () {
      const loginParams = {
        grantType: 'password',
        params: {
          username: this.userLogin.username.trim(),
          password: encrypt(this.userLogin.password.trim(), '1234567890123456')
        }
      }
      // 验证码校验通过就去存储当前的租户ID，登录成功后回去再次更新
      localStorage.setItem('X-TENANT-ID', this.userLogin.tenantId)
      this.$store.dispatch('userInfo/authLogin', loginParams).then(() => {
        this.$router.push({
          path: this.$route.query.redirect || '/welcome'
        }).catch((e) => {
          console.error(e)
        })
      }).catch((e) => {
        console.error(e)
      })
    },
    handleLogin () {
      this.$refs.userLogin.validate((valid) => {
        if (valid) {
          this.$refs.verify.show()
        } else {
          localStorage.removeItem('access_token')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
.user-login {
  padding: 2vh 50px;
  width: 20vw;
  height: 35vh;
  min-width: 300px;
  margin-bottom: 5vh;
  border: 1px solid #b4b4b4;

  h3 {
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 20px;
    padding: 10px 0;
  }

  .el-input__inner {
    background: rgb(228, 231, 235);
    height: 45px;
    max-height: 45px;
    color: rgba(50, 50, 50, 0.8);
    border-radius: 1px;
    font-size: 13px !important;
  }

  .el-select .el-input .el-select__caret {
    color: rgba(50, 50, 50, 0.8);
  }

  // option选项 上面的箭头
  .el-popper[x-placement^="bottom"] .popper__arrow::after {
    display: none;
  }

  .popper__arrow {
    border: none;
  }

  // option选项 最外层
  .el-select-dropdown {
    border: none !important;
    left: 0 !important;
    top: 45px !important;
    background: rgb(228, 231, 235) !important;
    z-index: 9999;
    border-radius: 1px !important;
  }

  // option选项 文字样式
  .el-select-dropdown__item {
    color: rgba(50, 50, 50, 0.8) !important;
    max-height: 35px !important;
    height: 35px !important;
    line-height: 35px !important;
    z-index: 9999;
  }

  .el-select-dropdown__item.selected span {
    color: rgba(50, 50, 50, 0.6) !important;
    z-index: 9999;
  }

  // 移入option选项 样式调整
  .el-select-dropdown__item.hover {
    background: rgb(228, 231, 235) !important;
    color: rgba(50, 50, 50, 0.6) !important;
    z-index: 9999;
  }

  // 下拉框垂直滚动条宽度
  .el-scrollbar__bar.is-vertical {
    width: 10px;
    top: 2px;
  }

  // 下拉框最大高度
  .el-select-dropdown__wrap {
    max-height: 200px;
  }

  .el-button:not(.other_login) {
    max-height: 45px !important;
    height: 45px !important;
    background: linear-gradient(to right, rgb(9, 63, 107), rgba(9, 63, 107, 0.5), rgb(9, 63, 107));
    border-radius: 1px;
    border: none;
    font-size: 18px;
  }
}
</style>
