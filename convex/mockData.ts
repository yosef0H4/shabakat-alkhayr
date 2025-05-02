// convex/mockData.ts

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getAuth } from "./auth";

// Import the Arabic mock data
const ARABIC_MOCK_DATA = {
  "posts": [
    {
      "type": "helpNeeded",
      "title": "مساعدة في نقل أثاث منزلي",
      "description": "أنا رجل مسن (75 سنة) وأحتاج إلى مساعدة في نقل بعض قطع الأثاث من منزلي القديم إلى شقتي الجديدة في حي النزهة. لا أستطيع رفع الأشياء الثقيلة بمفردي ولا أملك المال الكافي لاستئجار شركة نقل. أي مساعدة من شباب الحي ستكون محل تقدير كبير.\n\n**ما أحتاجه**: 3-4 أشخاص لمدة ساعتين يوم الجمعة القادم بعد صلاة الجمعة\n\n*جزاكم الله خيراً*",
      "location": "حي النزهة، الرياض، المملكة العربية السعودية",
      "contactInfo": "أبو محمد: 0555123456",
      "tags": ["نقل أثاث", "مساعدة كبار السن", "تطوع", "الرياض"],
      "username": "أبو محمد الحربي",
      "userAvatar": "https://ui-avatars.com/api/?name=أبو+محمد&background=random",
      "isCompleted": false,
      "likedByUsers": ["user123", "user456"],
      "_creationTime": 1714500000000,
      "images": [
        "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop"
      ]
    },
    {
      "type": "helpNeeded",
      "title": "نحتاج متطوعين لتركيب مكيف في مسجد الرحمن",
      "description": "مسجد الرحمن في حي السلامة يحتاج إلى تركيب مكيفات جديدة قبل شهر رمضان المبارك. المكيفات متوفرة بفضل الله ولكن نحتاج إلى متطوعين لديهم خبرة في التركيب.\n\n**المطلوب**:\n- شخص أو شخصين لديهم خبرة في تركيب المكيفات\n- أدوات التركيب متوفرة في المسجد\n- العمل سيكون يوم السبت القادم بعد صلاة العصر\n\n*في ميزان حسناتكم إن شاء الله*",
      "location": "حي السلامة، جدة، المملكة العربية السعودية",
      "contactInfo": "إمام المسجد: 0532156789 أو التواصل مع إدارة المسجد بعد الصلوات",
      "tags": ["مسجد", "تركيب مكيفات", "رمضان", "جدة", "متطوعين"],
      "username": "إدارة مسجد الرحمن",
      "userAvatar": "https://ui-avatars.com/api/?name=مسجد+الرحمن&background=random",
      "isCompleted": false,
      "likedByUsers": ["user789", "user101", "user202"],
      "_creationTime": 1714540000000,
      "images": [
        "https://images.unsplash.com/photo-1545127398-14699f92334b?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519817914152-22d216bb9170?q=80&w=1000&auto=format&fit=crop"
      ]
    },
    {
      "type": "helpNeeded",
      "title": "مساعدة في توزيع سلال غذائية للعائلات المتعففة",
      "description": "نحتاج متطوعين للمساعدة في تجهيز وتوزيع 50 سلة غذائية للعائلات المتعففة في منطقة المشرف. العمل سيكون على مرحلتين:\n\n1. **تجهيز السلال**: يوم الخميس من العصر حتى المغرب\n2. **توزيع السلال**: يوم الجمعة بعد صلاة الجمعة\n\nالسيارات متوفرة، نحتاج فقط أيدي مساعدة للتحميل والتوزيع. هذا العمل يتكرر شهرياً، فنرحب بالمتطوعين الدائمين.\n\n*\"من فرج عن مسلم كربة من كرب الدنيا، فرج الله عنه كربة من كرب يوم القيامة\"*",
      "location": "حي المشرف، الدمام، المملكة العربية السعودية",
      "contactInfo": "جمعية البر الخيرية: 013876543 أو التواصل مع الأخ فهد: 0558769800",
      "tags": ["سلال غذائية", "متعففين", "توزيع", "تطوع", "الدمام"],
      "username": "جمعية البر الخيرية",
      "userAvatar": "https://ui-avatars.com/api/?name=جمعية+البر&background=random",
      "isCompleted": false,
      "likedByUsers": ["user303", "user404", "user505"],
      "_creationTime": 1714580000000,
      "images": [
        "https://images.unsplash.com/photo-1607113281875-39e5a5d4db8f?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop"
      ]
    },
    {
      "type": "helpNeeded",
      "title": "بحاجة لمساعدة في إصلاح تسرب المياه",
      "description": "أنا أم لثلاثة أطفال وزوجي مسافر للعمل. لدينا تسرب مياه في المطبخ تحت الحوض ولا أعرف كيفية إصلاحه. المياه تتسرب ببطء وأخشى أن تسبب أضراراً أكبر في المنزل.\n\nأحتاج شخصاً يعرف كيفية إصلاح التسرب. سأدفع ثمن أي قطع غيار مطلوبة، لكنني لا أستطيع دفع أجرة سباك محترف حالياً.\n\n**متى**: في أقرب وقت ممكن، أي وقت خلال النهار مناسب لي.\n\n*شكراً جزيلاً*",
      "location": "حي الخالدية، المدينة المنورة، المملكة العربية السعودية",
      "contactInfo": "أم سارة: 0544321098",
      "tags": ["إصلاح منزلي", "تسرب مياه", "مساعدة", "المدينة المنورة"],
      "username": "أم سارة",
      "userAvatar": "https://ui-avatars.com/api/?name=أم+سارة&background=random",
      "isCompleted": false,
      "likedByUsers": ["user606", "user707"],
      "_creationTime": 1714620000000,
      "images": [
        "https://images.unsplash.com/photo-1585704032915-c3400417d7cb?q=80&w=1000&auto=format&fit=crop"
      ]
    },
    {
      "type": "helpNeeded",
      "title": "إعادة طلاء مركز لذوي الاحتياجات الخاصة",
      "description": "مركز الأمل لذوي الاحتياجات الخاصة يحتاج إلى طلاء جديد للجدران الخارجية. نبحث عن متطوعين للمساعدة في طلاء المركز خلال عطلة نهاية الأسبوع القادم.\n\n**المطلوب**:\n- 8-10 متطوعين\n- يومي الجمعة والسبت من الساعة 9 صباحاً حتى 3 عصراً\n- الطلاء والأدوات متوفرة، نحتاج فقط لأيدٍ مساعدة\n- سيتم توفير وجبات خفيفة ومشروبات للمتطوعين\n\n*\"خيركم من تعلم القرآن وعلمه\"*",
      "location": "حي النسيم، مكة المكرمة، المملكة العربية السعودية",
      "contactInfo": "مدير المركز: 012543789 أو التواصل عبر البريد الإلكتروني: alamal@example.com",
      "tags": ["ذوي الاحتياجات الخاصة", "طلاء", "تطوع", "مكة", "عمل جماعي"],
      "username": "مركز الأمل",
      "userAvatar": "https://ui-avatars.com/api/?name=مركز+الأمل&background=random",
      "isCompleted": false,
      "likedByUsers": ["user808", "user909", "user111", "user222"],
      "_creationTime": 1714660000000,
      "images": [
        "https://images.unsplash.com/photo-1531685250784-7569952593d2?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1596710038488-e8294d089fed?q=80&w=1000&auto=format&fit=crop"
      ]
    },
    {
      "type": "helpOffered",
      "title": "متطوع لتعليم كبار السن استخدام الأجهزة الذكية",
      "description": "أنا خالد، خريج تقنية معلومات وأعمل في مجال الدعم الفني. أتطوع لتعليم كبار السن كيفية استخدام الهواتف الذكية والأجهزة اللوحية.\n\n**ما يمكنني تقديمه**:\n- تعليم أساسيات استخدام الهاتف/الجهاز اللوحي\n- شرح كيفية استخدام تطبيقات التواصل الاجتماعي\n- المساعدة في إعداد البريد الإلكتروني والحسابات الأخرى\n- شرح كيفية استخدام تطبيقات الخدمات الحكومية مثل توكلنا وأبشر\n\nأستطيع التطوع يومي الاثنين والأربعاء مساءً أو في عطلة نهاية الأسبوع.\n\n*سعيد بمساعدة إخواني وأخواتي من كبار السن*",
      "location": "حي العزيزية، الرياض، المملكة العربية السعودية",
      "contactInfo": "خالد: 0556789012 (واتساب متاح)",
      "tags": ["تعليم", "تقنية", "كبار السن", "متطوع", "الرياض"],
      "username": "خالد المطيري",
      "userAvatar": "https://ui-avatars.com/api/?name=خالد+المطيري&background=random",
      "isCompleted": false,
      "likedByUsers": ["user333", "user444", "user555"],
      "_creationTime": 1714700000000,
      "images": [
        "https://images.unsplash.com/photo-1595252129756-2e71da548085?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop"
      ]
    },
    {
      "type": "helpOffered",
      "title": "مستعد للمساعدة في أعمال النجارة البسيطة",
      "description": "أنا أحمد، أعمل نجاراً منذ 20 عاماً. مستعد للمساعدة في أعمال النجارة البسيطة للأسر المحتاجة أو المساجد أو المدارس.\n\n**ما يمكنني تقديمه**:\n- إصلاح الأثاث الخشبي المكسور\n- تركيب الأرفف والخزائن\n- إصلاح الأبواب والنوافذ الخشبية\n- تقديم المشورة في اختيار الأخشاب ومواد النجارة\n\nأستطيع العمل في أيام العطل وبعد ساعات الدوام. المواد يجب أن توفرها الجهة المحتاجة للمساعدة، ولكنني أستطيع المساعدة في الحصول عليها بأسعار مناسبة.\n\n*\"خير الناس أنفعهم للناس\"*",
      "location": "حي المروة، جدة، المملكة العربية السعودية",
      "contactInfo": "أحمد: 0537654321",
      "tags": ["نجارة", "إصلاح", "متطوع", "جدة", "أعمال يدوية"],
      "username": "أحمد النجار",
      "userAvatar": "https://ui-avatars.com/api/?name=أحمد+النجار&background=random",
      "isCompleted": false,
      "likedByUsers": ["user666", "user777", "user888"],
      "_creationTime": 1714740000000,
      "images": [
        "https://images.unsplash.com/photo-1622288432450-277d0fef9f14?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1580137189272-c9379f8864fd?q=80&w=1000&auto=format&fit=crop"
      ]
    },
    {
      "type": "helpOffered",
      "title": "خياطة ملابس للأسر المحتاجة مجاناً",
      "description": "أنا فاطمة، أعمل في الخياطة منذ 15 سنة وأرغب في التطوع لخياطة وإصلاح الملابس للأسر المحتاجة مجاناً.\n\n**ما يمكنني تقديمه**:\n- خياطة ملابس أطفال بسيطة\n- إصلاح وتعديل الملابس المستعملة\n- تقصير وتوسيع الثياب حسب الحاجة\n- تعليم أساسيات الخياطة للمهتمات\n\nيمكنني استقبال الطلبات وتسليمها بعد الانتهاء منها خلال أيام الأسبوع. لدي ماكينة خياطة وأدوات متنوعة، والخيوط متوفرة عندي. فقط أحتاج لتوفير القماش إن كان المطلوب خياطة قطع جديدة.\n\n*\"الساعي على الأرملة والمسكين كالمجاهد في سبيل الله\"*",
      "location": "حي الخبر الشمالية، الخبر، المملكة العربية السعودية",
      "contactInfo": "فاطمة: 0567890123 (واتساب فقط من النساء)",
      "tags": ["خياطة", "ملابس", "تطوع", "أسر محتاجة", "الخبر"],
      "username": "فاطمة الخياطة",
      "userAvatar": "https://ui-avatars.com/api/?name=فاطمة+الخياطة&background=random",
      "isCompleted": false,
      "likedByUsers": ["user999", "user123", "user234"],
      "_creationTime": 1714780000000,
      "images": [
        "https://images.unsplash.com/photo-1534643151759-b2d234a98755?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1556905925-5ea0afd65de5?q=80&w=1000&auto=format&fit=crop"
      ]
    },
    {
      "type": "helpOffered",
      "title": "سائق متطوع لنقل ذوي الاحتياجات الخاصة",
      "description": "أنا عبد الله، لدي سيارة كبيرة (فان) ومستعد للتطوع في نقل ذوي الاحتياجات الخاصة إلى المستشفيات أو المراكز التأهيلية أو للنزهات.\n\n**ما يمكنني تقديمه**:\n- نقل المرضى إلى مواعيدهم الطبية\n- نقل ذوي الاحتياجات الخاصة إلى المراكز المتخصصة\n- مساعدة كبار السن في التنقل\n- نقل الأسر المحتاجة للتسوق الأسبوعي\n\nأنا متاح أيام الخميس والجمعة والسبت طوال اليوم، وبقية أيام الأسبوع بعد السادسة مساءً. السيارة مجهزة للكراسي المتحركة، ويمكنها استيعاب حتى 7 أشخاص.\n\n*\"من كان في حاجة أخيه كان الله في حاجته\"*",
      "location": "حي الشفا، الرياض، المملكة العربية السعودية",
      "contactInfo": "عبد الله: 0512345678 (متاح على واتساب)",
      "tags": ["نقل", "ذوي الاحتياجات الخاصة", "متطوع", "الرياض", "مواصلات"],
      "username": "عبدالله السائق",
      "userAvatar": "https://ui-avatars.com/api/?name=عبدالله+السائق&background=random",
      "isCompleted": false,
      "likedByUsers": ["user345", "user456", "user567"],
      "_creationTime": 1714820000000,
      "images": [
        "https://images.unsplash.com/photo-1600591170533-8c944f02f1b7?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1000&auto=format&fit=crop"
      ]
    },
    {
      "type": "helpOffered",
      "title": "دروس مجانية في الرياضيات والفيزياء للطلاب المحتاجين",
      "description": "أنا سارة، مدرسة رياضيات وفيزياء وأرغب في تقديم دروس مجانية للطلاب من الأسر محدودة الدخل أو المتعففة.\n\n**ما يمكنني تقديمه**:\n- دروس في الرياضيات والفيزياء للمرحلة المتوسطة والثانوية\n- مساعدة في حل الواجبات المدرسية\n- شرح المفاهيم الصعبة بطريقة مبسطة\n- التحضير للاختبارات المهمة\n\nيمكنني تقديم الدروس أونلاين عبر برنامج زوم أو في أي مكان عام كالمكتبات أو المقاهي (للطالبات فقط). أنا متاحة مساء كل يوم من الأحد إلى الخميس (بعد الساعة 4 عصراً).\n\n*\"من سلك طريقاً يلتمس فيه علماً، سهل الله له طريقاً إلى الجنة\"*",
      "location": "حي الروضة، جدة، المملكة العربية السعودية",
      "contactInfo": "سارة: 0538765432 (واتساب متاح)",
      "tags": ["تعليم", "رياضيات", "فيزياء", "دروس", "جدة"],
      "username": "سارة المعلمة",
      "userAvatar": "https://ui-avatars.com/api/?name=سارة+المعلمة&background=random",
      "isCompleted": false,
      "likedByUsers": ["user678", "user789", "user890"],
      "_creationTime": 1714860000000,
      "images": [
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1000&auto=format&fit=crop"
      ]
    },
    {
      "type": "achievement",
      "title": "إنجاز: تم تركيب مكيفات مسجد الرحمن بحمد الله",
      "description": "بفضل الله ثم بفضل المتطوعين الكرام تم تركيب المكيفات الجديدة في مسجد الرحمن بحي السلامة. تطوع الإخوة محمد وإبراهيم وعبد العزيز بوقتهم وخبرتهم، وتمكنوا من تركيب 3 مكيفات جديدة خلال يوم واحد.\n\nمتطوعون آخرون ساعدوا في حمل المكيفات ونقلها إلى الأماكن المحددة. الجميع عمل بروح الفريق الواحد.\n\nجزى الله جميع المشاركين خير الجزاء وجعل عملهم في ميزان حسناتهم.\n\n*\"من بنى مسجداً لله بنى الله له بيتاً في الجنة\"*",
      "location": "حي السلامة، جدة، المملكة العربية السعودية",
      "contactInfo": "إدارة مسجد الرحمن: 012345678",
      "tags": ["مسجد", "تركيب مكيفات", "تطوع", "جدة", "إنجاز"],
      "username": "إدارة مسجد الرحمن",
      "userAvatar": "https://ui-avatars.com/api/?name=مسجد+الرحمن&background=random",
      "isCompleted": true,
      "likedByUsers": ["user901", "user012", "user123", "user234", "user345", "user456"],
      "originalPostId": 2,
      "_creationTime": 1714900000000,
      "images": [
        "https://images.unsplash.com/photo-1594231404364-22a7d6fabf60?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1516670428252-df97bba108d1?q=80&w=1000&auto=format&fit=crop"
      ]
    },
    {
      "type": "achievement",
      "title": "إنجاز: تم إصلاح تسرب المياه لأم سارة",
      "description": "الحمد لله تمكنت من إصلاح تسرب المياه في منزل الأخت أم سارة. كان هناك مشكلة في الوصلة الرئيسية تحت الحوض وتم استبدالها بوصلة جديدة.\n\nدعت لي الأخت بالخير ولأولادي، وهذا من أعظم مكافأة يمكن الحصول عليها. سعدت كثيراً بمساعدتها وأطفالها.\n\nأشجع جميع الإخوة الذين لديهم خبرة في السباكة على مساعدة من يحتاج من جيرانهم، فهذه الأعمال البسيطة لها أثر كبير على من يحتاجها.\n\n*\"لن تنالوا البر حتى تنفقوا مما تحبون\"*",
      "location": "حي الخالدية، المدينة المنورة، المملكة العربية السعودية",
      "contactInfo": "عبد الرحمن السباك: 012355588",
      "tags": ["إصلاح منزلي", "تسرب مياه", "المدينة المنورة", "إنجاز"],
      "username": "عبد الرحمن السباك",
      "userAvatar": "https://ui-avatars.com/api/?name=عبدالرحمن+السباك&background=random",
      "isCompleted": true,
      "likedByUsers": ["user567", "user678", "user789", "user890", "user901"],
      "originalPostId": 4,
      "_creationTime": 1714940000000,
      "images": [
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000&auto=format&fit=crop"
      ]
    },
    {
      "type": "achievement",
      "title": "إنجاز: تم نقل أثاث أبو محمد بنجاح وتوصيله لمنزله الجديد",
      "description": "الحمد لله تمكنا أنا وأربعة من شباب الحي من مساعدة العم أبو محمد في نقل أثاثه إلى منزله الجديد. تطلب الأمر حوالي 3 ساعات نظراً لوجود بعض القطع الثقيلة كالثلاجة والغسالة.\n\nالعم أبو محمد من جيراننا القدامى وهو رجل طيب ساعدنا كثيراً في السابق. كان من دواعي سرورنا أن نرد له بعض جميله.\n\nقام بإعداد وجبة عشاء لنا جميعاً بعد الانتهاء من العمل، وهذا من كرمه رغم ظروفه. نسأل الله أن يوفقه في مسكنه الجديد وأن يجعله مباركاً عليه.\n\n*\"المسلم أخو المسلم، لا يظلمه ولا يسلمه\"*",
      "location": "حي النزهة، الرياض، المملكة العربية السعودية",
      "contactInfo": "بدر المطيري: 0555987654",
      "tags": ["نقل أثاث", "مساعدة كبار السن", "تطوع", "الرياض", "إنجاز"],
      "username": "بدر المطيري",
      "userAvatar": "https://ui-avatars.com/api/?name=بدر+المطيري&background=random",
      "isCompleted": true,
      "likedByUsers": ["user012", "user123", "user234", "user345", "user456", "user567", "user678"],
      "originalPostId": 1,
      "_creationTime": 1714980000000,
      "images": [
        "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1000&auto=format&fit=crop"
      ]
    }
  ],
  "replies": [
    {
      "postId": 1,
      "userId": "user123",
      "username": "فهد القحطاني",
      "userAvatar": "https://ui-avatars.com/api/?name=فهد+القحطاني&background=random",
      "text": "أنا مستعد للمساعدة يا عم أبو محمد. سأحضر معي سيارتي وصديقين آخرين للمساعدة في الحمل. هل الساعة الثانية بعد صلاة الجمعة مناسبة لك؟",
      "_creationTime": 1714510000000
    },
    {
      "postId": 1,
      "userId": "user456",
      "username": "عبدالعزيز الشمري",
      "userAvatar": "https://ui-avatars.com/api/?name=عبدالعزيز+الشمري&background=random",
      "text": "أستطيع المشاركة أيضاً. لدي خبرة في نقل الأثاث الثقيل. سأكون متاحاً يوم الجمعة بإذن الله.",
      "_creationTime": 1714520000000
    },
    {
      "postId": 2,
      "userId": "user789",
      "username": "محمد الحربي",
      "userAvatar": "https://ui-avatars.com/api/?name=محمد+الحربي&background=random",
      "text": "أنا فني تكييف ومستعد للمساعدة في تركيب المكيفات بإذن الله. هل المكيفات من النوع الشباك أم السبليت؟",
      "_creationTime": 1714550000000
    },
    {
      "postId": 2,
      "userId": "user101",
      "username": "إبراهيم الدوسري",
      "userAvatar": "https://ui-avatars.com/api/?name=إبراهيم+الدوسري&background=random",
      "text": "أستطيع المساعدة في تركيب المكيفات. أعمل في شركة تكييف منذ 5 سنوات ولدي كل الأدوات اللازمة. سأكون هناك بعد صلاة العصر يوم السبت بإذن الله.",
      "_creationTime": 1714560000000
    },
    {
      "postId": 3,
      "userId": "user202",
      "username": "خالد العتيبي",
      "userAvatar": "https://ui-avatars.com/api/?name=خالد+العتيبي&background=random",
      "text": "سأشارك في توزيع السلال يوم الجمعة بإذن الله. هل هناك مناطق محددة للتوزيع؟",
      "_creationTime": 1714590000000
    },
    {
      "postId": 4,
      "userId": "user303",
      "username": "عبد الرحمن السباك",
      "userAvatar": "https://ui-avatars.com/api/?name=عبدالرحمن+السباك&background=random",
      "text": "أخت أم سارة، أنا سباك ويمكنني المساعدة في إصلاح التسرب. سأتواصل معك هاتفياً لتحديد موعد مناسب، بإذن الله سيكون غداً إن شاء الله.",
      "_creationTime": 1714630000000
    },
    {
      "postId": 5,
      "userId": "user404",
      "username": "هاني المالكي",
      "userAvatar": "https://ui-avatars.com/api/?name=هاني+المالكي&background=random",
      "text": "أنا ومجموعة من الأصدقاء مستعدون للمشاركة في طلاء المركز. نحن 5 أشخاص ولدينا خبرة في أعمال الطلاء. سنحضر يوم الجمعة بإذن الله.",
      "_creationTime": 1714670000000
    },
    {
      "postId": 6,
      "userId": "user505",
      "username": "عبد الله الغامدي",
      "userAvatar": "https://ui-avatars.com/api/?name=عبدالله+الغامدي&background=random",
      "text": "والدي عمره 75 سنة ويريد أن يتعلم استخدام واتساب للتواصل مع أحفاده في الخارج. هل يمكنك مساعدته؟ هو متفرغ يوم الأربعاء.",
      "_creationTime": 1714710000000
    },
    {
      "postId": 7,
      "userId": "user606",
      "username": "عمر المالكي",
      "userAvatar": "https://ui-avatars.com/api/?name=عمر+المالكي&background=random",
      "text": "شكراً على هذه المبادرة الطيبة. المسجد القريب من منزلنا يحتاج لإصلاح بعض المقاعد الخشبية. هل يمكنك المساعدة في ذلك؟",
      "_creationTime": 1714750000000
    },
    {
      "postId": 8,
      "userId": "user707",
      "username": "نوال السعيد",
      "userAvatar": "https://ui-avatars.com/api/?name=نوال+السعيد&background=random",
      "text": "جزاك الله خيراً أختي فاطمة. أنا أعمل في دار للأيتام ولدينا بعض الملابس التي تحتاج لتعديل. هل يمكننا التواصل معك لترتيب ذلك؟",
      "_creationTime": 1714790000000
    },
    {
      "postId": 9,
      "userId": "user808",
      "username": "ليلى الزهراني",
      "userAvatar": "https://ui-avatars.com/api/?name=ليلى+الزهراني&background=random",
      "text": "جزاك الله خير يا أخ عبد الله. والدتي مريضة ولديها مواعيد طبية أسبوعية في مستشفى الملك فهد. هل يمكنك مساعدتنا في نقلها؟",
      "_creationTime": 1714830000000
    },
    {
      "postId": 10,
      "userId": "user909",
      "username": "منى العنزي",
      "userAvatar": "https://ui-avatars.com/api/?name=منى+العنزي&background=random",
      "text": "ابنتي في الثانوية العامة وتحتاج مساعدة في مادة الفيزياء. هل يمكننا الاستفادة من دروسك؟ هي متفرغة مساء الثلاثاء والخميس.",
      "_creationTime": 1714870000000
    },
    {
      "postId": 11,
      "userId": "user111",
      "username": "عبد العزيز المحمود",
      "userAvatar": "https://ui-avatars.com/api/?name=عبدالعزيز+المحمود&background=random",
      "text": "بارك الله فيكم على هذا العمل الطيب. أفرحنا كثيراً أن نرى المسجد بهذا الشكل الجميل مع المكيفات الجديدة. تقبل الله منكم.",
      "_creationTime": 1714910000000
    }
  ]
};

/**
 * Utility to tag imported content for easy identification and removal
 */
const MOCK_DATA_TAG = "arabic_mock_data";

/**
 * Query to get the status of Arabic mock data in the database
 */
export const getDataStatus = query({
  handler: async (ctx) => {
    // Get counts of Arabic posts (tagged with MOCK_DATA_TAG)
    // Fetch all posts (consider adding constraints if table becomes large)
    const allPosts = await ctx.db.query("posts").collect();
    // Filter in JavaScript
    const arabicPosts = allPosts.filter(post => post.tags.includes(MOCK_DATA_TAG));
    
    return {
      arabicDataCount: arabicPosts.length,
      arabicDataPresent: arabicPosts.length > 0
    };
  },
});

/**
 * Import Arabic mock data into the database
 */
export const importArabicData = mutation({
  handler: async (ctx) => {
    // Check if the user is authenticated
    const identity = await getAuth(ctx);
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    // Get current user info
    const userId = identity.subject;
    const userName = identity.name || "Anonymous User";
    const userPictureUrl = identity.pictureUrl || "";
    
    console.log("Starting Arabic mock data import");
    const postIdMap = new Map(); // Map to track post IDs
    
    // First, import all posts
    for (const post of ARABIC_MOCK_DATA.posts) {
      try {
        // Create the post with the mock data tag added to tags
        const tags = [...post.tags, MOCK_DATA_TAG];
        
        // Insert the post
        const postData = {
          userId: userId, // Use the current user's ID
          username: post.username,
          userAvatar: post.userAvatar,
          title: post.title,
          description: post.description,
          location: post.location,
          contactInfo: post.contactInfo,
          type: post.type as "helpNeeded" | "helpOffered" | "achievement",
          tags,
          images: post.images || [],
          isCompleted: post.isCompleted || false,
          likedByUsers: []
        };
        
        // Insert the post and get its ID
        const newPostId = await ctx.db.insert("posts", postData);
        
        // Store mapping from original post number to Convex ID
        postIdMap.set(post._creationTime.toString(), newPostId);
        
        // If this is an achievement post, store the original post ID for reference
        if (post.type === "achievement" && post.originalPostId) {
          postIdMap.set(`original-${post._creationTime}`, post.originalPostId);
        }
      } catch (error) {
        console.error(`Error importing post "${post.title}":`, error);
      }
    }
    
    // Update achievement posts with the correct original post references
    for (const post of ARABIC_MOCK_DATA.posts) {
      if (post.type === "achievement" && post.originalPostId) {
        try {
          // Get the Convex IDs we need
          const achievementId = postIdMap.get(post._creationTime.toString());
          const originalPostNum = postIdMap.get(`original-${post._creationTime}`);
          
          // Find the original post by its index
          const originalPosts = ARABIC_MOCK_DATA.posts.filter(p => p.type !== "achievement");
          const originalPostCreationTime = originalPosts[originalPostNum - 1]?._creationTime?.toString();
          if (!originalPostCreationTime) continue;
          
          const originalPostId = postIdMap.get(originalPostCreationTime);
          if (!originalPostId) continue;
          
          // Update the achievement with the correct original post ID
          await ctx.db.patch(achievementId, {
            originalPostId
          });
        } catch (error) {
          console.error(`Error updating achievement references:`, error);
        }
      }
    }
    
    // Import replies
    for (const reply of ARABIC_MOCK_DATA.replies) {
      try {
        // Find the corresponding post for this reply
        const postNum = reply.postId;
        const postInMockData = ARABIC_MOCK_DATA.posts[postNum - 1];
        if (!postInMockData) continue;
        
        const postId = postIdMap.get(postInMockData._creationTime.toString());
        if (!postId) continue;
        
        // Create the reply
        await ctx.db.insert("replies", {
          postId,
          userId: userId, // Use the current user's ID
          username: reply.username,
          userAvatar: reply.userAvatar,
          text: reply.text
        });
      } catch (error) {
        console.error(`Error importing reply:`, error);
      }
    }
    
    console.log("Arabic mock data import completed");
    return { success: true };
  }
});

/**
 * Clear all imported Arabic mock data
 */
export const clearImportedData = mutation({
  handler: async (ctx) => {
    // Check if the user is authenticated
    const identity = await getAuth(ctx);
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    try {
      // Fetch all posts (consider adding constraints if table becomes large)
      const allPosts = await ctx.db.query("posts").collect();
      // Filter in JavaScript for posts tagged with MOCK_DATA_TAG
      const postsToDelete = allPosts.filter(post => post.tags.includes(MOCK_DATA_TAG));
      
      // Delete all replies for these posts first
      for (const post of postsToDelete) {
        const replies = await ctx.db
          .query("replies")
          .withIndex("by_post", (q) => q.eq("postId", post._id))
          .collect();
        
        for (const reply of replies) {
          await ctx.db.delete(reply._id);
        }
      }
      
      // Then delete the posts themselves
      for (const post of postsToDelete) {
        await ctx.db.delete(post._id);
      }
      
      return { success: true, deletedCount: postsToDelete.length };
    } catch (error) {
      console.error("Error clearing mock data:", error);
      throw new Error("Failed to clear mock data");
    }
  }
});