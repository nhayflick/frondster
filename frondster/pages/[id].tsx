import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function GameRedirect() {
  const router = useRouter();
  const { id } = router.query;
  
  useEffect(() => {
    if (id) {
      router.replace(`/game?id=${id}`);
    }
  }, [id, router]);
  
  return null; // No UI needed as this is just a redirect
}
