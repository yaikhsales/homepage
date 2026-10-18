import { MongoClient, type Db, type MongoClientOptions } from "mongodb";

const options: MongoClientOptions = {
  serverSelectionTimeoutMS: 5_000,
  connectTimeoutMS: 5_000,
};

type GlobalWithNewsroomMongo = typeof globalThis & {
  __yaiNewsroomMongoClient?: Promise<MongoClient>;
};

const globalWithNewsroomMongo = globalThis as GlobalWithNewsroomMongo;

function getNewsroomClient(): Promise<MongoClient> {
  const uri = process.env.NEWSROOM_MONGO_URL;
  if (!uri) {
    return Promise.reject(new Error("NEWSROOM_MONGO_URL is not configured."));
  }
  if (!globalWithNewsroomMongo.__yaiNewsroomMongoClient) {
    globalWithNewsroomMongo.__yaiNewsroomMongoClient = new MongoClient(uri, options).connect();
  }
  return globalWithNewsroomMongo.__yaiNewsroomMongoClient;
}

/** Connect to the Newsroom's separate, read-only MongoDB source. */
export async function getNewsroomDb(): Promise<Db> {
  const client = await getNewsroomClient();
  return client.db(process.env.NEWSROOM_DB || "gk_newsroom");
}
