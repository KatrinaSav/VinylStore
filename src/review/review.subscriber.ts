import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Actions } from '../log/actions.enum';
import { ObjectTypes } from '../log/object-types.enum';
import { Review } from './review.entity';
import { LogService } from '../log/log.service';

@EventSubscriber()
export class ReviewSubscriber implements EntitySubscriberInterface<Review> {
  constructor(
    dataSource: DataSource,
    private readonly logService: LogService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Review;
  }

  async afterInsert(event: InsertEvent<Review>) {
    await this.logService.saveLog({
      userId: event.queryRunner.data.toString(),
      action: Actions.Create,
      objectType: ObjectTypes.Review,
      objectId: event.entityId.toString(),
    });
  }

  async afterUpdate(event: UpdateEvent<Review>) {
    await this.logService.saveLog({
      userId: event.queryRunner.data.toString(),
      action: Actions.Update,
      objectType: ObjectTypes.Review,
      objectId: event.entity.id,
    });
  }

  async afterRemove(event: RemoveEvent<Review>) {
    await this.logService.saveLog({
      userId: event.queryRunner.data.toString(),
      action: Actions.Delete,
      objectType: ObjectTypes.Review,
      objectId: event.entityId,
    });
  }
}
