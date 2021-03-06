/* eslint-disable */
import defaultSettings from "../../config/defaultSettings";
import config from "../../config/config"
import {message} from 'ant-design-vue'
let lessNodesAppended;
const updateTheme = primaryColor => {
  // Don't compile less in production!
  // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  // if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION !== "site") {
  //   return;
  // }
  // Determine if the component is remounted
  if (!primaryColor) {
    return;
  }
  const hideMessage = message.loading("正在编译主题！", 0);
  function buildIt() {
    if (!window.less) {
      return;
    }
    setTimeout(() => {
      window.less
        .modifyVars({
          "@primary-color": primaryColor
        })
        .then(() => {
          hideMessage();
        })
        .catch((err) => {
          console.error(err)
          message.error("Failed to update theme ");
          hideMessage();
        });
    }, 200);
  }
  if (!lessNodesAppended) {
    // insert less.js and color.less
    const lessStyleNode = document.createElement("link");
    const lessConfigNode = document.createElement("script");
    const lessScriptNode = document.createElement("script");
    lessStyleNode.setAttribute("rel", "stylesheet/less");
    lessStyleNode.setAttribute("href", config.publicPath+"color.less");
    lessConfigNode.innerHTML = `
      window.less = {
        async: true,
        env: 'production',
        javascriptEnabled: true
      };
    `;
    lessScriptNode.src =
      "https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js";
    lessScriptNode.async = true;
    lessScriptNode.onload = () => {
      buildIt();
      lessScriptNode.onload = null;
    };
    document.body.appendChild(lessStyleNode);
    document.body.appendChild(lessConfigNode);
    document.body.appendChild(lessScriptNode);
    lessNodesAppended = true;
  } else {
    buildIt();
  }
};

const updateColorWeak = colorWeak => {
    // const root = document.getElementById('root');
    // if (root) {
    //     root.className = colorWeak ? 'colorWeak' : '';
    // }
  document.body.className = colorWeak ? "colorWeak" : "";
};


const updateColorBlackWhite = colorBlackWhite => {
    // const root = document.getElementById('root');
    // if (root) {
    //     root.className = colorWeak ? 'colorWeak' : '';
    // }
    document.body.className = colorBlackWhite ? "colorBlackWhite" : "";
};
export default {
    namespaced: true,
  namespace: "setting",
  state: defaultSettings,
  mutations: {
    getSetting(state) {
      const setting = {};
      const urlParams = new URL(window.location.href);
      Object.keys(state).forEach(key => {
        if (urlParams.searchParams.has(key)) {
          const value = urlParams.searchParams.get(key);
          setting[key] = value === "1" ? true : value;
        }
      });
      const { primaryColor, colorWeak,colorBlackWhite } = setting;
      if (state.primaryColor !== primaryColor) {
        // updateTheme(primaryColor);
      }
      updateColorWeak(colorWeak);
        updateColorBlackWhite(colorBlackWhite);
     const   payload={
            ...state,
            ...setting
        }

        state.navTheme = payload.navTheme;
        state.primaryColor = payload.primaryColor;
        state.layout = payload.layout;
        state.contentWidth = payload.contentWidth;
        state.fixedHeader = payload.fixedHeader;
        state.autoHideHeader = payload.autoHideHeader;
        state.fixSiderbar = payload.fixSiderbar;
        state.colorWeak = payload.colorWeak;
        state.colorBlackWhite = payload.colorBlackWhite;
    },
    changeSetting(state, { payload }) {
      const urlParams = new URL(window.location.href);
      Object.keys(defaultSettings).forEach(key => {
        if (urlParams.searchParams.has(key)) {
          urlParams.searchParams.delete(key);
        }
      });
      Object.keys(payload).forEach(key => {
        if (key === "collapse") {
          return;
        }
        let value = payload[key];
        if (value === true) {
          value = 1;
        }
        if (defaultSettings[key] !== value) {
          urlParams.searchParams.set(key, value);
        }
      });
      const { primaryColor, colorWeak,colorBlackWhite, contentWidth } = payload;
      if (state.primaryColor !== primaryColor) {
        updateTheme(primaryColor);
      }
      if (state.contentWidth !== contentWidth && window.dispatchEvent) {
        window.dispatchEvent(new Event("resize"));
      }
      updateColorWeak(colorWeak);
      updateColorBlackWhite(colorBlackWhite);
      window.history.replaceState(null, "setting", urlParams.href);

      // state = { ...payload };
        state.navTheme = payload.navTheme;
        state.primaryColor = payload.primaryColor;
        state.layout = payload.layout;
        state.contentWidth = payload.contentWidth;
        state.fixedHeader = payload.fixedHeader;
        state.autoHideHeader = payload.autoHideHeader;
        state.fixSiderbar = payload.fixSiderbar;
        state.colorWeak = payload.colorWeak;
        state.colorBlackWhite = payload.colorBlackWhite;
    }
  }
};
/* eslint-enable */
