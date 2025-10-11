import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Post } from '../types';
import { subtopicsAPI, postsAPI } from '../services/api';
import { MessageSquare, Users, ArrowLeft, Plus } from 'lucide-react';
import CreatePost from '../components/CreatePost';

const SubtopicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [showCreatePost, setShowCreatePost] = useState(false);

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
          Comunidade não encontrada
        </h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          A comunidade que você está procurando não existe ou foi removida.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para comunidades
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
          Voltar para comunidades
        </Link>
        
        <button
          onClick={() => setShowCreatePost(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Criar Post
        </button>
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              s/{subtopic.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {subtopic.description}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>by {subtopic.owner.username}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>{subtopic._count.posts} posts</span>
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
                    <span>by {post.author.username}</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post._count.comments} comentários</span>
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
              Nenhum post ainda
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Seja o primeiro a criar um post nesta comunidade!
            </p>
            <button
              onClick={() => setShowCreatePost(true)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubtopicPage;