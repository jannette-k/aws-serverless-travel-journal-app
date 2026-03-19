// src/auth.js
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognito } from "./cognitoConfig";

const client = new CognitoIdentityProviderClient({
  region: cognito.region,
});

// Sign up
export async function signUpUser(email, password) {
  const command = new SignUpCommand({
    ClientId: cognito.clientId,
    Username: email,
    Password: password,
    UserAttributes: [{ Name: "email", Value: email }],
  });
  return client.send(command);
}

// Confirm signup with verification code emailed by Cognito
export async function confirmSignUp(email, code) {
  const command = new ConfirmSignUpCommand({
    ClientId: cognito.clientId,
    Username: email,
    ConfirmationCode: code,
  });
  return client.send(command);
}

// Sign in — saves token to localStorage
export async function signInUser(email, password) {
  const command = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: cognito.clientId,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  });
  const response = await client.send(command);
  const token = response.AuthenticationResult.AccessToken;
  localStorage.setItem("access_token", token);
  return token;
}

// Sign out
export function signOutUser() {
  localStorage.removeItem("access_token");
}

// // src/auth.js
// import {
//   CognitoIdentityProviderClient,
//   InitiateAuthCommand,
//   SignUpCommand
// } from "@aws-sdk/client-cognito-identity-provider";

// const client = new CognitoIdentityProviderClient({
//   region: process.env.REACT_APP_AWS_REGION
// });

// export async function signUpUser(email, password) {
//   const command = new SignUpCommand({
//     ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
//     Username: email,
//     Password: password,
//     UserAttributes: [{ Name: "email", Value: email }]
//   });
//   return client.send(command);
// }

// export async function signInUser(email, password) {
//   const command = new InitiateAuthCommand({
//     AuthFlow: "USER_PASSWORD_AUTH",
//     ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
//     AuthParameters: {
//       USERNAME: email,
//       PASSWORD: password
//     }
//   });
//   const response = await client.send(command);
//   return response.AuthenticationResult.IdToken;
// }

// // 👇 Add this export
// export async function callApi(idToken, payload) {
//   const res = await fetch(process.env.REACT_APP_API_GATEWAY_ENDPOINT, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${idToken}`
//     },
//     body: JSON.stringify(payload)
//   });
//   return res.json();
// }

// // src/auth.js
// import {
//   CognitoIdentityProviderClient,
//   InitiateAuthCommand,
//   SignUpCommand,
//   ConfirmSignUpCommand,
// } from "@aws-sdk/client-cognito-identity-provider";
// import { cognito } from "./cognitoConfig";

// const client = new CognitoIdentityProviderClient({
//   region: cognito.region,
// });

// // Sign up
// export async function signUpUser(email, password) {
//   const command = new SignUpCommand({
//     ClientId: cognito.clientId,
//     Username: email,
//     Password: password,
//     UserAttributes: [{ Name: "email", Value: email }],
//   });
//   return client.send(command);
// }

// // Confirm signup with verification code emailed by Cognito
// export async function confirmSignUp(email, code) {
//   const command = new ConfirmSignUpCommand({
//     ClientId: cognito.clientId,
//     Username: email,
//     ConfirmationCode: code,
//   });
//   return client.send(command);
// }

// // Sign in — saves token to localStorage
// export async function signInUser(email, password) {
//   const command = new InitiateAuthCommand({
//     AuthFlow: "USER_PASSWORD_AUTH",
//     ClientId: cognito.clientId,
//     AuthParameters: {
//       USERNAME: email,
//       PASSWORD: password,
//     },
//   });
//   const response = await client.send(command);
//   const token = response.AuthenticationResult.IdToken;
//   localStorage.setItem("access_token", token);
//   return token;
// }

// // Sign out
// export function signOutUser() {
//   localStorage.removeItem("access_token");
// }