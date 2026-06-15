import type { User } from "firebase/auth"
import {UserProfile} from "./user"
import type { CartItem, MenuItem } from "@/types";

export type AuthContextValue = {
    user : User | null
    profile : UserProfile | null
    loading : boolean
    signIn : (email:string, password:string) => Promise<User>
    signOut : () => Promise<void>
    getIdToken : (force?: boolean) => Promise<string | null>
    createUser : (email:string, password:string, name:string) => Promise<User>
    deleteAccount : (password: string) => Promise<void>
}

export type DarkmodeProps = {
    uid: string,
    darkmode: boolean
}

export type LanguageProps = {
    uid: string,
    nextLang: string
}

export type CurrencyProps = {
    uid: string,
    currency: string
}

export type StartDayProps = {
    uid: string,
    openingBalance: number
}

export type EndDayProps = {
    uid: string,
    closingBalance: number
}

export type CompleteCheckoutParams = {
  uid: string;
  dayKey: string;
  items: (CartItem & { menu: MenuItem })[];
  totalMinor: number;
};

export type StockRead = {
  stockId: string;
  itemName: string;
  currentQty: number;
  removeQty: number;
  nextQty: number;
};