"use strict";

fdescribe("Core - Idb Cache", () => {
  let idbCache;
  beforeAll(done => {
    require(["core/idb-cache"], ({default: IDBCache}) => {
      idbCache = IDBCache;
      done();
    });
  });

  fdescribe("put() method", () => {

    fit("stores data in pairs of key and value", async () => {
      let cache = new idbCache("test-cache", ["storeA", "storeB"]);
      await cache.put("storeAKey", { prop: "pass store A" });
      await cache.put("storeBKey", { prop: "pass store B" }, "storeB");
      expect(cache.stores.includes("storeA")).toBe(true);
      expect(cache.stores.includes("storeB")).toBe(true);
      const storeAData = await cache.match("storeAKey", "storeA");
      const storeBData = await cache.match("storeBKey", "storeB");
      expect(storeAData.prop).toBe("pass store A");
      expect(storeBData.prop).toBe("pass store B");
      cache.destroy().then(data => {
        console.log(data);
      });
    });
  });

  fdescribe("keys() method", () => {
    fit("retrieves all record keys for all objects in the object store", async () => {
      let cache = new idbCache("test-cache", ["storeA"]);
      const testKeys = {
       key1: "this is key1",
       key2: "this is key2",
       key3: "this is key3",
       key4: "this is key4"
      };
      await cache.put("key1", testKeys.key1);
      await cache.put("key2", testKeys.key2);
      await cache.put("key3", testKeys.key3);
      await cache.put("key4", testKeys.key4);
      let fetchedKeys = await cache.keys("storeA");
      expect(fetchedKeys).toEqual(Object.keys(testKeys));
      cache.destroy().then(data => {
        console.log(data);
      });
    });
  });
});
