<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="showTitle" :visible.sync="showDialog" @close="btnCancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form label-width="120px" :model="formData" :rules="rules" ref="getfrom">
      <el-form-item label="部门名称" prop="name">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="formData.name"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="formData.code"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width: 80%"
          placeholder="请选择"
          @focus="getEmployeeSimple"
        >
          <!-- 需要循环生成选项   这里做一下简单的处理 显示的是用户名 存的也是用户名-->
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
          v-model="formData.introduce"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnok">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDepartments,
  editDepartments,
  updataDepartments,
} from "@/api/departments";
import { getEmployeeSimple } from "@/api/employees";
let defleter = {
  name: "", // 部门名称
  code: "", // 部门编码
  manager: "", // 部门管理者
  introduce: "", // 部门介绍
};
export default {
  name: "Adddept",
  props: {
    treeNode: {
      type: Object,
      default: null,
    },
  },
  data() {
    const checkNameRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments();
      let isRepeat = false;
      if (this.formData.id) {
        isRepeat = depts
          .filter(
            (item) =>
              item.pid === this.treeNode.pid && item.id !== this.formData.id
          )
          .some((item) => item.name === value);
      } else {
        isRepeat = depts
          .filter((item) => item.pid === this.treeNode.id)
          .some((item) => item.name === value);
      }

      isRepeat
        ? callback(new Error(`同级部门下已经有${value}的部门了`))
        : callback();
    };
    const checkcodeRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments();
      let isRepeat = false;
      if (this.formData.id) {
        isRepeat = depts.some(
          (item) => item.id !== this.formData.id && item.code === value && value
        );
      } else {
        isRepeat = depts.some((item) => item.code === value && value != "");
      }
      isRepeat
        ? callback(new Error(`组织架构中已经有部门使用${value}编码`))
        : callback();
    };
    return {
      showDialog: false,
      formData: { ...defleter },
      rules: {
        name: [
          { required: true, message: "用户名为必填项", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门名称要求1-50个字符",
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator: checkNameRepeat,
          },
        ],
        code: [
          { required: true, message: "部门编码为必填项", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门编码要求1-50个字符",
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator: checkcodeRepeat,
          },
        ],
        manager: [
          { required: true, message: "部门负责人不能为空", trigger: "blur" },
        ],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          {
            min: 1,
            max: 200,
            message: "部门介绍要求1-50个字符",
            trigger: "blur",
          },
        ],
      },
      peoples: [], // 接收获取的员工简单列表的数据
    };
  },
  computed: {
    showTitle() {
      return this.formData.id ? "编辑部门" : "新增子部门";
    },
  },
  methods: {
    // 获取员工简单列表数据
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple();
    },
    async editDepartments(id) {
      this.formData = await editDepartments(id);
    },
    async btnok() {
      // 1.校验数据
      this.$refs.getfrom.validate();
      try {
        if (this.formData.id) {
          await updataDepartments(this.formData);
        } else {
          // 发送请求
          await addDepartments({
            // 响应处理
            ...this.formData,
            pid: this.treeNode.id,
          });
        }

        // console.log(data,11);
        // 更新列表
        this.$emit("updatafrom");
        this.$refs.getfrom.resetFields();
        // 关闭弹框
        this.showDialog = false;
      } catch (err) {
        console.log(err);
      }
    },
    btnCancel() {
      this.$refs.getfrom.resetFields(); // 重置校验字段
      this.formData = { ...defleter };
      this.showDialog = false; // 关闭
    },
  },
};
</script>

<style>
</style>
