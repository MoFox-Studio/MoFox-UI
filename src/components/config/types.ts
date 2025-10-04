export interface DatabaseConfigType {
  database_type: string;
  sqlite_path: string;
  mysql_host: string;
  mysql_port: number;
  mysql_database: string;
  mysql_user: string;
  mysql_password: string;
  mysql_charset: string;
  mysql_autocommit: boolean;
  mysql_sql_mode: string;
  connection_pool_size: number;
  connection_timeout: number;
}

export interface BotConfigType {
  platform: string;
  qq_account: number | string;
  nickname: string;
  alias_names: string[];
  command_prefixes: string[];
  allow_reply_self: boolean;
  max_context_size: number | string;
  thinking_timeout: number | string;
}

export interface PersonalityConfigType {
  personality_core: string;
  personality_side: string;
  identity: string;
  background_story: string;
  reply_style: string;
  chat_stream_id: string;
  use_expression: boolean;
  learn_expression: boolean;
  learning_strength: number;
  emoji_chance: number;
  max_reg_num: number;
  steal_emoji: boolean;
  emoji_selection_mode: string;
}

export interface SecurityConfigType {
  master_users: [string, string][];
  anti_injection: {
    enabled: boolean;
    process_mode: string;
    whitelist: string[];
    auto_ban_enabled: boolean;
    auto_ban_violation_threshold: number;
  };
}

export interface ApiProvider {
  name: string;
  base_url: string;
  api_key: string;
  timeout: number;
}

export interface Model {
  model_identifier: string;
  name: string;
  api_provider: string;
  price_in: number;
  price_out: number;
}

export interface ModelConfigType {
  providers: ApiProvider[];
  models: Model[];
  taskConfig: Record<string, string>;
}

export interface FeatureConfigType {
  relationship: {
    enable_relationship: boolean;
    relation_frequency: number;
  };
  memory: {
    enable_memory: boolean;
    memory_build_interval: number;
    min_memory_length: number;
    max_memory_length: number;
    enable_memory_forgetting: boolean;
    base_forgetting_days: number;
    critical_importance_bonus: number;
  };
  tools: {
    enable_tool: boolean;
  };
  mood: {
    enable_mood: boolean;
    mood_update_threshold: number;
  };
  knowledge: {
    enable: boolean;
    rag_synonym_search_top_k: number;
    qa_relation_threshold: number;
  };
  prompts: {
    image_prompt: string;
  };
}

export interface FullConfig {
  database: DatabaseConfigType;
  bot: BotConfigType;
  personality: PersonalityConfigType;
  security: SecurityConfigType;
  model: ModelConfigType;
  features: FeatureConfigType;
}