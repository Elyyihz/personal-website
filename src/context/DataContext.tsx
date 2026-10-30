import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Project } from '@/types/project';
import type { WishlistItem } from '@/types/wishlist';
import type { ConsumedMedia } from '@/types/media';
import type { HobbyItem } from '@/types/hobby';
import { projectsData as initialProjects } from '@/data/projectsData';
import { allWishlistData as initialWishlist } from '@/data/wishlistData';
import { defaultConsumedMedia as initialMedia } from '@/data/mediaData';
import { defaultHobbiesData as initialHobbies } from '@/data/interestsData';
import { Logger } from '@/utils/logger';

/**
 * Storage key utilized for persistent local browser cache.
 */
const STORAGE_KEY = 'elyyihz_portfolio_dynamic_data_v1';

/**
 * Context state contract exposed to components and admin dashboard.
 */
export interface DataContextValue {
  projects: Project[];
  wishlistItems: WishlistItem[];
  consumedMedia: ConsumedMedia;
  hobbies: HobbyItem[];

  // Project CRUD operations
  createProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Wishlist CRUD operations
  createWishlistItem: (item: Omit<WishlistItem, 'id'>) => void;
  updateWishlistItem: (id: string, updates: Partial<WishlistItem>) => void;
  deleteWishlistItem: (id: string) => void;

  // Media Management operations
  updateConsumedMedia: (updates: Partial<ConsumedMedia>) => void;

  // Hobbies & Interests CRUD operations
  createHobby: (hobby: Omit<HobbyItem, 'id'>) => void;
  updateHobby: (id: string, updates: Partial<HobbyItem>) => void;
  deleteHobby: (id: string) => void;

  // Utility reset action
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

/**
 * Global Data Provider managing dynamic entity state across the portfolio.
 * Persists modifications to localStorage and serves entities to public sections and private admin.
 */
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const logger = new Logger('DataProvider');

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_projects`);
      if (saved) {
        return JSON.parse(saved) as Project[];
      }
    } catch {
      // Fallback on parse failure
    }
    return initialProjects;
  });

  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_wishlist`);
      if (saved) {
        return JSON.parse(saved) as WishlistItem[];
      }
    } catch {
      // Fallback on parse failure
    }
    return initialWishlist;
  });

  const [consumedMedia, setConsumedMedia] = useState<ConsumedMedia>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_media`);
      if (saved) {
        return JSON.parse(saved) as ConsumedMedia;
      }
    } catch {
      // Fallback on parse failure
    }
    return initialMedia;
  });

  const [hobbies, setHobbies] = useState<HobbyItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_hobbies`);
      if (saved) {
        return JSON.parse(saved) as HobbyItem[];
      }
    } catch {
      // Fallback on parse failure
    }
    return initialHobbies;
  });

  // Synchronize projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_projects`, JSON.stringify(projects));
    } catch (err) {
      logger.logError('Failed to persist projects to localStorage', err);
    }
  }, [projects, logger]);

  // Synchronize wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_wishlist`, JSON.stringify(wishlistItems));
    } catch (err) {
      logger.logError('Failed to persist wishlist to localStorage', err);
    }
  }, [wishlistItems, logger]);

  // Synchronize media to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_media`, JSON.stringify(consumedMedia));
    } catch (err) {
      logger.logError('Failed to persist media to localStorage', err);
    }
  }, [consumedMedia, logger]);

  // Synchronize hobbies to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_hobbies`, JSON.stringify(hobbies));
    } catch (err) {
      logger.logError('Failed to persist hobbies to localStorage', err);
    }
  }, [hobbies, logger]);

  // Project CRUD Actions
  const createProject = useCallback(
    (newProjectData: Omit<Project, 'id'>) => {
      logger.logStepStart('CreateProject', { title: newProjectData.title });
      const newId = `project-${Date.now()}`;
      const project: Project = { ...newProjectData, id: newId };
      setProjects((prev) => [project, ...prev]);
      logger.logStepConclusion('CreateProject', `Created project with id ${newId}`);
    },
    [logger]
  );

  const updateProject = useCallback(
    (id: string, updates: Partial<Project>) => {
      logger.logStepStart('UpdateProject', { id });
      setProjects((prev) =>
        prev.map((proj) => (proj.id === id ? { ...proj, ...updates } : proj))
      );
      logger.logStepConclusion('UpdateProject', `Updated project ${id}`);
    },
    [logger]
  );

  const deleteProject = useCallback(
    (id: string) => {
      logger.logStepStart('DeleteProject', { id });
      setProjects((prev) => prev.filter((proj) => proj.id !== id));
      logger.logStepConclusion('DeleteProject', `Deleted project ${id}`);
    },
    [logger]
  );

  // Wishlist CRUD Actions
  const createWishlistItem = useCallback(
    (newItemData: Omit<WishlistItem, 'id'>) => {
      logger.logStepStart('CreateWishlistItem', { title: newItemData.title });
      const newId = `wishlist-${Date.now()}`;
      const item: WishlistItem = { ...newItemData, id: newId };
      setWishlistItems((prev) => [item, ...prev]);
      logger.logStepConclusion('CreateWishlistItem', `Created wishlist item with id ${newId}`);
    },
    [logger]
  );

  const updateWishlistItem = useCallback(
    (id: string, updates: Partial<WishlistItem>) => {
      logger.logStepStart('UpdateWishlistItem', { id });
      setWishlistItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
      logger.logStepConclusion('UpdateWishlistItem', `Updated wishlist item ${id}`);
    },
    [logger]
  );

  const deleteWishlistItem = useCallback(
    (id: string) => {
      logger.logStepStart('DeleteWishlistItem', { id });
      setWishlistItems((prev) => prev.filter((item) => item.id !== id));
      logger.logStepConclusion('DeleteWishlistItem', `Deleted wishlist item ${id}`);
    },
    [logger]
  );

  // Media Actions
  const updateConsumedMedia = useCallback(
    (updates: Partial<ConsumedMedia>) => {
      logger.logStepStart('UpdateConsumedMedia', updates);
      setConsumedMedia((prev) => ({
        ...prev,
        ...updates,
      }));
      logger.logStepConclusion('UpdateConsumedMedia', 'Updated media state');
    },
    [logger]
  );

  // Hobbies & Interests Actions
  const createHobby = useCallback(
    (newHobbyData: Omit<HobbyItem, 'id'>) => {
      logger.logStepStart('CreateHobby', { name: newHobbyData.name });
      const newId = `hobby-${Date.now()}`;
      const hobby: HobbyItem = { ...newHobbyData, id: newId };
      setHobbies((prev) => [...prev, hobby]);
      logger.logStepConclusion('CreateHobby', `Created hobby with id ${newId}`);
    },
    [logger]
  );

  const updateHobby = useCallback(
    (id: string, updates: Partial<HobbyItem>) => {
      logger.logStepStart('UpdateHobby', { id });
      setHobbies((prev) =>
        prev.map((h) => (h.id === id ? { ...h, ...updates } : h))
      );
      logger.logStepConclusion('UpdateHobby', `Updated hobby ${id}`);
    },
    [logger]
  );

  const deleteHobby = useCallback(
    (id: string) => {
      logger.logStepStart('DeleteHobby', { id });
      setHobbies((prev) => prev.filter((h) => h.id !== id));
      logger.logStepConclusion('DeleteHobby', `Deleted hobby ${id}`);
    },
    [logger]
  );

  // Reset Action
  const resetToDefaults = useCallback(() => {
    logger.logDecision('ResetToDefaults', 'User requested full reset of local storage cache.');
    setProjects(initialProjects);
    setWishlistItems(initialWishlist);
    setConsumedMedia(initialMedia);
    setHobbies(initialHobbies);
    try {
      localStorage.removeItem(`${STORAGE_KEY}_projects`);
      localStorage.removeItem(`${STORAGE_KEY}_wishlist`);
      localStorage.removeItem(`${STORAGE_KEY}_media`);
      localStorage.removeItem(`${STORAGE_KEY}_hobbies`);
    } catch {
      // Ignored
    }
    logger.logStepConclusion('ResetToDefaults', 'Entities restored to initial baseline');
  }, [logger]);

  return (
    <DataContext.Provider
      value={{
        projects,
        wishlistItems,
        consumedMedia,
        hobbies,
        createProject,
        updateProject,
        deleteProject,
        createWishlistItem,
        updateWishlistItem,
        deleteWishlistItem,
        updateConsumedMedia,
        createHobby,
        updateHobby,
        deleteHobby,
        resetToDefaults,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

/**
 * Hook granting access to the portfolio entities and CRUD actions.
 *
 * @returns DataContextValue containing dynamic arrays and mutate functions.
 * @throws Error if invoked outside DataProvider hierarchy.
 */
export const useData = (): DataContextValue => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be executed within the scope of a DataProvider.');
  }
  return context;
};
