import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeEmail,
  normalizePhone,
  registrationConflict,
  selectBrevoSender,
  secureHashEqual,
  validateRegistration,
} from "../lib/authSecurity.js";

test("normalizes account identifiers without accepting malformed values", () => {
  assert.equal(normalizeEmail(" Person@Example.COM "), "person@example.com");
  assert.equal(normalizeEmail("not-an-email"), null);
  assert.equal(normalizePhone(" 0803 123 4567 "), "08031234567");
  assert.equal(normalizePhone("123"), null);
});

test("registration validation rejects weak and incorrectly typed input", () => {
  assert.equal(validateRegistration({}).code, "VALIDATION_ERROR");
  assert.equal(validateRegistration({ fullName: {}, email: "a@b.com", phone: "08031234567", password: "password", role: "customer" }).code, "VALIDATION_ERROR");
  assert.equal(validateRegistration({ fullName: "Ada", email: "bad", phone: "08031234567", password: "password", role: "customer" }).code, "INVALID_EMAIL");
  assert.equal(validateRegistration({ fullName: "Ada", email: "ada@example.com", phone: "08031234567", password: "short", role: "customer" }).code, "WEAK_PASSWORD");
});

test("registration validation returns normalized trusted values", () => {
  assert.deepEqual(
    validateRegistration({ fullName: " Ada Okafor ", email: "ADA@EXAMPLE.COM", phone: "0803 123 4567", password: "securePass1", role: "artisan", address: " Ikeja " }).value,
    { fullName: "Ada Okafor", email: "ada@example.com", phone: "08031234567", password: "securePass1", role: "artisan", address: "Ikeja" },
  );
});

test("OTP hashes compare safely and reject malformed hashes", () => {
  const hash = "a".repeat(64);
  assert.equal(secureHashEqual(hash, hash), true);
  assert.equal(secureHashEqual(hash, "b".repeat(64)), false);
  assert.equal(secureHashEqual(hash, "bad"), false);
});

test("an unverified matching account resumes registration instead of returning 409", () => {
  const emailUser = { id: "user-1", verified: false, phone: "08031234567" };
  const phoneUser = { id: "user-1" };
  assert.deepEqual(registrationConflict(emailUser, phoneUser, "08031234567"), { action: "resume", userId: "user-1" });
  assert.equal(registrationConflict({ ...emailUser, verified: true }, phoneUser, "08031234567").code, "EMAIL_EXISTS");
  assert.equal(registrationConflict(emailUser, { id: "other-user" }, "08031234567").code, "PHONE_EXISTS");
});

test("Brevo sender selection prefers configuration then an active account sender", () => {
  const senders = [
    { active: false, email: "old@example.com", name: "Old" },
    { active: true, email: "verified@example.com", name: "Verified" },
  ];
  assert.deepEqual(selectBrevoSender("configured@example.com", "HandiPlug", senders), { email: "configured@example.com", name: "HandiPlug" });
  assert.deepEqual(selectBrevoSender(null, null, senders), { email: "verified@example.com", name: "Verified" });
  assert.equal(selectBrevoSender(null, null, []), null);
});
