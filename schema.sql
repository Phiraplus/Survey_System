-- ==========================================================================
-- SQL Schema Setup for Supabase / PostgreSQL (Survey System Backend)
-- Copy-paste this script directly into your Supabase SQL Editor.
-- ==========================================================================

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.system_config (
    key text PRIMARY KEY,
    value jsonb NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.users (
    uid text PRIMARY KEY,
    email text NOT NULL,
    first_name text,
    last_name text,
    role text DEFAULT 'attendee'::text,
    admin_passcode text DEFAULT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.surveys (
    uid text PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    country text,
    ratings jsonb DEFAULT '{}'::jsonb,
    comments text,
    suggestions text,
    most_interesting_session text,
    improvement_areas text,
    future_topics text,
    text_answers jsonb DEFAULT '{}'::jsonb,
    submitted_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;

-- 3. Row Level Security Policies

-- System Config Table Policies
-- Allow anyone (public/anon) to read the survey questions config
CREATE POLICY "Allow public read of survey questions" ON public.system_config
    FOR SELECT USING (key = 'survey_questions');

-- Disallow public read of admin passcode (Only database queries or auth adapter checks can read)
CREATE POLICY "Block public read of admin passcode" ON public.system_config
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.uid = auth.uid() AND (users.role = 'admin' OR users.role = 'superadmin')
        )
    );

-- Allow admins to insert or update configurations
CREATE POLICY "Allow admin to manage config" ON public.system_config
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.uid = auth.uid() AND (users.role = 'admin' OR users.role = 'superadmin')
        )
    );

-- Users Table Policies
-- Allow users to read their own profile
CREATE POLICY "Allow users to read own profile" ON public.users
    FOR SELECT TO authenticated USING (auth.uid() = uid);

-- Allow admins to read all user profiles
CREATE POLICY "Allow admins to read all profiles" ON public.users
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.uid = auth.uid() AND (users.role = 'admin' OR users.role = 'superadmin')
        )
    );

-- Allow authenticated users to insert their own profile during signup
CREATE POLICY "Allow profile creation on signup" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = uid);

-- Allow users to update their own profile details
CREATE POLICY "Allow profile updates by owner" ON public.users
    FOR UPDATE USING (auth.uid() = uid);

-- Surveys Table Policies
-- Allow anyone (including anonymous survey submitters) to insert survey responses
CREATE POLICY "Allow public survey submissions" ON public.surveys
    FOR INSERT WITH CHECK (true);

-- Allow owners to view their submitted survey (if matching email)
CREATE POLICY "Allow view of own survey" ON public.surveys
    FOR SELECT USING (email = auth.jwt()->>'email');

-- Allow admins to view, edit, and delete all surveys
CREATE POLICY "Allow admin full access to surveys" ON public.surveys
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.uid = auth.uid() AND (users.role = 'admin' OR users.role = 'superadmin')
        )
    );

-- 4. Database triggers for role validation (Prevents Privilege Escalation)
CREATE OR REPLACE FUNCTION public.check_user_registration()
RETURNS TRIGGER AS $$
DECLARE
    db_passcode text;
BEGIN
    -- Force role to attendee by default if not specified
    IF NEW.role IS NULL THEN
        NEW.role := 'attendee';
    END IF;

    -- If attempting to register as admin or superadmin
    IF NEW.role = 'admin' OR NEW.role = 'superadmin' THEN
        -- Get the current admin passcode from system_config
        SELECT value->>'passcode' INTO db_passcode 
        FROM public.system_config 
        WHERE key = 'admin_passcode';

        -- Fallback to default if not seeded yet
        IF db_passcode IS NULL THEN
            db_passcode := 'SurveyAdmin2026';
        END IF;

        -- Verify passcode
        IF NEW.admin_passcode IS NULL OR NEW.admin_passcode <> db_passcode THEN
            RAISE EXCEPTION 'Invalid Admin Registration Passcode.';
        END IF;
    END IF;

    -- Clear the transient passcode so it is never saved to the table
    NEW.admin_passcode := NULL;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.check_user_update()
RETURNS TRIGGER AS $$
DECLARE
    is_requester_admin boolean;
BEGIN
    -- Check if role is being changed to admin or superadmin
    IF NEW.role <> OLD.role AND (NEW.role = 'admin' OR NEW.role = 'superadmin') THEN
        -- Only existing admins can promote someone to admin
        SELECT EXISTS (
            SELECT 1 FROM public.users
            WHERE uid = auth.uid() AND (role = 'admin' OR role = 'superadmin')
        ) INTO is_requester_admin;

        IF NOT is_requester_admin THEN
            RAISE EXCEPTION 'Access Denied: Cannot modify roles without administrator privileges.';
        END IF;
    END IF;
    
    -- Clear the transient passcode
    NEW.admin_passcode := NULL;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind the triggers to public.users
CREATE TRIGGER tr_check_user_registration
    BEFORE INSERT ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.check_user_registration();

CREATE TRIGGER tr_check_user_update
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.check_user_update();

-- 5. Seed Default Data (Admin Passcode & Survey Questions)
INSERT INTO public.system_config (key, value)
VALUES (
    'admin_passcode',
    '{"passcode": "SurveyAdmin2026"}'::jsonb
)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.system_config (key, value)
VALUES (
    'survey_questions',
    '{
        "questions": [
            { "id": "conferenceQ1", "group": "Conference", "emoji": "🎯", "order": 1, "label": { "en": "1. The subjects discussed during the conference appropriately addressed my needs and interests.", "th": "1. หัวข้อที่พูดคุยในระหว่างการประชุมตรงกับความต้องการและความสนใจของฉัน" } },
            { "id": "conferenceQ2", "group": "Conference", "emoji": "⏱️", "order": 2, "label": { "en": "2. The conference was contemporary and effectively addressed current crime and technological trends (e.g., AI systems, Scam Centers, and Drones).", "th": "2. การประชุมมีความทันสมัยและตอบสนองต่อแนวโน้มอาชญากรรมและเทคโนโลยีในปัจจุบันได้อย่างมีประสิทธิภาพ (เช่น ระบบ AI, ศูนย์แก๊งคอลเซ็นเตอร์ และโดรน)" } },
            { "id": "conferenceQ3", "group": "Conference", "emoji": "💼", "order": 3, "label": { "en": "3. The information and experience obtained from the conference will be helpful and can be practically applied to your work.", "th": "3. ข้อมูลและประสบการณ์ที่ได้รับจากการประชุมจะเป็นประโยชน์และสามารถนำไปประยุกต์ใช้ในการทำงานจริงของคุณได้" } },
            { "id": "conferenceQ4", "group": "Conference", "emoji": "🗣️", "order": 4, "label": { "en": "4. The overall length of the conference and the time allocated for each session were adequate and suitable.", "th": "4. ระยะเวลาโดยรวมของการประชุมและเวลาที่จัดสรรสำหรับแต่ละเซสชันมีความเพียงพอและเหมาะสม" } },
            { "id": "conferenceQ5", "group": "Conference", "emoji": "📝", "order": 5, "label": { "en": "5. The scheduling and frequency of the short-duration knowledge sessions (Step Talk) integrated throughout the days were appropriate and beneficial.", "th": "5. การจัดตารางเวลาและความถี่ของเซสชันความรู้ระยะสั้น (Step Talk) ที่บูรณาการตลอดทั้งวันมีความเหมาะสมและเป็นประโยชน์" } },
            { "id": "speakersQ1", "group": "Guest Speakers", "emoji": "📙", "order": 6, "label": { "en": "6. The guest speakers and panelists were knowledgeable and experienced in the subject matters.", "th": "6. วิทยากรรับเชิญและผู้ร่วมเสวนาความรู้และประสบการณ์ในหัวข้อการบรรยาย" } },
            { "id": "speakersQ2", "group": "Guest Speakers", "emoji": "📝", "order": 7, "label": { "en": "7. The content was highly relevant and immediately applicable.", "th": "7. เนื้อหามีความเกี่ยวข้องเป็นอย่างยิ่งและสามารถนำไปประยุกต์ใช้ได้ทันที" } },
            { "id": "speakersQ3", "group": "Guest Speakers", "emoji": "🗣️", "order": 8, "label": { "en": "8. The speakers provide useful insights or actionable takeaways.", "th": "8. วิทยากรให้ข้อมูลเชิงลึกที่เป็นประโยชน์หรือประเด็นสำคัญที่นำไปปฏิบัติได้จริง" } },
            { "id": "speakersQ4", "group": "Guest Speakers", "emoji": "🎤", "order": 9, "label": { "en": "9. The guest speakers presented clearly and actively opened the floor for participants to ask questions or exchange ideas.", "th": "9. วิทยากรรับเชิญนำเสนอได้อย่างชัดเจน และเปิดโอกาสให้ผู้เข้าร่วมซักถามหรือแลกเปลี่ยนความคิดเห็นอย่างกระตือรือร้น" } },
            { "id": "environmentQ1", "group": "Conference Environment", "emoji": "🏢", "order": 10, "label": { "en": "10. The conference facilities and audio-visual equipment (sound system, screens) in the meeting room were of good quality and ready to use.", "th": "10. สิ่งอำนวยความสะดวกในการประชุมและอุปกรณ์โสตทัศนูปกรณ์ (ระบบเสียง, หน้าจอ) ในห้องประชุมมีคุณภาพดีและพร้อมใช้งาน" } },
            { "id": "environmentQ2", "group": "Conference Environment", "emoji": "🎩", "order": 11, "label": { "en": "11. The staff and team members were polite, enthusiastic, and always available to provide assistance throughout the event.", "th": "11. เจ้าหน้าที่และสมาชิกในทีมมีความสุภาพ กระตือรือร้น และพร้อมให้ความช่วยเหลือตลอดการจัดงาน" } },
            { "id": "environmentQ3", "group": "Conference Environment", "emoji": "👥", "order": 12, "label": { "en": "12. The pre-conference communication, presentation materials, and guidelines for daily dress codes (Dress Code) were clear and well-coordinated.", "th": "12. การติดต่อสื่อสารก่อนการประชุม เอกสารประกอบการนำเสนอ และแนวทางปฏิบัติสำหรับเครื่องแต่งกายประจำวัน (Dress Code) มีความชัดเจนและประสานงานกันเป็นอย่างดี" } },
            { "id": "activitiesQ1", "group": "Recreational Activities", "emoji": "🚔", "order": 13, "label": { "en": "13. The welcoming reception (Host Night at the Royal Thai Police) offered an excellent atmosphere and high-quality hospitality.", "th": "13. งานเลี้ยงต้อนรับ (Host Night ที่สำนักงานตำรวจแห่งชาติ) มีบรรยากาศที่ยอดเยี่ยมและการต้อนรับที่มีคุณภาพสูง" } },
            { "id": "activitiesQ2", "group": "Recreational Activities", "emoji": "🎉", "order": 14, "label": { "en": "14. The Opening Ceremony was honorable, prestigious, and highly impressive.", "th": "14. พิธีเปิดมีความสมเกียรติ ทรงเกียรติ และน่าประทับใจเป็นอย่างยิ่ง" } },
            { "id": "activitiesQ3", "group": "Recreational Activities", "emoji": "🍝", "order": 15, "label": { "en": "15. The Cultural Dinner (on the Wonderful Pearl Cruise) and the Farewell Dinner (at Grande Centre Point Lumpini) offered an excellent atmosphere and high-quality organization.", "th": "15. งานเลี้ยงอาหารค่ำทางวัฒนธรรม (บนเรือวันเดอร์ฟูล เพิร์ล ครูซ) และงานเลี้ยงอำลา (ที่โรงแรม แกรนด์ เซนเตอร์ พอยต์ ลุมพินี) มีบรรยากาศที่ยอดเยี่ยมและจัดงานได้อย่างมีคุณภาพสูง" } },
            { "id": "activitiesQ4", "group": "Recreational Activities", "emoji": "⏰", "order": 16, "label": { "en": "16. The \"Yellow Brick Experience\" at Lumpini Park provided an appropriate group activity format that successfully fostered team-building and solidarity.", "th": "16. กิจกรรม \"Yellow Brick Experience\" ที่สวนลุมพินี มีรูปแบบกิจกรรมกลุ่มที่เหมาะสม ซึ่งประสบความสำเร็จในการส่งเสริมการสร้างทีมและความสามัคคี" } },
            { "id": "activitiesQ5", "group": "Recreational Activities", "emoji": "🌏", "order": 17, "label": { "en": "17. The Closing Ceremony was well-organized, meaningful, and provided a memorable conclusion to the conference.", "th": "17. พิธีปิดมีการจัดงานที่ดี มีความหมาย และเป็นการจบการประชุมที่น่าจดจำ" } },
            { "id": "activitiesQ6", "group": "Recreational Activities", "emoji": "📝", "order": 18, "label": { "en": "18. The Farewell Dinner was well-organized, enjoyable, and served as a highly satisfactory closing to the program.", "th": "18. งานเลี้ยงอำลาจัดงานได้เป็นอย่างดี สนุกสนาน และเป็นการปิดท้ายโครงการที่น่าพึงพอใจเป็นอย่างยิ่ง" } },
            { "id": "activitiesQ7", "group": "Recreational Activities", "emoji": "🏨", "order": 19, "label": { "en": "19. The overall social and recreational programs effectively provided opportunities to establish international cooperation and build networking between participants.", "th": "19. โปรแกรมทางสังคมและสันทนาการโดยรวมช่วยสร้างโอกาสในการจัดตั้งความร่วมมือระหว่างประเทศและสร้างเครือข่ายระหว่างผู้เข้าร่วมได้อย่างมีประสิทธิภาพ" }
        ],
        "textQuestions": [
            { "id": "comments", "group": "Comments", "emoji": "💬", "order": 1, "label": { "en": "Overall Experience", "th": "ความคิดเห็นและภาพรวม" } },
            { "id": "suggestions", "group": "Comments", "emoji": "💡", "order": 2, "label": { "en": "Specific Suggestions", "th": "ข้อเสนอแนะเฉพาะเจาะจง" } },
            { "id": "mostInterestingSession", "group: "Comments", "emoji": "🎤", "order": 3, "label": { "en": "Most Interesting Session/Speaker", "th": "หัวข้อ/วิทยากรที่น่าสนใจที่สุด" } },
            { "id": "improvementAreas", "group": "Comments", "emoji": "🛠️", "order": 4, "label": { "en": "Areas for Improvement", "th": "สิ่งที่ควรปรับปรุง" } },
            { "id": "futureTopics", "group": "Comments", "emoji": "🔮", "order": 5, "label": { "en": "Future Topics", "th": "หัวข้อที่สนใจในอนาคต" } }
        ],
        "logoEmoji": "📝",
        "logoText": "Survey System",
        "showLogo": true,
        "headerTitle": "Satisfaction Evaluation",
        "showHeaderTitle": true,
        "allowedLanguages": ["en", "zh", "es", "ar", "ru", "fr", "th"]
    }'::jsonb
)
ON CONFLICT (key) DO NOTHING;
