"use strict";

fdescribe("Core - Idb Cache", () => {
  let IDBCache;
  beforeAll(done => {
    require(["core/idb-cache"], ({default: idbClass}) => {
      IDBCache = idbClass;
      done();
    });
  });

  fdescribe("put() method", () => {

    fit("sets a value for a key in a given store", async () => {
      let cache = new IDBCache("test-cache-put", ["storeA", "storeB"]);
      await cache.put("storeAKey", { prop: "pass store A" });
      await cache.put("storeBKey", { prop: "pass store B" }, "storeB");
      expect(cache.stores.includes("storeA")).toBe(true);
      expect(cache.stores.includes("storeB")).toBe(true);
      const storeAData = await cache.match("storeAKey", "storeA");
      const storeBData = await cache.match("storeBKey", "storeB");
      expect(storeAData.prop).toBe("pass store A");
      expect(storeBData.prop).toBe("pass store B");
    });
  });

  fdescribe("keys() method", () => {

    fit("retrieves all record keys for all objects in the object store", async () => {
      let cache = new IDBCache("test-cache-keys", ["storeA"]);
      const testMap = new Map([
        ['key1', 'this is key1'],
        ['key2', 'this is key2'],
        ['key3', 'this is key3'],
        ['key4', 'this is key4'],
      ]);
      const promisesToPut = Array.from(testMap).map(([key, value]) => {
        return cache.put(key, value);
      });
      await Promise.all(promisesToPut);
      let fetchedKeys = await cache.keys("storeA");
      expect(fetchedKeys).toEqual(['key1', 'key2', 'key3', 'key4']);
    });
  });

  fdescribe("match() method", () => {

    fit("gets a value of key from a given store", async () => {
      let cache = new IDBCache("test-cache-match", ["storeA"]);
      const testMap = new Map([
        ['key1', 'this is key1'],
        ['key2', 'this is key2'],
        ['key3', 'this is key3'],
        ['key4', 'this is key4'],
      ]);
      const promisesToPut = Array.from(testMap).map(([key, value]) => {
        return cache.put(key, value);
      });
      await Promise.all(promisesToPut);
      const promisesToMatch = Array.from(testMap).map(([key, value]) => {
        return cache.match(key);
      });
      const values = await Promise.all(promisesToMatch);
      const valueIterator = testMap.values();
      values.forEach(value => {
        expect(value).toEqual(valueIterator.next().value);
      })
    });
  });

  fdescribe("delete() method", () => {

    fit("deletes a key-value pair from a given store", async () => {
      let cache = new IDBCache("test-cache-delete", ["storeA"]);
      const testMap = new Map([
        ['key1', 'this is key1'],
        ['key2', 'this is key2'],
        ['key3', 'this is key3'],
        ['key4', 'this is key4']
      ]);
      const promisesToPut = Array.from(testMap).map(([key, value]) => {
        return cache.put(key, value);
      });
      await Promise.all(promisesToPut);
      await cache.delete("key3");
      const keysList = await cache.keys("storeA");
      expect(keysList.includes("key3")).toBeFalsy();
      const promisesToMatch = keysList.map((key) => {
        return cache.match(key);
      });
      const values = await Promise.all(promisesToMatch);
      values.forEach(value => {
        expect(value).toEqual(testMap.get(keysList.shift()));
      })
    });
  });

  fdescribe("clear() method", () => {

    fit("clears an object store", async () => {
      let cache = new IDBCache("test-cache-clear", ["storeA"]);
      const testMap = new Map([
        ['key1', 'this is key1'],
        ['key2', 'this is key2'],
        ['key3', 'this is key3'],
        ['key4', 'this is key4']
      ]);
      const promisesToPut = Array.from(testMap).map(([key, value]) => {
        return cache.put(key, value);
      });
      await Promise.all(promisesToPut);
      await cache.clear("storeA");
      const keys = await cache.keys("storeA");
      expect(keys.length).toEqual(0);
    });
  });

  fdescribe("constructor", () => {

    fit("creates a new IDB database", async () => {
      const cache = new IDBCache("test-cache-constructor", ["storeA", "storeB"]);
      expect(cache.defaultStore).toEqual("storeA");
      expect(cache.stores).toEqual(["storeA", "storeB"]);
      expect(cache.version).toEqual(1);
      expect(cache.maxAge).toEqual(86400000);
      expect(cache.name).toEqual("test-cache-constructor");
    });
  });
});
