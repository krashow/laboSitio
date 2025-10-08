$(document).ready(function () {
  let currentFilter = 'all';
  let editingId = null;

  function init() {
    loadHabits();
    setupEvents();
  }

  function setupEvents() {
    $('#newHabitBtn').on('click', () => showHabitModal());
    $('#cancelBtn').on('click', hideHabitModal);

    $('.filter-btn').on('click', function () {
      $('.filter-btn').removeClass('active');
      $(this).addClass('active');
      currentFilter = $(this).data('filter');
      loadHabits();
    });

    $('#habitForm').on('submit', handleFormSubmit);
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const habitData = {
      title: $('#habitTitle').val().trim(),
      description: $('#habitDescription').val().trim(),
      frequency: $('#habitFrequency').val()
    };

    if (!habitData.title || !habitData.frequency) {
      alert('Completa los campos requeridos');
      return;
    }

    if (editingId) {
      HabitManager.updateHabit(editingId, habitData);
    } else {
      HabitManager.addHabit(habitData);
    }

    hideHabitModal();
    loadHabits();
  }

  function showHabitModal(habit = null) {
    if (habit) {
      $('#modalTitle').text('Editar Hábito');
      $('#habitTitle').val(habit.title);
      $('#habitDescription').val(habit.description);
      $('#habitFrequency').val(habit.frequency);
      editingId = habit.id;
    } else {
      $('#modalTitle').text('Nuevo Hábito');
      $('#habitForm')[0].reset();
      editingId = null;
    }
    $('#habitModal').fadeIn();
  }

  function hideHabitModal() {
    $('#habitModal').fadeOut();
    $('#habitForm')[0].reset();
    editingId = null;
  }

  function loadHabits() {
    const habits = HabitManager.getHabits();
    const filtered = filterHabits(habits);
    renderHabits(filtered);
  }

  function filterHabits(habits) {
    switch (currentFilter) {
      case 'active':
        return habits.filter(h => !h.completed);
      case 'completed':
        return habits.filter(h => h.completed);
      default:
        return habits;
    }
  }

  function renderHabits(habits) {
    const $list = $('#habitsList');
    $list.empty();

    if (habits.length === 0) {
      $list.html('<p class="no-habits">No hay hábitos registrados.</p>');
      return;
    }

    habits.forEach(habit => {
      const $habit = $(`
        <div class="habit-card ${habit.completed ? 'completed' : ''}" data-id="${habit.id}">
          <div class="habit-header">
            <h3 class="habit-title">${escapeHtml(habit.title)}</h3>
            <div class="habit-actions">
              <button class="complete-btn" title="Marcar como cumplido">${habit.completed ? '↶' : '✓'}</button>
              <button class="edit-btn" title="Editar">✏</button>
              <button class="delete-btn" title="Eliminar">🗑</button>
            </div>
          </div>
          ${habit.description ? `<p class="habit-description">${escapeHtml(habit.description)}</p>` : ''}
          <div class="habit-footer">
            <span>Frecuencia: ${habit.frequency}</span>
            <span>${habit.completed ? 'Cumplido' : 'Activo'}</span>
          </div>
        </div>
      `);

      $habit.find('.complete-btn').on('click', () => {
        HabitManager.toggleComplete(habit.id);
        loadHabits();
      });
      $habit.find('.edit-btn').on('click', () => showHabitModal(habit));
      $habit.find('.delete-btn').on('click', () => {
        if (confirm('¿Eliminar este hábito?')) {
          HabitManager.deleteHabit(habit.id);
          loadHabits();
        }
      });

      $list.append($habit);
    });
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  init();
});
