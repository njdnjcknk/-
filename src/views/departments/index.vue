<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 实现页面的基本布局 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <Treetool :treeNode="company" :is-root="true" @addfn="add" />
        <!-- 下面就是树形控件内容了 -->
        <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope='obj' 接收传递给插槽的数据   data 每个节点的数据对象-->
          <Treetool
            slot-scope="{ data }"
            :treeNode="data"
            @updata="getDepartments"
            @addfn="add"
            @edit="edit"
          />
        </el-tree>
      </el-card>
    </div>
    <!-- 新增弹层 -->
    <Adddept ref="onec" :treeNode="node" @updatafrom="getDepartments" />
  </div>
</template>

<script>
import Treetool from "./components/tree-tools.vue";
import Adddept from "./components/add-dept.vue";
import { getDepartments } from "@/api/departments";
import { tranListToTreeData } from "@/utils/index";
export default {
  name: "Departments",
  components: {
    Treetool,
    Adddept,
  },
  data() {
    return {
      node: null,
      showDialog: false,
      company: {},
      defaultProps: {
        label: "name",
      },
      departs: [],
    };
  },
  created() {
    this.getDepartments();
  },
  methods: {
    async getDepartments() {
      const item = await getDepartments();
      this.company = { name: item.companyName, manager: "负责人", id: "" };
      this.departs = tranListToTreeData(item.depts, "");
    },
    add(node) {
      this.node = node;
      this.$refs.onec.showDialog = true;
    },
    edit(node) {
      this.node = node;
      this.$refs.onec.showDialog = true;
      this.$refs.onec.editDepartments(node.id);
    },
  },
};
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
