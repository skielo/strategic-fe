"use client"
import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchWithAuth } from '../utils/api';

interface StrategicTheme {
  id: number;
  name: string;
  description: string;
  objectives: Objective[];
}

interface Objective {
  id: number;
  name: string;
  currentValue: number;
}

const StrategicThemes: FC = () => {
  const [themes, setThemes] = useState<StrategicTheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTheme, setNewTheme] = useState({ name: '', description: '' });
  const [editingTheme, setEditingTheme] = useState<StrategicTheme | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      setIsLoading(true);
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/strategic-themes`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: StrategicTheme[] = await response.json();
      setThemes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/strategic-themes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTheme),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setNewTheme({ name: '', description: '' });
      fetchThemes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the theme');
    }
  };

  const handleUpdateTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTheme) return;
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/strategic-themes/${editingTheme.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTheme),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setEditingTheme(null);
      fetchThemes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating the theme');
    }
  };

  const handleDeleteTheme = async (id: number) => {
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/strategic-themes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchThemes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the theme');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-500 text-white p-2 rounded mt-4"
        >
          Create New Strategic Theme
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Strategic Themes</h1>
      
      {themes.length === 0 ? (
        <div className="text-center">
          <p className="mb-4">No Strategic Themes available.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Create New Strategic Theme
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-500 text-white p-2 rounded mb-4"
        >
          Add New Strategic Theme
        </button>
      )}

      {/* Create Theme Form */}
      {showCreateForm && (
        <form onSubmit={handleCreateTheme} className="mb-8">
          <input
            type="text"
            value={newTheme.name}
            onChange={(e) => setNewTheme({ ...newTheme, name: e.target.value })}
            placeholder="Theme Name"
            className="border p-2 mr-2"
          />
          <input
            type="text"
            value={newTheme.description}
            onChange={(e) => setNewTheme({ ...newTheme, description: e.target.value })}
            placeholder="Theme Description"
            className="border p-2 mr-2"
          />
          <button type="submit" className="bg-green-500 text-white p-2 rounded mr-2">Create Theme</button>
          <button onClick={() => setShowCreateForm(false)} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
        </form>
      )}

      {/* Edit Theme Form */}
      {editingTheme && (
        <form onSubmit={handleUpdateTheme} className="mb-8">
          <input
            type="text"
            value={editingTheme.name}
            onChange={(e) => setEditingTheme({ ...editingTheme, name: e.target.value })}
            className="border p-2 mr-2"
          />
          <input
            type="text"
            value={editingTheme.description}
            onChange={(e) => setEditingTheme({ ...editingTheme, description: e.target.value })}
            className="border p-2 mr-2"
          />
          <button type="submit" className="bg-green-500 text-white p-2 rounded mr-2">Update</button>
          <button onClick={() => setEditingTheme(null)} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <div key={theme.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{theme.name}</h2>
            <p className="text-gray-600 mb-4">{theme.description}</p>
            <h3 className="text-lg font-semibold mb-2">Objectives</h3>
            <ul className="space-y-2">
              {theme.objectives.map((objective) => (
                <li key={objective.id}>
                  <Link href={`/objectives/${theme.id}`} className="text-blue-500 hover:underline">
                    {objective.name} (Current Value: {objective.currentValue})
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <button onClick={() => setEditingTheme(theme)} className="bg-yellow-500 text-white p-2 rounded mr-2">Edit</button>
              <button onClick={() => handleDeleteTheme(theme.id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StrategicThemes;