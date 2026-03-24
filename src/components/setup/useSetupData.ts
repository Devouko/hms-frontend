import { useState, useEffect } from 'react';

export interface BaseSetupItem {
  id: string;
  isActive: boolean;
  createdAt: string;
}

export interface SetupConfig<T extends BaseSetupItem> {
  storageKey: string;
  defaultItems: T[];
  searchFields: (keyof T)[];
}

export function useSetupData<T extends BaseSetupItem>(config: SetupConfig<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const saved = localStorage.getItem(config.storageKey);
      if (saved) {
        setItems(JSON.parse(saved));
      } else {
        setItems(config.defaultItems);
        localStorage.setItem(config.storageKey, JSON.stringify(config.defaultItems));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveItems = (newItems: T[]) => {
    try {
      localStorage.setItem(config.storageKey, JSON.stringify(newItems));
      setItems(newItems);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const addItem = (item: Omit<T, 'id' | 'isActive' | 'createdAt'>) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      isActive: true,
      createdAt: new Date().toISOString()
    } as T;
    
    saveItems([...items, newItem]);
  };

  const updateItem = (id: string, updates: Partial<T>) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    saveItems(newItems);
  };

  const deleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const newItems = items.filter(item => item.id !== id);
      saveItems(newItems);
    }
  };

  const toggleStatus = (id: string) => {
    updateItem(id, { isActive: !items.find(i => i.id === id)?.isActive } as Partial<T>);
  };

  const filteredItems = items.filter(item =>
    config.searchFields.some(field => {
      const value = item[field];
      return typeof value === 'string' && 
             value.toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  return {
    items,
    filteredItems,
    searchTerm,
    setSearchTerm,
    isDialogOpen,
    setIsDialogOpen,
    editingItem,
    setEditingItem,
    addItem,
    updateItem,
    deleteItem,
    toggleStatus
  };
}