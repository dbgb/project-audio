# ![projectAudio](other/project-header.jpg) <!-- omit in toc -->

## _🎵 Full-stack audio streaming app MVP_ <!-- omit in toc -->

### Contents <!-- omit in toc -->

- [🔎 Overview](#-overview)
- [🎵 Demo](#-demo)
- [💡 Planned features](#-planned-features)
- [🚀 Further information](#-further-information)

## 🔎 Overview

- Upload and playback:

  - Save, play, edit or delete your own tracks
  - Playback only for other user's uploads

- Searchable tracklist:

  - Filter tracks by title, poster, description etc.

- Save favourites:

  - Like or unlike tracks
  - Browse user favourites and uploads via their profile page

- Fully responsive layout:

  - Three breakpoint layout provides a high quality user experience on mobile,
    tablet or desktop devices

- Tech stack:

  - _Javascript up front, Python in the back_
  - Frontend:
    - React + Apollo Client
  - Backend API:
    - Django, Graphene, GraphQL
  - Static server:
    - Django + WhiteNoise

## 🎵 Demo

- A live, demo version of the app is hosted [here](https://projectaudio.herokuapp.com).

## 💡 Planned features

- End-to-end Cypress test suite
- Persistent audio playback when navigating app
- User playlists
- Custom audio player component

## 🚀 Further information

Overviews and documentation for both the client and backend API can be found
[here](client/README.md) and [here](backend/README.md) respectively.

Technical overview information on the deployment reasoning and process for this
project can be found [here](/DEPLOYMENT.md).
