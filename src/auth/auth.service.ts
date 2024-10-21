import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { compare, hashSync } from 'bcrypt';
import { AuthDto } from 'src/auth/auth.dto';
import { CustomException } from 'src/common/filters/custom-exception.filter';
import { JwtService } from '@nestjs/jwt';
import { omit } from 'ramda';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccessToken(payload: { _id: Types.ObjectId }) {
    try {
      return this.jwtService.signAsync(payload, { expiresIn: '1d' });
    } catch (e) {
      console.log(e);
    }
  }

  async createRefreshToken(payload: { _id: Types.ObjectId }) {
    try {
      return this.jwtService.signAsync(payload, { expiresIn: '7d' });
    } catch (e) {
      console.log(e);
    }
  }

  async signUp(signUpData: AuthDto) {
    const { username, password } = signUpData;
    let user = await this.userModel.findOne({ username });

    if (user) throw new CustomException('User already registered');

    const hashedPassword = hashSync(password, 10);

    user = await this.userModel.create({
      username,
      password: hashedPassword,
    });

    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken({ _id: user._id }),
      this.createRefreshToken({ _id: user._id }),
    ]);

    return {
      user: omit(['password'], user.toObject()),
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async login(loginBody: AuthDto) {
    const user = await this.userModel.findOne({ username: loginBody.username });

    if (!user) throw new CustomException('Invalid phone or password');

    const matchPassword = await compare(loginBody.password, user.password);

    if (!matchPassword) throw new CustomException('Invalid phone or password');

    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken({ _id: user._id }),
      this.createRefreshToken({ _id: user._id }),
    ]);

    return {
      user: omit(['password'], user.toObject()),
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
