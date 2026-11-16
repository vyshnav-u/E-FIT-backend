
require('dotenv').config()
const mongoose = require('mongoose')
const Exercise = require('./models/Exercise')
const WorkoutPlan = require('./models/WorkoutPlan')

const exercises = [
  { name: 'Push-Up', category: 'Strength', muscleGroup: 'Chest', equipment: 'Bodyweight', difficulty: 'Beginner' },
  { name: 'Incline Push-Up', category: 'Strength', muscleGroup: 'Chest', equipment: 'Bench', difficulty: 'Beginner' },
  { name: 'Decline Push-Up', category: 'Strength', muscleGroup: 'Chest', equipment: 'Bench', difficulty: 'Intermediate' },
  { name: 'Dumbbell Bench Press', category: 'Strength', muscleGroup: 'Chest', equipment: 'Dumbbells, Bench', difficulty: 'Beginner' },
  { name: 'Barbell Bench Press', category: 'Strength', muscleGroup: 'Chest', equipment: 'Barbell, Bench', difficulty: 'Intermediate' },
  { name: 'Dumbbell Fly', category: 'Strength', muscleGroup: 'Chest', equipment: 'Dumbbells, Bench', difficulty: 'Intermediate' },
  { name: 'Lat Pulldown', category: 'Strength', muscleGroup: 'Back', equipment: 'Cable Machine', difficulty: 'Beginner' },
  { name: 'Seated Cable Row', category: 'Strength', muscleGroup: 'Back', equipment: 'Cable Machine', difficulty: 'Beginner' },
  { name: 'One-Arm Dumbbell Row', category: 'Strength', muscleGroup: 'Back', equipment: 'Dumbbell, Bench', difficulty: 'Beginner' },
  { name: 'Barbell Bent-Over Row', category: 'Strength', muscleGroup: 'Back', equipment: 'Barbell', difficulty: 'Intermediate' },
  { name: 'Assisted Pull-Up', category: 'Strength', muscleGroup: 'Back', equipment: 'Assisted Pull-Up Machine', difficulty: 'Beginner' },
  { name: 'Dumbbell Shoulder Press', category: 'Strength', muscleGroup: 'Shoulders', equipment: 'Dumbbells', difficulty: 'Beginner' },
  { name: 'Lateral Raise', category: 'Strength', muscleGroup: 'Shoulders', equipment: 'Dumbbells', difficulty: 'Beginner' },
  { name: 'Face Pull', category: 'Strength', muscleGroup: 'Shoulders', equipment: 'Cable Machine, Rope', difficulty: 'Beginner' },
  { name: 'Barbell Overhead Press', category: 'Strength', muscleGroup: 'Shoulders', equipment: 'Barbell', difficulty: 'Advanced' },
  { name: 'Dumbbell Bicep Curl', category: 'Strength', muscleGroup: 'Biceps', equipment: 'Dumbbells', difficulty: 'Beginner' },
  { name: 'Hammer Curl', category: 'Strength', muscleGroup: 'Biceps', equipment: 'Dumbbells', difficulty: 'Beginner' },
  { name: 'Cable Triceps Pushdown', category: 'Strength', muscleGroup: 'Triceps', equipment: 'Cable Machine, Rope', difficulty: 'Beginner' },
  { name: 'Overhead Triceps Extension', category: 'Strength', muscleGroup: 'Triceps', equipment: 'Dumbbell', difficulty: 'Intermediate' },
  { name: 'Bodyweight Squat', category: 'Strength', muscleGroup: 'Quadriceps', equipment: 'Bodyweight', difficulty: 'Beginner' },
  { name: 'Goblet Squat', category: 'Strength', muscleGroup: 'Quadriceps', equipment: 'Dumbbell', difficulty: 'Beginner' },
  { name: 'Barbell Back Squat', category: 'Strength', muscleGroup: 'Quadriceps', equipment: 'Barbell, Squat Rack', difficulty: 'Advanced' },
  { name: 'Leg Press', category: 'Strength', muscleGroup: 'Quadriceps', equipment: 'Leg Press Machine', difficulty: 'Beginner' },
  { name: 'Walking Lunge', category: 'Strength', muscleGroup: 'Glutes', equipment: 'Bodyweight', difficulty: 'Intermediate' },
  { name: 'Romanian Deadlift', category: 'Strength', muscleGroup: 'Hamstrings', equipment: 'Dumbbells or Barbell', difficulty: 'Intermediate' },
  { name: 'Lying Leg Curl', category: 'Strength', muscleGroup: 'Hamstrings', equipment: 'Leg Curl Machine', difficulty: 'Beginner' },
  { name: 'Standing Calf Raise', category: 'Strength', muscleGroup: 'Calves', equipment: 'Calf Raise Machine', difficulty: 'Beginner' },
  { name: 'Plank', category: 'Core', muscleGroup: 'Core', equipment: 'Bodyweight, Mat', difficulty: 'Beginner' },
  { name: 'Dead Bug', category: 'Core', muscleGroup: 'Core', equipment: 'Bodyweight, Mat', difficulty: 'Beginner' },
  { name: 'Bicycle Crunch', category: 'Core', muscleGroup: 'Abs', equipment: 'Bodyweight, Mat', difficulty: 'Beginner' },
  { name: 'Hanging Knee Raise', category: 'Core', muscleGroup: 'Abs', equipment: 'Pull-Up Bar', difficulty: 'Intermediate' },
  { name: 'Glute Bridge', category: 'Strength', muscleGroup: 'Glutes', equipment: 'Bodyweight, Mat', difficulty: 'Beginner' },
  { name: 'Side Plank', category: 'Core', muscleGroup: 'Obliques', equipment: 'Bodyweight, Mat', difficulty: 'Beginner' },
  { name: 'Mountain Climber', category: 'Cardio', muscleGroup: 'Full Body', equipment: 'Bodyweight', difficulty: 'Beginner' },
  { name: 'Jumping Jack', category: 'Cardio', muscleGroup: 'Full Body', equipment: 'Bodyweight', difficulty: 'Beginner' },
  { name: 'Treadmill Walk', category: 'Cardio', muscleGroup: 'Full Body', equipment: 'Treadmill', difficulty: 'Beginner' },
  { name: 'Stationary Bike', category: 'Cardio', muscleGroup: 'Legs', equipment: 'Exercise Bike', difficulty: 'Beginner' },
  { name: 'Burpee', category: 'Cardio', muscleGroup: 'Full Body', equipment: 'Bodyweight', difficulty: 'Advanced' }
]

const planDefinitions = [
  {
    name: 'Beginner Full Body',
    goal: 'Build Muscle',
    duration: 4,
    level: 'Beginner',
    days: [
      { dayNumber: 1, title: 'Monday - Full Body A', exercises: [['Goblet Squat', 3, '10-12', 90], ['Dumbbell Bench Press', 3, '10-12', 90], ['Lat Pulldown', 3, '10-12', 75], ['Plank', 3, '20-30 sec', 45]] },
      { dayNumber: 2, title: 'Tuesday - Recovery', isRestDay: true },
      { dayNumber: 3, title: 'Wednesday - Full Body B', exercises: [['Leg Press', 3, '10-12', 90], ['Seated Cable Row', 3, '10-12', 75], ['Dumbbell Shoulder Press', 2, '10-12', 75], ['Dead Bug', 3, '8 each side', 45]] },
      { dayNumber: 4, title: 'Thursday - Recovery', isRestDay: true },
      { dayNumber: 5, title: 'Friday - Full Body C', exercises: [['Bodyweight Squat', 3, '12-15', 60], ['Push-Up', 3, '6-12', 60], ['One-Arm Dumbbell Row', 3, '10 each side', 75], ['Standing Calf Raise', 3, '12-15', 45]] },
      { dayNumber: 6, title: 'Saturday - Light Cardio', exercises: [['Treadmill Walk', 1, '15-20 min', 0]] },
      { dayNumber: 7, title: 'Sunday - Rest', isRestDay: true }
    ]
  },
  {
    name: 'Muscle Building - Upper Lower',
    goal: 'Build Muscle',
    duration: 8,
    level: 'Intermediate',
    days: [
      { dayNumber: 1, title: 'Monday - Upper A', exercises: [['Barbell Bench Press', 4, '6-10', 120], ['Lat Pulldown', 3, '8-12', 90], ['Dumbbell Shoulder Press', 3, '8-10', 90], ['Dumbbell Bicep Curl', 3, '10-12', 60], ['Cable Triceps Pushdown', 3, '10-12', 60]] },
      { dayNumber: 2, title: 'Tuesday - Lower A', exercises: [['Barbell Back Squat', 3, '6-10', 150], ['Romanian Deadlift', 3, '8-10', 120], ['Leg Press', 3, '10-12', 90], ['Standing Calf Raise', 3, '12-15', 60]] },
      { dayNumber: 3, title: 'Wednesday - Rest', isRestDay: true },
      { dayNumber: 4, title: 'Thursday - Upper B', exercises: [['Dumbbell Bench Press', 3, '8-12', 90], ['Seated Cable Row', 3, '8-12', 90], ['Lateral Raise', 3, '12-15', 60], ['Hammer Curl', 3, '10-12', 60], ['Overhead Triceps Extension', 3, '10-12', 60]] },
      { dayNumber: 5, title: 'Friday - Lower B', exercises: [['Goblet Squat', 3, '10-12', 90], ['Walking Lunge', 3, '10 each leg', 90], ['Lying Leg Curl', 3, '10-12', 75], ['Standing Calf Raise', 3, '12-15', 60]] },
      { dayNumber: 6, title: 'Saturday - Optional Cardio & Core', exercises: [['Stationary Bike', 1, '15-20 min', 0], ['Plank', 3, '30-45 sec', 45], ['Bicycle Crunch', 3, '12 each side', 45]] },
      { dayNumber: 7, title: 'Sunday - Rest', isRestDay: true }
    ]
  },
  {
    name: 'Fat Loss & Conditioning',
    goal: 'Weight Loss',
    duration: 6,
    level: 'Beginner',
    days: [
      { dayNumber: 1, title: 'Monday - Full Body', exercises: [['Bodyweight Squat', 3, '12-15', 60], ['Incline Push-Up', 3, '8-12', 60], ['Seated Cable Row', 3, '10-12', 75], ['Dead Bug', 3, '8 each side', 45]] },
      { dayNumber: 2, title: 'Tuesday - Cardio', exercises: [['Treadmill Walk', 1, '20-25 min', 0], ['Jumping Jack', 3, '30 sec', 45]] },
      { dayNumber: 3, title: 'Wednesday - Strength', exercises: [['Goblet Squat', 3, '10-12', 75], ['Dumbbell Bench Press', 3, '10-12', 75], ['Lat Pulldown', 3, '10-12', 75], ['Plank', 3, '20-30 sec', 45]] },
      { dayNumber: 4, title: 'Thursday - Recovery', isRestDay: true },
      { dayNumber: 5, title: 'Friday - Conditioning', exercises: [['Mountain Climber', 3, '20 sec', 45], ['Walking Lunge', 3, '10 each leg', 60], ['Push-Up', 3, '6-10', 60], ['Stationary Bike', 1, '10-15 min', 0]] },
      { dayNumber: 6, title: 'Saturday - Easy Cardio', exercises: [['Stationary Bike', 1, '20 min', 0]] },
      { dayNumber: 7, title: 'Sunday - Rest', isRestDay: true }
    ]
  },
  {
    name: 'Strength Foundation',
    goal: 'Improve Strength',
    duration: 8,
    level: 'Intermediate',
    days: [
      { dayNumber: 1, title: 'Monday - Squat Focus', exercises: [['Barbell Back Squat', 4, '5', 150], ['Leg Press', 3, '8', 120], ['Lying Leg Curl', 3, '10', 75], ['Plank', 3, '30 sec', 45]] },
      { dayNumber: 2, title: 'Tuesday - Rest', isRestDay: true },
      { dayNumber: 3, title: 'Wednesday - Upper Strength', exercises: [['Barbell Bench Press', 4, '5', 150], ['Barbell Bent-Over Row', 4, '6-8', 120], ['Barbell Overhead Press', 3, '6-8', 120], ['Cable Triceps Pushdown', 2, '10', 60]] },
      { dayNumber: 4, title: 'Thursday - Rest', isRestDay: true },
      { dayNumber: 5, title: 'Friday - Hinge & Pull', exercises: [['Romanian Deadlift', 4, '6-8', 150], ['Lat Pulldown', 3, '8-10', 90], ['One-Arm Dumbbell Row', 3, '8 each side', 90], ['Dumbbell Bicep Curl', 2, '10', 60]] },
      { dayNumber: 6, title: 'Saturday - Easy Walk', exercises: [['Treadmill Walk', 1, '15 min', 0]] },
      { dayNumber: 7, title: 'Sunday - Rest', isRestDay: true }
    ]
  },
  {
    name: 'Home Workout - No Equipment',
    goal: 'General Fitness',
    duration: 4,
    level: 'Beginner',
    days: [
      { dayNumber: 1, title: 'Monday - Full Body', exercises: [['Bodyweight Squat', 3, '12-15', 45], ['Push-Up', 3, '6-12', 45], ['Glute Bridge', 3, '12-15', 45], ['Plank', 3, '20-30 sec', 45]] },
      { dayNumber: 2, title: 'Tuesday - Core & Cardio', exercises: [['Dead Bug', 3, '8 each side', 30], ['Bicycle Crunch', 3, '12 each side', 30], ['Jumping Jack', 3, '30 sec', 45]] },
      { dayNumber: 3, title: 'Wednesday - Rest', isRestDay: true },
      { dayNumber: 4, title: 'Thursday - Full Body', exercises: [['Walking Lunge', 3, '8 each leg', 45], ['Incline Push-Up', 3, '8-12', 45], ['Mountain Climber', 3, '20 sec', 45], ['Side Plank', 2, '20 sec each side', 30]] },
      { dayNumber: 5, title: 'Friday - Light Activity', exercises: [['Treadmill Walk', 1, '15-20 min', 0]] },
      { dayNumber: 6, title: 'Saturday - Optional Repeat', exercises: [['Bodyweight Squat', 2, '12', 45], ['Push-Up', 2, '6-10', 45], ['Plank', 2, '20 sec', 30]] },
      { dayNumber: 7, title: 'Sunday - Rest', isRestDay: true }
    ]
  }
]

async function seedFitnessData() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing from the backend .env file')
  }

  await mongoose.connect(process.env.MONGO_URI)

  const exerciseMap = new Map()

  for (const exerciseData of exercises) {
    const exercise = await Exercise.findOneAndUpdate(
      { name: exerciseData.name },
      { $set: exerciseData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )

    exerciseMap.set(exercise.name, exercise._id)
  }

  for (const planData of planDefinitions) {
    const days = planData.days.map(day => ({
      dayNumber: day.dayNumber,
      title: day.title,
      isRestDay: Boolean(day.isRestDay),
      exercises: (day.exercises || []).map(([exerciseName, sets, reps, restSeconds]) => {
        const exerciseId = exerciseMap.get(exerciseName)

        if (!exerciseId) {
          throw new Error(`Exercise not found: ${exerciseName}`)
        }

        return {
          exercise: exerciseId,
          sets,
          reps,
          restSeconds
        }
      })
    }))

    await WorkoutPlan.findOneAndUpdate(
      { name: planData.name },
      {
        $set: {
          name: planData.name,
          goal: planData.goal,
          duration: planData.duration,
          level: planData.level,
          days,
          status: 'Active'
        }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
  }

  console.log(`${exercises.length} exercises and ${planDefinitions.length} workout plans seeded successfully.`)

  await mongoose.disconnect()
}

seedFitnessData().catch(async error => {
  console.error('Seeding failed:', error.message)

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
  }

  process.exit(1)
})
