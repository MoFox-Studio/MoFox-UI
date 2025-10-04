import { FullConfig } from "./types";

export const defaultConfig: FullConfig = {
  database: {
    database_type: "sqlite",
    sqlite_path: "./data/mofox.db",
    mysql_host: "localhost",
    mysql_port: 3306,
    mysql_database: "mofox_bot",
    mysql_user: "root",
    mysql_password: "",
    mysql_charset: "utf8mb4",
    mysql_autocommit: true,
    mysql_sql_mode: "STRICT_TRANS_TABLES",
    connection_pool_size: 10,
    connection_timeout: 30,
  },
  bot: {
    platform: "qq",
    qq_account: "",
    nickname: "MoFox",
    alias_names: [],
    command_prefixes: ["/"],
    allow_reply_self: false,
    max_context_size: 10,
    thinking_timeout: 30,
  },
  personality: {
    personality_core: "积极向上的女大学生",
    personality_side: "活泼、好奇、善良",
    identity: "20岁的计算机专业女大学生，身高165cm，喜欢编程和游戏",
    background_story: "是一个热爱技术的大学生，平时喜欢研究新技术，也喜欢和朋友们一起玩游戏。性格开朗活泼，总是充满好奇心。",
    reply_style: "友好、自然、略带俏皮",
    chat_stream_id: "default_stream",
    use_expression: true,
    learn_expression: true,
    learning_strength: 0.7,
    emoji_chance: 0.3,
    max_reg_num: 100,
    steal_emoji: false,
    emoji_selection_mode: "emotion",
  },
  security: {
    master_users: [],
    anti_injection: {
      enabled: true,
      process_mode: "strict",
      whitelist: [],
      auto_ban_enabled: true,
      auto_ban_violation_threshold: 3,
    },
  },
  model: {
    providers: [],
    models: [],
    taskConfig: {},
  },
  features: {
    relationship: {
      enable_relationship: true,
      relation_frequency: 0.5,
    },
    memory: {
      enable_memory: true,
      memory_build_interval: 3600,
      min_memory_length: 50,
      max_memory_length: 500,
      enable_memory_forgetting: true,
      base_forgetting_days: 30,
      critical_importance_bonus: 7,
    },
    tools: {
      enable_tool: true,
    },
    mood: {
      enable_mood: true,
      mood_update_threshold: 0.3,
    },
    knowledge: {
      enable: true,
      rag_synonym_search_top_k: 5,
      qa_relation_threshold: 0.8,
    },
    prompts: {
      image_prompt: "请描述这张图片的内容，包括主要物体、场景、颜色和氛围。",
    }
  }
};