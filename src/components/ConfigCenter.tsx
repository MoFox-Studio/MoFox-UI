import { useState } from 'react';
import { motion } from 'motion/react';
import { Save } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { useLanguage } from '../i18n/LanguageContext';
import { DatabaseSystemCard } from './config/DatabaseSystemCard';
import { BotIdentityPermissionsCard } from './config/BotIdentityPermissionsCard';
import { AIPersonalityCard } from './config/AIPersonalityCard';
import { ChatInteractionLogicCard } from './config/ChatInteractionLogicCard';
import { RelationshipMemoryCard } from './config/RelationshipMemoryCard';
import { SecurityModulesCard } from './config/SecurityModulesCard';
import { ContentGenerationCard } from './config/ContentGenerationCard';
import { ModelConfigCard } from './config/ModelConfigCard';

export function ConfigCenter() {
  const { t } = useLanguage();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
    toast.success(t.config.saveSuccess, {
      description: t.config.saveSuccess,
    });
  };

  const configCards = [
    { Component: DatabaseSystemCard, key: 'database' },
    { Component: BotIdentityPermissionsCard, key: 'identity' },
    { Component: AIPersonalityCard, key: 'personality' },
    { Component: ChatInteractionLogicCard, key: 'chat' },
    { Component: RelationshipMemoryCard, key: 'memory' },
    { Component: SecurityModulesCard, key: 'security' },
    { Component: ContentGenerationCard, key: 'content' },
    { Component: ModelConfigCard, key: 'model' },
  ];

  return (
    <div className="h-full overflow-auto p-8 relative">
      <div className="max-w-7xl mx-auto pb-24">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{t.config.title}</h1>
          <p className="text-muted-foreground mt-2">{t.nav.config}</p>
        </motion.div>

        {/* Configuration Cards */}
        <div className="space-y-6">
          {configCards.map(({ Component, key }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.05,
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              <Component />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Save Button */}
      <motion.div 
        className="fixed bottom-8 right-8 z-50"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Button
          onClick={handleSave}
          disabled={saving}
          className="glass-button bg-gradient-to-r from-primary via-secondary to-primary hover:opacity-90 rounded-full px-8 py-6 transition-all duration-300 shadow-2xl shadow-primary/15"
          style={{ fontWeight: 600, color: 'var(--glass-button-text)' }}
        >
          {saving ? (
            <>
              <motion.div 
                className="w-5 h-5 border-2 border-background border-t-transparent rounded-full mr-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              {t.common.saving}
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              {t.config.saveChanges}
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
