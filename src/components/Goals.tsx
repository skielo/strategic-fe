import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Goal {
  id: number;
  name: string;
  description: string;
  currentValue: number;
  targetValue: number;
}

const Goals: FC = () => {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query;
  const idString = Array.isArray(id) ? id[0] : id;
  const [isEditing, setIsEditing] = useState(false);
  const [editedGoal, setEditedGoal] = useState<Goal | null>(null);

  useEffect(() => {
    fetchGoal();
  }, [idString]);

  const fetchGoal = async () => {
    if (!idString) {
      setError('No goal selected');
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/goals/all`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Goal = await response.json();
      setGoal(data);
      setEditedGoal(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedGoal) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/goals/${editedGoal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedGoal),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setGoal(editedGoal);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating the goal');
    }
  };

  const handleDeleteGoal = async () => {
    if (!goal) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/goals/${goal.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      router.push('/objectives');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the goal');
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
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-500 text-white p-2 rounded mt-4"
        >
          Create New Goal
        </button>
      </div>
    );
  }

  if (!goal) {
    return <div>No goal found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Goals</h1>
      <Link href="/key-results" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to Key Results
      </Link>
      
      {goal ? (
        <>
          {isEditing ? (
            <form onSubmit={handleUpdateGoal} className="bg-white shadow-md rounded-lg p-6 mb-6">
              <input
                type="text"
                value={editedGoal?.name}
                onChange={(e) => setEditedGoal(prev => prev ? {...prev, name: e.target.value} : null)}
                className="border p-2 mb-2 w-full"
              />
              <textarea
                value={editedGoal?.description}
                onChange={(e) => setEditedGoal(prev => prev ? {...prev, description: e.target.value} : null)}
                className="border p-2 mb-2 w-full"
              />
              <input
                type="number"
                value={editedGoal?.currentValue}
                onChange={(e) => setEditedGoal(prev => prev ? {...prev, currentValue: Number(e.target.value)} : null)}
                className="border p-2 mb-2 w-full"
              />
              <input
                type="number"
                value={editedGoal?.targetValue}
                onChange={(e) => setEditedGoal(prev => prev ? {...prev, targetValue: Number(e.target.value)} : null)}
                className="border p-2 mb-2 w-full"
              />
              <button type="submit" className="bg-green-500 text-white p-2 rounded mr-2">Save</button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
            </form>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-2">{goal.name}</h2>
              <p className="text-gray-600 mb-4">{goal.description}</p>
              <p className="mb-2">Current Value: {goal.currentValue}</p>
              <p className="mb-2">Target Value: {goal.targetValue}</p>
              <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-white p-2 rounded mr-2">Edit</button>
              <button onClick={handleDeleteGoal} className="bg-red-500 text-white p-2 rounded">Delete</button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center">
          <p className="mb-4">No Goals available.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Create New Goal
          </button>
        </div>
      )}
    </div>
  );
};

export default Goals;