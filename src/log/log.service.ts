import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './log.entity';
import { Injectable } from '@nestjs/common';
import { LogData } from './types/log-data.type';
import { LogQueryDto } from './dto/log-query.dto';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log) private readonly repository: Repository<Log>,
  ) {}

  async saveLog(logData: LogData): Promise<Log> {
    return await this.repository.save(logData);
  }

  async getLogs(queryParams: LogQueryDto): Promise<Log[]> {
    return this.repository.find({
      order: { timestamp: 'DESC' },
      where: { ...queryParams.getFilteringParams() },
    });
  }
}
