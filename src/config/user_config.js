export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    BUCKET: "indoorposition-upload"
  },
  apiGateway: {
    REGION: "ap-northeast-2",
    URL: "https://3j464m9c9l.execute-api.ap-northeast-2.amazonaws.com/prod"
  },
  cognito: {
    REGION: "ap-northeast-2",
    USER_POOL_ID: "ap-northeast-2_p4eoPQwrE",
    APP_CLIENT_ID: "7bhf4p3inc41n9doma08hj9tsc",
    IDENTITY_POOL_ID: "ap-northeast-2:44f7ada7-31b0-4395-a854-ff61f87f0bc9"
  }
};
