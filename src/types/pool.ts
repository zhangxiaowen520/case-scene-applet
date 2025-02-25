export interface CustomerPoolInterface {
  level: string;
  oldUserName: string;
  phone: string;
  projectCustomerId: number;
  projectCustomerName: string;
  reason: string;
}

export interface ReportPoolInterface {
  brokerPhone: string;
  phone: string;
  projectCustomerId: number;
  projectCustomerName: string;
  reportBroker: string;
  reportStore: string;
  reportTime: string;
}

export interface SignListInterface {
  subscriptionDatetime: string;
  lastSignUrgeId: number;
  level: string;
  oldUserName: string;
  oldUserPhone: string;
  phone: string;
  projectCustomerId: number;
  projectCustomerName: string;
  realEstateConsultantName: string;
  realEstateConsultantPhone: string;
}

export type AssignMethodType = "PERFORMANCE" | "MANUAL" | "SORT";
