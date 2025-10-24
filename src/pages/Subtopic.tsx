// Subtopic.tsx (atualizado)
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Post } from '../types';
import { subtopicsAPI, postsAPI } from '../services/api';
import { useTranslation } from '../context/TranslationContext';
import { MessageSquare, Users, ArrowLeft, Plus, Tag } from 'lucide-react';
import CreatePost from '../components/CreatePost';

// Mapeamento de temas para cores (mantido)
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

const SubtopicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { t, tt } = useTranslation();

  const { data: subtopic, isLoading: subtopicLoading } = useQuery({
    queryKey: ['subtopic', slug],
    queryFn: () => subtopicsAPI.getBySlug(slug!).then(res => res.data),
    enabled: !!slug,
  });

  const { data: posts, isLoading: postsLoading, refetch: refetchPosts } = useQuery({
    queryKey: ['posts', slug],
    queryFn: () => postsAPI.getAll(subtopic?.id).then(res => res.data),
    enabled: !!subtopic,
  });

  if (subtopicLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!subtopic) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          {t('community.notFound')}
        </h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {t('community.notFoundDescription')}
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('community.backToCommunities')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('community.backToCommunities')}
        </Link>
        
        <button
          onClick={() => setShowCreatePost(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('post.createPost')}
        </button>
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                s/{subtopic.name}
              </h1>
              {subtopic.theme && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${THEME_COLORS[subtopic.theme] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                  <Tag className="h-5 w-5 mr-1" />
                  {tt(subtopic.theme)}
                </span>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {subtopic.description}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{t('community.by')} {subtopic.owner.username}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>{subtopic._count?.posts || 0} {subtopic._count?.posts == 1 ? t('community.post') : t('community.posts')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Form */}
      {showCreatePost && (
        <div className="mb-6">
          <CreatePost
            subtopicId={subtopic.id}
            subtopicName={subtopic.name}
            onClose={() => {
              setShowCreatePost(false);
              refetchPosts();
            }}
          />
        </div>
      )}

      {/* Posts */}
      <div className="space-y-4">
        {postsLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : posts && posts.length > 0 ? (
          posts.map((post: Post) => (
            <Link
              key={post.id}
              to={`/post/${post.id}`}
              className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {post.title}
                  </h3>
                  {post.content && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {post.content}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{t('community.by')} {post.author.username}</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post._count?.comments || 0} {t('community.comments')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              {t('community.noPosts')}
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {t('community.beFirstPost')}
            </p>
            <button
              onClick={() => setShowCreatePost(true)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('post.createPost')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubtopicPage;