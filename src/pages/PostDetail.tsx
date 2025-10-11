import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { postsAPI } from '../services/api';
import CommentSection from '../components/CommentSection';
import { ArrowLeft, MessageSquare, Calendar } from 'lucide-react';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postsAPI.getById(id!).then(res => res.data),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          Post não encontrado
        </h3>
        <Link
          to="/"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para o início
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to={`/s/${post.subtopic.slug}`}
        className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para s/{post.subtopic.name}
      </Link>

      {/* Post Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="mb-4">
          <Link
            to={`/s/${post.subtopic.slug}`}
            className="inline-block px-3 py-1 text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full mb-3"
          >
            s/{post.subtopic.name}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {post.title}
          </h1>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span>by {post.author.username}</span>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>{post._count.comments} comentários</span>
            </div>
          </div>
        </div>

        {post.content && (
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
        )}

        {post.image && (
          <div className="mt-4">
            <img
              src={post.image}
              alt="Post attachment"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Comments Section */}
      <CommentSection postId={post.id} />
    </div>
  );
};

export default PostDetail;