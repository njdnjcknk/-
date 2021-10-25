import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
export default {
    install(vue)  {
        vue.component("PageTools", PageTools)
        vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
        vue.component('ImageUpload',ImageUpload)
    }
}