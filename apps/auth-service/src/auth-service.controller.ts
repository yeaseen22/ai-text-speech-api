import { Body, Controller, Post, Query } from "@nestjs/common";
import { AuthServiceService } from "./auth-service.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@app/shared";
import { Repository } from "typeorm";
import { LoginUserDto, RegisterUserDto } from "@app/shared";
import { HttpException, HttpStatus } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";


@Controller("auth")
export class AuthServiceController {
  private userClient: ClientProxy;

  constructor(
    private readonly authServiceService: AuthServiceService,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) { }


  /**
   * REGISTER USER CONTROLLER
   * @param body 
   * @returns 
   */
  // region: Register User
  @Post('register')
  async register(@Body() body: RegisterUserDto): Promise<{}> {
    try {
      const { first_name, last_name, email, username, password, image_file } = body;

      if (!email || !username || !password) {
        throw new HttpException('Missing required fields', HttpStatus.BAD_REQUEST);
      }

      const newUser = await this.authServiceService.register({
        first_name,
        last_name,
        email,
        username,
        password,
        image_file,
      });

      return {
        status: 201,
        success: true,
        message: 'User is Registered!',
        data: {
          id: newUser?.id,
          username: newUser?.username,
          email: newUser?.email,
          image_url: newUser?.image_url || 'default.png', // Handle optional image URL
          created_at: newUser?.created_at.getTime(),
          updated_at: newUser?.updated_at.getTime(),
        },
      };

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  /**
   * LOGIN USER CONTROLLER
   * @param loginUserDto 
   * @returns 
   */
  // region: Login User
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const loginData = await this.authServiceService.login(loginUserDto);
      
      return {
        status: 200,
        success: true,
        message: 'Logged in successfully!',
        data: {
          id: loginData.id,
          username: loginData.username,
          email: loginData.email,
          image_url: loginData.image_url,
          created_at: loginData.created_at.getTime(),
          updated_at: loginData.updated_at.getTime(),
          accessToken: loginData.accessToken
        }
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * VERIFY USER CONTROLLER
   * @param body 
   * @param query 
   */
  // region: Verify User
  @Post('verify')
  async verify(@Body() body: { usernameOrEmail: string }, @Query() query: { verifyCode: string }): Promise<void> {
    const { usernameOrEmail } = body;
    const { verifyCode } = query;

    console.log('BODY AND QUERY ', body, query);
  }

  // region Message Receive Login
  // @MessagePattern({ cmd: "verify-me" })
  // login(user: any) {
  //   return {
  //     token: "token",
  //     user,
  //   };
  // }

}
