<template>
  <div>
    <el-upload
      list-type="picture-card"
      action="#"
      :limit="1"
      :on-preview="updatafile"
      :file-list="filelist"
      :class="{ disabled: fileComputed }"
      :on-remove="handremove"
      :on-change="changefile"
      :before-upload="beforeupload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 进度条 -->
    <el-progress
      v-if="showPercent"
      style="width: 180px"
      :percentage="percent"
    />
    <!-- 预览图片 -->
    <el-dialog :visible.sync="dialogVisible">
      <img :src="dialogImageUrl" style="width: 100%" />
    </el-dialog>
  </div>
</template>
<script>
import COS from "cos-js-sdk-v5";
const cos = new COS({
  SecretId: "AKIDQfdKmxrUrypOgoIWTAaiZATVGkxtYw4v", // 身份识别 ID
  SecretKey: "dz4sPfeMnwoPjmX2GDtIRKwINBhwvd4D", // 身份密钥
});
export default {
  name: "ImageUpload",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      filelist: [],
      currentFileUid: null,
      percent: 0,
      showPercent: false, // 默认不显示进度条
    };
  },
  computed: {
    fileComputed() {
      return this.filelist.length === 1;
    },
  },
  methods: {
    updatafile(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handremove(file, fileList) {
      //   this.filelist = file;
      this.filelist = this.filelist.filter((item) => item.uid !== file.uid);
    },
    //修改文件时触发[文件上传，上传失败，上传成功]
    changefile(file, fileList) {
      this.filelist = fileList.map((item) => item);
    },
    beforeupload(file) {
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ["image/jpeg", "image/gif", "image/bmp", "image/png"];
      if (!types.some((item) => item === file.type)) {
        this.$message.error("上传图片只能是 JPG、GIF、BMP、PNG 格式!");
        return false;
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024;
      if (maxSize < file.size) {
        this.$message.error("图片大小最大不能超过5M");
        return false;
      }
      //   已经确定当前上传的就是当前的这个file了
      this.currentFileUid = file.uid; // 【新增】
      this.showPercent=true//开启进度条
      return true;
    },
    // 自定义上传动作 有个参数 有个file对象，是我们需要上传到腾讯云服务器的内容
    upload(params) {
      //   console.log(params.file)
      if (params.file) {
        // 执行上传操作
        cos.putObject(
          {
            Bucket: "zhouzhou-1307934817", // 存储桶
            Region: "ap-nanjing", // 地域
            Key: params.file.name, // 文件名
            Body: params.file, // 要上传的文件对象
            StorageClass: "STANDARD", // 上传的模式类型 直接默认 标准模式即可
            // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
            // 进度条
            onProgress: (params) => {
              this.percent = params.percent * 100;
            },
          },
          (err, data) => {
            // data返回数据之后 应该如何处理
            console.log(err || data);
            if (!err && data.statusCode === 200) {
              //   此时说明文件上传成功  要获取成功的返回地址
              // fileList才能显示到上传组件上 此时我们要将fileList中的数据的url地址变成 现在上传成功的地址
              // 目前虽然是一张图片 但是请注意 我们的fileList是一个数组
              // 需要知道当前上传成功的是哪一张图片
              this.filelist = this.filelist.map((item) => {
                // 去找谁的uid等于刚刚记录下来的id
                if (item.uid === this.currentFileUid) {
                  // 将成功的地址赋值给原来的url属性
                  return { url: "http://" + data.Location, upload: true };
                  // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                  // 保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去保存
                }
                return item;
              });
              setTimeout(() => {
                this.showPercent = false; // 隐藏进度条
                this.percent = 0; // 进度归0
              }, 2000);
            }
          }
        );
      }
    },
  },
};
</script>

<style >
.disabled .el-upload--picture-card {
  display: none;
}
</style>