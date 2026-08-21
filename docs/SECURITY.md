# SECURITY.md — Project CHOWKI Security & Privacy Policy
## *DPDP Act 2023 Compliance & Threat Model*
> **Attribution**: Made by Synthreaper | github.com/synthreaper/chowki

---

### 1. Digital Personal Data Protection (DPDP) Act 2023 Implementation
- **Section 6 (Consent Architecture)**: All student check-ins require explicit, revocable consent. Opt-out immediately prevents future check-in processing.
- **Section 8(7) (Mandatory Right to Erasure)**: `DELETE /api/v1/consent/{token}` triggers an immediate hard purge of all check-in telemetry tied to the pseudonym token.
- **Section 7(d) (Emergency Override & De-anonymization)**: Dual cryptographic sign-off by Campus Medical Officer and Data Protection Officer is mandatory to access room-level identification during institutional medical emergencies.
- **k-Anonymity Floor**: All spatial analytics group data into spatial bins containing at least $k=5$ individuals. Individual student records are never rendered on public dashboards.

### 2. Cryptographic Controls
- **Pseudonymization**: HMAC-SHA256 with weekly rotating salt seed:
  `Token = HMAC_SHA256(Roll_Number, Salt_WeekIndex)`
- **Authentication**: JWT tokens signed with RS256 / HS256 with 15-minute access token TTL.
- **Audit Ledger**: Append-only PostgreSQL audit table (`compliance_audit_log`) without UPDATE or DELETE privileges.
