export interface User {
  id: string;
  avatarId?: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  locked: boolean;
}
