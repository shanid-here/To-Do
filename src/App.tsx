import { useTodoViewModel } from './viewmodels/useTodoViewModel';
import { TodoList } from './views/components/TodoList';
import { CalendarStrip } from './views/components/CalendarStrip';
import { AddTodoScreen } from './views/components/AddTodoScreen';
import { Calendar, Plus } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const {
    todos,
    editingId,
    isAddScreenOpen,
    addTodo,
    deleteTodo,
    startEditing,
    cancelEditing,
    updateTodo,
    toggleTodo,
    openAddScreen,
    closeAddScreen,
    selectedDate,
    selectDate,
  } = useTodoViewModel();

  // Generate dynamic date string based on selectedDate
  const dateString = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();

  const isDateInCurrentWeek = (date: Date) => {
    const today = new Date();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay());
    sunday.setHours(0, 0, 0, 0);

    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    saturday.setHours(23, 59, 59, 999);

    return date >= sunday && date <= saturday;
  };

  const isInCurrentWeek = isDateInCurrentWeek(selectedDate);

  const handleCalendarClick = () => {
    const dateInput = document.getElementById('calendar-picker') as HTMLInputElement;
    if (dateInput) {
      dateInput.showPicker();
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      selectDate(new Date(e.target.value));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl overflow-hidden h-[80vh] flex flex-col relative big-shadow">

        {isAddScreenOpen && (
          <AddTodoScreen onAdd={addTodo} onCancel={closeAddScreen} />
        )}

        {/* Hidden Date Picker */}
        <input
          id="calendar-picker"
          type="date"
          className="sr-only"
          onChange={handleDateChange}
          value={selectedDate.toISOString().split('T')[0]}
        />

        {/* Header */}
        <div className="px-6 pt-10 pb-4">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs text-gray-400 font-bold tracking-wider mb-1">{dateString}</p>
              <h1 className="text-3xl font-black text-black tracking-tight">To-Do List</h1>
            </div>
            <button
              onClick={handleCalendarClick}
              className={`p-1 rounded-lg transition-colors ${!isInCurrentWeek ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:bg-gray-50'}`}
              title="Select Date"
            >
              <Calendar size={24} />
            </button>
          </div>

          <CalendarStrip selectedDate={selectedDate} onSelectDate={selectDate} />
        </div>

        {/* Content */}
        <div className="px-6 flex-1 overflow-y-auto pb-24 scrollbar-hide">
          <TodoList
            todos={todos}
            editingId={editingId}
            onDelete={deleteTodo}
            onEdit={startEditing}
            onUpdate={updateTodo}
            onCancel={cancelEditing}
            onToggle={toggleTodo}
          />
        </div>

        {/* FAB */}
        <div className="absolute bottom-8 right-6">
          <button
            onClick={openAddScreen}
            className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white shadow-lg hover:bg-gray-800 transition-colors"
          >
            <Plus size={28} strokeWidth={1.5} />
          </button>
        </div>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </div>
  );
}

export default App;
