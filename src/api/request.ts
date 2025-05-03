import type { RequestOptions } from "@/types/request";
import { TokenUtil, UserUtil } from "@/utils/auth";

// 基础配置
// export const BASE_URL = "https://customer-dev.focuson.cc"; //测试环境
// export const BASE_URL = "https://driving-dassie-clean.ngrok-free.app"; //测试环境
export const BASE_URL = "https://customer.focuson.cc"; //生产环境

const TIMEOUT = 60000;

// 请求拦截器
const requestInterceptor = (config: RequestOptions) => {
  // 获取token
  const token = TokenUtil.getToken();

  // 设置基础header
  config.header = {
    "Content-Type": "application/json;charset=UTF-8",
    ...config.header
  };

  // 添加token到header
  if (token) {
    config.header = {
      ...config.header,
      Authentication: token
    };
  }

  return config;
};

// 响应拦截器
const responseInterceptor = (response: any) => {
  const { statusCode, data } = response;

  // 请求成功
  if (statusCode >= 200 && statusCode < 300) {
    return Promise.resolve(data);
  }

  // 处理错误情况
  switch (statusCode) {
    case 401:
      // token失效，清除token并跳转登录页
      TokenUtil.removeToken();
      UserUtil.removeUserInfo();
      uni.reLaunch({ url: "/pages/login/index" });
      break;
    case 403:
      uni.showToast({ title: "没有权限访问", icon: "none" });
      break;
    case 404:
      uni.showToast({ title: "请求的资源不存在", icon: "none" });
      break;
    default:
      uni.showToast({ title: "服务器异常", icon: "none" });
  }

  return Promise.reject(response);
};

// 请求错误处理
const handleRequestError = (error: any) => {
  if (error.errno === 600001 || error.errMsg?.includes("network change")) {
    uni.showToast({
      title: "网络连接已更改，请检查网络后重试",
      icon: "none"
    });
  } else if (error.errMsg?.includes("timeout")) {
    uni.showToast({
      title: "请求超时，请重试",
      icon: "none"
    });
  } else {
    uni.showToast({
      title: "网络请求失败",
      icon: "none"
    });
  }
};

// 请求函数
const request = <T = any>(options: RequestOptions): Promise<T> => {
  // 合并配置
  const config = {
    timeout: TIMEOUT,
    ...options,
    url: `${BASE_URL}${options.url}`
  };

  // 请求拦截
  const interceptedConfig = requestInterceptor(config);

  return new Promise((resolve, reject) => {
    uni.request({
      ...interceptedConfig,
      success: (res: any) => {
        // 响应拦截
        if (res.data.code === 1) {
          uni.showToast({ title: "登录已过期,请重新登录", icon: "none" });
          uni.clearStorage();
          setTimeout(() => {
            uni.reLaunch({ url: "/pages/login/index" });
          }, 1000);
          return;
        }
        responseInterceptor(res)
          .then(data => resolve(data))
          .catch(err => reject(err));
      },
      fail: err => {
        console.log("网络错误断点", err);
        handleRequestError(err);
        reject(err);
      }
    });
  });
};

// 导出请求方法
export const requestApi = {
  get: <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) => {
    return request<T>({
      url,
      data,
      method: "GET",
      ...options
    });
  },

  post: <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) => {
    return request<T>({
      url,
      data,
      method: "POST",
      ...options
    });
  },

  put: <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) => {
    return request<T>({
      url,
      data,
      method: "PUT",
      ...options
    });
  },

  delete: <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) => {
    return request<T>({
      url,
      data,
      method: "DELETE",
      ...options
    });
  }
};
