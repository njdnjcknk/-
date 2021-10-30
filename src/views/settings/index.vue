<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height: 60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
                >新增角色</el-button
              >
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column label="序号" width="120" type="index" />
              <el-table-column label="角色名称" width="240" prop="name" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template slot-scope="{ row }">
                  <el-button
                    size="small"
                    type="success"
                    @click="assignPerm(row.id)"
                    >分配权限</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    @click="btnrules(row.id)"
                    >编辑</el-button
                  >
                  <el-button
                    size="small"
                    type="danger"
                    @click="delfromitem(row.id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <!-- 分页组件 -->
              <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                :page-size="page.pagesize"
                :current-page="page.page"
                :total="page.total"
                :page-sizes="[2, 4, 6]"
                @current-change="handleSizeChange"
                @size-change="handleSizeChange"
                background
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="formData.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                  v-model="formData.remarks"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 准备编辑弹层 -->
    <el-dialog title="编辑弹层" :visible="showDialog" @close="btnCancel">
      <el-form
        label-width="120px"
        :model="formRelse"
        :rules="rules"
        ref="fromref"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formRelse.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="formRelse.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnsure"
            >确定</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 角色分配权限弹框 -->
    <el-dialog
      title="权限分配"
      :visible="showPermDialog"
      width="40%"
      @close="btnpermCancel"
    >
      <!-- 权限是一颗树 -->
      <!-- 将数据绑定到组件上 -->
      <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
      <!-- id作为唯一标识 -->
      <el-tree
        :data="lists"
        :props="defaultProps"
        :default-expand-all="true"
        :show-checkbox="true"
        :check-strictly="true"
        :default-checked-keys="selectCheck"
        node-key="id"
        ref="perm"
      />
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnpermok"
            >确定</el-button
          >
          <el-button size="small" @click="btnpermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  getRoleDetail,
  updateRole,
  addRole,
  assignPerm,
} from "@/api/setting";
import { tranListToTreeData } from "@/utils";
import { getPermissionList } from "@/api/permissons";
import { mapGetters } from "vuex";
export default {
  name: "settings",
  data() {
    return {
      list: [],
      page: {
        page: 1,
        pagesize: 2,
        total: 0,
      },
      formData: {}, //角色管理变量
      showDialog: false,
      formRelse: {}, //编辑功能变量
      rules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
      },
      showPermDialog: false, // 控制分配权限弹层的显示后者隐藏
      lists: [], //树形结构的数据绑定给data属性
      defaultProps: {
        label: "name", //lable属性对应的关键字就是标题内容
      },
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null, // 用来记录分配角色的id
    };
  },
  created() {
    this.getRoleList();
    this.getCompanyInfo();
  },
  computed: {
    ...mapGetters(["companyId"]),
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page);
      console.log(total, rows);
      this.page.total = total;
      this.list = rows;
    },
    handleSizeChange(val) {
      this.page.page = val;
      this.getRoleList();
    },
    handleCurrentChange(val) {
      this.page.pagesize = val;
      this.getRoleList();
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId);
    },
    async delfromitem(id) {
      try {
        await this.$confirm("确定删除么");
        await deleteRole(id);
        if (this.list.length === 1 && this.page.page !== 1) {
          this.page.page--;
        }
        this.getRoleList();
        this.$message.success("删除角色成功");
      } catch (err) {
        this.$message.success(err);
      }
    },
    async btnrules(id) {
      this.formRelse = await getRoleDetail(id);
      this.showDialog = true;
    },
    async btnsure() {
      try {
        await this.$refs.fromref.validate();
        if (this.formRelse.id) {
          await updateRole(this.formRelse);
        } else {
          // 新增
          await addRole(this.formRelse);
        }
        // 重新拉取数据
        this.getRoleList();
        this.$message.success("操作成功");
        this.showDialog = false;
      } catch (err) {
        console.log(err);
      }
    },
    btnCancel() {
      this.formRelse = {
        name: "",
        description: "",
      };
      // 移除校验
      this.$refs.fromref.resetFields();
      this.showDialog = false;
    },
    async assignPerm(id) {
      this.showPermDialog = true;
      //所有的权限信息
      this.lists = tranListToTreeData(await getPermissionList(), "0");
      this.roleId = id;
      // 应该去获取 这个id的 权限点
      // 有id 就可以 id应该先记录下来
      //当前用户的权限信息
      const { permIds } = await getRoleDetail(id);
      this.selectCheck = permIds; // 将当前角色所拥有的权限id赋值
    },
    async btnpermok() {
      await assignPerm({
        permIds: this.$refs.perm.getCheckedKeys(),//因为tree结构modelvivw视图互不关联所以传递数据不能直接拿定义好的数据交
        id: this.roleId,
      });
      this.$message.success("分配权限成功");
      this.showPermDialog=false
    },
    btnpermCancel() {
      this.roleId=null
      this.selectCheck = [];
      this.showPermDialog = false;
    },
  },
};
</script>

<style>
</style>
