import React from 'react';

export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex gap-6">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3 bg-gray-200 rounded animate-pulse flex-1" />
        ))}
      </div>
      <div className="divide-y divide-gray-50">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="px-6 py-4 flex gap-6 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className="h-4 bg-gray-100 rounded animate-pulse flex-1"
                style={{ animationDelay: `${(r * cols + c) * 40}ms` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonForm({ fields = 4 }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4 max-w-2xl">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i}>
          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mb-1.5" style={{ animationDelay: `${i * 60}ms` }} />
          <div className="h-10 bg-gray-100 rounded-lg animate-pulse" style={{ animationDelay: `${i * 60 + 30}ms` }} />
        </div>
      ))}
      <div className="h-10 w-32 bg-gray-100 rounded-lg animate-pulse mt-4" />
    </div>
  );
}
