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
      console.log(idbCache);
      let IDBCache = new idbCache("test-cache", ["storeA", "storeB"]);
      await IDBCache.put("storeAKey", { prop: "pass store A" });
      await IDBCache.put("storeBKey", { prop: "pass store B" }, "storeB");
      console.log(IDBCache);
      expect(IDBCache.stores.includes("storeA")).toBe(true);
      expect(IDBCache.stores.includes("storeB")).toBe(true);
      const storeAData = await IDBCache.match("storeAKey", "storeA");
      const storeBData = await IDBCache.match("storeBKey", "storeB");
      expect(storeAData.prop).toBe("pass store A");
      expect(storeBData.prop).toBe("pass store B");
    });
  })
});
