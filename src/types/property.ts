export interface PropertyInfoInterface {
  aboveGroundArea: string;
  address: string;
  birdSEyeImg: string;
  decorationStandard: string;
  edificeType: string;
  floorArea: string;
  id: number;
  installments: string;
  lastOpenTime: string;
  latestDeliveryTime: string;
  name: string;
  planBuild: number;
  plotRatio: string;
  propertyCompany: string;
  propertyFee: string;
  propertyRightsPeriod: string;
  propertyStatus: string;
  propertyType: string;
  salesOfficeAddress: string;
  totalArea: string;
  undergroundArea: string;
}

export interface HouseInfoInterface {
  area: string;
  balcony: string;
  hall: string;
  houseTypeImg: string;
  id: number;
  name: string;
  referenceTotalPrice: string;
  room: string;
  roomFace: string;
  toilet: string;
}

export interface PropertyStatisticsDataInterface {
  areaForSale: number;
  areaOnSale: number;
  areaSign: number;
  areaSubscription: number;
  countArea: number;
  countCover: number;
  forSale: number;
  onSale: number;
  projectId: number;
  roomForSale: number;
  roomOnSale: number;
  roomReturnedMoney: number;
  roomSign: number;
  soldOut: number;
  subscription: number;
  valueTotalSum: number;
  returnedMoney: number;
}

export interface ProjectInfoInterface {
  progressUpdateTime?: string; // 工程进度更新时间
  certificationTime?: string; // 取证时间
  activities: ProjectInfoActivitiesInterface[];
  address: string;
  houseTypes: ProjectInfoHouseTypesInterface[];
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  outdoorLandscapeImg: string;
  overallReviewPictureUrl: string;
  progresses: any[];
  projectNearbyAmenities: any[];
  propertyStatus: string;
  realEstateConsultantId: number;
  realEstateConsultantName: string;
  tags: any[];
}

export interface ProjectInfoActivitiesInterface {
  createTime: string;
  createUser: number;
  createUserName: string;
  endTime: string;
  id: number;
  introduction: string;
  location: string;
  numberOfApplicants: number;
  signUpEndTime: string;
  signUpStartTime: string;
  startTime: string;
  status: number;
  title: string;
  titleImg: string;
  updateTime: string;
}

export interface ProjectInfoHouseTypesInterface {
  area: string;
  balcony: string;
  hall: string;
  houseTypeImg: string;
  id: number;
  name: string;
  referenceTotalPrice: string;
  room: string;
  roomFace: string;
  toilet: string;
}
