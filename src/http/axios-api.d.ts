declare namespace Login {
  interface LoginReqForm {
    username: string;
    password: string;
  }
  interface LoginResData {
    token: string;
  }
}

declare namespace Api {
  interface getModeListByDeviceIdResData {
    brandName: string;
    imageUrl: string;
    instruction: string;
    modes: Array;
    networkDevice: number;
    tbDevice?: null;
    typeName: string;
  }
}
