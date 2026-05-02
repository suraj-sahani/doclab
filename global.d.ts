import { User } from "./lib/types";

declare global {
  interface CustomJwtSessionClaims extends User {}
}
