import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export const supportedLanguages = ['en', 'zh', 'es', 'ar', 'ru', 'fr', 'th'] as const;

export const languageNames: Record<string, { name: string; nativeName: string; flag: string; isRTL?: boolean }> = {
  en: { name: 'English', nativeName: 'English', flag: 'us' },
  zh: { name: 'Chinese', nativeName: '中文', flag: 'cn' },
  es: { name: 'Spanish', nativeName: 'Español', flag: 'es' },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: 'sa', isRTL: true },
  ru: { name: 'Russian', nativeName: 'Русский', flag: 'ru' },
  fr: { name: 'French', nativeName: 'Français', flag: 'fr' },
  th: { name: 'Thai', nativeName: 'ไทย', flag: 'th' },
};

const resources = {
  en: {
    translation: {
      common: {
        success: 'Success',
        error: 'Error',
        none: 'None',
        loading: 'Loading...',
        login: 'Log In',
        export: 'Export'
      },
      custom: {
        survey: {
          title: 'Satisfaction Survey',
          formTitle: 'Satisfaction Evaluation',
          formSubtitle: 'Please rate your experience and provide feedback for future conference improvements.',
          submittedDesc: 'Thank you for submitting your evaluation and helping us improve.',
          successAlert: 'Your evaluation has been successfully logged and stored.',
          completedTitle: 'Evaluation Completed!',
          editButton: 'Edit My Evaluation',
          yourRatings: 'Your Ratings',
          yourComments: 'General Comments',
          yourSuggestions: 'Suggestions for Improvement',
          successTitle: 'Submission Successful!',
          successSubtitle: 'Your feedback has been received and securely stored. We appreciate your contribution.',
          successMessage: 'Thank you for your valuable feedback!',
          scaleTitle: 'Rating Scale',
          scale5: 'Strongly Agree',
          scale4: 'Agree',
          scale3: 'Neither',
          scale2: 'Disagree',
          scale1: 'Strongly Disagree',
          progressLabel: 'Survey Progress',
          additionalSection: 'Additional Suggestions and Comments',
          commentsLabel: 'Overall Experience',
          commentsPlaceholder: 'Please share your thoughts on the conference...',
          suggestionsLabel: 'Specific Suggestions',
          suggestionsPlaceholder: 'Any specific topics or improvements for next year?',
          mostInterestingLabel: 'Most Interesting Session/Speaker',
          mostInterestingPlaceholder: 'Who or what stood out to you?',
          improvementLabel: 'Areas for Improvement',
          improvementPlaceholder: 'What could be done better?',
          futureTopicsLabel: 'Future Topics',
          futureTopicsPlaceholder: 'What would you like to learn next year?',
          updateButton: 'Update Evaluation',
          submitButton: 'Submit Evaluation',
          viewResults: 'View My Response',
          loginRequiredTitle: 'Authentication Required',
          loginRequiredDesc: 'Please log in to your account to complete the official evaluation.',
          footerNotice: '',
          groups: {
            'Conference': 'Conference',
            'Guest Speakers': 'Guest Speakers',
            'Conference Environment': 'Conference Environment',
            'Recreational Activities': 'Recreational Activities'
          }
        }
      },
      admin: {
        nav: {
          surveyCenter: 'Survey Center'
        },
        survey: {
          tabReports: 'Satisfaction Reports',
          tabConfig: 'Configuration',
          title: 'Satisfaction Reports',
          subtitle: 'Analyze aggregate feedback and qualitative comments.',
          deleteConfirm: 'Are you sure you want to delete this survey response?'
        }
      }
    }
  },
  th: {
    translation: {
      common: {
        success: 'สำเร็จ',
        error: 'เกิดข้อผิดพลาด',
        none: 'ไม่มี',
        loading: 'กำลังโหลด...',
        login: 'เข้าสู่ระบบ',
        export: 'ส่งออกข้อมูล'
      },
      custom: {
        survey: {
          title: 'แบบสำรวจความพึงพอใจ',
          formTitle: 'การประเมินความพึงพอใจการประชุม',
          formSubtitle: 'กรุณาประเมินประสบการณ์ของคุณและแบ่งปันข้อคิดเห็นเพื่อนำไปปรับปรุงการจัดการประชุมในครั้งต่อไป',
          submittedDesc: 'ขอบคุณสำหรับความร่วมมือในการประเมินและช่วยให้เราพัฒนาการจัดงานในอนาคต',
          successAlert: 'บันทึกการประเมินความพึงพอใจของคุณเรียบร้อยแล้ว',
          completedTitle: 'การประเมินเสร็จสมบูรณ์!',
          editButton: 'แก้ไขแบบประเมินของฉัน',
          yourRatings: 'คะแนนการประเมินของคุณ',
          yourComments: 'ความคิดเห็นทั่วไป',
          yourSuggestions: 'ข้อแนะนำในการปรับปรุง',
          successTitle: 'ส่งข้อมูลสำเร็จ!',
          successSubtitle: 'ได้รับและจัดเก็บความคิดเห็นของคุณเรียบร้อยแล้ว เราขอขอบคุณอย่างยิ่งสำหรับผลประเมินของคุณ',
          successMessage: 'ขอบคุณสำหรับความคิดเห็นที่มีค่าของคุณ!',
          scaleTitle: 'เกณฑ์การให้คะแนน',
          scale5: 'เห็นด้วยอย่างยิ่ง',
          scale4: 'เห็นด้วย',
          scale3: 'ปานกลาง / ไม่มีความเห็น',
          scale2: 'ไม่เห็นด้วย',
          scale1: 'ไม่เห็นด้วยอย่างยิ่ง',
          progressLabel: 'ความคืบหน้าการตอบแบบสอบถาม',
          additionalSection: 'ข้อเสนอแนะและข้อคิดเห็นเพิ่มเติม',
          commentsLabel: 'ภาพรวมประสบการณ์',
          commentsPlaceholder: 'กรุณาแบ่งปันความคิดเห็นเกี่ยวกับการเข้าร่วมประชุมในครั้งนี้...',
          suggestionsLabel: 'ข้อแนะนำเฉพาะเจาะจง',
          suggestionsPlaceholder: 'หัวข้อหรือส่วนงานใดที่คุณต้องการให้ปรับปรุงในปีหน้า?',
          mostInterestingLabel: 'หัวข้อการบรรยาย / วิทยากรที่น่าสนใจที่สุด',
          mostInterestingPlaceholder: 'วิทยากรหรือหัวข้อใดที่โดดเด่นและคุณชื่นชอบมากที่สุด?',
          improvementLabel: 'สิ่งที่ควรปรับปรุงแก้ไข',
          improvementPlaceholder: 'มีสิ่งใดที่สามารถดำเนินการให้ดีขึ้นได้บ้าง?',
          futureTopicsLabel: 'หัวข้อที่ต้องการเรียนรู้ในอนาคต',
          futureTopicsPlaceholder: 'คุณอยากเรียนรู้อะไรเพิ่มเติมในการประชุมครั้งต่อไป?',
          updateButton: 'อัปเดตแบบสอบถาม',
          submitButton: 'ส่งแบบสอบถาม',
          viewResults: 'ดูผลประเมินของฉัน',
          loginRequiredTitle: 'จำเป็นต้องลงทะเบียนเข้าใช้งาน',
          loginRequiredDesc: 'กรุณาเข้าสู่ระบบบัญชีของคุณเพื่อทำแบบประเมินความพึงพอใจนี้',
          footerNotice: '',
          groups: {
            'Conference': 'การประชุมสัมมนา',
            'Guest Speakers': 'วิทยากรรับเชิญ',
            'Conference Environment': 'สภาพแวดล้อมการประชุม',
            'Recreational Activities': 'กิจกรรมสันทนาการ'
          }
        }
      },
      admin: {
        nav: {
          surveyCenter: 'ศูนย์จัดการแบบประเมิน'
        },
        survey: {
          tabReports: 'รายงานความพึงพอใจ',
          tabConfig: 'การตั้งค่าแบบประเมิน',
          title: 'รายงานแบบสอบถามความพึงพอใจ',
          subtitle: 'วิเคราะห์ภาพรวมคะแนนผลตอบรับและความคิดเห็นเชิงลึกของผู้เข้าร่วม',
          deleteConfirm: 'คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลผลประเมินชิ้นนี้?'
        }
      }
    }
  },
  zh: {
    translation: {
      common: {
        success: '成功',
        error: '错误',
        none: '无',
        loading: '加载中...',
        login: '登录',
        export: '导出'
      },
      custom: {
        survey: {
          title: '满意度调查',
          formTitle: '满意度评估',
          formSubtitle: '请对您的体验进行评分，并为未来的会议改进提供反馈。',
          submittedDesc: '感谢您提交评估并帮助我们改进。',
          successAlert: '您的评估已成功记录并存储。',
          completedTitle: '评估已完成！',
          editButton: '编辑我的评估',
          yourRatings: '您的评分',
          yourComments: '总体评价',
          yourSuggestions: '改进建议',
          successTitle: '提交成功！',
          successSubtitle: '您的反馈已收到并安全存储。感谢您的贡献。',
          successMessage: '感谢您的宝贵反馈！',
          scaleTitle: '评分标准',
          scale5: '非常同意',
          scale4: '同意',
          scale3: '中立',
          scale2: '不同意',
          scale1: '非常不同意',
          progressLabel: '调查进度',
          additionalSection: '其他建议和评论',
          commentsLabel: '总体体验',
          commentsPlaceholder: '请分享您对会议的想法...',
          suggestionsLabel: '具体建议',
          suggestionsPlaceholder: '明年有什么具体主题或改进吗？',
          mostInterestingLabel: '最感兴趣的分会/演讲嘉宾',
          mostInterestingPlaceholder: '哪个人或哪件事让您印象深刻？',
          improvementLabel: '需要改进的地方',
          improvementPlaceholder: '有什么可以做得更好？',
          futureTopicsLabel: '未来的主题',
          futureTopicsPlaceholder: '明年您想了解什么？',
          updateButton: '更新评估',
          submitButton: '提交评估',
          viewResults: '查看我的回答',
          loginRequiredTitle: '需要身份验证',
          loginRequiredDesc: '请登录您的账户以完成官方评估。',
          footerNotice: '',
          groups: {
            'Conference': '会议',
            'Guest Speakers': '特邀演讲嘉宾',
            'Conference Environment': '会议环境',
            'Recreational Activities': '娱乐活动'
          }
        }
      },
      admin: {
        nav: {
          surveyCenter: '调查中心'
        },
        survey: {
          tabReports: '满意度报告',
          tabConfig: '配置',
          title: '满意度报告',
          subtitle: '分析汇总反馈和定性意见。',
          deleteConfirm: '您确定要删除此调查答复吗？'
        }
      }
    }
  },
  es: {
    translation: {
      common: {
        success: 'Éxito',
        error: 'Error',
        none: 'Ninguno',
        loading: 'Cargando...',
        login: 'Iniciar Sesión',
        export: 'Exportar'
      },
      custom: {
        survey: {
          title: 'Encuesta de Satisfacción',
          formTitle: 'Evaluación de Satisfacción',
          formSubtitle: 'Por favor califique su experiencia y envíe sus comentarios para futuras mejoras de la conferencia.',
          submittedDesc: 'Gracias por enviar su evaluación y ayudarnos a mejorar.',
          successAlert: 'Su evaluación ha sido registrada y almacenada correctamente.',
          completedTitle: '¡Evaluación Completada!',
          editButton: 'Editar mi evaluación',
          yourRatings: 'Sus calificaciones',
          yourComments: 'Comentarios generales',
          yourSuggestions: 'Sugerencias de mejora',
          successTitle: '¡Envío Exitoso!',
          successSubtitle: 'Sus comentarios han sido recibidos y guardados de forma segura. Agradecemos su contribución.',
          successMessage: '¡Gracias por sus valiosos comentarios!',
          scaleTitle: 'Escala de Calificación',
          scale5: 'Totalmente de acuerdo',
          scale4: 'De acuerdo',
          scale3: 'Neutro',
          scale2: 'En desacuerdo',
          scale1: 'Totalmente en desacuerdo',
          progressLabel: 'Progreso de la encuesta',
          additionalSection: 'Sugerencias y comentarios adicionales',
          commentsLabel: 'Experiencia general',
          commentsPlaceholder: 'Por favor comparta sus impresiones sobre la conferencia...',
          suggestionsLabel: 'Sugerencias específicas',
          suggestionsPlaceholder: '¿Algún tema específico o mejora para el próximo año?',
          mostInterestingLabel: 'Sesión/Orador más interesante',
          mostInterestingPlaceholder: '¿Quién o qué le llamó la atención?',
          improvementLabel: 'Áreas de mejora',
          improvementPlaceholder: '¿Qué se podría hacer mejor?',
          futureTopicsLabel: 'Temas futuros',
          futureTopicsPlaceholder: '¿Qué le gustaría aprender el próximo año?',
          updateButton: 'Actualizar evaluación',
          submitButton: 'Enviar evaluación',
          viewResults: 'Ver mi respuesta',
          loginRequiredTitle: 'Autenticación requerida',
          loginRequiredDesc: 'Inicie sesión en su cuenta para completar la evaluación oficial.',
          footerNotice: '',
          groups: {
            'Conference': 'Conferencia',
            'Guest Speakers': 'Oradores Invitados',
            'Conference Environment': 'Entorno de la Conferencia',
            'Recreational Activities': 'Actividades Recreativas'
          }
        }
      },
      admin: {
        nav: {
          surveyCenter: 'Centro de Encuestas'
        },
        survey: {
          tabReports: 'Informes de Satisfacción',
          tabConfig: 'Configuración',
          title: 'Informes de Satisfacción',
          subtitle: 'Analizar comentarios agregados y observaciones cualitativas.',
          deleteConfirm: '¿Está seguro de que desea eliminar esta respuesta de la encuesta?'
        }
      }
    }
  },
  ar: {
    translation: {
      common: {
        success: 'نجاح',
        error: 'خطأ',
        none: 'لا يوجد',
        loading: 'جاري التحميل...',
        login: 'تسجيل الدخول',
        export: 'تصدير'
      },
      custom: {
        survey: {
          title: 'استطلاع الرضا',
          formTitle: 'تقييم الرضا',
          formSubtitle: 'يرجى تقييم تجربتك وتقديم ملاحظات لتحسين المؤتمرات المستقبلية.',
          submittedDesc: 'شكرًا لتقديم تقييمك ومساعدتنا في التحسين.',
          successAlert: 'تم تسجيل تقييمك وحفظه بنجاح.',
          completedTitle: 'اكتمل التقييم!',
          editButton: 'تعديل تقييمي',
          yourRatings: 'تقييماتك',
          yourComments: 'تعليقات عامة',
          yourSuggestions: 'مقترحات للتحسين',
          successTitle: 'تم الإرسال بنجاح!',
          successSubtitle: 'تم استلام ملاحظاتك وحفظها بشكل آمن. نحن نقدر مساهمتك.',
          successMessage: 'شكرًا لملاحظاتك القيمة!',
          scaleTitle: 'مقياس التقييم',
          scale5: 'أوافق بشدة',
          scale4: 'أوافق',
          scale3: 'محايد',
          scale2: 'لا أوافق',
          scale1: 'لا أوافق بشدة',
          progressLabel: 'تقدم الاستطلاع',
          additionalSection: 'مقترحات وتعليقات إضافية',
          commentsLabel: 'التجربة العامة',
          commentsPlaceholder: 'يرجى مشاركة أفكارك حول المؤتمر...',
          suggestionsLabel: 'مقترحات محددة',
          suggestionsPlaceholder: 'أي مواضيع أو تحسينات محددة للعام المقبل؟',
          mostInterestingLabel: 'الجلسة/المتحدث الأكثر إثارة للاهتمام',
          mostInterestingPlaceholder: 'من أو ما الذي لفت انتباهك؟',
          improvementLabel: 'مجالات التحسين',
          improvementPlaceholder: 'ما الذي يمكن تحسينه؟',
          futureTopicsLabel: 'المواضيع المستقبلية',
          futureTopicsPlaceholder: 'ماذا ترغب في تعلمه في العام المقبل؟',
          updateButton: 'تحديث التقييم',
          submitButton: 'إرسال التقييم',
          viewResults: 'عرض إجابتي',
          loginRequiredTitle: 'مطلوب المصادقة',
          loginRequiredDesc: 'يرجى تسجيل الدخول إلى حسابك لإكمال التقييم الرسمي.',
          footerNotice: '',
          groups: {
            'Conference': 'المؤتمر',
            'Guest Speakers': 'المتحدثون الضيوف',
            'Conference Environment': 'بيئة المؤتمر',
            'Recreational Activities': 'الأنشطة الترفيهية'
          }
        }
      },
      admin: {
        nav: {
          surveyCenter: 'مركز الاستطلاعات'
        },
        survey: {
          tabReports: 'تقارير الرضا',
          tabConfig: 'التكوين',
          title: 'تقارير الرضا',
          subtitle: 'تحليل الملاحظات الإجمالية والتعليقات النوعية.',
          deleteConfirm: 'هل أنت متأكد أنك تريد حذف رد الاستطلاع هذا؟'
        }
      }
    }
  },
  ru: {
    translation: {
      common: {
        success: 'Успешно',
        error: 'Ошибка',
        none: 'Нет',
        loading: 'Загрузка...',
        login: 'Войти',
        export: 'Экспорт'
      },
      custom: {
        survey: {
          title: 'Опрос об удовлетворенности',
          formTitle: 'Оценка удовлетворенности',
          formSubtitle: 'Пожалуйста, оцените ваш опыт и оставьте отзыв для улучшения будущих конференций.',
          submittedDesc: 'Благодарим вас за отправку оценки и помощь в улучшении.',
          successAlert: 'Ваша оценка была успешно зарегистрирована и сохранена.',
          completedTitle: 'Оценка завершена!',
          editButton: 'Редактировать мою оценку',
          yourRatings: 'Ваши оценки',
          yourComments: 'Общие комментарии',
          yourSuggestions: 'Предложения по улучшению',
          successTitle: 'Отправка успешна!',
          successSubtitle: 'Ваш отзыв получен и надежно сохранен. Мы ценим ваш вклад.',
          successMessage: 'Спасибо за ваш ценный отзыв!',
          scaleTitle: 'Шкала оценок',
          scale5: 'Полностью согласен',
          scale4: 'Согласен',
          scale3: 'Нейтрально',
          scale2: 'Не согласен',
          scale1: 'Полностью не согласен',
          progressLabel: 'Прогресс опроса',
          additionalSection: 'Дополнительные предложения и комментарии',
          commentsLabel: 'Общий опыт',
          commentsPlaceholder: 'Пожалуйста, поделитесь вашими мыслями о конференции...',
          suggestionsLabel: 'Конкретные предложения',
          suggestionsPlaceholder: 'Какие-то конкретные темы или улучшения на следующий год?',
          mostInterestingLabel: 'Самая интересная сессия/докладчик',
          mostInterestingPlaceholder: 'Кто или что вам больше всего запомнилось?',
          improvementLabel: 'Области для улучшения',
          improvementPlaceholder: 'Что можно сделать лучше?',
          futureTopicsLabel: 'Будущие темы',
          futureTopicsPlaceholder: 'Чему бы вы хотели научиться в следующем году?',
          updateButton: 'Обновить оценку',
          submitButton: 'Отправить оценку',
          viewResults: 'Посмотреть мой ответ',
          loginRequiredTitle: 'Требуется авторизация',
          loginRequiredDesc: 'Пожалуйста, войдите в свой аккаунт для прохождения официальной оценки.',
          footerNotice: '',
          groups: {
            'Conference': 'Конференция',
            'Guest Speakers': 'Приглашенные спикеры',
            'Conference Environment': 'Окружение конференции',
            'Recreational Activities': 'Развлекательные мероприятия'
          }
        }
      },
      admin: {
        nav: {
          surveyCenter: 'Центр опросов'
        },
        survey: {
          tabReports: 'Отчеты об удовлетворенности',
          tabConfig: 'Конфигурация',
          title: 'Отчеты об удовлетворенности',
          subtitle: 'Анализ сводных отзывов и качественных комментариев.',
          deleteConfirm: 'Вы уверены, что хотите удалить этот ответ на опрос?'
        }
      }
    }
  },
  fr: {
    translation: {
      common: {
        success: 'Succès',
        error: 'Erreur',
        none: 'Aucun',
        loading: 'Chargement...',
        login: 'Connexion',
        export: 'Exporter'
      },
      custom: {
        survey: {
          title: 'Enquête de Satisfaction',
          formTitle: 'Évaluation de la Satisfaction',
          formSubtitle: 'Veuillez évaluer votre expérience et faire part de vos commentaires pour améliorer les futures conférences.',
          submittedDesc: 'Merci d\'avoir soumis votre évaluation et de nous aider à nous améliorer.',
          successAlert: 'Votre évaluation a été enregistrée et stockée avec succès.',
          completedTitle: 'Évaluation terminée !',
          editButton: 'Modifier mon évaluation',
          yourRatings: 'Vos notes',
          yourComments: 'Commentaires généraux',
          yourSuggestions: 'Suggestions d\'amélioration',
          successTitle: 'Soumission réussie !',
          successSubtitle: 'Vos commentaires ont bien été reçus et stockés en toute sécurité. Nous apprécions votre contribution.',
          successMessage: 'Merci pour vos précieux commentaires !',
          scaleTitle: 'Échelle d\'évaluation',
          scale5: 'Tout à fait d\'accord',
          scale4: 'D\'accord',
          scale3: 'Neutre',
          scale2: 'Pas d\'accord',
          scale1: 'Tout à fait désaccord',
          progressLabel: 'Progression de l\'enquête',
          additionalSection: 'Suggestions et commentaires supplémentaires',
          commentsLabel: 'Expérience globale',
          commentsPlaceholder: 'Veuillez partager vos réflexions sur la conférence...',
          suggestionsLabel: 'Suggestions spécifiques',
          suggestionsPlaceholder: 'Des sujets ou des améliorations spécifiques pour l\'année prochaine ?',
          mostInterestingLabel: 'Session/Conférencier le plus intéressant',
          mostInterestingPlaceholder: 'Qui ou quoi a retenu votre attention ?',
          improvementLabel: 'Domaines d\'amélioration',
          improvementPlaceholder: 'Qu\'est-ce qui pourrait être amélioré ?',
          futureTopicsLabel: 'Sujets futurs',
          futureTopicsPlaceholder: 'Que aimeriez-vous apprendre l\'année prochaine ?',
          updateButton: 'Mettre à jour l\'évaluation',
          submitButton: 'Soumettre l\'évaluation',
          viewResults: 'Voir ma réponse',
          loginRequiredTitle: 'Authentification requise',
          loginRequiredDesc: 'Veuillez vous connecter à votre compte pour remplir l\'évaluation officielle.',
          footerNotice: '',
          groups: {
            'Conference': 'Conférence',
            'Guest Speakers': 'Conférenciers Invités',
            'Conference Environment': 'Environnement de la Conférence',
            'Recreational Activities': 'Activités Récréatives'
          }
        }
      },
      admin: {
        nav: {
          surveyCenter: 'Centre d\'enquêtes'
        },
        survey: {
          tabReports: 'Rapports de satisfaction',
          tabConfig: 'Configuration',
          title: 'Rapports de satisfaction',
          subtitle: 'Analyser les commentaires globaux et les remarques qualitatives.',
          deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cette réponse ?'
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: supportedLanguages,
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'standalone_survey_lang',
    },
  });

i18n.on('languageChanged', (lng) => {
  const currentLang = lng?.substring(0, 2) || 'en';
  const isRTL = languageNames[currentLang]?.isRTL || false;
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = currentLang;
});

export default i18n;
