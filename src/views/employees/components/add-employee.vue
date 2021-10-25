<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btncancel">
    <!-- 表单 -->
    <el-form label-width="120px" :model="list" :rules="rules" ref="getform">
      <el-form-item label="姓名" prop="username">
        <el-input
          style="width: 50%"
          placeholder="请输入姓名"
          v-model="list.username"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          style="width: 50%"
          placeholder="请输入手机号"
          v-model="list.mobile"
        />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          style="width: 50%"
          placeholder="请选择入职时间"
          v-model="list.timeOfEntry"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          style="width: 50%"
          placeholder="请选择"
          v-model="list.formOfEmployment"
        >
          <!-- 遍历只能遍历组件的数据 -->
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          style="width: 50%"
          placeholder="请输入工号"
          v-model="list.workNumber"
        />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          style="width: 50%"
          placeholder="请选择部门"
          v-model="list.departmentName"
          @focus="getDepartments"
        />
        <el-tree
          :data="fromdata"
          :props="{ label: 'name' }"
          default-expand-all="true"
          v-if="showTree"
          v-loading="loading"
          @node-click="selectNode"
        ></el-tree>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          style="width: 50%"
          placeholder="请选择转正时间"
          v-model="list.correctionTime"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btncancel">取消</el-button>
          <el-button type="primary" size="small" @click="addok">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from "@/api/departments";
import { tranListToTreeData } from "@/utils/index";
import EmployeeEnum from "@/api/constant/employees";
import { addEmployee } from "@/api/employees";

export default {
  data() {
    return {
      EmployeeEnum,
      showDialog: false,
      list: {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      },

      rules: {
        username: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" },
          {
            min: 1,
            max: 4,
            message: "用户姓名为1-4位",
          },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        formOfEmployment: [
          { required: true, message: "聘用形式不能为空", trigger: "blur" },
        ],
        workNumber: [
          { required: true, message: "工号不能为空", trigger: "blur" },
        ],
        departmentName: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        timeOfEntry: [{ required: true, message: "入职时间", trigger: "blur" }],
      },
      fromdata: [],
      showTree: false, // 控制树形的显示或者隐藏
      loading: false, // 控制树的显示或者隐藏进度条
    };
  },
  methods: {
    async getDepartments() {
      this.showTree = true;
      this.loading = true;
      const { depts } = await getDepartments();
      this.fromdata = tranListToTreeData(depts, "");
      this.loading = false;
    },
    selectNode(node) {
      this.list.departmentName = node.name;
      this.showTree = false;
    },
    async addok() {
      try {
        await this.$refs.getform.validate();
        await addEmployee(this.list);
        // this.$emit("updatelist");
        this.$parent.getEmployeeList();
        this.showDialog = false;
        this.$refs.getform.resetFields();
        this.$message.success("操作成功");
      } catch (err) {
        console.log(err);
      }
    },
    btncancel() {
      (this.list = {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      }),
        (this.showDialog = false),
        this.$refs.getform.resetFields();
    },
  },
};
</script>

<style>
</style>