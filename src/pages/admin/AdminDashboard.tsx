import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, AdminSubtopic } from '../../services/api';
import { useTranslation } from '../../context/TranslationContext';
import { Users, MessageSquare, Folder, BarChart3, Trash2, Edit } from 'lucide-react';
import EditSubtopicModal from './EditSubtopicModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [editingSubtopic, setEditingSubtopic] = useState<AdminSubtopic | null>(null);
  const [deletingSubtopic, setDeletingSubtopic] = useState<AdminSubtopic | null>(null);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminAPI.getStats().then(res => res.data),
    enabled: user?.role === 'ADMIN',
  });

  const { data: subtopics, isLoading: subtopicsLoading } = useQuery({
    queryKey: ['admin-subtopics'],
    queryFn: () => adminAPI.getSubtopics().then(res => res.data),
    enabled: user?.role === 'ADMIN',
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deleteSubtopic(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subtopics'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['subtopics'] });
      setDeletingSubtopic(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; description: string } }) =>
      adminAPI.updateSubtopic(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subtopics'] });
      queryClient.invalidateQueries({ queryKey: ['subtopics'] });
      setEditingSubtopic(null);
    },
  });

  const handleEdit = (subtopic: AdminSubtopic) => {
    setEditingSubtopic(subtopic);
  };

  const handleDelete = (subtopic: AdminSubtopic) => {
    setDeletingSubtopic(subtopic);
  };

  const confirmDelete = () => {
    if (deletingSubtopic) {
      deleteMutation.mutate(deletingSubtopic.id);
    }
  };

  const handleUpdate = (data: { name: string; description: string }) => {
    if (editingSubtopic) {
      updateMutation.mutate({ id: editingSubtopic.id, data });
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            {t('auth.accessDenied')}
          </h2>
          <p className="text-red-700 dark:text-red-300">
            {t('auth.accessDeniedMessage')}
          </p>
        </div>
      </div>
    );
  }

  if (statsLoading || subtopicsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {t('admin.title')}
      </h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('admin.users')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.counts.users || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Folder className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('admin.communities')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.counts.subtopics || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <MessageSquare className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('admin.posts')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.counts.posts || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('admin.comments')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.counts.comments || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Communities Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('admin.manageCommunities')} ({subtopics?.length || 0})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {subtopics?.map((subtopic: AdminSubtopic) => (
            <div key={subtopic.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    s/{subtopic.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {subtopic.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className={'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}>{t('community.by')} {subtopic.owner.username}</span>
                    <span className={'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}>{subtopic._count.posts} { subtopic._count.posts == 1 ? t('community.post') : t('community.posts')}</span>
                    <span className={'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}>{t('admin.createdAt')}: {new Date(subtopic.createdAt).toLocaleDateString()}</span>
                    <span className={'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}>{t('admin.updatedAt')}: {new Date(subtopic.updatedAt).toLocaleDateString()}</span>
                  </div>

                  {/* Recent Posts Preview */}
                  {subtopic.posts.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('profile.recentPosts')}:
                      </p>
                      <div className="space-y-1">
                        {subtopic.posts.slice(0, 3).map((post: any) => (
                          <div key={post.id} className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="truncate">"{post.title}"</span>
                            <span>{t('community.by')} {post.author.username}</span>
                          </div>
                        ))}
                        {subtopic.posts.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{subtopic.posts.length - 3} more posts
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(subtopic)}
                    disabled={updateMutation.isPending}
                    className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50"
                    title="Edit community"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(subtopic)}
                    disabled={deleteMutation.isPending}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                    title="Delete community"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {subtopics?.length === 0 && (
            <div className="text-center py-12">
              <Folder className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Não há comunidades ainda.
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Crie uma nova comunidade para começar a gerenciá-la.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingSubtopic && (
        <EditSubtopicModal
          subtopic={editingSubtopic}
          onClose={() => setEditingSubtopic(null)}
          onSave={handleUpdate}
          isLoading={updateMutation.isPending}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingSubtopic && (
        <DeleteConfirmationModal
          subtopic={deletingSubtopic}
          onClose={() => setDeletingSubtopic(null)}
          onConfirm={confirmDelete}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};

export default AdminDashboard;