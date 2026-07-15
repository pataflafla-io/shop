import { create } from 'zustand';

interface State {
  selectedGender: string;
  setCurrentGender: (section: string | string[] | undefined) => void;
}

export const useGenderSection = create<State>()((set, get) => ({
  selectedGender: '',
  setCurrentGender: (section: string | string[] | undefined) => {
    if (!section) {
      return set({ selectedGender: '' });
    }
    if (Array.isArray(section)) {
      return set({ selectedGender: section[section.length - 1] });
    }
    if (section) {
      return set({ selectedGender: section });
    }
  },
}));
