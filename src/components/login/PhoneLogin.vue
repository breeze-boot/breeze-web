<template>
  <div>
    <el-form
      ref="phoneLogin"
      :model="phoneLogin"
      :rules="rules"
      class="phone-login"
      size="small">
      <h3>手机登录</h3>
      <el-form-item prop="phone">
        <el-input
          v-model="phoneLogin.phone"
          auto-complete="false"
          placeholder="手机号"
          type="text"
        />
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="phoneLogin.code"
          auto-complete="false"
          placeholder="验证码"
          type="text"
        />
      </el-form-item>
      <el-form-item prop="tenantId">
        <el-select v-model="phoneLogin.tenantId" :popper-append-to-body="false" placeholder="请选择租户">
          <el-option
            v-for="item in tenantOption"
            :key="item.key"
            :label="item.value"
            :value="item.key">
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
import { selectTenant } from '@/api/system/tenant'
import { mapMutations } from 'vuex'

export default {
  name: 'PhoneLogin',
  components: {
    Verify
  },
  data () {
    return {
      phoneLogin: {
        phone: '17812341234',
        code: '123456',
        tenantId: 1
      },
      tenantOption: [],
      rules: {
        phone: [
          {
            required: true,
            message: '请输入已注册的手机号',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入验证码',
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
      if (response.code === 1) {
        this.tenantOption = response.data
      }
    })
  },
  methods: {
    ...mapMutations('menu', ['setMenus']),
    ...mapMutations('userInfo', ['setUserInfo']),
    handleSuccess () {
      const loginParams = {
        grantType: 'sms_code',
        params: {
          phone: this.phoneLogin.phone.trim(),
          code: this.phoneLogin.code.trim()
        }
      }
      // 验证码校验通过就去存储当前的租户ID，登录成功后回去再次更新
      localStorage.setItem('X-TENANT-ID', this.phoneLogin.tenantId)
      this.$store.dispatch('userInfo/authLogin', loginParams).then(() => {
        this.$router.push({
          path: this.$route.query.redirect || 'welcome'
        }).catch((e) => {
          console.error(e)
        })
      }).catch((e) => {
        console.error(e)
      })
    },
    handleLogin () {
      this.$refs.phoneLogin.validate((valid) => {
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
.phone-login {
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
