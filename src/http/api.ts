import axios from "./axios/axios.config";

// 用户登录
export const login = (params: Login.LoginReqForm) => {
  // 返回的数据格式可以和服务端约定
  return axios.post<Login.LoginResData>("/user/login", params);
};

// 获取设备列表
export const getMyHomeDeviceList = () => {
  // 返回的数据格式可以和服务端约定
  return axios.get("/p/device/myHomeDeviceList");
};

// 获取设备列表
export const getModeListByDeviceId = (id: number) => {
  return axios.get<Api.getModeListByDeviceIdResData>(
    `/p/device/getModeListByDeviceId/${id}`
  );
};
