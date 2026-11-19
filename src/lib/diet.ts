export type DietGoal = "steady-energy" | "strength" | "feel-lighter";
export type DietPreference = "vegetarian" | "vegan" | "flexible";
export type ActivityLevel = "light" | "moderate" | "high";

type MealOption = {
  vegetarian: string;
  vegan: string;
  flex?: string;
};

type MealTemplate = {
  slot: string;
  options: MealOption[];
};

export type PlannedMeal = {
  slot: string;
  note: string;
};

export type MacroDistribution = {
  carbs: number;
  protein: number;
  fats: number;
  waterLiters: string;
};

export type DayPlan = {
  title: string;
  range: string;
  portion: string;
  meals: PlannedMeal[];
  macros: MacroDistribution;
};

const PLANS: Record<DietGoal, MealTemplate[]> = {
  "steady-energy": [
    {
      slot: "Breakfast",
      options: [
        {
          vegetarian: "Vegetable poha, curd, and a seasonal fruit",
          vegan: "Vegetable poha, soy curd, and a seasonal fruit",
          flex: "Eggs can replace the curd if you want them.",
        },
        {
          vegetarian: "Oats cooked in milk with nuts and a banana",
          vegan: "Oats cooked in soy milk with nuts and a banana",
        },
      ],
    },
    {
      slot: "Lunch",
      options: [
        {
          vegetarian: "Dal, brown rice, cucumber salad, and roasted vegetables",
          vegan: "Dal, brown rice, cucumber salad, and roasted vegetables",
        },
        {
          vegetarian: "Chole with rice and kachumber",
          vegan: "Chole with rice and kachumber",
          flex: "A boiled egg on the side is optional.",
        },
      ],
    },
    {
      slot: "Snack",
      options: [
        {
          vegetarian: "Roasted chana with lemon water",
          vegan: "Roasted chana with lemon water",
        },
        {
          vegetarian: "Fruit and a small handful of peanuts",
          vegan: "Fruit and a small handful of peanuts",
        },
      ],
    },
    {
      slot: "Dinner",
      options: [
        {
          vegetarian: "Paneer wrap with greens and mint chutney",
          vegan: "Tofu wrap with greens and mint chutney",
          flex: "Grilled fish or chicken can stand in for the paneer.",
        },
        {
          vegetarian: "Vegetable khichdi with tadka and a carrot salad",
          vegan: "Vegetable khichdi with tadka and a carrot salad",
        },
      ],
    },
  ],
  strength: [
    {
      slot: "Breakfast",
      options: [
        {
          vegetarian: "Besan chilla, curd, and a banana",
          vegan: "Besan chilla, soy curd, and a banana",
          flex: "Add an egg if you eat them.",
        },
        {
          vegetarian: "Moong chilla and a glass of milk",
          vegan: "Moong chilla and a glass of fortified soy milk",
        },
      ],
    },
    {
      slot: "Lunch",
      options: [
        {
          vegetarian: "Rajma rice bowl with salad and pumpkin seeds",
          vegan: "Rajma rice bowl with salad and pumpkin seeds",
        },
        {
          vegetarian: "Soya chunk pulao with cucumber raita",
          vegan: "Soya chunk pulao with cucumber and lemon",
          flex: "Chicken pulao works if that is your usual plate.",
        },
      ],
    },
    {
      slot: "Snack",
      options: [
        {
          vegetarian: "Peanut chaat with fruit",
          vegan: "Peanut chaat with fruit",
        },
        {
          vegetarian: "Curd with fruit and a few almonds",
          vegan: "Soy curd with fruit and a few almonds",
        },
      ],
    },
    {
      slot: "Dinner",
      options: [
        {
          vegetarian: "Palak paneer, roti, and mixed vegetables",
          vegan: "Palak tofu, roti, and mixed vegetables",
        },
        {
          vegetarian: "Tofu bhurji, roti, and sautéed greens",
          vegan: "Tofu bhurji, roti, and sautéed greens",
          flex: "Egg bhurji can replace the tofu.",
        },
      ],
    },
  ],
  "feel-lighter": [
    {
      slot: "Breakfast",
      options: [
        {
          vegetarian: "Overnight oats with fruit and chia",
          vegan: "Overnight oats made with soy milk, fruit, and chia",
        },
        {
          vegetarian: "Vegetable upma and a fruit",
          vegan: "Vegetable upma and a fruit",
        },
      ],
    },
    {
      slot: "Lunch",
      options: [
        {
          vegetarian: "Millet khichdi with curd and a crunchy salad",
          vegan: "Millet khichdi with soy curd and a crunchy salad",
        },
        {
          vegetarian: "Boiled chana salad, lemon, and one roti",
          vegan: "Boiled chana salad, lemon, and one roti",
        },
      ],
    },
    {
      slot: "Snack",
      options: [
        {
          vegetarian: "Buttermilk and a small handful of nuts",
          vegan: "Coconut water and a small handful of nuts",
        },
        {
          vegetarian: "Sprouts chaat with onion and lemon",
          vegan: "Sprouts chaat with onion and lemon",
        },
      ],
    },
    {
      slot: "Dinner",
      options: [
        {
          vegetarian: "Vegetable soup with a moong chilla",
          vegan: "Vegetable soup with a moong chilla",
        },
        {
          vegetarian: "Lauki sabzi, one roti, and a bowl of dal",
          vegan: "Lauki sabzi, one roti, and a bowl of dal",
        },
      ],
    },
  ],
};

const TITLES: Record<DietPreference, string> = {
  vegetarian: "Vegetarian plate",
  vegan: "Vegan-friendly plate",
  flexible: "Flexible plate",
};

const RANGES: Record<DietGoal, Record<ActivityLevel, string>> = {
  "steady-energy": {
    light: "1,700–2,000 kcal",
    moderate: "1,900–2,200 kcal",
    high: "2,200–2,600 kcal",
  },
  strength: {
    light: "1,900–2,200 kcal",
    moderate: "2,100–2,500 kcal",
    high: "2,400–2,900 kcal",
  },
  "feel-lighter": {
    light: "1,500–1,800 kcal",
    moderate: "1,700–2,000 kcal",
    high: "1,900–2,300 kcal",
  },
};

const PORTIONS: Record<ActivityLevel, string> = {
  light: "Keep portions comfortable and stop at easy fullness.",
  moderate: "Add a little extra dal, curd, rice, or fruit at the meal after you move.",
  high: "Include the snack and a more generous lunch. Training days need fuel.",
};

export const MACRO_TARGETS: Record<DietGoal, Record<ActivityLevel, MacroDistribution>> = {
  "steady-energy": {
    light: { carbs: 50, protein: 25, fats: 25, waterLiters: "2.0 – 2.4 L" },
    moderate: { carbs: 50, protein: 25, fats: 25, waterLiters: "2.4 – 2.8 L" },
    high: { carbs: 55, protein: 25, fats: 20, waterLiters: "2.8 – 3.5 L" },
  },
  strength: {
    light: { carbs: 45, protein: 30, fats: 25, waterLiters: "2.2 – 2.6 L" },
    moderate: { carbs: 45, protein: 30, fats: 25, waterLiters: "2.6 – 3.0 L" },
    high: { carbs: 45, protein: 35, fats: 20, waterLiters: "3.0 – 3.8 L" },
  },
  "feel-lighter": {
    light: { carbs: 40, protein: 35, fats: 25, waterLiters: "2.2 – 2.6 L" },
    moderate: { carbs: 40, protein: 35, fats: 25, waterLiters: "2.5 – 3.0 L" },
    high: { carbs: 45, protein: 35, fats: 20, waterLiters: "3.0 – 3.5 L" },
  },
};

function lineFor(option: MealOption, preference: DietPreference): string {
  if (preference === "vegan") return option.vegan;
  if (preference === "flexible" && option.flex) return `${option.vegetarian}. ${option.flex}`;
  return option.vegetarian;
}

export function buildDay(
  goal: DietGoal,
  preference: DietPreference,
  activity: ActivityLevel,
  variant: number,
): DayPlan {
  const templates = PLANS[goal];
  return {
    title: TITLES[preference],
    range: RANGES[goal][activity],
    portion: PORTIONS[activity],
    macros: MACRO_TARGETS[goal][activity],
    meals: templates.map((meal) => {
      const option = meal.options[variant % meal.options.length] ?? meal.options[0];
      return { slot: meal.slot, note: lineFor(option, preference) };
    }),
  };
}

export function formatMealPlanText(plan: DayPlan, goalName: string, prefName: string): string {
  const lines = [
    `🥗 Rep Trackers — Daily Meal Plan (${plan.title})`,
    `Focus: ${goalName} · Calorie Range: ${plan.range}`,
    `Target Hydration: ${plan.macros.waterLiters}`,
    `Macro Balance: ~${plan.macros.carbs}% Carbs / ~${plan.macros.protein}% Protein / ~${plan.macros.fats}% Fats`,
    "",
    ...plan.meals.map((m) => `• ${m.slot}: ${m.note}`),
    "",
    `Guidance: ${plan.portion}`,
    `Generated on Rep Trackers (100% Static & Private)`,
  ];
  return lines.join("\n");
}

export const VARIANT_COUNT = 2;
