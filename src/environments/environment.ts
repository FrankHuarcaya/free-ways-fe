// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  server: 'http://127.0.0.1:8000',
  production: false,
  defaultauth: 'fakebackend',
  firebaseConfig: {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  },
  security: {
    user: {
      login: '/security/login/',
      register: '/security/user/',
      list: '/security/user/',
      delete: '/security/user/',
    }
  },
  operation:{
    trafficLight:{
      list: '/operation/trafficlights/',
      register: '/operation/trafficlights/',
      update: '/operation/trafficlights/',
      delete: '/operation/trafficlights/'
    },
    intersection:{
      list: '/operation/intersection/',
      register: '/operation/intersection/',
      update: '/operation/intersection/',
      delete: '/operation/intersection/'
    },
    laneGroup:{
      list: '/operation/lane-group/',
      register: '/operation/lane-group/',
      update: '/operation/lane-group/',
      delete: '/operation/lane-group/'
    },
    avenue:{
      list: '/operation/avenue/',
      register: '/operation/avenue/',
      update: '/operation/avenue/',
      delete: '/operation/avenue/'
    },
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
