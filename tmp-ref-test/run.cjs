// Runtime verification of the reference number generator.
const assert = require('node:assert');

// Minimal localStorage mock so the service can persist registrations.
const store = new Map();
globalThis.localStorage = {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key)
};

const service = require('./services/registrationService.cjs');

const NEW_PATTERN = /^ACC-[A-Z0-9]{4}-[A-Z0-9]{5}$/;

(async () => {
  const codes = [];
  for (let i = 0; i < 8; i += 1) {
    const registration = await service.submitRegistration({
      fullName: 'Test User ' + i,
      email: 'user' + i + '@example.com',
      phone: '0917 000 000' + i,
      address: 'Test Address',
      dateOfBirth: '2000-01-01',
      gender: 'Male',
      course: 'BS Information Technology',
      department: 'Information and Communications Technology',
      expectedGraduationYear: 2026
    });
    codes.push(registration.referenceNumber);
  }

  console.log('Generated codes:');
  codes.forEach((code) => console.log('  ' + code));

  // 1. Every code matches the new format.
  assert.ok(codes.every((code) => NEW_PATTERN.test(code)), 'every code matches ACC-XXXX-XXXXX');

  // 2. Every code mixes letters AND numbers.
  assert.ok(
    codes.every((code) => /[A-Z]/.test(code.slice(4)) && /[0-9]/.test(code.slice(4))),
    'every code mixes letters and numbers'
  );

  // 3. Codes are unique.
  assert.strictEqual(new Set(codes).size, codes.length, 'codes are unique');

  // 4. Lookup by reference still works.
  const found = service.findRegistrationByReference(codes[3]);
  assert.ok(found && found.referenceNumber === codes[3], 'lookup finds the saved registration');

  // 5. Backward compatibility - old sequential codes still validate.
  assert.ok(service.isValidReferenceNumberFormat('ACC-2026-00125'), 'old-format codes still validate');
  assert.ok(!service.isValidReferenceNumberFormat('HELLO-WORLD'), 'junk is rejected');
  assert.ok(!service.isValidReferenceNumberFormat('ACC-12-345'), 'wrong shape is rejected');

  // 6. Case/space normalization still works.
  assert.strictEqual(service.normalizeReferenceNumber(' acc-2b23-55b19 '), 'ACC-2B23-55B19');

  console.log('\nAll assertions passed');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});