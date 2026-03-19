// src/cognitoConfig.js
export const cognito = {
  region: process.env.REACT_APP_AWS_REGION,
  clientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
  userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
};

// src/cognitoConfig.js
// export const cognito = {
//   domain: "https://eu-north-1pzp3fwfvs.auth.eu-north-1.amazoncognito.com",
//   clientId: "8r33ih9ivsggqr252sm4jvtci",
//   redirectUri: "http://localhost:3000",
// };

// REACT_APP_AWS_REGION=eu-north-1
// REACT_APP_COGNITO_USER_POOL_ID=eu-north-1_BZazdBxfC
// REACT_APP_COGNITO_CLIENT_ID=1kpptbmemlm92ir02id1dcs46c
// REACT_APP_API_GATEWAY_ENDPOINT=https://s0apzpkx0h.execute-api.eu-north-1.amazonaws.com/dev