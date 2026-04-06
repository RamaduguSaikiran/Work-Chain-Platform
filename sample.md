Sure! Let me break this down as simply as possible.

---

## How the Match Score Works (Out of 36)

Think of it like a **report card with 8 subjects**. Each subject has a maximum marks. Total maximum = **36 marks**.

| # | Subject | What it checks | Max Marks |
|---|---------|----------------|-----------|
| 1 | **Varna** | Work style & ego match | 1 |
| 2 | **Vashya** | Who attracts who | 2 |
| 3 | **Tara** | Destiny & luck together | 3 |
| 4 | **Yoni** | Physical & emotional attraction | 4 |
| 5 | **Graha Maitri** | Are their planets friends? | 5 |
| 6 | **Gana** | Basic nature (calm / balanced / intense) | 6 |
| 7 | **Bhakoot** | Long-term love & zodiac alignment | 7 |
| 8 | **Nadi** | Health & family genes | 8 |

The system adds up all 8 scores → gives a **total out of 36**.

---

## How Each Subject is Scored

**Gana (Nature check):**
- Both same nature → 6 ✅
- Calm + Balanced → 5 ✅
- Balanced + Intense → 3 ⚠️
- Calm + Intense → 1 ❌

**Nadi (Health check):**
- Different Nadi → 8 ✅ (great!)
- Same Nadi → 0 ❌ (This is called "Nadi Dosha" — it's a serious concern in astrology)

**Yoni (Attraction check):**
- Same animal → 4 ✅
- Friendly animals → 3 ✅
- Neutral animals → 2 ⚠️
- Enemy animals → 0 ❌

All 8 subjects follow similar simple rules like this.

---

## What the Score Means

| Score | Meaning |
|-------|---------|
| 30 – 36 | ✅ **Excellent Match** |
| 24 – 29 | 👍 **Very Good Match** |
| 18 – 23 | 🆗 **Good Match** |
| Below 18 | ⚠️ **Not Recommended** |

---

## How the Explanation Works

After the score is calculated, the system **reads each subject's score** and picks sentences based on rules like this:

```
If Gana score is 5 or 6:
   → Write: "Both partners share a similar nature..."

If Nadi score is 0:
   → Write: "Nadi dosha is present, which is a serious concern..."

If Graha Maitri is 4 or 5:
   → Write: "Their planets are friends, communication will be easy..."
```

It checks **all 8 subjects**, collects good/bad sentences, and joins them into **one paragraph**. That paragraph is what you see as the "Astrological Insight" on the app.

---

## Simple Example

Let's say **Ashwini + Bharani** gets scored:

| Subject | Score |
|---------|-------|
| Varna | 1 |
| Vashya | 2 |
| Tara | 0 |
| Yoni | 3 |
| Graha Maitri | 4 |
| Gana | 5 |
| Bhakoot | 7 |
| Nadi | 8 |
| **Total** | **30/36** |

→ Result: **"Excellent Match"**

→ Explanation generated:
*"This is an excellent match. Both share a similar nature (Gana=5). There is good physical attraction (Yoni=3). Their planets are friendly (Graha=4). Long-term love looks good (Bhakoot=7). Health compatibility is strong (Nadi=8). Overall, mutual effort will make this relationship a success."*

---

That's the whole system. **No AI, no random guessing** — just simple if/else rules applied to ancient astrology logic. 🎯




Here are the exact rules for all 8 subjects, directly from the code:

---

## 1. Varna — "Work Style Match" (Max: 1 point)

Every nakshatra belongs to one of 4 levels:

| Level | Nakshatra Type |
|-------|---------------|
| Highest | Brahmin |
| Second | Kshatriya |
| Third | Vaishya |
| Lowest | Shudra |

**Rule:**
- Groom's level is **equal to OR higher** than Bride's level → **1 point** ✅
- Groom's level is **lower** than Bride's level → **0 points** ❌

Simple idea: The groom should match or be at a "higher level" than the bride for compatibility.

---

## 2. Vashya — "Who Controls Who" (Max: 2 points)

Every nakshatra belongs to one of 5 groups:

`Chatushpada` (four-legged animals) | `Manava` (humans) | `Jalachara` (water creatures) | `Keeta` (insects) | `Vanchara` (wild)

**Rule:**
- Same group → **2 points** ✅
- Groups are friendly to each other → **1 point** 👍
- No match → **0 points** ❌

**Friendly group pairs:**
- Manava ↔ Chatushpada, Jalachara
- Jalachara ↔ Keeta, Manava
- Chatushpada ↔ Vanchara, Jalachara, Manava
- Keeta ↔ Jalachara
- Vanchara ↔ Chatushpada

---

## 3. Tara — "Destiny & Luck" (Max: 3 points)

Uses the **position number** of each nakshatra (1 to 27).

**Rule:**
1. Calculate: `difference = |bride_position - groom_position|`
2. Then: `tara = difference % 9` (remainder when divided by 9)
3. Check result:

| Tara Result | Score |
|-------------|-------|
| 0, 2, 4, 6, 8 (even or zero) | **3 points** ✅ |
| 1, 3, 5, 7 (odd) | **0 points** ❌ |

Simple idea: Even remainders = lucky alignment. Odd = unlucky.

---

## 4. Yoni — "Physical & Emotional Attraction" (Max: 4 points)

Every nakshatra has a **spirit animal** (Horse, Elephant, Cat, Dog, etc.)

**Rule:**
| Situation | Score |
|-----------|-------|
| Same animal | **4 points** ✅ |
| Friendly animals (both domestic OR both wild) | **3 points** 👍 |
| Neutral animals | **2 points** 🆗 |
| Enemy animals | **0 points** ❌ |

**Enemy animal pairs (natural enemies):**
- Horse ↔ Buffalo
- Elephant ↔ Lion
- Sheep ↔ Monkey
- Serpent ↔ Mongoose
- Dog ↔ Hare
- Cat ↔ Rat
- Cow ↔ Tiger

**Domestic animals:** Horse, Elephant, Sheep, Dog, Cat, Cow, Buffalo  
**Wild animals:** Serpent, Rat, Tiger, Hare, Monkey, Mongoose, Lion

---

## 5. Graha Maitri — "Are Their Planets Friends?" (Max: 5 points)

Every nakshatra has a **ruling planet** (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu).

The system checks: *Are these two planets friends, enemies, or neutral?*

**Rule:**
| Situation | Score |
|-----------|-------|
| Same planet | **5 points** ✅ |
| Both are friends of each other | **5 points** ✅ |
| One is friend, other is neutral | **4 points** 👍 |
| Both are neutral to each other | **3 points** 🆗 |
| Both are enemies of each other | **0 points** ❌ |

**Planet friendship table:**
| Planet | Friends |
|--------|---------|
| Sun | Moon, Mars, Jupiter |
| Moon | Sun, Mercury |
| Mars | Sun, Moon, Jupiter |
| Mercury | Sun, Venus |
| Jupiter | Sun, Moon, Mars |
| Venus | Mercury, Saturn |
| Saturn | Mercury, Venus |
| Rahu | Venus, Saturn, Mercury |
| Ketu | Mars, Venus, Saturn |

---

## 6. Gana — "Basic Nature / Temperament" (Max: 6 points)

Every nakshatra belongs to one of 3 natures:
- **Deva** = Gentle, calm, peaceful
- **Manushya** = Balanced, practical
- **Rakshasa** = Intense, fierce, ambitious

**Rule:**
| Combination | Score |
|-------------|-------|
| Both same nature | **6 points** ✅ |
| Deva + Manushya | **5 points** 👍 |
| Manushya + Rakshasa | **3 points** 🆗 |
| Deva + Rakshasa | **1 point** ❌ |

---

## 7. Bhakoot — "Long-Term Love & Zodiac Harmony" (Max: 7 points)

Uses the **zodiac sign (Rashi)** of each nakshatra. Checks the distance between the two signs on the zodiac wheel.

**Rule:**
- Same Rashi → **7 points** ✅
- Calculate positions of both Rashis on zodiac (1–12)
- Find the distance both ways around the circle

**Bad distance combinations (automatic 0):**
| Distance | Called | Meaning |
|----------|--------|---------|
| 6 and 8 apart | Shadashtaka | Very bad |
| 2 and 12 apart | Dwirdwadasha | Bad |
| 5 and 9 apart | Navapanchama | Bad |

- Any bad combination → **0 points** ❌
- All other combinations → **7 points** ✅

**Zodiac order used:**
Mesha → Vrishabha → Mithuna → Karka → Simha → Kanya → Tula → Vrischika → Dhanu → Makara → Kumbha → Meena

---

## 8. Nadi — "Health & Genetic Compatibility" (Max: 8 points)

Every nakshatra belongs to one of 3 Nadis:
- **Aadi** (First)
- **Madhya** (Middle)
- **Antya** (Last)

**Rule — the simplest of all 8:**
| Situation | Score |
|-----------|-------|
| **Different** Nadi | **8 points** ✅ |
| **Same** Nadi | **0 points** ❌ |

This "same Nadi" situation is called **Nadi Dosha** — it's considered the most serious problem in Vedic marriage matching. It's why Nadi has the highest weight (8 points).

---

## Final Total

Add all 8 scores → Total out of 36:

| Total Score | Result |
|------------|--------|
| 30 – 36 | ✅ Excellent Match |
| 24 – 29 | 👍 Very Good Match |
| 18 – 23 | 🆗 Good Match |
| 0 – 17 | ⚠️ Not Recommended |
