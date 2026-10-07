import 'dart:ui' as ui;
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

void main() {
  runApp(const EduApp());
}

class EduApp extends StatefulWidget {
  const EduApp({super.key});

  @override
  State<EduApp> createState() => _EduAppState();
}

class _EduAppState extends State<EduApp> {
  ThemeMode _themeMode = ThemeMode.system;

  void toggleTheme() {
    setState(() {
      _themeMode = _themeMode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Indrajeet Sir UPSC',
      debugShowCheckedModeBanner: false,
      themeMode: _themeMode,
      theme: ThemeData(
        brightness: Brightness.light,
        primaryColor: const Color(0xFF2563EB),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        colorScheme: const ColorScheme.light(
          primary: Color(0xFF2563EB),
          secondary: Color(0xFF0284C7),
          surface: Colors.white,
        ),
        cardColor: Colors.white,
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.transparent,
          foregroundColor: Color(0xFF0F172A),
          elevation: 0,
        ),
        useMaterial3: true,
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: const Color(0xFF3B82F6),
        scaffoldBackgroundColor: const Color(0xFF0F172A), // Navy blue
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF3B82F6),
          secondary: Color(0xFF38BDF8),
          surface: Color(0xFF1E293B),
        ),
        cardColor: const Color(0xFF1E293B),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.transparent,
          foregroundColor: Colors.white,
          elevation: 0,
        ),
        useMaterial3: true,
      ),
      home: LoginScreen(onThemeToggle: toggleTheme),
    );
  }
}

// ==========================================
// 1. AUTHENTICATION SCREEN
// ==========================================
class LoginScreen extends StatefulWidget {
  final VoidCallback onThemeToggle;
  const LoginScreen({super.key, required this.onThemeToggle});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController(text: 'student@indrajeetsirupsc.in');
  final _passwordController = TextEditingController(text: '123456');

  void _login() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => MainNavigation(onThemeToggle: widget.onThemeToggle)),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Align(
                  alignment: Alignment.topRight,
                  child: IconButton(
                    icon: Icon(isDark ? CupertinoIcons.sun_max : CupertinoIcons.moon_fill),
                    onPressed: widget.onThemeToggle,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Theme.of(context).primaryColor.withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(Icons.school_rounded, size: 64, color: Theme.of(context).primaryColor),
                ),
                const SizedBox(height: 16),
                Text(
                  'Indrajeet Sir UPSC',
                  style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A)),
                ),
                const SizedBox(height: 6),
                const Text('Personalized 1:1 Live UPSC Mentorship App', style: TextStyle(color: Colors.grey)),
                const SizedBox(height: 36),

                // Form Container
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Theme.of(context).cardColor,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 20, offset: const Offset(0, 8)),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const Text('Student Sign In', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 16),
                      TextField(
                        controller: _emailController,
                        decoration: InputDecoration(
                          labelText: 'Email Address',
                          prefixIcon: const Icon(CupertinoIcons.mail),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: _passwordController,
                        obscureText: true,
                        decoration: InputDecoration(
                          labelText: 'Password',
                          prefixIcon: const Icon(CupertinoIcons.lock),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                      const SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: _login,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Theme.of(context).primaryColor,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        child: const Text('ENTER PORTAL', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                TextButton(
                  onPressed: _login,
                  child: const Text('Continue as Guest Student →'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ==========================================
// 2. MAIN APP NAVIGATION WITH FLUID iOS DOCK
// ==========================================
class MainNavigation extends StatefulWidget {
  final VoidCallback onThemeToggle;
  const MainNavigation({super.key, required this.onThemeToggle});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    final screens = [
      HomeScreen(onNavigateTab: (index) => setState(() => _selectedIndex = index)),
      const LiveSessionsScreen(),
      const ChatScreen(),
      ProfileScreen(onThemeToggle: widget.onThemeToggle),
    ];

    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      extendBody: true,
      body: IndexedStack(
        index: _selectedIndex,
        children: screens,
      ),
      // AUTHENTIC FLUID iOS GLASS DOCK
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.only(left: 24, right: 24, bottom: 16),
          child: Container(
            height: 64,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(32),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: isDark ? 0.4 : 0.12),
                  blurRadius: 30,
                  spreadRadius: 0,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(32),
              child: BackdropFilter(
                filter: ui.ImageFilter.blur(sigmaX: 20, sigmaY: 20),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8),
                  decoration: BoxDecoration(
                    color: isDark
                        ? const Color(0xFF1E293B).withValues(alpha: 0.70)
                        : Colors.white.withValues(alpha: 0.65),
                    borderRadius: BorderRadius.circular(32),
                    border: Border.all(
                      color: isDark
                          ? Colors.white.withValues(alpha: 0.15)
                          : Colors.white.withValues(alpha: 0.8),
                      width: 1.5,
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildFluidDockTab(0, CupertinoIcons.house_fill, CupertinoIcons.house, 'Home'),
                      _buildFluidDockTab(1, CupertinoIcons.tv_fill, CupertinoIcons.tv, '1:1 Live'),
                      _buildFluidDockTab(2, CupertinoIcons.chat_bubble_2_fill, CupertinoIcons.chat_bubble_2, 'Chat'),
                      _buildFluidDockTab(3, CupertinoIcons.person_fill, CupertinoIcons.person, 'Profile'),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFluidDockTab(int index, IconData activeIcon, IconData inactiveIcon, String label) {
    final isSelected = _selectedIndex == index;
    final primaryColor = Theme.of(context).primaryColor;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return GestureDetector(
      onTap: () => setState(() => _selectedIndex = index),
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        curve: Curves.fastOutSlowIn,
        padding: EdgeInsets.symmetric(
          horizontal: isSelected ? 16 : 12,
          vertical: 8,
        ),
        decoration: BoxDecoration(
          color: isSelected
              ? primaryColor.withValues(alpha: isDark ? 0.25 : 0.15)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(24),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            AnimatedScale(
              scale: isSelected ? 1.15 : 1.0,
              duration: const Duration(milliseconds: 200),
              child: Icon(
                isSelected ? activeIcon : inactiveIcon,
                size: 22,
                color: isSelected ? primaryColor : (isDark ? Colors.white60 : const Color(0xFF64748B)),
              ),
            ),
            if (isSelected) ...[
              const SizedBox(width: 6),
              Text(
                label,
                style: TextStyle(
                  color: primaryColor,
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  letterSpacing: -0.2,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

// ==========================================
// 3. HOME SCREEN
// ==========================================
class HomeScreen extends StatelessWidget {
  final Function(int) onNavigateTab;
  const HomeScreen({super.key, required this.onNavigateTab});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Icon(Icons.school_rounded, color: Theme.of(context).primaryColor),
            const SizedBox(width: 8),
            const Text('Indrajeet Sir UPSC', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
          ],
        ),
        actions: [
          IconButton(icon: const Icon(CupertinoIcons.bell), onPressed: () {}),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 100),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome Header Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: isDark
                      ? [const Color(0xFF1E3A8A), const Color(0xFF0F172A)]
                      : [const Color(0xFF2563EB), const Color(0xFF1D4ED8)],
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(color: const Color(0xFF2563EB).withValues(alpha: 0.3), blurRadius: 16, offset: const Offset(0, 6)),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text('Welcome back, Rahul! 👋', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                        SizedBox(height: 6),
                        Text('Assigned Mentor: Indrajeet Sir', style: TextStyle(color: Colors.white70, fontSize: 13)),
                      ],
                    ),
                  ),
                  ElevatedButton.icon(
                    onPressed: () => onNavigateTab(2),
                    icon: const Icon(CupertinoIcons.chat_bubble_text, size: 16),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: Colors.blue,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    ),
                    label: const Text('Ask Sir'),
                  )
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Live 1:1 Session Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.red.withValues(alpha: 0.08),
                border: Border.all(color: Colors.red.withValues(alpha: 0.25)),
                borderRadius: BorderRadius.circular(18),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(color: Colors.red, borderRadius: BorderRadius.circular(6)),
                    child: const Text('LIVE 1:1 NOW', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text('1:1 Strategy Session', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                        Text('With Indrajeet Sir • Google Meet', style: TextStyle(fontSize: 11, color: Colors.grey)),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () => onNavigateTab(1),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    ),
                    child: const Text('Join Live'),
                  )
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Direct Chat Card
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
              child: ListTile(
                leading: CircleAvatar(
                  backgroundColor: Colors.blueAccent,
                  child: Icon(Icons.support_agent_rounded, color: Colors.white),
                ),
                title: const Text('Direct Chat with Indrajeet Sir'),
                subtitle: const Text('Ask doubts directly regarding your UPSC strategy'),
                trailing: const Icon(CupertinoIcons.chevron_right, size: 16),
                onTap: () => onNavigateTab(2),
              ),
            )
          ],
        ),
      ),
    );
  }
}

// ==========================================
// 4. 1:1 LIVE SESSIONS SCREEN
// ==========================================
class LiveSessionsScreen extends StatelessWidget {
  const LiveSessionsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My 1:1 Sessions')),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 100),
        children: [
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
            color: Colors.red.withValues(alpha: 0.05),
            child: ListTile(
              leading: const CircleAvatar(backgroundColor: Colors.red, child: Icon(CupertinoIcons.videocam_fill, color: Colors.white)),
              title: const Text('1:1 GS-3 Strategy Session', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: const Text('Today at 7:00 PM • Indrajeet Sir (Google Meet)'),
              trailing: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                ),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Launching 1:1 Google Meet link: https://meet.google.com/abc-defg-hij')),
                  );
                },
                child: const Text('Join 1:1'),
              ),
            ),
          ),
          const SizedBox(height: 12),
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
            child: ListTile(
              leading: const CircleAvatar(backgroundColor: Colors.blue, child: Icon(CupertinoIcons.calendar, color: Colors.white)),
              title: const Text('1:1 Answer Writing Review'),
              subtitle: const Text('Tomorrow at 5:00 PM • Indrajeet Sir (Zoom)'),
              trailing: OutlinedButton(
                style: OutlinedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20))),
                onPressed: () {},
                child: const Text('Scheduled'),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ==========================================
// 5. STUDENT TO INDRAJEET SIR CHAT
// ==========================================
class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final List<Map<String, String>> _messages = [
    {'sender': 'Indrajeet Sir', 'text': 'Hello Rahul! How is your GS-3 revision plan progressing?', 'time': '10:00 AM'},
    {'sender': 'Rahul Kumar', 'text': 'Hi Sir, I completed the Inflation notes. Ready for today 1:1 session!', 'time': '10:02 AM'},
    {'sender': 'Indrajeet Sir', 'text': 'Great! See you at 7:00 PM on Google Meet.', 'time': '10:05 AM'},
  ];

  final TextEditingController _textController = TextEditingController();

  void _sendMessage() {
    if (_textController.text.trim().isEmpty) return;
    setState(() {
      _messages.add({
        'sender': 'Rahul Kumar',
        'text': _textController.text.trim(),
        'time': 'Just now',
      });
      _textController.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            CircleAvatar(
              backgroundColor: Colors.blue,
              radius: 16,
              child: Icon(Icons.person_rounded, size: 18, color: Colors.white),
            ),
            const SizedBox(width: 10),
            const Text('Chat with Indrajeet Sir'),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isMe = msg['sender'] == 'Rahul Kumar';
                return Align(
                  alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      color: isMe
                          ? Theme.of(context).primaryColor
                          : Theme.of(context).cardColor,
                      borderRadius: BorderRadius.only(
                        topLeft: const Radius.circular(18),
                        topRight: const Radius.circular(18),
                        bottomLeft: Radius.circular(isMe ? 18 : 4),
                        bottomRight: Radius.circular(isMe ? 4 : 18),
                      ),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 6, offset: const Offset(0, 2)),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                      children: [
                        Text(
                          msg['sender']!,
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: isMe ? Colors.white70 : Theme.of(context).primaryColor,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          msg['text']!,
                          style: TextStyle(color: isMe ? Colors.white : null, fontSize: 14),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          msg['time']!,
                          style: TextStyle(fontSize: 9, color: isMe ? Colors.white60 : Colors.grey),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 95),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(28),
                boxShadow: [
                  BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 16, offset: const Offset(0, 4)),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _textController,
                      decoration: const InputDecoration(
                        hintText: 'Ask Indrajeet Sir a question...',
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: Icon(CupertinoIcons.paperplane_fill, color: Theme.of(context).primaryColor),
                    onPressed: _sendMessage,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ==========================================
// 6. PROFILE & SETTINGS
// ==========================================
class ProfileScreen extends StatelessWidget {
  final VoidCallback onThemeToggle;
  const ProfileScreen({super.key, required this.onThemeToggle});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(title: const Text('Student Profile & Settings')),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 100),
        children: [
          Center(
            child: Column(
              children: [
                CircleAvatar(
                  radius: 40,
                  backgroundColor: Theme.of(context).primaryColor,
                  child: const Text('RK', style: TextStyle(fontSize: 24, color: Colors.white, fontWeight: FontWeight.bold)),
                ),
                const SizedBox(height: 12),
                const Text('Rahul Kumar', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const Text('student@indrajeetsirupsc.in', style: TextStyle(color: Colors.grey)),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(CupertinoIcons.moon),
                  title: const Text('Dark Mode (Navy Blue)'),
                  trailing: Switch(
                    value: isDark,
                    onChanged: (val) => onThemeToggle(),
                  ),
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(CupertinoIcons.building_2_fill),
                  title: const Text('Institute Branding'),
                  subtitle: const Text('Indrajeet Sir UPSC'),
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(CupertinoIcons.square_arrow_right, color: Colors.red),
                  title: const Text('Logout'),
                  onTap: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (context) => LoginScreen(onThemeToggle: onThemeToggle)),
                    );
                  },
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}
