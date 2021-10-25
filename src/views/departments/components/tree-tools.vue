<template>
  <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
  <!-- 作用域插槽 slot-scope='obj' 接收传递给插槽的数据   data 每个节点的数据对象-->
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="width: 100%; height: 40px"
  >
    <!-- 左侧内容 -->
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <!-- 右侧内容 -->
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 放置下拉菜单 -->
          <el-dropdown>
            <!-- 内容 -->
            <span>操作 <i class="el-icon-arrow-down" /> </span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="add"
                >添加子部门</el-dropdown-item
              >
              <el-dropdown-item @click.native="edit" v-if="!isRoot"
                >编辑部门</el-dropdown-item
              >
              <el-dropdown-item @click.native="del" v-if="!isRoot"
                >删除部门</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from "@/api/departments";
export default {
  // props可以用数组来接收数据 也可以用对象来接收
  // props: {   props属性: {  配置选项 }  }
  props: {
    //   定义一个props属性
    treeNode: {
      type: Object, // 对象类型
      required: true, // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    //添加部门
    add() {
      console.log(1111);
      this.$emit('addfn',this.treeNode)
    },
    // 修改部门
    edit() {
      this.$emit('edit',this.treeNode)
    },
    // 删除部门
    async del() {
      try {
        await this.$confirm("确定删除么");
        console.log(1111);
     await delDepartments(this.treeNode.id);
        this.$message.success("删除成功");
        this.$emit("updata");
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style>
</style>