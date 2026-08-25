import { useMemo, useState } from "react";
import { Plus, Flame, Drumstick, UtensilsCrossed } from "lucide-react";
import { useData } from "../../context/DataContext";
import { CalorieRing } from "./CalorieRing";
import { MacroCard } from "./MacroCard";
import { MealSection } from "./MealSection";
import { EmptyState } from "./EmptyState";
import { AddFoodModal } from "../modals/AddFoodModal";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { MEAL_ORDER, MEAL_META } from "../../lib/meals";
import { formatRemaining, progressPercent, sumCalories, sumProtein } from "../../lib/calculations";
import { getStatusMessage } from "../../lib/messages";
import type { FoodEntry, Meal } from "../../types";

type DayDashboardProps = {
  date: string;
  quickAddPrompt?: string;
  diaryTitle?: string;
  emptyTitle?: string;
  emptySubtitle?: string;
};

export function DayDashboard({
  date,
  quickAddPrompt = "What did you eat today? ♡",
  diaryTitle = "Today's diary ✦",
  emptyTitle = "Nothing yummy here yet ♡",
  emptySubtitle = "Start your diary by adding your first meal!",
}: DayDashboardProps) {
  const { getFoodsForDate, addFood, updateFood, deleteFood, settings } = useData();
  const foods = getFoodsForDate(date);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodEntry | null>(null);
  const [defaultMeal, setDefaultMeal] = useState<Meal>("breakfast");
  const [pendingDelete, setPendingDelete] = useState<FoodEntry | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const [saving, setSaving] = useState(false);

  const totalCalories = useMemo(() => sumCalories(foods), [foods]);
  const totalProtein = useMemo(() => sumProtein(foods), [foods]);
  const caloriePercent = progressPercent(totalCalories, settings.calorieGoal);
  const proteinPercent = progressPercent(totalProtein, settings.proteinGoal);
  const isOver = totalCalories > settings.calorieGoal;
  const statusMessage = getStatusMessage(totalCalories, settings.calorieGoal);

  const openAddModal = (meal: Meal = "breakfast") => {
    setEditingFood(null);
    setDefaultMeal(meal);
    setModalOpen(true);
  };

  const openEditModal = (food: FoodEntry) => {
    setEditingFood(food);
    setModalOpen(true);
  };

  const handleSave = async (input: { name: string; calories: number; protein: number; meal: Meal; time: string; note?: string }) => {
    setSaving(true);
    if (editingFood) {
      await updateFood(date, editingFood.id, input);
    } else {
      await addFood(date, input);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 800);
    }
    setSaving(false);
    setModalOpen(false);
    setEditingFood(null);
  };

  const handleConfirmDelete = () => {
    if (pendingDelete) deleteFood(date, pendingDelete.id);
    setPendingDelete(null);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Summary card */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border-c)] bg-gradient-to-br from-[var(--surface)] to-[var(--primary-soft)] shadow-[var(--shadow-cute-lg)] p-6">
        <span className="absolute top-4 right-5 text-lavender-300 dark:text-lavender-500/50 text-xl animate-float" aria-hidden="true">✦</span>
        <span className="absolute bottom-6 left-5 text-pink-300 text-sm animate-float" style={{ animationDelay: "1s" }} aria-hidden="true">♡</span>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <CalorieRing percent={caloriePercent} isOver={isOver} />
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm font-semibold text-[var(--text-soft)]">Today's Calories</p>
            <p className="font-display text-3xl font-bold text-[var(--text-main)] mt-1">
              {totalCalories.toLocaleString()} <span className="text-[var(--text-faint)] text-xl font-semibold">/ {settings.calorieGoal.toLocaleString()} kcal</span>
            </p>
            <p className={`mt-2 font-semibold ${isOver ? "text-[var(--warn)]" : "text-[var(--primary)]"}`}>
              {formatRemaining(totalCalories, settings.calorieGoal)} {!isOver && "♡"}
            </p>
            <p className="text-sm text-[var(--text-soft)] mt-3">{statusMessage}</p>
          </div>
        </div>
      </div>

      {/* Macro cards */}
      <div className="grid grid-cols-3 gap-3">
        <MacroCard
          icon={<Flame size={16} />}
          label="Calories"
          value={totalCalories.toLocaleString()}
          sublabel="kcal today"
          percent={caloriePercent}
          barColorClass={isOver ? "bg-[var(--warn)]" : "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"}
        />
        <MacroCard
          icon={<Drumstick size={16} />}
          label="Protein"
          value={`${totalProtein}g`}
          sublabel={`/ ${settings.proteinGoal}g goal`}
          percent={proteinPercent}
          barColorClass="bg-[var(--accent)]"
        />
        <MacroCard
          icon={<UtensilsCrossed size={16} />}
          label="Meals"
          value={String(foods.length)}
          sublabel={foods.length === 1 ? "item logged" : "items logged"}
        />
      </div>

      {/* Quick add */}
      <div className="rounded-3xl border border-[var(--border-c)] bg-[var(--surface)] p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-display font-bold text-[var(--text-main)]">{quickAddPrompt}</h2>
          <div className="relative">
            <button
              type="button"
              onClick={() => openAddModal("breakfast")}
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)] text-white font-semibold px-4 py-2 shadow-[var(--shadow-cute)] transition-transform hover:scale-[1.02] active:scale-95"
            >
              <Plus size={16} /> Add Food
            </button>
            {justAdded && (
              <span className="absolute -top-3 -right-2 text-[var(--accent)] text-xl animate-sparkle" aria-hidden="true">✦</span>
            )}
          </div>
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          {MEAL_ORDER.map((m) => {
            const meta = MEAL_META[m];
            const Icon = meta.icon;
            return (
              <button
                key={m}
                type="button"
                onClick={() => openAddModal(m)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-c)] px-3.5 py-1.5 text-sm font-medium text-[var(--text-soft)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] transition-colors"
              >
                <Icon size={14} style={{ color: meta.accent }} />
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Food list */}
      <div className="rounded-3xl border border-[var(--border-c)] bg-[var(--surface)] p-5">
        <h2 className="font-display font-bold text-[var(--text-main)] mb-4">{diaryTitle}</h2>
        {foods.length === 0 ? (
          <EmptyState
            title={emptyTitle}
            subtitle={emptySubtitle}
            actionLabel="Add your first food"
            onAction={() => openAddModal("breakfast")}
          />
        ) : (
          <div className="flex flex-col gap-5">
            {MEAL_ORDER.map((m) => (
              <MealSection
                key={m}
                meal={m}
                foods={foods.filter((f) => f.meal === m)}
                onEdit={openEditModal}
                onDelete={setPendingDelete}
              />
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <AddFoodModal
          initial={editingFood ?? undefined}
          defaultMeal={defaultMeal}
          submitting={saving}
          onClose={() => {
            setModalOpen(false);
            setEditingFood(null);
          }}
          onSave={handleSave}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Remove this food?"
          description={`"${pendingDelete.name}" will be removed from this day's diary.`}
          confirmLabel="Yes, remove it"
          danger
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
