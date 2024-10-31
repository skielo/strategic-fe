import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface KeyResult {
  id: number;
  name: string;
  description: string;
  currentValue: number;
  targetValue: number;
  goals: Goal[];
}

interface Goal {
  id: number;
  name: string;
  currentValue: number;
  targetValue: number;
}

const KeyResults: FC = () => {
  const [keyResult, setKeyResult] = useState<KeyResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query;
  const idString = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    const fetchKeyResult = async () => {
      if (!idString) {
        setError('No key result selected');
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/key-results/all`, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: KeyResult = await response.json();
        setKeyResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchKeyResult();
  }, [idString]);
  

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
          Create New Key Result
        </button>
      </div>
    );
  }

  if (!keyResult) {
    return <div>No key result found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Key Results</h1>
      <Link href="/objectives" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to Objectives
      </Link>
      
      {keyResult ? (
        <>
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-2">{keyResult.name}</h2>
            <p className="text-gray-600 mb-4">{keyResult.description}</p>
            <p className="mb-2">Current Value: {keyResult.currentValue}</p>
            <p className="mb-4">Target Value: {keyResult.targetValue}</p>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Associated Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {keyResult.goals.map((goal) => (
              <div key={goal.id} className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">
                  <Link href={`/goals/${goal.id}`} className="text-blue-500 hover:underline">
                    {goal.name}
                  </Link>
                </h3>
                <p className="mb-2">Current Value: {goal.currentValue}</p>
                <p className="mb-2">Target Value: {goal.targetValue}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="mb-4">No Key Results available.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Create New Key Result
          </button>
        </div>
      )}
    </div>
  );
};

export default KeyResults;