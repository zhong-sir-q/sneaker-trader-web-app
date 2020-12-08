## Overview

The project is a mono-repo containing 3 main directories, the following is the description of what each directory has:

- `frontend`: contains the *react* app.
- `backend`: contains the *express* app.
- `shared`: contains the domain-specific type declarations shared between the `frontend` and `backend`.

The project implements a typical client-server model. In the *react* app, all business critical functions reside in the `src/usecases` folder. In the *express* app, it contains 2 layers, the router and the service layer.

## Get Started

### Configuration
- Each `frontend` and `backend` directory contains specific `.env` files for development, production and test environment respectively also `aws-exports.js` is necessary to get Amplify up and running, contact admin to retrieve the relevant credentials.

### Run the project

- In the root directory, first setup and build the project:

```bash
# installs global dependenciens and create the type references
npm run setup
```

- Then to run the project, if you are on **Windows**:

```bash
npm run win-dev
```

Else if you are on **MacOS** or **Linux**:

```bash
npm run dev
```

- Then you can see the react app running at https://localhost:3000 and the express app running at http://localhost:4000.

### Note
- Anytime type declarations are added to the shared folder, run `npm run buildAll` to sync the updates between the folders.

## Development

Steps for adding new data to the app

1. Add a column to the sql table (if necessary)
2. Modify the type of the respective model (if step 1 was done)
3. Update the respective model entity
4. Add the sql query method in the service
5. Expose the route using the service
6. Interact with the endpoint using the controller
7. Get/Send/Manipulate the data in the client
