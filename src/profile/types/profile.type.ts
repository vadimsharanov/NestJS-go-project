import { UserType } from "src/user/types/userType";

export type ProfileType = UserType & { following: boolean };
