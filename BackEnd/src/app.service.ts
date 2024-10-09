// app.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // Method to retrieve a greeting message
  getHello(): string {
    // Return a greeting message
    throw new HttpException("empty", HttpStatus.METHOD_NOT_ALLOWED)
    return 'Hello World!';
  }
}
