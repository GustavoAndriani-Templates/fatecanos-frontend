import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/TranslationContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subtopicsAPI } from '../services/api';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Lista de temas disponíveis
const AVAILABLE_THEMES = [
  'games',
  'entertainment', 
  'geek',
  'technology',
  'science',
  'art',
  'music',
  'sports',
  'literature',
  'movies',
  'tv',
  'anime',
  'manga',
  'programming',
  'design',
  'photography',
  'food',
  'travel',
  'fitness',
  'health',
  'education',
  'business',
  'crypto',
  'nature',
  'politics',
  'history',
  'philosophy',
  'psychology',
  'relationships',
  'parenting'
];

const CreateSubtopic: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const { t, tt } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { name: string; description: string; theme: string; }) =>
      subtopicsAPI.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subtopics'] });
      navigate(`/s/${data.data.slug}`);
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || t('common.error'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError(t('auth.needAuth'));
      return;
    }

    if (!selectedTheme) {
      setError(t('community.chooseTheme'));
      return;
    }

    mutation.mutate({ name, description, theme: selectedTheme });
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            {t('auth.needAuth')}
          </h2>
          <p className="text-yellow-700 dark:text-yellow-300 mb-4">
            {t('auth.pleaseLogin')}
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600"
          >
            {t('auth.goToLogin')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('community.backToCommunities')}
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t('community.createCommunity')}
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('community.communityName')}
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={3}
              maxLength={20}
              placeholder={t('community.namePlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('community.nameRequirements')}
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('community.description')}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={10}
              maxLength={500}
              rows={4}
              placeholder={t('community.descriptionPlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white resize-none"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description.length}/500 {t('common.characters')}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('community.theme')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-2 border border-gray-200 dark:border-gray-600 rounded-md">
              {AVAILABLE_THEMES.map((themeId) => (
                <button
                  key={themeId}
                  type="button"
                  onClick={() => setSelectedTheme(themeId)}
                  className={`p-3 rounded-md border-2 text-left transition-all ${
                    selectedTheme === themeId
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{tt(themeId)}</span> {/* Use tt aqui */}
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {t('community.chooseThemeDescription')}
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Link
              to="/"
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
                {t('common.cancel')}
            </Link>
            <button
              type="submit"
              disabled={mutation.isPending || !selectedTheme}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-colors"
            >
              {mutation.isPending ? t('common.creating') : t('community.createCommunity')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubtopic;