import { useSyncExternalStore } from "react";
import { adminStore } from "@/lib/admin-store";
import { AdminState } from "@/types/admin";

type Selector<T> = (state: AdminState) => T;

export const useAdminStore = <T>(selector: Selector<T>) => {
  return useSyncExternalStore(
    adminStore.subscribe,
    () => selector(adminStore.getState()),
    () => selector(adminStore.getState())
  );
};

