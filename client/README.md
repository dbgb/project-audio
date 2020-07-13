# README: Client

## Contents

- [README: Client](#readme-client)
  - [Contents](#contents)
  - [🔎 Overview](#-overview)
  - [🔧 Setting up the development environment](#-setting-up-the-development-environment)
    - [`yarn start`](#yarn-start)
    - [`yarn test`](#yarn-test)
    - [`yarn build`](#yarn-build)
    - [`yarn eject`](#yarn-eject)
  - [🚀 Further information](#-further-information)

## 🔎 Overview

The client for the app is implemented using:

- [React](https://reactjs.org/) \- To create and wire together the user
  interface components.
- [Apollo Client](https://www.apollographql.com/docs/react/) \- For component
  state management; GraphQL queries, mutations and caching \- and keeping the UI
  up to date.
- [Material UI](https://material-ui.com/) \- To provide reliable,
  high-performance UI components, with consistent styling and user experience
  across the app.

The client was bootstrapped with
[create-react-app](https://github.com/facebook/create-react-app) and uses
[react-app-rewired](https://github.com/timarney/react-app-rewired) to override
create-react-app webpack configs without ejecting.

## 🔧 Setting up the development environment

In the `client` directory, you can run:

### `yarn start`

_Runs the app in the development mode._

Open [http://localhost:8765](http://localhost:8765) to view it in the browser.

The page will reload if you make edits.

You will also see any lint errors in the console.

### `yarn test`

_Launches the test runner in the interactive watch mode._

See the section about [running
tests](https://facebook.github.io/create-react-app/docs/running-tests) for more
information.

### `yarn build`

_Builds the app for production to the `build` folder._

It correctly bundles React in production mode and optimizes the build for the
best performance.

The build is minified and the filenames include the hashes.

Your app is ready to be deployed!

See the section about
[deployment](https://facebook.github.io/create-react-app/docs/deployment) for
more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can
`eject` at any time. This command will remove the single build dependency from
your project.

Instead, it will copy all the configuration files and the transitive
dependencies (webpack, Babel, ESLint, etc) right into your project so you have
full control over them. All of the commands except `eject` will still work, but
they will point to the copied scripts so you can tweak them. At this point
you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for
small and middle deployments, and you shouldn’t feel obligated to use this
feature. However we understand that this tool wouldn’t be useful if you couldn’t
customize it when you are ready for it.

## 🚀 Further information

You can learn more in the [Create React App
documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
