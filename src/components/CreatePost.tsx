import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
        // Navigate to the new post
        navigate(`/post/${data.data.id}`);
      }
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || 'Failed to create post');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in to create a post');
      return;
    }

    if (!title.trim()) {
      setError('Title is required');
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
          Autenticação Necessária
        </h2>
        <p className="text-yellow-700 dark:text-yellow-300">
            Você deve estar logado para criar um post.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Criar um post em s/{subtopicName}
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
            Título *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            placeholder="Digite o título do post..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {title.length}/200 caracteres
          </p>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Conteúdo (Opcional)
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={10000}
            rows={6}
            placeholder="Sobre o que você quer falar?..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white resize-none"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {content.length}/10000 caracteres
          </p>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <div className="flex items-center space-x-2">
              <Image className="h-4 w-4" />
              <span>URL da Imagem (Opcional)</span>
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
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pré-visualização da Imagem:</p>
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
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={mutation.isPending || !title.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-colors"
          >
            {mutation.isPending ? 'Criando...' : 'Criar Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;