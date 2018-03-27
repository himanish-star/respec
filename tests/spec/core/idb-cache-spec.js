"use strict";

describe("Core - Idb Cache", () => {
  let IDBCache;
  beforeAll(done => {
    require(["core/idb-cache"], ({ IDBCache: idbCache }) => {
      IDBCache = idbCache;
      done();
    });
  });

  describe("put() method", () => {

    it("stores data in pairs of key and value", async () => {
      IDBCache = new IDBCache("test-cache", ["storeA", "storeB"]);
      await IDBCache.put("storeA", { prop: "pass store A" });
      await IDBCache.put("storeB", { prop: "pass store B" });
      expect(IDBCache.has("storeA")).toBe(true);
      expect(IDBCache.has("storeB")).toBe(true);
      const storeAData = IDBCache.get("storeA");
      const storeBData = IDBCache.get("storeB");
      expect(storeAData.prop).toBe("pass store A");
      expect(storeBData.prop).toBe("pass store B");
    });
  })
});
