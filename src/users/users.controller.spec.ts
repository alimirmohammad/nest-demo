import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      async findOne(id: number) {
        return { id, email: 'test@test.com', password: 'abcd' } as User;
      },
      async find(email: string) {
        return [{ id: 1, email, password: 'abcd' } as User];
      },
      // remove(id) {

      // },
      // update(id, attrs) {

      // },
    };
    fakeAuthService = {
      // signup(email, password) {
      // },
      async signin(email: string, password: string) {
        return { id: 1, email, password } as User;
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('returns all users with findAllUsers', async () => {
    const [user] = await controller.findAllUsers('test@test.com');
    expect(user).toBeDefined();
    expect(user.email).toEqual('test@test.com');
  });

  it('returns one user with findUser', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('throws when the user does not exist', (done) => {
    fakeUsersService.findOne = async () => null;
    controller.findUser('1').catch(() => {
      done();
    });
  });

  it('returns the user after sign in', async () => {
    const session = { userId: -10 };
    const body = { email: 'test@test.com', password: 'abcd' };
    const user = await controller.signin(body, session);
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
