//定义客户接口
export interface CustomerInterface {
  brokerPhone: string;
  level: string;
  lastProjectCustomerTime: string | null;
  nextFollowUpTime: string | null;
  phone: string;
  projectCustomerId: number;
  projectCustomerName: string;
  realEstateConsultantId: number | null | string;
  realEstateConsultantName: string;
  reportBroker: string;
  reportStore: string;
  visitNumber: number;
  hasPhone: boolean;
  createTime: string;
  createUser: number | null;
  createUserName: string | null;
  hasCheckTask: boolean;
  lastFollowUpTime: string;
  lastReportRecordId: number;
  lastVisitTime: string;
  name: string;
  projectId: number;
  projectName: string;
  realEstateConsultant: number;
  sex: string;
  updateTime: string;
  id: number;
}

export interface CustomerBasicInfoInterface {
  customerFieldId: number;
  fieldName: string;
  hasNecessary: boolean;
  options: string[];
  type: "TEXT" | "NUMBER" | "RADIO" | "CHECKBOX" | "FILE" | "IMAGE";
  value: string;
}

export interface CustomerDetailsInterface {
  basicInfos: CustomerBasicInfoInterface[];
  createTime: string;
  createUser: number;
  createUserName: string;
  demandInfos: CustomerBasicInfoInterface[];
  hasCheckTask: boolean;
  hasRefund: boolean;
  hasSign: boolean;
  hasSubscription: boolean;
  id: number;
  lastFollowUpTime: string;
  lastProjectCustomerVisitDateTime: string;
  lastProjectCustomerVisitId: number;
  lastReportRecordId: number;
  lastVisitTime: string;
  level: string;
  name: string;
  nextFollowUpTime: string;
  phone: string;
  projectId: number;
  projectName: string;
  realEstateConsultant: number | null | string;
  realEstateConsultantName: string;
  sex: string;
  updateTime: string;
  visitNumber: number;
  hasPhone: boolean;
}

/**
 * 客户变更记录
 * DISTRIBUTION: 分配
 * GIVE_UP: 来访
 */
export interface CustomerChangeRecordInterface {
  createTime: string;
  createUserName: string;
  projectCustomerId: number;
  remark: string;
  type: "DISTRIBUTION" | "GIVE_UP";
  typeName: string;
}

export interface CustomerFollowUpRecordInterface {
  content: string;
  createTime: string;
  images: string;
  method: string;
  projectCustomerId: number;
  realEstateConsultantName: string;
}

export interface CustomerReportingRecordInterface {
  brokerPhone: string;
  phone: string;
  projectCustomerId: number;
  projectCustomerName: string;
  reportBroker: string;
  reportStore: string;
  reportTime: string;
}
