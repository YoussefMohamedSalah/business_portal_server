declare global {
	namespace NodeJS {
		interface ProcessEnv {
			SERVER_PORT?: number;
			SECRET_HASH?: string;
			DATABASE_TYPE?: string;
			DATABASE_HOST?: string;
			DATABASE_PORT?: any;
			DATABASE_NAME?: string;
			DATABASE_USER?: string;
			DATABASE_PASSWORD?: string;
			NODE_ENV?: string;
			OTP_SECRET_KEY?: string;
		}
	}
}

export { };
