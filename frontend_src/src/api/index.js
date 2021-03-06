//import axios from "axios";
import Vue from 'vue'
import '@/plugins/axios'
import store from '../store'
import * as cookie from '@/utils/cookie'
import '@/plugins/iview.js'

//export const api_map = store.state.model_api_map
//菜单后端链接映射
/*export const api_map = {
    menu_model:{
        label:'菜单模型(auth_menu)',
        main_action: 'get_menu_tree',
        component: 'template/list/tree',
        actions:{
            get_nav_menu: { label:'获取导航菜单', path:'/menu' },  //获取导航菜单
            get_menu_tree: { label:'获取菜单列表', path:'/menu/tree' }, //获取菜单列表
            save_node: { label:'保存菜单节点', path:'/menu/save' }, //保存菜单节点
            del_node: { label:'删除菜单节点', path:'/menu/del' }, //删除菜单节点
            get_format_tree: { label:'获取格式化下拉菜单', path:'/menu/format' } //获取格式化菜单
        }

    }

}*/


export function getUrl(model_name,action_name) {
    //console.log(axios.config.baseURL)
   // let baseUrl = process.env.VUE_APP_API
  //  let baseUrl = 'http://www.vuecmf.com/api'
  //  let api_map = store.state.model_api_map

 //   return  api_map[model_name]['actions'][action_name].path
    let baseUrl = process.env.VUE_APP_API

    let api_map = store.state.model_api_map

    if(api_map[model_name] == undefined){
        return axios.get('/auth_model/getModelApiMap').then(function(res){
            store.dispatch('setModelApiMap', res.data)
            api_map = res.data
            return baseUrl + api_map[model_name]['actions'][action_name].path  + '?token=' + cookie.get('token')
        })
    }else{
        return  baseUrl + api_map[model_name]['actions'][action_name].path  + '?token=' + cookie.get('token')
    }


}


//公共后端请求API
export function request(model_name,action_name,method,data){
    let api_map = store.state.model_api_map
    if(api_map[model_name] == undefined || api_map[model_name]['actions'] == undefined || api_map[model_name]['actions'][action_name] == undefined){
        return axios.get('/auth_model/getModelApiMap').then(function(res){
            if(res.code == 0){
                store.dispatch('setModelApiMap', res.data)
                api_map = res.data

                if(typeof api_map[model_name]['actions'][action_name] == "undefined"){
                    return { code: 500, msg:'对不起，您没有此操作权限！' }
                }else{
                    return axios({
                        method: method,
                        url: api_map[model_name]['actions'][action_name].path + '?token=' + cookie.get('token'),
                        data: data
                    });
                }

            }else if(res.code == 1000){
                cookie.remove('token');
                cookie.remove('user');
                cookie.remove('server');
                //location.reload();
            }else{
                return res;
            }


        })
    }else{
        if(typeof api_map[model_name]['actions'][action_name] == "undefined"){
            return { code: 500, msg:'对不起，您没有此操作权限！' }
        }else {
            return axios({
                method: method,
                url: api_map[model_name]['actions'][action_name].path + '?token=' + cookie.get('token'),
                data: data
            });
        }
    }

}


