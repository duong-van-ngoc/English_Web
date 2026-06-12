export interface Word {
  id: string;
  word: string;
  ipa: string;
  partOfSpeech: "noun" | "verb" | "adjective" | "adverb" | "phrase";
  meaningVi: string;
  exampleEn: string;
  exampleVi: string;
  synonyms: string[];
  collocations: string[];
  wordFamily: string[];
  commonMistakes: string[];
}

export interface Topic {
  id: string;
  slug?: string;
  name: string;
  description: string;
  icon: "eco" | "school" | "biotech" | "flight" | "health_and_safety" | "work";
  totalWords: number;
  progressPercent: number;
  status: "in-progress" | "not-started" | "completed" | "locked" | "updated";
  isUpdated?: boolean;
  newWordsCount?: number;
  words: Word[];
}

export const VOCABULARY_TOPICS: Topic[] = [
  {
    id: "environment",
    name: "Environment",
    description: "Climate change, biodiversity, and sustainability terms.",
    icon: "eco",
    totalWords: 10,
    progressPercent: 35,
    status: "updated",
    isUpdated: true,
    newWordsCount: 2,
    words: [
      {
        id: "env-1",
        word: "biodiversity",
        ipa: "/ˌbaɪəʊdaɪˈvɜːsəti/",
        partOfSpeech: "noun",
        meaningVi: "đa dạng sinh học",
        exampleEn: "The logging industry is a threat to the biodiversity of the rainforest.",
        exampleVi: "Ngành khai thác gỗ là một mối đe dọa đối với sự đa dạng sinh học của rừng mưa nhiệt đới.",
        synonyms: ["biological variety", "ecological diversity"],
        collocations: ["preserve biodiversity", "biodiversity loss"],
        wordFamily: ["biodiverse (adj)"],
        commonMistakes: ["Tránh viết sai chính tả thành 'biodiversaty'."]
      },
      {
        id: "env-2",
        word: "sustainable",
        ipa: "/səˈsteɪnəbl/",
        partOfSpeech: "adjective",
        meaningVi: "bền vững",
        exampleEn: "We need to find sustainable sources of energy.",
        exampleVi: "Chúng ta cần tìm kiếm các nguồn năng lượng bền vững.",
        synonyms: ["renewable", "eco-friendly", "maintainable"],
        collocations: ["sustainable development", "sustainable agriculture"],
        wordFamily: ["sustain (v)", "sustainability (n)", "sustainably (adv)"],
        commonMistakes: ["Hay nhầm với 'sustained' (được duy trì liên tục)."]
      },
      {
        id: "env-3",
        word: "emission",
        ipa: "/ɪˈmɪʃn/",
        partOfSpeech: "noun",
        meaningVi: "khí thải, sự phát thải",
        exampleEn: "Many countries have agreed to reduce carbon greenhouse gas emissions.",
        exampleVi: "Nhiều quốc gia đã đồng ý giảm lượng phát thải khí nhà kính carbon.",
        synonyms: ["discharge", "release", "leakation"],
        collocations: ["carbon emissions", "zero emissions", "cut emissions"],
        wordFamily: ["emit (v)"],
        commonMistakes: ["Danh từ số nhiều thường dùng là 'emissions' khi nói về lượng khí thải nói chung."]
      },
      {
        id: "env-4",
        word: "ecosystem",
        ipa: "/ˈiːkəʊsɪstəm/",
        partOfSpeech: "noun",
        meaningVi: "hệ sinh thái",
        exampleEn: "Pollution can have a disastrous effect on the delicate marine ecosystem.",
        exampleVi: "Ô nhiễm có thể có ảnh hưởng thảm khốc đến hệ sinh thái biển mỏng manh.",
        synonyms: ["ecological community", "environment"],
        collocations: ["fragile ecosystem", "protect the ecosystem"],
        wordFamily: ["ecological (adj)", "ecologist (n)"],
        commonMistakes: ["Thường viết liền 'ecosystem', không viết tách thành 'eco system'."]
      },
      {
        id: "env-5",
        word: "conservation",
        ipa: "/ˌkɒnsəˈveɪʃn/",
        partOfSpeech: "noun",
        meaningVi: "sự bảo tồn",
        exampleEn: "Wildlife conservation is essential to protect endangered species.",
        exampleVi: "Bảo tồn động vật hoang dã là cần thiết để bảo vệ các loài có nguy cơ tuyệt chủng.",
        synonyms: ["preservation", "protection", "safeguarding"],
        collocations: ["nature conservation", "conservation project"],
        wordFamily: ["conserve (v)", "conservative (adj)"],
        commonMistakes: ["Phân biệt với 'conversation' (cuộc hội thoại), viết rất dễ nhầm chữ 's' và 'v'."]
      },
      {
        id: "env-6",
        word: "contaminate",
        ipa: "/kənˈtæmɪneɪt/",
        partOfSpeech: "verb",
        meaningVi: "làm ô nhiễm, làm bẩn",
        exampleEn: "The drinking water was contaminated with toxic chemicals.",
        exampleVi: "Nước uống đã bị ô nhiễm bởi các hóa chất độc hại.",
        synonyms: ["pollute", "poison", "taint"],
        collocations: ["highly contaminated", "contaminate groundwater"],
        wordFamily: ["contamination (n)", "contaminant (n)"],
        commonMistakes: ["Chủ yếu dùng dạng bị động 'be contaminated with/by'."]
      },
      {
        id: "env-7",
        word: "deforestation",
        ipa: "/ˌdiːˌfɒrɪˈsteɪʃn/",
        partOfSpeech: "noun",
        meaningVi: "nạn phá rừng",
        exampleEn: "Deforestation is causing severe soil erosion in this mountainous region.",
        exampleVi: "Nạn phá rừng đang gây ra xói mòn đất nghiêm trọng ở vùng núi này.",
        synonyms: ["forest clearance", "logging"],
        collocations: ["prevent deforestation", "stop deforestation"],
        wordFamily: ["deforest (v)"],
        commonMistakes: ["Viết đúng hai chữ 'f' và hậu tố 'station'."]
      },
      {
        id: "env-8",
        word: "renewable",
        ipa: "/rɪˈnjuːəbl/",
        partOfSpeech: "adjective",
        meaningVi: "có thể tái tạo",
        exampleEn: "Wind and solar power are forms of renewable energy.",
        exampleVi: "Năng lượng gió và mặt trời là các hình thức năng lượng có thể tái tạo.",
        synonyms: ["sustainable", "inexhaustible"],
        collocations: ["renewable energy", "renewable resources"],
        wordFamily: ["renew (v)", "renewal (n)"],
        commonMistakes: ["Tránh nhầm với 'usable' hoặc 'recyclable' (có thể tái chế)."]
      },
      {
        id: "env-9",
        word: "catastrophe",
        ipa: "/kəˈtæstrəfi/",
        partOfSpeech: "noun",
        meaningVi: "thảm họa",
        exampleEn: "Climate change could lead to an environmental catastrophe.",
        exampleVi: "Biến đổi khí hậu có thể dẫn đến một thảm họa môi trường.",
        synonyms: ["disaster", "calamity", "tragedy"],
        collocations: ["natural catastrophe", "prevent a catastrophe"],
        wordFamily: ["catastrophic (adj)", "catastrophically (adv)"],
        commonMistakes: ["Phát âm âm cuối là /fi/, không phải /f/ hay /ph/."]
      },
      {
        id: "env-10",
        word: "greenhouse effect",
        ipa: "/ˈɡriːnhaʊs ɪˈfekt/",
        partOfSpeech: "phrase",
        meaningVi: "hiệu ứng nhà kính",
        exampleEn: "The greenhouse effect is causing global temperatures to rise.",
        exampleVi: "Hiệu ứng nhà kính đang làm cho nhiệt độ toàn cầu tăng lên.",
        synonyms: ["global warming", "atmospheric warming"],
        collocations: ["greenhouse gases", "enhance greenhouse effect"],
        wordFamily: [],
        commonMistakes: ["Viết 'greenhouse' liền nhau, không viết rời 'green house'."]
      }
    ]
  },
  {
    id: "education",
    name: "Education",
    description: "Academic systems, learning styles, and school life.",
    icon: "school",
    totalWords: 8,
    progressPercent: 35,
    status: "in-progress",
    words: [
      {
        id: "edu-1",
        word: "curriculum",
        ipa: "/kəˈrɪkjələm/",
        partOfSpeech: "noun",
        meaningVi: "chương trình học",
        exampleEn: "The school is planning to introduce a new science curriculum next year.",
        exampleVi: "Trường đang lập kế hoạch đưa vào một chương trình học khoa học mới vào năm tới.",
        synonyms: ["syllabus", "course of study"],
        collocations: ["school curriculum", "core curriculum", "design curriculum"],
        wordFamily: ["curricular (adj)"],
        commonMistakes: ["Số nhiều bất quy tắc là 'curricula' hoặc 'curriculums'."]
      },
      {
        id: "edu-2",
        word: "evaluate",
        ipa: "/ɪˈvæljueɪt/",
        partOfSpeech: "verb",
        meaningVi: "đánh giá, định giá",
        exampleEn: "The exams are used to evaluate students' progress over the semester.",
        exampleVi: "Các kỳ thi được sử dụng để đánh giá sự tiến bộ của học viên trong suốt học kỳ.",
        synonyms: ["assess", "appraise", "estimate"],
        collocations: ["evaluate performance", "evaluate progress"],
        wordFamily: ["evaluation (n)", "evaluative (adj)"],
        commonMistakes: ["Tránh nhầm với 'value' (giá trị/trân trọng) hay 'validate' (xác thực)."]
      },
      {
        id: "edu-3",
        word: "academic",
        ipa: "/ˌækəˈdemɪk/",
        partOfSpeech: "adjective",
        meaningVi: "thuộc học thuật, học tập",
        exampleEn: "She achieved high academic standards throughout her university career.",
        exampleVi: "Cô ấy đã đạt tiêu chuẩn học thuật cao trong suốt quá trình học đại học.",
        synonyms: ["educational", "scholarly", "intellectual"],
        collocations: ["academic performance", "academic year", "academic achievement"],
        wordFamily: ["academy (n)", "academically (adv)"],
        commonMistakes: ["Nhấn trọng âm rơi vào âm tiết thứ 3: /ˌækəˈdemɪk/."]
      },
      {
        id: "edu-4",
        word: "tuition fee",
        ipa: "/tjuˈɪʃn fiː/",
        partOfSpeech: "phrase",
        meaningVi: "học phí",
        exampleEn: "The university has decided to increase tuition fees for international students.",
        exampleVi: "Trường đại học đã quyết định tăng học phí cho sinh viên quốc tế.",
        synonyms: ["education cost", "school fees"],
        collocations: ["pay tuition fees", "high tuition fees"],
        wordFamily: [],
        commonMistakes: ["Thường dùng số nhiều 'tuition fees' khi nói về tổng học phí phải đóng."]
      },
      {
        id: "edu-5",
        word: "pedagogy",
        ipa: "/ˈpedəɡɒdʒi/",
        partOfSpeech: "noun",
        meaningVi: "sư phạm học, phương pháp giảng dạy",
        exampleEn: "Modern pedagogy focuses on student-centered learning methods.",
        exampleVi: "Sư phạm học hiện đại tập trung vào các phương pháp học lấy học viên làm trung tâm.",
        synonyms: ["teaching method", "didactics"],
        collocations: ["modern pedagogy", "pedagogical skills"],
        wordFamily: ["pedagogical (adj)"],
        commonMistakes: ["Từ nâng cao, dễ viết sai chính tả. Chú ý chữ 'o' ở giữa."]
      },
      {
        id: "edu-6",
        word: "scholarship",
        ipa: "/ˈskɒləʃɪp/",
        partOfSpeech: "noun",
        meaningVi: "học bổng",
        exampleEn: "He won a full scholarship to study at Harvard University.",
        exampleVi: "Anh ấy đã giành được một học bổng toàn phần để học tại Đại học Harvard.",
        synonyms: ["grant", "financial aid"],
        collocations: ["apply for a scholarship", "award a scholarship"],
        wordFamily: ["scholar (n)"],
        commonMistakes: ["Scholarship là danh từ đếm được, dùng 'a scholarship' hoặc 'scholarships'."]
      },
      {
        id: "edu-7",
        word: "literacy",
        ipa: "/ˈlɪtərəsi/",
        partOfSpeech: "noun",
        meaningVi: "sự biết chữ, khả năng đọc viết",
        exampleEn: "The government is working to improve adult literacy rates.",
        exampleVi: "Chính phủ đang nỗ lực cải thiện tỷ lệ biết chữ ở người lớn.",
        synonyms: ["ability to read and write"],
        collocations: ["computer literacy", "literacy rate", "financial literacy"],
        wordFamily: ["literate (adj)", "illiterate (adj/n)"],
        commonMistakes: ["Phân biệt với 'literature' (văn học)."]
      },
      {
        id: "edu-8",
        word: "discipline",
        ipa: "/ˈdɪsəplɪn/",
        partOfSpeech: "noun",
        meaningVi: "kỷ luật",
        exampleEn: "Strict discipline is maintained in the school.",
        exampleVi: "Kỷ luật nghiêm khắc được duy trì trong trường học.",
        synonyms: ["order", "rules", "self-control"],
        collocations: ["maintain discipline", "strict discipline", "school discipline"],
        wordFamily: ["disciplinary (adj)"],
        commonMistakes: ["Trọng âm rơi vào âm tiết đầu tiên: /ˈdɪsəplɪn/."]
      }
    ]
  },
  {
    id: "technology",
    name: "Technology",
    description: "Digital world, AI, innovation, and computing.",
    icon: "biotech",
    totalWords: 8,
    progressPercent: 0,
    status: "not-started",
    words: [
      {
        id: "tech-1",
        word: "innovation",
        ipa: "/ˌɪnəˈveɪʃn/",
        partOfSpeech: "noun",
        meaningVi: "sự đổi mới, sự cách tân",
        exampleEn: "Technological innovation is key to economic growth.",
        exampleVi: "Đổi mới công nghệ là chìa khóa cho sự tăng trưởng kinh tế.",
        synonyms: ["invention", "novelty", "advancement"],
        collocations: ["technological innovation", "encourage innovation"],
        wordFamily: ["innovate (v)", "innovative (adj)"],
        commonMistakes: ["Thường đi kèm với giới từ 'in' (innovation in technology)."]
      },
      {
        id: "tech-2",
        word: "artificial intelligence",
        ipa: "/ˌɑːtɪˈfɪʃl ɪnˈtelɪɡəns/",
        partOfSpeech: "phrase",
        meaningVi: "trí tuệ nhân tạo (AI)",
        exampleEn: "Artificial intelligence is changing the way we work and live.",
        exampleVi: "Trí tuệ nhân tạo đang thay đổi cách chúng ta làm việc và sinh sống.",
        synonyms: ["machine intelligence", "AI"],
        collocations: ["develop artificial intelligence", "AI algorithms"],
        wordFamily: [],
        commonMistakes: ["Viết đúng chính tả từ 'intelligence' với hai chữ 'l'."]
      },
      {
        id: "tech-3",
        word: "automation",
        ipa: "/ˌɔːtəˈmeɪʃn/",
        partOfSpeech: "noun",
        meaningVi: "sự tự động hóa",
        exampleEn: "Automation has led to job losses in the manufacturing sector.",
        exampleVi: "Tự động hóa đã dẫn đến việc mất việc làm trong ngành sản xuất.",
        synonyms: ["computerization", "mechanization"],
        collocations: ["factory automation", "process automation"],
        wordFamily: ["automate (v)", "automatic (adj)"],
        commonMistakes: ["Tránh nhầm với 'automobile' (ô tô)."]
      },
      {
        id: "tech-4",
        word: "cybersecurity",
        ipa: "/ˌsaɪbəsɪˈkjʊərəti/",
        partOfSpeech: "noun",
        meaningVi: "an ninh mạng",
        exampleEn: "Companies need to invest more in cybersecurity to prevent hacking.",
        exampleVi: "Các công ty cần đầu tư nhiều hơn vào an ninh mạng để ngăn chặn tin tặc.",
        synonyms: ["information security", "digital protection"],
        collocations: ["cybersecurity threat", "cybersecurity measures"],
        wordFamily: [],
        commonMistakes: ["Viết liền một từ, không viết rời 'cyber security'."]
      },
      {
        id: "tech-5",
        word: "algorithm",
        ipa: "/ˈælɡərɪðəm/",
        partOfSpeech: "noun",
        meaningVi: "thuật toán",
        exampleEn: "Social media feeds are determined by complex algorithms.",
        exampleVi: "Bảng tin mạng xã hội được quyết định bởi các thuật toán phức tạp.",
        synonyms: ["procedure", "formula", "systematic method"],
        collocations: ["search algorithm", "complex algorithm", "run an algorithm"],
        wordFamily: [],
        commonMistakes: ["Phát âm âm /ð/ rõ ràng, tránh nhầm sang âm /t/."]
      },
      {
        id: "tech-6",
        word: "obsolete",
        ipa: "/ˈɒbsəliːt/",
        partOfSpeech: "adjective",
        meaningVi: "lỗi thời, không còn sử dụng",
        exampleEn: "Gas lamps became obsolete when electricity was introduced.",
        exampleVi: "Đèn ga trở nên lỗi thời khi điện được đưa vào sử dụng.",
        synonyms: ["outdated", "out of date", "old-fashioned"],
        collocations: ["render obsolete", "become obsolete"],
        wordFamily: ["obsolescence (n)"],
        commonMistakes: ["Tránh nhầm với 'absolute' (tuyệt đối)."]
      },
      {
        id: "tech-7",
        word: "breakthrough",
        ipa: "/ˈbreɪkθruː/",
        partOfSpeech: "noun",
        meaningVi: "bước đột phá",
        exampleEn: "Scientists have made a major breakthrough in cancer research.",
        exampleVi: "Các nhà khoa học đã tạo ra một bước đột phá lớn trong nghiên cứu ung thư.",
        synonyms: ["major discovery", "leap", "revolution"],
        collocations: ["scientific breakthrough", "major breakthrough"],
        wordFamily: [],
        commonMistakes: ["Viết liền thành một từ, không có khoảng cách ở giữa."]
      },
      {
        id: "tech-8",
        word: "interface",
        ipa: "/ˈɪntəfeɪs/",
        partOfSpeech: "noun",
        meaningVi: "giao diện",
        exampleEn: "The software has a user-friendly interface that is easy to navigate.",
        exampleVi: "Phần mềm có một giao diện thân thiện với người dùng giúp dễ dàng điều hướng.",
        synonyms: ["connection", "screen design"],
        collocations: ["user interface", "graphic interface"],
        wordFamily: [],
        commonMistakes: ["Trọng âm rơi vào âm tiết đầu tiên: /ˈɪntəfeɪs/."]
      }
    ]
  },
  {
    id: "travel",
    name: "Travel",
    description: "Transportation, accommodation, and global culture.",
    icon: "flight",
    totalWords: 8,
    progressPercent: 100,
    status: "completed",
    words: [
      {
        id: "trv-1",
        word: "itinerary",
        ipa: "/aɪˈtɪnərəri/",
        partOfSpeech: "noun",
        meaningVi: "lịch trình chuyến đi",
        exampleEn: "The travel agent provided us with a detailed itinerary for our trip.",
        exampleVi: "Đại lý du lịch đã cung cấp cho chúng tôi một lịch trình chi tiết cho chuyến đi.",
        synonyms: ["travel plan", "schedule", "route"],
        collocations: ["detailed itinerary", "planned itinerary"],
        wordFamily: [],
        commonMistakes: ["Từ này có phát âm khá phức tạp, chú ý âm /aɪ/ ở đầu."]
      },
      {
        id: "trv-2",
        word: "accommodation",
        ipa: "/əˌkɒməˈdeɪʃn/",
        partOfSpeech: "noun",
        meaningVi: "chỗ ở, nơi lưu trú",
        exampleEn: "Hotel accommodation is included in the price of the package tour.",
        exampleVi: "Chỗ ở khách sạn được bao gồm trong giá của tour trọn gói.",
        synonyms: ["lodging", "housing", "quarters"],
        collocations: ["find accommodation", "temporary accommodation"],
        wordFamily: ["accommodate (v)"],
        commonMistakes: ["Viết đúng hai chữ 'c' và hai chữ 'm' (accommodation)."]
      },
      {
        id: "trv-3",
        word: "destination",
        ipa: "/ˌdestɪˈneɪʃn/",
        partOfSpeech: "noun",
        meaningVi: "điểm đến",
        exampleEn: "Paris is one of the most popular tourist destinations in the world.",
        exampleVi: "Paris là một trong những điểm đến du lịch phổ biến nhất trên thế giới.",
        synonyms: ["goal", "target", "terminus"],
        collocations: ["holiday destination", "popular destination", "reach destination"],
        wordFamily: ["destine (v)"],
        commonMistakes: ["Phân biệt với 'destiny' (vận mệnh)."]
      },
      {
        id: "trv-4",
        word: "hospitality",
        ipa: "/ˌhɒspɪˈtæləti/",
        partOfSpeech: "noun",
        meaningVi: "lòng hiếu khách, ngành dịch vụ nhà hàng khách sạn",
        exampleEn: "We were overwhelmed by the warmth and hospitality of the local people.",
        exampleVi: "Chúng tôi đã bị choáng ngợp bởi sự ấm áp và lòng hiếu khách của người dân địa phương.",
        synonyms: ["friendliness", "warm welcome"],
        collocations: ["warm hospitality", "hospitality industry"],
        wordFamily: ["hospitable (adj)"],
        commonMistakes: ["Tránh nhầm với 'hospital' (bệnh viện) về nghĩa."]
      },
      {
        id: "trv-5",
        word: "exotic",
        ipa: "/ɪɡˈzɒtɪk/",
        partOfSpeech: "adjective",
        meaningVi: "kỳ lạ, ngoại lai (đẹp và độc đáo từ nước ngoài)",
        exampleEn: "She travels to exotic islands in the Pacific every summer.",
        exampleVi: "Cô ấy du lịch đến những hòn đảo kỳ lạ ở Thái Bình Dương mỗi mùa hè.",
        synonyms: ["unusual", "colorful", "foreign"],
        collocations: ["exotic plants", "exotic destination"],
        wordFamily: ["exotically (adv)"],
        commonMistakes: ["Thường dùng với nghĩa tích cực, thể hiện sự thu hút và khác biệt thú vị."]
      },
      {
        id: "trv-6",
        word: "ecotourism",
        ipa: "/ˈiːkəʊtʊərɪzəm/",
        partOfSpeech: "noun",
        meaningVi: "du lịch sinh thái",
        exampleEn: "Ecotourism supports conservation efforts and helps local communities.",
        exampleVi: "Du lịch sinh thái hỗ trợ các nỗ lực bảo tồn và giúp đỡ cộng đồng địa phương.",
        synonyms: ["green travel", "sustainable tourism"],
        collocations: ["promote ecotourism", "ecotourism project"],
        wordFamily: [],
        commonMistakes: ["Viết liền một từ, không viết rời 'eco tourism'."]
      },
      {
        id: "trv-7",
        word: "spectacular",
        ipa: "/spekˈtækjələ(r)/",
        partOfSpeech: "adjective",
        meaningVi: "ngoạn mục, hùng vĩ",
        exampleEn: "The view from the top of the mountain was spectacular.",
        exampleVi: "Tầm nhìn từ đỉnh núi thật ngoạn mục.",
        synonyms: ["magnificent", "breathtaking", "stunning"],
        collocations: ["spectacular view", "spectacular scenery"],
        wordFamily: ["spectacle (n)", "spectacularly (adv)"],
        commonMistakes: ["Thường dùng cho cảnh sắc thiên nhiên hoặc màn trình diễn ấn tượng."]
      },
      {
        id: "trv-8",
        word: "souvenir",
        ipa: "/ˌsuːvəˈnɪə(r)/",
        partOfSpeech: "noun",
        meaningVi: "quà lưu niệm",
        exampleEn: "I bought a model of the Eiffel Tower as a souvenir of Paris.",
        exampleVi: "Tôi đã mua một mô hình Tháp Eiffel làm quà lưu niệm của Paris.",
        synonyms: ["keepsake", "memento"],
        collocations: ["buy souvenirs", "souvenir shop"],
        wordFamily: [],
        commonMistakes: ["Trọng âm rơi vào âm tiết thứ 3: /ˌsuːvəˈnɪə(r)/."]
      }
    ]
  },
  {
    id: "health",
    name: "Health",
    description: "Well-being, medical terms, and healthy lifestyle.",
    icon: "health_and_safety",
    totalWords: 8,
    progressPercent: 15,
    status: "in-progress",
    words: [
      {
        id: "hlth-1",
        word: "well-being",
        ipa: "/ˈwel biːɪŋ/",
        partOfSpeech: "noun",
        meaningVi: "sự khỏe mạnh, trạng thái hạnh phúc",
        exampleEn: "Physical exercise is important for emotional well-being.",
        exampleVi: "Tập thể dục thể chất rất quan trọng đối với sức khỏe cảm xúc.",
        synonyms: ["welfare", "healthiness", "happiness"],
        collocations: ["general well-being", "promote well-being"],
        wordFamily: [],
        commonMistakes: ["Thường viết với dấu gạch ngang 'well-being'."]
      },
      {
        id: "hlth-2",
        word: "nutrition",
        ipa: "/njuˈtrɪʃn/",
        partOfSpeech: "noun",
        meaningVi: "dinh dưỡng",
        exampleEn: "Good nutrition is essential for a healthy lifestyle.",
        exampleVi: "Dinh dưỡng tốt là cần thiết cho một lối sống lành mạnh.",
        synonyms: ["nourishment", "foodstuff"],
        collocations: ["poor nutrition", "child nutrition", "diet and nutrition"],
        wordFamily: ["nutrient (n)", "nutritious (adj)", "nutritional (adj)"],
        commonMistakes: ["Phân biệt với 'nutrient' (chất dinh dưỡng cụ thể)."]
      },
      {
        id: "hlth-3",
        word: "prevention",
        ipa: "/prɪˈvenʃn/",
        partOfSpeech: "noun",
        meaningVi: "sự ngăn ngừa, phòng bệnh",
        exampleEn: "The government focuses on the prevention of infectious diseases.",
        exampleVi: "Chính phủ tập trung vào việc phòng ngừa các bệnh truyền nhiễm.",
        synonyms: ["avoidance", "deterrence", "safeguard"],
        collocations: ["disease prevention", "prevention program"],
        wordFamily: ["prevent (v)", "preventative (adj)"],
        commonMistakes: ["Đi kèm câu thành ngữ: 'Prevention is better than cure' (Phòng bệnh hơn chữa bệnh)."]
      },
      {
        id: "hlth-4",
        word: "chronic",
        ipa: "/ˈkrɒnɪk/",
        partOfSpeech: "adjective",
        meaningVi: "mãn tính, kéo dài dai dẳng",
        exampleEn: "He suffers from chronic back pain.",
        exampleVi: "Anh ấy phải chịu đựng chứng đau lưng mãn tính.",
        synonyms: ["long-lasting", "persistent", "incurable"],
        collocations: ["chronic illness", "chronic disease", "chronic pain"],
        wordFamily: ["chronically (adv)"],
        commonMistakes: ["Tránh nhầm với 'acute' (cấp tính, xảy ra đột ngột dữ dội)."]
      },
      {
        id: "hlth-5",
        word: "immune system",
        ipa: "/ɪˈmjuːn ˌsɪstəm/",
        partOfSpeech: "phrase",
        meaningVi: "hệ miễn dịch",
        exampleEn: "Vitamin C helps to boost your body's immune system.",
        exampleVi: "Vitamin C giúp tăng cường hệ miễn dịch của cơ thể bạn.",
        synonyms: ["defense mechanism"],
        collocations: ["strengthen the immune system", "weak immune system"],
        wordFamily: ["immunity (n)", "immunize (v)"],
        commonMistakes: ["Viết đúng chính tả từ 'immune' kết thúc bằng chữ 'e'."]
      },
      {
        id: "hlth-6",
        word: "symptom",
        ipa: "/ˈsɪmptəm/",
        partOfSpeech: "noun",
        meaningVi: "triệu chứng",
        exampleEn: "Common symptoms of flu include fever and a runny nose.",
        exampleVi: "Các triệu chứng phổ biến của bệnh cúm bao gồm sốt và chảy nước mũi.",
        synonyms: ["sign", "indication", "manifestation"],
        collocations: ["early symptoms", "experience symptoms", "symptom relief"],
        wordFamily: ["symptomatic (adj)"],
        commonMistakes: ["Chữ 'p' câm hoặc phát âm rất nhẹ: /ˈsɪmptəm/."]
      },
      {
        id: "hlth-7",
        word: "sedentary",
        ipa: "/ˈsedntri/",
        partOfSpeech: "adjective",
        meaningVi: "ít vận động, ngồi nhiều",
        exampleEn: "A sedentary lifestyle can lead to obesity and heart disease.",
        exampleVi: "Lối sống ít vận động có thể dẫn đến béo phì và bệnh tim.",
        synonyms: ["inactive", "desk-bound", "sitting"],
        collocations: ["sedentary lifestyle", "sedentary job"],
        wordFamily: [],
        commonMistakes: ["Thường đi kèm với cụm từ 'sedentary lifestyle'."]
      },
      {
        id: "hlth-8",
        word: "epidemic",
        ipa: "/ˌepɪˈdemɪk/",
        partOfSpeech: "noun",
        meaningVi: "dịch bệnh",
        exampleEn: "Health officials are working to control the cholera epidemic.",
        exampleVi: "Các quan chức y tế đang làm việc để kiểm soát dịch bệnh tả.",
        synonyms: ["outbreak", "pandemic (đại dịch toàn cầu)"],
        collocations: ["flu epidemic", "prevent an epidemic"],
        wordFamily: [],
        commonMistakes: ["Phân biệt với 'pandemic' (dịch bệnh quy mô toàn cầu rộng lớn hơn)."]
      }
    ]
  },
  {
    id: "work-jobs",
    name: "Work & Jobs",
    description: "Employment, office life, and professional skills.",
    icon: "work",
    totalWords: 8,
    progressPercent: 0,
    status: "not-started",
    words: [
      {
        id: "wrk-1",
        word: "employment",
        ipa: "/ɪmˈplɔɪmənt/",
        partOfSpeech: "noun",
        meaningVi: "việc làm, sự thuê mướn",
        exampleEn: "The government aims to achieve full employment.",
        exampleVi: "Chính phủ đặt mục tiêu đạt được sự giải quyết việc làm đầy đủ.",
        synonyms: ["jobs", "work", "occupation"],
        collocations: ["seek employment", "gainful employment", "employment contract"],
        wordFamily: ["employ (v)", "employee (n)", "employer (n)", "unemployment (n)"],
        commonMistakes: ["Không dùng 'employments' ở dạng số nhiều đếm được."]
      },
      {
        id: "wrk-2",
        word: "productivity",
        ipa: "/ˌprɒdʌkˈtɪvəti/",
        partOfSpeech: "noun",
        meaningVi: "năng suất, hiệu suất làm việc",
        exampleEn: "New technology has greatly increased agricultural productivity.",
        exampleVi: "Công nghệ mới đã làm tăng đáng kể năng suất nông nghiệp.",
        synonyms: ["efficiency", "output", "yield"],
        collocations: ["increase productivity", "worker productivity", "high productivity"],
        wordFamily: ["produce (v)", "product (n)", "productive (adj)"],
        commonMistakes: ["Trọng âm rơi vào âm tiết thứ 3: /ˌprɒdʌkˈtɪvəti/."]
      },
      {
        id: "wrk-3",
        word: "promote",
        ipa: "/prəˈməʊt/",
        partOfSpeech: "verb",
        meaningVi: "thăng chức, thúc đẩy quảng bá",
        exampleEn: "He was promoted to senior manager after just one year.",
        exampleVi: "Anh ấy đã được thăng chức lên quản lý cấp cao chỉ sau một năm.",
        synonyms: ["elevate", "advance", "encourage"],
        collocations: ["get promoted", "promote a product", "promote growth"],
        wordFamily: ["promotion (n)"],
        commonMistakes: ["Khi mang nghĩa thăng chức thường dùng dạng bị động 'be promoted to'."]
      },
      {
        id: "wrk-4",
        word: "collaborate",
        ipa: "/kəˈlæbəreɪt/",
        partOfSpeech: "verb",
        meaningVi: "cộng tác, hợp tác",
        exampleEn: "Researchers from different departments collaborated on the project.",
        exampleVi: "Các nhà nghiên cứu từ các phòng ban khác nhau đã hợp tác trong dự án.",
        synonyms: ["cooperate", "work together", "team up"],
        collocations: ["collaborate with someone", "collaborate on a project"],
        wordFamily: ["collaboration (n)", "collaborative (adj)"],
        commonMistakes: ["Học cách đi giới từ đúng: 'collaborate with' (ai đó) và 'collaborate on' (dự án/công việc)."]
      },
      {
        id: "wrk-5",
        word: "vacancy",
        ipa: "/ˈveɪkənsi/",
        partOfSpeech: "noun",
        meaningVi: "vị trí còn trống, phòng trống",
        exampleEn: "The company has a vacancy for a software developer.",
        exampleVi: "Công ty đang có một vị trí tuyển dụng trống cho nhà phát triển phần mềm.",
        synonyms: ["job opening", "empty position"],
        collocations: ["job vacancy", "fill a vacancy", "advertise a vacancy"],
        wordFamily: ["vacant (adj)"],
        commonMistakes: ["Số nhiều chuyển 'y' thành 'i' và thêm 'es' (vacancies)."]
      },
      {
        id: "wrk-6",
        word: "entrepreneur",
        ipa: "/ˌɒntrəprəˈnɜː(r)/",
        partOfSpeech: "noun",
        meaningVi: "nhà khởi nghiệp, doanh nhân",
        exampleEn: "She is a successful entrepreneur who started her own fashion brand.",
        exampleVi: "Cô ấy là một nhà khởi nghiệp thành công, người đã thành lập thương hiệu thời trang riêng của mình.",
        synonyms: ["business owner", "founder", "industrialist"],
        collocations: ["budding entrepreneur", "successful entrepreneur"],
        wordFamily: ["entrepreneurial (adj)", "entrepreneurship (n)"],
        commonMistakes: ["Cách viết rất phức tạp mượn từ tiếng Pháp. Lưu ý phát âm /ˌɒntrəprəˈnɜː(r)/."]
      },
      {
        id: "wrk-7",
        word: "qualification",
        ipa: "/ˌkwɒlɪfɪˈkeɪʃn/",
        partOfSpeech: "noun",
        meaningVi: "bằng cấp, trình độ chuyên môn",
        exampleEn: "She has the academic qualifications necessary for the job.",
        exampleVi: "Cô ấy có những bằng cấp học thuật cần thiết cho công việc này.",
        synonyms: ["degree", "certificate", "credentials"],
        collocations: ["academic qualifications", "gain qualifications", "professional qualifications"],
        wordFamily: ["qualify (v)", "qualified (adj)"],
        commonMistakes: ["Thường dùng số nhiều 'qualifications' khi nói về hồ sơ năng lực tuyển dụng."]
      },
      {
        id: "wrk-8",
        word: "salary",
        ipa: "/ˈsæləri/",
        partOfSpeech: "noun",
        meaningVi: "lương tháng",
        exampleEn: "The job offers an attractive salary and excellent benefits.",
        exampleVi: "Công việc này đưa ra mức lương hấp dẫn và các chế độ đãi ngộ tuyệt vời.",
        synonyms: ["wage (lương tuần/ngày)", "earnings", "income"],
        collocations: ["attractive salary", "annual salary", "negotiable salary"],
        wordFamily: ["salaried (adj)"],
        commonMistakes: ["Phân biệt với 'wage' (tiền công tính theo giờ/ngày/tuần của lao động chân tay)."]
      }
    ]
  }
];
