export const environment = {
  production: true,
  auth: {
    issuer: 'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_NkbijYkZT',
    clientId: '4u0u5q0rb5cdhvrsf9a0mbvo3j',
    scope: 'openid profile email',
    responseType: 'code',
    strictDiscoveryDocumentValidation: false,
    useSilentRefresh: true,
  }
};
