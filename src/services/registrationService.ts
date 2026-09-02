// Persistence layer for alumni registrations.
//
// Registrations are currently stored in localStorage so the complete
// submit -> reference number -> status-check flow works without the backend.
// When the Supabase/PHP backend is wired up, only this file changes:
// submitRegistration() becomes an insert and findRegistrationByReference()
// becomes a lookup by reference_number, while every component keeps using
// the same signatures. See supabase/migrations/007_create_alumni_registrations.sql
// for the matching database schema.
import type {
  AlumniRegistration,
  AlumniRegistrationData,
  RegistrationStatus
} from '../types/Registration';

const REGISTRATIONS_KEY = 'acc_registrations';

// Mimics network latency so the submit flow feels like a real API call.
const SIMULATED_LATENCY_MS = 900;

const REFERENCE_PREFIX = 'ACC';

// Reference numbers are complex mixes of letters and numbers (e.g.
// ACC-2B23-55B19) instead of predictable sequential counts. Look-alike
// characters (0/O and 1/I) are left out of the alphabet so codes stay easy
// to read back and type correctly. The validation pattern still accepts
// older sequential references (ACC-2026-00125) saved before this change.
const REFERENCE_LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const REFERENCE_DIGITS = '23456789';
const REFERENCE_ALPHABET = REFERENCE_LETTERS + REFERENCE_DIGITS;
const REFERENCE_PATTERN = /^ACC-[A-Z0-9]{4}-[A-Z0-9]{5}$/;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function readRegistrations(): AlumniRegistration[] {
  try {
    const raw = localStorage.getItem(REGISTRATIONS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AlumniRegistration[]) : [];
  } catch {
    return [];
  }
}

function writeRegistrations(registrations: AlumniRegistration[]): void {
  localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations));
}

// Picks a uniform random index below `max`. Prefers the browser's crypto
// random number generator (the reference number is the only key protecting a
// registration lookup, so predictability matters) and falls back to
// Math.random in environments without Web Crypto.
function randomIndex(max: number): number {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    // Rejection sampling keeps every alphabet character equally likely.
    const limit = Math.floor(0x100000000 / max) * max;
    const buffer = new Uint32Array(1);
    do {
      crypto.getRandomValues(buffer);
    } while (buffer[0] >= limit);
    return buffer[0] % max;
  }

  return Math.floor(Math.random() * max);
}

function randomSegment(length: number): string {
  let segment = '';
  for (let i = 0; i < length; i += 1) {
    segment += REFERENCE_ALPHABET[randomIndex(REFERENCE_ALPHABET.length)];
  }
  return segment;
}

function replaceAt(value: string, index: number, replacement: string): string {
  return value.slice(0, index) + replacement + value.slice(index + 1);
}

// Generates a new, unused reference number - e.g. ACC-2B23-55B19. The code
// always mixes letters and numbers (a purely random draw would occasionally
// come up all-letters, so one character is swapped if that happens), which
// keeps codes complex and effectively impossible to guess. The loop re-rolls
// in the (astronomically unlikely) event of a collision with an existing
// record.
function generateReferenceNumber(registrations: AlumniRegistration[]): string {
  let referenceNumber: string;
  do {
    let body = randomSegment(4) + randomSegment(5);

    // Force the letters-and-numbers mix the format promises.
    if (!/[A-Z]/.test(body)) {
      body = replaceAt(body, randomIndex(body.length), REFERENCE_LETTERS[randomIndex(REFERENCE_LETTERS.length)]);
    } else if (!/[0-9]/.test(body)) {
      body = replaceAt(body, randomIndex(body.length), REFERENCE_DIGITS[randomIndex(REFERENCE_DIGITS.length)]);
    }

    referenceNumber = `${REFERENCE_PREFIX}-${body.slice(0, 4)}-${body.slice(4)}`;
  } while (registrations.some((registration) => registration.referenceNumber === referenceNumber));

  return referenceNumber;
}

export function isValidReferenceNumberFormat(referenceNumber: string): boolean {
  return REFERENCE_PATTERN.test(referenceNumber);
}

export function normalizeReferenceNumber(referenceNumber: string): string {
  return referenceNumber.trim().toUpperCase();
}

// Saves the submission and returns the stored record with its generated
// reference number and initial Pending status.
export async function submitRegistration(
  data: AlumniRegistrationData
): Promise<AlumniRegistration> {
  await delay(SIMULATED_LATENCY_MS);

  const registrations = readRegistrations();
  const registration: AlumniRegistration = {
    ...data,
    referenceNumber: generateReferenceNumber(registrations),
    status: 'Pending',
    submittedAt: new Date().toISOString()
  };

  registrations.push(registration);
  writeRegistrations(registrations);

  return registration;
}

// Looks a registration up by its reference number. Case-insensitive and
// tolerant of extra spaces around the input.
export function findRegistrationByReference(
  referenceNumber: string
): AlumniRegistration | null {
  const normalized = normalizeReferenceNumber(referenceNumber);
  if (!normalized) return null;

  return readRegistrations().find((r) => r.referenceNumber === normalized) ?? null;
}

// Used by the alumni office verification flow to move a registration out of
// Pending once it has been reviewed.
export function updateRegistrationStatus(
  referenceNumber: string,
  status: RegistrationStatus
): AlumniRegistration | null {
  const normalized = normalizeReferenceNumber(referenceNumber);
  const registrations = readRegistrations();
  const registration = registrations.find((r) => r.referenceNumber === normalized);

  if (!registration) return null;

  registration.status = status;
  writeRegistrations(registrations);

  return registration;
}

// Permanently removes a registration from storage (trash bin -> delete
// forever). Returns true when a record was actually removed.
export function deleteRegistration(referenceNumber: string): boolean {
  const normalized = normalizeReferenceNumber(referenceNumber);
  const registrations = readRegistrations();
  const next = registrations.filter((r) => r.referenceNumber !== normalized);

  if (next.length === registrations.length) return false;

  writeRegistrations(next);
  return true;
}

// Handy for future admin listings.
export function getAllRegistrations(): AlumniRegistration[] {
  return readRegistrations();
}