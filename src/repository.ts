import { MongoClient, ServerApiVersion, Db, Collection, Document } from "mongodb";
import log from "./log";

export default class Repository {
  public client: MongoClient;
  public collection: Collection<Document>;
  public db: Db;

  constructor(uri: string) {
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    const match = uri.match(/\/([a-zA-Z0-9_\-]{0,100})\?/gm);
    this.db = this.client.db(match ? match[0].replace('\/', '').replace('?', '') : 'test');
    this.collection = this.db.collection('discord-sniper');

    this.collection.find();
  }

  async start() {
    try {
      log.info('=> Connecting to MongoDB...');
      // Connect the client to the server (optional starting in v4.7)
      await this.client.connect();

      // Send a ping to confirm a successful connection
      await this.client.db("admin").command({ ping: 1 });
      log.info("=> Connected to MongoDB!");
    } catch (err) {
      log.error(err);
    } finally {
      // Ensures that the client will close when you finish/error
      // await this.client.close();
    }
  }

  async find(args: any) {
    try {
      const collections: Document[] = [];
      const cursor = this.collection.find(args);
      if (await this.collection.countDocuments(args) === 0) {
        log.info('No such documents...');
      }

      for await (const doc of cursor) {
        collections.push(doc);
      }
      return collections;
    } catch (err) {
      log.error(err);
    }
  }

  async insertOne(args: any) {
    try {
      const { insertedId } = await this.collection.insertOne(args);
      return this.collection.findOne({ _id: insertedId });
    } catch (err) {
      log.error(err);
    }
  }

  async findOne(args: any) {
    return await this.collection.findOne(args);
  }
}