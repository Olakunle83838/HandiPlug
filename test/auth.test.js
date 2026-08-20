import test from "node:test";
import assert from "node:assert/strict";

import {
  getPostAuthPath,
  normalizeIdentifier,
  normalizeOtpCredentials,
} from "../src/lib/auth.js";

test("OTP credentials preserve the email and six-digit code", () => {
  assert.deepEqual(
    normalizeOtpCredentials({
      email: "  Person@Example.com ",
      code: "246339",
    }),
    { email: "person@example.com", otp: "246339" },
  );
});

test("OTP credentials reject an incomplete code", () => {
  assert.throws(
    () => normalizeOtpCredentials({ email: "person@example.com", code: "246" }),
    /6-digit/,
  );
});

test("login identifiers normalize email without changing phone numbers", () => {
  assert.equal(normalizeIdentifier(" Person@Example.com "), "person@example.com");
  assert.equal(normalizeIdentifier(" 0803 123 4567 "), "0803 123 4567");
});

test("post-auth routing respects each account role and artisan setup state", () => {
  assert.equal(getPostAuthPath({ role: "admin" }), "/admin");
  assert.equal(getPostAuthPath({ role: "artisan", trade: "plumber" }), "/artisan/dashboard");
  assert.equal(getPostAuthPath({ role: "artisan", trade: null }), "/artisan/build-profile");
  assert.equal(getPostAuthPath({ role: "customer" }), "/home");
});
