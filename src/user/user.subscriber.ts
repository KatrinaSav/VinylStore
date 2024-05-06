import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { User } from './user.entity';
import { LogService } from '../log/log.service';
import { Actions } from '../log/actions.enum';
import { ObjectTypes } from '../log/object-types.enum';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(
    dataSource: DataSource,
    private readonly logService: LogService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async afterInsert(event: InsertEvent<User>) {
    await this.logService.saveLog({
      userId: event.entityId.toString(),
      action: Actions.Create,
      objectType: ObjectTypes.Profile,
      objectId: event.entityId.toString(),
    });
  }

  async afterUpdate(event: UpdateEvent<User>) {
    await this.logService.saveLog({
      userId: event.entity.id,
      action: Actions.Update,
      objectType: ObjectTypes.Profile,
      objectId: event.entity.id,
    });
  }

  async afterRemove(event: RemoveEvent<User>) {
    await this.logService.saveLog({
      userId: event.entityId,
      action: Actions.Delete,
      objectType: ObjectTypes.Profile,
      objectId: event.entityId,
    });
  }
}
