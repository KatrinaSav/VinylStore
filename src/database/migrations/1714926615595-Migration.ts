import { MigrationInterface, QueryRunner } from 'typeorm';
import { Client as Discogs } from 'disconnect';

export class Migration1714926615595 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const db = new Discogs({
      userToken: process.env.DISCOGS_TOKEN,
    }).database();

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS migration_records (
        id SERIAL PRIMARY KEY,
        vinyl_record_id UUID NOT NULL
      );
    `);

    for (let i = 300, counter = 0; counter < 50; i++) {
      try {
        const data = await db.getRelease(i);
        const response = await fetch(data.images[0].resource_url);
        const file = await response.arrayBuffer();
        const image = await queryRunner.query(
          `INSERT INTO image (data) VALUES (decode('${Buffer.from(file).toString('hex')}', 'hex')) RETURNING id;`,
        );
        const result = await queryRunner.query(
          `INSERT INTO vinyl_record ("name", "authorName", "description", "price", "imageId") VALUES
            (E'${data.title.replace(/'/g, "\\'")}',
            E'${data.artists[0].name.replace(/'/g, "\\'")}', 
            E'Released in ${data.released}. Genre: ${data.genres[0]}, style: ${data.styles[0]}.',
            ${data.lowest_price || 20},
            '${image[0].id}')
          RETURNING id;`,
        );

        await queryRunner.query(
          `INSERT INTO migration_records (vinyl_record_id) VALUES ('${result[0].id}');`,
        );

        counter++;
      } catch (e) {
        console.log(e.message);
        continue;
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM vinyl_record WHERE id IN (
        SELECT vinyl_record_id FROM migration_records
      );
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS migration_records;
    `);
  }
}
