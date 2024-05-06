import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { VinylRecord } from './vinyl-record.entity';
import { LogService } from '../log/log.service';
import { Actions } from '../log/actions.enum';
import { ObjectTypes } from '../log/object-types.enum';

@EventSubscriber()
export class VinylRecordSubscriber
  implements EntitySubscriberInterface<VinylRecord>
{
  constructor(
    dataSource: DataSource,
    private readonly logService: LogService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return VinylRecord;
  }

  async afterInsert(event: InsertEvent<VinylRecord>) {
    await this.logService.saveLog({
      userId: event.queryRunner.data.toString(),
      action: Actions.Create,
      objectType: ObjectTypes.VinylRecord,
      objectId: event.entityId.toString(),
    });
  }

  async afterUpdate(event: UpdateEvent<VinylRecord>) {
    await this.logService.saveLog({
      userId: event.queryRunner.data.toString(),
      action: Actions.Update,
      objectType: ObjectTypes.VinylRecord,
      objectId: event.entity.id,
    });
  }

  async afterRemove(event: RemoveEvent<VinylRecord>) {
    await this.logService.saveLog({
      userId: event.queryRunner.data.toString(),
      action: Actions.Delete,
      objectType: ObjectTypes.VinylRecord,
      objectId: event.entityId,
    });
  }
}
