import "../../__tests__/test-helpers/setup";
import { testBridge } from "../../__tests__/test-helpers/bridge";
import celo from "./datasets/celo.scanAccounts.1";
import type { Transaction } from "./types";
import type { DatasetTest } from "@ledgerhq/types-live";

const { Buffer } = require("../../../node_modules/buffer");

Object.defineProperties(globalThis, {
  Buffer: { value: Buffer },
});

const dataset: DatasetTest<Transaction> = {
  implementations: ["js"],
  currencies: {
    celo,
  },
};

testBridge(dataset);
