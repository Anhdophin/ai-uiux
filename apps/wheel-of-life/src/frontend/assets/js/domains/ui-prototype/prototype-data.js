/*
  Demo semantic content for the UI domain.
  Keep keys short, stable, and language-neutral.
  UI text stays in locale objects.
*/
export const ICONS = {
  direction: "i-compass",
  career: "i-briefcase",
  growth: "i-growth",
  finance: "i-wallet",
  energy: "i-heart",
  identity: "i-spark",
  user: "i-user",
  time: "i-time",
  home: "i-home",
  note: "i-note",
  wheel: "i-ring",
  play: "i-play",
  settings: "i-gear",
  arrow: "i-arrow-right"
};

const t = (en, vi) => ({ en, vi });

export const LOCALES = ["en", "vi"];

export const TOPICS = [
  { key: "topic.direction", icon: ICONS.direction, label: t("Direction", "Hướng") },
  { key: "topic.career", icon: ICONS.career, label: t("Career", "Nghề") },
  { key: "topic.finance", icon: ICONS.finance, label: t("Money", "Tiền") },
  { key: "topic.energy", icon: ICONS.energy, label: t("Energy", "Năng lượng") },
  { key: "topic.identity", icon: ICONS.identity, label: t("Identity", "Căn tính") }
];

export const CONTEXTS = [
  { key: "ctx.working", icon: ICONS.user, label: t("Working", "Đi làm") },
  { key: "ctx.transition", icon: ICONS.direction, label: t("Transition", "Chuyển") },
  { key: "ctx.builder", icon: ICONS.growth, label: t("Builder", "Xây") },
  { key: "ctx.money", icon: ICONS.finance, label: t("Pressure", "Áp lực") },
  { key: "ctx.time", icon: ICONS.time, label: t("Time", "Thời gian") },
  { key: "ctx.home", icon: ICONS.home, label: t("Home", "Gia đình") }
];

export const QUICK_ACTIONS = [
  { key: "quick.topic", icon: ICONS.direction, label: t("Topic", "Topic") },
  { key: "quick.context", icon: ICONS.user, label: t("Context", "Bối cảnh") },
  { key: "quick.pick", icon: ICONS.note, label: t("Picks", "Chọn") }
];

export const TOPIC_DETAILS = {
  "topic.direction": {
    heroTitle: t("Direction", "Hướng đi"),
    heroSubtitle: t("unclear but active", "đang tìm nhưng chưa rõ"),
    feelings: [
      { key: "feel.blur", icon: ICONS.direction, label: t("Blur", "Mơ hồ"), detail: t("Path is active, but still not sharp enough.", "Đường đi đang có nhưng vẫn chưa đủ rõ."), metrics: ["direction", "identity"] },
      { key: "feel.stuck", icon: ICONS.career, label: t("Stuck", "Mắc"), detail: t("Effort exists, progress feels slow.", "Có cố nhưng tiến độ vẫn chậm."), metrics: ["career", "direction"] },
      { key: "feel.fomo", icon: ICONS.growth, label: t("FOMO", "Sợ chậm"), detail: t("Other people seem to move faster than you.", "Người khác có vẻ đang đi nhanh hơn."), metrics: ["identity", "direction"] },
      { key: "feel.split", icon: ICONS.time, label: t("Split", "Phân tán"), detail: t("Attention is spread across too many lanes.", "Sự chú ý đang bị chia quá nhiều lane."), metrics: ["time", "energy"] }
    ],
    keywords: {
      "feel.blur": [
        { key: "kw.no-roadmap", icon: ICONS.direction, label: t("No map", "Thiếu lộ trình"), detail: t("You cannot see the practical route.", "Anh chưa nhìn ra đường đi thực tế."), metrics: ["direction", "career"] },
        { key: "kw.no-benchmark", icon: ICONS.growth, label: t("No benchmark", "Thiếu chuẩn"), detail: t("Progress is hard to read without a benchmark.", "Thiếu chuẩn để đo tiến triển."), metrics: ["growth", "direction"] },
        { key: "kw.too-many", icon: ICONS.time, label: t("Too many", "Quá nhiều"), detail: t("Too many possible routes compete at once.", "Có quá nhiều hướng cùng kéo một lúc."), metrics: ["time", "focus"] }
      ],
      "feel.stuck": [
        { key: "kw.no-feedback", icon: ICONS.note, label: t("No feedback", "Thiếu feedback"), detail: t("There is not enough signal to adjust your direction.", "Thiếu tín hiệu để chỉnh hướng."), metrics: ["career", "environment"] },
        { key: "kw.low-stretch", icon: ICONS.career, label: t("Low stretch", "Việc dễ"), detail: t("The role does not stretch your range enough.", "Vai trò hiện tại chưa đủ căng."), metrics: ["career", "growth"] },
        { key: "kw.fear-apply", icon: ICONS.identity, label: t("Fear apply", "Sợ nhảy"), detail: t("You want movement but hesitate to make the jump.", "Muốn chuyển nhưng còn ngại nhảy."), metrics: ["identity", "career"] }
      ],
      "feel.fomo": [
        { key: "kw.compare-peers", icon: ICONS.user, label: t("Peers", "So người"), detail: t("You read your own value through peer speed.", "Đo giá trị bản thân qua tốc độ người khác."), metrics: ["identity", "mind"] },
        { key: "kw.trend", icon: ICONS.growth, label: t("Trend", "Chạy trend"), detail: t("You chase what looks hot instead of stable.", "Chạy theo thứ đang hot hơn là thứ bền."), metrics: ["direction", "focus"] },
        { key: "kw.rush", icon: ICONS.time, label: t("Rush", "Chọn vội"), detail: t("Urgency pushes a choice before clarity forms.", "Sự gấp gáp đẩy quyết định quá sớm."), metrics: ["direction", "time"] }
      ],
      "feel.split": [
        { key: "kw.roles", icon: ICONS.home, label: t("Roles", "Nhiều vai"), detail: t("Too many roles compete for the same attention.", "Nhiều vai trò cùng tranh một phần chú ý."), metrics: ["time", "energy"] },
        { key: "kw.loops", icon: ICONS.note, label: t("Open loops", "Việc treo"), detail: t("Unfinished work keeps pulling your mind.", "Việc dở dang liên tục kéo sự chú ý."), metrics: ["mind", "focus"] },
        { key: "kw.priority", icon: ICONS.wheel, label: t("Priority", "Ưu tiên"), detail: t("Priority exists, but not in your daily structure.", "Có ưu tiên nhưng chưa thành cấu trúc hằng ngày."), metrics: ["direction", "routine"] }
      ]
    },
    deeper: {
      "kw.no-roadmap": [
        { key: "deep.no-model", icon: ICONS.note, label: t("No model", "Thiếu mẫu"), detail: t("You do not have a believable path model yet.", "Chưa có mẫu đường đi thấy thật với mình."), metrics: ["career"] },
        { key: "deep.no-next", icon: ICONS.arrow, label: t("No next", "Thiếu bước"), detail: t("You vaguely know the destination but not the next step.", "Mơ hồ điểm đến nhưng chưa thấy bước kế tiếp."), metrics: ["direction"] }
      ],
      "kw.fear-apply": [
        { key: "deep.low-proof", icon: ICONS.identity, label: t("Low proof", "Thiếu bằng"), detail: t("Your proof of ability still feels weak.", "Bằng chứng năng lực còn chưa đủ chắc."), metrics: ["identity"] },
        { key: "deep.risk", icon: ICONS.finance, label: t("Risk", "Rủi ro"), detail: t("Stability still matters too much to ignore.", "Ổn định vẫn quan trọng nên khó bỏ qua."), metrics: ["finance"] }
      ]
    }
  },
  "topic.career": {
    heroTitle: t("Career", "Sự nghiệp"),
    heroSubtitle: t("skill, role, market", "skill, vai trò, thị trường"),
    feelings: [
      { key: "feel.flat", icon: ICONS.career, label: t("Flat", "Lì"), detail: t("Career motion exists, but depth does not rise enough.", "Vẫn đi làm nhưng độ sâu nghề chưa lên đủ."), metrics: ["career", "growth"] },
      { key: "feel.lowvalue", icon: ICONS.finance, label: t("Value", "Giá trị"), detail: t("You question how the market sees your worth.", "Anh đang nghi ngờ thị trường nhìn giá trị mình ra sao."), metrics: ["career", "finance"] },
      { key: "feel.reset", icon: ICONS.direction, label: t("Reset", "Reset"), detail: t("You want a reset without breaking stability.", "Muốn reset nhưng không làm gãy ổn định."), metrics: ["career", "identity"] }
    ],
    keywords: {
      "feel.flat": [
        { key: "kw.plateau", icon: ICONS.growth, label: t("Plateau", "Khựng"), detail: t("Skill growth has slowed and feels repetitive.", "Skill đang khựng và lặp lại."), metrics: ["career", "growth"] },
        { key: "kw.no-hard", icon: ICONS.career, label: t("No stretch", "Thiếu căng"), detail: t("You are not getting work that sharpens you.", "Chưa có việc kéo mình sắc lên."), metrics: ["career"] },
        { key: "kw.no-mentor", icon: ICONS.user, label: t("No mentor", "Thiếu dẫn"), detail: t("There is not enough high-signal guidance nearby.", "Xung quanh chưa có dẫn dắt đủ chất lượng."), metrics: ["environment"] }
      ],
      "feel.lowvalue": [
        { key: "kw.salary", icon: ICONS.finance, label: t("Salary", "Lương"), detail: t("Compensation feels behind role depth.", "Lương có vẻ đi sau độ sâu vai trò."), metrics: ["finance"] },
        { key: "kw.portfolio", icon: ICONS.note, label: t("Portfolio", "Hồ sơ"), detail: t("Visible proof does not represent actual skill enough.", "Phần chứng minh ra ngoài chưa đủ sát năng lực thật."), metrics: ["career", "identity"] },
        { key: "kw.market", icon: ICONS.direction, label: t("Market", "Thị trường"), detail: t("You need a cleaner read on where demand is moving.", "Cần nhìn rõ hơn thị trường đang dịch chuyển ra sao."), metrics: ["career", "direction"] }
      ],
      "feel.reset": [
        { key: "kw.transfer", icon: ICONS.growth, label: t("Transfer", "Chuyển skill"), detail: t("You need to know which skills transfer cleanly.", "Cần biết skill nào chuyển lane được rõ nhất."), metrics: ["career", "identity"] },
        { key: "kw.timing", icon: ICONS.time, label: t("Timing", "Thời điểm"), detail: t("Reset depends on timing as much as desire.", "Reset không chỉ là muốn mà còn là thời điểm."), metrics: ["time", "finance"] },
        { key: "kw.trust", icon: ICONS.identity, label: t("Trust", "Tự tin"), detail: t("Confidence rebuild is part of the move itself.", "Khôi phục tự tin là một phần của chuyển đổi."), metrics: ["identity"] }
      ]
    },
    deeper: {}
  },
  "topic.finance": {
    heroTitle: t("Money", "Tài chính"),
    heroSubtitle: t("pressure, runway, options", "áp lực, runway, lựa chọn"),
    feelings: [
      { key: "feel.tight", icon: ICONS.finance, label: t("Tight", "Căng"), detail: t("Money pressure is shaping the quality of your decisions.", "Áp lực tiền đang ảnh hưởng chất lượng quyết định."), metrics: ["finance", "time"] },
      { key: "feel.risk", icon: ICONS.direction, label: t("Risk", "Rủi ro"), detail: t("Every move feels more risky without enough buffer.", "Mọi bước đi đều thấy rủi ro hơn vì thiếu vùng đệm."), metrics: ["finance", "direction"] },
      { key: "feel.runway", icon: ICONS.growth, label: t("Runway", "Đường băng"), detail: t("You need a cleaner runway to support growth choices.", "Cần một đường băng sạch hơn để nâng đỡ lựa chọn phát triển."), metrics: ["finance", "growth"] }
    ],
    keywords: {
      "feel.tight": [
        { key: "kw.cashflow", icon: ICONS.finance, label: t("Cashflow", "Dòng tiền"), detail: t("Incoming and outgoing money still feel too close.", "Tiền vào và tiền ra vẫn quá sát nhau."), metrics: ["finance"] },
        { key: "kw.buffer", icon: ICONS.direction, label: t("Buffer", "Vùng đệm"), detail: t("Your buffer is too thin to support change.", "Vùng đệm còn quá mỏng để chịu thay đổi."), metrics: ["finance", "direction"] },
        { key: "kw.tradeoff", icon: ICONS.note, label: t("Tradeoff", "Đánh đổi"), detail: t("You are paying for movement with peace of mind.", "Đang dùng sự yên tâm để trả giá cho chuyển động."), metrics: ["finance", "energy"] }
      ]
    },
    deeper: {}
  },
  "topic.energy": {
    heroTitle: t("Energy", "Năng lượng"),
    heroSubtitle: t("focus, recovery, pace", "tập trung, hồi phục, nhịp"),
    feelings: [
      { key: "feel.low", icon: ICONS.energy, label: t("Low", "Thấp"), detail: t("Energy is not matching the load you carry.", "Năng lượng đang không theo kịp tải đang gánh."), metrics: ["energy", "time"] },
      { key: "feel.fragile", icon: ICONS.identity, label: t("Fragile", "Mỏng"), detail: t("Momentum breaks too easily.", "Đà tiến rất dễ bị gãy."), metrics: ["energy", "identity"] },
      { key: "feel.noisy", icon: ICONS.note, label: t("Noisy", "Nhiễu"), detail: t("Your inner channel stays noisy for too long.", "Kênh bên trong bị nhiễu quá lâu."), metrics: ["mind", "energy"] }
    ],
    keywords: {
      "feel.low": [
        { key: "kw.sleep", icon: ICONS.time, label: t("Sleep", "Ngủ"), detail: t("Recovery quality is too low.", "Chất lượng hồi phục còn thấp."), metrics: ["energy"] },
        { key: "kw.pace", icon: ICONS.direction, label: t("Pace", "Nhịp"), detail: t("Your pace is not sustainable yet.", "Nhịp hiện tại chưa bền."), metrics: ["energy", "time"] },
        { key: "kw.load", icon: ICONS.home, label: t("Load", "Tải"), detail: t("Your current load is higher than your operating range.", "Tải hiện tại đang cao hơn vùng vận hành của mình."), metrics: ["energy", "home"] }
      ]
    },
    deeper: {}
  },
  "topic.identity": {
    heroTitle: t("Identity", "Căn tính"),
    heroSubtitle: t("trust, image, inner voice", "niềm tin, hình ảnh, tiếng nói bên trong"),
    feelings: [
      { key: "feel.small", icon: ICONS.identity, label: t("Small", "Nhỏ"), detail: t("You shrink yourself before testing the real edge.", "Anh tự thu nhỏ mình trước khi chạm mép thật."), metrics: ["identity"] },
      { key: "feel.split-self", icon: ICONS.user, label: t("Split", "Chia đôi"), detail: t("What you show and what you feel are not aligned.", "Phần thể hiện ra và phần cảm nhận bên trong chưa khớp."), metrics: ["identity", "mind"] },
      { key: "feel.prove", icon: ICONS.growth, label: t("Prove", "Phải chứng"), detail: t("You are still trying to earn permission to move.", "Anh còn đang cố xin phép để được tiến lên."), metrics: ["identity", "career"] }
    ],
    keywords: {
      "feel.small": [
        { key: "kw.low-proof-id", icon: ICONS.note, label: t("Proof", "Bằng chứng"), detail: t("You do not trust your own proof yet.", "Chưa tin vào bằng chứng của chính mình."), metrics: ["identity"] },
        { key: "kw.borrowed-voice", icon: ICONS.user, label: t("Borrowed", "Mượn giọng"), detail: t("You speak in borrowed standards more than your own.", "Đang nói bằng tiêu chuẩn mượn từ bên ngoài nhiều hơn của mình."), metrics: ["identity", "mind"] },
        { key: "kw.permission", icon: ICONS.direction, label: t("Permission", "Xin phép"), detail: t("You wait too long for an external green light.", "Đợi tín hiệu cho phép từ bên ngoài quá lâu."), metrics: ["identity", "direction"] }
      ]
    },
    deeper: {}
  }
};

export const WHEEL_SEGMENTS = [
  { key: "career", label: t("Career", "Nghề"), colorVar: "var(--ui-accent-blue)" },
  { key: "direction", label: t("Direction", "Hướng"), colorVar: "var(--ui-accent-violet)" },
  { key: "finance", label: t("Money", "Tiền"), colorVar: "var(--ui-accent-orange)" },
  { key: "energy", label: t("Energy", "Năng lượng"), colorVar: "var(--ui-accent-pink)" }
];

export const PROMPT_LIBRARY = {
  base: {
    question: t("Start where it feels closest.", "Bắt đầu ở chỗ thấy gần mình nhất."),
    options: [
      { key: "prompt.pick-feeling", icon: ICONS.note, label: t("Pick feeling", "Chọn cảm nhận"), target: { type: "feeling:first" } },
      { key: "prompt.pick-context", icon: ICONS.user, label: t("Pick context", "Chọn bối cảnh"), target: { type: "mobile-view", value: "context" } },
      { key: "prompt.view-wheel", icon: ICONS.wheel, label: t("See wheel", "Xem wheel"), target: { type: "mobile-view", value: "view" } }
    ]
  },
  feeling: {
    question: t("Which keyword is closer?", "Từ khóa nào gần hơn?"),
    options: [
      { key: "prompt.first-keyword", icon: ICONS.arrow, label: t("Open keyword", "Mở keyword"), target: { type: "keyword:first" } },
      { key: "prompt.another-feeling", icon: ICONS.note, label: t("Other feeling", "Cảm nhận khác"), target: { type: "clear-feeling" } },
      { key: "prompt.detail", icon: ICONS.play, label: t("Open detail", "Xem detail"), target: { type: "detail" } }
    ]
  },
  keyword: {
    question: t("Go deeper or move across?", "Đi sâu hơn hay chuyển ngang?"),
    options: [
      { key: "prompt.deep-first", icon: ICONS.arrow, label: t("Go deeper", "Đi sâu"), target: { type: "deeper:first" } },
      { key: "prompt.more-keys", icon: ICONS.note, label: t("More keys", "Thêm key"), target: { type: "keyword:next" } },
      { key: "prompt.view-now", icon: ICONS.wheel, label: t("View now", "Xem ngay"), target: { type: "mobile-view", value: "view" } }
    ]
  },
  deeper: {
    question: t("Hold this point or switch lane?", "Giữ điểm này hay chuyển lane?"),
    options: [
      { key: "prompt.keep", icon: ICONS.play, label: t("Hold", "Giữ"), target: { type: "detail" } },
      { key: "prompt.back-keyword", icon: ICONS.arrow, label: t("Back key", "Lùi key"), target: { type: "keyword:previous" } },
      { key: "prompt.new-topic", icon: ICONS.direction, label: t("New topic", "Topic mới"), target: { type: "topic:next" } }
    ]
  }
};
