import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { usersAPI } from '../services/api';
import { User, MessageSquare, Users, Folder, Calendar } from 'lucide-react';

const Profile: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'communities'>('overview');

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['user-profile', currentUser?.id],
    queryFn: () => usersAPI.getMe().then(res => res.data),
    enabled: !!currentUser,
  });

  const { data: userPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['user-posts', currentUser?.id],
    queryFn: () => usersAPI.getPosts(currentUser!.id).then(res => res.data),
    enabled: !!currentUser && activeTab === 'posts',
  });

  const { data: userSubtopics, isLoading: subtopicsLoading } = useQuery({
    queryKey: ['user-subtopics', currentUser?.id],
    queryFn: () => usersAPI.getSubtopics(currentUser!.id).then(res => res.data),
    enabled: !!currentUser && activeTab === 'communities',
  });

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            Not Authenticated
          </h2>
          <p className="text-yellow-700 dark:text-yellow-300">
            Please log in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const stats = userProfile?._count || { posts: 0, comments: 0, subtopics: 0 };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {userProfile?.username}
              </h1>
              <p className="text-orange-100">{userProfile?.email}</p>
              <p className="text-orange-200 text-sm mt-1">
                Membro desde {new Date(userProfile?.createdAt || '').toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
            <Folder className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.subtopics}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Comunidades Criadas</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
            <MessageSquare className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.posts}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Posts Criados</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
            <Users className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.comments}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Comentários</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'posts'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Posts ({stats.posts})
            </button>
            <button
              onClick={() => setActiveTab('communities')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'communities'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Comunidades ({stats.subtopics})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Sumário de Atividades
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Comunidades Recentes
                    </h4>
                    {userSubtopics && userSubtopics.length > 0 ? (
                      <div className="space-y-2">
                        {userSubtopics.slice(0, 3).map((subtopic) => (
                          <div key={subtopic.id} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              s/{subtopic.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {subtopic._count.posts} posts
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Não criou nenhuma comunidade ainda
                      </p>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Posts Recentes
                    </h4>
                    {userPosts && userPosts.length > 0 ? (
                      <div className="space-y-2">
                        {userPosts.slice(0, 3).map((post) => (
                          <div key={post.id} className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {post.title}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Não criou nenhum post ainda
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Seus Posts ({stats.posts})
              </h3>
              {postsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : userPosts && userPosts.length > 0 ? (
                <div className="space-y-4">
                  {userPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        {post.title}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>em s/{post.subtopic.name}</span>
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
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Você não criou nenhum post ainda.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'communities' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Suas comunidades ({stats.subtopics})
              </h3>
              {subtopicsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : userSubtopics && userSubtopics.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userSubtopics.map((subtopic) => (
                    <div
                      key={subtopic.id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        s/{subtopic.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {subtopic.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>{subtopic._count.posts} posts</span>
                        <span>{new Date(subtopic.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Você não criou nenhuma comunidade ainda.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;