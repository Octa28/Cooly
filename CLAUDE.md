# CLAUDE.md — HCI & AI-Assisted Prototyping Knowledge Base (CSE12B, TU Delft)

This file condenses the course material of **CSE12B: Human-Computer Interaction & AI-Assisted Prototyping** (TU Delft, 2026) — 10 lectures, 2 lab decks, 4 lab activities, reading lists, the TU Delft Risk-Planning Tool, the Universal Design cheat sheet, and three readings (Nielsen on heuristic evaluation, Moore & Arar on Conversational UX, Hitron et al. 2023 on AI bias in HRI).

**How to use it in a project:** treat it as the design and evaluation standard. When you propose requirements, IA, wireframes, prototypes, code, studies or reports, use the methods and terms below and name the principle you are applying (e.g. "Nielsen #6 Recognition rather than recall", "UD principle 4 Perceptible information").

---

## 0. Course & project context

- **Running case:** the *Delft Tourism Kiosk / Delft Points of Interest (POI) app*, for tourists in Delft (Markt, Delft station). Personas include elderly international tourists, international students on a budget, wheelchair users, low-vision users, people holding umbrellas or luggage, and visitors with low digital literacy.
- **Lab pipeline:** Lab 1 PACT + personas + scenarios → Lab 2 IA + card sorting + low-fi wireframes → Lab 3 interactive Figma prototype + accessibility + ethics/consent → Lab 4 rapid prototyping + peer evaluation → layered evaluation & Wizard of Oz.
- **Tools:** Figma (Auto Layout, Components & Variants, prototype connections, overlays, contrast check). Alternatives: Miro, Balsamiq, Moqups. AI tools: LLMs, Figma AI or wireframe plugins, v0.dev, Cursor.
- **Course requirement:** *document every AI iteration*: how AI outputs were modified, audited and corrected by the team.
- **Deadlines (2026 course):** D2 mid-term slide decks due Wed 9 Dec 23:59. Earlier schedule items: optional draft of the user-experiment method, group project deadline, Buddycheck. Exam: written, closed book, pen only, multiple-choice and open questions. Exam questions cover lectures, labs, readings **and the group project**.
- **Main textbook:** David Benyon, *Designing User Experience* (4th ed.): Ch. 4–6 (accessibility, UD, ethics) and Ch. 10 (evaluation).

---

## 1. HCI fundamentals (Lecture 1)

**HCI** is the study and practice of usability: technology people *want* to use, *can* use, and find *effective*. It is multidisciplinary.

**Humans vs computers** (complementary skills):
- Humans are good at sensing low-level stimuli, pattern recognition, inductive reasoning, multiple strategies and adapting: "hard and fuzzy things".
- Computers are good at counting, accurate storage and recall, fast consistent responses, calculation, repetition and sustained performance: "simple and sharply defined things".
- Let each do what it does best.

**Levels of automation** (Taylor 2001, scrutable autonomous systems):

| Level | Description |
|---|---|
| 0 | Human does the whole task except the actual operation |
| 1 | Human asks the computer for options and selects one |
| 2 | Computer suggests options |
| 3 | Computer suggests options and proposes one |
| 4a | Computer chooses and acts if the human approves |
| 4b | Computer chooses and acts unless the human disapproves |
| 5a | Computer acts and informs the human |
| 5b | Computer does everything autonomously |

**Usability definitions**
- "A usable software system is one that supports the effective and efficient completion of tasks in a given work context" (Karat & Dayton 1995).
- ISO 9241-11:2018 defines usability as effectiveness, efficiency and satisfaction. It applies to regular use, learning, infrequent use, the widest range of capabilities, minimising the risk of use errors, and maintenance.
- ISO definition of **UX**: "a person's perceptions and responses resulting from the use and/or anticipated use of a product, system or service." See also Morville's UX Honeycomb.

**Business case:** higher productivity; less training, fewer errors and less support; more accurate data; a selling point; may be required by law. Statistics cited: 85% abandon a site due to poor design; 50% of sales are lost because visitors cannot find content.

**Design must account for:** human cognitive, perceptual and motor limits; the specific user population; the physical and social environment; task requirements; and platform constraints.

### PACT framework (Benyon, after Carroll 2002)
**People – Activities – Contexts – Technologies**

- **People:**
  - Information input and output: visual, auditory, haptic, movement.
  - Memory: sensory, short-term, long-term.
  - Processing: reasoning, problem solving, skill, error.
  - Emotion; individual differences.
  - **Steps:** identify users → characteristics (age, domain experience, computer experience, pressure, frequency of use, freedom of choice, direct vs indirect use) → **user classes** ("a sub-set of end-users similar in system usage and relevant personal characteristics") → implications → **personas**.
  - Expertise levels: expert, occasional, novice. The level is relative to each system.
- **Personas:** a specific individual representing a core user class, with name, picture, age, background, personality, work role and attitudes. Pin them up and use them throughout design **and** evaluation.
- **Activities → Task analysis / HTA (Hierarchical Task Analysis):**
  - Decompose a goal into tasks and subtasks, with 4–8 tasks at the top level.
  - Write **plans** describing order. Plan types: fixed sequence, optional, wait-for-event, cycles, time-sharing, discretionary, mixtures.
  - Refining heuristics: paired actions, restructure, balance, generalise (the "make a cup of tea" example).
  - Uses: the hierarchy suggests menu layout, task frequency suggests defaults, task sequences suggest dialogue design.
  - Task analysis is never complete; rigid task-based design leads to an inflexible system.
- **Contexts:** physical, social, organizational.
- **Scenario:** "how and why the persona would use the product to complete a specific task in a specific context."
- **Separation of concerns:** tasks and scenarios must **not** contain UI details, so they can be reused across PC, web, mobile, touch, voice or gesture.
- **Technologies:** history from switch panels to AR, voice and BCI.
- **Visibility and affordance:**
  - Visibility is what can be seen.
  - Affordance is what can be done with an object; perceived affordance is what the user *thinks* can be done.
  - Mapping between controls and effects must be good.
- **PACT output is used for:** (1) user requirements, (2) UI design, (3) evaluation, (4) help and manuals.

---

## 2. Requirements elicitation & analysis (Lecture 2)

**Elicitation:** query techniques (focus groups, interviews, questionnaires). Choose methods per stakeholder; the reanimation-alert app for first responders was the class example.

**User story:** *As a [type of user] I want [capability] such that [value].* It focuses on needs, not technology.

**User requirement** vs **system requirement**:
- A user requirement says "Users should be able to…". It is a minimal user story without the value part.
- A system requirement says "The system shall…". All system requirements together are enough to build the system.
- **Example:** "As a student I want to search books by title, author or ISBN so I can quickly find books" becomes:
  - The system shall provide search by title, author or ISBN.
  - Fuzzy match within 10% of the characters.
  - Results show title, author, ISBN and availability.
  - Filters for genre, date and rating.
  - Pagination.
  - Results in ≤2 s for 100,000 books.
  - 500 concurrent searches without degradation.

**Functional** (what it must do) vs **non-functional** (qualities: usability, UX, performance, maintainability, security, cultural acceptability, legal). Do not specify *how* yet; that belongs in design.

**MoSCoW prioritisation:**
- **Must:** defines the MVP.
- **Should:** if time permits.
- **Could:** lesser importance.
- **Won't:** next development cycle.

**SMART requirements:** Specific, Measurable, Achievable, Relevant, Time-bounded.
- Bad: "The app shall notify users when an alert is entered."
- Better: "…notify first responders in range within 3 s after an operator enters an alert." Even then, "range" still needs a definition.
- "User friendly" is not verifiable. Replace it with measurable criteria, for example: <500 ms response on any interactive component; alert data stored locally; 100% of UI components follow a central style guide and platform HIG.

**AI in requirements (with human oversight):**
- **Elicitation:**
  - Synthetic user simulation: an LLM role-plays a persona for mock interviews, to refine questions *before* real participants.
  - Mass extraction of pain points from reviews, tickets and transcripts.
  - Rapid drafting of PACT scenarios, user stories and acceptance criteria.
- **Analysis:**
  - Ambiguity and conflict detection ("fast", "user-friendly").
  - Edge cases.
  - Gaps against WCAG, security and privacy (missing NFRs such as privacy constraints or offline fallback).

### Information Architecture (IA)
- **Definition:** how content is classified and organized. "Information architects organize content and design navigation systems to help users find the information they need." Organizing works at the macro level (areas) and micro level (pages, fields). Navigation covers moving around, search, indexes and site maps.
- **IA model:** the intersection of **Content** (types, volume, structure), **Context** (business goals, funding, politics, culture, technology, constraints) and **Users** (audience, tasks, needs, information-seeking behaviour, experience).
- **Why IA matters:** not finding information is a major complaint. Needs vary (known item, exploratory, comprehensive), preferences vary (search vs browse) and expertise varies.
- **Deliverables:** blueprints, page templates, navigation systems, labelling systems and controlled vocabularies, policies, production work, training.

**Organization structures:**
1. **Hierarchy:** top-down and familiar. Mobile forms: hub-and-spoke, tabbed view, nested doll.
2. **Database:** bottom-up, homogeneous content, metadata and tags.
3. **Linear:** chronological or process steps. Not scalable; suited to transactional tasks.
4. **Hypertext / contextual:** links; needs an organized structure underneath.
5. **Hybrid:** combinations of the above.

**Organization schemes:**
- **Exact:** alphabetical, geographical, chronological. One right answer; best for users who know what they want.
- **Inexact:** topic, task, audience. Messy, but best for exploratory users.
- **Hybrid:** use with caution. It can break the user's mental model. Keep clear divisions between schemes.

**IA on mobile:** same principles, but fewer categories, less content per page, less navigation space, touch input, changing contexts and more distractions.

**Labelling:**
- A label represents a content chunk; for example, "Contact us" stands for phone, email and address.
- Labels must be specific, clear, predictable and consistent.
- Sources for labels: card sorting, physical analogues (shops, libraries), search logs, competitors.
- Bad reasons for choosing a label: button space, designer boredom.
- Evaluate labels with experts, focus groups, query analysis and user tests.

**Card sorting:**
- **Open:** users group cards and name the groups.
- **Closed:** categories are given in advance.
- **Check:** do labels match? Is the number of categories reasonable? Are categories of reasonable size, each with several members? Does any need subcategories? The result is a taxonomy.

**Navigation systems:**
- **Global:** site-wide, on every page. Top bar, bottom footer, tab bar, bottom menu, side menu (Facebook), tabbed (LinkedIn), hub-and-spoke (Amazon).
- **Local:** sidebar, cascading, fly-out or drop-down menus.
- **Contextual:** inline and associative links.
- **Supplemental:**
  - The site map reflects the mental model and reassures completeness.
  - The site index flattens the structure for known-item search.
  - Others: guided tour, search, pagination, breadcrumbs.
- **Explicit architecture** is made visible through labels, but explicitness does not guarantee clarity.
- Follow platform **UI design patterns** (web, Android, iOS conventions). These are not programmers' design patterns.

---

## 3. User experience, design principles & psychology (Lecture 3)

UX covers all the feelings, thoughts, sensations and actions of engaging in an activity. **Design principles** guide both design and evaluation.

### Nielsen's 10 usability heuristics (1994) — primary checklist
1. **Visibility of system status:** timely, accurate feedback for every action; progress indicators.
2. **Match between system and real world:** the user's language, real-world metaphors and conventions, no jargon.
3. **User control & freedom:** undo/redo, clearly marked "emergency exits", cancel.
4. **Consistency & standards:** the same thing always looks and works the same; follow platform conventions.
5. **Error prevention:** "better than a good error message is a design that prevents the problem."
6. **Recognition rather than recall:** visible objects, actions and options; pick from lists; minimise memory load.
7. **Flexibility & efficiency of use:** accelerators and shortcuts for experts, tailoring, keyboard support.
8. **Aesthetic & minimalist design:** no irrelevant information; every extra item competes for attention.
9. **Help users recognize, diagnose & recover from errors:** plain language, a precise description of the problem, a constructive solution.
10. **Help & documentation:** searchable, task-focused (context sensitive), concrete steps, brief.

**Benyon's 12 principles:** Visibility, Consistency, Familiarity, Affordance, Navigation, Control, Feedback, Recovery, Constraints, Flexibility, Style, Conviviality. They are close to Nielsen's list.

### Laws of UX / psychology
- **Fitts's law:**
  - Time to reach a target depends on its distance and size.
  - Make targets large and well spaced, and place them in easy-to-reach areas.
- **Hick's law:**
  - Decision time grows with the number and complexity of choices (choice overload).
  - Minimise choices when speed matters; split complex tasks into steps.
  - Highlight recommended options; use progressive onboarding.
  - Don't oversimplify to the point of abstraction.
- **Occam's razor:**
  - The best way to reduce complexity is to avoid it.
  - Remove elements until nothing more can be removed without losing function.
- **Tesler's law (conservation of complexity):**
  - Some complexity cannot be removed; either the system or the user must carry it.
  - Move it into the system.
  - Don't design for an idealized rational user.
  - Offer contextual guidance, such as tooltips.
- **Working memory:**
  - Holds about 4–7 chunks (Miller's law); each fades after 20–30 s.
  - **Serial position effect:** people remember first and last items best.
  - **Peak-end rule:** experiences are judged by their peak and their end, so end interactions positively.
  - Support recognition: mark visited links, use breadcrumbs.
  - Put the memory burden on the system: carry information across screens, use comparison tables.
- **Gestalt laws:**
  - Proximity, similarity, common region or boundary, shared background all create grouping.
  - Grouped elements are perceived as related.
- **Aesthetic-usability effect:**
  - Pretty designs are perceived as more usable and minor issues are tolerated.
  - Aesthetics can mask usability problems in tests.

### Evaluating usability (overview)
- **Questionnaires:** SUS, UEQ, PSSUQ, domain-specific ones, NASA-TLX (workload).
- **Behavioural measures:** eye tracking, mouse tracking, performance, error rate, duration.
- **Qualitative methods:** think-aloud, expert evaluation (heuristic evaluation, cognitive walkthrough).

**System Usability Scale (SUS):** 10 items, 5-point Likert scale, a "quick and dirty" usability measure.
1. I think that I would like to use this system frequently.
2. I found the system unnecessarily complex.
3. I thought the system was easy to use.
4. I think that I would need the support of a technical person to be able to use this system.
5. I found the various functions in this system were well integrated.
6. I thought there was too much inconsistency in this system.
7. I would imagine that most people would learn to use this system very quickly.
8. I found the system very cumbersome to use.
9. I felt very confident using the system.
10. I needed to learn a lot of things before I could get going with this system.

**SUS scoring:**
- Odd items: response − 1.
- Even items: 5 − response.
- Sum the ten values (0–40) and multiply by 2.5 to get a 0–100 score.
- Interpret against percentile ranks (measuringu.com/interpret-sus-score).
- The most useful use of SUS is **comparing versions** of a system.

---

## 4. Ethics & accessibility (Lecture 4 + RPT + Lab 3)

### Human research ethics
- **Why it matters:** HCI involves stakeholders throughout and relies on people to design and evaluate.
- **History:**
  - Nazi experiments led to the Nuremberg Code (1947) and the Declaration of Helsinki (1964).
  - Tuskegee syphilis study (1932–72).
  - Milgram experiment (1961) and Stanford Prison Experiment (1971): non-medical harm.
- **Declaration of Helsinki core principles:**
  - Self-determination and informed decisions.
  - Recognise vulnerable groups.
  - **Participant welfare over the interests of science and society.**
  - Research grounded in the scientific background, with likely benefit, and public study information.
  - Trained investigators.
  - Independent ethics review; ethics take precedence over law; ethics extend to publication.
- **TU Delft process:** assess risk → mitigate risk → prepare informed consent → data management plan → feedback from data stewards → submit to the Human Research Ethics Committee (HREC).
- **Informed consent (IC):**
  - IC is an agreement on what participants will do and what you will do, legally and ethically, to protect their physical, emotional and reputational security.
  - Include: the purpose, the tasks, the risks (including identification risk) and the mitigations.
  - Make it **granular**: separate opt-ins with tick boxes.
  - You don't need to reveal the exact research question, since that can bias results.
  - Always include the **right to withdraw at any time without penalty**, the data collected, and how privacy and anonymity are protected.
- **Hidden-camera example ("Jane"):** filming students covertly is a problem even with stick-figure anonymisation. Issues: no consent, a dependent relationship (her own students), video identifiability, and the commercial camera's data handling.

### TU Delft Risk-Planning Tool (RPT)
Three steps: **Minimise risks** (plan a risk session, role-play stakeholders) → **Communicate risks** (align IC with the Data Management Plan, make risks and mitigations clear in the IC) → **Manage risks** (execute the IC as a contract).

**Risk factors:**
- **Partners & collaboration:** funders, internships, third-party data.
- **Location:** outside the EU, non-democratic regimes, what counts as compensation.
- **Participants:** ability to consent, vulnerability (children, nursing homes), dependency (own students, employees), re-identification.
- **Recruitment:** gatekeepers, specialist or self-help groups, crowdsourcing platforms, payment bias.
- **Subject matter:** medical, drugs or substances, samples, psychological stress, sensitive personal data, confidential information, conflict, illegal activity.
- **Research methods:** observation without knowledge, deception, pain or accidents, non-CE devices, face-to-face health concerns, AI or biased datasets, data merging.
- **Data & privacy:** PII (name, email), indirect identifiers (video, audio, IP, age, gender), internet or social-media data, publication, archiving, DPIA.

**Mitigation questions:**
- Can I collect less PII?
- Can I use a less vulnerable group?
- Are there unnecessary risks in the design?
- Do participants fully understand?
- What is legal vs what is ethical?
- What if there is a data breach, or a researcher leaves?
- What are the long-term effects on participants and their communities?

**Lab 3 AI privacy item:** an LLM feature (such as a personalised route) may leak live location or disability status to a third-party LLM provider. Write a 2-sentence privacy disclosure on anonymisation before calling the AI API.

### Accessibility — five types of exclusion
1. **Physical:** an ATM too high for a wheelchair.
2. **Conceptual:** instructions that are too difficult.
3. **Economic:** an app that only runs on the latest phone.
4. **Cultural:** a cricket metaphor.
5. **Social:** a service available only during working hours.

### Seven Principles of Universal Design (Center for Universal Design, NC State 1997)
1. **Equitable use:**
   - The same means of use for all (identical when possible, equivalent when not).
   - No segregation or stigma; equal privacy, security and safety; appealing to all.
2. **Flexibility in use:**
   - Choice of method; left- or right-handed use.
   - Supports accuracy; adapts to the user's pace.
3. **Simple & intuitive use:**
   - No unnecessary complexity; consistent with expectations.
   - Works across literacy and language levels.
   - Information ordered by importance; prompting and feedback.
4. **Perceptible information:**
   - Redundant modes (pictorial, verbal, tactile).
   - Contrast and legibility.
   - Elements that can be described in words.
   - Compatible with assistive technology.
   - **Not the same as Nielsen's "visibility".**
5. **Tolerance for error:**
   - Arrange elements to minimise hazards; isolate or shield hazardous ones.
   - Warnings, fail-safes; discourage unconscious actions in vigilance tasks.
6. **Low physical effort:**
   - Neutral body position, reasonable force.
   - Minimal repetitive actions and sustained effort.
7. **Size & space for approach and use:**
   - Line of sight and reach for seated or standing users.
   - Accommodates hand and grip variation.
   - Room for assistive devices and helpers.

Examples:
- An accessible PDF (reading order, alt text) applies Perceptible information and Equitable use.
- A household-robot scheduling tablet can apply Perceptible information through icons, text and audio together, high contrast, and screen-reader support.

**Inclusivity analysis exercise:** pair user groups (colour blind, low literacy, hard of hearing, non-Dutch speaker, under 10) with artefacts (drinks menu, street sign, ATM, medicine leaflet, museum video tour) and identify the barriers.

### Universal Design cheat sheet — 7 questions per screen (WCAG 2.2 AA numbers)

| Principle | Question | Rule |
|---|---|---|
| Equitable use | Can everyone use the same screen? | Nothing works only on hover or only with a mouse |
| Perceptible info | Can someone with low vision read it? | **Text ≥ 4.5:1** contrast; **large text, outlines, icons ≥ 3:1**; colour is never the only signal |
| Flexibility | Can people use it their own way? | Mouse, finger or keyboard; every main button has a **clearly visible focus state** |
| Size & space | Can someone with shaky hands hit every button? | **Targets ≥ 44×44** with spacing; pad small icons with an Auto Layout frame |
| Simple & intuitive | Would someone new to apps know where to tap? | **One clear main action per screen**; labels say what happens ("Subscribe", not "Click here") |
| Low physical effort | How many steps does the main task take? | Count the clicks in Present mode; drop unneeded steps; don't rely on precise dragging |
| Tolerance for error | What happens if someone taps the wrong thing? | Always a way back: Back, Close, click outside a pop-up |

(The lecture prompt for the AI kiosk used **min 48px touch targets**. Use ≥44, and prefer 48 on a kiosk.)

---

## 5. Envisionment, design & prototyping (Lectures 5–6)

**Prototyping choices:**
- Fidelity: low, mid or high.
- Scope: **horizontal** (broad, shallow), **vertical** (one feature in depth) or **scenario**-based.
- Lifecycle: **throwaway** (only to get user reactions; must be fast), **incremental** (modules prototyped then added), **evolutionary** (the prototype gradually becomes the product).
- Medium: paper, Figma, Wizard of Oz, code.

**Fidelity:**
- **Lo-fi:** paper or greyscale wireframes. Easy to change and disposable; users focus on structure and function.
- **Mid-fi:** schematic, simulated functionality (screen mockups), materials may differ from the final product.
- **Hi-fi:** detailed, real (partial) functionality and final materials.
- **Hi-fi risks:** users think it's real, users fixate on details (font size), developers get attached. **Get lo-fi right before investing in hi-fi.**

**Prototyping over the lifecycle (early → late):**
1. Brainstorm representations.
2. Lo-fi paper prototypes and task-centred walkthroughs.
3. Fine-tune the interface with heuristic evaluation.
4. Mid-fi prototypes with usability testing and limited field tests.
5. Hi-fi prototypes and alpha/beta tests.
6. Working system.

Interactive paper prototypes can simulate sliders, toggles and screen changes (Snyder 2003). Modern prototyping also includes electronics, 3D printing, conductive ink and tangible or textile prototypes.

**Guidelines for large projects:**
1. Test core concepts at lo-fi, but **increase fidelity**; don't stop at lo-fi.
2. Make prototypes in-house with maker and DIY tools.
3. Use video or media to show functions that can't be prototyped.
4. Use real-world data where possible.

**What prototypes prototype (Houde & Hill 1997):**
- **Role:** function in the user's life; needs the context of use.
- **Look & feel:** sensory experience; needs a simulated experience.
- **Implementation:** the nuts and bolts; usually needs a working system.
- No dimension is more important than another.

**Prototypes as filters and manifestations (Lim, Stolterman & Tenenberg 2008):**
- *Manifestation* makes an abstract idea concrete.
- *Filter* deliberately leaves things out to focus on one question; for example, test the navigation hierarchy and ignore branding.

**Choosing fidelity, scope and medium: kiosk scenarios from class**

| Question | Sensible choice |
|---|---|
| Will elderly tourists understand that tapping the physical screen map filters medical stations? | Lo/mid-fi, vertical, paper or Figma on a real-size touch screen |
| Is a 300 ms transition between search and venue details jarring on mobile? | Hi-fi look & feel, vertical, code or Figma Smart Animate on a real device |
| How will international tourists react to an AI agent that proactively interrupts with weather warnings? | Role-focused, Wizard of Oz, mid-fi, in context |

### Prototyping with AI
- **What AI is good for:**
  - (1) Ideation and synthetic data: personas, scenarios, realistic copy (e.g. authentic Dutch POI descriptions in English or German instead of lorem ipsum).
  - (2) Structure and layout: text-to-Figma, wireframe plugins, user stories turned into Auto Layout frames.
  - (3) Code scaffolding: prompt-to-code (v0.dev, Cursor, IDE copilots) producing React/Tailwind components.
- **Domain knowledge makes prompts much better.**
  - Weak: "Make a tourist kiosk UI."
  - Strong (HAIP-informed): "Create a responsive Next.js component using Tailwind CSS for a public standing kiosk in Delft. Target audience: elderly international tourists. Requirements: high-contrast buttons, minimum 48px touch targets, side-by-side split layout with a POI map on the left and accessible category cards on the right. Greyscale theme only."
- **Risks:**
  1. **Fidelity trap and psychological lock-in:** a polished output triggers sunk-cost fallacy and cognitive inertia, so teams stop critiquing a flawed architecture.
  2. **Illusion of completeness:** beautiful UI that lacks navigation paths, edge-case states and error handling.
  3. **Accessibility debt:** non-semantic HTML (`div` + `onClick` instead of `button`), broken screen readers, failed WCAG contrast.
  4. **Algorithmic uniformity (convergence to the mean):** cookie-cutter UIs that ignore local context (e-commerce patterns on a rainy outdoor kiosk).

**When to use AI:**

| Task | Approach | Why |
|---|---|---|
| Early mental-model ideation | **Manual** (paper / lo-fi Figma) | Prevents premature lock-in; fast and flexible |
| IA / card sorting | **Hybrid:** humans sort, AI benchmarks | Humans set user intent; AI stress-tests edge cases and missing categories |
| UI layout & scaffolding | **AI-accelerated** (v0, plugins) | Removes boilerplate HTML/Tailwind |
| Accessibility & usability tuning | **Human oversight and audit** | AI routinely generates inaccessible code; humans enforce WCAG |
| Micro-interactions & state logic | **Hybrid:** AI code plus manual refactoring | AI drafts `useState` logic; humans tune timing and integrate user feedback |

**Takeaways:** don't skip lo-fi ideation. Use AI to accelerate thinking, not to replace it. You are accountable for every line of code, contrast ratio and flow. Document your AI iterations.

---

## 6. Lab procedures (reusable recipes)

### Lab 2 — IA & wireframing
- **Low-fi rules:** greyscale shapes only; rectangles for images, grey blocks for buttons; placeholders like `[ POI Name ]`, `[ Distance ]`; no fonts, icons or images. *Structural scaffolding, not visual polish.*
- **Activity 1, card sorting (~20 min):**
  - Pick 15 POIs (food, historic sites, logistics, transit, events).
  - Open-sort them into **4–6 labelled categories** (e.g. *Navigating Delft*, *Quick Eats*, *Historic Sights*).
  - Check size, specificity and fit with persona mental models.
  - Ask an LLM: *"Act as an HCI Information Architect. Cluster these 15 Delft POIs [list] into 4-6 main navigation menu labels for a [platform] aimed at [persona]. Explain your classification logic."*
  - Compare: did the AI sort by **destination type (spatial)** or **user intent (functional)**? Where does it conflict with human intuition? Finalise the categories.
- **Activity 2, wireframes (~30 min):**
  - Two Figma frames (Mobile 390×844 or Desktop 1440×900) for one key scenario (e.g. "finding a budget meal near the Markt on a rainy afternoon").
  - **Variant A:** category-first (tabs or hamburger → list).
  - **Variant B:** search & map-first (search bar → map pins → card overlay).
- **Activity 3, critique (~15 min):**
  - Audit against PACT constraints. Is the primary action ("Filter by Price", "Get Directions") visible **within 3 seconds**? Does the user always know where they are in the hierarchy?
  - LLM review prompt: *"Act as a UX Evaluator. Review this low-fidelity wireframe layout for a tourist kiosk app against Nielsen's 'Consistency and Standards' and 'Recognition rather than Recall'. Identify 2 potential usability flaws in the navigation structure."*
  - Refine the chosen variant.
- **Activity 4:** 1-minute pitch covering the final categories, the chosen layout and why it beat the other, and one UX improvement made after the critique.

### Lab 3 — accessibility & interactive prototypes
- **Figma tutorial topics:**
  - Auto Layout: buttons that resize with their text; nested Auto Layout cards.
  - Components & Variants: default, hover, pressed.
  - Prototype connections and transitions.
  - Overlays: modals and menus.
  - Contrast audit.
- **Activity 1:**
  - Build at least one primary flow interactive (e.g. Search POI near the Markt → filter "Wheelchair accessible" → POI detail → Get Directions).
  - Primary buttons need **hover and accessible focus states** (high-contrast outline).
  - Audit against UD with the personas (low-vision elderly, wheelchair user, umbrella or luggage, low digital literacy).
  - Run a contrast check; **fix at least 2 accessibility flaws**.
- **Activity 2:**
  - Write a protocol and consent form for a 15-min test with tourists near Delft station or the Markt.
  - Go through the RPT questions and give a mitigation for each "yes".
  - The consent form covers: (i) data collected (screen recordings, time to find a POI), (ii) privacy and anonymity, (iii) withdrawal at any time without penalty.
  - Write the AI privacy disclosure.
- **Activity 3:**
  - Prompt: *"Act as a Research Ethics and Accessibility Board Officer… Review this consent form draft and interface description. Identify missing safety disclosures, privacy risks, or WCAG oversights."*
  - Then critique the AI: did it find a real gap? Did it add legalistic jargon that would confuse participants?
- **Deliverables:** the Figma prototype link, updated frames, a consent form, and the 2-sentence AI privacy disclosure.

---

## 7. Evaluation — research questions & expert evaluation (Lecture 5)

Evaluation is any test of how well something performs. If the system involves people, so does its evaluation. It runs through the whole process, not only at the end.

**Six types of research question (Andriessen 2011):**
- **Descriptive:** properties, steps, who is involved.
- **Comparative:** similarities and differences.
- **Evaluative:** value, quality, pros and cons, suitability.
- **Defining:** classify or characterise.
- **Explaining:** causes, reasons.
- **Designing:** how to improve or remedy, appropriate measures.

**Qualitative vs quantitative:**
- **Qualitative:** focuses on experience (why? how?). Language data, open questions, thematic analysis, small samples. Formative, mid-process.
- **Quantitative:** focuses on data (what, when, who, where). Numbers, closed questions, statistics, large samples. Summative, end of process.

**A good research question is:** focused (single issue), researchable, feasible, specific, complex enough, relevant and original.
- Bad: "How usable and inclusive are the website and the app?"
- Good: "How usable is the mobile app?"
- Good: "Would CS students rate GUI A or B higher on usability?"
- Good: "What is the effect of adding a loading screen on app usability?"

**Expert evaluation:**
- Experts can be usability experts or domain experts about the end users (e.g. teachers for a kids' app, therapists for PTSD content).
- **Advantages:** cheap, quick. Good when a minimally good system is needed first, when users are vulnerable, or when confounding factors exist.
- **Disadvantages:** simulated, not the real user group.

**Cognitive walkthrough:**
- **Inputs:** (1) task description, (2) the correct action sequence, (3) anticipated users, (4) users' initial goals.
- **For every step, ask:**
  1. Will users try to achieve the right effect?
  2. Will they notice that the correct action is available?
  3. Will they associate the action with the effect?
  4. Will they see progress toward the goal after the action?
- Class example: first Rabobank login with a card reader, 11 actions.

**Heuristic evaluation (Nielsen 1993/94):**
- **How it works:**
  - Evaluators inspect the interface **independently** against the heuristics. Only afterwards do they communicate and aggregate.
  - Each session lasts 1–2 h; split large interfaces into several sessions.
  - Go through the interface **at least twice**: first for flow, then for specific elements.
  - Works on paper prototypes.
  - For domain-specific systems, give naive evaluators a usage scenario based on task analysis. An observer may answer domain questions, but should help with the interface only once the evaluator is clearly stuck and has commented on the problem.
- **Output:** a list of usability problems, each **listed separately** with the heuristic it violates and *why*. "I don't like it" is not enough.
- **Number of evaluators:** 3–5 (≈75% of problems with 5), or stop at saturation. One evaluator finds only a fraction.
- **Severity matrix:** severity = **Impact × Frequency**, from low (1) to high (5). Add **cost** when prioritising fixes.
- **Debriefing session:** evaluators, observers and designers brainstorm redesigns and also note positive aspects.
- **Discount usability engineering:** quick and dirty, and very cost-effective (benefit-cost ratio of 48 in one case study), but not exhaustive.
- **Caveats:** the designer is not the best expert. Use concrete examples and personas. Validity is limited.

---

## 8. User evaluation & controlled experiments (Lecture 6)

**When to evaluate, and how:**

| Stage | With users | With experts |
|---|---|---|
| Design (ideas, sketches) | Focus groups, interviews | Cognitive walkthrough |
| Prototype (often in a lab) | Participatory heuristic evaluation, co-discovery, interviews, cooperative evaluation, lab experiments | Cognitive walkthrough, heuristic evaluation |
| Deployment (daily use) | Interviews, data analytics, field experiments | — |

**Early user methods:**
- **Cooperative evaluation:**
  - The participant works with the evaluator, thinking aloud. Reliable but less economical.
  - **Steps:** task list → time estimate → task sheet → materials → introduce tasks → running commentary → prompt the participant to keep talking → brief interview → notes and report.
- **Participatory heuristic evaluation:** end users apply the heuristics. They need a good briefing; the downside is that they don't know heuristics well.
- **Co-discovery:** pairs or groups think aloud together. Naturalistic; captures first impressions; later design stage.
- **Think-aloud:**
  - Participants say what they look at, think, do and feel. Record and transcribe, ideally with what they were doing at the time.
  - Prompt minimally.
- **Interviews:**
  - Best for open, complex questions.
  - Structured or topic-based; max 1 h.
  - Summarise answers and confirm them with the participant.
  - Listen more than you talk; aim for understanding, not generalisation.

**Controlled experiments:**
- **Lab vs field:**
  - Lab: easier, cheaper, no full deployment needed.
  - Field: true to life, but costly and long-term.
- **Pros and cons:** you see real use with end users, but you need a (partly) working system; unfinished parts can bias results, and experiments take time.

**The 10-step experiment recipe:**
1. **Variables:**
   - **Independent:** what you manipulate (the conditions).
   - **Dependent:** what you measure.
   - **Confounding:** anything else that affects the dependent variable.
   - Examples: font colour → clicks, with colour blindness as a confounder; voice pitch → robot likeability, with participant gender and robot colour as confounders.
2. **Literature check for confounders.** Measure only those you have a rationale for.
   - Warning: **p-hacking**. At α = .05, 100 tests yield about 5 false positives.
   - Control for confounders statistically with **ANCOVA**: categorical IV, continuous DV, continuous covariate; check assumptions such as no outliers.
3. **Design:**
   - **Within-subjects:** everyone sees all conditions. Needs fewer people and controls for individual differences, but has learning and fatigue effects.
     - **Counterbalance** (randomise order) and check order as a factor in the analysis.
     - Counterbalancing doesn't *fix* learning effects. If you expect them (e.g. instructions A vs B), use between-subjects. Invalid results cost more than recruiting more people.
   - **Between-subjects:** each person sees one condition. No learning effects, but more people needed.
   - **Mixed design:** e.g. explanation style between subjects × task type within subjects.
4. **Participants:**
   - **Inclusion criteria:** what everyone must have, e.g. 60+, can travel to the location, owns a smartphone.
   - **Exclusion criteria:** what no one may have, e.g. lacks language proficiency, took part in a previous study, is the experimenter's student.
   - **Sample size:** depends on design, analysis, power and effect size; calculate with G*Power. In practice: how many can you get, and is it close enough? There's no reason to exceed the ideal. Small samples risk null results.
5. **Measures:**
   - **Subjective:** questionnaires (what people *say*).
   - **Objective:** physiological (heart rate, skin conductance, for stress or emotion; what people *feel*) and behavioural (clicks, usage time, choices, following suggestions; what people *do*).
   - **Questionnaire pitfalls:** what am I really measuring (construct validity, e.g. the Mayer & Davis trust/integrity items)? Do all items measure the same thing? Ceiling effects? Can people identify their own opinions?
   - **Cronbach's α** measures internal consistency; ≥0.7 is a common but arbitrary threshold. α can be *too* high (duplicate items). Check which items to drop to raise α.
   - **Use validated questionnaires.** Don't write your own.
6. **Procedure:** step by step, replicable (consent → task 1 → task 2 → questionnaires …).
7. **Analysis plan:** write it before collecting data.
   - **Pipeline:** prepare and transform data (score items 1–5, reverse negatively worded items, sum) → descriptives (mean, SD) → choose the test → check assumptions (normality via Shapiro-Wilk and QQ plots; if not met, use a non-parametric test) → run it → post-hoc tests (pairwise with Bonferroni correction) → interpret.
   - **Example:** repeated-measures ANOVA on self-esteem at t1, t2, t3: F(2,18) = 55.5, p < .0001, η²g = .83. Report it in exactly that format.
8. **List possible outcomes and what each would mean.**
9. **Write the ethics proposal.**
10. **Run a pilot.**

**Significance:**
- p < .05 means the chance of a Type I error (false positive) is below 5%. It is about generalising from the sample to the population.
- Non-significance does **not** prove there is no difference; you can conclude neither "different" nor "same".
- Differences are transitive (A > B > C means A > C); non-significance is not.

**Reporting a study** (Methods → Results → Discussion):
- **Participants (always):**
  - Who they are, how and where they were recruited, N, mean age and SD, gender balance, other relevant characteristics, and how those were measured.
  - Example: "18 children, mean age 8.89, SD 0.81, 9 boys and 9 girls, extroversion measured with BFQ-C."
- **Procedure (always):** setup, task content, order and repetition, when measures are taken, language and duration. *Someone else must be able to replicate it.*
- **Materials (if applicable):** the system, prototype and hardware (robot, VR headset).
- **Measures (always):** what is measured and how (which questionnaire, video annotation scheme, transcription).
- **Data preparation & analysis:** transcription, problem prioritisation, type of qualitative analysis, raw-to-score computation.
- **Results:** text, tables or graphs without speculating on why, e.g. "M = X (SD = Y) for group A".
  - One mean: write it in the text.
  - Five conditions: use a figure.
  - Six variables × three conditions: use a table.
- **Discussion:** interpretation and insights, future work, limitations.
- **Group report appendices** don't count toward the word limit **and are not graded**, so put essential content in the main text.

**Model paper: Hitron, Morag & Erel (2023), "Implications of AI Bias in HRI" (HRI '23)**
- **Design:** a robot moderated debates between a man and a woman. Between-subjects, 3 conditions: **Pro-Man** (stereotype-consistent), **Pro-Woman** (counter-stereotypical), **No-Preference**.
- **Participants:** 66 (33 man/woman pairs), mean age 24.1, SD 3.35. Sample size justified with G*Power (≥60 for a medium-large effect, 3 conditions). Random assignment.
- **Measures:**
  - Objective: Gender-Leadership **Implicit Association Test (IAT)**, reaction times.
  - Subjective: semi-structured interviews with thematic coding (two researchers, then a third to resolve).
  - Debriefing at the end.
- **Analysis:** mixed ANOVA; condition × IAT congruency interaction F(2,60) = 4.6, p = .03, η²p = .11.
- **Findings:**
  - Pro-Man increased stereotypical thinking; No-Preference increased it less.
  - Pro-Woman eliminated it.
  - Participants perceived the robot as objective (the "veil of objectivity") and rarely noticed its bias.
- **Lessons:**
  - AI bias in embodied, autonomous agents reinforces societal stereotypes because people question technology less than humans.
  - Counter-biased behaviour can be used deliberately for good.
  - Bias can't be fixed just by adding more data when the bias is in the source data.

---

## 9. Adaptive systems (Lecture 7)

**Adaptive systems** adapt to the user and/or environment. Almost all systems do minimally; "intelligent" adaptivity often means AI.

**Levels of adaptivity (Browne et al. 1990):**
1. Output changes with input.
2. Responds to input sequences (has memory).
3. Monitors the effect of its adaptation and changes based on it.
4. Has an internal model of the interaction and adapts based on expected effect.
5. Higher-level reasoning that can change its own internal models.

**Domain model:** the system's representation of its environment, at three description levels:
- **Physical:** colour, position, time ("white text on blue, top-left").
- **Conceptual:** "logo", "button", "header".
- **Intentional:** purpose, urgency, topic ("tells you which institution's website you're on").

**User model:** what the user's knowledge, behaviour, emotion and personality mean for adaptation. Needed whenever the system goes beyond plain input-output.

**Emotion — represent, detect, adapt:**
- **Discrete:**
  - Ekman: anger, disgust, fear, happiness, sadness, surprise.
  - Plutchik pairs: joy–sadness, anger–fear, trust–disgust, surprise–anticipation.
- **Dimensional:** **valence** (negative to positive) × **arousal** (energy). Examples: excited vs happy, tired vs calm, sad vs annoyed, anger vs fear.
- **Appraisal theory:** not covered.
- **Adaptation modalities:** behaviour, language, embodiment.

**Wizard of Oz (WoZ):**
- A hidden human simulates part of the system's intelligence behind a real or mock interface, to test a function before the rest exists. Example: test expressed regret when speech recognition doesn't work yet.
- **What the wizard simulates is not the subject of the study.**
- **Good for:** complex vertical functionality, futuristic ideas, testing premises.
- **Drawback:** a human never behaves exactly like the eventual system.
- **Wizard protocol:**
  - **Observation:** what the wizard can perceive. Limit it to what the system will perceive; for example, audio only if the system only hears.
  - **Action space:** what the wizard can do. Limit it to the system's future capabilities; for example, type text with only `,` and `.`, or pick one of 6 categories.
  - **Protocol:** exactly how observation maps to action; for example, type exactly what is said, including "ehs".
  - Components buildable with current technology are easier to specify.
- **LLMs** can now fill many WoZ language roles. You still need to control outputs through prompt engineering, so behaviour is consistent across participants yet natural for each one.

**Layered evaluation (Paramythis et al. 2010):** evaluate adaptation in layers, not as a monolith.

| Layer | Question | Criteria | Example |
|---|---|---|---|
| 1. Collect input data | Is behaviour registered accurately? | Reliability, accuracy, latency | Is the audio recorded properly? Does the camera see the face? |
| 2. Interpret data | Are users doing what the system thinks? | Validity | Does a positive rating mean the user liked the movie? Is speech transcribed correctly? |
| 3. Model the current state of the world | Does the user/context model reflect reality? | Validity; also comprehensiveness, redundancy, precision, sensitivity, scrutability | Are intents recognised correctly? Is the detected emotion the real one? |
| 4. Decide upon adaptation | Is intervening necessary? Is the strategy appropriate? | Necessity, appropriateness, subjective acceptance | Push or pull a recommendation? Mirror the user's emotion? |
| 5. Apply adaptation | Does the concrete instantiation work, is it understood, is it liked? | Usability, obtrusiveness, acceptance, timeliness, user control | Is the TTS voice understandable? Do people recognise the robot's expressed emotion? |

- **Exercise answers:**
  - Hug robot deciding *whether* to hug: layer 4, decide.
  - "Users who play a song more than 5 times would recommend it": layer 2/3, interpretation or modelling.
  - TTS intelligibility: layer 5, apply.
- **WoZ and layered evaluation:** a WoZ simulates one layer while you evaluate another. Every WoZ is a layered evaluation, but not every layered evaluation needs a wizard.
- **Benefits:** separation of concerns, catches wrong assumptions, guides formative development.
- **Drawbacks:** the whole is more than the sum of its parts; layers can interact unexpectedly.

---

## 10. Conversational UX design (Moore & Arar 2018)

- Interfaces evolved from CLI to GUI to NUI, AR/VR and **natural language interfaces**. With command lines, users learned the computer's language; with NLIs, the computer learns the user's.
- NLP doesn't tell you how to *sequence* utterances. Use **Conversation Analysis (CA)**: turn-taking, sequence organization, repair. Embrace conversational complexity rather than simplifying it away.

**Four interaction styles of chatbots:**
1. **System-centric:** like search or voice commands. Only queries, user-driven, two-turn sequences, no memory; can't handle "thanks" or "what do you mean?".
2. **Content-centric:** FAQ-like, with long document-style answers. Incompatible with voice; little back-and-forth.
3. **Visual-centric:** buttons and lists, agent-led and linear. Often **"hijacks 3rd position"**: it asks "Was this useful?" immediately instead of letting the user react to the answer.
4. **Conversation-centric** (the recommended style):
   - Supports **conversation management** ("what did you say?", "never mind", "okay").
   - Short, bite-sized turns.
   - Mixed initiative and non-linear; the user can redirect.
   - **Advantages:** specific answers, expandable detail, adapts to user knowledge, works on voice-only and any screen.

**Conversation-first design**, analogous to mobile-first:
- Make core functionality work through **words alone** (voice or text).
- Then progressively enhance with visual aids.
- Stay compatible across platforms.

**Three speaker design principles:**
- **Recipient design:**
  - Tailor talk to the recipient's knowledge.
  - Offer multiple paths: experts get speed ("flights SFO→JFK Apr 17–30"), novices get hand-holding ("I'm going on vacation!").
- **Minimization:**
  - Use as few words as needed for *this* recipient. It is secondary to recipient design.
  - Example: "IATA code of origin?" should be "Which airport do you want to leave from?"
- **Repair:**
  - Build intents for "what did you say?", "what do you mean (by X)?", "can you give an example?", "no, I mean one way".
  - Repair frees the designer from having to recognise intent on the first try.
- **Combined strategy:** give concise answers first and let users expand them (definitions, paraphrases, examples) on demand.

**Conversation types:**
- **Ordinary:** the most flexible.
- **Service:** fixed roles. The opening is greeting, self-identification, organisation and offer of service, with a fast transition to the request.
- **Teaching:** known-answer questions; correction is expected.
- **Counselling:** the counselee leads; the counsellor reformulates.
- All share the same machinery: turn-taking, sequences, repair.

**Representing conversational UX:** use CA-style transcripts (numbered turns `A:` / `U:`) instead of wireframes.

---

## 11. Quick checklists for future project work

**Before designing**
- [ ] PACT analysis done; user classes, ≥2 personas, scenarios free of UI details.
- [ ] HTA for the key tasks, with plans.
- [ ] User stories → SMART system requirements, both functional and non-functional (incl. accessibility, privacy, performance); MoSCoW priorities.
- [ ] Requirements checked for vague words ("fast", "user friendly"); AI may assist, humans verify.

**IA & lo-fi**
- [ ] Card sort (open, then closed), 4–6 top categories, labels clear, predictable and consistent.
- [ ] Organization scheme chosen deliberately (exact vs inexact vs hybrid with clear divisions).
- [ ] Global, local, contextual and supplemental navigation defined; the user always knows where they are.
- [ ] Two structural variants compared (e.g. category-first vs search/map-first).
- [ ] Greyscale lo-fi first; AI used to benchmark, not to decide.

**Prototype / UI / code**
- [ ] Every screen passes the 7 Universal Design questions.
- [ ] Contrast ≥ 4.5:1 for text and ≥ 3:1 for large text, icons and outlines; colour is never the only cue.
- [ ] Targets ≥ 44×44 (48 on a kiosk), well spaced (Fitts).
- [ ] Visible keyboard focus; nothing hover-only; semantic HTML (`<button>`, `<nav>`, labels, alt text), screen-reader friendly.
- [ ] One clear primary action per screen; labels say what happens; few choices (Hick); minimal design.
- [ ] Always a way back (Back, Close, click outside); undo; error prevention; plain-language error messages with a fix.
- [ ] Visible system status and feedback; recognition over recall (breadcrumbs, visited states, carry information across screens).
- [ ] Empty, loading, error and edge-case states exist (avoid the "illusion of completeness").
- [ ] AI-generated output audited and **logged in an AI iteration log** (prompt → output → what we changed → why).

**Evaluation**
- [ ] A focused, feasible research question of a stated type (descriptive / comparative / evaluative / defining / explaining / designing).
- [ ] Method matched to the stage (expert vs user; design / prototype / deployment).
- [ ] Heuristic evaluation: 3–5 independent evaluators, problems listed separately with the heuristic violated, severity = impact × frequency (+ cost).
- [ ] Cognitive walkthrough: 4 questions per action step.
- [ ] Experiment: IV / DV / confounders; within vs between (counterbalance, check order effects); inclusion/exclusion criteria; G*Power; validated questionnaires (SUS, UEQ, NASA-TLX…); analysis plan before data; pilot.
- [ ] Ethics: RPT risk session, granular informed consent (purpose, tasks, risks, mitigations, data, anonymity, withdrawal), minimal PII, AI/LLM data-leak disclosure, HREC submission.
- [ ] Adaptive or AI features: layered evaluation; WoZ with an explicit observation / action space / protocol.
- [ ] Report: Participants, Procedure, Materials, Measures, Analysis, Results (M, SD, test statistics), Discussion (insights, future work, limitations). Essentials go in the main text, not the appendix.

**Conversational / AI agents**
- [ ] Conversation-centric, works with words alone; short turns; mixed initiative.
- [ ] Repair intents and conversation management; don't hijack 3rd position.
- [ ] Recipient design (expert and novice paths) plus minimization.
- [ ] Check for AI bias; don't hide behind the "veil of objectivity"; consider the level of automation and keep a human in control where stakes are high.

---

## 12. Source files (in this folder)

| File | Content |
|---|---|
| `1_Introduction_To_HCI2.pdf` | HCI, usability, PACT, personas, HTA, scenarios |
| `2.Requirements_Class.pdf` | Requirements, SMART, MoSCoW, AI in requirements engineering, IA, labelling, card sorting, navigation |
| `3_User_Experience (1).pdf` | Nielsen & Benyon principles, UX laws, SUS |
| `4_Ethics_&_Accessibility_ClassroomDeck (2).pdf` | Research ethics, informed consent, exclusion, Universal Design |
| `5_Design_Classroom_Deck (1).pdf` | Prototyping, fidelity, FindItOut example |
| `6_Prototyping_AI.pdf` | Houde & Hill, Lim & Stolterman, AI prototyping risks and matrix |
| `5.ExpertEvaluation 2026.pdf` | Research questions, cognitive walkthrough, heuristic evaluation, early user methods, reporting |
| `6. UserEvaluation2026_UG.pdf` | Controlled experiments, measures, statistics, reporting |
| `7.Adaptive systems 2026.pdf` | Adaptivity levels, models, emotion, WoZ, layered evaluation, exam info |
| `6_RPT-Risk-planning tool.pdf` | TU Delft risk-planning tool and prompting questions |
| `universal-design-questions.pdf` | UD cheat sheet with WCAG numbers |
| `CSE12B Lab 2 …pptx`, `Activity 1–4 …html.zip` | Lab 2: IA, card sorting, wireframing, critique |
| `CSE12B_Lab_3_…pptx` | Lab 3: Figma, accessibility, ethics, AI audit |
| `Heuristic Evaluation_ How-To_ …pdf` | Nielsen (1994) article |
| `Conversational UX Design.pdf` | Moore & Arar (2018) |
| `Implications of AI Bias in HRI_Hitronetal2023.pdf` | Example user-study paper |
| `List of things to read & watch*.html.zip` | Weekly reading and video lists |
