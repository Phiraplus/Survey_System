import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../contexts/ToastContext';
import { surveyService, getTextAnswer, DEFAULT_TEXT_QUESTIONS } from '../../services/surveyService';
import { FlagIcon, Spinner, Card, Badge, Modal } from '../../components/ui';
import type { SurveyResponse, SurveyQuestion, SupportedLanguage } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

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
      zh: '5. 贯穿全天的短时间知识分享会（Step Talk）的时间安排 and 频率是合适且有益的。',
      es: '5. La programación y frecuencia de las sesiones de conocimiento de corta duración (Step Talk) integradas a lo largo de los días fueron adecuadas y beneficiosas.',
      ar: '5. كانت جدولة وتكرار جلسات المعرفة قصيرة المدة (Step Talk) المتكاملة طوال الأيام مناسبة ومفيدة.',
      ru: '5. Расписание и частота краткосрочных информационных сессий (Step Talk), интегрированных в течение дней, были подходящими и полезными.',
      fr: '5. La programación y la frecuencia de las sesiones de conocimientos de corta duración (Step Talk) integradas todo lo largo de las jornadas fueron apropiadas y beneficiosas.'
    }
  },
  { 
    id: 'speakersQ1', group: 'Guest Speakers', emoji: '📙', order: 6,
    label: { 
      en: '6. The guest speakers and panelists were knowledgeable and experienced in the subject matters.', 
      th: '6. วิทยากรรับเชิญและผู้ร่วมเสวนาความรู้และประสบการณ์ในหัวข้อการบรรยาย',
      zh: '6. 特邀演讲嘉宾和小组讨论小组成员在相关领域知识渊博且经验丰富。',
      es: '6. Los oradores invitados y panelistas tenían conocimientos y experiencia en los temas tratados.',
      ar: '6. كان المتحدثون الضيوف وأعضاء لجنة النقاش مطلعين وذوي خبرة в موضوعات البحث.',
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
      fr: '10. Les installations de la conférence et l\'équipement audiovisual (système de son, écrans) dans la salle de réunion étaient de bonne qualité et prêts à l\'emploi.'
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
      fr: '13. La réception de bienvenue (Host Night chez la Police Royale Thaïlandaise) a offert une excellente atmosphère et une hospitalité de haute qualité.'
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
      ar: '18. كان عشاء الوداع منسقاً بشكل جيد وممتعاً، وكان بمثابة ختام مرضٍ للغاية للبرنامج.',
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

const renderStars = (rating: number, fontSize = '1.2rem') => {
  return (
    <div style={{ display: 'inline-flex', gap: '2px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(star => {
        const fill = Math.max(0, Math.min(1, rating - (star - 1)));
        return (
          <span
            key={star}
            style={{
              fontSize: fontSize,
              position: 'relative',
              display: 'inline-block',
              width: fontSize,
              height: fontSize,
              lineHeight: '1',
              userSelect: 'none'
            }}
          >
            <span style={{ color: 'var(--border-color)', position: 'absolute', top: 0, left: 0 }}>★</span>
            <span style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${fill * 100}%`,
              overflow: 'hidden',
              color: 'var(--color-gold-500)',
              whiteSpace: 'nowrap'
            }}>★</span>
          </span>
        );
      })}
    </div>
  );
};

export function SurveyResults() {
  const { t, i18n } = useTranslation();
  const { addToast } = useToast();
  const { isAdmin } = useAuth();

  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [textQuestions, setTextQuestions] = useState<SurveyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTextAnswers, setEditedTextAnswers] = useState<Record<string, string>>({});

  // Edited fields for Modal
  const [editedRatings, setEditedRatings] = useState<SurveyResponse['ratings'] | null>(null);

  const lang = (i18n.language?.substring(0, 2) || 'en') as SupportedLanguage;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const config = await surveyService.getSurveyConfig();
      const activeQuestions = config ? config.questions.sort((a, b) => a.order - b.order) : DEFAULT_QUESTIONS;
      setQuestions(activeQuestions);

      const activeTextQuestions = config && config.textQuestions ? config.textQuestions.sort((a, b) => a.order - b.order) : DEFAULT_TEXT_QUESTIONS;
      setTextQuestions(activeTextQuestions);

      const list = await surveyService.getAllSurveys();
      setSurveys(list);
    } catch (e) {
      console.error(e);
      addToast({ type: 'error', title: t('common.error'), message: 'Failed to load satisfaction results' });
    } finally {
      setLoading(false);
    }
  }, [addToast, t]);

  const handleSelectResponse = (survey: SurveyResponse) => {
    setSelectedResponse(survey);
    setIsEditing(false);
    setEditedRatings({ ...survey.ratings });

    const answers: Record<string, string> = {};
    textQuestions.forEach(q => {
      answers[q.id] = getTextAnswer(survey, q.id);
    });
    setEditedTextAnswers(answers);
  };

  const handleSaveChanges = async () => {
    if (!selectedResponse || !editedRatings) return;
    try {
      const updatedSurvey: SurveyResponse = {
        ...selectedResponse,
        ratings: editedRatings,
        comments: editedTextAnswers['comments'] || '',
        suggestions: editedTextAnswers['suggestions'] || '',
        mostInterestingSession: editedTextAnswers['mostInterestingSession'] || '',
        improvementAreas: editedTextAnswers['improvementAreas'] || '',
        futureTopics: editedTextAnswers['futureTopics'] || '',
        textAnswers: editedTextAnswers,
        submittedAt: selectedResponse.submittedAt
      };
      await surveyService.submitSurvey(updatedSurvey);
      addToast({
        type: 'success',
        title: t('common.success', 'Success'),
        message: 'Survey response updated successfully'
      });
      setSelectedResponse(null);
      setIsEditing(false);
      loadData();
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        title: t('common.error', 'Error'),
        message: 'Failed to update survey response'
      });
    }
  };

  const handleDeleteSurvey = async () => {
    if (!selectedResponse) return;
    if (!window.confirm(t('admin.survey.deleteConfirm', 'Are you sure you want to delete this survey?'))) {
      return;
    }
    try {
      await surveyService.deleteSurvey(selectedResponse.uid);
      addToast({
        type: 'success',
        title: t('common.success', 'Success'),
        message: 'Survey response deleted successfully'
      });
      setSelectedResponse(null);
      setIsEditing(false);
      loadData();
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        title: t('common.error', 'Error'),
        message: 'Failed to delete survey response'
      });
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleExportCSV = () => {
    const questionHeaders = questions.map(q => q.id).join(',');
    const textQuestionHeaders = textQuestions.map(q => q.id).join(',');
    const headers = `Delegate,Email,Country,${questionHeaders},${textQuestionHeaders},SubmittedAt\n`;
    const csvContent = surveys
      .map(s => {
        const r = s.ratings;
        const ratingsValues = questions.map(q => r[q.id] !== undefined ? r[q.id] : '').join(',');
        const textValues = textQuestions.map(q => {
          const val = getTextAnswer(s, q.id);
          return `"${val.replace(/"/g, '""')}"`;
        }).join(',');
        return `"${s.name}","${s.email}","${s.country}",${ratingsValues},${textValues},"${new Date(s.submittedAt).toISOString()}"`;
      })
      .join('\n');

    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const fileName = `Survey_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({ type: 'success', title: t('common.success'), message: 'Survey report exported successfully' });
  };

  const totalCount = surveys.length;
  
  const calculateAverage = (key: string): number => {
    if (totalCount === 0) return 0;
    const sum = surveys.reduce((acc, curr) => acc + (curr.ratings[key] || 0), 0);
    return sum / totalCount;
  };

  const groups = Array.from(new Set(questions.map(q => q.group))).filter(Boolean);

  const categories = groups.map(groupName => {
    const groupQuestions = questions.filter(q => q.group === groupName);
    const avgSum = groupQuestions.reduce((acc, q) => acc + calculateAverage(q.id), 0);
    const avg = groupQuestions.length > 0 ? avgSum / groupQuestions.length : 0;
    const groupEmoji = groupQuestions.find(q => q.emoji)?.emoji || '📝';

    return {
      key: groupName,
      label: t(`custom.survey.groups.${groupName}`, groupName),
      avg,
      emoji: groupEmoji
    };
  });

  const globalAverage = categories.length > 0 
    ? categories.reduce((acc, cat) => acc + cat.avg, 0) / categories.length
    : 0;

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spinner size="lg" /></div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      
      <div className="admin-page-header">
        <div>
          <h3 className="admin-page-title">📊 {t('admin.survey.title', 'Satisfaction Reports')}</h3>
          <p className="admin-page-subtitle">{t('admin.survey.subtitle', 'Analyze aggregate feedback and qualitative comments.')}</p>
        </div>
        <div className="admin-page-actions">
          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV} disabled={totalCount === 0}>
            📥 {t('common.export', 'Export Report')}
          </button>
        </div>
      </div>

      <div className="results-metrics-grid">
        <Card style={{ padding: 'var(--space-6)' }}>
          <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-primary-800)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            📈 Performance Metrics
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {categories.map(cat => {
              const pct = cat.avg * 20;
              return (
                <div key={cat.key}>
                  <div className="metrics-row">
                    <span>{cat.emoji} {cat.label}</span>
                    <span style={{ color: 'var(--color-gold-600)' }}>{cat.avg.toFixed(1)} / 5.0</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-gold-500), var(--color-primary-800))' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="global-score-card">
          <span className="global-score-title">Global Score Index</span>
          <div className="global-score-value">{globalAverage.toFixed(2)}</div>
          <div>{renderStars(globalAverage, '1.5rem')}</div>
          <span className="global-score-count">from {totalCount} evaluations</span>
        </Card>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden', marginTop: '16px' }}>
        <h4 style={{ padding: 'var(--space-5) var(--space-6)', margin: 0, fontSize: 'var(--text-base)', borderBottom: '1px solid var(--border-color)' }}>
          💬 Qualitative Feedbacks & Suggestions
        </h4>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Delegate</th>
                <th>Country</th>
                <th>Overall</th>
                <th>Comments</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map((survey, index) => {
                const r = survey.ratings;
                const getPersonalAvg = () => {
                  const ratedQuestions = questions.filter(q => r[q.id] !== undefined && r[q.id] > 0);
                  if (ratedQuestions.length === 0) return 0;
                  const sum = ratedQuestions.reduce((acc, q) => acc + (r[q.id] || 0), 0);
                  return sum / ratedQuestions.length;
                };
                const personalAvg = getPersonalAvg();
                return (
                  <tr key={index} style={{ cursor: 'pointer' }} onClick={() => handleSelectResponse(survey)}>
                    <td>
                      <strong>{survey.name}</strong>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{survey.email}</div>
                    </td>
                    <td><FlagIcon code={survey.country} size="18px" /></td>
                    <td><Badge variant="success">{personalAvg.toFixed(1)}</Badge></td>
                    <td style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {survey.comments || survey.suggestions ? `${survey.comments} ${survey.suggestions}` : 'No comments'}
                    </td>
                    <td style={{ fontSize: '11px' }}>{new Date(survey.submittedAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={!!selectedResponse}
        onClose={() => { setSelectedResponse(null); setIsEditing(false); }}
        title={isEditing ? 'Edit Feedback' : 'Feedback Details'}
        size="wide"
      >
        {selectedResponse && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div>
              <strong>Delegate:</strong> {selectedResponse.name} (<FlagIcon code={selectedResponse.country} /> {selectedResponse.country})
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{selectedResponse.email}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {questions.map(q => (
                <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 'var(--text-sm)', display: 'inline-flex', gap: '8px' }}>
                    <span>{q.emoji}</span>
                    <span style={{ maxWidth: '400px', whiteSpace: 'normal' }}>{q.label[lang] || q.label.en || q.id}:</span>
                  </span>
                  {isEditing ? (
                    <select 
                      className="form-input" 
                      style={{ width: '70px', padding: '4px', minHeight: '30px' }} 
                      value={editedRatings ? (editedRatings[q.id] || 5) : 5} 
                      onChange={e => setEditedRatings(prev => prev ? { ...prev, [q.id]: Number(e.target.value) } : null)}
                    >
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  ) : (
                    <span style={{ color: 'var(--color-gold-600)', fontWeight: 700, flexShrink: 0 }}>
                      {selectedResponse.ratings[q.id] !== undefined ? renderStars(selectedResponse.ratings[q.id], '1rem') : 'N/A'}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
              {textQuestions.map(q => {
                const ans = getTextAnswer(selectedResponse, q.id);
                const isDashed = q.id === 'suggestions';
                return (
                  <div 
                    key={q.id} 
                    style={{ 
                      backgroundColor: isDashed ? 'rgba(212, 175, 55, 0.05)' : 'var(--bg-tertiary)', 
                      padding: 'var(--space-4)', 
                      borderRadius: 'var(--radius-md)',
                      border: isDashed ? '1px dashed var(--color-gold-500)' : '1px solid var(--border-color)'
                    }}
                  >
                    <strong>{q.emoji} {q.label[lang] || q.label.en}:</strong>
                    {isEditing ? (
                      <textarea 
                        className="form-input" 
                        value={editedTextAnswers[q.id] || ''} 
                        onChange={e => setEditedTextAnswers(prev => ({ ...prev, [q.id]: e.target.value }))} 
                        rows={3} 
                        style={{ marginTop: '4px', fontSize: 'var(--text-sm)' }} 
                      />
                    ) : (
                      <p style={{ margin: '4px 0 0 0', fontSize: 'var(--text-sm)', fontStyle: 'italic' }}>
                        "{ans || 'N/A'}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="modal-footer" style={{ marginTop: 'var(--space-4)', padding: 0, display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              {isEditing ? (
                <>
                  <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleSaveChanges}>Save Changes</button>
                </>
              ) : (
                <>
                  {isAdmin && <button className="btn btn-danger" onClick={handleDeleteSurvey}>Delete</button>}
                  <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit</button>
                  <button className="btn btn-secondary" onClick={() => setSelectedResponse(null)}>Close</button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
