import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  hashPassword,
  verifyPassword,
  constantTimeEquals,
  evaluatePasswordStrength,
  generateSessionToken,
  verifySessionToken,
  sanitizeEmail,
  sanitizeName,
} from '../lib/auth-crypto.ts';
import {
  registerUser,
  authenticateUser,
  changePassword,
  getSecurityAuditLogs,
  maskDatabaseUrl,
} from '../lib/neon-auth.ts';

describe('NeonDB & PostgreSQL Cryptography & Authentication Subsystem', () => {
  it('hashes passwords using PBKDF2-SHA512 and verifies correctly', async () => {
    const password = 'SuperSecretPassword@2026';
    const hash = await hashPassword(password);

    assert.ok(hash.startsWith('pbkdf2:sha512:100000:'), 'Hash format must match PBKDF2 format');

    const isValid = await verifyPassword(password, hash);
    assert.strictEqual(isValid, true, 'Original password should verify against hash');

    const isWrongValid = await verifyPassword('WrongPassword123', hash);
    assert.strictEqual(isWrongValid, false, 'Incorrect password must be rejected');
  });

  it('performs timing-safe string comparison', () => {
    assert.strictEqual(constantTimeEquals('hello', 'hello'), true);
    assert.strictEqual(constantTimeEquals('hello', 'hellx'), false);
    assert.strictEqual(constantTimeEquals('short', 'longer-string'), false);
  });

  it('evaluates password strength against NIST criteria and dictionary attacks', () => {
    const weak = evaluatePasswordStrength('12345');
    assert.strictEqual(weak.score < 2, true);
    assert.strictEqual(weak.checks.minLength, false);

    const common = evaluatePasswordStrength('password123');
    assert.strictEqual(common.checks.notCommon, false);

    const strong = evaluatePasswordStrength('Str0ng!P@ssw0rd2026#Mega');
    assert.strictEqual(strong.score >= 3, true);
    assert.strictEqual(strong.checks.minLength, true);
    assert.strictEqual(strong.checks.hasUpper, true);
    assert.strictEqual(strong.checks.hasLower, true);
    assert.strictEqual(strong.checks.hasNumber, true);
    assert.strictEqual(strong.checks.hasSpecial, true);
  });

  it('generates and verifies HMAC-SHA256 session tokens', async () => {
    const payload = {
      userId: 'usr_test_123',
      email: 'tester@everythingmarket.dev',
      role: 'BUYER' as const,
    };

    const token = await generateSessionToken(payload, 24);
    assert.ok(token.includes('.'), 'Token must contain signature segments');

    const verifyResult = await verifySessionToken(token);
    assert.strictEqual(verifyResult.valid, true);
    assert.strictEqual(verifyResult.payload?.userId, 'usr_test_123');
    assert.strictEqual(verifyResult.payload?.email, 'tester@everythingmarket.dev');

    // Tampered token test
    const tampered = token.slice(0, -4) + 'abcd';
    const tamperedResult = await verifySessionToken(tampered);
    assert.strictEqual(tamperedResult.valid, false, 'Tampered token must be rejected');
  });

  it('registers a new user and denies duplicate emails', async () => {
    const testEmail = `newuser_${Date.now()}@testmarket.org`;

    const regResult = await registerUser({
      email: testEmail,
      password: 'SecurePassword@123!',
      firstName: 'Alice',
      lastName: 'Smith',
      role: 'BUYER',
    });

    assert.strictEqual(regResult.success, true);
    assert.strictEqual(regResult.user?.email, testEmail);
    assert.ok(regResult.token);

    // Duplicate registration attempt
    const dupResult = await registerUser({
      email: testEmail,
      password: 'SecurePassword@123!',
      firstName: 'Alice',
    });

    assert.strictEqual(dupResult.success, false);
    assert.ok(dupResult.error?.includes('already exists'));
  });

  it('authenticates user and enforces brute-force rate limiting', async () => {
    const testEmail = `brute_victim_${Date.now()}@market.dev`;

    await registerUser({
      email: testEmail,
      password: 'CorrectPassword@123!',
      firstName: 'Bob',
      role: 'BUYER',
    });

    // Valid authentication
    const goodAuth = await authenticateUser(testEmail, 'CorrectPassword@123!');
    assert.strictEqual(goodAuth.success, true);

    // 5 consecutive failed attempts trigger lockout
    let lastFail;
    for (let i = 0; i < 5; i++) {
      lastFail = await authenticateUser(testEmail, 'WrongPassword');
    }

    assert.strictEqual(lastFail?.success, false);
    assert.strictEqual(lastFail?.lockoutSecondsRemaining, 60, 'Account should be locked out for 60s');

    // Sixth attempt should be blocked by security cooldown
    const blockedAuth = await authenticateUser(testEmail, 'CorrectPassword@123!');
    assert.strictEqual(blockedAuth.success, false);
    assert.ok(blockedAuth.error?.includes('cooldown active') || blockedAuth.error?.includes('locked'));
  });

  it('updates password and logs security events', async () => {
    const testEmail = `security_user_${Date.now()}@market.dev`;

    const reg = await registerUser({
      email: testEmail,
      password: 'InitialPassword@123!',
      role: 'SELLER',
      storeName: 'Test Store',
    });

    assert.ok(reg.user);

    // Change password with invalid old password
    const failChange = await changePassword(reg.user.id, 'WrongOldPass', 'NewStrongPassword@2026!');
    assert.strictEqual(failChange.success, false);

    // Change password with valid old password
    const successChange = await changePassword(reg.user.id, 'InitialPassword@123!', 'NewStrongPassword@2026!');
    assert.strictEqual(successChange.success, true);

    // Verify login with new password
    const loginNew = await authenticateUser(testEmail, 'NewStrongPassword@2026!');
    assert.strictEqual(loginNew.success, true);

    // Check security audit logs
    const logs = getSecurityAuditLogs(testEmail);
    assert.ok(logs.length >= 2, 'Security audit log should record events');
  });

  it('masks sensitive database connection strings properly', () => {
    const url = 'postgresql://neondb_owner:npg_SecretPass123@ep-cool-cloud-456.us-east-2.aws.neon.tech/neondb?sslmode=require';
    const masked = maskDatabaseUrl(url);
    assert.ok(!masked.includes('npg_SecretPass123'), 'Password must never leak in masked output');
    assert.ok(masked.includes('ep-cool-cloud-456.us-east-2.aws.neon.tech'));
    assert.ok(masked.includes('••••••••'));
  });
});
