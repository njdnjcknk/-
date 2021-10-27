<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form
              label-width="120px"
              style="margin-left: 120px; margin-top: 30px"
              :model="userInfo"
              ref="detail"
              :rules="rules"
            >
              <el-form-item label="姓名:" prop="username">
                <el-input style="width: 300px" v-model="userInfo.username" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input
                  style="width: 300px"
                  type="password2"
                  v-model="userInfo.password2"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updatauser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userid}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <component :is="usercomponents" />
          </el-tab-pane>
          <el-tab-pane label="岗位详情">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employees/print/${userid}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- 放置岗位详情 -->
            <component :is="JobInfo" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from "@/api/user";
import { saveUserDetailById } from "@/api/employees";
import UserInfo from "./components/user-info.vue";
import JobInfo from "./components/job-info"; // 导入
export default {
  name: "detail",
  components: {
    UserInfo,
    JobInfo,
  },
  data() {
    return {
      usercomponents: "UserInfo",
      JobInfo: "JobInfo",
      userInfo: {
        username: "",
        password2: "",
      },
      rules: {
        username: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
        password2: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 9, message: "密码长度6-9位", trigger: "blur" },
        ],
      },
      userid: this.$route.params.id,
    };
  },
  created() {
    this.getUserDetailById();
  },
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userid);
    },
    async updatauser() {
      try {
        await this.$refs.detail.validate();
        await saveUserDetailById({
          ...this.userInfo,
          password: this.userInfo.password2,
        });
        this.$message.success("更新成功");
        this.$router.back();
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style>
</style>