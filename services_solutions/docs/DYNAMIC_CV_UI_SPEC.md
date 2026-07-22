# Dynamic CV UI Spec

## 1. Product Intent
Dynamic CV is not a static CV page. It is a role-driven interface that lets viewers understand, within a few seconds, which work positions fit the owner, what problems are handled in each position, and how those problems are turned into concrete outputs.

The first experience is not reading biography text. The first experience is selecting a work position and watching the information system for that position assemble itself on screen.

---

## 2. Core UX Principle
The UI follows this interaction order:

**Position → Problem → Solution → Detail**

This means:
- viewers first see work-position cards
- after selecting a position, they immediately see the groups of information relevant to that role
- inside each group, skill or information bars appear as modular units
- if a bar has deeper information, the viewer can open a rich-detail panel

This makes the page feel like a living career system rather than a resume.

---

## 3. First Screen Experience
### 3.1 Entry State
When the page first loads, the main stage shows:
- a short headline or context sentence
- a grid or row of role cards
- no dense long-form content yet

### 3.2 Role Cards
Each role card should contain:
- role title
- optional short summary
- optional small tags for problem focus
- active/inactive visual state

Examples:
- Product & Workflow Designer
- Workflow Domain Translator
- Service Application Designer
- Solution Designer (Business to Execution)

### 3.3 UX Goal of Entry State
The viewer should immediately understand that the page can be explored through different professional roles.

---

## 4. Transition from Role Card to Information Stage
When the viewer clicks a role card, the interface should animate into a structured information stage.

### 4.1 Transition Rule
The transition must feel like information is being assembled, not merely switched.

### 4.2 Animation Sequence
The sequence should happen in layers:

#### Layer A: Group Blocks enter
- group blocks rise from below the visible area
- they enter with staggered timing
- they should not all appear at exactly the same moment
- slight opacity and translate animation should be used

#### Layer B: Info Bars enter
- info bars also rise from below
- their timing should be slightly randomized within a controlled range
- they should attach into the relevant group block
- they should appear to complete the internal layout of that block

### 4.3 Transition Feel
The final impression should be:
- structured
- dynamic
- system-like
- not chaotic

---

## 5. Information Stage Structure
After a role is selected, the page displays multiple content groups.

### 5.1 Group Blocks
Each group block is a visual container representing one class of information.

Recommended group examples:
- Role Focus
- Problems I Handle
- Methods / Approach
- Outputs / Deliverables
- Related Skills
- Proof / Case Links

### 5.2 Group Block Requirements
Each block must have:
- block title or group name
- caption inside the block
- inner layout area for info bars
- stable visual container across role changes if the group type is shared

### 5.3 Captions Inside Block
A group caption should explain what the block means.

Examples:
- “Nhóm vấn đề anh chuyên xử lý”
- “Các năng lực thường được dùng trong vai trò này”
- “Các loại đầu ra có thể tạo”

The caption should be readable but visually secondary to the actual bars.

---

## 6. Info Bars
Info bars are the smaller modular units inside each block. They represent one skill, problem, output, method, or evidence item.

Examples:
- Flow Structuring
- Information Architecture
- Workflow Mapping
- Service Logic
- Rapid Prototype
- Business to Execution Bridge

### 6.1 Bar Behavior
Each bar:
- animates upward during entry
- snaps into its group container
- can have different widths based on content length
- may optionally carry a detail indicator

### 6.2 Detail Indicator
If a bar has deeper content in data, it shows an `!` button.

The `!` means:
- more explanation exists
- clicking should open a detail surface
- not every bar must have it

---

## 7. Switching from Role A to Role B
When the viewer switches from one role card to another, the previous content should not disappear abruptly.

### 7.1 Exit of Current Role Content
For Role A:
- info bars fade out first
- block content reduces emphasis
- blocks can fade or slide down slightly
- animation must remain clean and readable

### 7.2 Entry of New Role Content
For Role B:
- new blocks come up from below
- new bars rise and attach into matching groups
- where a group type is shared, the block shell may remain and only the contents transition

### 7.3 UX Goal
The viewer should feel that the role context changed and the information system was rebuilt accordingly.

---

## 8. Detail Surface
The detail surface opens when a viewer presses `!` on a bar.

### 8.1 Required Capability
The detail surface must support rich content, not only plain text.

Supported content should allow:
- headings
- paragraphs
- styled lists
- note boxes
- quotations
- images
- embedded media or visual blocks if needed
- links
- tags

### 8.2 Recommended Format
Use either:
- a structured rich-content JSON renderer
- or a controlled HTML content field for advanced cases

### 8.3 Display Mode
Preferred options:
- side panel from the right
- or modal panel centered with overlay

For content with images and formatted sections, a side panel is usually better.

---

## 9. Layout Guidance
### 9.1 Desktop
Recommended layout:
- role cards at top
- information stage below
- stage uses responsive multi-block layout
- blocks can follow grid or controlled masonry behavior

### 9.2 Mobile
Recommended layout:
- role cards become horizontal scroll or stacked cards
- group blocks stack vertically
- animations remain but become simpler and lighter
- detail panel should become full-screen overlay or bottom sheet

---

## 10. Motion Rules
### 10.1 General Motion Tone
Motion should feel:
- precise
- modern
- system-based
- slightly alive

It should not feel:
- playful in a childish way
- overly cinematic
- noisy

### 10.2 Motion Constraints
- use stagger, not full simultaneous entry
- allow small random offsets within a controlled range
- avoid dramatic rotation
- keep translateY values moderate
- keep opacity transitions smooth

### 10.3 Recommended Motion Presets
Suggested ranges:
- block delay: 80ms to 220ms
- bar delay: 40ms to 160ms additional stagger
- entry translateY: 20px to 56px
- exit translateY: 8px to 20px
- bar random shift: very small, controlled

---

## 11. Accessibility and Usability Rules
- all role cards must be keyboard accessible
- all `!` detail triggers must have accessible labels
- animation should respect reduced-motion preference
- color should not be the only way to indicate active state
- blocks and bars must remain readable with animations disabled
- detail panel content must remain legible even if rich content is large

---

## 12. Suggested UI States
### Role Card
- default
- hover
- active
- disabled (optional)

### Group Block
- hidden
- entering
- active
- leaving

### Info Bar
- hidden
- entering
- active
- detail-available
- leaving

### Detail Panel
- closed
- opening
- active
- closing

---

## 13. Experience Summary
The page should feel like this:

The viewer arrives and sees several professional-role cards. After selecting one, the interface activates a stage where content groups rise into place. Then smaller information bars follow, also rising from below and attaching themselves into the correct blocks. The resulting composition makes the role visible through structured information instead of long paragraphs. When the viewer switches to another role, the previous bars and groups fade away and the new role assembles itself in the same stage. If a bar contains deeper information, an `!` trigger opens a rich-detail panel that supports styled content and embedded images.

That is the intended identity of the Dynamic CV interface.
