import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Search, 
  Download, 
  Github, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  ExternalLink,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface PluginManifest {
  name: string;
  description: string;
  version: string;
  author: string;
  license?: string;
  repository_url?: string;
  repositoryUrl?: string;
  categories?: string[];
  keywords?: string[];
}

interface Plugin {
  id: string;
  manifest: PluginManifest;
  createdAt: string;
}

interface ProcessedPlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  categories: string[];
  keywords: string[];
  repositoryUrl: string;
  tags: string[];
  createdAt: string;
}

export function PluginMarket() {
  const [plugins, setPlugins] = useState<ProcessedPlugin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode] = useState<'list'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPlugin, setSelectedPlugin] = useState<ProcessedPlugin | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  
  const itemsPerPage = 12;

  useEffect(() => {
    fetchPlugins();
  }, []);

  const fetchPlugins = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 同时获取 plugins.json 和 plugin_details.json
      const [pluginsResponse, detailsResponse] = await Promise.all([
        fetch('https://api.github.com/repos/minecraft1024a/MoFox-Plugin-Repo/contents/plugins.json'),
        fetch('https://api.github.com/repos/minecraft1024a/MoFox-Plugin-Repo/contents/plugin_details.json')
      ]);
      
      if (!pluginsResponse.ok || !detailsResponse.ok) {
        throw new Error('HTTP Error: 获取插件数据失败');
      }
      
      // 解析 plugins.json（包含完整的 repositoryUrl）
      const pluginsData = await pluginsResponse.json();
      const pluginsContent = decodeURIComponent(escape(atob(pluginsData.content)));
      const pluginsList: Array<{ id: string; repositoryUrl: string }> = JSON.parse(pluginsContent);
      
      // 创建 ID 到 repositoryUrl 的映射
      const repoUrlMap = new Map(
        pluginsList.map(p => [p.id, p.repositoryUrl])
      );
      
      // 解析 plugin_details.json（包含详细信息）
      const detailsData = await detailsResponse.json();
      const detailsContent = decodeURIComponent(escape(atob(detailsData.content)));
      const data: Plugin[] = JSON.parse(detailsContent);
      
      const processed = data.map((item) => {
        const manifest = item.manifest || {};
        
        // 优先使用 plugins.json 中的完整 URL，如果没有则从 manifest 中获取
        let repositoryUrl = repoUrlMap.get(item.id) || 
                           manifest.repository_url || 
                           manifest.repositoryUrl || 
                           manifest.repository || 
                           '';
        
        // 清理 URL
        repositoryUrl = repositoryUrl.toString().trim();
        
        console.log(`插件 ${manifest.name} 的仓库 URL:`, repositoryUrl);
        
        return {
          id: item.id,
          name: manifest.name,
          version: manifest.version,
          description: manifest.description,
          author: manifest.author || '未知作者',
          license: manifest.license || 'Unknown',
          categories: manifest.categories || [],
          keywords: manifest.keywords || [],
          repositoryUrl,
          tags: [...(manifest.categories || []), ...(manifest.keywords || [])].slice(0, 5),
          createdAt: item.createdAt
        };
      });
      
      setPlugins(processed);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取插件数据失败');
      console.error('获取插件数据失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPlugins = plugins
    .filter(plugin =>
      plugin.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.author?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    })
    .sort((a, b) => {
      const aHasRepo = !!a.repositoryUrl;
      const bHasRepo = !!b.repositoryUrl;
      if (aHasRepo && !bHasRepo) return -1;
      if (!aHasRepo && bHasRepo) return 1;
      return 0;
    });

  const totalPages = Math.ceil(filteredPlugins.length / itemsPerPage);
  const paginatedPlugins = filteredPlugins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToRepository = (plugin: ProcessedPlugin) => {
    if (!plugin.repositoryUrl) {
      console.warn('插件没有仓库链接:', plugin);
      return;
    }

    let url = plugin.repositoryUrl.trim();
    console.log('原始 URL:', url);
    
    // 如果不是完整的 URL，尝试补全
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // 如果是 github.com 开头，补全协议
      if (url.startsWith('github.com')) {
        url = `https://${url}`;
      }
      // 如果包含斜杠，假设是 GitHub 仓库路径
      else if (url.includes('/')) {
        url = `https://github.com/${url}`;
      }
      // 否则无法处理
      else {
        console.error('无法识别的仓库 URL 格式:', url);
        return;
      }
    }
    
    console.log('处理后的 URL:', url);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 text-primary" />
          </motion.div>
          <p className="text-muted-foreground">正在加载插件列表...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="w-12 h-12 text-error" />
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={fetchPlugins}>重试</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-auto p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <motion.div 
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-xl" />
              <Package className="w-7 h-7 text-white relative z-10" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                插件市场
              </h1>
              <p className="text-muted-foreground text-sm mt-1">探索和下载 MoFox 插件</p>
            </div>
          </div>
        </motion.div>

        {/* Search and Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 space-y-4 border border-border/50"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                <Search className="w-5 h-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder=""
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ paddingLeft: '2.5rem' }}
                className="w-full h-11 pr-4 rounded-lg border border-border/50 bg-background text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-base"
              />
            </div>
            
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              className="glass-hover px-4 py-2 h-11 rounded-lg border border-border/50 bg-card text-foreground focus:border-primary/50 transition-all cursor-pointer"
            >
              <option value="newest">从新到旧</option>
              <option value="oldest">从旧到新</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="w-4 h-4 text-primary/70" />
            <span>共找到 <span className="font-bold text-primary text-base">{filteredPlugins.length}</span> 个插件</span>
          </div>
        </motion.div>

        {/* Plugin List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
              {paginatedPlugins.map((plugin, index) => (
                <motion.div
                  key={plugin.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-2xl p-6 border border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                  onClick={() => setSelectedPlugin(plugin)}
                  whileHover={{ x: 6 }}
                >
                  {/* 背景装饰 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="flex items-center gap-6 relative z-10">
                    {/* 左侧图标 */}
                    <div className="shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/30 group-hover:scale-110 transition-transform duration-300">
                        <Package className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    
                    {/* 中间内容 */}
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-bold text-xl group-hover:text-primary transition-colors duration-300">
                          {plugin.name}
                        </h3>
                        <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/30">
                          v{plugin.version}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 leading-relaxed">{plugin.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="truncate font-medium">{plugin.author}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Calendar className="w-3.5 h-3.5 text-primary/70" />
                          <span>{formatDate(plugin.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* 右侧按钮 */}
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="default"
                        disabled={!plugin.repositoryUrl}
                        onClick={(e) => {
                          e.stopPropagation();
                          goToRepository(plugin);
                        }}
                        className="h-10 px-5 font-medium shadow-sm hover:shadow-md transition-shadow"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        仓库
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={!plugin.repositoryUrl}
                        onClick={(e) => {
                          e.stopPropagation();
                          goToRepository(plugin);
                        }}
                        className="h-10 px-4 border border-border hover:border-primary/50 hover:bg-primary/5"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center items-center gap-2"
          >
            <Button
              variant="ghost"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="glass-hover border border-border/50"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let page;
              if (totalPages <= 7) {
                page = i + 1;
              } else if (currentPage <= 4) {
                page = i + 1;
              } else if (currentPage >= totalPages - 3) {
                page = totalPages - 6 + i;
              } else {
                page = currentPage - 3 + i;
              }
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? '' : 'glass-hover border border-border/50'}
                >
                  {page}
                </Button>
              );
            })}
            
            <Button
              variant="ghost"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="glass-hover border border-border/50"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Plugin Details Modal */}
      <AnimatePresence>
        {selectedPlugin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPlugin(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-card rounded-2xl p-8 max-w-xl w-full max-h-[85vh] overflow-auto border border-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedPlugin.name}
                  </h2>
                  <p className="text-muted-foreground text-sm">by {selectedPlugin.author}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedPlugin(null)}
                  className="shrink-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="bg-muted/50 dark:bg-muted rounded-xl p-4 border border-border">
                  <h3 className="font-semibold mb-2 text-sm opacity-70">描述</h3>
                  <p className="leading-relaxed">{selectedPlugin.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 dark:bg-muted rounded-xl p-4 border border-border">
                    <h3 className="font-semibold mb-2 text-sm opacity-70">版本</h3>
                    <p className="font-mono text-lg">{selectedPlugin.version}</p>
                  </div>
                  <div className="bg-muted/50 dark:bg-muted rounded-xl p-4 border border-border">
                    <h3 className="font-semibold mb-2 text-sm opacity-70">许可证</h3>
                    <p>{selectedPlugin.license}</p>
                  </div>
                </div>

                <div className="bg-muted/50 dark:bg-muted rounded-xl p-4 border border-border">
                  <h3 className="font-semibold mb-2 text-sm opacity-70">上传时间</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{formatDate(selectedPlugin.createdAt)}</span>
                  </div>
                </div>

                {selectedPlugin.tags.length > 0 && (
                  <div className="bg-muted/50 dark:bg-muted rounded-xl p-4 border border-border">
                    <h3 className="font-semibold mb-3 text-sm opacity-70">标签</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlugin.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 rounded-lg text-sm bg-background/80 dark:bg-background border border-border"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1 h-11"
                    disabled={!selectedPlugin.repositoryUrl}
                    onClick={() => goToRepository(selectedPlugin)}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    查看仓库
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1 h-11 border border-border hover:border-primary/50 hover:bg-muted/50"
                    disabled={!selectedPlugin.repositoryUrl}
                    onClick={() => goToRepository(selectedPlugin)}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    下载插件
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
