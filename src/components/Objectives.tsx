import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { fetchWithAuth } from '../utils/api';

interface Objective {
  id: number;
  name: string;
  description: string;
  currentValue: number;
  targetValue: number;
  keyResults: KeyResult[];
}

interface KeyResult {
  id: number;
  name: string;
  currentValue: number;
}

const Objectives: FC = () => {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { themeId } = router.query;
  const themeIdString = Array.isArray(themeId) ? themeId[0] : themeId;
  const [newObjective, setNewObjective] = useState({ name: '', description: '', currentValue: 0, targetValue: 0 });
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null);

  useEffect(() => {
    fetchObjectives();
  }, [themeIdString]);

  const fetchObjectives = async () => {
    if (!themeIdString) {
      setError('No theme selected');
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/themes/${themeIdString}/objectives/all`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Objective[] = await response.json();
      setObjectives(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateObjective = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!themeIdString) return;
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/themes/${themeIdString}/objectives`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newObjective),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setNewObjective({ name: '', description: '', currentValue: 0, targetValue: 0 });
      fetchObjectives();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the objective');
    }
  };

  const handleUpdateObjective = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingObjective) return;
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/objectives/${editingObjective.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingObjective),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setEditingObjective(null);
      fetchObjectives();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating the objective');
    }
  };

  const handleDeleteObjective = async (id: number) => {
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/objectives/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchObjectives();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the objective');
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
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => setNewObjective({ name: '', description: '', currentValue: 0, targetValue: 0 })}
          className="bg-blue-500 text-white p-2 rounded mt-4"
        >
          Create New Objective
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Objectives for Theme {themeIdString}</h1>
      <Link href="/themes" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to Themes
      </Link>

      {/* Create Objective Form */}
      <form onSubmit={handleCreateObjective} className="mb-8">
        <input
          type="text"
          value={newObjective.name}
          onChange={(e) => setNewObjective({ ...newObjective, name: e.target.value })}
          placeholder="Objective Name"
          className="border p-2 mr-2"
        />
        <input
          type="text"
          value={newObjective.description}
          onChange={(e) => setNewObjective({ ...newObjective, description: e.target.value })}
          placeholder="Objective Description"
          className="border p-2 mr-2"
        />
        <input
          type="number"
          value={newObjective.currentValue}
          onChange={(e) => setNewObjective({ ...newObjective, currentValue: Number(e.target.value) })}
          placeholder="Current Value"
          className="border p-2 mr-2"
        />
        <input
          type="number"
          value={newObjective.targetValue}
          onChange={(e) => setNewObjective({ ...newObjective, targetValue: Number(e.target.value) })}
          placeholder="Target Value"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create Objective</button>
      </form>

      {/* Edit Objective Form */}
      {editingObjective && (
        <form onSubmit={handleUpdateObjective} className="mb-8">
          <input
            type="text"
            value={editingObjective.name}
            onChange={(e) => setEditingObjective({ ...editingObjective, name: e.target.value })}
            className="border p-2 mr-2"
          />
          <input
            type="text"
            value={editingObjective.description}
            onChange={(e) => setEditingObjective({ ...editingObjective, description: e.target.value })}
            className="border p-2 mr-2"
          />
          <input
            type="number"
            value={editingObjective.currentValue}
            onChange={(e) => setEditingObjective({ ...editingObjective, currentValue: Number(e.target.value) })}
            className="border p-2 mr-2"
          />
          <input
            type="number"
            value={editingObjective.targetValue}
            onChange={(e) => setEditingObjective({ ...editingObjective, targetValue: Number(e.target.value) })}
            className="border p-2 mr-2"
          />
          <button type="submit" className="bg-green-500 text-white p-2 rounded mr-2">Update</button>
          <button onClick={() => setEditingObjective(null)} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {objectives.map((objective) => (
          <div key={objective.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{objective.name}</h2>
            <p className="text-gray-600 mb-4">{objective.description}</p>
            <p className="mb-2">Current Value: {objective.currentValue}</p>
            <p className="mb-4">Target Value: {objective.targetValue}</p>
            <h3 className="text-lg font-semibold mb-2">Key Results</h3>
            <ul className="space-y-2">
              {objective.keyResults.map((keyResult) => (
                <li key={keyResult.id}>
                  <Link href={`/key-results/${keyResult.id}`} className="text-blue-500 hover:underline">
                    {keyResult.name} (Current Value: {keyResult.currentValue})
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <button onClick={() => setEditingObjective(objective)} className="bg-yellow-500 text-white p-2 rounded mr-2">Edit</button>
              <button onClick={() => handleDeleteObjective(objective.id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Objectives;