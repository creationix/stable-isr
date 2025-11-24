import { Suspense } from 'react';
import { cacheLife } from 'next/cache';

// LAYER 1: The Shell
// specific export configs like 'revalidate' or 'ppr' are BANNED here.
// This component MUST return immediately.
export default function NewsPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <div className="p-10">
      <h1 className="text-xl font-bold">News Shell</h1>
      
      {/* We pass the PROMISE to the Unwrapper. 
         We provide a fallback (Shell) while the Unwrapper resolves.
      */}
      <Suspense fallback={<div>Loading (Waiting for Params + Cache)...</div>}>
        <ParamUnwrapper params={params} />
      </Suspense>
    </div>
  );
}

// LAYER 2: The Unwrapper (Dynamic)
// This component runs on every request. Its job is to turn Promises into Strings.
// It cannot be cached because Promises aren't valid cache keys.
async function ParamUnwrapper({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // Safe to await here (inside Suspense)
  
  return <CachedStory slug={slug} />;
}

// LAYER 3: The ISR Component (Cached)
// This is your "Page" logic. It takes simple data (strings).
async function CachedStory({ slug }: { slug: string }) {
  'use cache'; 
  cacheLife('seconds'); // Cache for 60s

  // Simulate heavy DB work
  await new Promise(resolve => setTimeout(resolve, 2000));

  return (
    <div className="p-4 mt-4 border-2 border-green-500 bg-green-50">
      <h2 className="text-2xl font-bold">Story: {slug}</h2>
      <p>Generated at: {new Date().toISOString()}</p>
      <p>This content is cached on-demand!</p>
    </div>
  );
}
