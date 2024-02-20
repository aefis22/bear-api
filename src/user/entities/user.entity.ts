export class User {
  id: string;
  name: string;
  email: string;
  password?: string;
  emailVerifiedAt: Date;
  roles: string;
  createdAt: Date;
  updatedAt: Date;
}
