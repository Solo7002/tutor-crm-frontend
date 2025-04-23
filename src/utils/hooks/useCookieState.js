import { useState, useEffect } from 'react';

const useCookieState = (key, initialValue, expiryMinutes = 30) => {
  const getStorageValue = () => {
    const item = sessionStorage.getItem(key);
    
    if (item) {
      try {
        const parsedItem = JSON.parse(item);
        
        if (parsedItem.__expires && new Date().getTime() < parsedItem.__expires) {
          return parsedItem.value;
        } else if (!parsedItem.__expires) {
          return parsedItem;
        }
        sessionStorage.removeItem(key);
      } catch {
        return item;
      }
    }
    return initialValue;
  };

  const [state, setState] = useState(getStorageValue);

  useEffect(() => {
    const expiryTime = new Date().getTime() + expiryMinutes * 60 * 1000;
    
    const storageValue = JSON.stringify({
      value: state,
      __expires: expiryTime
    });
    
    sessionStorage.setItem(key, storageValue);
  }, [key, state, expiryMinutes]);

  return [state, setState];
};

export default useCookieState;