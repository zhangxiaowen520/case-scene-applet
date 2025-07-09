/*
 * 数据权限类型
 * PROJECT: 本项目(项目经理)
 * SELF: 个人(顾问)
 * NATIONAL_MARKETING: 全民营销
 */
export type DataPermissionType =
  | "PROJECT"
  | "SELF"
  | "NATIONAL_MARKETING"
  | "CHANNEL_KING"
  | "MANAGER";

/*
 * 角色信息
 */
export interface RoleInfo {
  id: number;
  name: string;
  dataPermission: DataPermissionType;
  dataPermissionName: string;
  createTime: string;
  createUser: number;
  createUserName: string;
  updateTime: string;
  userNumber: number;
}

export interface UserInfo {
  id: number;
  name: string;
  phone: string;
  createIp: null;
  createTime: string;
  expiration: string;
  lastLoginTime: string;
  roleId: number;
  role: RoleInfo;
  token: string;
  userType: "COMMON";
}

export interface ProjectInfo {
  projectId: number;
  projectName: string;
}

// 消息类型
// RECOVER("客户回收提醒"),
// ASSIGN("客户分配提醒"),
// FOLLOW_UP("客户跟进提醒"),
// SIGN("客户签约提醒"),
export type MessageType = "RECOVER" | "ASSIGN" | "FOLLOW_UP" | "SIGN";

export interface MessageInfo {
  content: string;
  createTime: string;
  hasRead: boolean;
  userId: number;
  id: number;
  messageType: MessageType;
  messageTypeName: string;
}

export interface FilterData {
  realEstateConsultantIds: number[];
  levels: string[];
  dateTimeBegin: string;
  dateTimeEnd: string;
  isReset: boolean;
  selectId: number;
  isValid: boolean;
  sourceChannel: number[];
  queryType?: number;
  selectType?: string;
}

export interface OrganizationInfo {
  id: number;
  name: string;
  type: string;
  isProject: boolean;
  children: OrganizationInfo[];
}
