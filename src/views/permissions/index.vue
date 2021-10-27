<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission('0', 1)"
            >添加权限</el-button
          >
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table :data="list" border="" row-key="id">
        <el-table-column label="名称" prop="name" />
        <el-table-column label="标识" prop="code" />
        <el-table-column label="描述" prop="description" />
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button @click="addPermission(row.id, 2)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="delPermission(row)"> 删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 确定取消权限弹框 -->
    <el-dialog
      :title="formData.id ? '编辑权限':'添加权限'"
      :visible.sync="showDialog"
      width="30%"
      @close="btncancel"
    >
      <!-- 表单 -->
      <el-form
        ref="perForm"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width: 90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="btncancel">取消</el-button>
        <el-button type="primary" @click="btnok">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPermissionList,
  addPermission,
  updatePermission,
  delPermission,
  getPermissionDetail,
} from "@/api/permissons";
import { tranListToTreeData } from "@/utils";
export default {
  name: "Permissions",
  data() {
    return {
      list: [], //权限列表
      showDialog: false,
      formData: {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 1是菜单，2是按钮
        pid: "", // 父节点的id
        enVisible: "0", // 开启
      },
      rules: {
        name: [
          { required: true, message: "权限名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "权限标识不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getPermissionList();
  },
  methods: {
    async getPermissionList() {
      this.list = tranListToTreeData(await getPermissionList(), "0");
    },
    addPermission(pid, type) {
      this.formData.pid = pid;
      this.formData.type = type;
      this.showDialog = true;
    },
    btncancel() {
      this.formData = {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 1是菜单，2是按钮
        pid: "", // 父节点的id
        enVisible: "0", // 开启
      };
      this.showDialog = false;
    },
    async btnok() {
      try {
        await this.$refs.perForm.validate();
        if (this.formData.id) {
          //编辑
          await updatePermission(this.formData);
        } else {
          //  添加
          await addPermission(this.formData);
        }
        this.$message.success("操作成功");
        this.getPermissionList();
        this.showDialog=false
      } catch (error) {
        console.log(error);
      }
    },
    async editPermission(id) {
      console.log(id);
      this.formData = await getPermissionDetail(id);
      this.showDialog = true;
    },
    async delPermission(row) {
      if (row.children) {
        this.$message.warning("不允许此操作");
      } else {
        await this.$confirm("确定删除么？");
        await delPermission(row.id);
        this.getPermissionList();
      }
    },
  },
};
</script>

<style>
</style>
