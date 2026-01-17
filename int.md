# Date For You — Web MVP (Dark Mode)

**Purpose:** A production-ready specification for a Web MVP that *feels* like a real dating app (Tinder/Bumble class), where users swipe and chat with profiles that are bots acting as humans. This spec is intentionally written to be **UI/UX + backend-safe** and **portable to React Native (Expo)** later with minimal changes.

---

## 1) Product Non‑Negotiables

* Users **must never feel** they are chatting with a bot.
* Text-only chat (no images, files, voice).
* Language: **English + Hinglish (Roman Hindi)** only.
* Dark mode only (MVP).
* Swipe + match + chat loop.
* **Server-only AI calls** (Supabase Edge Functions → Gemini).
* Hard usage limits (swipes/messages) enforced server-side.

---

## 2) Visual Language (Tinder-like, not a clone)

### Theme (Dark Mode)

* **Background:** #0B0E13
* **Surface/Card:** #121622
* **Primary Accent:** #E94057 (like/cta)
* **Secondary Accent:** #3A86FF (links/secondary)
* **Text Primary:** #FFFFFF
* **Text Secondary:** #A1A7B3
* **Divider:** #1E2333

### Typography

* Inter / SF Pro style (system-safe)
* Headings: SemiBold
* Body: Regular
* Chat bubbles: Medium

### Motion

* Subtle spring for swipe
* 120–180ms micro-interactions
* No flashy animations

---

## 3) App Layout (Web → RN Compatible)

```
┌─────────────────────────────────────┐
│ Top Bar (Logo / App Name)            │
├─────────────────────────────────────┤
│ Content Area                         │
│  • Discover (Swipe)                  │
│  • Chat                              │
│  • Profile                           │
├─────────────────────────────────────┤
│ Bottom Tab Bar (Icons)               │
│  Discover | Chat | Profile           │
└─────────────────────────────────────┘
```

**Note:** Routes and components map 1:1 to Expo Router tabs later.

---

## 4) Page-by-Page UI & Behavior

### 4.1 Landing (`/`)

* Headline: *“Someone wants to talk to you.”*
* CTA: **Continue with Google**
* Secondary text: subtle, emotional
* Error handling: inline toast only

### 4.2 Auth

* Google OAuth via Supabase
* Loader overlay during redirect
* Failure copy (human):

  * “That didn’t work. Try again?”

### 4.3 Onboarding (3 steps)

**Step 1:** Name, age range, gender
**Step 2:** Preferences (vibe chips)
**Step 3:** Confirmation

* Progress dots
* Back allowed
* Save draft server-side

### 4.4 Discover (Swipe)

* Card stack (3 visible)
* Actions:

  * Swipe left = Pass
  * Swipe right = Like
* Like animation → *“It’s a match!”*
* Loader while checking limits

**Empty state:**

* “No more profiles right now”

### 4.5 Chat

* WhatsApp-style layout
* Left bubble (persona), right bubble (user)
* Typing indicator (fake delay)
* Send disabled during AI response

**Input rules:**

* Text only
* Max length (e.g., 500 chars)

### 4.6 Profile

* User info
* Usage today
* Preferences edit
* Logout

---

## 5) Loaders & Error Handling (Human-first)

### Global Loader

* Full-screen dim overlay
* Spinner + soft text:

  * “Just a sec…”

### Network Errors

* Never show codes
* Toast messages:

  * “Something went wrong. Try again.”
  * “Network seems slow.”

### AI Failures

* Replace with human fallback:

  * “Sorry, got distracted 😅”

---

## 6) Backend Architecture (Supabase)

### Tables (Core)

* `users`
* `personas`
* `chats`
* `messages`
* `limits`

### Edge Functions

* `send-message`
* `check-swipe`
* `reset-daily-limits`

**Rule:** Client never talks to Gemini directly.

---

## 7) Gemini Prompt Rules (Locked)

* Persona identity fixed
* No AI disclosure
* Hinglish + English only
* Casual, imperfect tone

**Hard Blocks:**

* Phone numbers
* Social handles
* Explicit sexual content

Output is filtered server-side. Unsafe output is discarded.

---

## 8) Phone Number / Instagram Requests

**Behavior:** Deflect like a real person.

Examples:

* “Thoda aur baat kar lete hain pehle 😅”
* “Let’s stay here for now.”

Never provide fake details.

---

## 9) Sexual Language Handling

**Mild:** Light flirt back, slow down.
**Explicit:** Soft boundary.
**Aggressive:** Emotional rejection + coldness.

Never escalate.

---

## 10) Usage Limits

* Swipes/day (e.g., 20)
* Messages/day (e.g., 30)

**UX when hit:**

* “Let’s continue tomorrow 🙂”

No paywall text in MVP.

---

## 11) Security Checklist

* RLS enabled on all tables
* Auth required for reads/writes
* Edge Functions validate user
* Gemini key in env vars only
* Rate limiting per user

---

## 12) URL & Routing Safety

* Guard all routes by auth
* Unknown route → soft 404:

  * “This page doesn’t exist.”
* Auto-redirect unauth users to `/`

---

## 13) Web → React Native Migration Notes

* Same Supabase project
* Same Edge Functions
* Same DB schema
* Replace routing + UI only

---

## 14) Definition of Done (MVP)

* User swipes, matches, chats
* Never sees AI indicators
* Limits enforced
* Dark mode polished
* Safe, human error handling

---

**This document is the single source of truth for Web MVP and future React Native app.**
