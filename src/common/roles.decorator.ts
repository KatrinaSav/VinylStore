import { Reflector } from '@nestjs/core';

export const AccessRoles = Reflector.createDecorator<string[]>();
