# Proof-of-Work Task Submission & Incentive Rewards

> A transparent, fair, and tamper-proof task submission + approval system that issues verifiable receipts for every action (submission, approval, rejection).

---

![Status](https://img.shields.io/badge/status-alpha-orange) ![Tech](https://img.shields.io/badge/stack-Node.js%20%7C%20React%20%7C%20MongoDB-blue) ![License](https://img.shields.io/badge/license-MIT-green)

---

## 🔌 Overview

This project builds a proof-of-work system where:

- Users submit tasks of different types (with attachments and metadata).
- Admins review and validate tasks (approve / reject with reasons).
- Users receive dynamic rewards (points / incentives) on approval.
- Every action is recorded in an append-only proof trail (hash logs / blockchain-style receipts) so records are tamper-proof and verifiable.

---

## ⚡ What Makes Our System Different

| Feature | Existing Systems | Our System |
|---|---:|---:|
| **Transparency** | Approvals often happen in the background — users can’t verify history. | Every task has a verifiable proof trail (append-only logs with hashes). |
| **Fair Rewards** | Rewards are often fixed or manual. | Rewards are dynamic and computed based on task type + approval rules. |
| **Trust** | Users must “trust” admins blindly. | Users can view blockchain-style receipts for every approval/rejection. |
| **Error Handling** | Limited validation before submission. | Built-in smart validations and error feedback at submission time. |
| **Scalability** | Focused on one use-case only (e.g., simple to-do or single-purpose bounty). | Extensible to education, corporate tasks, community contributions, and more. |

---

## 🛠️ Technologies Used

- **Frontend:** React.js (dynamic UI, submission forms, live notifications)
- **Backend:** Node.js + Express (REST APIs, admin workflow)
- **Database:** MongoDB (users, tasks, points, proof logs)
- **Proof Trail:** Append-only hash logs (receipt generation, verification API)
- **Notifications:** WebSockets / Firebase Cloud Messaging (real-time updates)

---

## 🔎 Architecture & Methodology

### User flow

1. **Task Submission**
   - User fills task form (task type, description, attachments).
   - Client-side + server-side validations ensure correctness.
   - On success, a **submission record** is created and appended to the proof trail.

2. **Admin Review**
   - Admins see pending tasks in a review UI.
   - Admin approves or rejects with comments/reasons.
   - Approval status is appended to the proof trail.

3. **Reward System**
   - Points are assigned dynamically using rules: `points = base(taskType) * multiplier(quality) + bonus(...)`.
   - Points are stored on the user profile after approval.

4. **Append-Only Proof Trail**
   - Each action (submission, approval, rejection) produces a proof record:
     - A timestamped JSON entry
     - A computed hash (e.g., `sha256(previousHash + entryJSON)`)
   - Proof trail is stored immutably (append-only collection) — acts like blockchain receipts.
   - Users can view a receipt explorer and verify hashes themselves.

---

## 🔐 Example Receipt (JSON)

```json
{
  "id": "receipt_0x123abc",
  "action": "TASK_APPROVED",
  "taskId": "task_0x987",
  "actor": "admin_jdoe",
  "timestamp": "2025-08-24T12:34:56Z",
  "metadata": {
    "pointsAwarded": 150,
    "approvalNote": "Meets all criteria"
  },
  "prevHash": "a1b2c3...",
  "hash": "f9d6c4..."
}
```

**Receipt verification:** compute `sha256(prevHash + canonicalized(metadata + action + timestamp + taskId))` and compare with `hash`.

---

## 🚀 Quickstart (dev)

> Assumes Node.js, npm, and MongoDB are installed.

1. **Clone**
```bash
git clone https://github.com/RamaduguSaikiran/Work-Chain-Platform
cd Work-Chain-Platform
```

2. **Backend**
```bash
cd server
npm install
cp .env.example .env       # set DB URI, JWT secret, etc.
npm run dev                # starts Express server
```

3. **Frontend**
```bash
cd ../client
npm install
npm start                  # starts React dev server
```

4. **Visit**
- Frontend: `http://localhost:3000`
- API: `http://localhost:4000/api` (example)

---

## ✅ Core API Endpoints (examples)

- `POST /api/tasks` — Submit a new task (validations applied)
- `GET /api/tasks/pending` — Admin: list pending tasks
- `POST /api/tasks/:id/approve` — Admin: approve task + points
- `POST /api/tasks/:id/reject` — Admin: reject task + reason
- `GET /api/receipts/:taskId` — Get proof trail / receipts for a task
- `POST /api/verify-receipt` — Verify provided receipt hash chain

---

## 📐 Reward Rules (example)

- Each `taskType` has a `basePoints`.
- Admins can apply a `qualityMultiplier` (0.5 — 2.0).
- Bonuses for early submissions or high-impact work.
- All rules are auditable and logged as part of the proof trail.

---

## 🧭 Extensibility & Use Cases

- Education: verify student submissions and reward with credits/certificates.
- Corporate: internal task incentives, performance micro-rewards.
- Open source: contributor bounties with verifiable receipts.
- Community: reputation systems for moderation or helpfulness.

---

## 🛡️ Security & Tamper Resistance

- Append-only collection for proof logs (no updates/deletes).
- Hash chaining (each record references the previous hash).
- Server-side validation + role-based access control (RBAC).
- Optionally replicate the proof trail to IPFS or a public ledger for extra transparency.

---

## 🧪 Testing & Verification

- Unit tests for:
  - Task validation rules
  - Receipt hashing and verification
  - Reward calculation logic
- Integration tests for:
  - Submission → Admin approval → Points assignment → Receipt generation

---

## 🤝 Contributing

We welcome contributions! Suggested workflow:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature`.
3. Commit changes & push.
4. Open a pull request describing your changes and tests.

Please follow the code style and include tests for new functionality.

---


---

## 👋 Contact

For questions, feature requests, or collaboration:
- Maintainer: `Ramadugu Sai Kiran` — email: `ramadugusaikiran2@gmail.com`
- GitHub: `https://github.com/RamaduguSaikiran`

---

## 📝 Notes / Next Steps (ideas)
- Add on-chain anchoring for receipts (optional).
- Add role-based dashboards (analytics for admins and users).
- Create CLI tools for bulk approvals and ledger export.
- Add GDPR / privacy compliance features for personal data.

---


