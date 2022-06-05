import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('/signup')
	async signUp(@Body() body: AuthCredentialsDto): Promise<void> {
		return await this.authService.signUp(body)
	}

	@Post('/signin')
	async signIn(
		@Body() body: AuthCredentialsDto,
	): Promise<{ accessToken: string }> {
		return await this.authService.signIn(body)
	}
}
