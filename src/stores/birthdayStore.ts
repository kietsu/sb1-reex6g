import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { mockBirthdays } from '../services/mockBirthdays';
import type { Birthday, BirthdayFilters } from '../types/birthday';

export const useBirthdayStore = defineStore('birthdays', () => {
  const birthdays = ref<Birthday[]>([...mockBirthdays]);
  const filters = ref<BirthdayFilters>({
    searchQuery: '',
    selectedMonth: null
  });

  const filteredBirthdays = computed(() => {
    return birthdays.value
      .filter(birthday => {
        const matchesSearch = birthday.nom.toLowerCase()
          .includes(filters.value.searchQuery.toLowerCase());
        const matchesMonth = filters.value.selectedMonth === null || 
          birthday.mois === filters.value.selectedMonth;
        return matchesSearch && matchesMonth;
      })
      .sort((a, b) => {
        if (a.mois === b.mois) {
          return a.jour - b.jour;
        }
        return a.mois - b.mois;
      });
  });

  const createBirthday = (birthday: Omit<Birthday, 'idanni' | 'cspy' | 'pspy'>) => {
    const newBirthday: Birthday = {
      ...birthday,
      idanni: Math.max(...birthdays.value.map(b => b.idanni ?? 0)) + 1,
      cspy: new Date().toISOString().slice(0, 19).replace('T', ' '),
      pspy: '0000-00-00 00:00:00'
    };
    birthdays.value.push(newBirthday);
    return newBirthday;
  };

  const updateBirthday = (birthday: Birthday) => {
    const index = birthdays.value.findIndex(b => b.idanni === birthday.idanni);
    if (index !== -1) {
      birthdays.value[index] = { ...birthday };
    }
  };

  const togglePublicationStatus = (idanni: number) => {
    const birthday = birthdays.value.find(b => b.idanni === idanni);
    if (birthday) {
      birthday.publie = birthday.publie === 'publie' ? 'prop' : 'publie';
    }
  };

  const updateFilters = (newFilters: Partial<BirthdayFilters>) => {
    filters.value = { ...filters.value, ...newFilters };
  };

  return {
    birthdays,
    filters,
    filteredBirthdays,
    createBirthday,
    updateBirthday,
    togglePublicationStatus,
    updateFilters
  };
});