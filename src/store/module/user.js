/* eslint-disable */
import {fakeAccountLogin} from '@/services/login'
import {queryCurrent} from '@/services/user'
import { getPageQuery } from '@/utils/utils';
import router from "../../router"
import { stringify } from 'querystring';
export default {
  namespaced: true,
  namespace: "user",
  state: {
      currentUser:{

      },
  },
  mutations: {
      saveCurrentUser(state,currentUser){
          state.currentUser=currentUser
      },
      changeNotifyCount(state ,action){
          const currentUser={...state.currentUser}
          currentUser.notifyCount=action.payload.totalCount;
          currentUser.unreadCount=action.payload.unreadCount;
          state.currentUser= currentUser
      },
  },
  actions: {
      login({ commit }, { userName, password, captcha, type }) {
      return new Promise((resolve, reject) => {
        fakeAccountLogin({
            userName,
            password,
            captcha,
            type
        }).then(res => {
            if (res.status === 'ok') {
                const urlParams = new URL(window.location.href);
                const params = getPageQuery();
                let { redirect } = params;
                if (redirect) {
                    const redirectUrlParams = new URL(redirect);
                    if (redirectUrlParams.origin === urlParams.origin) {
                        redirect = redirect.substr(urlParams.origin.length);
                        if (redirect.match(/^\/.*#/)) {
                            redirect = redirect.substr(redirect.indexOf('#') + 1);
                        }
                    } else {
                        window.location.href = '/';
                        return;
                    }
                }
                router.replace(redirect || '/')
                // history.replace(redirect || '/');
            }
            // commit('setToken', data.result)
            resolve(res)
        }).catch(err => {
            reject(err)
        })
      });
    },
      fetchCurrent({ commit }){
        return new Promise(((resolve, reject) => {
            queryCurrent().then(res=>{
                commit('saveCurrentUser', res)
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        }))
      },

      logout() {
          const { redirect } = getPageQuery();
          // Note: There may be security issues, please note
          if (window.location.pathname !== '/user/login' && !redirect) {
              // router.replace({
              //     pathname: '/user/login',
              //     search: stringify({
              //         redirect: window.location.href,
              //     }),
              // });
          }
      },
  }
};
/* eslint-enable */
