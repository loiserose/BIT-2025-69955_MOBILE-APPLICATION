// Import Flutter's material design package - this gives us all the UI components
import 'package:flutter/material.dart';

// ==========================================
// MAIN APP ENTRY POINT
// ==========================================
void main() {
  runApp(const MyApp());
}

// ==========================================
// ROOT WIDGET - STATELESS (doesn't change over time)
// ==========================================
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TaskMaster Pro',
      themeMode: ThemeMode.system,

      // Light Theme Definition
      theme: ThemeData(
        brightness: Brightness.light,
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
          brightness: Brightness.light,
        ),
        useMaterial3: true,
        // FIXED: Changed CardTheme to CardThemeData
        cardTheme: const CardThemeData(
          elevation: 4,
          shadowColor: Colors.black26,
        ),
      ),

      // Dark Theme Definition
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
        // FIXED: Changed CardTheme to CardThemeData
        cardTheme: const CardThemeData(
          elevation: 4,
        ),
      ),

      home: const HomePage(),
    );
  }
}

// ==========================================
// HOME PAGE - MAIN DASHBOARD
// ==========================================
class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  // ==========================================
  // DATA STRUCTURES
  // ==========================================

  List<Map<String, dynamic>> tasks = [
    {'id': 1, 'title': 'Complete Flutter Assignment', 'category': 'Academics', 'completed': false, 'xp': 100},
    {'id': 2, 'title': 'Study for Mobile Development Exam', 'category': 'Academics', 'completed': false, 'xp': 150},
    {'id': 3, 'title': 'Workout for 30 minutes', 'category': 'Health', 'completed': false, 'xp': 75},
    {'id': 4, 'title': 'Learn API Integration', 'category': 'Learning', 'completed': false, 'xp': 200},
    {'id': 5, 'title': 'Review class notes', 'category': 'Academics', 'completed': false, 'xp': 50},
  ];

  int userLevel = 1;
  int userXP = 0;
  int streak = 0;

  int get requiredXP => 500 * userLevel;

  // ==========================================
  // HELPER METHODS
  // ==========================================

  void addTask(String title, String category) {
    if (title.isEmpty) return;

    setState(() {
      tasks.add({
        'id': DateTime.now().millisecondsSinceEpoch,
        'title': title,
        'category': category,
        'completed': false,
        'xp': _getXPForCategory(category),
      });
    });
  }

  int _getXPForCategory(String category) {
    switch(category) {
      case 'Academics': return 150;
      case 'Learning': return 200;
      case 'Health': return 75;
      case 'Personal': return 50;
      default: return 100;
    }
  }

  void toggleTaskStatus(int taskId) {
    setState(() {
      final taskIndex = tasks.indexWhere((task) => task['id'] == taskId);
      if (taskIndex != -1) {
        final wasCompleted = tasks[taskIndex]['completed'];

        if (!wasCompleted) {
          final xpEarned = tasks[taskIndex]['xp'];
          tasks[taskIndex]['completed'] = true;
          addXP(xpEarned);

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('+$xpEarned XP! Great job! 🎉'),
              backgroundColor: Colors.green,
              duration: const Duration(seconds: 2),
            ),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Tasks cannot be uncompleted! Keep building that streak! 🔥'),
              backgroundColor: Colors.orange,
            ),
          );
        }
      }
    });
  }

  void addXP(int amount) {
    setState(() {
      userXP += amount;

      while (userXP >= requiredXP) {
        userXP -= requiredXP;
        userLevel++;
        _showLevelUpDialog();
      }
    });
  }

  void _showLevelUpDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Row(
            children: [
              Icon(Icons.emoji_events, color: Colors.amber, size: 30),
              SizedBox(width: 10),
              Text('LEVEL UP! 🎉'),
            ],
          ),
          content: Text('Congratulations! You reached Level $userLevel!\n\nKeep going to unlock more features!'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Awesome!'),
            ),
          ],
        );
      },
    );
  }

  void deleteTask(int taskId) {
    setState(() {
      tasks.removeWhere((task) => task['id'] == taskId);
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Task deleted ✗'),
        backgroundColor: Colors.red,
      ),
    );
  }

  double getCompletionPercentage() {
    if (tasks.isEmpty) return 0;
    final completedTasks = tasks.where((task) => task['completed'] == true).length;
    return completedTasks / tasks.length;
  }

  int getCompletedCount() {
    return tasks.where((task) => task['completed'] == true).length;
  }

  // ==========================================
  // UI BUILD METHOD
  // ==========================================

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'TaskMaster Pro',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.bar_chart),
            onPressed: _showStatisticsDialog,
            tooltip: 'View Statistics',
          ),
          IconButton(
            icon: const Icon(Icons.brightness_6),
            onPressed: _toggleTheme,
            tooltip: 'Toggle Theme',
          ),
        ],
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.deepPurple, Colors.purple.shade300],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
        ),
      ),

      body: Column(
        children: [
          // Statistics Card
          Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.deepPurple.shade800, Colors.purple.shade600],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.deepPurple.withOpacity(0.3),
                  blurRadius: 10,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      children: [
                        const Text('LEVEL', style: TextStyle(color: Colors.white70, fontSize: 12)),
                        Text('$userLevel', style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    Column(
                      children: [
                        const Text('STREAK', style: TextStyle(color: Colors.white70, fontSize: 12)),
                        Row(
                          children: [
                            const Icon(Icons.local_fire_department, color: Colors.orange, size: 20),
                            Text('$streak', style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ],
                    ),
                    Column(
                      children: [
                        const Text('COMPLETED', style: TextStyle(color: Colors.white70, fontSize: 12)),
                        Text('${getCompletedCount()}/${tasks.length}', style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                Row(
                  children: [
                    Text('XP: $userXP / $requiredXP', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                  ],
                ),
                const SizedBox(height: 8),
                ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: LinearProgressIndicator(
                    value: userXP / requiredXP,
                    backgroundColor: Colors.white24,
                    valueColor: const AlwaysStoppedAnimation<Color>(Colors.amber),
                    minHeight: 10,
                  ),
                ),
              ],
            ),
          ),

          // Task List Title
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Your Tasks',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.deepPurple.shade100,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '${getCompletedCount()}/${tasks.length} Done',
                    style: TextStyle(color: Colors.deepPurple.shade800, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ),

          // Task List
          Expanded(
            child: tasks.isEmpty
                ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.check_circle, size: 64, color: Colors.grey.shade400),
                  const SizedBox(height: 16),
                  Text('No tasks yet!', style: TextStyle(color: Colors.grey.shade600)),
                  // FIXED: Removed 'const' since Colors.grey.shade500 isn't constant
                  Text('Tap the + button to add one', style: TextStyle(color: Colors.grey.shade500)),
                ],
              ),
            )
                : ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: tasks.length,
              itemBuilder: (context, index) {
                final task = tasks[index];
                final isCompleted = task['completed'] == true;

                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  elevation: isCompleted ? 1 : 3,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  child: ListTile(
                    leading: Checkbox(
                      value: isCompleted,
                      onChanged: (_) => toggleTaskStatus(task['id']),
                      activeColor: Colors.green,
                    ),
                    title: Text(
                      task['title'],
                      style: TextStyle(
                        decoration: isCompleted ? TextDecoration.lineThrough : null,
                        color: isCompleted ? Colors.grey : null,
                        fontWeight: isCompleted ? FontWeight.normal : FontWeight.w500,
                      ),
                    ),
                    subtitle: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: _getCategoryColor(task['category']),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            task['category'],
                            style: const TextStyle(color: Colors.white, fontSize: 10),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text('+${task['xp']} XP', style: const TextStyle(fontSize: 10)),
                      ],
                    ),
                    trailing: isCompleted
                        ? const Icon(Icons.check_circle, color: Colors.green)
                        : IconButton(
                      icon: const Icon(Icons.delete_outline, color: Colors.red),
                      onPressed: () => deleteTask(task['id']),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),

      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showAddTaskDialog,
        icon: const Icon(Icons.add),
        label: const Text('Add Task'),
        backgroundColor: Colors.deepPurple,
      ),
    );
  }

  // ==========================================
  // DIALOGS AND MODALS
  // ==========================================

  void _showAddTaskDialog() {
    final titleController = TextEditingController();
    String selectedCategory = 'Academics';

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Add New Task'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: titleController,
                decoration: const InputDecoration(
                  hintText: 'Enter task title',
                  border: OutlineInputBorder(),
                ),
                autofocus: true,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: selectedCategory,
                decoration: const InputDecoration(
                  labelText: 'Category',
                  border: OutlineInputBorder(),
                ),
                items: const [
                  DropdownMenuItem(value: 'Academics', child: Text('📚 Academics')),
                  DropdownMenuItem(value: 'Learning', child: Text('💡 Learning')),
                  DropdownMenuItem(value: 'Health', child: Text('💪 Health')),
                  DropdownMenuItem(value: 'Personal', child: Text('🏠 Personal')),
                ],
                onChanged: (value) {
                  if (value != null) selectedCategory = value;
                },
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                addTask(titleController.text, selectedCategory);
                Navigator.pop(context);
              },
              child: const Text('Add'),
            ),
          ],
        );
      },
    );
  }

  void _showStatisticsDialog() {
    final completed = getCompletedCount();
    final pending = tasks.length - completed;

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Your Statistics'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('📊 Task Completion', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Container(
                height: 100,
                padding: const EdgeInsets.all(8),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        children: [
                          Expanded(
                            flex: completed,
                            child: Container(
                              decoration: BoxDecoration(
                                color: Colors.green,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Center(child: Text('✓', style: TextStyle(color: Colors.white))),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text('$completed Done'),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        children: [
                          Expanded(
                            flex: pending,
                            child: Container(
                              decoration: BoxDecoration(
                                color: Colors.orange,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Center(child: Text('○', style: TextStyle(color: Colors.white))),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text('$pending Pending'),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const Divider(),
              const SizedBox(height: 8),
              const Text('🎮 Your Stats', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              ListTile(
                leading: const Icon(Icons.emoji_events, color: Colors.amber),
                title: const Text('Current Level'),
                trailing: Text('$userLevel'),
              ),
              ListTile(
                leading: const Icon(Icons.stars, color: Colors.blue),
                title: const Text('Total XP'),
                trailing: Text('$userXP'),
              ),
              ListTile(
                leading: const Icon(Icons.local_fire_department, color: Colors.orange),
                title: const Text('Day Streak'),
                trailing: Text('$streak days'),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Close'),
            ),
          ],
        );
      },
    );
  }

  void _toggleTheme() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Theme toggle would require state management!'),
        duration: Duration(seconds: 2),
      ),
    );
  }

  Color _getCategoryColor(String category) {
    switch(category) {
      case 'Academics': return Colors.blue;
      case 'Learning': return Colors.purple;
      case 'Health': return Colors.green;
      case 'Personal': return Colors.orange;
      default: return Colors.grey;
    }
  }
}