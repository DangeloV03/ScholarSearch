'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

export function useNavigationWithTransition() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigateWithTransition = useCallback((href: string) => {
    setIsTransitioning(true);
    
    // Add a small delay to show the transition
    setTimeout(() => {
      router.push(href);
      // Reset transition state after navigation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 150);
  }, [router]);

  const navigateWithTransitionAndData = useCallback(async (
    href: string, 
    data?: any,
    apiEndpoint?: string
  ) => {
    setIsTransitioning(true);
    
    try {
      if (apiEndpoint && data) {
        // Make API call first
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (response.ok) {
          const result = await response.json();
          // Navigate with the result data
          const urlWithParams = result.conversation?.id 
            ? `${href}?conversation=${result.conversation.id}`
            : href;
          
          setTimeout(() => {
            router.push(urlWithParams);
            setTimeout(() => {
              setIsTransitioning(false);
            }, 300);
          }, 150);
        } else {
          // Handle error - still navigate but show error
          console.error('API call failed');
          setTimeout(() => {
            router.push(href);
            setTimeout(() => {
              setIsTransitioning(false);
            }, 300);
          }, 150);
        }
      } else {
        // Simple navigation
        setTimeout(() => {
          router.push(href);
          setTimeout(() => {
            setIsTransitioning(false);
          }, 300);
        }, 150);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback navigation
      setTimeout(() => {
        router.push(href);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }, 150);
    }
  }, [router]);

  return {
    isTransitioning,
    navigateWithTransition,
    navigateWithTransitionAndData
  };
} 