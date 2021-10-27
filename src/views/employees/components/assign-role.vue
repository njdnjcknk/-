<template>
  <el-dialog
    title="分配角色"
    :visible="showRoleDialog"       
    @close="btncancel"
  >
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="chacklist">
      <!-- 选项 -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">{{
        item.name
      }}</el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="5">
        <el-button type="primary" size="small" @click="btnok">确定</el-button>
        <el-button size="small" @click="btncancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList, assignRoles } from "@/api/setting";
import { getUserDetailById } from "@/api/user";
export default {
  data() {
    return {
      showRoleDialog: false, //弹框关闭隐藏
      list: [], //所有的角色数组
      chacklist: [], //现有的角色数组
    };
  },
  props: {
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null,
    },
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 });
      this.list = rows;
    },
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id);
      this.chacklist = roleIds; // 赋值本用户的角色
    },
    async btnok() {
      await assignRoles({ id: this.userId, roleIds: this.chacklist });
      this.$message.success("设置成功");
      this.showRoleDialog = false;
    },
    btncancel() {
      this.chacklist = [];
      this.showRoleDialog = false;
    },
  },
};
</script>