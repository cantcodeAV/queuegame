import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_footer(num_pages)
            super().showPage()
        super().save()

    def draw_footer(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        footer_text = "ALGO CRAFT: Data Structure Arena — Practical Exam & Viva Preparation Guide"
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawString(36, 25, footer_text)
        self.drawRightString(A4[0] - 36, 25, page_text)
        self.setStrokeColor(colors.HexColor("#e2e8f0"))
        self.setLineWidth(0.5)
        self.line(36, 36, A4[0] - 36, 36)
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=45
    )

    styles = getSampleStyleSheet()

    # Custom Palette
    c_primary = colors.HexColor("#1e1b4b")
    c_accent = colors.HexColor("#6366f1")
    c_dark = colors.HexColor("#0f172a")
    c_text = colors.HexColor("#334155")
    c_bg_light = colors.HexColor("#f8fafc")
    c_border = colors.HexColor("#e2e8f0")

    # Typography styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.white,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor("#cbd5e1")
    )

    badge_style = ParagraphStyle(
        'DocBadge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#0f172a")
    )

    meta_label = ParagraphStyle(
        'MetaLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9,
        textColor=colors.HexColor("#a78bfa")
    )

    meta_val = ParagraphStyle(
        'MetaVal',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=c_dark,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=c_accent,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=c_text,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'DocBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=c_text,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=3
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#4338ca")
    )

    code_style = ParagraphStyle(
        'CodeBlock',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#0f172a")
    )

    q_style = ParagraphStyle(
        'QuestionStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12.5,
        textColor=c_primary,
        spaceAfter=3
    )

    ans_style = ParagraphStyle(
        'AnswerStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=c_text
    )

    story = []

    # -------------------------------------------------------------
    # COVER / HEADER BANNER
    # -------------------------------------------------------------
    badge_p = Paragraph("<font color='#0f172a'><b>COLLEGE PRACTICAL EXAM &amp; VIVA MASTER MANUAL</b></font>", badge_style)
    badge_table = Table([[badge_p]], colWidths=[240])
    badge_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#c8f53e")),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))

    header_table_data = [
        [badge_table],
        [Paragraph("ALGO CRAFT: Data Structure Arena", title_style)],
        [Paragraph("Comprehensive Project Walkthrough, Core Algorithm Analysis &amp; Top 25 Viva Questions", subtitle_style)],
        [Spacer(1, 8)],
        [Table([
            [Paragraph("DOMAIN", meta_label), Paragraph("CORE STRUCTURES", meta_label), Paragraph("IMPLEMENTATION", meta_label), Paragraph("CANDIDATE", meta_label)],
            [Paragraph("Linear Data Structures", meta_val), Paragraph("Stack &amp; Queue (LIFO / FIFO)", meta_val), Paragraph("Pure Vanilla JS + Tailwind", meta_val), Paragraph("Jayesh", meta_val)]
        ], colWidths=[125, 135, 145, 115])]
    ]

    header_box = Table(header_table_data, colWidths=[523])
    header_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#0f172a")),
        ('TOPPADDING', (0,0), (-1,-1), 14),
        ('BOTTOMPADDING', (0,0), (-1,-1), 14),
        ('LEFTPADDING', (0,0), (-1,-1), 16),
        ('RIGHTPADDING', (0,0), (-1,-1), 16),
        ('CORNERPAD', (0,0), (-1,-1), 6),
    ]))

    story.append(header_box)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------
    # SECTION 1: TECHNICAL ARCHITECTURE
    # -------------------------------------------------------------
    story.append(Paragraph("1. Executive Summary &amp; System Architecture", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_accent, spaceBefore=2, spaceAfter=8))
    
    story.append(Paragraph(
        "<b>ALGO CRAFT: Data Structure Arena</b> is an interactive educational suite designed to bridge theoretical CS fundamentals with practical visualization. Built without external heavyweight frameworks, it delivers 60 FPS performance, pointer-level tracking, and physical real-world metaphors for both Stacks and Queues.",
        body_style
    ))

    arch_points = [
        "<b>Landing Hub (<code>#landing-hub</code>):</b> Startup router allowing instant entry into either the Stack Master or Queue Master realms.",
        "<b>Top Navigation Switcher:</b> Synchronous controls (<code>🏠 Hub</code>, <code>⇄ Play Queue</code>, <code>⇄ Play Stack</code>) enabling fluid realm swapping while maintaining user state.",
        "<b>Web Audio Synthesizer:</b> Audio engine leveraging native browser Web Audio API (<code>AudioContext</code>, oscillators) to generate tones for push, pop, enqueue, dequeue, peek, and error events offline with zero MP3 dependencies.",
        "<b>Concept Guides:</b> Interactive multi-tab curriculum modal providing time complexities, boundary conditions, and C code snippets for every level."
    ]
    for pt in arch_points:
        story.append(Paragraph(f"• {pt}", bullet_style))

    story.append(Spacer(1, 8))

    # -------------------------------------------------------------
    # SECTION 2: QUEUE MASTER (FIFO REALM)
    # -------------------------------------------------------------
    story.append(Paragraph("2. Queue Master (FIFO Realm) — Module Breakdown", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_accent, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "A <b>Queue</b> is a linear data structure governed by the <b>First-In, First-Out (FIFO)</b> principle: the first element inserted is always the first one to be removed. Insertions occur at the <code>REAR</code> (Enqueue) and deletions take place at the <code>FRONT</code> (Dequeue). Both core operations execute in <b>O(1) constant time</b>.",
        body_style
    ))

    q_levels = [
        ("Level 1: The FIFO Factory (Conveyor Belt)",
         "<b>Concept:</b> Physical FIFO shipping conveyor belt.<br/>"
         "<b>Pointers:</b> Tracks <code>FRONT</code> (index 0) and <code>REAR</code> (index n-1).<br/>"
         "<b>FIFO Violation Trap:</b> Clicking non-front packages triggers the 'FIFO Violation Modal', reinforcing to students that direct intermediate extraction is strictly illegal in Queue ADTs."),

        ("Level 2: Theme Park Cashier (Linear Array Queue &amp; False Overflow)",
         "<b>Capacity:</b> Fixed-size static array (<code>MAX = 5</code>).<br/>"
         "<b>Boundary Conditions:</b><br/>"
         "&nbsp;&nbsp;• <i>Queue Overflow:</i> <code>rear == MAX - 1</code><br/>"
         "&nbsp;&nbsp;• <i>Queue Underflow:</i> <code>front == -1</code> or <code>front &gt; rear</code><br/>"
         "<b>Crucial Viva Topic (False Overflow):</b> When elements are dequeued, <code>front</code> moves forward, creating dead empty slots at the beginning. If <code>rear == MAX - 1</code>, no further enqueue is possible even though memory is vacant. This memory wastage problem necessitates Circular Queues."),

        ("Level 3: Traffic Control &amp; Emergency Room (Queue Variants)",
         "<b>Variant 1 (Linear Queue):</b> Vehicles lined up at a traffic light.<br/>"
         "<b>Variant 2 (Circular Queue):</b> Solves False Overflow via modulo arithmetic:<br/>"
         "&nbsp;&nbsp;• <i>Enqueue:</i> <code>rear = (rear + 1) % MAX</code><br/>"
         "&nbsp;&nbsp;• <i>Dequeue:</i> <code>front = (front + 1) % MAX</code><br/>"
         "&nbsp;&nbsp;• <i>Full Condition:</i> <code>(rear + 1) % MAX == front</code><br/>"
         "&nbsp;&nbsp;• <i>Empty Condition:</i> <code>front == -1</code><br/>"
         "<b>Variant 3 (Priority Queue):</b> Elements possess priority tags (High: 🚑 Ambulance, Med: 🚌 Bus, Low: 🚗 Sedan). Dequeue always extracts the highest-priority item first, overriding strict arrival time."),

        ("Level 4: Train Switchyard (Double-Ended Queue / Deque)",
         "<b>Concept:</b> A generalized queue permitting insertion and deletion at <b>both ends</b>.<br/>"
         "<b>Operations:</b> <code>addFirst()</code>, <code>addLast()</code>, <code>removeFirst()</code>, <code>removeLast()</code>, <code>peekFirst()</code>, <code>peekLast()</code>.<br/>"
         "<b>CS Variants:</b> <i>Input-Restricted Deque</i> (insert at one end, delete at both) and <i>Output-Restricted Deque</i> (delete at one end, insert at both)."),

        ("Level 5: Queue Trivia Arcade",
         "Interactive 5-question exam testing FIFO concepts, modulo math, error conditions, and complexities with live score tracking and heart lives.")
    ]

    for title, desc in q_levels:
        lvl_data = [
            [Paragraph(f"<b>{title}</b>", h2_style)],
            [Paragraph(desc, body_style)]
        ]
        t = Table(lvl_data, colWidths=[523])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), c_bg_light),
            ('BOX', (0,0), (-1,-1), 1, c_border),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ]))
        story.append(t)
        story.append(Spacer(1, 5))

    story.append(PageBreak())

    # -------------------------------------------------------------
    # SECTION 3: STACK MASTER (LIFO REALM)
    # -------------------------------------------------------------
    story.append(Paragraph("3. Stack Master (LIFO Realm) — Module Breakdown", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_accent, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "A <b>Stack</b> is a linear data structure adhering to the <b>Last-In, First-Out (LIFO)</b> principle: the most recently pushed element is the first one popped. All operations occur at a single pointer named <code>TOP</code>. Push, Pop, and Peek execute in <b>O(1) constant time</b>.",
        body_style
    ))

    s_levels = [
        ("Level 1: The LIFO Cafeteria (Core Stack Fundamentals)",
         "<b>Analogy:</b> Spring-loaded cafeteria plate dispenser.<br/>"
         "<b>Pointers:</b> Single pointer <code>TOP</code> (starts at -1).<br/>"
         "<b>Boundary Conditions:</b> Stack Overflow (<code>top &gt;= MAX - 1</code> in array mode <code>MAX = 6</code>); Stack Underflow (<code>top == -1</code>).<br/>"
         "<b>LIFO Violation:</b> Clicking plates below top triggers violation modal.<br/>"
         "<b>Live C Code:</b> Synchronously highlights C syntax for <code>push()</code>, <code>pop()</code>, and <code>peek()</code>."),

        ("Level 2: Polish Notation &amp; Postfix Lab",
         "<b>Sub-Lab A (Postfix Expression Evaluator):</b> Left-to-right scan. Operands push to stack; operators pop $B$ then $A$, calculate $A \\text{ op } B$, and push result. Example: <code>2 3 1 * + 9 -</code> yields <b>-4</b>.<br/>"
         "<b>Sub-Lab B (Infix to Postfix Converter):</b> Shunting-Yard algorithm using operator stack with precedence (<code>^</code> &gt; <code>* /</code> &gt; <code>+ -</code>) and associativity."),

        ("Level 3: Syntax Sentinel (Balanced Parentheses &amp; Brackets)",
         "<b>Validation:</b> Validates matching pairs for <code>()</code>, <code>{}</code>, <code>[]</code>.<br/>"
         "<b>Algorithm:</b> Pushes opening brackets; pops on closing bracket and verifies type match.<br/>"
         "<b>Error Catching:</b> Premature Underflow (e.g. <code>\")(</code>), Type Mismatch (e.g. <code>\"(]\"</code>), Unclosed Brackets (e.g. <code>\"(()\"</code>). Features a step-by-step Execution Trace Table."),

        ("Level 4: Monotonic Mountain (Next &amp; Previous Greater Element)",
         "<b>Optimization:</b> Replaces naive $O(N^2)$ brute force with an <b>O(N) linear time</b> Monotonic Decreasing Stack.<br/>"
         "<b>Operation:</b> Scans right-to-left. Elements smaller than current are popped as they can never be the next greater for any element to the left. Includes radar height visualizer."),

        ("Level 5: Base &amp; String Transformer",
         "<b>String Reversal:</b> Pushing characters to stack and popping them naturally inverts order in $O(N)$ time.<br/>"
         "<b>Radix Converter:</b> Repeated division of decimal $N$ by target base $B$, pushing remainders (<code>N % B</code>) to stack, then popping from MSB to LSB."),

        ("Level 6: Dynamic Heap &amp; Call Stack Recursion",
         "<b>Linked List Stack:</b> Heap nodes <code>[info | next*]</code> allocated dynamically via <code>malloc()</code>; eliminates static capacity limits.<br/>"
         "<b>Call Stack Simulator:</b> Visualizes execution of <code>factorial(4)</code>. Shows activation records pushing on invocation ($n=4 \\to 3 \\to 2 \\to 1$) and unwinding upon base case return."),

        ("Level 7: Stack Arcade Boss Quiz &amp; Cheatsheet",
         "8 comprehensive CS viva questions with score multipliers, streak tracking, heart lives, celebratory confetti, and integrated formula cheatsheet.")
    ]

    for title, desc in s_levels:
        lvl_data = [
            [Paragraph(f"<b>{title}</b>", h2_style)],
            [Paragraph(desc, body_style)]
        ]
        t = Table(lvl_data, colWidths=[523])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), c_bg_light),
            ('BOX', (0,0), (-1,-1), 1, c_border),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ]))
        story.append(t)
        story.append(Spacer(1, 5))

    story.append(PageBreak())

    # -------------------------------------------------------------
    # SECTION 4: TOP 25 VIVA QUESTIONS & ANSWERS
    # -------------------------------------------------------------
    story.append(Paragraph("4. Top 25 Data Structure Viva Questions &amp; Answers", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_accent, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "These 25 questions cover the core concepts, boundary cases, mathematical proofs, and architectural details commonly probed during practical viva examinations:",
        body_style
    ))

    viva_qa = [
        ("Q1: What is the fundamental difference between a Stack and a Queue?",
         "A Stack is a LIFO (Last-In, First-Out) structure where both insertion and deletion occur at the same end called TOP. A Queue is a FIFO (First-In, First-Out) structure where insertion occurs at the REAR and deletion occurs at the FRONT."),

        ("Q2: State the Overflow and Underflow boundary conditions for an array Stack.",
         "Overflow occurs when attempting to push into a full stack (top &gt;= MAX - 1 in a 0-indexed array). Underflow occurs when attempting to pop from an empty stack (top == -1)."),

        ("Q3: What is False Overflow in a Linear Queue and how is it resolved?",
         "In a linear queue, when elements are dequeued, front moves forward leaving vacant slots at the front. If rear == MAX - 1, enqueue fails even though memory is available. This False Overflow is solved by a Circular Queue wrapping pointers via modulo arithmetic."),

        ("Q4: State the Full and Empty conditions for a Circular Queue of capacity N.",
         "Empty Condition: front == -1. Full Condition: (rear + 1) % N == front."),

        ("Q5: What are the time complexities of Push, Pop, Enqueue, and Dequeue?",
         "All four operations operate in O(1) constant time because elements are directly accessed via pointers (top, front, rear) without shifting elements."),

        ("Q6: Why do compilers convert Infix expressions to Postfix expressions?",
         "Infix expressions require operator precedence rules, associativity, and parentheses brackets. Postfix (Reverse Polish) notation removes all parentheses and ambiguity, allowing single-pass linear time O(N) evaluation using an operand stack."),

        ("Q7: Detail the algorithm for evaluating a Postfix expression using a Stack.",
         "Scan tokens left to right. If operand, push to stack. If operator op, pop B then A, compute A op B, and push result back. Final result is on top of stack. (Crucial: operand order matters for division A/B and subtraction A-B)."),

        ("Q8: How does bracket validation work using a Stack?",
         "Push opening brackets '(', '{', '['. When closing bracket is read, check if stack is empty (premature underflow) or if top does not match closing type (mismatch). At end of string, stack must be empty."),

        ("Q9: What is a Monotonic Stack and how does it find Next Greater Element (NGE)?",
         "A Monotonic Stack maintains elements in strictly increasing or decreasing order. For NGE, a monotonic decreasing stack scans right-to-left, popping elements smaller than current, reducing complexity from O(N^2) brute force to O(N) linear time."),

        ("Q10: What is a Double-Ended Queue (Deque)?",
         "A Deque is a linear list allowing insertion and deletion from both ends: addFirst(), addLast(), removeFirst(), and removeLast()."),

        ("Q11: Contrast Input-Restricted Deque vs. Output-Restricted Deque.",
         "Input-restricted allows insertion at only one end, but deletion at both ends. Output-restricted allows deletion at only one end, but insertion at both ends."),

        ("Q12: How is a Priority Queue implemented efficiently?",
         "Most efficiently implemented via a Binary Heap (Max-Heap / Min-Heap) providing O(log N) enqueue and O(log N) dequeue. Unsorted arrays require O(1) enqueue but O(N) dequeue."),

        ("Q13: Contrast Array implementation vs. Linked List implementation of a Stack.",
         "Array stack: fixed size, potential overflow, zero pointer overhead, cache locality. Linked stack: dynamic growth (no overflow), but consumes extra memory for next* pointers."),

        ("Q14: Explain the role of the Call Stack in function recursion.",
         "Each recursive invocation pushes an Activation Record (stack frame with parameters, local variables, return address). Upon reaching base condition, frames pop off (unwinding). Infinite recursion leads to Stack Overflow."),

        ("Q15: How to convert a Decimal integer to Binary using a Stack?",
         "Repeatedly divide N by 2, pushing remainders (N % 2) onto the stack. Update N = N // 2 until N == 0. Pop all items: popped sequence yields binary digits from MSB to LSB."),

        ("Q16: How do you implement a Queue using two Stacks? What is the complexity?",
         "Use Stack1 for enqueue (push). For dequeue: if Stack2 is empty, pop all elements from Stack1 into Stack2 (reversing order to FIFO), then pop from Stack2. Amortized time complexity is O(1)."),

        ("Q17: How do you implement a Stack using two Queues?",
         "For push(x): enqueue x to empty Q2, dequeue all elements from Q1 and enqueue into Q2, then swap Q1 and Q2. Pop is then an O(1) dequeue from Q1."),

        ("Q18: What is the Prefix equivalent of (A + B) * C?",
         "Prefix: * + A B C. Postfix: A B + C *."),

        ("Q19: In a circular queue of size N, how many elements can be stored if empty slot is reserved?",
         "At most N - 1 elements, reserving one slot so full condition ((rear + 1) % N == front) does not collide with empty condition (front == -1)."),

        ("Q20: Differentiate peek() and pop().",
         "peek() inspects the top element without removing it (top pointer unchanged). pop() returns the top element and removes it (decrements top)."),

        ("Q21: Name 4 major real-world applications of Stacks.",
         "1. Undo/Redo operations in editors (Ctrl+Z). 2. Browser history navigation (Back button). 3. Compiler syntax parsing & expression evaluation. 4. Function call stack execution."),

        ("Q22: Name 4 major real-world applications of Queues.",
         "1. Operating system CPU process scheduling (Round Robin). 2. Printer print job spooling. 3. Breadth-First Search (BFS) graph traversal. 4. Async message buffers (Kafka, RabbitMQ)."),

        ("Q23: Why is Web Audio API utilized instead of standard audio files?",
         "Web Audio synthesizes frequencies mathematically using oscillators and gain envelopes in-browser. It eliminates network lag, 404 missing asset errors, requires zero bandwidth, and operates completely offline."),

        ("Q24: What is the space complexity comparison between Array Stack and Linked Stack?",
         "Array Stack: O(MAX) pre-allocated memory. Linked Stack: O(K) where K is active elements, plus 8 bytes pointer overhead per node."),

        ("Q25: What key boundary scenarios can you demonstrate in this project?",
         "1. Stack Overflow: push 6 plates, attempt 7th to show overflow alert. 2. LIFO / FIFO Violation: click lower plate or rear package to show violation alert. 3. Circular Queue: show rear wrapping around index 4 to 0. 4. Postfix Evaluation: step through '2 3 1 * + 9 -' yielding -4.")
    ]

    for q, a in viva_qa:
        qa_data = [
            [Paragraph(f"<b>{q}</b>", q_style)],
            [Paragraph(a, ans_style)]
        ]
        t = Table(qa_data, colWidths=[523])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.white),
            ('BOX', (0,0), (-1,-1), 0.5, c_border),
            ('LINELEFT', (0,0), (0,-1), 3, c_accent),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        story.append(t)
        story.append(Spacer(1, 4))

    # -------------------------------------------------------------
    # SECTION 5: REFERENCE MATRIX TABLE
    # -------------------------------------------------------------
    story.append(Spacer(1, 6))
    story.append(Paragraph("5. Rapid-Fire Reference Matrix", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_accent, spaceBefore=2, spaceAfter=8))

    matrix_data = [
        [Paragraph("<b>Property</b>", meta_label), Paragraph("<b>Stack (LIFO)</b>", meta_label), Paragraph("<b>Queue (FIFO)</b>", meta_label)],
        [Paragraph("Core Principle", body_style), Paragraph("Last-In, First-Out (LIFO)", body_style), Paragraph("First-In, First-Out (FIFO)", body_style)],
        [Paragraph("Insertion Point", body_style), Paragraph("TOP (Push)", body_style), Paragraph("REAR (Enqueue)", body_style)],
        [Paragraph("Deletion Point", body_style), Paragraph("TOP (Pop)", body_style), Paragraph("FRONT (Dequeue)", body_style)],
        [Paragraph("Pointers Required", body_style), Paragraph("1 pointer (top)", body_style), Paragraph("2 pointers (front, rear)", body_style)],
        [Paragraph("Initial Empty Pointers", body_style), Paragraph("top = -1", body_style), Paragraph("front = -1, rear = -1", body_style)],
        [Paragraph("Full Condition (Array)", body_style), Paragraph("top == MAX - 1", body_style), Paragraph("rear == MAX - 1 (Linear)", body_style)],
        [Paragraph("Empty Condition", body_style), Paragraph("top == -1", body_style), Paragraph("front == -1 or front &gt; rear", body_style)],
        [Paragraph("Circular Queue Full", body_style), Paragraph("N/A", body_style), Paragraph("(rear + 1) % MAX == front", body_style)],
        [Paragraph("Time Complexity", body_style), Paragraph("O(1) Push / Pop / Peek", body_style), Paragraph("O(1) Enqueue / Dequeue", body_style)],
        [Paragraph("Graph Traversal", body_style), Paragraph("Depth-First Search (DFS)", body_style), Paragraph("Breadth-First Search (BFS)", body_style)]
    ]

    matrix_table = Table(matrix_data, colWidths=[130, 195, 198])
    matrix_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_dark),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_light]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))

    story.append(matrix_table)

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Document successfully created: {filename}")

if __name__ == '__main__':
    pdf_filename = r'c:\Users\Jayesh\task-backend\DSqueue\ALGO_CRAFT_Practical_Exam_Guide.pdf'
    build_pdf(pdf_filename)
