import type { DataPermissionType, FilterData, OrganizationInfo, UserInfo } from "@/types/user";
import type { ProjectInfo } from "@/types/user";
import emitter from "./eventBus";

const TOKEN_KEY = "case_scene_token";
const USER_INFO_KEY = "case_scene_userInfo";
const PROJECT_INFO_KEY = "case_scene_projectInfo";
const FILTER_DATA_KEY = "case_scene_filterData";
const ORGANIZATION_INFO_KEY = "case_scene_organizationInfo";
const PROJECT_TREE_KEY = "case_scene_projectTree";
const QUANTITY_TAB_INDEX_KEY = "case_scene_quantityTabIndex";
/**
 * Token管理工具类
 */
export const TokenUtil = {
  /**
   * 获取token
   */
  getToken(): string {
    return uni.getStorageSync(TOKEN_KEY) || "";
  },

  /**
   * 设置token
   * @param token token字符串
   */
  setToken(token: string): void {
    uni.setStorageSync(TOKEN_KEY, token);
  },

  /**
   * 删除token
   */
  removeToken(): void {
    uni.removeStorageSync(TOKEN_KEY);
  },

  /**
   * 判断是否有token
   */
  hasToken(): boolean {
    return !!this.getToken();
  }
};

/**
 * 储存用户信息
 */
export const UserUtil = {
  /**
   * 获取用户信息
   */
  getUserInfo(): UserInfo {
    return uni.getStorageSync(USER_INFO_KEY) || {};
  },

  /**
   * 设置用户信息
   */
  setUserInfo(userInfo: UserInfo): void {
    uni.setStorageSync(USER_INFO_KEY, userInfo);
  },

  /**
   * 删除用户信息
   */
  removeUserInfo(): void {
    uni.removeStorageSync(USER_INFO_KEY);
  },

  /**
   * 判断是否有用户信息
   */
  hasUserInfo(): boolean {
    return !!this.getUserInfo();
  },

  /**
   * 获取用户数据权限类型
   * ALL("全项目", null),
    MANAGER("分管项目 ceo", null),
    PROJECT("本项目"项目经理, CustomerReportChannel.SELF_SALE),
    SELF("自己"置业顾问,CustomerReportChannel.SELF_SALE),
    NATIONAL_MARKETING("全民营销",CustomerReportChannel.NATIONAL_MARKETING),
    CHANNEL_KING("渠道王",CustomerReportChannel.CHANNEL),
   */
  getDataPermissionType(): DataPermissionType {
    return this.getUserInfo().role?.dataPermission;
  }
};

/**
 * 获取项目信息
 */
export const ProjectUtil = {
  /**
   * 获取项目信息
   */
  getProjectInfo(): ProjectInfo {
    return uni.getStorageSync(PROJECT_INFO_KEY) || {};
  },

  /**
   * 设置项目信息
   */
  setProjectInfo(projectInfo: ProjectInfo): void {
    uni.setStorageSync(PROJECT_INFO_KEY, projectInfo);
  },

  /**
   * 删除项目信息
   */
  removeProjectInfo(): void {
    uni.removeStorageSync(PROJECT_INFO_KEY);
  }
};

/**
 * 获取组织信息
 */
export const OrganizationUtil = {
  /**
   * 获取组织信息
   */
  getOrganizationInfo(): OrganizationInfo {
    return uni.getStorageSync(ORGANIZATION_INFO_KEY) || {};
  },

  /**
   * 设置组织信息
   */
  setOrganizationInfo(organizationInfo: OrganizationInfo): void {
    uni.setStorageSync(ORGANIZATION_INFO_KEY, organizationInfo);
    emitter.emit("organizationChanged", organizationInfo);
  },

  /**
   * 删除组织信息
   */
  removeOrganizationInfo(): void {
    uni.removeStorageSync(ORGANIZATION_INFO_KEY);
  }
};

export const FilterUtil = {
  getFilterData(): FilterData {
    return uni.getStorageSync(FILTER_DATA_KEY) || {};
  },

  setFilterData(filterData: FilterData): void {
    uni.setStorageSync(FILTER_DATA_KEY, filterData);
  },

  removeFilterData(): void {
    uni.removeStorageSync(FILTER_DATA_KEY);
  }
};

/** 项目树*/
export const ProjectTreeUtil = {
  getProjectTree(): any {
    return uni.getStorageSync(PROJECT_TREE_KEY) || {};
  },

  setProjectTree(projectTree: any): void {
    uni.setStorageSync(PROJECT_TREE_KEY, projectTree);
  },

  removeProjectTree(): void {
    uni.removeStorageSync(PROJECT_TREE_KEY);
  }
};

/**
 * 统计Tab索引管理工具类
 */
export const QuantityTabUtil = {
  /**
   * 获取统计Tab索引
   */
  getQuantityTabIndex(): number {
    return uni.getStorageSync(QUANTITY_TAB_INDEX_KEY) || 0;
  },

  /**
   * 设置统计Tab索引
   */
  setQuantityTabIndex(index: number): void {
    uni.setStorageSync(QUANTITY_TAB_INDEX_KEY, index);
  },

  /**
   * 删除统计Tab索引
   */
  removeQuantityTabIndex(): void {
    uni.removeStorageSync(QUANTITY_TAB_INDEX_KEY);
  }
};
