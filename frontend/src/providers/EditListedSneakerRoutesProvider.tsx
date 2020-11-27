import React, { createContext, useContext, useState, useEffect } from "react";
import { Route } from "react-router-dom";

import { useAuth } from "./AuthProvider";

import EditListedSneakerPage from "pages/EditListedSneakerPage";

import { ListedSneakerController } from "api/controllers/ListedSneakerController";

import { SellerListedSneaker } from "../../../shared";
import { createEditListedSneakerPath } from "utils/utils";

const EditListedSneakerRoutesCtx = createContext<{
  editListedSneakerRoutes: JSX.Element[] | undefined;
}>({
  editListedSneakerRoutes: undefined,
});

export const useEditListedSneakerRoutes = () => useContext(EditListedSneakerRoutesCtx);

const EditListedSneakerRoutesProvider = (props: {
  children: React.ReactNode;
  listedSneakerController: ListedSneakerController;
}) => {
  const { currentUser } = useAuth();
  const [editListedSneakerRoutes, setEditListedSneakerRoutes] = useState<JSX.Element[]>();

  const renderEditListedSneakerRoutes = (listedSneakers: SellerListedSneaker[]) =>
    listedSneakers.map(({ id }, idx) => {
      return <Route path={createEditListedSneakerPath(id)} component={EditListedSneakerPage} key={idx} />;
    });

  useEffect(() => {
    (async () => {
      if (!currentUser) return;
      // const sneakers = await ListedSneakerControllerInstance.getAllListedSneakers();
      const sneakers = (await props.listedSneakerController.getUnsoldListedSneakers(currentUser.id)).filter(
        (s) => s.prodStatus === 'listed'
      );
      setEditListedSneakerRoutes(renderEditListedSneakerRoutes(sneakers));
    })();
  }, [props.listedSneakerController, currentUser]);

  return (
    <EditListedSneakerRoutesCtx.Provider value={{ editListedSneakerRoutes }}>
      {props.children}
    </EditListedSneakerRoutesCtx.Provider>
  );
};

export default EditListedSneakerRoutesProvider
