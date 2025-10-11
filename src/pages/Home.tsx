import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, MessageSquare, Plus } from 'lucide-react';
//import { Subtopic } from '../types';
import { subtopicsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
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
          Bem-vindo ao FATECANOS
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Descubra e participe de comunidades sobre diversos tópicos!
        </p>
      </div>

      {user && (
        <Link
          to="/create-subtopic"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors mb-6"
        >
          <Plus className="h-4 w-4" />
          <span>Criar comunidade</span>
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
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  s/{subtopic.name}
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {subtopic.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>by {subtopic.owner.username}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{subtopic._count.posts} posts</span>
                  </div>
                </div>
                
                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  Ver
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
            Não há comunidades disponíveis
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Seja o primeiro a criar uma comunidade!
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;