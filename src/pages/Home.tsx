import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, MessageSquare, Plus, Tag } from 'lucide-react';
import { subtopicsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/TranslationContext';

// ... // Mapeamento de temas para cores (mesmo do SubtopicPage)
const THEME_COLORS: { [key: string]: string } = {
  games: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  entertainment: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  geek: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  technology: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  science: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  art: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  music: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  sports: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  literature: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  movies: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
  tv: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  anime: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300',
  manga: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-300',
  programming: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  design: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300',
  photography: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300',
  food: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  travel: 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300',
  fitness: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  health: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  education: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  business: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  crypto: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  nature: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  politics: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300',
  history: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  philosophy: 'bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-300',
  psychology: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  relationships: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  parenting: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
};

// Função para obter o nome amigável do tema

const Home: React.FC = () => {
  const { user } = useAuth();
  const { t, tt } = useTranslation();
  const { data: subtopics, isLoading } = useQuery({
    queryKey: ['subtopics'],
    queryFn: () => subtopicsAPI.getAll().then(res => res.data),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('common.welcome')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('common.discover')}
        </p>
      </div>

      {user && (
        <Link
          to="/create-subtopic"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors mb-6"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span>{t('common.createCommunity')}</span>
        </Link>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subtopics?.map((subtopic) => (
          <Link
            key={subtopic.id}
            to={`/s/${subtopic.slug}`}
            className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    s/{subtopic.name}
                  </h3>
                  {subtopic.theme && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${THEME_COLORS[subtopic.theme] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                      <Tag className="h-5 w-5 mr-1" />
                      {tt(subtopic.theme)}
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {subtopic.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{t('community.by')} {subtopic.owner.username}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{subtopic._count?.posts || 0} {t('community.posts')}</span>
                  </div>
                </div>
                
                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {t('common.view')}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {subtopics?.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            {t('community.noCommunities')}
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {t('community.beFirst')}
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;