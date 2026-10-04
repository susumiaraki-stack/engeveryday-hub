import type { AssessmentQuestion } from '../types';

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    topic: 'Ordering at a Cafe',
    situation: 'คุณต้องการสั่งกาแฟลาเต้เย็น และต้องการขอหวานน้อยกับพนักงาน',
    question: 'ประโยคใดเหมาะสม สุภาพ และเป็นธรรมชาติที่สุด?',
    options: [
      {
        id: '1a',
        text: 'Give me iced latte with no much sugar.',
        isCorrect: false,
        explanation: 'ห้วนเกินไป (Too direct) การใช้ "Give me" ฟังดูเหมือนคำสั่ง ไม่สุภาพในบริบทบริการ',
      },
      {
        id: '1b',
        text: "Could I get an iced latte with less sweet, please?",
        isCorrect: true,
        explanation: 'ถูกต้องมาก! "Could I get..." และ "less sweet, please" เป็นภาษาที่สุภาพและเจ้าของภาษาใช้จริง',
      },
      {
        id: '1c',
        text: 'I want cold latte sweet down.',
        isCorrect: false,
        explanation: 'โครงสร้างไวยากรณ์แปลตรงตัวเกินไป (sweet down) และ "I want" แข็งกระด้างไป',
      },
      {
        id: '1d',
        text: 'Bring me latte quickly.',
        isCorrect: false,
        explanation: 'ไม่สุภาพอย่างยิ่ง การเร่งพนักงานด้วย "Bring me... quickly" ไม่เหมาะสมในวัฒนธรรมสากล',
      },
    ],
  },
  {
    id: 2,
    topic: 'Airport Check-in',
    situation: 'คุณกำลังเช็คอินที่สนามบินและต้องการขอที่นั่งติดหน้าต่าง (Window seat)',
    question: 'คุณควรพูดกับเจ้าหน้าที่ภาคพื้นอย่างไร?',
    options: [
      {
        id: '2a',
        text: 'Window seat for me now.',
        isCorrect: false,
        explanation: 'ห้วนและเหมือนคำสั่ง ควรใช้ประโยคขอร้องที่สุภาพ',
      },
      {
        id: '2b',
        text: 'I must sit next to the glass.',
        isCorrect: false,
        explanation: '"I must" บ่งบอกการบังคับ และ "next to the glass" ไม่ใช่คำศัพท์ที่ใช้เรียกที่นั่งติดหน้าต่าง',
      },
      {
        id: '2c',
        text: 'Could you give me a window seat, if possible?',
        isCorrect: true,
        explanation: 'ยอดเยี่ยม! การเติม "if possible" แสดงถึงความยืดหยุ่นและความสุภาพระดับสูง (High Pragmatic Competence)',
      },
      {
        id: '2d',
        text: 'Change seat to window.',
        isCorrect: false,
        explanation: 'ห้วนสั้นเกินไป ขาดคำสุภาพ',
      },
    ],
  },
  {
    id: 3,
    topic: 'Asking for Directions',
    situation: 'คุณหลงทางในเมืองและต้องการถามทางไปสถานีรถไฟจากชาวต่างชาติที่เดินผ่าน',
    question: 'วิธีเริ่มต้นบทสนทนาที่ดีที่สุดคืออะไร?',
    options: [
      {
        id: '3a',
        text: 'Where is train station? Tell me.',
        isCorrect: false,
        explanation: 'ขาดคำเกริ่นนำที่สุภาพ (Excuse me) และการสั่งว่า "Tell me" ดูไม่เป็นมิตร',
      },
      {
        id: '3b',
        text: 'Excuse me, could you tell me how to get to the train station?',
        isCorrect: true,
        explanation: 'ถูกต้องที่สุด! เริ่มต้นด้วย "Excuse me" เพื่อขอโทษที่รบกวน ตามด้วยประโยคคำถามทางอ้อมที่นุ่มนวล',
      },
      {
        id: '3c',
        text: 'Hey you! Train station where?',
        isCorrect: false,
        explanation: 'การเรียกคนแปลกหน้าว่า "Hey you" ถือว่าหยาบคายมาก',
      },
      {
        id: '3d',
        text: 'I lost. Walk with me.',
        isCorrect: false,
        explanation: 'แปลตรงตัวและไม่เหมาะสมที่จะสั่งให้คนแปลกหน้าเดินไปด้วย',
      },
    ],
  },
  {
    id: 4,
    topic: 'Pharmacy / Explaining Symptoms',
    situation: 'คุณมีอาการเจ็บคอและมีไข้ต่ำๆ ต้องการปรึกษาเภสัชกรที่ร้านยา',
    question: 'ควรบอกอาการและขอคำแนะนำอย่างไร?',
    options: [
      {
        id: '4a',
        text: 'I have a sore throat and a slight fever. What do you recommend?',
        isCorrect: true,
        explanation: 'ชัดเจนและเป็นธรรมชาติ! บอกอาการตรงจุดและถามคำแนะนำอย่างมืออาชีพ',
      },
      {
        id: '4b',
        text: 'My neck hurts so much. Give medicine now.',
        isCorrect: false,
        explanation: 'เจ็บคอด้านในใช้ "sore throat" ไม่ใช่ neck และไม่ควรสั่งว่า give medicine now',
      },
      {
        id: '4c',
        text: 'Sick! Need pill fast.',
        isCorrect: false,
        explanation: 'ภาษาไม่เป็นทางการและสื่อสารรายละเอียดของอาการไม่ชัดเจน',
      },
      {
        id: '4d',
        text: 'Do you have drug for throat pain?',
        isCorrect: false,
        explanation: 'คำว่า "drug" ในร้านยามักนิยมใช้ "medicine" หรือ "medication" มากกว่า',
      },
    ],
  },
  {
    id: 5,
    topic: 'Clarification & Listening',
    situation: 'ชาวต่างชาติพูดภาษาอังกฤษเร็วเกินไปจนคุณฟังไม่ทัน',
    question: 'คุณควรขอให้เขาพูดช้าลงอย่างไรอย่างสุภาพ?',
    options: [
      {
        id: '5a',
        text: 'What? Speak slow!',
        isCorrect: false,
        explanation: 'ห้วนและฟังดูกระด้าง อาจทำให้ผู้ฟังรู้สึกไม่ดี',
      },
      {
        id: '5b',
        text: "I didn't quite catch that. Could you speak a little slower, please?",
        isCorrect: true,
        explanation: 'สมบูรณ์แบบ! "I didn\'t quite catch that" เป็นสำนวนเจ้าของภาษาที่ใช้บอกว่าฟังไม่ทันอย่างสุภาพมาก',
      },
      {
        id: '5c',
        text: 'Your English is too fast for me.',
        isCorrect: false,
        explanation: 'แม้จะเข้าใจได้ แต่เป็นการโทษอีกฝ่าย การใช้ "Could you speak a little slower" นุ่มนวลกว่ามาก',
      },
      {
        id: '5d',
        text: 'Again! Stop fast.',
        isCorrect: false,
        explanation: 'ไวยากรณ์ผิดและห้วนเกินไป',
      },
    ],
  },
  {
    id: 6,
    topic: 'Polite Refusal (การปฏิเสธอย่างสุภาพ)',
    situation: 'เพื่อนร่วมงานชาวต่างชาติชวนทานขนมที่คุณอิ่มแล้วหรือทานไม่ได้',
    question: 'คุณควรปฏิเสธอย่างไรโดยไม่เสียมารยาท?',
    options: [
      {
        id: '6a',
        text: "No, I don't want your snack.",
        isCorrect: false,
        explanation: 'ปฏิเสธตรงเกินไปและอาจทำร้ายน้ำใจผู้ชวน',
      },
      {
        id: '6b',
        text: 'No thank you, it looks delicious, but I am completely full.',
        isCorrect: true,
        explanation: 'ยอดเยี่ยม! ขอบคุณก่อน ชมขนม และบอกเหตุผลว่าอิ่มแล้ว เป็นศิลปะการปฏิเสธตามมารยาทสากล',
      },
      {
        id: '6c',
        text: 'Take it away.',
        isCorrect: false,
        explanation: 'หยาบคายอย่างยิ่ง',
      },
      {
        id: '6d',
        text: 'I hate sweet things.',
        isCorrect: false,
        explanation: 'การใช้คำว่า "hate" รุนแรงเกินไปในสถานการณ์ที่คนอื่นหยิบยื่นน้ำใจให้',
      },
    ],
  },
  {
    id: 7,
    topic: 'Making an Apology',
    situation: 'คุณเผลอเดินชนคนอื่นเบาๆ ในที่สาธารณะที่คนพลุกพล่าน',
    question: 'สิ่งที่คุณควรพูดทันทีคืออะไร?',
    options: [
      {
        id: '7a',
        text: "Watch out where you walk!",
        isCorrect: false,
        explanation: 'เป็นการไปโทษอีกฝ่าย ทั้งที่เราเป็นคนชน',
      },
      {
        id: '7b',
        text: "Oh, I'm so sorry! Are you alright?",
        isCorrect: true,
        explanation: 'ถูกต้อง! ขอโทษทันทีด้วย "I\'m so sorry" พร้อมแสดงความห่วงใย "Are you alright?"',
      },
      {
        id: '7c',
        text: 'Never mind.',
        isCorrect: false,
        explanation: '"Never mind" แปลว่า ช่างมันเถอะ ไม่ใช่คำขอโทษเมื่อทำผิด',
      },
      {
        id: '7d',
        text: 'It is okay for me.',
        isCorrect: false,
        explanation: 'เราเป็นคนชน ไม่ควรพูดว่า It is okay for me',
      },
    ],
  },
  {
    id: 8,
    topic: 'Payment at a Store',
    situation: 'คุณต้องการสอบถามว่าร้านค้ารับบัตรเครดิตหรือไม่',
    question: 'คุณควรถามพนักงานแคชเชียร์อย่างไร?',
    options: [
      {
        id: '8a',
        text: 'Swipe my card here.',
        isCorrect: false,
        explanation: 'เป็นการออกคำสั่ง แทนที่จะเป็นการสอบถาม',
      },
      {
        id: '8b',
        text: 'Do you accept credit cards, or is it cash only?',
        isCorrect: true,
        explanation: 'เป็นธรรมชาติและถูกต้องตามธรรมเนียมสากล (Do you accept credit cards?)',
      },
      {
        id: '8c',
        text: 'Card okay or not?',
        isCorrect: false,
        explanation: 'ภาษาพูดที่ห้วนและแปลตรงตัวจากภาษาไทยเกินไป',
      },
      {
        id: '8d',
        text: 'You have machine to pay?',
        isCorrect: false,
        explanation: 'คำถามไม่ชัดเจนและไม่เป็นธรรมชาติ',
      },
    ],
  },
];
