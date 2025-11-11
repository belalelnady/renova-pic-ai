'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, SortAsc, X } from 'lucide-react';
import { useState } from 'react';

interface GalleryFiltersProps {
  aiTool: string;
  sortBy: string;
  search: string;
  onAiToolChange: (tool: string) => void;
  onSortByChange: (sort: string) => void;
  onSearchChange: (search: string) => void;
  photoCount: number;
}

const AI_TOOLS = [
  { value: 'all', key: 'all' },
  { value: 'visa', key: 'visaPhoto' },
  { value: 'absher', key: 'absherPhoto' },
  { value: 'saudi-look', key: 'saudiLook' },
  { value: 'baby', key: 'babyPhoto' }
];

const SORT_OPTIONS = [
  { value: 'newest', key: 'newest' },
  { value: 'oldest', key: 'oldest' },
  { value: 'alphabetical', key: 'alphabetical' }
];

export function GalleryFilters({
  aiTool,
  sortBy,
  search,
  onAiToolChange,
  onSortByChange,
  onSearchChange,
  photoCount
}: GalleryFiltersProps) {
  const t = useTranslations();
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = aiTool !== 'all' || search !== '';

  const clearFilters = () => {
    onAiToolChange('all');
    onSearchChange('');
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('gallery.searchPlaceholder')}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {search && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Filter and Sort Buttons */}
        <div className="flex gap-2">
          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {t('common.filter')}
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
                !
              </Badge>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700"
            >
              {t('common.clear')}
            </Button>
          )}
        </div>
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AI Tool Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('gallery.filterByTool')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {AI_TOOLS.map((tool) => (
                    <Button
                      key={tool.value}
                      size="sm"
                      variant={aiTool === tool.value ? "default" : "outline"}
                      onClick={() => onAiToolChange(tool.value)}
                    >
                      {tool.value === 'all' 
                        ? t('common.all') 
                        : t(`photo.${tool.key}`)
                      }
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <SortAsc className="w-4 h-4 inline mr-1" />
                  {t('gallery.sortBy')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      size="sm"
                      variant={sortBy === option.value ? "default" : "outline"}
                      onClick={() => onSortByChange(option.value)}
                    >
                      {t(`gallery.sortOptions.${option.key}`)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {photoCount} {photoCount === 1 ? t('gallery.photo') : t('gallery.photos')}
        </span>
        {hasActiveFilters && (
          <span className="text-blue-600">
            {t('gallery.filtered')}
          </span>
        )}
      </div>
    </div>
  );
}