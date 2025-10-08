const HabitManager = {
  getHabits() {
    const habits = localStorage.getItem('habits');
    return habits ? JSON.parse(habits) : [];
  },

  saveHabits(habits) {
    localStorage.setItem('habits', JSON.stringify(habits));
  },

  addHabit(habit) {
    const habits = this.getHabits();
    habit.id = Date.now().toString();
    habit.completed = false;
    habit.createdAt = new Date().toISOString();
    habits.push(habit);
    this.saveHabits(habits);
    return habit;
  },

  updateHabit(id, updated) {
    const habits = this.getHabits();
    const index = habits.findIndex(h => h.id === id);
    if (index !== -1) {
      habits[index] = { ...habits[index], ...updated };
      this.saveHabits(habits);
      return true;
    }
    return false;
  },

  deleteHabit(id) {
    const habits = this.getHabits().filter(h => h.id !== id);
    this.saveHabits(habits);
  },

  toggleComplete(id) {
    const habits = this.getHabits();
    const habit = habits.find(h => h.id === id);
    if (habit) {
      habit.completed = !habit.completed;
      this.saveHabits(habits);
    }
  }
};
