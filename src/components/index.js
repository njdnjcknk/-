import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import Print from 'vue-print-nb'
import ScreenFull from './ScreenFull'
import lang from './lang'
import TagsView from './TagsView'



export default {
    install(vue)  {
        vue.component("PageTools", PageTools)
        vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
        vue.component('ImageUpload',ImageUpload)
        vue.use(Print);
        vue.component('ScreenFull', ScreenFull) // 注册全屏组件
        vue.component('lang', lang)
        vue.component('TagsView', TagsView)
    }
}