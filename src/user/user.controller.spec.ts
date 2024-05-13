import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { Roles } from './roles.enum';
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { PassThrough } from "nodemailer/lib/xoauth2";
import { Request } from 'express';

describe('UserController', () => {

    let userController: UserController;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserController,
                {
                provide: UserService,
                useValue: {
                    getProfile: jest.fn(),
                    updateProfileWithAvatar: jest.fn(),
                    updateProfile: jest.fn(),
                    deleteProfile: jest.fn(),
                }
            }, 
            ]
        }).compile();
        userController = await module.resolve(UserController);
        userService = await module.resolve(UserService);
    });

    it('should be defined', ()=>{
        expect(userController).toBeDefined();
    })

    describe('.getProfile', () => {

        afterEach( () => {
            jest.clearAllMocks();
        });

        it('should call UserService.getProfile propely', async () => {
            const userServiceSpy = jest.spyOn(userService, 'getProfile');
            await userController.getProfile('userId');
            expect(userServiceSpy).toHaveBeenCalledWith('userId');
        });

        it('should return instance of User', async () => {
            
            const user = new User()
            
            jest.spyOn(userService, 'getProfile').mockResolvedValue(user);
            const result = await userController.getProfile('userId');
            expect(result).toBeInstanceOf(User);
        });

    });

    describe('.editProfile', () => {
        
        const dto = new UpdateProfileDto()

        afterEach( () => {
            jest.clearAllMocks();
        });

        it('should call UserService.updateProfileWithAvatar propely', async () => {
            const file: Express.Multer.File = {
                fieldname: 'file',
                originalname: 'testFile.jpg',
                encoding: '7bit',
                mimetype: 'image/jpeg',
                size: 1024, 
                destination: '/tmp',
                filename: 'testFile.jpg',
                path: '/tmp/testFile.jpg',
                buffer: Buffer.from([]),
                stream: new PassThrough(),
              };
            const userServiceSpy = jest.spyOn(userService, 'updateProfileWithAvatar');
            await userController.editProfile(file, 'userId', dto);
            expect(userServiceSpy).toHaveBeenCalledWith('userId', dto, file);
        });
        
        it('should call UserService.updateProfile propely', async () => {
            const userServiceSpy = jest.spyOn(userService, 'updateProfile');
            await userController.editProfile(null, 'userId', dto);
            expect(userServiceSpy).toHaveBeenCalledWith('userId', dto);
        });

        it('should return instance of User', async () => {
            const file: Express.Multer.File = {
                fieldname: 'file',
                originalname: 'testFile.jpg',
                encoding: '7bit',
                mimetype: 'image/jpeg',
                size: 1024, 
                destination: '/tmp',
                filename: 'testFile.jpg',
                path: '/tmp/testFile.jpg',
                buffer: Buffer.from([]),
                stream: new PassThrough(),
              };

            const user = new User()

            jest.spyOn(userService, 'updateProfileWithAvatar').mockResolvedValue(user);
            const result = await userController.editProfile(file, 'userId', dto);
            expect(result).toBeInstanceOf(User);
        });
    });

    describe('.deleteProfile', () => {

        let req: any;

        req = {
            session: {
                destroy: jest.fn()
            }
        };

        afterEach( () => {
            jest.clearAllMocks();
        });

        it('should call UserService.updateProfile propely', async () => {
            const userServiceSpy = jest.spyOn(userService, 'deleteProfile');
            await userController.deleteProfile('userId', req);
            expect(userServiceSpy).toHaveBeenCalledWith('userId');
        });

        it('should return instance of User', async () => {
            
            const user = new User()

            jest.spyOn(userService, 'deleteProfile').mockResolvedValue(user);
            const result = await userController.deleteProfile('userId', req);
            expect(result).toBeInstanceOf(User);
        });        
    });
});