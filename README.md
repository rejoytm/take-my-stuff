
# Take My Stuff

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
![Platforms](https://img.shields.io/badge/Platform-Web%20%26%20iOS%20%26%20Android-blue.svg)

Take My Stuff is a cross-platform mobile marketplace app built with Angular and Ionic. It enables users to easily buy and sell used products within their local community.


## Screenshots

![Login, Create Account, and Store page](https://res.cloudinary.com/dnwasepdv/image/upload/w_2048/v1741624978/git/take-my-stuff/group-1_bnx3gt.png)

![Listing and Request page](https://res.cloudinary.com/dnwasepdv/image/upload/w_2048/v1741624971/git/take-my-stuff/group-2_ckxdqm.png)

![My Listings, Edit Listing, and Profile page](https://res.cloudinary.com/dnwasepdv/image/upload/w_2048/v1741624970/git/take-my-stuff/group-3_djmaan.png)


## Features

- **Cross-Platform**: Developed for **Web**, **iOS** and **Android** using **Angular** and **Ionic**, providing a seamless user experience on mobile devices.
- **User Authentication**: Integrated with **Firebase Authentication**, enabling users to securely register, log in, and manage their accounts.
- **CRUD Operations**: Users can create, read, update, and delete product listings in real-time, with data stored in **Firebase**.
- **Image Uploads**: Efficient image storage and retrieval powered by **Google Cloud Storage**, allowing users to upload and display photos of their listings.
- **Search and Filter**: A **store page** that lets users search and filter products based on categories and more.
- **Real-Time Navigation**: Integration with **Google Maps API** to provide real-time navigation for item pickups.
- **Image Carousel**: Detailed item pages feature **SwiperJS** for a smooth, interactive image carousel for product images.
- **Request Items**: A built-in messaging feature to allow buyers and sellers to communicate directly through the app.


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
