import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
    address: {
        firstName: string;
        lastName: string;
        address: string;
        address2?: string;
        zipCode: string;
        city: string;
        country: string;
        phone: string;
    };
    setAddress: (address: State['address']) => void;
    _hasHydrated: boolean,
    _setHasHydrated: (isHydrated: boolean) => void;
}

export const useAddressStore = create<State>()(
    persist(
        (set, get) => ({
            address: {
                firstName: "",
                lastName: "",
                address: "",
                address2: "",
                zipCode: "",
                city: "",
                country: "",
                phone: ""
            },
            setAddress: (address) => {
                set({ address });
            },
            _hasHydrated: false,
            _setHasHydrated: (isHydrated) => {
                set({
                    _hasHydrated: isHydrated
                });
            }
        }),
        {
            name: "address-storage",
            onRehydrateStorage: (state) => {
                // Para evitar el error de hydration uso éste método junto con
                // _hasHydrated y _setHasHydrated
                // https://zustand.docs.pmnd.rs/reference/integrations/persisting-store-data
                return () => state._setHasHydrated(true)
            }
        }
    )
);