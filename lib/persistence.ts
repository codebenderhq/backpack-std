import logger from "./logger.ts";

//https://deno.com/manual@v1.34.0/runtime/kv
globalThis.onload = (e: Event): void => {
  logger(`got ${e.type} event in onload function (imported)`, "doll");

  if (Object.isExtensible(Object.prototype)) {
    class DB {}

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
        const key = [this.constructor.name, id];
        const value = this.data;
        logger(key, this.data);
        // Persist an object at the users/alice key.
        await kv.set(key, value);
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

        const key = [this.constructor.name, id];
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
        for await (const entry of kv.list({ prefix })) {
          await kv.delete(entry.key);
        }
        return true;
      } catch (e) {
        console.log("initaite error", e.message);
      }
    };
    globalThis.DB = DB;
  }
};
