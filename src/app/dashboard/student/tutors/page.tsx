'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, Button, Input, Avatar, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  Search,
  Filter,
  Star,
  Video,
  Clock,
  Globe,
  ChevronDown,
  X,
} from 'lucide-react';

interface Tutor {
  id: string;
  name: string;
  avatar?: string;
  country: string;
  accent: 'kenyan' | 'tanzanian' | 'standard';
  rating: number;
  totalSessions: number;
  pricePerMinute: number;
  isOnline: boolean;
  bio: string;
  languages: string[];
}

const mockTutors: Tutor[] = [
  {
    id: '1',
    name: 'Grace Wanjiku',
    country: 'Kenya',
    accent: 'kenyan',
    rating: 4.9,
    totalSessions: 234,
    pricePerMinute: 45,
    isOnline: true,
    bio: 'Native Swahili speaker from Nairobi with 5+ years of teaching experience. Specializing in conversational Swahili and business communication.',
    languages: ['Swahili', 'English', 'Kikuyu'],
  },
  {
    id: '2',
    name: 'Joseph Mwamba',
    country: 'Tanzania',
    accent: 'tanzanian',
    rating: 4.8,
    totalSessions: 189,
    pricePerMinute: 40,
    isOnline: true,
    bio: 'From Dar es Salaam, passionate about teaching Standard Swahili (Kiswahili Sanifu). Great with beginners!',
    languages: ['Swahili', 'English'],
  },
  {
    id: '3',
    name: 'Amina Hassan',
    country: 'Kenya',
    accent: 'standard',
    rating: 5.0,
    totalSessions: 312,
    pricePerMinute: 55,
    isOnline: false,
    bio: 'Certified language instructor with a Masters in Linguistics. I focus on grammar, pronunciation, and cultural context.',
    languages: ['Swahili', 'English', 'Arabic'],
  },
  {
    id: '4',
    name: 'Emmanuel Kioko',
    country: 'Kenya',
    accent: 'kenyan',
    rating: 4.7,
    totalSessions: 156,
    pricePerMinute: 35,
    isOnline: true,
    bio: 'Young and energetic tutor! I make learning fun with games, music, and real-life scenarios.',
    languages: ['Swahili', 'English'],
  },
  {
    id: '5',
    name: 'Fatima Omar',
    country: 'Tanzania',
    accent: 'standard',
    rating: 4.9,
    totalSessions: 278,
    pricePerMinute: 50,
    isOnline: false,
    bio: 'Experienced teacher from Zanzibar. I specialize in teaching Swahili culture alongside the language.',
    languages: ['Swahili', 'English', 'Arabic'],
  },
];

export default function TutorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccent, setSelectedAccent] = useState<string | null>(null);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredTutors = mockTutors.filter((tutor) => {
    if (searchQuery && !tutor.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedAccent && tutor.accent !== selectedAccent) {
      return false;
    }
    if (onlineOnly && !tutor.isOnline) {
      return false;
    }
    if (maxPrice && tutor.pricePerMinute > maxPrice) {
      return false;
    }
    return true;
  });

  const clearFilters = () => {
    setSelectedAccent(null);
    setOnlineOnly(false);
    setMaxPrice(null);
  };

  const hasActiveFilters = selectedAccent || onlineOnly || maxPrice;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-savanna-earth-800">
            Find Your Perfect Tutor
          </h1>
          <p className="text-savanna-earth-600 mt-1">
            Connect with verified native Swahili speakers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tutors by name..."
              leftAddon={<Search className="w-5 h-5" />}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            leftIcon={<Filter className="w-4 h-4" />}
            rightIcon={<ChevronDown className={cn('w-4 h-4 transition-transform', showFilters && 'rotate-180')} />}
          >
            Filters
            {hasActiveFilters && (
              <Badge variant="info" size="sm" className="ml-2">
                Active
              </Badge>
            )}
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card variant="bordered" className="animate-slide-up">
            <CardContent>
              <div className="flex flex-wrap gap-6">
                {/* Accent Filter */}
                <div>
                  <label className="block text-sm font-medium text-savanna-earth-700 mb-2">
                    Accent
                  </label>
                  <div className="flex gap-2">
                    {['kenyan', 'tanzanian', 'standard'].map((accent) => (
                      <button
                        key={accent}
                        onClick={() => setSelectedAccent(selectedAccent === accent ? null : accent)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-sm font-medium transition-colors capitalize',
                          selectedAccent === accent
                            ? 'bg-savanna-gold-500 text-white'
                            : 'bg-savanna-cream-200 text-savanna-earth-600 hover:bg-savanna-cream-300'
                        )}
                      >
                        {accent}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Online Filter */}
                <div>
                  <label className="block text-sm font-medium text-savanna-earth-700 mb-2">
                    Availability
                  </label>
                  <button
                    onClick={() => setOnlineOnly(!onlineOnly)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2',
                      onlineOnly
                        ? 'bg-green-500 text-white'
                        : 'bg-savanna-cream-200 text-savanna-earth-600 hover:bg-savanna-cream-300'
                    )}
                  >
                    <span className={cn('w-2 h-2 rounded-full', onlineOnly ? 'bg-white' : 'bg-green-500')} />
                    Online Now
                  </button>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-medium text-savanna-earth-700 mb-2">
                    Max Price per Minute
                  </label>
                  <div className="flex gap-2">
                    {[30, 45, 60].map((price) => (
                      <button
                        key={price}
                        onClick={() => setMaxPrice(maxPrice === price ? null : price)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                          maxPrice === price
                            ? 'bg-savanna-gold-500 text-white'
                            : 'bg-savanna-cream-200 text-savanna-earth-600 hover:bg-savanna-cream-300'
                        )}
                      >
                        ≤ ${(price / 100).toFixed(2)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <div className="flex items-end">
                    <Button variant="ghost" size="sm" onClick={clearFilters} leftIcon={<X className="w-4 h-4" />}>
                      Clear All
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-savanna-earth-600">
            {filteredTutors.length} tutor{filteredTutors.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Tutors Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredTutors.map((tutor) => (
            <Card key={tutor.id} variant="elevated" className="hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="flex gap-4">
                  {/* Avatar */}
                  <Avatar
                    name={tutor.name}
                    size="xl"
                    isOnline={tutor.isOnline}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-lg text-savanna-earth-800">
                          {tutor.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-savanna-earth-500">
                          <Globe className="w-4 h-4" />
                          <span>{tutor.country}</span>
                        </div>
                      </div>
                      {tutor.isOnline && (
                        <Badge variant="success" size="sm">
                          Online
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <Badge variant="outline" size="sm" className="capitalize">
                        {tutor.accent}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-savanna-gold-500 text-savanna-gold-500" />
                        <span className="font-medium text-savanna-earth-700">{tutor.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-savanna-earth-500">
                        <Video className="w-4 h-4" />
                        <span>{tutor.totalSessions} sessions</span>
                      </div>
                    </div>

                    <p className="text-sm text-savanna-earth-600 mt-3 line-clamp-2">
                      {tutor.bio}
                    </p>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-savanna-cream-200">
                      <div>
                        <span className="text-xl font-bold text-savanna-earth-800">
                          ${(tutor.pricePerMinute / 100).toFixed(2)}
                        </span>
                        <span className="text-savanna-earth-500">/min</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                        <Button
                          variant={tutor.isOnline ? 'secondary' : 'primary'}
                          size="sm"
                          leftIcon={tutor.isOnline ? <Video className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        >
                          {tutor.isOnline ? 'Start Now' : 'Schedule'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredTutors.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-savanna-cream-200 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-savanna-cream-500" />
            </div>
            <h3 className="font-semibold text-savanna-earth-800">No tutors found</h3>
            <p className="text-savanna-earth-600 mt-1">
              Try adjusting your filters or search query
            </p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
