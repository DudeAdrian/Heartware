import React, { useState } from "react";

/**
 * Sample UI Plugin - Demonstrates a React-based plugin for Heartware
 * Uses Tailwind CSS and React hooks
 */
const SampleUIPlugin = ({ pluginApi }) => {
  const [count, setCount] = useState(0);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">Sample UI Plugin</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-200">
        This is a sample React-based plugin. Count: <span className="font-semibold">{count}</span>
      </p>
      <button
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold"
        onClick={() => setCount(count + 1)}
      >
        Increment
      </button>
    </div>
  );
};

export default SampleUIPlugin;
