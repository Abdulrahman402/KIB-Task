import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User } from './schemas/user.schema';
import { CustomException } from 'src/common/filters/custom-exception.filter';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async currentUser(user_id) {
    const user = await this.userModel.findById(user_id).select('-password');

    if (!user) throw new CustomException('User not found');

    return user;
  }
}
