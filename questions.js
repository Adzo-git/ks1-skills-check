/* ============================================================
   PTO KS1 MATHS SKILLS CHECK — QUESTION INVENTORY
   ------------------------------------------------------------
   Follows the PTO Question Writing Standards (Part 3) and
   Metadata Standard (Part 8):
     - one question, one skill
     - short, age-appropriate wording (KS1 reading age 5–7)
     - every distractor represents a real misconception
     - illustrations only where they help understanding

   To add or improve questions later, edit this file only.
   Curriculum coverage / weighting is set by how many questions
   each strand has (Assessment Engine, Part 23).
   ============================================================ */

/* Curriculum strands. Plain-English names + honest "what it covers"
   descriptions and a practical home tip for the parent report. */
const PTO_STRANDS = {
  NPV: {
    name: "Number & Place Value",
    covers: "Counting, comparing numbers, and understanding tens and ones.",
    homeTip: "Count everyday things together — stairs, buttons, pasta pieces — and ask “what’s one more?” and “what’s one less?”"
  },
  AS: {
    name: "Addition & Subtraction",
    covers: "Adding and taking away numbers up to 20.",
    homeTip: "Practise number bonds to 10 with fingers or small toys: “how many more do we need to make 10?”"
  },
  MD: {
    name: "Multiplication & Division",
    covers: "Counting in steps (2s, 5s, 10s) and doubling.",
    homeTip: "Count in 2s, 5s and 10s while walking or tidying up, and try doubling small amounts of snacks."
  },
  FRA: {
    name: "Fractions",
    covers: "Finding half of a shape or a group of objects.",
    homeTip: "Share things equally: “let’s split these 8 grapes so we each get half.”"
  },
  MEA: {
    name: "Measurement",
    covers: "Money and telling the time to the hour.",
    homeTip: "Play shops with real coins, and spot “o’clock” times together on a clock at home."
  },
  GEO: {
    name: "Geometry",
    covers: "Recognising 2D shapes and counting their sides.",
    homeTip: "Go on a shape hunt around the house — “how many sides does the window have?”"
  }
};

/* The questions.
   correctIndex refers to the ORIGINAL order of options below.
   The app shuffles option order for each child so answers aren't
   always in the same place (fairness, Part 21). */
const PTO_QUESTIONS = [
  {
    id: "MAT-KS1-NPV-0001", skillId: "MAT-KS1-NPV-001", strand: "NPV",
    subtopic: "Counting", difficulty: "Foundation", type: "Fluency",
    text: "How many apples can you see?",
    illustration: { type: "dots", count: 6, color: "#e0483f" },
    options: ["5", "6", "7", "4"], correctIndex: 1,
    explanation: "There are 6 apples. Pointing to each one as you count helps you not miss any or count one twice.",
    misconception: "Miscounts by skipping an object or counting one twice."
  },
  {
    id: "MAT-KS1-NPV-0002", skillId: "MAT-KS1-NPV-002", strand: "NPV",
    subtopic: "One more", difficulty: "Foundation", type: "Understanding",
    text: "What is one more than 14?",
    illustration: null,
    options: ["15", "13", "16", "41"], correctIndex: 0,
    explanation: "One more than 14 is 15. Counting on by one from 14 gives 15.",
    misconception: "Counts back instead of on, or reverses the digits (41)."
  },
  {
    id: "MAT-KS1-NPV-0003", skillId: "MAT-KS1-NPV-003", strand: "NPV",
    subtopic: "Counting sequence", difficulty: "Secure", type: "Understanding",
    text: "Which number is missing? 15, 16, ___, 18",
    illustration: null,
    options: ["17", "19", "14", "71"], correctIndex: 0,
    explanation: "The missing number is 17. The numbers go up by one each time: 15, 16, 17, 18.",
    misconception: "Loses the count sequence or reverses digits (71)."
  },
  {
    id: "MAT-KS1-NPV-0004", skillId: "MAT-KS1-NPV-004", strand: "NPV",
    subtopic: "Comparing", difficulty: "Secure", type: "Reasoning",
    text: "Which number is the greatest?",
    illustration: null,
    options: ["32", "19", "27", "23"], correctIndex: 0,
    explanation: "32 is the greatest. Looking at the tens first, 3 tens is more than 1 or 2 tens.",
    misconception: "Compares only the ones digit, so picks 19 or 27 for the larger 9 or 7."
  },
  {
    id: "MAT-KS1-NPV-0005", skillId: "MAT-KS1-NPV-005", strand: "NPV",
    subtopic: "Place value", difficulty: "Greater Depth", type: "Understanding",
    text: "Which number has 4 tens and 3 ones?",
    illustration: null,
    options: ["43", "34", "7", "430"], correctIndex: 0,
    explanation: "4 tens and 3 ones make 43. The tens digit comes first, then the ones.",
    misconception: "Swaps tens and ones (34) or adds the digits (7)."
  },
  {
    id: "MAT-KS1-AS-0001", skillId: "MAT-KS1-AS-001", strand: "AS",
    subtopic: "Number bonds to 10", difficulty: "Foundation", type: "Fluency",
    text: "6 + ___ = 10",
    illustration: null,
    options: ["4", "3", "5", "16"], correctIndex: 0,
    explanation: "6 and 4 make 10. Number bonds to 10 are worth learning by heart.",
    misconception: "Number bond to 10 not yet secure, or adds the numbers (16)."
  },
  {
    id: "MAT-KS1-AS-0002", skillId: "MAT-KS1-AS-002", strand: "AS",
    subtopic: "Addition within 20", difficulty: "Secure", type: "Application",
    text: "12 + 5 = ?",
    illustration: null,
    options: ["17", "16", "18", "7"], correctIndex: 0,
    explanation: "12 + 5 = 17. Start at 12 and count on 5 more.",
    misconception: "Counts on incorrectly, or subtracts instead of adds (7)."
  },
  {
    id: "MAT-KS1-AS-0003", skillId: "MAT-KS1-AS-003", strand: "AS",
    subtopic: "Subtraction within 20", difficulty: "Secure", type: "Application",
    text: "18 − 6 = ?",
    illustration: null,
    options: ["12", "11", "13", "24"], correctIndex: 0,
    explanation: "18 − 6 = 12. Start at 18 and count back 6.",
    misconception: "Counts back incorrectly, or adds instead of subtracts (24)."
  },
  {
    id: "MAT-KS1-AS-0004", skillId: "MAT-KS1-AS-004", strand: "AS",
    subtopic: "Missing number", difficulty: "Greater Depth", type: "Reasoning",
    text: "7 + ___ = 13",
    illustration: null,
    options: ["6", "5", "7", "20"], correctIndex: 0,
    explanation: "7 + 6 = 13. You can count on from 7 up to 13 to find the missing number.",
    misconception: "Adds the two numbers shown (20) instead of finding the difference."
  },
  {
    id: "MAT-KS1-MD-0001", skillId: "MAT-KS1-MD-001", strand: "MD",
    subtopic: "Counting in 2s", difficulty: "Foundation", type: "Fluency",
    text: "What comes next? 2, 4, 6, ___",
    illustration: null,
    options: ["8", "7", "10", "12"], correctIndex: 0,
    explanation: "Counting in 2s: 2, 4, 6, 8. Each number is 2 more than the last.",
    misconception: "Adds 1 instead of 2 (7), or skips a step (10)."
  },
  {
    id: "MAT-KS1-MD-0002", skillId: "MAT-KS1-MD-002", strand: "MD",
    subtopic: "Doubling", difficulty: "Secure", type: "Understanding",
    text: "Double 5 is ___",
    illustration: null,
    options: ["10", "7", "25", "15"], correctIndex: 0,
    explanation: "Double 5 means 5 + 5, which is 10.",
    misconception: "Adds 2 instead of doubling (7), or multiplies 5 by itself (25)."
  },
  {
    id: "MAT-KS1-FRA-0001", skillId: "MAT-KS1-FRA-001", strand: "FRA",
    subtopic: "Half of a quantity", difficulty: "Secure", type: "Understanding",
    text: "What is half of these 8 counters?",
    illustration: { type: "dots", count: 8, color: "#652da0" },
    options: ["4", "2", "16", "3"], correctIndex: 0,
    explanation: "Half of 8 is 4. Sharing 8 equally into two groups gives 4 in each group.",
    misconception: "Doubles instead of halving (16), or confuses half with quarter (2)."
  },
  {
    id: "MAT-KS1-GEO-0001", skillId: "MAT-KS1-GEO-001", strand: "GEO",
    subtopic: "2D shapes", difficulty: "Foundation", type: "Understanding",
    text: "How many sides does this shape have?",
    illustration: { type: "shape", shape: "triangle" },
    options: ["3", "4", "2", "5"], correctIndex: 0,
    explanation: "A triangle has 3 straight sides. Tracing each side with a finger helps you count them.",
    misconception: "Counts corners incorrectly or miscounts the straight sides."
  },
  {
    id: "MAT-KS1-MEA-0001", skillId: "MAT-KS1-MEA-001", strand: "MEA",
    subtopic: "Money", difficulty: "Secure", type: "Application",
    text: "How much money is there altogether?",
    illustration: { type: "coins", values: [10, 5, 2] },
    options: ["17p", "12p", "7p", "20p"], correctIndex: 0,
    explanation: "10p + 5p + 2p = 17p. Adding the largest coin first can make this easier.",
    misconception: "Misses a coin when adding (12p or 7p)."
  },
  {
    id: "MAT-KS1-MEA-0002", skillId: "MAT-KS1-MEA-002", strand: "MEA",
    subtopic: "Time", difficulty: "Greater Depth", type: "Understanding",
    text: "What time does this clock show?",
    illustration: { type: "clock", hour: 3 },
    options: ["3 o’clock", "12 o’clock", "9 o’clock", "6 o’clock"], correctIndex: 0,
    explanation: "The short hand points to 3 and the long hand points to 12, so it is 3 o’clock.",
    misconception: "Reads the time from the long hand instead of the short hand."
  }
];
