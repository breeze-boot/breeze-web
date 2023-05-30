<template>
  <base-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchClientForm" class="demo-form-inline" label-width="90px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="客户端Id" prop="clientId">
              <el-input v-model="searchClientForm.clientId" clearable placeholder="客户端Id"/>
            </el-form-item>
            <el-form-item label="客户端名称" prop="clientName">
              <el-input v-model="searchClientForm.clientName" clearable placeholder="客户端名称"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="searchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['sys:client:create']" plain size="mini" type="primary" @click="create">新建</el-button>
        <el-button v-has="['sys:client:delete']" :disabled="checkDeleteItem" plain size="mini" type="danger"
                   @click="remove">删除
        </el-button>
      </div>
      <el-table
        ref="clientTable"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        :data="clientTableData"
        border
        empty-text="无数据"
        size="mini"
        stripe
        @selection-change="clientHandleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          v-if="false"
          label="ID"
          prop="id"
          width="200">
        </el-table-column>
        <el-table-column
          label="客户端ID"
          prop="clientId"
          width="200"/>
        <el-table-column
          label="客户端名称"
          prop="clientName"
          show-overflow-tooltip
          width="200"/>
        <el-table-column
          label="客户端访问密钥"
          prop="clientSecret"
          show-overflow-tooltip
          width="200"/>
        <el-table-column
          label="发布日期"
          prop="clientIdIssuedAt"
          width="200">
          <template slot-scope="scope">
            {{ scope.row.clientIdIssuedAt }}
          </template>
        </el-table-column>
        <el-table-column
          prop="redirectUris"
          show-overflow-tooltip
          width="800">
          <template slot="header">
            <el-tooltip
              class="item"
              effect="dark"
              content="当grant_type为authorization_code时, 在Oauth2.0流程中会使用并检查，不在此列将被拒绝，使用IP或者域名，不能使用localhost"
              placement="top-start">
              <span><i class="el-icon-question"></i> 重定向URI </span>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <el-tag style="margin: 0 2px;"
                    v-for="(uri, index) in scope.row.redirectUris"
                    :key="index">
              {{ uri }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="scopes"
          show-overflow-tooltip
          width="600">
          <template slot="header">
            <el-tooltip
              class="item"
              effect="dark"
              content="若有多个权限范围用逗号【,】分隔"
              placement="top-start">
              <span><i class="el-icon-question"></i> 权限范围 </span>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <el-tag style="margin: 0 2px;"
                    v-for="(s, index) in scope.row.scopes"
                    :key="index">
              {{ s }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="authorizationGrantTypes"
          show-overflow-tooltip
          width="600">
          <template slot="header">
            <el-tooltip
              class="item"
              effect="dark"
              content="可选值包括authorization_code,password,refresh_token,client_credentials,注意：password在auth2.1弃用了，我们自定义了【password】【sms_code】，若支持多个授权许可类型用逗号【,】分隔"
              placement="top-start">
              <span><i class="el-icon-question"></i> 授权许可类型 </span>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <el-tag style="margin: 0 2px;"
                    v-for="(grantType, index) in scope.row.authorizationGrantTypes"
                    :key="index">
              {{ grantType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="clientAuthenticationMethods"
          show-overflow-tooltip
          width="600">
          <template slot="header">
            <el-tooltip
              class="item"
              effect="dark"
              content="；[client_secret_basic, client_secret_post, private_key_jwt, client_secret_jwt, none]"
              placement="top-start">
              <span><i class="el-icon-question"></i> 身份验证方法 </span>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <el-tag style="margin: 0 2px;"
                    v-for="(method, index) in scope.row.clientAuthenticationMethods"
                    :key="index">
              {{ method }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="密钥到期时间"
          prop="clientSecretExpiresAt"
          show-overflow-tooltip
          width="200">
        </el-table-column>

        <el-table-column label="clientSettings设置">
          <el-table-column
            label="PKCE"
            prop="requireProofKey"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag size="mini">
                {{ scope.row.clientSettings.requireProofKey ? '开启' : '关闭' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="授权同意页面"
            prop="requireAuthorizationConsent"
            show-overflow-tooltip
            width="200">
            <template slot-scope="scope">
              <el-tag size="mini">
                {{ scope.row.clientSettings.requireAuthorizationConsent ? '需要' : '不需要' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            label="jwk-url"
            prop="jwkSetUrl"
            show-overflow-tooltip
            width="200">
            <template slot-scope="scope">
              {{ scope.row.clientSettings.jwkSetUrl }}
            </template>
          </el-table-column>

          <el-table-column
            label="令牌端点认证签名算法"
            prop="tokenEndpointAuthenticationSigningAlgorithm"
            show-overflow-tooltip
            width="200">
            <template slot-scope="scope">
              <el-tag size="mini" v-if="scope.row.clientSettings.tokenEndpointAuthenticationSigningAlgorithm">
                {{ scope.row.clientSettings.tokenEndpointAuthenticationSigningAlgorithm }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="tokenSettings设置">
          <el-table-column
            label="标识牌签名算法"
            prop="idTokenSignatureAlgorithm"
            show-overflow-tooltip
            width="200">
            <template slot-scope="scope">
              <el-tag size="mini" v-if="scope.row.tokenSettings.idTokenSignatureAlgorithm">
                {{ scope.row.tokenSettings.idTokenSignatureAlgorithm }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            label="访问令牌格式"
            prop="accessTokenFormat"
            show-overflow-tooltip
            width="200">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.tokenSettings.accessTokenFormat">
                {{ scope.row.tokenSettings.accessTokenFormat }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            label="授权代码有效时间"
            prop="authorizationCodeTimeToLive"
            show-overflow-tooltip
            width="200">
            <template slot-scope="scope">
              <el-tag size="mini" v-if="scope.row.tokenSettings.authorizationCodeTimeToLive">
                {{ scope.row.tokenSettings.authorizationCodeTimeToLive + 'm' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            label="访问令牌时间有效时间"
            prop="accessTokenTimeToLive"
            show-overflow-tooltip
            width="200">
            <template slot-scope="scope">
              <el-tag size="mini" v-if="scope.row.tokenSettings.accessTokenTimeToLive">
                {{ scope.row.tokenSettings.accessTokenTimeToLive + 'm' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            label="使用刷新令牌"
            prop="reuseRefreshTokens"
            show-overflow-tooltip
            width="200">
            <template slot-scope="scope">
              <el-tag size="mini" v-if="scope.row.tokenSettings.reuseRefreshTokens">
                {{ scope.row.tokenSettings.reuseRefreshTokens ? '使用' : '不使用' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            label="刷新令牌有效时间"
            prop="refreshTokenTimeToLive"
            show-overflow-tooltip
            width="200">
            <template slot-scope="scope">
              <el-tag size="mini" v-if="scope.row.tokenSettings.refreshTokenTimeToLive">
                {{ scope.row.tokenSettings.refreshTokenTimeToLive + 'm' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button v-has="['sys:client:resetClientSecret']" size="mini" type="text"
                       @click="handleResetClientSecret(scope.row)">重置密钥
            </el-button>
            <el-button size="mini" type="text" @click="info(scope.row)">查看</el-button>
            <el-button v-has="['sys:client:modify']" size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button v-has="['sys:client:delete']" size="mini" type="text"
                       @click.native.prevent="removeItem(scope.$index, clientTableData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchClientForm.current"
          :page-size="searchClientForm.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>

    <el-dialog :title="title" :visible.sync="clientDialogVisible" width="40vw"
               @close="closeClientDialog('clientRuleForm')">
      <el-form ref="clientRuleForm" :model="client" :rules="clientRules" size="mini">
        <div class="card">
          <span>基础配置</span>
          <el-divider></el-divider>
          <el-form-item :label-width="formLabelWidth" label="客户端ID" prop="clientId">
            <el-input v-model="client.clientId" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="客户端名称" prop="clientName">
            <el-input v-model="client.clientName" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="密钥" prop="clientSecret"
                        v-if="!this.client.id && !this.client.clientSettings.requireProofKey">
            <el-input v-model="client.clientSecret" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="确认密钥" prop="confirmClientSecret"
                        v-if="!this.client.id && !this.client.clientSettings.requireProofKey">
            <el-input v-model="client.confirmClientSecret" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="发布日期" prop="clientIdIssuedAt">
            <el-date-picker
              v-model="client.clientIdIssuedAt"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择发布日期 "
              default-time="12:00:00">
            </el-date-picker>
          </el-form-item>

          <el-form-item :label-width="formLabelWidth" label="重定向URI" prop="redirectUris">
            <el-select filterable
                       allow-create
                       default-first-option multiple v-model="client.redirectUris" placeholder="请设置重定向URI">
              <el-option
                v-for="(item, index) in this.dict()('REDIRECT_URIS')"
                :key="index"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label-width="formLabelWidth" label="权限范围" prop="scopes">
            <el-select filterable multiple v-model="client.scopes" placeholder="请选择权限范围">
              <el-option
                v-for="(item, index) in this.dict()('SCOPES')"
                :key="index"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label-width="formLabelWidth" label="授权许可类型" prop="authorizationGrantTypes">
            <el-select filterable multiple v-model="client.authorizationGrantTypes" placeholder="请选择授权许可类型">
              <el-option
                v-for="(item, index) in this.dict()('AUTHORIZATION_GRANT_TYPES')"
                :key="index"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label-width="formLabelWidth" label="身份验证方法" prop="clientAuthenticationMethods">
            <el-select filterable multiple v-model="client.clientAuthenticationMethods"
                       placeholder="请选择身份验证方法">
              <el-option
                v-for="(item, index) in this.dict()('CLIENT_AUTHENTICATION_METHODS')"
                :key="index"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label-width="formLabelWidth" label="密钥到期时间" prop="clientSecretExpiresAt"
                        v-if="!this.client.clientSettings.requireProofKey">
            <el-date-picker
              v-model="client.clientSecretExpiresAt"
              type="datetime"
              placeholder="选择密钥到期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="12:00:00">
            </el-date-picker>
          </el-form-item>
        </div>

        <div class="card">
          <span>client配置</span>
          <el-divider></el-divider>
          <el-form-item :label-width="formLabelWidth" label="PKCE" prop="requireProofKey">
            <el-switch
              v-model="client.clientSettings.requireProofKey"
              :active-value="true"
              :inactive-value="false"
              active-color="#13ce66"
              inactive-color="#AAAAAA">
            </el-switch>
          </el-form-item>

          <el-form-item :label-width="formLabelWidth" label="授权同意页面" prop="requireAuthorizationConsent">
            <el-switch
              v-model="client.clientSettings.requireAuthorizationConsent"
              :active-value="true"
              :inactive-value="false"
              active-color="#13ce66"
              inactive-color="#AAAAAA">
            </el-switch>
          </el-form-item>

          <el-form-item :label-width="formLabelWidth" label="JWK-URL" prop="jwkSetUrl">
            <el-input v-model="client.clientSettings.jwkSetUrl" autocomplete="off" clearable placeholder="请输入JWT获取URL"/>
          </el-form-item>

          <el-form-item :label-width="formLabelWidth" label="JWT签名算法"
                        prop="tokenEndpointAuthenticationSigningAlgorithm">
            <el-select v-model="client.clientSettings.tokenEndpointAuthenticationSigningAlgorithm"
                       placeholder="请选择JWT的签名算法">
              <el-option
                v-for="(item, index)  in this.dict()('TOKEN_ENDPOINT_AUTHENTICATION_SIGNING_ALGORITHM')"
                :key="index"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="card">
          <span>token配置</span>
          <el-divider></el-divider>
          <el-form-item :label-width="formLabelWidth" label="ID-TOKEN签名算法" prop="idTokenSignatureAlgorithm">
            <el-select v-model="client.tokenSettings.idTokenSignatureAlgorithm" placeholder="请选择ID-TOKEN签名算法">
              <el-option
                v-for="(item, index) in this.dict()('ID_TOKEN_SIGNATURE_ALGORITHM')"
                :key="index"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label-width="formLabelWidth" label="访问令牌格式" prop="accessTokenFormat">
            <el-select v-model="client.tokenSettings.accessTokenFormat" placeholder="请选择访问令牌格式">
              <el-option
                v-for="(item, index)  in this.dict()('ACCESS_TOKEN_FORMAT')"
                :key="index"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label-width="formLabelWidth" label="刷新令牌" prop="reuseRefreshTokens">
            <el-switch
              v-model="client.tokenSettings.reuseRefreshTokens"
              :active-value="true"
              :inactive-value="false"
              active-color="#13ce66"
              inactive-color="#AAAAAA">
            </el-switch>
          </el-form-item>

          <el-form-item :label-width="formLabelWidth" label="刷新令牌有效时间" prop="refreshTokenTimeToLive"
                        v-if="client.tokenSettings.reuseRefreshTokens">
            <el-input v-model="client.tokenSettings.refreshTokenTimeToLive" autocomplete="off" clearable>
              <template slot="append">分钟</template>
            </el-input>
          </el-form-item>

          <el-form-item :label-width="formLabelWidth" label="授权代码有效时间" prop="authorizationCodeTimeToLive">
            <el-input v-model="client.tokenSettings.authorizationCodeTimeToLive" autocomplete="off" clearable>
              <template slot="append">分钟</template>
            </el-input>
          </el-form-item>

          <el-form-item :label-width="formLabelWidth" label="访问令牌有效时间" prop="accessTokenTimeToLive">
            <el-input v-model="client.tokenSettings.accessTokenTimeToLive" autocomplete="off" clearable>
              <template slot="append">分钟</template>
            </el-input>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetClientForm('clientRuleForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitClientForm('clientRuleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="60vw"
               @close="closeInfoDialog">
      <el-descriptions :column="2" border size="mini">
        <el-descriptions-item label="客户端ID">
          {{ client.clientId }}
        </el-descriptions-item>
        <el-descriptions-item label="客户端名称">
          {{ client.clientName }}
        </el-descriptions-item>
        <el-descriptions-item label="客户端名称">
          {{ client.clientName }}
        </el-descriptions-item>
        <el-descriptions-item label="客户端访问密钥">
          {{ client.clientSecret }}
        </el-descriptions-item>
        <el-descriptions-item label="发布日期">
          {{ client.clientIdIssuedAt }}
        </el-descriptions-item>
        <el-descriptions-item label="重定向URI">
          {{ client.redirectUris }}
        </el-descriptions-item>
        <el-descriptions-item label="权限范围">
          {{ client.scopes }}
        </el-descriptions-item>
        <el-descriptions-item label="授权许可类型">
          {{ client.authorizationGrantTypes }}
        </el-descriptions-item>
        <el-descriptions-item label="身份验证方法">
          {{ client.authorizationGrantTypes }}
        </el-descriptions-item>
        <el-descriptions-item label="密钥到期时间">
          {{ client.clientSecretExpiresAt }}
        </el-descriptions-item>

        <el-descriptions-item label="PKCE">
          {{ client.clientSettings.requireProofKey ? '开启' : '关闭' }}
        </el-descriptions-item>
        <el-descriptions-item label="授权同意页面">
          {{ client.clientSettings.requireAuthorizationConsent ? '需要' : '不需要' }}
        </el-descriptions-item>
        <el-descriptions-item label="jwk-url">
          {{ client.clientSettings.jwkSetUrl }}
        </el-descriptions-item>
        <el-descriptions-item label="令牌端点认证签名算法">
          {{ client.clientSettings.tokenEndpointAuthenticationSigningAlgorithm }}
        </el-descriptions-item>

        <el-descriptions-item label="标识牌签名算法">
          {{ client.tokenSettings.idTokenSignatureAlgorithm }}
        </el-descriptions-item>
        <el-descriptions-item label="访问令牌格式">
          {{ client.tokenSettings.accessTokenFormat }}
        </el-descriptions-item>
        <el-descriptions-item label="授权代码有效时间">
          {{ client.tokenSettings.authorizationCodeTimeToLive }}
        </el-descriptions-item>
        <el-descriptions-item label="访问令牌时间有效时间">
          {{ client.tokenSettings.accessTokenTimeToLive }}m
        </el-descriptions-item>
        <el-descriptions-item label="使用刷新令牌">
          {{ client.tokenSettings.reuseRefreshTokens }}
        </el-descriptions-item>
        <el-descriptions-item label="使用刷新令牌">
          {{ client.tokenSettings.refreshTokenTimeToLive }}m
        </el-descriptions-item>
        <el-descriptions-item label="刷新令牌有效时间">
          {{ client.tokenSettings.refreshTokenTimeToLive }}m
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="resetClientSecretDialogVisible" width="40vw"
               @close="closeRestClientSecretDialog('resetClientSecretRuleForm')">
      <el-form ref="resetClientSecretRuleForm" :model="resetClientSecret" :rules="resetClientSecretRules" size="mini">
        <el-form-item :label-width="resetClientSecretFormLabelWidth" label="密钥" prop="clientSecret">
          <el-input v-model="resetClientSecret.clientSecret" autocomplete="off" clearable show-password
                    type="password"/>
        </el-form-item>
        <el-form-item :label-width="resetClientSecretFormLabelWidth" label="确认密钥" prop="confirmClientSecret">
          <el-input v-model="resetClientSecret.confirmClientSecret" autocomplete="off" clearable show-password
                    type="password"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetClientSecretForm('resetClientSecretRuleForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitRestClientSecretForm('resetClientSecretRuleForm')">确 定
        </el-button>
      </div>
    </el-dialog>
  </base-container>
</template>

<script>
import { del, info, list, modify, resetClientSecret, save } from '@/api/system/client'
import { confirmAlert } from '@utils/common'
import { DIALOG_TYPE } from '@/const/constant'
import JSONBigInt from 'json-bigint'
import { dict } from '@/mixins'

export default {
  name: 'Client',
  mixins: [dict],
  data () {
    return {
      // 此页面需要字典编码
      dictCode: [
        'REDIRECT_URIS',
        'ACCESS_TOKEN_FORMAT',
        'ID_TOKEN_SIGNATURE_ALGORITHM',
        'TOKEN_ENDPOINT_AUTHENTICATION_SIGNING_ALGORITHM',
        'SCOPES',
        'AUTHORIZATION_GRANT_TYPES',
        'CLIENT_AUTHENTICATION_METHODS'
      ],
      // 当前操作类型
      dialogType: DIALOG_TYPE.ADD,
      // 弹出框标题
      title: '',
      // 单元格选中数据
      multipleSelectionClientIds: [],
      // 客户端表格数据
      clientTableData: [],
      // 客户端查询条件数据
      searchClientForm: {
        clientName: '',
        clientCode: '',
        current: 1,
        size: 10
      },
      // 分页总数
      total: 0,
      // 标记删除按钮是否可以点击
      checkDeleteItem: true,
      // 客户端添加修改弹出框
      clientDialogVisible: false,
      // 客户端重置secret弹出框
      resetClientSecretDialogVisible: false,
      // 客户端详情弹出框
      infoDialogVisible: false,
      // 表单标题宽度
      formLabelWidth: '140px',
      // 重置密钥表单标题宽度
      resetClientSecretFormLabelWidth: '80px',
      // 客户端添加修改数据
      client: {
        id: undefined,
        clientId: '',
        clientName: '',
        clientSecret: '',
        redirectUris: '',
        scopes: '',
        authorizationGrantTypes: '',
        clientAuthenticationMethods: '',
        clientSecretExpiresAt: '',
        clientIdIssuedAt: '',
        clientSettings: {
          requireProofKey: false,
          requireAuthorizationConsent: false,
          jwkSetUrl: '',
          tokenEndpointAuthenticationSigningAlgorithm: ''
        },
        tokenSettings: {
          idTokenSignatureAlgorithm: '',
          accessTokenFormat: '',
          reuseRefreshTokens: false,
          refreshTokenTimeToLive: '',
          authorizationCodeTimeToLive: '',
          accessTokenTimeToLive: ''
        }
      },
      // 客户端详情数据
      clientInfo: {
        id: undefined,
        clientId: '',
        clientName: '',
        clientSecret: '',
        redirectUris: '',
        scopes: '',
        authorizationGrantTypes: '',
        clientAuthenticationMethods: '',
        clientSecretExpiresAt: '',
        clientIdIssuedAt: '',
        clientSettings: {
          requireProofKey: false,
          requireAuthorizationConsent: false,
          jwkSetUrl: '',
          tokenEndpointAuthenticationSigningAlgorithm: ''
        },
        tokenSettings: {
          idTokenSignatureAlgorithm: '',
          accessTokenFormat: '',
          reuseRefreshTokens: false,
          refreshTokenTimeToLive: '',
          authorizationCodeTimeToLive: '',
          accessTokenTimeToLive: ''
        }
      },
      // 客户端添加修改表单规则
      clientRules: {
        clientId: [
          {
            required: true,
            message: '请输入客户端ID',
            trigger: 'blur'
          }
        ],
        clientName: [
          {
            required: true,
            message: '请输入客户端名称',
            trigger: 'blur'
          }
        ],
        clientSecret: [
          {
            validator: (rule, value, callback) => {
              if (this.client.requireProofKey && value === '') {
                callback(new Error('请输入密钥'))
              } else {
                if (this.client.confirmClientSecret !== '') {
                  this.$refs.clientRuleForm.validateField('confirmClientSecret')
                }
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        confirmClientSecret: [
          {
            validator: (rule, value, callback) => {
              if (this.client.requireProofKey && value === '') {
                callback(new Error('请再次输入密钥'))
              } else if (this.client.requireProofKey && value !== this.client.clientSecret) {
                callback(new Error('两次输入密钥不一致!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        clientIdIssuedAt: [
          {
            trigger: 'blur'
          }
        ],
        redirectUris: [
          {
            required: true,
            message: '请设置重定向地址',
            trigger: 'blur'
          }
        ],
        scopes: [
          {
            required: true,
            message: '请设置客户端权限范围',
            trigger: 'change'
          }
        ],
        authorizationGrantTypes: [
          {
            required: true,
            message: '请设置客户端授权许可类型',
            trigger: 'change'
          }
        ],
        clientAuthenticationMethods: [
          {
            required: true,
            message: '请设置身份验证方法',
            trigger: 'change'
          }
        ],
        clientSecretExpiresAt: [],
        requireProofKey: [],
        requireAuthorizationConsent: [],
        jwkSetUrl: [],
        idTokenSignatureAlgorithm: [],
        accessTokenFormat: [],
        reuseRefreshTokens: [],
        refreshTokenTimeToLive: [
          {
            validator: (rule, value, callback) => {
              if (this.client.reuseRefreshTokens) {
                if (this.client.refreshTokenTimeToLive === '') {
                  callback(new Error('请输入刷新令牌有效时间'))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        authorizationCodeTimeToLive: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.client.authorizationCodeTimeToLive === '') {
                callback(new Error('请设置刷新令牌有效时间'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        accessTokenTimeToLive: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.client.accessTokenTimeToLive === '') {
                callback(new Error('请设置访问令牌有效时间'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      // 重置客户端密钥数据
      resetClientSecret: {
        id: undefined,
        clientSecret: '',
        confirmClientSecret: ''
      },
      // 重置客户端密钥添加修改表单规则
      resetClientSecretRules: {
        clientSecret: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入密钥'))
              } else {
                if (this.resetClientSecret.confirmClientSecret !== '') {
                  this.$refs.resetClientSecretRuleForm.validateField('confirmClientSecret')
                }
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        confirmClientSecret: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入密钥'))
              } else if (value !== this.resetClientSecret.clientSecret) {
                callback(new Error('两次输入密钥不一致!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    // 初始化加载表格数据
    this.reloadList()
  },
  methods: {
    /**
     * 初始化加载表格数据
     */
    reloadList () {
      list(this.buildParam()).then((response) => {
        this.clientTableData = response.data.records
        this.searchClientForm.size = response.data.size
        this.searchClientForm.current = response.data.current
        this.total = response.data.total
      })
    },
    /**
     * 构造查询条件
     *
     * @returns {{current: number, size: number, clientName: string, clientCode: string}}
     */
    buildParam () {
      return this.searchClientForm
    },
    /**
     * 分页大小切换
     *
     * @param size
     */
    handleSizeChange (size) {
      this.searchClientForm.size = size
      this.reloadList()
    },
    /**
     * 当前页切换
     *
     * @param current
     */
    handleCurrentChange (current) {
      this.searchClientForm.current = current
      this.reloadList()
    },
    /**
     * 查询按钮
     */
    search () {
      this.reloadList()
    },
    /**
     * 查询重置按钮
     */
    searchReset () {
      this.$refs.searchForm.resetFields()
    },
    /**
     * 客户端表格复选框事件
     *
     * @param val
     */
    clientHandleSelectionChange (val) {
      this.checkDeleteItem = !val.length
      this.multipleSelectionClientIds = val
    },
    /**
     * 批量删除
     */
    remove () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelectionClientIds.map((x) => ids.push(JSONBigInt.parse(x.id)))
        del(ids).then(response => {
          if (response.code === 1) {
            this.reloadList()
            this.$message.success('删除成功')
          }
        })
      })
    },
    /**
     * 删除行
     *
     * @param index
     * @param rows
     * @param row
     */
    removeItem (index, rows, row) {
      confirmAlert(() => {
        del([JSONBigInt.parse(row.id)]).then(response => {
          if (response.code === 1) {
            rows.splice(index, 1)
            this.reloadList()
            this.$message.success('删除成功')
          }
        })
      })
    },
    /**
     * 创建
     */
    create () {
      this.title = '创建客户端'
      this.dialogType = DIALOG_TYPE.ADD
      this.$nextTick(() => {
        this.clientDialogVisible = true
      })
    },
    /**
     * 修改
     * @param row
     */
    edit (row) {
      debugger
      this.title = '修改客户端'
      this.dialogType = DIALOG_TYPE.EDIT
      info(row.id).then((response) => {
        debugger
        if (response.code === 1) {
          this.$nextTick(() => {
            this.client = response.data
            this.clientDialogVisible = true
          })
        }
      })
    },
    /**
     * 详情
     *
     * @param row
     */
    info (row) {
      this.title = '查看信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.infoDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.client, row)
      })
    },
    /**
     * 关闭客户端添加修改弹出框事件
     *
     * @param formName
     */
    closeClientDialog (formName) {
      this.client.id = undefined
      this.client = this.clientInfo
    },
    /**
     * 关闭详情弹出框事件
     */
    closeInfoDialog () {
      this.client = this.clientInfo
    },
    /**
     * 添加修改弹出框提交
     *
     * @param formName
     */
    submitClientForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogType === DIALOG_TYPE.ADD ? this.save() : this.modify()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 保存请求
     */
    save () {
      this.client.id = undefined
      save(this.client).then((response) => {
        if (response.code === 1) {
          this.$message.success('添加成功')
          this.clientDialogVisible = false
          this.reloadList()
        }
      })
    },
    /**
     * 修改请求
     */
    modify () {
      this.client.clientSecret = ''
      modify(this.client).then((response) => {
        if (response.code === 1) {
          this.$message.success('修改成功')
          this.clientDialogVisible = false
          this.reloadList()
        }
      })
    },
    /**
     * 添加修改弹出框重置
     *
     * @param formName
     */
    resetClientForm (formName) {
      this.clientDialogVisible = false
      this.$refs[formName].resetFields()
    },
    /**
     * 重置密钥按钮事件
     *
     * @param row
     */
    handleResetClientSecret (row) {
      this.title = '重置密钥'
      this.resetClientSecretDialogVisible = true
      this.resetClientSecret.id = row.id
    },
    /**
     * 重置密钥弹出框重置
     *
     * @param formName
     */
    resetClientSecretForm (formName) {
      this.resetClientSecretDialogVisible = false
      this.$refs[formName].resetFields()
    },
    /**
     * 重置密码弹出框提交
     *
     * @param formName
     */
    submitRestClientSecretForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          resetClientSecret(this.resetClientSecret).then(response => {
            if (response.code === 1) {
              this.$message.success({ message: '重置成功' })
              this.resetClientSecretDialogVisible = false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 关闭客户端添加修改弹出框事件
     *
     * @param formName
     */
    closeRestClientSecretDialog (formName) {
      this.resetClientSecret.id = undefined
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
.card {
  padding: 10px;
  border: 1px solid #eee;
  margin-bottom: 2vh;
}
</style>
