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
const COUNTERS_KEY = 'acc_registration_counters';

// Mimics network latency so the submit flow feels like a real API call.
const SIMULATED_LATENCY_MS = 900;

const REFERENCE_PREFIX = 'ACC';
const REFERENCE_SEQ_WIDTH = 5;
const REFERENCE_PATTERN = /^ACC-\d{4}-\d{5}$/;

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

// Per-year counters keep reference numbers stable even if old records are
// ever pruned: { "2026": 12 } means ACC-2026-00012 was the last one issued.
function readCounters(): Record<string, number> {
  try {
    const raw = localStorage.getItem(COUNTERS_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, number>) : {};
  } catch {
    return {};
  }
}

function writeCounters(counters: Record<string, number>): void {
  localStorage.setItem(COUNTERS_KEY, JSON.stringify(counters));
}

function formatReferenceNumber(year: number, sequence: number): string {
  return `${REFERENCE_PREFIX}-${year}-${String(sequence).padStart(REFERENCE_SEQ_WIDTH, '0')}`;
}

// Generates the next unused reference number for the given year,
// e.g. ACC-2026-00125.
function generateReferenceNumber(
  year: number,
  registrations: AlumniRegistration[]
): string {
  const counters = readCounters();

  // Continue from the stored counter; if it was cleared, fall back to the
  // highest sequence already present in the saved records.
  let sequence = counters[String(year)] ?? 0;

  const yearPrefix = `${REFERENCE_PREFIX}-${year}-`;
  for (const registration of registrations) {
    if (registration.referenceNumber.startsWith(yearPrefix)) {
      const parsed = Number(registration.referenceNumber.slice(yearPrefix.length));
      if (Number.isInteger(parsed) && parsed > sequence) {
        sequence = parsed;
      }
    }
  }

  let referenceNumber: string;
  do {
    sequence += 1;
    referenceNumber = formatReferenceNumber(year, sequence);
  } while (registrations.some((registration) => registration.referenceNumber === referenceNumber));

  counters[String(year)] = sequence;
  writeCounters(counters);

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
    referenceNumber: generateReferenceNumber(new Date().getFullYear(), registrations),
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

// Handy for future admin listings.
export function getAllRegistrations(): AlumniRegistration[] {
  return readRegistrations();
}