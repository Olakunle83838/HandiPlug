import test from "node:test";
import assert from "node:assert/strict";

import { createOtpPayload } from "../src/lib/otpPayload.js";

test("maps the OTP screen credentials to the backend payload", () => {
  assert.deepEqual(
    createOtpPayload({ email: " Person@Example.com ", code: "535009" }),
    { email: "person@example.com", otp: "535009" },
  );
});

test("rejects incomplete OTP credentials before making a request", () => {
  assert.throws(
    () => createOtpPayload({ email: "person@example.com", code: "535" }),
    /6-digit/,
  );
});
