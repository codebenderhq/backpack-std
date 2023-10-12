//https://docs.oramasearch.com/
import logger from "./logger.ts";
import { create, insert, persist, remove, restore, search } from "./deps.js";
//import { persist, restore } from "npm:@orama/plugin-data-persistence";

/**
 * A number, or a string containing a number.
 * @typedef {(number|string)} NumberLike
 */

/**
 * Set the magic number.
 * @param {NumberLike} x - The magic number.
 */
const get_kv = async () => {
  const db_path = window.isQARequest ? "qa-db" : "db";

  const kv_path = window._cwd ? `${window._cwd}/${db_path}` : undefined;
  console.log(kv_path);
  return await Deno.openKv(kv_path);
};

/**
 * BuiltIn DB
 *
 * ```js
 * // initalize db
 * const db = oomph.db('user')
 *
 * db.data = {
 * name: "Rawk Akani"
 * }
 * ```
 * @category database
 *
 * @param {string} name table name
 *
 * @return {OomphDB} oomphdb
 */
const db = (name: string) => {
  class OomphDB extends DB {}

  const oomphDB = new OomphDB();

  oomphDB.dbName = name;

  return oomphDB;
};

class DB {
  schema = {};
  dbName;
  oramaDB;
  //  for now search everything

  constructor() {
    this.dbName = this.constructor.name;
  }

  async search(term) {
    const kv = await get_kv();
    const res = await kv.get(["orama", this.dbName]);

    if (!res.value) {
      return [];
    }

    const newInstance = await restore("json", res.value);
    kv.close();
    return await search(newInstance, {
      term: term,
      properties: "*",
    });
  }
}
//https://deno.com/manual@v1.34.0/runtime/kv
globalThis.onload = (e: Event): void => {
  if (Object.isExtensible(Object.prototype)) {
    DB.prototype.kv = get_kv;
    DB.prototype.list = async function () {
      try {
        // Open the default database for the script.
        const kv = await get_kv();
        const prefix = [this.dbName];
        const data = [];

        for await (const entry of kv.list({ prefix })) {
          data.push(
            { key: entry.key, value: entry.value },
          );
        }

        kv.close();
        return data;
      } catch (e) {
        console.log("initaite error", e.message);
      }
    };
    DB.prototype.save = async function () {
      // Open the default database for the script.
      try {
        logger.info("db/save", { message: "attempting to save", obj: this });

        const kv = await get_kv();
        const id = this.id || crypto.randomUUID();
        const key = [this.dbName, id];
        const data = this.data;

        //    orama search init
        //        const res = await kv.get(["orama", this.dbName]);
        //        if (res.value) {
        //          this.oramaDB = await restore("json", res.value);
        //        } else {
        //          for (const [key, value] of Object.entries(data)) {
        //            this.schema[key] = typeof value;
        //          }
        //
        //          this.oramaDB = await create({ schema: this.schema });
        //        }
        //
        //        const cacheId = await insert(this.oramaDB, data);
        //        const JSONIndex = await persist(this.oramaDB, "json");
        //        await kv.set(["orama", this.dbName], JSONIndex);

        //        data.cacheId = cacheId;
        logger.info("db/save", { key, data });
        await kv.set(key, data);
        kv.close();
        return id;
      } catch (e) {
        console.log(e);
        e.log("issue saving", e.message);
      }
    };
    DB.prototype.read = async function (id) {
      try {
        // Open the default database for the script.
        const kv = await get_kv();

        const key = [this.dbName, id];
        // Persist an object at the users/alice key.
        const res = await kv.get(key);
        logger.info("db/read", { value: res.value });
        kv.close();
        return res;
      } catch (e) {
        e.log("initaite error", e);
      }
    };
    DB.prototype.update = async function (key) {
      // Open the default database for the script.
      try {
        logger.info("db/update", { message: "attempting to save", obj: this });

        const kv = await get_kv();
        const data = this.data;

        const currentRes = await kv.get(key);
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

        await remove(this.oramaDB, currentRes.value.cacheId);
        const cacheId = await insert(this.oramaDB, data);
        const JSONIndex = await persist(this.oramaDB, "json");
        await kv.set(["orama", this.dbName], JSONIndex);

        const updatedData = {
          ...currentRes.value,
          ...data,
        };
        updatedData.cacheId = cacheId;
        logger.info("db/update", {
          message: "about to save ",
          obj: updatedData,
        });
        const commitRes = await kv.atomic().check(currentRes).set(
          key,
          updatedData,
        ).commit();
        kv.close();
        return commitRes;
      } catch (e) {
        e.log("issue saving", e.message);
      }
    };
    DB.prototype.delete = async function (id) {
      try {
        // Open the default database for the script.
        const kv = await get_kv();

        const key = [this.dbName, id];
        const cacheRes = await kv.get(["orama", this.dbName]);
        const dataToDelete = await kv.get(key);
        const newInstance = await restore("json", cacheRes.value);
        await remove(newInstance, dataToDelete.value.cacheId);
        const JSONIndex = await persist(newInstance, "json");
        await kv.set(["orama", this.dbName], JSONIndex);

        // Persist an object at the users/alice key.
        const res = await kv.delete(key);
        logger.info("db/delete", { message: "deleted data of:", obj: key });
        kv.close();
        return res;
      } catch (e) {
        e.log("initaite error", e);
      }
    };
    DB.prototype.delete_all = async function () {
      try {
        // Open the default database for the script.
        const kv = await get_kv();
        const prefix = [this.dbName];
        const cacheRes = await kv.get(["orama", this.dbName]);
        const newInstance = await restore("json", cacheRes.value);

        for await (const entry of kv.list({ prefix })) {
          const dataToDelete = await kv.get(entry.key);
          await remove(newInstance, dataToDelete.value.cacheId);
          await kv.delete(entry.key);
        }
        const JSONIndex = await persist(newInstance, "json");
        await kv.set(["orama", this.dbName], JSONIndex);

        kv.close();
        return true;
      } catch (e) {
        console.log("initaite error", e.message);
      }
    };
  }
};

export { db, get_kv };
