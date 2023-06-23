import { userAsyncLocalStorage } from './user.constants';
import { User } from './user.entity';

export const getCurrentUser = () => {
  const context = userAsyncLocalStorage.getStore();
  const user: User = context?.user;

  return user;
};
