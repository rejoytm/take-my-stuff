
# Take My Stuff

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
![Platforms](https://img.shields.io/badge/Platform-Web%20%26%20iOS%20%26%20Android-blue.svg)

**Take My Stuff** is a cross-platform mobile marketplace app built with Angular and Ionic. It enables users to easily buy and sell used products within their local community.


## Screenshots

![Login, Create Account, and Store page](https://res.cloudinary.com/dnwasepdv/image/upload/w_2048/v1741624978/git/take-my-stuff/group-1_bnx3gt.png)

![Listing and Request page](https://res.cloudinary.com/dnwasepdv/image/upload/w_2048/v1741624971/git/take-my-stuff/group-2_ckxdqm.png)

![My Listings, Edit Listing, and Profile page](https://res.cloudinary.com/dnwasepdv/image/upload/w_2048/v1741624970/git/take-my-stuff/group-3_djmaan.png)


## Features

- 🌐 Web, iOS, and Android support
- 🌗 Light/Dark mode support
- 🔒 Secure login with Firebase Auth
- 🔍 Search and filter products easily
- 🗺️ Real-time navigation with Google Maps API
- 🖼️ Interactive image carousel with SwiperJS
- 📩 Built-in messaging feature for buyers and sellers


## Run Locally

Clone the project

```bash
git clone https://github.com/rejoytm/take-my-stuff
```

Go to the project directory

```bash
cd take-my-stuff
```

Install dependencies

```bash
npm install
```

Start the server

```bash
npm run start
```


## Environment Variables

To run this project, you will need to update the environment variables in the `src/environments/environment.ts` file:

```javascript
export const environment = {
  production: false,
  firebase: {
    apiKey: '<your-api-key>',
    authDomain: '<your-auth-domain>',
    projectId: '<your-project-id>',
    storageBucket: '<your-storage-bucket>',
    messagingSenderId: '<your-messaging-sender-id>',
    appId: '<your-app-id>',
  },
  googleMapsApiKey: '<your-google-maps-api-key>',
};
```

Make sure to replace the placeholders with your Firebase and Google Maps API credentials.
