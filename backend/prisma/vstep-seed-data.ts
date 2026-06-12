import { ContentStatus } from '@prisma/client';

export interface SeedWord {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
  exampleVi: string;
  synonyms: string[];
  collocations: string[];
  wordFamily: string[];
  commonMistakes: string[];
}

export interface SeedTopic {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: ContentStatus;
  words: SeedWord[];
}

export const VSTEP_SEED_TOPICS: SeedTopic[] = [
  {
    id: "environment",
    name: "Environment",
    description: "Climate change, biodiversity, and sustainability terms.",
    icon: "eco",
    status: ContentStatus.PUBLISHED,
    words: [
      {
        word: "biodiversity",
        phonetic: "/ˌbaɪəʊdaɪˈvɜːsəti/",
        partOfSpeech: "noun",
        meaning: "đa dạng sinh học",
        example: "The logging industry is a threat to the biodiversity of the rainforest.",
        exampleVi: "Ngành khai thác gỗ là một mối đe dọa đối với sự đa dạng sinh học của rừng mưa nhiệt đới.",
        synonyms: ["biological variety", "ecological diversity"],
        collocations: ["preserve biodiversity", "biodiversity loss"],
        wordFamily: ["biodiverse (adj)"],
        commonMistakes: ["Tránh viết sai chính tả thành 'biodiversaty'."]
      },
      {
        word: "sustainable",
        phonetic: "/səˈsteɪnəbl/",
        partOfSpeech: "adjective",
        meaning: "bền vững",
        example: "We need to find sustainable sources of energy.",
        exampleVi: "Chúng ta cần tìm kiếm các nguồn năng lượng bền vững.",
        synonyms: ["renewable", "eco-friendly", "maintainable"],
        collocations: ["sustainable development", "sustainable agriculture"],
        wordFamily: ["sustain (v)", "sustainability (n)", "sustainably (adv)"],
        commonMistakes: ["Hay nhầm với 'sustained' (được duy trì liên tục)."]
      },
      {
        word: "emission",
        phonetic: "/ɪˈmɪʃn/",
        partOfSpeech: "noun",
        meaning: "khí thải, sự phát thải",
        example: "Many countries have agreed to reduce carbon greenhouse gas emissions.",
        exampleVi: "Nhiều quốc gia đã đồng ý giảm lượng phát thải khí nhà kính carbon.",
        synonyms: ["discharge", "release", "leakation"],
        collocations: ["carbon emissions", "zero emissions", "cut emissions"],
        wordFamily: ["emit (v)"],
        commonMistakes: ["Danh từ số nhiều thường dùng là 'emissions' khi nói về lượng khí thải nói chung."]
      },
      {
        word: "ecosystem",
        phonetic: "/ˈiːkəʊsɪstəm/",
        partOfSpeech: "noun",
        meaning: "hệ sinh thái",
        example: "Pollution can have a disastrous effect on the delicate marine ecosystem.",
        exampleVi: "Ô nhiễm có thể có ảnh hưởng thảm khốc đến hệ sinh thái biển mỏng manh.",
        synonyms: ["ecological community", "environment"],
        collocations: ["fragile ecosystem", "protect the ecosystem"],
        wordFamily: ["ecological (adj)", "ecologist (n)"],
        commonMistakes: ["Thường viết liền 'ecosystem', không viết tách thành 'eco system'."]
      },
      {
        word: "conservation",
        phonetic: "/ˌkɒnsəˈveɪʃn/",
        partOfSpeech: "noun",
        meaning: "sự bảo tồn",
        example: "Wildlife conservation is essential to protect endangered species.",
        exampleVi: "Bảo tồn động vật hoang dã là cần thiết để bảo vệ các loài có nguy cơ tuyệt chủng.",
        synonyms: ["preservation", "protection", "safeguarding"],
        collocations: ["nature conservation", "conservation project"],
        wordFamily: ["conserve (v)", "conservative (adj)"],
        commonMistakes: ["Phân biệt với 'conversation' (cuộc hội thoại), viết rất dễ nhầm chữ 's' và 'v'."]
      },
      {
        word: "contaminate",
        phonetic: "/kənˈtæmɪneɪt/",
        partOfSpeech: "verb",
        meaning: "làm ô nhiễm, làm bẩn",
        example: "The drinking water was contaminated with toxic chemicals.",
        exampleVi: "Nước uống đã bị ô nhiễm bởi các hóa chất độc hại.",
        synonyms: ["pollute", "poison", "taint"],
        collocations: ["highly contaminated", "contaminate groundwater"],
        wordFamily: ["contamination (n)", "contaminant (n)"],
        commonMistakes: ["Chủ yếu dùng dạng bị động 'be contaminated with/by'."]
      },
      {
        word: "deforestation",
        phonetic: "/ˌdiːˌfɒrɪˈsteɪʃn/",
        partOfSpeech: "noun",
        meaning: "nạn phá rừng",
        example: "Deforestation is causing severe soil erosion in this mountainous region.",
        exampleVi: "Nạn phá rừng đang gây ra xói mòn đất nghiêm trọng ở vùng núi này.",
        synonyms: ["forest clearance", "logging"],
        collocations: ["prevent deforestation", "stop deforestation"],
        wordFamily: ["deforest (v)"],
        commonMistakes: ["Viết đúng hai chữ 'f' và hậu tố 'station'."]
      },
      {
        word: "renewable",
        phonetic: "/rɪˈnjuːəbl/",
        partOfSpeech: "adjective",
        meaning: "có thể tái tạo",
        example: "Wind and solar power are forms of renewable energy.",
        exampleVi: "Năng lượng gió và mặt trời là các hình thức năng lượng có thể tái tạo.",
        synonyms: ["sustainable", "inexhaustible"],
        collocations: ["renewable energy", "renewable resources"],
        wordFamily: ["renew (v)", "renewal (n)"],
        commonMistakes: ["Tránh nhầm với 'usable' hoặc 'recyclable' (có thể tái chế)."]
      },
      {
        word: "catastrophe",
        phonetic: "/kəˈtæstrəfi/",
        partOfSpeech: "noun",
        meaning: "thảm họa",
        example: "Climate change could lead to an environmental catastrophe.",
        exampleVi: "Biến đổi khí hậu có thể dẫn đến một thảm họa môi trường.",
        synonyms: ["disaster", "calamity", "tragedy"],
        collocations: ["natural catastrophe", "prevent a catastrophe"],
        wordFamily: ["catastrophic (adj)", "catastrophically (adv)"],
        commonMistakes: ["Phát âm âm cuối là /fi/, không phải /f/ hay /ph/."]
      },
      {
        word: "greenhouse effect",
        phonetic: "/ˈɡriːnhaʊs ɪˈfekt/",
        partOfSpeech: "phrase",
        meaning: "hiệu ứng nhà kính",
        example: "The greenhouse effect is causing global temperatures to rise.",
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
    status: ContentStatus.PUBLISHED,
    words: [
      {
        word: "curriculum",
        phonetic: "/kəˈrɪkjələm/",
        partOfSpeech: "noun",
        meaning: "chương trình học",
        example: "The school is planning to introduce a new science curriculum next year.",
        exampleVi: "Trường đang lập kế hoạch đưa vào một chương trình học khoa học mới vào năm tới.",
        synonyms: ["syllabus", "course of study"],
        collocations: ["school curriculum", "core curriculum", "design curriculum"],
        wordFamily: ["curricular (adj)"],
        commonMistakes: ["Số nhiều bất quy tắc là 'curricula' hoặc 'curriculums'."]
      },
      {
        word: "evaluate",
        phonetic: "/ɪˈvæljueɪt/",
        partOfSpeech: "verb",
        meaning: "đánh giá, định giá",
        example: "The exams are used to evaluate students' progress over the semester.",
        exampleVi: "Các kỳ thi được sử dụng để đánh giá sự tiến bộ của học viên trong suốt học kỳ.",
        synonyms: ["assess", "appraise", "estimate"],
        collocations: ["evaluate performance", "evaluate progress"],
        wordFamily: ["evaluation (n)", "evaluative (adj)"],
        commonMistakes: ["Tránh nhầm với 'value' (giá trị/trân trọng) hay 'validate' (xác thực)."]
      },
      {
        word: "academic",
        phonetic: "/ˌækəˈdemɪk/",
        partOfSpeech: "adjective",
        meaning: "thuộc học thuật, học tập",
        example: "She achieved high academic standards throughout her university career.",
        exampleVi: "Cô ấy đã đạt tiêu chuẩn học thuật cao trong suốt quá trình học đại học.",
        synonyms: ["educational", "scholarly", "intellectual"],
        collocations: ["academic performance", "academic year", "academic achievement"],
        wordFamily: ["academy (n)", "academically (adv)"],
        commonMistakes: ["Nhấn trọng âm rơi vào âm tiết thứ 3: /ˌækəˈdemɪk/."]
      },
      {
        word: "tuition fee",
        phonetic: "/tjuˈɪʃn fiː/",
        partOfSpeech: "phrase",
        meaning: "học phí",
        example: "The university has decided to increase tuition fees for international students.",
        exampleVi: "Trường đại học đã quyết định tăng học phí cho sinh viên quốc tế.",
        synonyms: ["education cost", "school fees"],
        collocations: ["pay tuition fees", "high tuition fees"],
        wordFamily: [],
        commonMistakes: ["Thường dùng số nhiều 'tuition fees' khi nói về tổng học phí phải đóng."]
      },
      {
        word: "pedagogy",
        phonetic: "/ˈpedəɡɒdʒi/",
        partOfSpeech: "noun",
        meaning: "sư phạm học, phương pháp giảng dạy",
        example: "Modern pedagogy focuses on student-centered learning methods.",
        exampleVi: "Sư phạm học hiện đại tập trung vào các phương pháp học lấy học viên làm trung tâm.",
        synonyms: ["teaching method", "didactics"],
        collocations: ["modern pedagogy", "pedagogical skills"],
        wordFamily: ["pedagogical (adj)"],
        commonMistakes: ["Từ nâng cao, dễ viết sai chính tả. Chú ý chữ 'o' ở giữa."]
      },
      {
        word: "scholarship",
        phonetic: "/ˈskɒləʃɪp/",
        partOfSpeech: "noun",
        meaning: "học bổng",
        example: "He won a full scholarship to study at Harvard University.",
        exampleVi: "Anh ấy đã giành được một học bổng toàn phần để học tại Đại học Harvard.",
        synonyms: ["grant", "financial aid"],
        collocations: ["apply for a scholarship", "award a scholarship"],
        wordFamily: ["scholar (n)"],
        commonMistakes: ["Scholarship là danh từ đếm được, dùng 'a scholarship' hoặc 'scholarships'."]
      },
      {
        word: "literacy",
        phonetic: "/ˈlɪtərəsi/",
        partOfSpeech: "noun",
        meaning: "sự biết chữ, khả năng đọc viết",
        example: "The government is working to improve adult literacy rates.",
        exampleVi: "Chính phủ đang nỗ lực cải thiện tỷ lệ biết chữ ở người lớn.",
        synonyms: ["ability to read and write"],
        collocations: ["computer literacy", "literacy rate", "financial literacy"],
        wordFamily: ["literate (adj)", "illiterate (adj/n)"],
        commonMistakes: ["Phân biệt với 'literature' (văn học)."]
      },
      {
        word: "discipline",
        phonetic: "/ˈdɪsəplɪn/",
        partOfSpeech: "noun",
        meaning: "kỷ luật",
        example: "Strict discipline is maintained in the school.",
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
    status: ContentStatus.PUBLISHED,
    words: [
      {
        word: "innovation",
        phonetic: "/ˌɪnəˈveɪʃn/",
        partOfSpeech: "noun",
        meaning: "sự đổi mới, sự cách tân",
        example: "Technological innovation is key to economic growth.",
        exampleVi: "Đổi mới công nghệ là chìa khóa cho sự tăng trưởng kinh tế.",
        synonyms: ["invention", "novelty", "advancement"],
        collocations: ["technological innovation", "encourage innovation"],
        wordFamily: ["innovate (v)", "innovative (adj)"],
        commonMistakes: ["Thường đi kèm với giới từ 'in' (innovation in technology)."]
      },
      {
        word: "artificial intelligence",
        phonetic: "/ˌɑːtɪˈfɪʃl ɪnˈtelɪɡəns/",
        partOfSpeech: "phrase",
        meaning: "trí tuệ nhân tạo (AI)",
        example: "Artificial intelligence is changing the way we work and live.",
        exampleVi: "Trí tuệ nhân tạo đang thay đổi cách chúng ta làm việc và sinh sống.",
        synonyms: ["machine intelligence", "AI"],
        collocations: ["develop artificial intelligence", "AI algorithms"],
        wordFamily: [],
        commonMistakes: ["Viết đúng chính tả từ 'intelligence' với hai chữ 'l'."]
      },
      {
        word: "automation",
        phonetic: "/ˌɔːtəˈmeɪʃn/",
        partOfSpeech: "noun",
        meaning: "sự tự động hóa",
        example: "Automation has led to job losses in the manufacturing sector.",
        exampleVi: "Tự động hóa đã dẫn đến việc mất việc làm trong ngành sản xuất.",
        synonyms: ["computerization", "mechanization"],
        collocations: ["factory automation", "process automation"],
        wordFamily: ["automate (v)", "automatic (adj)"],
        commonMistakes: ["Tránh nhầm với 'automobile' (ô tô)."]
      },
      {
        word: "cybersecurity",
        phonetic: "/ˌsaɪbəsɪˈkjʊərəti/",
        partOfSpeech: "noun",
        meaning: "an ninh mạng",
        example: "Companies need to invest more in cybersecurity to prevent hacking.",
        exampleVi: "Các công ty cần đầu tư nhiều hơn vào an ninh mạng để ngăn chặn tin tặc.",
        synonyms: ["information security", "digital protection"],
        collocations: ["cybersecurity threat", "cybersecurity measures"],
        wordFamily: [],
        commonMistakes: ["Viết liền một từ, không viết rời 'cyber security'."]
      },
      {
        word: "algorithm",
        phonetic: "/ˈælɡərɪðəm/",
        partOfSpeech: "noun",
        meaning: "thuật toán",
        example: "Social media feeds are determined by complex algorithms.",
        exampleVi: "Bảng tin mạng xã hội được quyết định bởi các thuật toán phức tạp.",
        synonyms: ["procedure", "formula", "systematic method"],
        collocations: ["search algorithm", "complex algorithm", "run an algorithm"],
        wordFamily: [],
        commonMistakes: ["Phát âm âm /ð/ rõ ràng, tránh nhầm sang âm /t/."]
      },
      {
        word: "obsolete",
        phonetic: "/ˈɒbsəliːt/",
        partOfSpeech: "adjective",
        meaning: "lỗi thời, không còn sử dụng",
        example: "Gas lamps became obsolete when electricity was introduced.",
        exampleVi: "Đèn ga trở nên lỗi thời khi điện được đưa vào sử dụng.",
        synonyms: ["outdated", "out of date", "old-fashioned"],
        collocations: ["render obsolete", "become obsolete"],
        wordFamily: ["obsolescence (n)"],
        commonMistakes: ["Tránh nhầm với 'absolute' (tuyệt đối)."]
      },
      {
        word: "breakthrough",
        phonetic: "/ˈbreɪkθruː/",
        partOfSpeech: "noun",
        meaning: "bước đột phá",
        example: "Scientists have made a major breakthrough in cancer research.",
        exampleVi: "Các nhà khoa học đã tạo ra một bước đột phá lớn trong nghiên cứu ung thư.",
        synonyms: ["major discovery", "leap", "revolution"],
        collocations: ["scientific breakthrough", "major breakthrough"],
        wordFamily: [],
        commonMistakes: ["Viết liền thành một từ, không có khoảng cách ở giữa."]
      },
      {
        word: "interface",
        phonetic: "/ˈɪntəfeɪs/",
        partOfSpeech: "noun",
        meaning: "giao diện",
        example: "The software has a user-friendly interface that is easy to navigate.",
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
    status: ContentStatus.PUBLISHED,
    words: [
      {
        word: "itinerary",
        phonetic: "/aɪˈtɪnərəri/",
        partOfSpeech: "noun",
        meaning: "lịch trình chuyến đi",
        example: "The travel agent provided us with a detailed itinerary for our trip.",
        exampleVi: "Đại lý du lịch đã cung cấp cho chúng tôi một lịch trình chi tiết cho chuyến đi.",
        synonyms: ["travel plan", "schedule", "route"],
        collocations: ["detailed itinerary", "planned itinerary"],
        wordFamily: [],
        commonMistakes: ["Từ này có phát âm khá phức tạp, chú ý âm /aɪ/ ở đầu."]
      },
      {
        word: "accommodation",
        phonetic: "/əˌkɒməˈdeɪʃn/",
        partOfSpeech: "noun",
        meaning: "chỗ ở, nơi lưu trú",
        example: "Hotel accommodation is included in the price of the package tour.",
        exampleVi: "Chỗ ở khách sạn được bao gồm trong giá của tour trọn gói.",
        synonyms: ["lodging", "housing", "quarters"],
        collocations: ["find accommodation", "temporary accommodation"],
        wordFamily: ["accommodate (v)"],
        commonMistakes: ["Viết đúng hai chữ 'c' và hai chữ 'm' (accommodation)."]
      },
      {
        word: "destination",
        phonetic: "/ˌdestɪˈneɪʃn/",
        partOfSpeech: "noun",
        meaning: "điểm đến",
        example: "Paris is one of the most popular tourist destinations in the world.",
        exampleVi: "Paris là một trong những điểm đến du lịch phổ biến nhất trên thế giới.",
        synonyms: ["goal", "target", "terminus"],
        collocations: ["holiday destination", "popular destination", "reach destination"],
        wordFamily: ["destine (v)"],
        commonMistakes: ["Phân biệt với 'destiny' (vận mệnh)."]
      },
      {
        word: "hospitality",
        phonetic: "/ˌhɒspɪˈtæləti/",
        partOfSpeech: "noun",
        meaning: "lòng hiếu khách, ngành dịch vụ nhà hàng khách sạn",
        example: "We were overwhelmed by the warmth and hospitality of the local people.",
        exampleVi: "Chúng tôi đã bị choáng ngợp bởi sự ấm áp và lòng hiếu khách của người dân địa phương.",
        synonyms: ["friendliness", "warm welcome"],
        collocations: ["warm hospitality", "hospitality industry"],
        wordFamily: ["hospitable (adj)"],
        commonMistakes: ["Tránh nhầm với 'hospital' (bệnh viện) về nghĩa."]
      },
      {
        word: "exotic",
        phonetic: "/ɪɡˈzɒtɪk/",
        partOfSpeech: "adjective",
        meaning: "kỳ lạ, ngoại lai (đẹp và độc đáo từ nước ngoài)",
        example: "She travels to exotic islands in the Pacific every summer.",
        exampleVi: "Cô ấy du lịch đến những hòn đảo kỳ lạ ở Thái Bình Dương mỗi mùa hè.",
        synonyms: ["unusual", "colorful", "foreign"],
        collocations: ["exotic plants", "exotic destination"],
        wordFamily: ["exotically (adv)"],
        commonMistakes: ["Thường dùng với nghĩa tích cực, thể hiện sự thu hút và khác biệt thú vị."]
      },
      {
        word: "ecotourism",
        phonetic: "/ˈiːkəʊtʊərɪzəm/",
        partOfSpeech: "noun",
        meaning: "du lịch sinh thái",
        example: "Ecotourism supports conservation efforts and helps local communities.",
        exampleVi: "Du lịch sinh thái hỗ trợ các nỗ lực bảo tồn và giúp đỡ cộng đồng địa phương.",
        synonyms: ["green travel", "sustainable tourism"],
        collocations: ["promote ecotourism", "ecotourism project"],
        wordFamily: [],
        commonMistakes: ["Viết liền một từ, không viết rời 'eco tourism'."]
      },
      {
        word: "spectacular",
        phonetic: "/spekˈtækjələ(r)/",
        partOfSpeech: "adjective",
        meaning: "ngoạn mục, hùng vĩ",
        example: "The view from the top of the mountain was spectacular.",
        exampleVi: "Tầm nhìn từ đỉnh núi thật ngoạn mục.",
        synonyms: ["magnificent", "breathtaking", "stunning"],
        collocations: ["spectacular view", "spectacular scenery"],
        wordFamily: ["spectacle (n)", "spectacularly (adv)"],
        commonMistakes: ["Thường dùng cho cảnh sắc thiên nhiên hoặc màn trình diễn ấn tượng."]
      },
      {
        word: "souvenir",
        phonetic: "/ˌsuːvəˈnɪə(r)/",
        partOfSpeech: "noun",
        meaning: "quà lưu niệm",
        example: "I bought a model of the Eiffel Tower as a souvenir of Paris.",
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
    status: ContentStatus.PUBLISHED,
    words: [
      {
        word: "well-being",
        phonetic: "/ˈwel biːɪŋ/",
        partOfSpeech: "noun",
        meaning: "sự khỏe mạnh, trạng thái hạnh phúc",
        example: "Physical exercise is important for emotional well-being.",
        exampleVi: "Tập thể dục thể chất rất quan trọng đối với sức khỏe cảm xúc.",
        synonyms: ["welfare", "healthiness", "happiness"],
        collocations: ["general well-being", "promote well-being"],
        wordFamily: [],
        commonMistakes: ["Thường viết với dấu gạch ngang 'well-being'."]
      },
      {
        word: "nutrition",
        phonetic: "/njuˈtrɪʃn/",
        partOfSpeech: "noun",
        meaning: "dinh dưỡng",
        example: "Good nutrition is essential for a healthy lifestyle.",
        exampleVi: "Dinh dưỡng tốt là cần thiết cho một lối sống lành mạnh.",
        synonyms: ["nourishment", "foodstuff"],
        collocations: ["poor nutrition", "child nutrition", "diet and nutrition"],
        wordFamily: ["nutrient (n)", "nutritious (adj)", "nutritional (adj)"],
        commonMistakes: ["Phân biệt với 'nutrient' (chất dinh dưỡng cụ thể)."]
      },
      {
        word: "prevention",
        phonetic: "/prɪˈvenʃn/",
        partOfSpeech: "noun",
        meaning: "sự ngăn ngừa, phòng bệnh",
        example: "The government focuses on the prevention of infectious diseases.",
        exampleVi: "Chính phủ tập trung vào việc phòng ngừa các bệnh truyền nhiễm.",
        synonyms: ["avoidance", "deterrence", "safeguard"],
        collocations: ["disease prevention", "prevention program"],
        wordFamily: ["prevent (v)", "preventative (adj)"],
        commonMistakes: ["Đi kèm câu thành ngữ: 'Prevention is better than cure' (Phòng bệnh hơn chữa bệnh)."]
      },
      {
        word: "chronic",
        phonetic: "/ˈkrɒnɪk/",
        partOfSpeech: "adjective",
        meaning: "mãn tính, kéo dài dai dẳng",
        example: "He suffers from chronic back pain.",
        exampleVi: "Anh ấy phải chịu đựng chứng đau lưng mãn tính.",
        synonyms: ["long-lasting", "persistent", "incurable"],
        collocations: ["chronic illness", "chronic disease", "chronic pain"],
        wordFamily: ["chronically (adv)"],
        commonMistakes: ["Tránh nhầm với 'acute' (cấp tính, xảy ra đột ngột dữ dội)."]
      },
      {
        word: "immune system",
        phonetic: "/ɪˈmjuːn ˌsɪstəm/",
        partOfSpeech: "phrase",
        meaning: "hệ miễn dịch",
        example: "Vitamin C helps to boost your body's immune system.",
        exampleVi: "Vitamin C giúp tăng cường hệ miễn dịch của cơ thể bạn.",
        synonyms: ["defense mechanism"],
        collocations: ["strengthen the immune system", "weak immune system"],
        wordFamily: ["immunity (n)", "immunize (v)"],
        commonMistakes: ["Viết đúng chính tả từ 'immune' kết thúc bằng chữ 'e'."]
      },
      {
        word: "symptom",
        phonetic: "/ˈsɪmptəm/",
        partOfSpeech: "noun",
        meaning: "triệu chứng",
        example: "Common symptoms of flu include fever and a runny nose.",
        exampleVi: "Các triệu chứng phổ biến của bệnh cúm bao gồm sốt và chảy nước mũi.",
        synonyms: ["sign", "indication", "manifestation"],
        collocations: ["early symptoms", "experience symptoms", "symptom relief"],
        wordFamily: ["symptomatic (adj)"],
        commonMistakes: ["Chữ 'p' câm hoặc phát âm rất nhẹ: /ˈsɪmptəm/."]
      },
      {
        word: "sedentary",
        phonetic: "/ˈsedntri/",
        partOfSpeech: "adjective",
        meaning: "ít vận động, ngồi nhiều",
        example: "A sedentary lifestyle can lead to obesity and heart disease.",
        exampleVi: "Lối sống ít vận động có thể dẫn đến béo phì và bệnh tim.",
        synonyms: ["inactive", "desk-bound", "sitting"],
        collocations: ["sedentary lifestyle", "sedentary job"],
        wordFamily: [],
        commonMistakes: ["Thường đi kèm với cụm từ 'sedentary lifestyle'."]
      },
      {
        word: "epidemic",
        phonetic: "/ˌepɪˈdemɪk/",
        partOfSpeech: "noun",
        meaning: "dịch bệnh",
        example: "Health officials are working to control the cholera epidemic.",
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
    status: ContentStatus.PUBLISHED,
    words: [
      {
        word: "employment",
        phonetic: "/ɪmˈplɔɪmənt/",
        partOfSpeech: "noun",
        meaning: "việc làm, sự thuê mướn",
        example: "The government aims to achieve full employment.",
        exampleVi: "Chính phủ đặt mục tiêu đạt được sự giải quyết việc làm đầy đủ.",
        synonyms: ["jobs", "work", "occupation"],
        collocations: ["seek employment", "gainful employment", "employment contract"],
        wordFamily: ["employ (v)", "employee (n)", "employer (n)", "unemployment (n)"],
        commonMistakes: ["Không dùng 'employments' ở dạng số nhiều đếm được."]
      },
      {
        word: "productivity",
        phonetic: "/ˌprɒdʌkˈtɪvəti/",
        partOfSpeech: "noun",
        meaning: "năng suất, hiệu suất làm việc",
        example: "New technology has greatly increased agricultural productivity.",
        exampleVi: "Công nghệ mới đã làm tăng đáng kể năng suất nông nghiệp.",
        synonyms: ["efficiency", "output", "yield"],
        collocations: ["increase productivity", "worker productivity", "high productivity"],
        wordFamily: ["produce (v)", "product (n)", "productive (adj)"],
        commonMistakes: ["Trọng âm rơi vào âm tiết thứ 3: /ˌprɒdʌkˈtɪvəti/."]
      },
      {
        word: "promote",
        phonetic: "/prəˈməʊt/",
        partOfSpeech: "verb",
        meaning: "thăng chức, thúc đẩy quảng bá",
        example: "He was promoted to senior manager after just one year.",
        exampleVi: "Anh ấy đã được thăng chức lên quản lý cấp cao chỉ sau một năm.",
        synonyms: ["elevate", "advance", "encourage"],
        collocations: ["get promoted", "promote a product", "promote growth"],
        wordFamily: ["promotion (n)"],
        commonMistakes: ["Khi mang nghĩa thăng chức thường dùng dạng bị động 'be promoted to'."]
      },
      {
        word: "collaborate",
        phonetic: "/kəˈlæbəreɪt/",
        partOfSpeech: "verb",
        meaning: "cộng tác, hợp tác",
        example: "Researchers from different departments collaborated on the project.",
        exampleVi: "Các nhà nghiên cứu từ các phòng ban khác nhau đã hợp tác trong dự án.",
        synonyms: ["cooperate", "work together", "team up"],
        collocations: ["collaborate with someone", "collaborate on a project"],
        wordFamily: ["collaboration (n)", "collaborative (adj)"],
        commonMistakes: ["Học cách đi giới từ đúng: 'collaborate with' (ai đó) và 'collaborate on' (dự án/công việc)."]
      },
      {
        word: "vacancy",
        phonetic: "/ˈveɪkənsi/",
        partOfSpeech: "noun",
        meaning: "vị trí còn trống, phòng trống",
        example: "The company has a vacancy for a software developer.",
        exampleVi: "Công ty đang có một vị trí tuyển dụng trống cho nhà phát triển phần mềm.",
        synonyms: ["job opening", "empty position"],
        collocations: ["job vacancy", "fill a vacancy", "advertise a vacancy"],
        wordFamily: ["vacant (adj)"],
        commonMistakes: ["Số nhiều chuyển 'y' thành 'i' và thêm 'es' (vacancies)."]
      },
      {
        word: "entrepreneur",
        phonetic: "/ˌɒntrəprəˈnɜː(r)/",
        partOfSpeech: "noun",
        meaning: "nhà khởi nghiệp, doanh nhân",
        example: "She is a successful entrepreneur who started her own fashion brand.",
        exampleVi: "Cô ấy là một nhà khởi nghiệp thành công, người đã thành lập thương hiệu thời trang riêng của mình.",
        synonyms: ["business owner", "founder", "industrialist"],
        collocations: ["budding entrepreneur", "successful entrepreneur"],
        wordFamily: ["entrepreneurial (adj)", "entrepreneurship (n)"],
        commonMistakes: ["Cách viết rất phức tạp mượn từ tiếng Pháp. Lưu ý phát âm /ˌɒntrəprəˈnɜː(r)/."]
      },
      {
        word: "qualification",
        phonetic: "/ˌkwɒlɪfɪˈkeɪʃn/",
        partOfSpeech: "noun",
        meaning: "bằng cấp, trình độ chuyên môn",
        example: "She has the academic qualifications necessary for the job.",
        exampleVi: "Cô ấy có những bằng cấp học thuật cần thiết cho công việc này.",
        synonyms: ["degree", "certificate", "credentials"],
        collocations: ["academic qualifications", "gain qualifications", "professional qualifications"],
        wordFamily: ["qualify (v)", "qualified (adj)"],
        commonMistakes: ["Thường dùng số nhiều 'qualifications' khi nói về hồ sơ năng lực tuyển dụng."]
      },
      {
        word: "salary",
        phonetic: "/ˈsæləri/",
        partOfSpeech: "noun",
        meaning: "lương tháng",
        example: "The job offers an attractive salary and excellent benefits.",
        exampleVi: "Công việc này đưa ra mức lương hấp dẫn và các chế độ đãi ngộ tuyệt vời.",
        synonyms: ["wage (lương tuần/ngày)", "earnings", "income"],
        collocations: ["attractive salary", "annual salary", "negotiable salary"],
        wordFamily: ["salaried (adj)"],
        commonMistakes: ["Phân biệt với 'wage' (tiền công tính theo giờ/ngày/tuần của lao động chân tay)."]
      }
    ]
  }
];
