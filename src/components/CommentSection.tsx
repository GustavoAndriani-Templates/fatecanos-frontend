import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { commentsAPI } from '../services/api';
import { MessageSquare, Reply, Trash2 } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
  };
  replies: Comment[];
  _count: {
    replies: number;
  };
}

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentsAPI.getByPost(postId).then(res => res.data),
  });

  const createCommentMutation = useMutation({
    mutationFn: (data: { content: string; postId: string; parentId?: string }) =>
      commentsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setNewComment('');
      setReplyingTo(null);
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (id: string) => commentsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const handleSubmit = (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    createCommentMutation.mutate({
      content: newComment,
      postId,
      parentId,
    });
  };

  const Comment: React.FC<{ comment: Comment; depth?: number }> = ({ 
    comment, 
    depth = 0 
  }) => {
    const [showReply, setShowReply] = useState(false);

    return (
      <div 
        className={`${depth > 0 ? 'ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-4' : ''}`}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900 dark:text-white">
                {comment.author.username}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            {user && (user.id === comment.author.id || user.role === 'ADMIN') && (
              <button
                onClick={() => deleteCommentMutation.mutate(comment.id)}
                className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            {comment.content}
          </p>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowReply(!showReply)}
              className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <Reply className="h-4 w-4" />
              <span>Reply</span>
            </button>
          </div>

          {/* Reply Form */}
          {showReply && user && (
            <form 
              onSubmit={(e) => handleSubmit(e, comment.id)}
              className="mt-4"
            >
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escreva sua resposta..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white resize-none"
                rows={3}
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowReply(false)}
                  className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newComment.trim() || createCommentMutation.isPending}
                  className="px-3 py-1 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded-md disabled:opacity-50 transition-colors"
                >
                  {createCommentMutation.isPending ? 'Enviando...' : 'Reply'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Nested Replies */}
        {comment.replies?.map((reply) => (
          <Comment 
            key={reply.id} 
            comment={reply} 
            depth={depth + 1}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <MessageSquare className="h-5 w-5 mr-2" />
        Comentários {comments && `(${comments.length})`}
      </h3>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={(e) => handleSubmit(e)} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Adicione um comentário..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white resize-none"
            rows={4}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!newComment.trim() || createCommentMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md disabled:opacity-50 transition-colors"
            >
              {createCommentMutation.isPending ? 'Enviando...' : 'Comentar'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Faça login para adicionar um comentário.
          </p>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Não há comentários ainda. Seja o primeiro a comentar!</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;