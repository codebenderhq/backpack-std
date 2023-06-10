import { create, insert, remove, search } from "npm:@orama/orama";
import { persist, restore } from "npm:@orama/plugin-data-persistence";
import logger from "./logger.ts";

//https://deno.com/manual@v1.34.0/runtime/kv
globalThis.onload = (e: Event): void => {
  logger(`got ${e.type} event in onload function (imported)`, "doll");

  if (Object.isExtensible(Object.prototype)) {
    class DB {
      schema = {};
      dbName;
      oramaDB;
      //  for now search everything

    constructor() {
      this.dbName = this.constructor.name
    }
    async search(term) {
      const kv = await Deno.openKv();
      const res = await kv.get(["orama", this.dbName]);

      if(!res.value) {
        return []
      }

      const newInstance = await restore("json", res.value);
      return await search(newInstance, {
        term: term,
        properties: "*",
      });
    }
    }

    DB.prototype.list = async function () {
      try {
        // Open the default database for the script.
        const kv = await Deno.openKv();

        const prefix = [this.constructor.name];
        const data = [];

        for await (const entry of kv.list({ prefix })) {
          data.push(
            { key: entry.key, value: entry.value },
            );
        }

        return data;
      } catch (e) {
        console.log("initaite error", e.message);
      }
    };
    DB.prototype.save = async function () {
      // Open the default database for the script.
  try {
    logger("attempting to save", this);

    const kv = await Deno.openKv();
    const id = this.id || crypto.randomUUID();
    this.dbName = this.constructor.name;
    const key = [this.dbName, id];
    const data = this.data;

    //    orama search init
    const res = await kv.get(["orama", this.dbName]);
    if (res.value) {
      this.oramaDB = await restore("json", res.value);
    } else {
      for (const [key, value] of Object.entries(data)) {
        this.schema[key] = typeof value;
      }

      this.oramaDB = await create({ schema: this.schema });
    }

    const cacheId = await insert(this.oramaDB, data);
    const JSONIndex = await persist(this.oramaDB, "json");
    await kv.set(["orama", this.dbName], JSONIndex);

    data.cacheId = cacheId;
        logger(key, data);
    await kv.set(key, data);
    return id;
  } catch (e) {
    e.log("issue saving", e.message);
  }
    };
    DB.prototype.read = async function (id) {
      try {
        // Open the default database for the script.
        const kv = await Deno.openKv();

        const key = [this.constructor.name, id];
        // Persist an object at the users/alice key.
        const res = await kv.get(key);
        logger("key", res.key);
        logger("value", res.value);
        return res;
      } catch (e) {
        e.log("initaite error", e);
      }
    };
    DB.prototype.delete = async function (id) {
      try {
        // Open the default database for the script.
        const kv = await Deno.openKv();

        const key = [this.dbName, id];
        const cacheRes = await kv.get(["orama", this.dbName]);
        const dataToDelete = await kv.get(key);
        const newInstance = await restore("json", cacheRes.value);
        await remove(newInstance, dataToDelete.value.cacheId);
        const JSONIndex = await persist(newInstance, "json");
        await kv.set(["orama", this.dbName], JSONIndex);

        // Persist an object at the users/alice key.
        const res = await kv.delete(key);
        logger("deleted data of:", key);
        return res;
      } catch (e) {
         e.log("initaite error", e);
      }
    };
    DB.prototype.delete_all = async function () {
      try {
        // Open the default database for the script.
        const kv = await Deno.openKv();

        const prefix = [this.constructor.name];
        const cacheRes = await kv.get(["orama", this.dbName]);
        const newInstance = await restore("json", cacheRes.value);

        for await (const entry of kv.list({ prefix })) {
          const dataToDelete = await kv.get(entry.key);
          await remove(newInstance, dataToDelete.value.cacheId);
          await kv.delete(entry.key);
        }
        const JSONIndex = await persist(newInstance, "json");
        await kv.set(["orama", this.dbName], JSONIndex);

        return true;
      } catch (e) {
        console.log("initaite error", e.message);
      }
    };
    globalThis.DB = DB;
  }
};
