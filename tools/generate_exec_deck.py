"""
Executive deck generator - Agentic SDLC Delivery System.

Five visual slides, designed to be read without a presenter:

    1. The idea            - three-step picture + four headline numbers
    2. Architecture        - four stacked layers, six agent chips
    3. Flow                - nine-step chevron ribbon with five human gates
    4. Cost                - proportional bar charts, build phase vs per story
    5. Infra, pros, cons   - one cost figure, benefits and risks side by side

Design rules applied throughout:
  - every slide has an assertion title (a claim, not a topic)
  - every slide ends with a single plain-English takeaway bar
  - body text is capped at short phrases; the diagram carries the meaning
  - all money and token figures are computed from the constants below

Usage:
    py -3 tools/generate_exec_deck.py
"""

from __future__ import annotations

from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.util import Emu, Inches, Pt

# --------------------------------------------------------------------------
# Palette (mirrors the @theme tokens in src/app/globals.css)
# --------------------------------------------------------------------------
BRAND_700 = RGBColor(0x17, 0x51, 0x8D)
BRAND_600 = RGBColor(0x1F, 0x66, 0xB0)
BRAND_500 = RGBColor(0x2A, 0x7F, 0xD4)
BRAND_300 = RGBColor(0x8F, 0xBF, 0xEA)
BRAND_100 = RGBColor(0xD9, 0xEB, 0xFF)
BRAND_50 = RGBColor(0xEE, 0xF6, 0xFF)
INK_900 = RGBColor(0x10, 0x20, 0x2E)
INK_600 = RGBColor(0x4A, 0x5B, 0x68)
HAIRLINE = RGBColor(0xDB, 0xE4, 0xEC)
SURFACE = RGBColor(0xFF, 0xFF, 0xFF)
SURFACE_MUTED = RGBColor(0xF5, 0xF8, 0xFB)
AMBER = RGBColor(0xB5, 0x6A, 0x0B)
AMBER_MID = RGBColor(0xE0, 0x9B, 0x3D)
AMBER_BG = RGBColor(0xFD, 0xF4, 0xE3)
GREEN = RGBColor(0x1B, 0x6E, 0x4B)
GREEN_BG = RGBColor(0xE8, 0xF5, 0xEE)

FONT = "Segoe UI"

TOTAL_SLIDES = 6

SLIDE_W = Inches(13.333)
SLIDE_H = Inches(7.5)
MARGIN = Inches(0.62)
BODY_W = SLIDE_W - 2 * MARGIN

# --------------------------------------------------------------------------
# Cost assumptions - single source of truth
# --------------------------------------------------------------------------
PRICE_IN_PER_M = 3.00
PRICE_OUT_PER_M = 15.00
RETRY_BUFFER = 0.30
CACHE_SAVING = 0.40

# (label, agent sessions, input tokens/session, output tokens/session)
BUILD_WORKSTREAMS = [
    ("Six specialist agents", 280, 57_000, 8_000),
    ("Control plane", 120, 60_000, 8_000),
    ("Docs, runbooks, evals", 50, 35_000, 9_000),
    ("CI/CD and environments", 40, 40_000, 6_000),
]

# (label, input tokens, output tokens)
RUN_STAGES = [
    ("Writing the code", 1_200_000, 90_000),
    ("Tests and CI fixes", 600_000, 75_000),
    ("Release and validation", 130_000, 12_000),
    ("Intake and story prep", 90_000, 12_000),
    ("Audit trail", 30_000, 6_000),
]


def usd(t_in: int, t_out: int) -> float:
    return t_in / 1_000_000 * PRICE_IN_PER_M + t_out / 1_000_000 * PRICE_OUT_PER_M


def money(v: float) -> str:
    return f"${v:,.0f}" if v >= 100 else f"${v:,.2f}"


def millions(t: float) -> str:
    return f"{t / 1_000_000:.1f}M"


BUILD_BARS = []
build_in = build_out = build_sessions = 0
for _label, _sessions, _tin, _tout in BUILD_WORKSTREAMS:
    r_in, r_out = _sessions * _tin, _sessions * _tout
    build_in += r_in
    build_out += r_out
    build_sessions += _sessions
    BUILD_BARS.append((_label, usd(r_in, r_out)))
BUILD_COST = usd(build_in, build_out)
BUILD_TOTAL = BUILD_COST * (1 + RETRY_BUFFER)

RUN_BARS = []
run_in = run_out = 0
for _label, _tin, _tout in RUN_STAGES:
    run_in += _tin
    run_out += _tout
    RUN_BARS.append((_label, usd(_tin, _tout)))
RUN_COST = usd(run_in, run_out)
RUN_TOTAL = RUN_COST * (1 + RETRY_BUFFER)
RUN_OPTIMISED = usd(int(run_in * (1 - CACHE_SAVING)), run_out)


# --------------------------------------------------------------------------
# Primitives
# --------------------------------------------------------------------------
def emu(v) -> Emu:
    """Whole-EMU coercion. Derived widths are floats and a fractional EMU
    serialises as an invalid ST_Coordinate, which makes the file unopenable."""
    return Emu(int(round(v)))


def blank(prs):
    return prs.slides.add_slide(prs.slide_layouts[6])


def text(slide, left, top, width, height, body, size=14, bold=False, color=INK_900,
         align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, spacing=0):
    box = slide.shapes.add_textbox(emu(left), emu(top), emu(width), emu(height))
    tf = box.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    for i, line in enumerate(body.split("\n")):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        p.space_after = Pt(spacing)
        r = p.add_run()
        r.text = line
        r.font.size = Pt(size)
        r.font.bold = bold
        r.font.color.rgb = color
        r.font.name = FONT
    return box


def shape(slide, kind, left, top, width, height, body="", fill=BRAND_50, line=BRAND_600,
          size=12, bold=False, color=INK_900, line_width=1.0, sub_delta=2.5,
          align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, no_line=False):
    sh = slide.shapes.add_shape(kind, emu(left), emu(top), emu(width), emu(height))
    sh.fill.solid()
    sh.fill.fore_color.rgb = fill
    if no_line:
        sh.line.fill.background()
    else:
        sh.line.color.rgb = line
        sh.line.width = Pt(line_width)
    sh.shadow.inherit = False
    tf = sh.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    tf.margin_left = Inches(0.05)
    tf.margin_right = Inches(0.05)
    tf.margin_top = Inches(0.02)
    tf.margin_bottom = Inches(0.02)
    if body:
        for i, line_text in enumerate(body.split("\n")):
            p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
            p.alignment = align
            r = p.add_run()
            r.text = line_text
            r.font.size = Pt(size if i == 0 else max(size - sub_delta, 7.5))
            r.font.bold = bold if i == 0 else False
            r.font.color.rgb = color
            r.font.name = FONT
    return sh


def box(slide, left, top, width, height, body="", **kw):
    return shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height, body, **kw)


def rect(slide, left, top, width, height, body="", **kw):
    return shape(slide, MSO_SHAPE.RECTANGLE, left, top, width, height, body, **kw)


def arrow_right(slide, left, top, width, height=Inches(0.15), color=BRAND_500):
    return shape(slide, MSO_SHAPE.RIGHT_ARROW, left, top, width, height,
                 fill=color, no_line=True)


def arrow_down(slide, cx, top, height, width=Inches(0.20), color=BRAND_300):
    return shape(slide, MSO_SHAPE.DOWN_ARROW, cx - width / 2, top, width, height,
                 fill=color, no_line=True)


def title(slide, index, headline, standfirst=""):
    """Assertion title + accent rule + slide number. Returns body top."""
    text(slide, MARGIN, Inches(0.28), BODY_W, Inches(0.55), headline,
         size=28, bold=True, color=BRAND_700)
    rule = rect(slide, MARGIN, Inches(0.94), Inches(1.05), Pt(4), fill=BRAND_500, no_line=True)
    top = Inches(1.22)
    if standfirst:
        text(slide, MARGIN, Inches(1.02), BODY_W, Inches(0.32), standfirst, size=13, color=INK_600)
        top = Inches(1.52)
    text(slide, SLIDE_W - Inches(1.1), SLIDE_H - Inches(0.42), Inches(0.5), Inches(0.26),
         f"{index}/{TOTAL_SLIDES}", size=10, color=INK_600, align=PP_ALIGN.RIGHT)
    return top


def takeaway(slide, body, tone="info", top=Inches(6.62), height=Inches(0.6)):
    """The single sentence a reader keeps if they read nothing else."""
    fill, line, color = {
        "info": (BRAND_50, BRAND_500, BRAND_700),
        "warn": (AMBER_BG, AMBER, AMBER),
        "good": (GREEN_BG, GREEN, GREEN),
    }[tone]
    sh = box(slide, MARGIN, top, BODY_W, height, fill=fill, line=line, line_width=1.25)
    tf = sh.text_frame
    tf.margin_left = Inches(0.18)
    tf.margin_right = Inches(0.18)
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.LEFT
    r = p.add_run()
    r.text = body
    r.font.size = Pt(13.5)
    r.font.bold = True
    r.font.color.rgb = color
    r.font.name = FONT
    return sh


def stat(slide, left, top, width, height, value, label, note="", value_size=30,
         fill=BRAND_50, line=BRAND_100, value_color=BRAND_700):
    card = box(slide, left, top, width, height, fill=fill, line=line, line_width=1.25)
    tf = card.text_frame
    tf.margin_top = Inches(0.09)
    rows = [(value, value_size, True, value_color), (label, 12, False, INK_900)]
    if note:
        rows.append((note, 9.5, False, INK_600))
    for i, (t, sz, bd, cl) in enumerate(rows):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = PP_ALIGN.CENTER
        r = p.add_run()
        r.text = t
        r.font.size = Pt(sz)
        r.font.bold = bd
        r.font.color.rgb = cl
        r.font.name = FONT
    return card


def bar_chart(slide, left, top, width, rows, peak, bar_color=BRAND_600,
              label_ratio=0.42, amount_w=Inches(0.78), row_h=Inches(0.30),
              row_gap=Inches(0.155), label_size=11.5):
    """Horizontal proportional bars: label | track+fill | amount."""
    label_w = width * label_ratio
    track_x = left + label_w + Inches(0.10)
    track_w = width - label_w - Inches(0.10) - amount_w - Inches(0.10)
    y = top
    for label, value in rows:
        text(slide, left, y - Inches(0.015), label_w, row_h, label,
             size=label_size, color=INK_900, anchor=MSO_ANCHOR.MIDDLE)
        rect(slide, track_x, y, track_w, row_h, fill=SURFACE_MUTED, no_line=True)
        fill_w = max(track_w * value / peak, Inches(0.05))
        rect(slide, track_x, y, fill_w, row_h, fill=bar_color, no_line=True)
        text(slide, track_x + track_w + Inches(0.10), y - Inches(0.015), amount_w, row_h,
             money(value), size=11.5, bold=True, color=BRAND_700,
             align=PP_ALIGN.RIGHT, anchor=MSO_ANCHOR.MIDDLE)
        y += row_h + row_gap
    return y


def tick_list(slide, left, top, width, items, marker="\u2713", marker_color=GREEN,
              marker_bg=GREEN_BG, size=12.5, row_h=Inches(0.34), gap=Inches(0.29)):
    y = top
    for item in items:
        shape(slide, MSO_SHAPE.OVAL, left, y + Inches(0.02), Inches(0.26), Inches(0.26),
              marker, fill=marker_bg, line=marker_color, size=11, bold=True,
              color=marker_color, line_width=1.0)
        text(slide, left + Inches(0.38), y - Inches(0.03), width - Inches(0.38),
             row_h + Inches(0.22), item, size=size, color=INK_900)
        y += row_h + gap
    return y


def info_card(slide, left, top, width, height, head, body, foot="", foot_label="",
              accent=BRAND_700, foot_color=GREEN, fill=SURFACE, line=HAIRLINE):
    """Heading, a short explanation, and the control that answers it."""
    card = box(slide, left, top, width, height, fill=fill, line=line, line_width=1.25)
    tf = card.text_frame
    tf.vertical_anchor = MSO_ANCHOR.TOP
    tf.margin_left = Inches(0.17)
    tf.margin_right = Inches(0.17)
    tf.margin_top = Inches(0.13)

    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.LEFT
    p.space_after = Pt(5)
    r = p.add_run()
    r.text = head
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = accent
    r.font.name = FONT

    p2 = tf.add_paragraph()
    p2.alignment = PP_ALIGN.LEFT
    p2.space_after = Pt(7)
    r2 = p2.add_run()
    r2.text = body
    r2.font.size = Pt(10.5)
    r2.font.color.rgb = INK_600
    r2.font.name = FONT

    if foot:
        p3 = tf.add_paragraph()
        p3.alignment = PP_ALIGN.LEFT
        if foot_label:
            rl = p3.add_run()
            rl.text = foot_label
            rl.font.size = Pt(10.5)
            rl.font.bold = True
            rl.font.color.rgb = foot_color
            rl.font.name = FONT
        r3 = p3.add_run()
        r3.text = foot
        r3.font.size = Pt(10.5)
        r3.font.color.rgb = foot_color
        r3.font.name = FONT
    return card


# --------------------------------------------------------------------------
# Slide 1 - The idea
# --------------------------------------------------------------------------
def slide_idea(prs):
    s = blank(prs)
    band = rect(s, 0, 0, SLIDE_W, Inches(2.05), fill=BRAND_700, no_line=True)
    rect(s, 0, Inches(2.05), SLIDE_W, Pt(6), fill=BRAND_500, no_line=True)

    text(s, MARGIN, Inches(0.34), BODY_W, Inches(0.3),
         "AGENTIC SDLC DELIVERY SYSTEM   |   PROOF OF CONCEPT", size=12, bold=True, color=BRAND_100)
    text(s, MARGIN, Inches(0.72), BODY_W, Inches(0.75),
         "Agents do the delivery work. People keep the decisions.",
         size=33, bold=True, color=SURFACE)
    text(s, MARGIN, Inches(1.50), BODY_W, Inches(0.4),
         "A requirement goes in. Tested, deployed, fully evidenced stories come out - and a named human signs off at every gate.",
         size=14, color=BRAND_100)

    # Three-step picture
    y = Inches(2.55)
    h = Inches(1.55)
    w = Inches(3.35)
    gap = Inches(0.72)
    x = MARGIN + Inches(0.35)

    box(s, x, y, w, h, "REQUIREMENT\nOne business need, captured once",
        fill=SURFACE, line=BRAND_600, size=15, bold=True, color=BRAND_700, sub_delta=3.5, line_width=1.5)
    arrow_right(s, x + w + Inches(0.14), y + h / 2 - Inches(0.11), gap - Inches(0.28), Inches(0.22))

    x2 = x + w + gap
    box(s, x2, y, w, h, "AGENTS DO THE WORK\nPlan \u2022 code \u2022 test \u2022 deploy \u2022 evidence",
        fill=BRAND_600, line=BRAND_600, size=15, bold=True, color=SURFACE, sub_delta=3.5, line_width=1.5)
    arrow_right(s, x2 + w + Inches(0.14), y + h / 2 - Inches(0.11), gap - Inches(0.28), Inches(0.22))

    x3 = x2 + w + gap
    box(s, x3, y, w, h, "DONE\nWith a complete, replayable audit trail",
        fill=SURFACE, line=BRAND_600, size=15, bold=True, color=BRAND_700, sub_delta=3.5, line_width=1.5)

    # Human gate marker sitting over the middle block
    box(s, x2 + w / 2 - Inches(1.35), y + h + Inches(0.20), Inches(2.7), Inches(0.42),
        "5 HUMAN APPROVAL GATES", fill=AMBER_BG, line=AMBER, size=11.5, bold=True, color=AMBER)

    kpis = [
        (money(BUILD_TOTAL), "to build it", "one-off, in tokens"),
        (money(RUN_TOTAL), "per story", "intake to closure"),
        ("$235-660", "per month", "infrastructure"),
        ("0", "agent approvals", "people sign, always"),
    ]
    w2 = Inches(2.93)
    g2 = Inches(0.20)
    xk = MARGIN
    for value, label, note in kpis:
        stat(s, xk, Inches(5.10), w2, Inches(1.28), value, label, note, value_size=29)
        xk += w2 + g2

    takeaway(s, "Ask: approve a 2-4 week pilot on one service. Name the human approver for each gate.", tone="info")


# --------------------------------------------------------------------------
# Slide 2 - Architecture
# --------------------------------------------------------------------------
def slide_architecture(prs):
    s = blank(prs)
    title(s, 2, "Six agents do the work. A control plane keeps them in the rails.",
          "1. Implementation architecture")

    # Layer 1 - where people already work
    y = Inches(1.62)
    text(s, MARGIN, y - Inches(0.30), Inches(6.0), Inches(0.26),
         "YOUR TEAMS KEEP WORKING WHERE THEY ALREADY DO", size=10.5, bold=True, color=INK_600)
    w = (BODY_W - Inches(0.30)) / 2
    box(s, MARGIN, y, w, Inches(0.66), "Jira Cloud", fill=SURFACE, line=BRAND_600, size=14, bold=True, color=BRAND_700)
    box(s, MARGIN + w + Inches(0.30), y, w, Inches(0.66), "GitHub", fill=SURFACE, line=BRAND_600, size=14, bold=True, color=BRAND_700)

    arrow_down(s, SLIDE_W / 2, y + Inches(0.76), Inches(0.30))

    # Layer 2 - control plane
    y2 = Inches(2.72)
    box(s, MARGIN, y2, BODY_W, Inches(0.82), fill=BRAND_700, line=BRAND_700, line_width=1.5)
    text(s, MARGIN + Inches(0.25), y2 + Inches(0.10), Inches(3.0), Inches(0.62),
         "CONTROL PLANE", size=13.5, bold=True, color=SURFACE, anchor=MSO_ANCHOR.MIDDLE)
    inner = BODY_W - Inches(3.35)
    cw = (inner - Inches(0.36)) / 3
    cx = MARGIN + Inches(3.15)
    for label in ["Workflow engine\nstate \u2022 retries", "Policy & budgets\nrules \u2022 caps", "Evidence ledger\none audit trail"]:
        box(s, cx, y2 + Inches(0.11), cw, Inches(0.60), label, fill=BRAND_600, line=BRAND_500,
            size=11.5, bold=True, color=SURFACE, sub_delta=2.5)
        cx += cw + Inches(0.18)

    arrow_down(s, SLIDE_W / 2, y2 + Inches(0.86), Inches(0.22))

    # Layer 3 - agents
    y3 = Inches(3.84)
    text(s, MARGIN, y3 - Inches(0.30), Inches(6.4), Inches(0.26),
         "SIX NARROW AGENTS - EACH WITH ITS OWN LEAST-PRIVILEGE ACCESS", size=10.5, bold=True, color=INK_600)
    agents = [("Planner", "breaks it down"), ("Jira", "keeps the board true"),
              ("Coding", "writes the code"), ("Testing", "proves it works"),
              ("Release", "ships to dev & QA"), ("Validation", "checks the evidence")]
    n = len(agents)
    gap = Inches(0.16)
    aw = (BODY_W - gap * (n - 1)) / n
    ax = MARGIN
    for name, sub in agents:
        box(s, ax, y3, aw, Inches(0.86), f"{name}\n{sub}", fill=BRAND_100, line=BRAND_600,
            size=13, bold=True, color=BRAND_700, sub_delta=3.5)
        ax += aw + gap

    arrow_down(s, SLIDE_W / 2, y3 + Inches(0.96), Inches(0.30))

    # Layer 4 - platform strip
    y4 = Inches(5.32)
    box(s, MARGIN, y4, BODY_W, Inches(0.62),
        "RUNS ON:   containers that scale to zero   \u2022   managed database   \u2022   object storage   \u2022   secrets vault   \u2022   full telemetry",
        fill=SURFACE_MUTED, line=HAIRLINE, size=12, bold=True, color=INK_600, line_width=1.0)

    takeaway(s, "No model ever touches Jira, the repository or an environment directly - every action is a permission-checked tool call.",
             tone="info", top=Inches(6.22))


# --------------------------------------------------------------------------
# Slide 3 - Flow
# --------------------------------------------------------------------------
def slide_flow(prs):
    s = blank(prs)
    title(s, 3, "Nine steps. Five human gates. Nothing closes without evidence.",
          "2. End-to-end flow")

    stages = ["Intake", "Decompose", "Backlog", "Select", "Implement", "Test", "CI/CD", "Validate", "Close"]
    gates = {1: "G1  Backlog agreed", 3: "G2  Story ready", 4: "G3  Merge the PR",
             6: "G4  Promote to QA", 8: "G5  Close the story"}

    n = len(stages)
    overlap = Inches(0.15)
    cw = (BODY_W + overlap * (n - 1)) / n
    step = cw - overlap
    y = Inches(2.62)
    ch = Inches(0.92)

    # Gate markers above the steps that need a signature
    for i, label in gates.items():
        gx = MARGIN + step * i
        box(s, gx - Inches(0.16), Inches(1.72), cw + Inches(0.20), Inches(0.52), label,
            fill=AMBER_BG, line=AMBER, size=10, bold=True, color=AMBER)
        arrow_down(s, gx + cw / 2, Inches(2.28), Inches(0.28), Inches(0.18), AMBER_MID)

    text(s, MARGIN, Inches(1.44), BODY_W, Inches(0.26),
         "A NAMED PERSON MUST SIGN HERE", size=10.5, bold=True, color=AMBER)

    for i, name in enumerate(stages):
        x = MARGIN + step * i
        endpoint = i in (0, n - 1)
        shape(s, MSO_SHAPE.CHEVRON, x, y, cw, ch, name,
              fill=BRAND_600 if endpoint else SURFACE, line=BRAND_600,
              size=12, bold=True, color=SURFACE if endpoint else INK_900, line_width=1.25)

    # Evidence ledger
    box(s, MARGIN, Inches(3.86), BODY_W, Inches(0.56),
        "ONE AUDIT TRAIL:   requirement  \u2192  story  \u2192  acceptance criterion  \u2192  test  \u2192  build  \u2192  deployment  \u2192  sign-off",
        fill=BRAND_50, line=BRAND_500, size=12.5, bold=True, color=BRAND_700, line_width=1.25)

    # What is attached before a gate can open
    text(s, MARGIN, Inches(4.66), BODY_W, Inches(0.26),
         "EVERY GATE OPENS ONLY WHEN THIS IS ATTACHED", size=10.5, bold=True, color=INK_600)
    cards = [
        ("CODE", "Pull request, commit,\ngreen build"),
        ("TESTS", "A passing test for every\nacceptance criterion"),
        ("DEPLOYMENT", "Dev and QA runs with\nsmoke checks passed"),
        ("SIGN-OFF", "Named approver, time\nand reason recorded"),
    ]
    gap = Inches(0.26)
    w = (BODY_W - gap * 3) / 4
    x = MARGIN
    for head, body in cards:
        box(s, x, Inches(4.98), w, Inches(1.02), f"{head}\n{body}", fill=SURFACE,
            line=BRAND_300, size=12, bold=True, color=BRAND_700, sub_delta=2.0, line_width=1.25)
        x += w + gap

    takeaway(s, "Agents prepare and execute. They cannot approve, self-approve or skip a gate - that permission belongs only to people.",
             tone="warn")


# --------------------------------------------------------------------------
# Slide 4 - Cost
# --------------------------------------------------------------------------
def slide_cost(prs):
    s = blank(prs)
    title(s, 4, f"Build it once for {money(BUILD_TOTAL)}. Then about {money(RUN_TOTAL)} a story.",
          f"3. Implementation cost and 4. execution cost, measured in model tokens")

    col_w = (BODY_W - Inches(0.55)) / 2
    x2 = MARGIN + col_w + Inches(0.55)
    y = Inches(1.62)

    # Divider
    rect(s, MARGIN + col_w + Inches(0.26), y, Pt(1.2), Inches(3.35), fill=HAIRLINE, no_line=True)

    # Build phase
    text(s, MARGIN, y, col_w, Inches(0.3), "3.  BUILD THE SYSTEM  -  ONE OFF", size=11.5, bold=True, color=INK_600)
    text(s, MARGIN, y + Inches(0.30), col_w, Inches(0.6), money(BUILD_TOTAL), size=40, bold=True, color=BRAND_700)
    text(s, MARGIN + Inches(1.85), y + Inches(0.52), col_w - Inches(1.9), Inches(0.4),
         f"{millions(build_in + build_out)} tokens across\n~{build_sessions} agent sessions", size=11, color=INK_600)
    build_peak = max(v for _, v in BUILD_BARS)
    bar_chart(s, MARGIN, y + Inches(1.06), col_w, BUILD_BARS, build_peak, bar_color=BRAND_600)

    # Execution phase
    text(s, x2, y, col_w, Inches(0.3), "4.  RUN ONE STORY  -  EVERY TIME", size=11.5, bold=True, color=INK_600)
    text(s, x2, y + Inches(0.30), col_w, Inches(0.6), money(RUN_TOTAL), size=40, bold=True, color=BRAND_700)
    text(s, x2 + Inches(1.55), y + Inches(0.52), col_w - Inches(1.6), Inches(0.4),
         f"{millions(run_in + run_out)} tokens from intake\nthrough to closure", size=11, color=INK_600)
    run_peak = max(v for _, v in RUN_BARS)
    bar_chart(s, x2, y + Inches(1.06), col_w, RUN_BARS, run_peak, bar_color=BRAND_500)

    # Scale strip
    text(s, MARGIN, Inches(5.14), BODY_W, Inches(0.26),
         "WHAT THAT MEANS AT VOLUME", size=10.5, bold=True, color=INK_600)
    chips = [
        (money(RUN_TOTAL * 25), "a sprint", "25 stories"),
        (money(RUN_TOTAL * 600), "a year", "600 stories, one team"),
        (money(RUN_OPTIMISED * 600), "a year, tuned", "with caching and model routing"),
        ("\u00b140%", "estimate range", "planning-grade, metered from day one"),
    ]
    w = Inches(2.93)
    gap = Inches(0.20)
    x = MARGIN
    for value, label, note in chips:
        stat(s, x, Inches(5.44), w, Inches(1.02), value, label, note, value_size=23)
        x += w + gap

    takeaway(s, "A story costs less in tokens than the coffee break it takes to review. Excludes people, infrastructure and licences.",
             tone="good")


# --------------------------------------------------------------------------
# Slide 5 - Infrastructure and benefits
# --------------------------------------------------------------------------
def slide_value(prs):
    s = blank(prs)
    title(s, 5, "A small footprint, and six things we get back.",
          "5. Infrastructure  |  6. Pros")

    gap = Inches(0.34)
    left_w = Inches(3.66)
    right_x = MARGIN + left_w + gap
    right_w = BODY_W - left_w - gap
    y = Inches(1.58)

    # Infrastructure
    box(s, MARGIN, y, left_w, Inches(0.44), "5.  INFRASTRUCTURE", fill=BRAND_600, line=BRAND_600,
        size=12.5, bold=True, color=SURFACE)
    stat(s, MARGIN, y + Inches(0.58), left_w, Inches(1.24), "$235-660", "per month",
         "at pilot sizing", value_size=33)
    infra = [
        ("Compute", "Containers that scale to zero"),
        ("Data", "Managed database and object storage"),
        ("Security", "Vaulted secrets, short-lived access"),
        ("Pipelines", "The GitHub Actions we already have"),
    ]
    iy = y + Inches(2.02)
    for head, body in infra:
        box(s, MARGIN, iy, left_w, Inches(0.60), f"{head}\n{body}", fill=SURFACE_MUTED,
            line=HAIRLINE, size=11.5, bold=True, color=BRAND_700, sub_delta=1.5)
        iy += Inches(0.68)
    text(s, MARGIN, iy + Inches(0.04), left_w, Inches(0.3),
         "Dev and QA only. No production exposure.", size=10.5, color=INK_600, align=PP_ALIGN.CENTER)

    # Benefits
    box(s, right_x, y, right_w, Inches(0.44), "6.  WHAT WE GAIN", fill=GREEN, line=GREEN,
        size=12.5, bold=True, color=SURFACE)
    gains = [
        ("Faster delivery", "Work does not sit waiting between hand-offs."),
        ("Audit-ready by default", "The evidence is made as the work happens."),
        ("Real test coverage", "Every acceptance criterion has a passing test."),
        ("One quality bar", "The same standard is applied to every story."),
        ("Cost you can see", "We know what a story costs before we commit."),
        ("Engineers on hard problems", "Routine story work stops eating their week."),
    ]
    card_gap = Inches(0.22)
    cw = (right_w - card_gap) / 2
    ch = Inches(1.16)
    for i, (head, body) in enumerate(gains):
        cx = right_x + (i % 2) * (cw + card_gap)
        cy = y + Inches(0.62) + (i // 2) * (ch + Inches(0.20))
        info_card(s, cx, cy, cw, ch, head, body, accent=GREEN, fill=GREEN_BG, line=GREEN)

    takeaway(s, f"Ask: approve a bounded pilot - {money(BUILD_TOTAL)} to build, {money(RUN_TOTAL)} a story to run, and no agent that can ever approve its own work.",
             tone="info")


# --------------------------------------------------------------------------
# Slide 6 - Concerns
# --------------------------------------------------------------------------
def slide_concerns(prs):
    s = blank(prs)
    title(s, 6, "What worries us - and what the pilot must prove.",
          "Stated plainly. Each concern has a control we can measure, not an assurance.")

    concerns = [
        ("1.  Token cost can grow fast",
         "Agents read the same code many times over. Every failed attempt is paid for twice. "
         "Without a limit, the monthly bill is hard to predict.",
         "a hard spend cap per story, prompt caching, cheaper models for routine steps, and a stop after two failed attempts."),
        ("2.  The model invents design details",
         "Left to itself it picks its own colours, spacing and layout patterns. "
         "The page then looks off-brand and does not match what was asked for.",
         "agents may only use approved design tokens and components. The build fails if a raw colour or unapproved pattern appears."),
        ("3.  Vague requirements give vague pages",
         "A high-level brief leaves gaps, and the agent fills them with invented wording. "
         "The content that comes back is not what the business meant.",
         "a story cannot start until its content and acceptance criteria are specific. Missing copy is flagged as a placeholder, never invented."),
        ("4.  Unproven on large applications",
         "We have only seen this on a small, clean codebase. Real systems carry legacy code, "
         "hidden coupling and far more context than a model can hold at once.",
         "run the pilot on a deliberately harder story and measure the result. Do not scale until that evidence exists."),
        ("5.  A passing test can prove nothing",
         "An agent can write a test that always passes. Green does not always mean correct, "
         "and a false pass is worse than no test at all.",
         "every test is tied to an acceptance criterion, and an engineer samples them each sprint."),
        ("6.  Review effort does not disappear",
         "Someone still reads every change and signs every gate. If we do not staff that, "
         "the delay simply moves to the review queue.",
         "name an approver for each gate and give them evidence summaries instead of raw diffs."),
    ]

    gap = Inches(0.28)
    cw = (BODY_W - gap * 2) / 3
    ch = Inches(2.22)
    for i, (head, body, control) in enumerate(concerns):
        cx = MARGIN + (i % 3) * (cw + gap)
        cy = Inches(1.58) + (i // 3) * (ch + Inches(0.26))
        info_card(s, cx, cy, cw, ch, head, body, foot=control, foot_label="We control it by ",
                  accent=AMBER, fill=SURFACE, line=AMBER_MID, foot_color=GREEN)

    takeaway(s, "None of this is settled by discussion. The pilot exists to put a real number against each of these six concerns.",
             tone="warn", top=Inches(6.56))


def build(path: Path) -> None:
    prs = Presentation()
    prs.slide_width = SLIDE_W
    prs.slide_height = SLIDE_H
    slide_idea(prs)
    slide_architecture(prs)
    slide_flow(prs)
    slide_cost(prs)
    slide_value(prs)
    slide_concerns(prs)
    path.parent.mkdir(parents=True, exist_ok=True)
    prs.save(path)
    print(f"Wrote {path} ({len(prs.slides)} slides)")
    print(f"  build once: {money(BUILD_TOTAL)}  ({millions(build_in + build_out)} tokens)")
    print(f"  per story:  {money(RUN_TOTAL)}  ({millions(run_in + run_out)} tokens)")


if __name__ == "__main__":
    build(Path(__file__).resolve().parents[1] / "docs" / "Agentic_SDLC_Executive_Deck.pptx")
