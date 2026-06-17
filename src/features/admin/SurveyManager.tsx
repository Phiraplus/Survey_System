import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../contexts/ToastContext';
import { useConfig } from '../../contexts/ConfigContext';
import { surveyService } from '../../services/surveyService';
import { supportedLanguages, languageNames } from '../../lib/i18n';
import { Modal } from '../../components/ui';
import type { LocalizedString, SupportedLanguage, SurveyQuestion, SurveyConfig } from '../../types';
import { DEFAULT_TEXT_QUESTIONS } from '../../services/surveyService';

const DEFAULT_QUESTIONS: SurveyQuestion[] = [
  { 
    id: 'conferenceQ1', group: 'Conference', emoji: '🎯', order: 1,
    label: { 
      en: '1. The subjects discussed during the conference appropriately addressed my needs and interests.', 
      th: '1. หัวข้อที่พูดคุยในระหว่างการประชุมตรงกับความต้องการและความสนใจของฉัน',
      zh: '1. 会议期间讨论的主题适当地满足了我的需求和兴趣。',
      es: '1. Los temas discutidos durante la conferencia abordaron adecuadamente mis necesidades e intereses.',
      ar: '1. الموضوعات التي تمت مناقشتها خلال المؤتمر لبت احتياجاتي واهتماماتي بشكل مناسب.',
      ru: '1. Темы, обсуждавшиеся на конференции, должным образом учитывали мои потребности и интересы.',
      fr: '1. Les sujets abordés lors de la conférence ont répondu de manière appropriée à mes besoins et intérêts.'
    }
  },
  { 
    id: 'conferenceQ2', group: 'Conference', emoji: '⏱️', order: 2,
    label: { 
      en: '2. The conference was contemporary and effectively addressed current crime and technological trends (e.g., AI systems, Scam Centers, and Drones).', 
      th: '2. การประชุมมีความทันสมัยและตอบสนองต่อแนวโน้มอาชญากรรมและเทคโนโลยีในปัจจุบันได้อย่างมีประสิทธิภาพ (เช่น ระบบ AI, ศูนย์แก๊งคอลเซ็นเตอร์ และโดรน)',
      zh: '2. 会议具有时代性，并有效应对了当前的犯罪和技术趋势（如人工智能系统、诈骗中心和无人机）。',
      es: '2. La conferencia fue contemporánea y abordó eficazmente las tendencias tecnológicas y delictivas actuales (por ejemplo, sistemas de IA, centros de estafas y drones).',
      ar: '2. كان المؤتمر معاصراً وتناول بفعالية اتجاهات الجريمة والتكنولوجيا الحالية (مثل أنظمة الذكاء الاصطناعي، ومراكز الاحتيال، والطائرات بدون طيار).',
      ru: '2. Конференция была современной и эффективно рассматривала текущие тенденции в сфере преступности и технологий (например, системы ИИ, колл-центры мошенников и дроны).',
      fr: '2. La conférence était moderne et traitait efficacement des tendances criminelles et technologiques actuelles (par exemple, les systèmes d\'IA, les centres d\'appels frauduleux et les drones).'
    }
  },
  { 
    id: 'conferenceQ3', group: 'Conference', emoji: '💼', order: 3,
    label: { 
      en: '3. The information and experience obtained from the conference will be helpful and can be practically applied to your work.', 
      th: '3. ข้อมูลและประสบการณ์ที่ได้รับจากการประชุมจะเป็นประโยชน์และสามารถนำไปประยุกต์ใช้ในการทำงานจริงของคุณได้',
      zh: '3. 从会议中获得的信息和经验将对您的工作有所帮助，并能实际应用。',
      es: '3. La información y la experiencia obtenidas de la conferencia serán útiles y podrán aplicarse prácticamente a su trabajo.',
      ar: '3. ستكون المعلومات والخبرات التي تم الحصول عليها من المؤتمر مفيدة ويمكن تطبيقها عملياً في عملك.',
      ru: '3. Информация и опыт, полученные на конференции, будут полезны и могут быть практически применены в вашей работе.',
      fr: '3. Les informations et l\'expérience acquises lors de la conférence seront utiles et pourront être appliquées concrètement à votre travail.'
    }
  },
  { 
    id: 'conferenceQ4', group: 'Conference', emoji: '🗣️', order: 4,
    label: { 
      en: '4. The overall length of the conference and the time allocated for each session were adequate and suitable.', 
      th: '4. ระยะเวลาโดยรวมของการประชุมและเวลาที่จัดสรรสำหรับแต่ละเซสชันมีความเพียงพอและเหมาะสม',
      zh: '4. 会议的整体长度和每个分会分配的时间是充足且合适的。',
      es: '4. La duración total de la conferencia y el tiempo asignado a cada sesión fueron adecuados y convenientes.',
      ar: '4. كان الطول الإجمالي للمؤتمر والوقت المخصص لكل جلسة كافيين ومناسبين.',
      ru: '4. Общая продолжительность конференции и время, отведенное на каждую сессию, были достаточными и подходящими.',
      fr: '4. La durée totale de la conférence et le temps alloué à chaque session étaient adéquats et appropriés.'
    }
  },
  { 
    id: 'conferenceQ5', group: 'Conference', emoji: '📝', order: 5,
    label: { 
      en: '5. The scheduling and frequency of the short-duration knowledge sessions (Step Talk) integrated throughout the days were appropriate and beneficial.', 
      th: '5. การจัดตารางเวลาและความถี่ของเซสชันความรู้ระยะสั้น (Step Talk) ที่บูรณาการตลอดทั้งวันมีความเหมาะสมและเป็นประโยชน์',
      zh: '5. 贯穿全天的短时间知识分享会（Step Talk）的时间安排和频率是合适且有益的。',
      es: '5. La programación y frecuencia de las sesiones de conocimiento de corta duración (Step Talk) integradas a lo largo de los días fueron adecuadas y beneficiosas.',
      ar: '5. كانت جدولة وتكرار جلسات المعرفة قصيرة المدة (Step Talk) المتكاملة طوال الأيام مناسبة ومفيدة.',
      ru: '5. Расписание и частота краткосрочных информационных сессий (Step Talk), интегрированных в течение дней, были подходящими и полезными.',
      fr: '5. La programmation et la fréquence des sessions de connaissances de courte durée (Step Talk) intégrées tout au long des journées étaient appropriées et bénéfiques.'
    }
  },
  { 
    id: 'speakersQ1', group: 'Guest Speakers', emoji: '📙', order: 6,
    label: { 
      en: '6. The guest speakers and panelists were knowledgeable and experienced in the subject matters.', 
      th: '6. วิทยากรรับเชิญและผู้ร่วมเสวนาความรู้และประสบการณ์ในหัวข้อการบรรยาย',
      zh: '6. 特邀演讲嘉宾和小组讨论小组成员在相关领域知识渊博且经验丰富。',
      es: '6. Los oradores invitados y panelistas tenían conocimientos y experiencia en los temas tratados.',
      ar: '6. كان المتحدثون الضيوف وأعضاء لجنة النقاش مطلعين وذوي خبرة في موضوعات البحث.',
      ru: '6. Приглашенные докладчики и участники дискуссионных панелей были знающими и опытными в обсуждаемых вопросах.',
      fr: '6. Les conférenciers invités et les panélistes étaient compétents et expérimentés dans les sujets abordés.'
    }
  },
  { 
    id: 'speakersQ2', group: 'Guest Speakers', emoji: '📝', order: 7,
    label: { 
      en: '7. The content was highly relevant and immediately applicable.', 
      th: '7. เนื้อหามีความเกี่ยวข้องเป็นอย่างยิ่งและสามารถนำไปประยุกต์ใช้ได้ทันที',
      zh: '7. 内容高度相关且可立即应用。',
      es: '7. El contenido fue muy relevante e inmediatamente aplicable.',
      ar: '7. كان المحتوى ذا صلة وثيقة وقابلاً للتطبيق الفوري.',
      ru: '7. Содержание было весьма актуальным и применимым на практике без отлагательств.',
      fr: '7. Le contenu était très pertinent et immédiatement applicable.'
    }
  },
  { 
    id: 'speakersQ3', group: 'Guest Speakers', emoji: '🗣️', order: 8,
    label: { 
      en: '8. The speakers provide useful insights or actionable takeaways.', 
      th: '8. วิทยากรให้ข้อมูลเชิงลึกที่เป็นประโยชน์หรือประเด็นสำคัญที่นำไปปฏิบัติได้จริง',
      zh: '8. 演讲嘉宾提供了有用的见解或可操作的收获。',
      es: '8. Los oradores proporcionaron información útil o conclusiones prácticas.',
      ar: '8. قدم المتحدثون رؤى مفيدة أو نقاطاً عملية قابلة للتنفيذ.',
      ru: '8. Докладчики представили полезную информацию или практические рекомендации.',
      fr: '8. Les conférenciers ont fourni des informations utiles ou des points clés exploitables.'
    }
  },
  { 
    id: 'speakersQ4', group: 'Guest Speakers', emoji: '🎤', order: 9,
    label: { 
      en: '9. The guest speakers presented clearly and actively opened the floor for participants to ask questions or exchange ideas.', 
      th: '9. วิทยากรรับเชิญนำเสนอได้อย่างชัดเจน และเปิดโอกาสให้ผู้เข้าร่วมซักถามหรือแลกเปลี่ยนความคิดเห็นอย่างกระตือรือร้น',
      zh: '9. 特邀演讲嘉宾演讲清晰，并积极开放提问环节供参与者提问或交流想法。',
      es: '9. Los oradores invitados expusieron con claridad y abrieron activamente el turno de preguntas para que los participantes preguntaran o intercambiaran ideas.',
      ar: '9. قدم المتحدثون الضيوف عروضهم بوضوح وفتحوا المجال بنشاط للمشاركين لطرح الأسئلة أو تبادل الأفكار.',
      ru: '9. Приглашенные спикеры выступали четко и активно предоставляли слово участникам для вопросов или обмена мнениями.',
      fr: '9. Les conférenciers invités ont présenté clairement et ont activement ouvert la parole aux participants pour poser des questions ou échanger des idées.'
    }
  },
  { 
    id: 'environmentQ1', group: 'Conference Environment', emoji: '🏢', order: 10,
    label: { 
      en: '10. The conference facilities and audio-visual equipment (sound system, screens) in the meeting room were of good quality and ready to use.', 
      th: '10. สิ่งอำนวยความสะดวกในการประชุมและอุปกรณ์โสตทัศนูปกรณ์ (ระบบเสียง, หน้าจอ) ในห้องประชุมมีคุณภาพดีและพร้อมใช้งาน',
      zh: '10. 会议室内的会议设施和视听设备（音响系统、屏幕）质量良好且准备就绪。',
      es: '10. Las instalaciones de la conferencia y el equipo audiovisual (sistema de sonido, pantallas) en la sala de reuniones eran de buena calidad y estaban listos para usar.',
      ar: '10. كانت مرافق المؤتمر والأجهزة السمعية والبصرية (نظام الصوت، الشاشات) في غرفة الاجتماعات ذات جودة عالية وجاهزة للاستخدام.',
      ru: '10. Конференц-оборудование и аудиовизуальные средства (звуковая система, экраны) в зале заседаний были хорошего качества и готовы к использованию.',
      fr: '10. Les installations de la conférence et l\'équipement audiovisuel (système de son, écrans) dans la salle de réunion étaient de bonne qualité et prêts à l\'emploi.'
    }
  },
  { 
    id: 'environmentQ2', group: 'Conference Environment', emoji: '🎩', order: 11,
    label: { 
      en: '11. The staff and team members were polite, enthusiastic, and always available to provide assistance throughout the event.', 
      th: '11. เจ้าหน้าที่และสมาชิกในทีมมีความสุภาพ กระตือรือร้น และพร้อมให้ความช่วยเหลือตลอดการจัดงาน',
      zh: '11. 工作人员和团队成员礼貌、热情，并在整个活动期间随时提供帮助。',
      es: '11. El personal y los miembros del equipo fueron amables, entusiastas y siempre estuvieron disponibles para ayudar durante todo el evento.',
      ar: '11. كان الموظفون وأعضاء الفريق مهذبين، ومتحمسين، ومتواجدين دائماً لتقديم المساعدة طوال الحدث.',
      ru: '11. Персонал и члены команды были вежливы, полны энтузиазма и всегда готовы оказать помощь на протяжении всего мероприятия.',
      fr: '11. Le personnel et les membres de l\'équipe étaient polis, enthousiastes et toujours disponibles pour fournir de l\'assistance tout au long de l\'événement.'
    }
  },
  { 
    id: 'environmentQ3', group: 'Conference Environment', emoji: '👥', order: 12,
    label: { 
      en: '12. The pre-conference communication, presentation materials, and guidelines for daily dress codes (Dress Code) were clear and well-coordinated.', 
      th: '12. การติดต่อสื่อสารก่อนการประชุม เอกสารประกอบการนำเสนอ และแนวทางปฏิบัติสำหรับเครื่องแต่งกายประจำวัน (Dress Code) มีความชัดเจนและประสานงานกันเป็นอย่างดี',
      zh: '12. 会前沟通、演示材料以及每日着装规范（Dress Code）指南清晰且协调得当。',
      es: '12. La comunicación previa a la conferencia, los materiales de presentación y las pautas para los códigos de vestimenta diarios (Dress Code) fueron claros y estuvieron bien coordinados.',
      ar: '12. كانت الاتصالات السابقة للمؤتمر، ومواد العرض التقديمي، والمبادئ التوجيهية لقواعد اللباس اليومية (Dress Code) واضحة ومنسقة بشكل جيد.',
      ru: '12. Предварительная коммуникация, презентационные материалы и правила повседневного дресс-кода (Dress Code) были ясными и хорошо скоординированными.',
      fr: '12. La communication pré-conférence, les documents de présentation et les directives concernant les codes vestimentaires quotidiens (Dress Code) étaient clairs et bien coordonnés.'
    }
  },
  { 
    id: 'activitiesQ1', group: 'Recreational Activities', emoji: '🚔', order: 13,
    label: { 
      en: '13. The welcoming reception (Host Night at the Royal Thai Police) offered an excellent atmosphere and high-quality hospitality.', 
      th: '13. งานเลี้ยงต้อนรับ (Host Night ที่สำนักงานตำรวจแห่งชาติ) มีบรรยากาศที่ยอดเยี่ยมและการต้อนรับที่มีคุณภาพสูง',
      zh: '13. 欢迎招待会（泰国皇家警察主办之夜）营造了极佳的气氛并提供了高质量的招待。',
      es: '13. La recepción de bienvenida (Host Night en la Real Policía Tailandesa) ofreció un ambiente excelente y una hospitalidad de alta calidad.',
      ar: '13. وفر حفل الاستقبال الترحيبي (ليلة المضيف في الشرطة الملكية التايلاندية) أجواء ممتازة وضيافة عالية الجودة.',
      ru: '13. Приветственный прием (Host Night в Королевской полиции Таиланда) обеспечил отличную атмосферу и высококачественное гостеприимство.',
      fr: '13. La réception de bienvenue (Host Night chez la Police Royale Thaïlandaise) a offert une excellente atmosphère et une hospitalité de haute qualidade.'
    }
  },
  { 
    id: 'activitiesQ2', group: 'Recreational Activities', emoji: '🎉', order: 14,
    label: { 
      en: '14. The Opening Ceremony was honorable, prestigious, and highly impressive.', 
      th: '14. พิธีเปิดมีความสมเกียรติ ทรงเกียรติ และน่าประทับใจเป็นอย่างยิ่ง',
      zh: '14. 开幕式庄严、隆重且令人印象深刻。',
      es: '14. La ceremonia de apertura fue honorable, prestigiosa y sumamente impresionante.',
      ar: '14. كان حفل الافتتاح شريفاً ومرموقاً ومؤثراً للغاية.',
      ru: '14. Церемония открытия была почетной, престижной и весьма впечатляющей.',
      fr: '14. La cérémonie d\'ouverture était honorable, prestigieuse et très impressionnante.'
    }
  },
  { 
    id: 'activitiesQ3', group: 'Recreational Activities', emoji: '🍝', order: 15,
    label: { 
      en: '15. The Cultural Dinner (on the Wonderful Pearl Cruise) and the Farewell Dinner (at Grande Centre Point Lumpini) offered an excellent atmosphere and high-quality organization.', 
      th: '15. งานเลี้ยงอาหารค่ำทางวัฒนธรรม (บนเรือวันเดอร์ฟูล เพิร์ล ครูซ) และงานเลี้ยงอำลา (ที่โรงแรม แกรนด์ เซนเตอร์ พอยต์ ลุมพินี) มีบรรยากาศที่ยอดเยี่ยมและจัดงานได้อย่างมีคุณภาพสูง',
      zh: '15. 文化晚宴（在 Wonderful Pearl 游轮上）和告别晚宴（在 Grande Centre Point Lumpini）营造了极佳的气氛并提供了高质量的组织。',
      es: '15. La Cena Cultural (en el crucero Wonderful Pearl) y la Cena de Despedida (en el Grande Centre Point Lumpini) ofreció un excelente ambiente y una organización de alta calidad.',
      ar: '15. قدم العشاء الثقافي (على متن سفينة Wonderful Pearl) وعشاء الوداع (في Grande Centre Point Lumpini) أجواء ممتازة وتنظيماً عالي الجودة.',
      ru: '15. Культурный ужин (на круизном лайнере Wonderful Pearl) и прощальный ужин (в отеле Grande Centre Point Lumpini) обеспечили отличную атмосферу и высокое качество организации.',
      fr: '15. Le dîner culturel (sur la croisière Wonderful Pearl) et le dîner d\'adieu (au Grande Centre Point Lumpini) ont offert une excellente atmosphère et une organisation de haute qualité.'
    }
  },
  { 
    id: 'activitiesQ4', group: 'Recreational Activities', emoji: '⏰', order: 16,
    label: { 
      en: '16. The "Yellow Brick Experience" at Lumpini Park provided an appropriate group activity format that successfully fostered team-building and solidarity.', 
      th: '16. กิจกรรม "Yellow Brick Experience" ที่สวนลุมพินี มีรูปแบบกิจกรรมกลุ่มที่เหมาะสม ซึ่งประสบความสำเร็จในการส่งเสริมการสร้างทีมและความสามัคคี',
      zh: '16. 在 Lumpini 公园开展的 “Yellow Brick 体验” 提供了合适的小组活动形式，成功促进了团队建设和团结。',
      es: '16. La "Yellow Brick Experience" en el Parque Lumpini proporcionó un formato de actividad grupal adecuado que fomentó con éxito el trabajo en equipo y la solidaridad.',
      ar: '16. قدمت تجربة "Yellow Brick Experience" في حديقة لومبيني شكلاً مناسباً للنشاط الجماعي الذي نجح في تعزيز بناء الفريق والتضامن.',
      ru: '16. Мероприятие «Yellow Brick Experience» в парке Лумпини обеспечило подходящий формат групповой деятельности, способствовавший сплочению команды.',
      fr: '16. La "Yellow Brick Experience" au parc Lumpini a fourni un format d\'activité de groupe approprié qui a favorisé avec succès le renforcement de l\'équipe et la solidarité.'
    }
  },
  { 
    id: 'activitiesQ5', group: 'Recreational Activities', emoji: '🌏', order: 17,
    label: { 
      en: '17. The Closing Ceremony was well-organized, meaningful, and provided a memorable conclusion to the conference.', 
      th: '17. พิธีปิดมีการจัดงานที่ดี มีความหมาย และเป็นการจบการประชุมที่น่าจดจำ',
      zh: '17. 闭幕式组织井然、意义深远，为会议画上了难忘的句号。',
      es: '17. La ceremonia de clausura estuvo bien organizada, fue significativa y proporcionó una conclusión memorable a la conferencia.',
      ar: '17. كان حفل الختام منسقاً بشكل جيد وذا مغزى، وقدم ختاماً لا يُنسى للمؤتمر.',
      ru: '17. Церемония закрытия была хорошо организована, содержательна и завершилась незабываемым финалом конференции.',
      fr: '17. La cérémonie de clôture était bien organisée, significative et a offert une conclusion mémorable à la conférence.'
    }
  },
  { 
    id: 'activitiesQ6', group: 'Recreational Activities', emoji: '📝', order: 18,
    label: { 
      en: '18. The Farewell Dinner was well-organized, enjoyable, and served as a highly satisfactory closing to the program.', 
      th: '18. งานเลี้ยงอำลาจัดงานได้เป็นอย่างดี สนุกสนาน และเป็นการปิดท้ายโครงการที่น่าพึงพอใจเป็นอย่างยิ่ง',
      zh: '18. 告别晚宴组织良好、令人愉快，为项目画上了非常满意的句号。',
      es: '18. La cena de despedida estuvo bien organizada, fue agradable y sirvió como un cierre muy satisfactorio del programa.',
      ar: '18. كان عشاء الوداع منسقاً بشكل جيد وممتعاً，وكان بمثابة ختام مرضٍ للغاية للبرنامج.',
      ru: '18. Прощальный ужин был хорошо организован, прошел в приятной обстановке и послужил исключительно удовлетворительным завершением программы.',
      fr: '18. Le dîner d\'adieu était bien organisé, agréable et a servi de clôture très satisfaisante pour le programme.'
    }
  },
  { 
    id: 'activitiesQ7', group: 'Recreational Activities', emoji: '🏨', order: 19,
    label: { 
      en: '19. The overall social and recreational programs effectively provided opportunities to establish international cooperation and build networking between participants.', 
      th: '19. โปรแกรมทางสังคมและสันทนาการโดยรวมช่วยสร้างโอกาสในการจัดตั้งความร่วมมือระหว่างประเทศและสร้างเครือข่ายระหว่างผู้เข้าร่วมได้อย่างมีประสิทธิภาพ',
      zh: '19. 整体社交和娱乐项目有效地为参与者之间建立国际合作和拓展人脉提供了机会。',
      es: '19. Los programas sociales y recreativos en general proporcionaron de manera efectiva oportunidades para establecer la cooperación internacional y crear redes de contactos entre los participantes.',
      ar: '19. وفرت البرامج الاجتماعية والترفيهية العامة بفعالية فرصاً لإقامة تعاون دولي وبناء شبكات تواصل بين المشاركين.',
      ru: '19. Социальные и развлекательные программы в целом эффективно создавали возможности для налаживания международного сотрудничества и установления контактов между участниками.',
      fr: '19. Les programs sociaux et récréatifs généraux ont efficacement fourni des opportunités d\'établir une coopération internationale et de créer des réseaux entre les participants.'
    }
  }
];

export function SurveyManager() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { refreshConfig } = useConfig();

  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [textQuestions, setTextQuestions] = useState<SurveyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'rating' | 'text' | 'settings'>('rating');

  // General settings state
  const [logoEmoji, setLogoEmoji] = useState('📝');
  const [logoText, setLogoText] = useState('Survey System');
  const [showLogo, setShowLogo] = useState(true);
  const [headerTitle, setHeaderTitle] = useState('Satisfaction Evaluation');
  const [showHeaderTitle, setShowHeaderTitle] = useState(true);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['en', 'zh', 'es', 'ar', 'ru', 'fr', 'th']);

  const [editingItem, setEditingItem] = useState<SurveyQuestion | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<SupportedLanguage>('en');

  // Form values
  const [id, setId] = useState('');
  const [labels, setLabels] = useState<LocalizedString>({ en: '' });
  const [emoji, setEmoji] = useState('');
  const [group, setGroup] = useState('');
  const [order, setOrder] = useState(0);

  // Drag and Drop
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const categories = Array.from(new Set([
    ...DEFAULT_QUESTIONS.map(q => q.group),
    ...questions.map(q => q.group)
  ])).filter(Boolean).sort();

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const config = await surveyService.getSurveyConfig();
      if (config) {
        setQuestions(config.questions.sort((a, b) => a.order - b.order));
        setTextQuestions((config.textQuestions || [...DEFAULT_TEXT_QUESTIONS]).sort((a, b) => a.order - b.order));
        setLogoEmoji(config.logoEmoji ?? '📝');
        setLogoText(config.logoText ?? 'Survey System');
        setShowLogo(config.showLogo !== false);
        setHeaderTitle(config.headerTitle ?? 'Satisfaction Evaluation');
        setShowHeaderTitle(config.showHeaderTitle !== false);
        setSelectedLanguages(config.allowedLanguages || ['en', 'zh', 'es', 'ar', 'ru', 'fr', 'th']);
      } else {
        setQuestions([...DEFAULT_QUESTIONS]);
        setTextQuestions([...DEFAULT_TEXT_QUESTIONS]);
      }
    } catch {
      addToast({ type: 'error', title: t('common.error'), message: 'Failed to load survey configuration' });
    } finally {
      setLoading(false);
    }
  }, [addToast, t]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLanguages.length === 0) {
      addToast({ type: 'error', title: t('common.error'), message: 'At least one language must be selected.' });
      return;
    }
    setSaving(true);
    try {
      const config: SurveyConfig = {
        questions,
        textQuestions,
        logoEmoji,
        logoText,
        showLogo,
        headerTitle,
        showHeaderTitle,
        allowedLanguages: selectedLanguages,
        updatedAt: new Date()
      };
      await surveyService.updateSurveyConfig(config);
      await refreshConfig();
      addToast({ type: 'success', title: t('common.success'), message: 'System settings updated' });
    } catch {
      addToast({ type: 'error', title: t('common.error'), message: 'Failed to update system settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (q: SurveyQuestion) => {
    setEditingItem(q);
    setId(q.id);
    setLabels({ ...q.label });
    setEmoji(q.emoji);
    setGroup(q.group);
    setOrder(q.order);
    setActiveLangTab('en');
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setId(`q_${Math.random().toString(36).substring(2, 11)}`);
    setLabels({ en: '' });
    setEmoji('📝');
    setGroup(activeSubTab === 'text' ? 'Comments' : '');
    setOrder(activeSubTab === 'text' ? textQuestions.length + 1 : questions.length + 1);
    setActiveLangTab('en');
    setModalOpen(true);
  };

  const handleLabelChange = (lang: string, value: string) => {
    setLabels(prev => ({ ...prev, [lang]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!labels.en) {
      addToast({ type: 'error', title: t('common.error'), message: 'English label is required.' });
      return;
    }

    setSaving(true);
    try {
      let updatedQuestions = [...questions];
      let updatedTextQuestions = [...textQuestions];

      if (activeSubTab === 'rating') {
        if (editingItem) {
          updatedQuestions = questions.map(q => q.id === editingItem.id ? { ...q, label: labels, emoji, group, order } : q);
        } else {
          updatedQuestions.push({ id, label: labels, emoji, group, order });
        }
        updatedQuestions = updatedQuestions.sort((a, b) => a.order - b.order);
      } else {
        if (editingItem) {
          updatedTextQuestions = textQuestions.map(q => q.id === editingItem.id ? { ...q, label: labels, emoji, group: group || 'Comments', order } : q);
        } else {
          updatedTextQuestions.push({ id, label: labels, emoji, group: group || 'Comments', order });
        }
        updatedTextQuestions = updatedTextQuestions.sort((a, b) => a.order - b.order);
      }

      const config: SurveyConfig = {
        questions: updatedQuestions,
        textQuestions: updatedTextQuestions,
        updatedAt: new Date()
      };

      await surveyService.updateSurveyConfig(config);
      setQuestions(updatedQuestions);
      setTextQuestions(updatedTextQuestions);
      setModalOpen(false);
      addToast({ type: 'success', title: t('common.success'), message: 'Survey configuration updated' });
    } catch (err: unknown) {
      addToast({ type: 'error', title: t('common.error'), message: (err as Error).message || 'Failed to save configuration' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (targetId: string) => {
    if (!window.confirm(`Are you sure you want to delete question "${targetId}"?`)) return;

    setSaving(true);
    try {
      let updatedQuestions = [...questions];
      let updatedTextQuestions = [...textQuestions];

      if (activeSubTab === 'rating') {
        updatedQuestions = questions.filter(q => q.id !== targetId);
      } else {
        updatedTextQuestions = textQuestions.filter(q => q.id !== targetId);
      }

      const config: SurveyConfig = {
        questions: updatedQuestions,
        textQuestions: updatedTextQuestions,
        updatedAt: new Date()
      };
      await surveyService.updateSurveyConfig(config);
      setQuestions(updatedQuestions);
      setTextQuestions(updatedTextQuestions);
      addToast({ type: 'success', title: t('common.success'), message: 'Question deleted' });
    } catch {
      addToast({ type: 'error', title: t('common.error'), message: 'Failed to delete question' });
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreDefaults = async () => {
    const typeLabel = activeSubTab === 'rating' ? 'rating' : 'qualitative text';
    if (!window.confirm(`Are you sure you want to restore default ${typeLabel} questions?`)) return;
    
    setSaving(true);
    try {
      let updatedQuestions = [...questions];
      let updatedTextQuestions = [...textQuestions];

      if (activeSubTab === 'rating') {
        updatedQuestions = [...DEFAULT_QUESTIONS];
      } else {
        updatedTextQuestions = [...DEFAULT_TEXT_QUESTIONS];
      }

      const config: SurveyConfig = {
        questions: updatedQuestions,
        textQuestions: updatedTextQuestions,
        updatedAt: new Date()
      };
      await surveyService.updateSurveyConfig(config);
      setQuestions(updatedQuestions);
      setTextQuestions(updatedTextQuestions);
      addToast({ type: 'success', title: t('common.success'), message: `Restored to default ${typeLabel} questions` });
    } catch {
      addToast({ type: 'error', title: t('common.error'), message: 'Failed to restore defaults' });
    } finally {
      setSaving(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIdx) {
      setDraggedIdx(null);
      return;
    }

    let updatedQuestions = [...questions];
    let updatedTextQuestions = [...textQuestions];

    if (activeSubTab === 'rating') {
      const draggedItem = updatedQuestions[draggedIdx];
      updatedQuestions.splice(draggedIdx, 1);
      updatedQuestions.splice(dropIdx, 0, draggedItem);
      updatedQuestions = updatedQuestions.map((q, i) => ({ ...q, order: i + 1 }));
      setQuestions(updatedQuestions);
    } else {
      const draggedItem = updatedTextQuestions[draggedIdx];
      updatedTextQuestions.splice(draggedIdx, 1);
      updatedTextQuestions.splice(dropIdx, 0, draggedItem);
      updatedTextQuestions = updatedTextQuestions.map((q, i) => ({ ...q, order: i + 1 }));
      setTextQuestions(updatedTextQuestions);
    }
    setDraggedIdx(null);

    try {
      await surveyService.updateSurveyConfig({ 
        questions: updatedQuestions, 
        textQuestions: updatedTextQuestions, 
        updatedAt: new Date() 
      });
      addToast({ type: 'success', title: t('common.success'), message: 'Order updated' });
    } catch {
      addToast({ type: 'error', title: t('common.error'), message: 'Failed to save new order' });
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}><div className="spinner" /></div>;
  }

  return (
    <div className="survey-manager animate-fade-in">
      <div className="admin-page-header" style={{ marginBottom: '16px' }}>
        <div>
          <h3 className="admin-page-title">📝 Survey Configuration</h3>
          <p className="admin-page-subtitle">Manage the questions, branding, and languages for the Satisfaction Evaluation Survey.</p>
        </div>
        {activeSubTab !== 'settings' && (
          <div className="admin-page-actions" style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={handleRestoreDefaults} disabled={saving}>
              🔄 Restore Defaults
            </button>
            <button className="btn btn-primary" onClick={handleAddNew}>
              ➕ Add New Question
            </button>
          </div>
        )}
      </div>

      <div className="admin-tab-container nested-tabs">
        <button
          onClick={() => setActiveSubTab('rating')}
          className={`btn ${activeSubTab === 'rating' ? 'btn-secondary' : 'btn-ghost'} admin-tab-btn`}
        >
          ⭐️ Rating Questions
        </button>
        <button
          onClick={() => setActiveSubTab('text')}
          className={`btn ${activeSubTab === 'text' ? 'btn-secondary' : 'btn-ghost'} admin-tab-btn`}
        >
          📝 Qualitative Text Fields
        </button>
        <button
          onClick={() => setActiveSubTab('settings')}
          className={`btn ${activeSubTab === 'settings' ? 'btn-secondary' : 'btn-ghost'} admin-tab-btn`}
        >
          ⚙️ System Settings
        </button>
      </div>

      {activeSubTab === 'settings' ? (
        <form onSubmit={handleSaveSettings} className="card" style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', marginTop: '16px' }}>
          <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-primary-800)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)', margin: 0 }}>
            ⚙️ Header & Language Settings
          </h4>

          <div className="settings-form-grid">
            
            {/* Logo Settings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <h5 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--color-primary-800)' }}>Logo Customization</h5>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox" 
                  id="showLogo" 
                  checked={showLogo} 
                  onChange={e => setShowLogo(e.target.checked)} 
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="showLogo" style={{ fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Show Logo in Headerbar</label>
              </div>

              {showLogo && (
                <>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px' }}>Logo Emoji Icon</label>
                    <input 
                      className="form-input" 
                      value={logoEmoji} 
                      onChange={e => setLogoEmoji(e.target.value)} 
                      placeholder="e.g. 📝" 
                      required
                      style={{ fontSize: '14px', height: '38px' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px' }}>Logo Text / Brand Name</label>
                    <input 
                      className="form-input" 
                      value={logoText} 
                      onChange={e => setLogoText(e.target.value)} 
                      placeholder="e.g. Survey System" 
                      required
                      style={{ fontSize: '14px', height: '38px' }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Header Headline settings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <h5 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--color-primary-800)' }}>Headline Customization</h5>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox" 
                  id="showHeaderTitle" 
                  checked={showHeaderTitle} 
                  onChange={e => setShowHeaderTitle(e.target.checked)} 
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="showHeaderTitle" style={{ fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Show Headline in Headerbar</label>
              </div>

              {showHeaderTitle && (
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '12px' }}>Header Headline / Title</label>
                  <input 
                    className="form-input" 
                    value={headerTitle} 
                    onChange={e => setHeaderTitle(e.target.value)} 
                    placeholder="e.g. Satisfaction Evaluation" 
                    required
                    style={{ fontSize: '14px', height: '38px' }}
                  />
                </div>
              )}
            </div>

            {/* Language Settings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <h5 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--color-primary-800)' }}>Allowed Languages</h5>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                Select languages allowed for users to switch in the header dropdown:
              </p>
              
              <div className="allowed-langs-list">
                {supportedLanguages.map(lang => {
                  const isChecked = selectedLanguages.includes(lang);
                  return (
                    <div key={lang} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="checkbox" 
                        id={`lang-${lang}`}
                        checked={isChecked}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedLanguages(prev => [...prev, lang]);
                          } else {
                            setSelectedLanguages(prev => prev.filter(l => l !== lang));
                          }
                        }}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <label htmlFor={`lang-${lang}`} style={{ fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{languageNames[lang].nativeName}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>({languageNames[lang].name})</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
            
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ minWidth: '150px' }}>
              {saving ? 'Saving...' : '💾 Save Settings'}
            </button>
          </div>
        </form>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginTop: '16px' }}>
          <div className="table-responsive" style={{ margin: 0 }}>
            <table className="table" style={{ minWidth: '600px' }}>
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Order</th>
                  <th style={{ width: '60px' }}>Emoji</th>
                  <th style={{ width: '150px' }}>Group / Category</th>
                  <th>Question Label (EN)</th>
                  <th style={{ width: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(activeSubTab === 'rating' ? questions : textQuestions).map((q, idx) => (
                  <tr 
                    key={q.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e)}
                    onDrop={(e) => handleDrop(e, idx)}
                    style={{ cursor: 'move', opacity: draggedIdx === idx ? 0.5 : 1 }}
                  >
                    <td style={{ fontWeight: 800, color: 'var(--color-gold-600)' }}>
                      <span style={{ marginRight: '8px', opacity: 0.5 }}>⠿</span>
                      #{q.order}
                    </td>
                    <td style={{ fontSize: '1.2rem' }}>{q.emoji}</td>
                    <td>
                      <span className="badge badge-gold">{t(`custom.survey.groups.${q.group}`, q.group || 'Comments')}</span>
                    </td>
                    <td style={{ fontSize: '13px' }}>{q.label.en}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(q)}>
                          ✏️
                        </button>
                        <button className="btn btn-sm btn-secondary" onClick={() => handleDelete(q.id)} style={{ color: 'var(--color-maroon-700)' }}>
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? `Edit Question: ${editingItem.id}` : 'Add New Question'}
        size="wide"
      >
        <form onSubmit={handleSave} className="modal-question-form">
          <div className="modal-form-grid">
            <div className="form-group">
              <label className="form-label">Group / Category</label>
              <input 
                className="form-input" 
                value={group} 
                onChange={e => setGroup(e.target.value)} 
                placeholder={activeSubTab === 'text' ? 'e.g. Comments' : 'e.g. Conference'}
                list="category-suggestions"
                required={activeSubTab === 'rating'} 
              />
              <datalist id="category-suggestions">
                {categories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
            <div className="form-group">
              <label className="form-label">Emoji Icon</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  className="form-input" 
                  value={emoji} 
                  onChange={e => setEmoji(e.target.value)} 
                  placeholder="e.g. 🎯"
                  style={{ width: '80px', textAlign: 'center', fontSize: '1.25rem' }}
                  maxLength={5}
                  required 
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxHeight: '72px', overflowY: 'auto', padding: '6px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', flex: 1, backgroundColor: 'var(--bg-tertiary)' }}>
                  {['🎯', '⏱️', '💼', '🚀', '🗣️', '⏳', '🎓', '🎤', '🤝', '🏢', '👥', '🎉', '⏰', '🍽️', '🏨', '📝', '💬', '💡', '🛠️', '🔮', '⭐', '❤️', '😊', '👍', '👏', '📅', '📍'].map(em => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setEmoji(em)}
                      style={{
                        background: emoji === em ? 'var(--color-primary-50)' : 'transparent',
                        border: emoji === em ? '1px solid var(--color-primary-800)' : '1px solid transparent',
                        borderRadius: '4px',
                        padding: '4px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.1s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.2)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: 'var(--space-2)' }}>
            <label className="form-label">Multilingual Labels</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              {supportedLanguages.map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLangTab(lang)}
                  style={{
                    padding: '6px 12px',
                    background: activeLangTab === lang ? 'var(--color-primary-50)' : 'transparent',
                    border: 'none',
                    borderBottom: activeLangTab === lang ? '2px solid var(--color-primary-800)' : '2px solid transparent',
                    color: activeLangTab === lang ? 'var(--color-primary-900)' : 'var(--text-secondary)',
                    fontWeight: activeLangTab === lang ? 700 : 500,
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  {languageNames[lang].name}
                </button>
              ))}
            </div>

            <textarea 
              className="form-input" 
              value={labels[activeLangTab] || ''} 
              onChange={e => handleLabelChange(activeLangTab, e.target.value)} 
              rows={3}
              placeholder={`Question in ${languageNames[activeLangTab].name}...`}
              required={activeLangTab === 'en'} 
            />
          </div>
          
          <div className="modal-footer" style={{ marginTop: 'var(--space-4)', padding: 0 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
