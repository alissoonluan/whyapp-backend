import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import 'dotenv/config';
import helmet from 'helmet';
import { corsOptions } from './utils/cors.options';
import { NestExpressApplication } from '@nestjs/platform-express';

const SERVER_PORT = process.env.SERVER_PORT || 3000;
const SWAGGER_DOCS_PATH = process.env.SWAGGER_DOCS_PATH || 'v1/docs/api';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: corsOptions,
  });
  app.useBodyParser('json', { limit: '5mb' });
  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('Documentação WhyApp - Backend')
    .setDescription(
      `Aqui você encontra todos os endpoints da aplicação. Qualquer dúvida, entre em contato com o gerenciador do sistema.
      \n<em>ATENÇÃO!</em> Ao fazer uma requisição, o banco de dados pode ser alterado. Se isso ocorrer, por favor, remova os dados que você adicionou.
      \n<i><b>Mais detalhes sobre o funcionamento você encontra na <a alt='docs' href='https://github.com/bear-system-dev/whyapp-backend/tree/dev?tab=readme-ov-file#whyapp-backend' target='_blank'>documentação</a> do repositório</b></i>
      `,
    )
    .setVersion('v1.5.3')
    .setLicense(
      `©2023-2024 Bear System | Todos os direitos reservados`,
      `https://bearsystem.onrender.com`,
    )
    .addTag('Home')
    .addTag('Authentication')
    .addTag('User')
    .addTag('Group')
    .addTag('Group Messages')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_DOCS_PATH, app, document);

  await app.listen(SERVER_PORT);
}
bootstrap();
