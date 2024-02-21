export class User {
  id: string;
  name: string;
  email: string;
  password?: string;
  emailVerifiedAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
