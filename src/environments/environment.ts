// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  auth: {
    issuer: 'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_NkbijYkZT',
    clientId: '4u0u5q0rb5cdhvrsf9a0mbvo3j',
    scope: 'openid profile email',
    responseType: 'code',
    strictDiscoveryDocumentValidation: false,
    useSilentRefresh: true,
  },
  apiUrl: 'http://localhost:8080'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
