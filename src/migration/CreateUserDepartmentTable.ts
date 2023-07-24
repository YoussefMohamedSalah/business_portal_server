import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserDepartmentTable1596788188537 implements MigrationInterface {
    name = 'CreateUserDepartmentTable1596788188537'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_department" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "can_read" character varying NOT NULL DEFAULT 'NO',
            "can_write" character varying NOT NULL DEFAULT 'NO',
            "can_update" character varying NOT NULL DEFAULT 'NO',
            "can_delete" character varying NOT NULL DEFAULT 'NO',
            "userId" uuid NOT NULL,
            "departmentId" integer NOT NULL,
            CONSTRAINT "PK_9f7109b6b4666c0c7fd3513125f" PRIMARY KEY ("id")
        )`);
        await queryRunner.query(`ALTER TABLE "user_department" ADD CONSTRAINT "FK_c5a1b5c4ebc2c1f91b2bff0e106" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_department" ADD CONSTRAINT "FK_5eb6d5c95b752d7a6ce2c1d7b27" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_department" DROP CONSTRAINT "FK_5eb6d5c95b752d7a6ce2c1d7b27"`);
        await queryRunner.query(`ALTER TABLE "user_department" DROP CONSTRAINT "FK_c5a1b5c4ebc2c1f91b2bff0e106"`);
        await queryRunner.query(`DROP TABLE "user_department"`);
    }

}