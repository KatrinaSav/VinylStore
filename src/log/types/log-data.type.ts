import { Actions } from '../actions.enum';
import { ObjectTypes } from '../object-types.enum';

export type LogData = {
  userId?: string;
  action: Actions;
  objectType: ObjectTypes;
  objectId: string;
};
