import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let authService: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeUsersService = {
      async find(email: string) {
        return users.filter((user) => user.email === email);
      },
      async create(email: string, password: string) {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return user;
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    authService = module.get(AuthService);
  });

  it('can create an instance of the auth service', async () => {
    expect(authService).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await authService.signup('test@test.com', 'abcd');
    expect(user.password).not.toEqual('abcd');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error when user signs up with an existing email', (done) => {
    authService.signup('test@test.com', 'abcd').then(() => {
      authService.signup('test@test.com', 'efgh').catch((err) => {
        done();
      });
    });
  });

  it('throws an error when user signs in with an invalid email', (done) => {
    authService.signup('test@test.com', 'abcd').then(() => {
      authService.signin('test2@test.com', 'efgh').catch((err) => {
        done();
      });
    });
  });

  it('throws an error when user signs in with an invalid password', (done) => {
    authService.signup('test@test.com', 'abcd').then(() => {
      authService.signin('test@test.com', 'efgh').catch((err) => {
        done();
      });
    });
  });

  it('returns the user when user signs in with a valid password', (done) => {
    authService.signup('test@test.com', 'abcd').then(() => {
      authService.signin('test@test.com', 'abcd').then(() => {
        done();
      });
    });
  });
});
