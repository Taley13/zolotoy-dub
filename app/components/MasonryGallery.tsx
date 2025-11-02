"use client";

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type Item = { src: string; alt?: string };

export default function MasonryGallery() {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let aborted = false;
    (async () => {
      const res = await fetch(`/api/images?page=${page}&size=24`, { cache: 'no-store' });
      const data = await res.json();
      if (!aborted) {
        setItems((prev) => [...prev, ...data.items]);
        setHasMore(data.items.length > 0 && page * 24 < data.total);
      }
    })();
    return () => { aborted = true; };
  }, [page]);

  useEffect(() => {
    if (!loaderRef.current) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((p) => p + 1);
      }
    }, { rootMargin: '800px' });
    io.observe(loaderRef.current);
    return () => io.disconnect();
  }, [hasMore]);

  return (
    <div>
      <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [column-fill:_balance]">{/* masonry via CSS columns */}
        {items.map((it, i) => (
          <div key={it.src + i} className="mb-3 break-inside-avoid overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/50">
            <Image
              src={it.src}
              alt={it.alt || ''}
              width={1600}
              height={1200}
              className="w-full object-cover transition duration-300 hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <div ref={loaderRef} className="mt-6 h-10 w-full" />
    </div>
  );
}


