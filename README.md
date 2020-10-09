## Overview

The project is a mono-repo containing 3 main directories, the following is the description of what each directory has:

- `frontend`: contains the *react* app.
- `backend`: contains the *express* app.
- `shared`: contains the domain-specific type declarations shared between the `frontend` and `backend`.

The project implements a typical client-server model. In the *react* app, all business critical functions reside in the `src/usecases` folder. In the *express* app, it contains 2 layers, the router and the service layer.

## Get Started

### Configuration
- Each `frontend` and `backend` directory contains specific `.env` files for development, production and test environment respectively, contact admin to retrieve the relevant `.env` files.
- Setup Amplify in `frontend`, you can either [create new auth resources](https://docs.amplify.aws/lib/auth/getting-started/q/platform/js#configure-your-application) or contact admin to retrieve relevant information to [re-use the existing backend](https://docs.amplify.aws/lib/auth/start/q/platform/js#re-use-existing-authentication-resource)

### Run the project
- Run `npm install` in `frontend` and `backend` respectively.
- In the root directory, run `npm run buildAll`, this creates type references between the `shared` folder and the two other directories. Then run `npm run dev`, you should be able to see the react app running at https://localhost:3000 and the express app running at http://localhost:4000.

### Note
- Anytime type declarations are added to the shared folder, run `npm run buildAll` to sync the updates between the folders.
