"use strict";

describe("Core - Idb Cache", () => {
  let idbCache;
  beforeAll(done => {
    require(["core/idb-cache"], (IDBCache) => {
      idbCache = IDBCache;
      done();
    });
  });

  describe("put() method", () => {

    it("stores data in pairs of key and value", async () => {
      let IDBCache = new idbCache("test-cache", ["storeA", "storeB"]);
      await IDBCache.put("storeAKey", { prop: "pass store A" });
      await IDBCache.put("storeBKey", { prop: "pass store B" }, "storeB");
      expect(IDBCache.has("storeA")).toBe(true);
      expect(IDBCache.has("storeB")).toBe(true);
      const storeAData = IDBCache.get("storeA");
      const storeBData = IDBCache.get("storeB");
      expect(storeAData.storeAKey.prop).toBe("pass store A");
      expect(storeBData.storeBKey.prop).toBe("pass store B");
    });
  })
});
