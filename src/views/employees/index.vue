<template>
  <div class="dashboard-container">
    <!-- 表头公共组件 -->
    <PageTools :showBefore="true">
      <template #before>
        <span>共{{ page.total }}记录</span>
      </template>
      <template #after>
        <el-button size="small" type="warning" @click="$router.push('/import')"
          >导入</el-button
        >
        <el-button size="small" type="danger" @click="exportData"
          >导出</el-button
        >
        <el-button
          size="small"
          type="primary"
          @click="$refs.loyee.showDialog = true"
          >新增员工</el-button
        >
      </template>
    </PageTools>
    <!-- 放置表格和分页 -->
    <el-card>
      <el-table border :data="list">
        <el-table-column label="序号" sortable="" type="index" />
        <el-table-column label="姓名" sortable="" prop="username" />
        <el-table-column label="工号" sortable="" prop="workNumber" />
        <el-table-column
          label="聘用形式"
          sortable=""
          :formatter="formatEmployment"
          prop="formOfEmployment"
        />
        <el-table-column label="部门" sortable="" prop="departmentName" />
        <el-table-column label="入职时间" sortable="">
          <template slot-scope="{ row }">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" sortable="" prop="enableState">
          <template slot-scope="{ row }">
            <el-switch
              :value="row.enableState === 1"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${ row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="delEmployee(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.page"
          :page-sizes="[1, 2, 3, 4]"
          :page-size="page.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
          background
        />
      </el-row>
    </el-card>
    <!-- 弹出框组件 -->
    <Addemployee ref="loyee" @updatelist="getEmployeeList"> </Addemployee>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getEmployeeList, delEmployee } from "@/api/employees";
import EmployeeEnum from "@/api/constant/employees";
import Addemployee from "./components/add-employee.vue";
import {formatDate} from '@/filters/index'
export default {
  name: "Dashboard",
  data() {
    return {
      loading: false,
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 4,
        total: 0, // 总数
      },
    };
  },
  components: {
    Addemployee,
  },
  computed: {
    ...mapGetters(["name"]),
  },
  created() {
    this.getEmployeeList();
  },
  methods: {
    async getEmployeeList() {
      this.loading = true;
      const { total, rows } = await getEmployeeList(this.page);
      this.page.total = total;
      this.list = rows;
      this.loading = false;
    },
    handleSizeChange(val) {
      this.page.size = val;
      this.getEmployeeList();
    },
    handleCurrentChange(val) {
      this.page.page = val;
      this.getEmployeeList();
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find(
        (item) => item.id === cellValue * 1
      );
      return obj ? obj.value : "未知";
    },
    async delEmployee(id) {
      try {
        await this.$confirm("确定删除么？");
        await delEmployee(id);
        // 如果不是第一页，且只有一个元素，删除成功，则需要把页码-1，重新拉取列表
        if (this.list.length === 1 && this.page.page !== 1) {
          this.page.page--;
        }
        this.$message.success("删除成功");
        this.getEmployeeList();
      } catch (err) {
        console.log(err);
      }
    },
    exportData() {
      const headers = {
        '姓名': "username",
        '手机号': "mobile",
        '入职日期': "timeOfEntry",
        '聘用形式': "formOfEmployment",
        '转正日期': "correctionTime",
        '工号': "workNumber",
        '部门': "departmentName",
      };

      import("@/vendor/Export2Excel").then(async (excel) => {
        const { rows } = await getEmployeeList({
          page: 1,
          size: this.page.total,
        });
        const data = this.formatJson(headers, rows);
        const multiHeader=[['姓名','信息','','','','','部门']]
const merges=['A1:A2','B1:F1','G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers), //表头
          data, //表格数据
          filename: "员工信息表", //文件名称
          bookType: "xlsx", //文件类型
          // autoWidth: true, //是否自适应
          multiHeader,
          merges
        });
      });
    },
    formatJson(headers, rows) {
      // item是对象  => 转化成只有值的数组 => 数组值的顺序依1赖headers  {username: '张三'  }
      return rows.map((item) => {
        // Object.keys(headers)  => ["姓名", "手机号",...]
        return Object.keys(headers).map((key) => {
          if (
            headers[key] === "timeOfEntry" ||
            headers[key] === "correctionTime"
          ) {
            return formatDate(item[headers[key]]); // 返回格式化之前的时间
          } else if (headers[key] === "formOfEmployment") {
            var en = EmployeeEnum.hireType.find(
              (obj) => obj.id === item[headers[key]]
            );
            return en ? en.value : "未知";
          }
          // /  得到 ['张三'，’129‘，’dd‘,'dd']
          return item[headers[key]];
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>

