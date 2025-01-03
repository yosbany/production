interface UserRole {
  uid: string;
  role: 'admin' | 'producer';
}

export const DEFAULT_USERS: UserRole[] = [
  {
    uid: 'H7SO8td5D4Z23Kwqin7iNnynVEA3',
    role: 'admin'
  },
  {
    uid: 'TQnVw9dZTDNhvvbMzMzUdBhimKY2',
    role: 'producer'
  }
];