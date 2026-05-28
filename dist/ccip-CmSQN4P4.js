#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const cliShared = require("./cli-shared-CH_aHhH2.js");
class OffchainLookupError extends cliShared.BaseError {
  constructor({ callbackSelector, cause, data, extraData, sender, urls }) {
    super(cause.shortMessage || "An error occurred while fetching for an offchain result.", {
      cause,
      metaMessages: [
        ...cause.metaMessages || [],
        cause.metaMessages?.length ? "" : [],
        "Offchain Gateway Call:",
        urls && [
          "  Gateway URL(s):",
          ...urls.map((url) => `    ${cliShared.getUrl(url)}`)
        ],
        `  Sender: ${sender}`,
        `  Data: ${data}`,
        `  Callback selector: ${callbackSelector}`,
        `  Extra data: ${extraData}`
      ].flat(),
      name: "OffchainLookupError"
    });
  }
}
class OffchainLookupResponseMalformedError extends cliShared.BaseError {
  constructor({ result, url }) {
    super("Offchain gateway response is malformed. Response data must be a hex value.", {
      metaMessages: [
        `Gateway URL: ${cliShared.getUrl(url)}`,
        `Response: ${cliShared.stringify(result)}`
      ],
      name: "OffchainLookupResponseMalformedError"
    });
  }
}
class OffchainLookupSenderMismatchError extends cliShared.BaseError {
  constructor({ sender, to }) {
    super("Reverted sender address does not match target contract address (`to`).", {
      metaMessages: [
        `Contract address: ${to}`,
        `OffchainLookup sender address: ${sender}`
      ],
      name: "OffchainLookupSenderMismatchError"
    });
  }
}
const offchainLookupSignature = "0x556f1830";
const offchainLookupAbiItem = {
  name: "OffchainLookup",
  type: "error",
  inputs: [
    {
      name: "sender",
      type: "address"
    },
    {
      name: "urls",
      type: "string[]"
    },
    {
      name: "callData",
      type: "bytes"
    },
    {
      name: "callbackFunction",
      type: "bytes4"
    },
    {
      name: "extraData",
      type: "bytes"
    }
  ]
};
async function offchainLookup(client, { blockNumber, blockTag, data, to }) {
  const { args } = cliShared.decodeErrorResult({
    data,
    abi: [offchainLookupAbiItem]
  });
  const [sender, urls, callData, callbackSelector, extraData] = args;
  const { ccipRead } = client;
  const ccipRequest_ = ccipRead && typeof ccipRead?.request === "function" ? ccipRead.request : ccipRequest;
  try {
    if (!cliShared.isAddressEqual(to, sender))
      throw new OffchainLookupSenderMismatchError({ sender, to });
    const result = urls.includes(cliShared.localBatchGatewayUrl) ? await cliShared.localBatchGatewayRequest({
      data: callData,
      ccipRequest: ccipRequest_
    }) : await ccipRequest_({ data: callData, sender, urls });
    const { data: data_ } = await cliShared.call(client, {
      blockNumber,
      blockTag,
      data: cliShared.concat([
        callbackSelector,
        cliShared.encodeAbiParameters([{ type: "bytes" }, { type: "bytes" }], [result, extraData])
      ]),
      to
    });
    return data_;
  } catch (err) {
    throw new OffchainLookupError({
      callbackSelector,
      cause: err,
      data,
      extraData,
      sender,
      urls
    });
  }
}
async function ccipRequest({ data, sender, urls }) {
  let error = new Error("An unknown error occurred.");
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const method = url.includes("{data}") ? "GET" : "POST";
    const body = method === "POST" ? { data, sender } : void 0;
    const headers = method === "POST" ? { "Content-Type": "application/json" } : {};
    try {
      const response = await fetch(url.replace("{sender}", sender.toLowerCase()).replace("{data}", data), {
        body: JSON.stringify(body),
        headers,
        method
      });
      let result;
      if (response.headers.get("Content-Type")?.startsWith("application/json")) {
        result = (await response.json()).data;
      } else {
        result = await response.text();
      }
      if (!response.ok) {
        error = new cliShared.HttpRequestError({
          body,
          details: result?.error ? cliShared.stringify(result.error) : response.statusText,
          headers: response.headers,
          status: response.status,
          url
        });
        continue;
      }
      if (!cliShared.isHex(result)) {
        error = new OffchainLookupResponseMalformedError({
          result,
          url
        });
        continue;
      }
      return result;
    } catch (err) {
      error = new cliShared.HttpRequestError({
        body,
        details: err.message,
        url
      });
    }
  }
  throw error;
}
exports.ccipRequest = ccipRequest;
exports.offchainLookup = offchainLookup;
exports.offchainLookupAbiItem = offchainLookupAbiItem;
exports.offchainLookupSignature = offchainLookupSignature;
