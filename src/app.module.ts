import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TasksModule } from './tasks/tasks.module'
// import { typeOrmConfig } from './config/typeorm.config'
import { AuthModule } from './auth/auth.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ConfigValidationSchema } from './config.schema'

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: [`.env.stage.${process.env.STAGE}`],
			validationSchema: ConfigValidationSchema,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				return {
					type: 'postgres',
					host: 'localhost',
					port: configService.get('DB_PORT'),
					username: configService.get('DB_USERNAME'),
					password: configService.get('DB_PASSWORD'),
					database: configService.get('DB_DATABASE'),
					autoLoadEntities: true,
					synchronize: true,
				}
			},
		}),
		TasksModule,
		AuthModule,
	],
})
export class AppModule {}
