import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/TranslationContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postsAPI } from '../services/api';
import { X, Image } from 'lucide-react';

interface CreatePostProps {
  subtopicId: string;
  subtopicName: string;
  onClose?: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ 
  subtopicId, 
  subtopicName, 
  onClose 
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { 
      title: string; 
      content?: string; 
      image?: string; 
      subtopicId: string;
    }) => postsAPI.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setTitle('');
      setContent('');
      setImage('');
      setError('');
      
      if (onClose) {
        onClose();
      } else {
        navigate(`/post/${data.data.id}`);
      }
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

    if (!title.trim()) {
      setError(t('post.titleRequired'));
      return;
    }

    mutation.mutate({
      title: title.trim(),
      content: content.trim() || undefined,
      image: image.trim() || undefined,
      subtopicId,
    });
  };

  if (!user) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
          {t('auth.needAuth')}
        </h2>
        <p className="text-yellow-700 dark:text-yellow-300">
          {t('auth.pleaseLogin')}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('post.createPost')} s/{subtopicName}
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('post.title')} *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            placeholder={t('post.titlePlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {title.length}/200 {t('common.characters')}
          </p>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('post.content')} ({t('common.optional')})
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={10000}
            rows={6}
            placeholder={t('post.contentPlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white resize-none"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {content.length}/10000 {t('common.characters')}
          </p>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <div className="flex items-center space-x-2">
              <Image className="h-4 w-4" />
              <span>{t('post.image')} ({t('common.optional')})</span>
            </div>
          </label>
          <input
            id="image"
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {image && (
          <div className="border border-gray-200 dark:border-gray-600 rounded-md p-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('post.imagePreview')}:
            </p>
            <img
              src={image}
              alt="Preview"
              className="max-w-full h-auto max-h-64 rounded-md"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {t('common.cancel')}
            </button>
          )}
          <button
            type="submit"
            disabled={mutation.isPending || !title.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-colors"
          >
            {mutation.isPending ? t('post.creating') : t('post.create')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;