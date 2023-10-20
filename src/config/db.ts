import dotenv from "dotenv";
import { createConnection, getConnectionOptions } from 'typeorm';

// constants
dotenv.config();

export const connectToDataBase = async (entities: any[], subscribers: any[]) => {
	const databasePort = process.env.DATABASE_PORT;
	const databaseType = process.env.DATABASE_TYPE;
	const databaseHost = process.env.DATABASE_HOST;
	const databaseUrl = process.env.DATABASE_URL;
	const databaseUsername = process.env.DATABASE_USERNAME;
	const databasePassword = process.env.DATABASE_PASSWORD;
	const databaseName = process.env.DATABASE_NAME;
	let connectionOptions;


	if (process.env.NODE_ENV === 'production') {
		// Use databaseUrl provided by Render's database in production
		connectionOptions = await getConnectionOptions();
		try {
			await createConnection({
				type: databaseType as any,
				url: databaseUrl,
				entities: entities,
				synchronize: true,
				subscribers: subscribers,
				ssl: true
			});
			console.log(`You Are Now Connected to Port ${process.env.SERVER_PORT} With Database At Port: ${process.env.DATABASE_PORT}`)
		} catch (error) {
			console.log(error);
			console.log('Unable To Connect To Database');
			process.exit(1);
		}
	} else {
		try {
			await createConnection({
				type: databaseType as any,
				host: databaseHost as any,
				port: databasePort as any,
				username: databaseUsername as any,
				password: databasePassword as any,
				database: databaseName as any,
				entities: entities,
				synchronize: true,
				subscribers: subscribers,
			});
			console.log(`You Are Now Connected to Port ${process.env.SERVER_PORT} With Database At Port: ${process.env.DATABASE_PORT}`)
		} catch (error) {
			console.log(error);
			console.log('Unable To Connect To Database');
			process.exit(1);
		}
	}
}

