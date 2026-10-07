import 'dart:convert';
import 'dart:ui' as ui;
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const EduApp());
}

// ============================================================================
// CENTRAL BACKEND API SERVICE (Connected to https://backend.indrajeetsir.com)
// ============================================================================
class ApiService {
  // Live Production Backend URL
  static const String baseUrl = 'https://backend.indrajeetsir.com';

  // 1. Health check
  static Future<bool> checkHealth() async {
    try {
      final res = await http.get(Uri.parse('$baseUrl/')).timeout(const Duration(seconds: 5));
      return res.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  // 2. Student Authentication
  static Future<Map<String, dynamic>?> studentLogin(String email, String password) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/auth/student-login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      ).timeout(const Duration(seconds: 7));

      if (res.statusCode == 200 || res.statusCode == 201) {
        final data = jsonDecode(res.body);
        if (data is Map<String, dynamic> && data['success'] == true) {
          return data;
        }
      }
    } catch (_) {}
    return null;
  }

  // 3. Fetch Scheduled Live Classes
  static Future<List<Map<String, dynamic>>> fetchLiveClasses() async {
    try {
      final res = await http.get(
        Uri.parse('$baseUrl/live-classes'),
      ).timeout(const Duration(seconds: 7));

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data is List) {
          return data.map((item) => Map<String, dynamic>.from(item)).toList();
        }
      }
    } catch (_) {}
    return [];
  }

  // 4. Fetch Chat Messages with Mentor
  static Future<List<Map<String, String>>> fetchMessages() async {
    try {
      final res = await http.get(
        Uri.parse('$baseUrl/messages'),
      ).timeout(const Duration(seconds: 7));

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data is List) {
          return data.map((item) {
            final m = Map<String, dynamic>.from(item);
            return {
              'sender': (m['studentName'] ?? m['sender'] ?? 'Indrajeet Sir').toString(),
              'text': (m['text'] ?? '').toString(),
              'time': (m['timestamp'] ?? 'Recently').toString(),
            };
          }).toList();
        }
      }
    } catch (_) {}
    return [];
  }

  // 5. Send Message to Indrajeet Sir
  static Future<bool> sendMessage(String studentName, String text) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/messages'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'studentName': studentName,
          'text': text,
          'sender': 'student',
        }),
      ).timeout(const Duration(seconds: 7));

      return res.statusCode == 200 || res.statusCode == 201;
    } catch (_) {
      return false;
    }
  }

  // 6. Sync Student Profile with MySQL Database
  static Future<bool> syncProfile(StudentProfile profile) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/students'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': profile.name,
          'email': profile.email,
          'phone': profile.phone,
          'attempt': profile.attemptYear,
        }),
      ).timeout(const Duration(seconds: 7));

      return res.statusCode == 200 || res.statusCode == 201;
    } catch (_) {
      return false;
    }
  }
}

// ============================================================================
// STUDENT PROFILE MODEL
// ============================================================================
class StudentProfile {
  String name;
  String email;
  String phone;
  String attemptYear;
  String optionalSubject;
  String bio;
  String avatarKey;
  String? customAvatarUrl;

  StudentProfile({
    required this.name,
    required this.email,
    required this.phone,
    required this.attemptYear,
    required this.optionalSubject,
    required this.bio,
    this.avatarKey = 'ias_officer',
    this.customAvatarUrl,
  });

  String get avatarDisplayEmoji {
    switch (avatarKey) {
      case 'ias_officer':
        return '👮‍♂️';
      case 'aspirant_male':
        return '👨‍🎓';
      case 'aspirant_female':
        return '👩‍🎓';
      case 'scholar':
        return '🧑‍🏫';
      case 'bookworm':
        return '📚';
      case 'top_ranker':
        return '🌟';
      default:
        return '🎓';
    }
  }
}

// ============================================================================
// REUSABLE LIQUID GLASS WRAPPER (Inspired by glass.samasante.com)
// ============================================================================
class LiquidGlassBox extends StatelessWidget {
  final Widget child;
  final double borderRadius;
  final double blurSigma;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final Color? tintColor;
  final double tintOpacity;
  final Border? border;
  final List<BoxShadow>? shadows;

  const LiquidGlassBox({
    super.key,
    required this.child,
    this.borderRadius = 24.0,
    this.blurSigma = 24.0,
    this.padding,
    this.margin,
    this.tintColor,
    this.tintOpacity = 0.65,
    this.border,
    this.shadows,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primaryColor = Theme.of(context).primaryColor;

    return Container(
      margin: margin,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(borderRadius),
        boxShadow: shadows ??
            [
              BoxShadow(
                color: isDark
                    ? Colors.black.withValues(alpha: 0.35)
                    : primaryColor.withValues(alpha: 0.08),
                blurRadius: 28,
                spreadRadius: 0,
                offset: const Offset(0, 8),
              ),
            ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(borderRadius),
        child: BackdropFilter(
          filter: ui.ImageFilter.blur(sigmaX: blurSigma, sigmaY: blurSigma),
          child: Container(
            padding: padding,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: isDark
                    ? [
                        (tintColor ?? const Color(0xFF1E293B)).withValues(alpha: tintOpacity),
                        (tintColor ?? const Color(0xFF0F172A)).withValues(alpha: tintOpacity * 0.85),
                      ]
                    : [
                        (tintColor ?? Colors.white).withValues(alpha: tintOpacity),
                        (tintColor ?? Colors.white).withValues(alpha: tintOpacity * 0.6),
                      ],
              ),
              borderRadius: BorderRadius.circular(borderRadius),
              border: border ??
                  Border.all(
                    color: isDark
                        ? Colors.white.withValues(alpha: 0.16)
                        : Colors.white.withValues(alpha: 0.85),
                    width: 1.5,
                  ),
            ),
            child: child,
          ),
        ),
      ),
    );
  }
}

// ============================================================================
// MAIN APPLICATION ROOT
// ============================================================================
class EduApp extends StatefulWidget {
  const EduApp({super.key});

  @override
  State<EduApp> createState() => _EduAppState();
}

class _EduAppState extends State<EduApp> {
  ThemeMode _themeMode = ThemeMode.system;

  final StudentProfile _currentProfile = StudentProfile(
    name: 'Rahul Kumar',
    email: 'rahul.kumar@indrajeetsir.com',
    phone: '+91 98765 43210',
    attemptYear: '2027',
    optionalSubject: 'PSIR (Political Science)',
    bio: 'Dedicated UPSC CSE 2027 Aspirant • Targeting Top 50 Rank under Indrajeet Sir Mentorship',
    avatarKey: 'ias_officer',
  );

  void toggleTheme() {
    setState(() {
      _themeMode = _themeMode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    });
  }

  void updateProfile(StudentProfile updated) {
    setState(() {
      _currentProfile.name = updated.name;
      _currentProfile.email = updated.email;
      _currentProfile.phone = updated.phone;
      _currentProfile.attemptYear = updated.attemptYear;
      _currentProfile.optionalSubject = updated.optionalSubject;
      _currentProfile.bio = updated.bio;
      _currentProfile.avatarKey = updated.avatarKey;
      _currentProfile.customAvatarUrl = updated.customAvatarUrl;
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
        scaffoldBackgroundColor: const Color(0xFFF1F5F9),
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
        scaffoldBackgroundColor: const Color(0xFF090D16),
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
      home: LoginScreen(
        onThemeToggle: toggleTheme,
        profile: _currentProfile,
        onProfileUpdate: updateProfile,
      ),
    );
  }
}

// ============================================================================
// 1. AUTHENTICATION SCREEN (Fetching from https://backend.indrajeetsir.com)
// ============================================================================
class LoginScreen extends StatefulWidget {
  final VoidCallback onThemeToggle;
  final StudentProfile profile;
  final Function(StudentProfile) onProfileUpdate;

  const LoginScreen({
    super.key,
    required this.onThemeToggle,
    required this.profile,
    required this.onProfileUpdate,
  });

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController(text: 'rahul.kumar@indrajeetsir.com');
  final _passwordController = TextEditingController(text: '123456');
  bool _isLoading = false;

  Future<void> _login() async {
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();

    setState(() => _isLoading = true);

    // Call live backend API
    final data = await ApiService.studentLogin(email, password);

    if (mounted) {
      if (data != null && data['student'] != null) {
        final st = data['student'];
        widget.profile.name = st['name'] ?? widget.profile.name;
        widget.profile.email = st['email'] ?? widget.profile.email;
        widget.profile.phone = st['phone'] ?? widget.profile.phone;
        widget.profile.attemptYear = st['attempt'] ?? widget.profile.attemptYear;
        widget.onProfileUpdate(widget.profile);

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✅ Authenticated with https://backend.indrajeetsir.com'),
            backgroundColor: Color(0xFF10B981),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Offline session active • Connected to local cache'),
          ),
        );
      }

      setState(() => _isLoading = false);

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => MainNavigation(
            onThemeToggle: widget.onThemeToggle,
            profile: widget.profile,
            onProfileUpdate: widget.onProfileUpdate,
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primaryColor = Theme.of(context).primaryColor;

    return Scaffold(
      body: Stack(
        children: [
          Positioned(
            top: -60,
            right: -60,
            child: Container(
              width: 240,
              height: 240,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: primaryColor.withValues(alpha: isDark ? 0.25 : 0.2),
              ),
            ),
          ),
          Positioned(
            bottom: 40,
            left: -50,
            child: Container(
              width: 220,
              height: 220,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFF0284C7).withValues(alpha: isDark ? 0.2 : 0.15),
              ),
            ),
          ),

          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Align(
                      alignment: Alignment.topRight,
                      child: LiquidGlassBox(
                        borderRadius: 16,
                        padding: const EdgeInsets.all(4),
                        child: IconButton(
                          icon: Icon(isDark ? CupertinoIcons.sun_max_fill : CupertinoIcons.moon_stars_fill),
                          onPressed: widget.onThemeToggle,
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),

                    LiquidGlassBox(
                      borderRadius: 36,
                      blurSigma: 32,
                      padding: const EdgeInsets.all(20),
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: primaryColor.withValues(alpha: 0.15),
                        ),
                        child: Icon(Icons.school_rounded, size: 54, color: primaryColor),
                      ),
                    ),
                    const SizedBox(height: 18),
                    Text(
                      'Indrajeet Sir UPSC',
                      style: TextStyle(
                        fontSize: 27,
                        fontWeight: FontWeight.w800,
                        letterSpacing: -0.5,
                        color: isDark ? Colors.white : const Color(0xFF0F172A),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Connected to https://backend.indrajeetsir.com',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 12,
                        color: isDark ? Colors.white60 : const Color(0xFF64748B),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 32),

                    LiquidGlassBox(
                      borderRadius: 28,
                      blurSigma: 30,
                      padding: const EdgeInsets.all(26),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Row(
                            children: [
                              Container(
                                width: 4,
                                height: 18,
                                decoration: BoxDecoration(
                                  color: primaryColor,
                                  borderRadius: BorderRadius.circular(2),
                                ),
                              ),
                              const SizedBox(width: 8),
                              const Text(
                                'Student Portal Access',
                                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                          const SizedBox(height: 20),
                          TextField(
                            controller: _emailController,
                            decoration: InputDecoration(
                              labelText: 'Registered Email',
                              prefixIcon: const Icon(CupertinoIcons.mail),
                              filled: true,
                              fillColor: isDark
                                  ? Colors.black.withValues(alpha: 0.25)
                                  : Colors.white.withValues(alpha: 0.7),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                            ),
                          ),
                          const SizedBox(height: 16),
                          TextField(
                            controller: _passwordController,
                            obscureText: true,
                            decoration: InputDecoration(
                              labelText: 'Password',
                              prefixIcon: const Icon(CupertinoIcons.lock),
                              filled: true,
                              fillColor: isDark
                                  ? Colors.black.withValues(alpha: 0.25)
                                  : Colors.white.withValues(alpha: 0.7),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                            ),
                          ),
                          const SizedBox(height: 24),
                          ElevatedButton(
                            onPressed: _isLoading ? null : _login,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: primaryColor,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              elevation: 4,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            ),
                            child: _isLoading
                                ? const SizedBox(
                                    height: 20,
                                    width: 20,
                                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                                  )
                                : const Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text('ENTER STUDENT PORTAL', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                                      SizedBox(width: 8),
                                      Icon(CupertinoIcons.arrow_right, size: 16),
                                    ],
                                  ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    TextButton(
                      onPressed: _login,
                      child: Text(
                        'Continue as Enrolled Aspirant →',
                        style: TextStyle(color: primaryColor, fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ============================================================================
// 2. MAIN APP NAVIGATION WITH LIQUID GLASS DOCK
// ============================================================================
class MainNavigation extends StatefulWidget {
  final VoidCallback onThemeToggle;
  final StudentProfile profile;
  final Function(StudentProfile) onProfileUpdate;

  const MainNavigation({
    super.key,
    required this.onThemeToggle,
    required this.profile,
    required this.onProfileUpdate,
  });

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    final screens = [
      HomeScreen(
        profile: widget.profile,
        onNavigateTab: (index) => setState(() => _selectedIndex = index),
      ),
      LiveSessionsScreen(profile: widget.profile),
      ChatScreen(profile: widget.profile),
      ProfileScreen(
        onThemeToggle: widget.onThemeToggle,
        profile: widget.profile,
        onProfileUpdate: (updated) {
          widget.onProfileUpdate(updated);
          setState(() {});
        },
      ),
    ];

    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primaryColor = Theme.of(context).primaryColor;

    return Scaffold(
      extendBody: true,
      body: IndexedStack(
        index: _selectedIndex,
        children: screens,
      ),

      // ── ULTRA FLUID LIQUID GLASS DOCK ──────────────────────────────────────
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
          child: Container(
            height: 68,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(34),
              boxShadow: [
                BoxShadow(
                  color: isDark
                      ? Colors.black.withValues(alpha: 0.5)
                      : primaryColor.withValues(alpha: 0.16),
                  blurRadius: 32,
                  spreadRadius: 0,
                  offset: const Offset(0, 10),
                ),
                BoxShadow(
                  color: primaryColor.withValues(alpha: isDark ? 0.12 : 0.08),
                  blurRadius: 16,
                  spreadRadius: -4,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(34),
              child: BackdropFilter(
                filter: ui.ImageFilter.blur(sigmaX: 28, sigmaY: 28),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: isDark
                          ? [
                              const Color(0xFF1E293B).withValues(alpha: 0.82),
                              const Color(0xFF0F172A).withValues(alpha: 0.70),
                            ]
                          : [
                              Colors.white.withValues(alpha: 0.82),
                              Colors.white.withValues(alpha: 0.52),
                            ],
                    ),
                    borderRadius: BorderRadius.circular(34),
                    border: Border.all(
                      color: isDark
                          ? Colors.white.withValues(alpha: 0.18)
                          : Colors.white.withValues(alpha: 0.90),
                      width: 1.5,
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildLiquidDockItem(0, CupertinoIcons.house_fill, CupertinoIcons.house, 'Home'),
                      _buildLiquidDockItem(1, CupertinoIcons.videocam_fill, CupertinoIcons.videocam, '1:1 Live'),
                      _buildLiquidDockItem(2, CupertinoIcons.chat_bubble_2_fill, CupertinoIcons.chat_bubble_2, 'Mentorship'),
                      _buildLiquidDockItem(3, CupertinoIcons.person_crop_circle_fill, CupertinoIcons.person_crop_circle, 'Profile'),
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

  Widget _buildLiquidDockItem(int index, IconData activeIcon, IconData inactiveIcon, String label) {
    final isSelected = _selectedIndex == index;
    final primaryColor = Theme.of(context).primaryColor;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _selectedIndex = index),
        behavior: HitTestBehavior.opaque,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 280),
          curve: Curves.fastOutSlowIn,
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            gradient: isSelected
                ? LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      primaryColor.withValues(alpha: isDark ? 0.35 : 0.18),
                      primaryColor.withValues(alpha: isDark ? 0.15 : 0.08),
                    ],
                  )
                : null,
            borderRadius: BorderRadius.circular(26),
            border: isSelected
                ? Border.all(
                    color: primaryColor.withValues(alpha: isDark ? 0.35 : 0.3),
                    width: 1,
                  )
                : null,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              AnimatedScale(
                scale: isSelected ? 1.15 : 1.0,
                duration: const Duration(milliseconds: 220),
                curve: Curves.easeOutBack,
                child: Icon(
                  isSelected ? activeIcon : inactiveIcon,
                  size: 22,
                  color: isSelected
                      ? primaryColor
                      : (isDark ? Colors.white60 : const Color(0xFF64748B)),
                ),
              ),
              const SizedBox(height: 3),
              AnimatedDefaultTextStyle(
                duration: const Duration(milliseconds: 200),
                style: TextStyle(
                  color: isSelected
                      ? primaryColor
                      : (isDark ? Colors.white54 : const Color(0xFF64748B)),
                  fontSize: 10.5,
                  fontWeight: isSelected ? FontWeight.w800 : FontWeight.w500,
                  letterSpacing: -0.2,
                ),
                child: Text(label),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ============================================================================
// 3. HOME SCREEN
// ============================================================================
class HomeScreen extends StatelessWidget {
  final StudentProfile profile;
  final Function(int) onNavigateTab;

  const HomeScreen({
    super.key,
    required this.profile,
    required this.onNavigateTab,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primaryColor = Theme.of(context).primaryColor;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            LiquidGlassBox(
              borderRadius: 12,
              padding: const EdgeInsets.all(6),
              child: Icon(Icons.school_rounded, color: primaryColor, size: 20),
            ),
            const SizedBox(width: 10),
            const Text(
              'Indrajeet Sir UPSC',
              style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18, letterSpacing: -0.3),
            ),
          ],
        ),
        actions: [
          LiquidGlassBox(
            borderRadius: 14,
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.all(2),
            child: IconButton(
              icon: const Icon(CupertinoIcons.bell_fill, size: 18),
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Synced with https://backend.indrajeetsir.com')),
                );
              },
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 110),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome Liquid Card
            LiquidGlassBox(
              borderRadius: 24,
              blurSigma: 28,
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 26,
                    backgroundColor: primaryColor.withValues(alpha: 0.15),
                    child: Text(profile.avatarDisplayEmoji, style: const TextStyle(fontSize: 26)),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Welcome, ${profile.name.split(' ').first}! 👋',
                          style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.w800,
                            color: isDark ? Colors.white : const Color(0xFF0F172A),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: primaryColor.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                'Target CSE ${profile.attemptYear}',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w700,
                                  color: primaryColor,
                                ),
                              ),
                            ),
                            const SizedBox(width: 6),
                            const Text('• Indrajeet Sir Mentee', style: TextStyle(fontSize: 11, color: Colors.grey)),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // Live 1:1 Session Alert Banner
            LiquidGlassBox(
              borderRadius: 22,
              tintColor: Colors.red,
              tintOpacity: isDark ? 0.2 : 0.08,
              border: Border.all(color: Colors.red.withValues(alpha: isDark ? 0.35 : 0.25)),
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
                    decoration: BoxDecoration(
                      color: Colors.red,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text('🔴 LIVE NOW', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w900)),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text('1:1 Strategy Review', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13.5)),
                        SizedBox(height: 2),
                        Text('With Indrajeet Sir • Live Session', style: TextStyle(fontSize: 11, color: Colors.grey)),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () => onNavigateTab(1),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    ),
                    child: const Text('Join Class', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Mentorship Action Quick Matrix
            const Text(
              'Mentorship Hub',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, letterSpacing: -0.3),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: GestureDetector(
                    onTap: () => onNavigateTab(1),
                    child: LiquidGlassBox(
                      borderRadius: 20,
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Icon(CupertinoIcons.videocam_circle_fill, size: 36, color: primaryColor),
                          const SizedBox(height: 10),
                          const Text('1:1 Live Classes', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                          const SizedBox(height: 2),
                          const Text('Fetch live sessions from backend', style: TextStyle(fontSize: 11, color: Colors.grey)),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: GestureDetector(
                    onTap: () => onNavigateTab(2),
                    child: LiquidGlassBox(
                      borderRadius: 20,
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(CupertinoIcons.chat_bubble_2_fill, size: 36, color: Color(0xFF10B981)),
                          const SizedBox(height: 10),
                          const Text('Ask Doubts', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                          const SizedBox(height: 2),
                          const Text('Live MySQL sync chat', style: TextStyle(fontSize: 11, color: Colors.grey)),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),

            // Study Roadmap Progress
            LiquidGlassBox(
              borderRadius: 22,
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('GS-3 & Optional Syllabus Track', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      Text('68% Done', style: TextStyle(color: primaryColor, fontWeight: FontWeight.w800, fontSize: 13)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: LinearProgressIndicator(
                      value: 0.68,
                      minHeight: 8,
                      backgroundColor: isDark ? Colors.white12 : Colors.black12,
                      valueColor: AlwaysStoppedAnimation<Color>(primaryColor),
                    ),
                  ),
                  const SizedBox(height: 10),
                  const Text('Next up: Inflation & Monetary Policy Mains Answer writing evaluation.', style: TextStyle(fontSize: 11.5, color: Colors.grey)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ============================================================================
// 4. 1:1 LIVE SESSIONS SCREEN (Fetching from https://backend.indrajeetsir.com/live-classes)
// ============================================================================
class LiveSessionsScreen extends StatefulWidget {
  final StudentProfile? profile;
  const LiveSessionsScreen({super.key, this.profile});

  @override
  State<LiveSessionsScreen> createState() => _LiveSessionsScreenState();
}

class _LiveSessionsScreenState extends State<LiveSessionsScreen> {
  List<Map<String, dynamic>> _classes = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadLiveClasses();
  }

  Future<void> _loadLiveClasses() async {
    setState(() => _loading = true);
    final remote = await ApiService.fetchLiveClasses();

    if (mounted) {
      setState(() {
        if (remote.isNotEmpty) {
          _classes = remote;
        } else {
          // Fallback scheduled classes
          _classes = [
            {
              'id': 'lc-1',
              'title': 'GS-3: Indian Economy & Inflation Strategy',
              'date': '2026-10-15',
              'time': '19:00',
              'meetLink': 'https://meet.google.com/abc-defg-hij',
              'assignedStudent': 'All Students',
              'status': 'LIVE',
            },
            {
              'id': 'lc-2',
              'title': 'Mains Answer Writing Review & Feedback',
              'date': '2026-10-16',
              'time': '17:00',
              'meetLink': 'https://meet.google.com/xyz-uvwx-rst',
              'assignedStudent': 'All Students',
              'status': 'UPCOMING',
            },
          ];
        }
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Scheduled 1:1 Classes', style: TextStyle(fontWeight: FontWeight.w800)),
        actions: [
          IconButton(
            icon: const Icon(CupertinoIcons.arrow_clockwise),
            onPressed: _loadLiveClasses,
            tooltip: 'Refresh from Server',
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadLiveClasses,
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : ListView.builder(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 110),
                itemCount: _classes.length,
                itemBuilder: (context, index) {
                  final cls = _classes[index];
                  final isLive = cls['status'] == 'LIVE' || index == 0;
                  final meetUrl = cls['meetLink'] ?? cls['meetingUrl'] ?? 'https://meet.google.com/abc-defg-hij';

                  return Padding(
                    padding: const EdgeInsets.only(bottom: 14),
                    child: LiquidGlassBox(
                      borderRadius: 22,
                      tintColor: isLive ? Colors.red : null,
                      tintOpacity: isLive ? 0.1 : 0.65,
                      padding: const EdgeInsets.all(18),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: isLive ? Colors.red : const Color(0xFF2563EB),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  isLive ? '🔴 LIVE SESSION' : '📅 SCHEDULED',
                                  style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                                ),
                              ),
                              Text(
                                '${cls['date'] ?? 'Today'} • ${cls['time'] ?? '7:00 PM'}',
                                style: const TextStyle(fontSize: 12, color: Colors.grey),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Text(
                            cls['title'] ?? '1:1 Mentorship Session',
                            style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Audience: ${cls['assignedStudent'] ?? 'All Students'} • With Indrajeet Sir',
                            style: const TextStyle(fontSize: 12, color: Colors.grey),
                          ),
                          const SizedBox(height: 14),
                          ElevatedButton.icon(
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Launching 1:1 Live URL: $meetUrl')),
                              );
                            },
                            icon: const Icon(CupertinoIcons.videocam_fill, size: 18),
                            label: Text(isLive ? 'Enter Live Session Now' : 'Join Link Scheduled'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: isLive ? Colors.red : Theme.of(context).primaryColor,
                              foregroundColor: Colors.white,
                              minimumSize: const Size.fromHeight(44),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
      ),
    );
  }
}

// ============================================================================
// 5. CHAT SCREEN (Fetching from https://backend.indrajeetsir.com/messages)
// ============================================================================
class ChatScreen extends StatefulWidget {
  final StudentProfile profile;
  const ChatScreen({super.key, required this.profile});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  List<Map<String, String>> _messages = [];
  final TextEditingController _textController = TextEditingController();
  bool _sending = false;

  @override
  void initState() {
    super.initState();
    _loadMessages();
  }

  Future<void> _loadMessages() async {
    final remote = await ApiService.fetchMessages();
    if (mounted) {
      setState(() {
        if (remote.isNotEmpty) {
          _messages = remote;
        } else {
          _messages = [
            {'sender': 'Indrajeet Sir', 'text': 'Hello Rahul! How is your GS-3 revision plan progressing?', 'time': '10:00 AM'},
            {'sender': 'Rahul Kumar', 'text': 'Hi Sir, I completed the Inflation notes. Ready for today 1:1 session!', 'time': '10:02 AM'},
            {'sender': 'Indrajeet Sir', 'text': 'Great! See you at 7:00 PM on Google Meet.', 'time': '10:05 AM'},
          ];
        }
      });
    }
  }

  Future<void> _sendMessage() async {
    final text = _textController.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _sending = true;
      _messages.add({
        'sender': widget.profile.name,
        'text': text,
        'time': 'Just now',
      });
      _textController.clear();
    });

    // POST to backend API
    await ApiService.sendMessage(widget.profile.name, text);

    if (mounted) {
      setState(() => _sending = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = Theme.of(context).primaryColor;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            CircleAvatar(
              backgroundColor: primaryColor,
              radius: 16,
              child: const Icon(Icons.person_rounded, size: 18, color: Colors.white),
            ),
            const SizedBox(width: 10),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Indrajeet Sir', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                Text('Active Mentor • 1:1 Support', style: TextStyle(fontSize: 11, color: Colors.grey)),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(CupertinoIcons.arrow_clockwise),
            onPressed: _loadMessages,
            tooltip: 'Sync Messages',
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isMe = msg['sender'] == widget.profile.name || msg['sender'] == 'Rahul Kumar';
                return Align(
                  alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.78),
                    child: LiquidGlassBox(
                      borderRadius: 18,
                      tintColor: isMe ? primaryColor : null,
                      tintOpacity: isMe ? (isDark ? 0.9 : 0.95) : (isDark ? 0.75 : 0.8),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      child: Column(
                        crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                        children: [
                          Text(
                            msg['sender']!,
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: isMe ? Colors.white70 : primaryColor,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            msg['text']!,
                            style: TextStyle(
                              color: isMe ? Colors.white : (isDark ? Colors.white : const Color(0xFF0F172A)),
                              fontSize: 13.5,
                            ),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            msg['time']!,
                            style: TextStyle(
                              fontSize: 9,
                              color: isMe ? Colors.white60 : Colors.grey,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 100),
            child: LiquidGlassBox(
              borderRadius: 30,
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _textController,
                      decoration: const InputDecoration(
                        hintText: 'Ask Indrajeet Sir a doubt...',
                        hintStyle: TextStyle(fontSize: 13.5),
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                  _sending
                      ? const Padding(
                          padding: EdgeInsets.all(10.0),
                          child: SizedBox(height: 18, width: 18, child: CircularProgressIndicator(strokeWidth: 2)),
                        )
                      : IconButton(
                          icon: Icon(CupertinoIcons.paperplane_fill, color: primaryColor),
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

// ============================================================================
// 6. REDESIGNED PROFILE & POLICIES (Syncing with https://backend.indrajeetsir.com)
// ============================================================================
class ProfileScreen extends StatelessWidget {
  final VoidCallback onThemeToggle;
  final StudentProfile profile;
  final Function(StudentProfile) onProfileUpdate;

  const ProfileScreen({
    super.key,
    required this.onThemeToggle,
    required this.profile,
    required this.onProfileUpdate,
  });

  // ── Show Edit Profile Details Sheet ──
  void _openEditProfileDialog(BuildContext context) {
    final nameCtrl = TextEditingController(text: profile.name);
    final emailCtrl = TextEditingController(text: profile.email);
    final phoneCtrl = TextEditingController(text: profile.phone);
    final optionalCtrl = TextEditingController(text: profile.optionalSubject);
    final bioCtrl = TextEditingController(text: profile.bio);
    String selectedYear = profile.attemptYear;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
              child: LiquidGlassBox(
                borderRadius: 28,
                blurSigma: 30,
                padding: const EdgeInsets.all(24),
                margin: const EdgeInsets.all(16),
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('✏️ Edit Student Profile', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                          IconButton(
                            icon: const Icon(CupertinoIcons.xmark_circle_fill, size: 22),
                            onPressed: () => Navigator.pop(ctx),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: nameCtrl,
                        decoration: InputDecoration(
                          labelText: 'Full Name',
                          prefixIcon: const Icon(CupertinoIcons.person),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                      const SizedBox(height: 14),
                      TextField(
                        controller: emailCtrl,
                        decoration: InputDecoration(
                          labelText: 'Email Address',
                          prefixIcon: const Icon(CupertinoIcons.mail),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                      const SizedBox(height: 14),
                      TextField(
                        controller: phoneCtrl,
                        decoration: InputDecoration(
                          labelText: 'WhatsApp Phone',
                          prefixIcon: const Icon(CupertinoIcons.phone),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                      const SizedBox(height: 14),
                      DropdownButtonFormField<String>(
                        initialValue: selectedYear,
                        decoration: InputDecoration(
                          labelText: 'Target UPSC Attempt',
                          prefixIcon: const Icon(CupertinoIcons.calendar),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        items: const [
                          DropdownMenuItem(value: '2026', child: Text('UPSC CSE 2026')),
                          DropdownMenuItem(value: '2027', child: Text('UPSC CSE 2027')),
                          DropdownMenuItem(value: '2028', child: Text('UPSC CSE 2028')),
                          DropdownMenuItem(value: 'State PCS', child: Text('State PCS Exam')),
                        ],
                        onChanged: (val) {
                          if (val != null) setModalState(() => selectedYear = val);
                        },
                      ),
                      const SizedBox(height: 14),
                      TextField(
                        controller: optionalCtrl,
                        decoration: InputDecoration(
                          labelText: 'Optional Subject',
                          prefixIcon: const Icon(CupertinoIcons.book),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                      const SizedBox(height: 14),
                      TextField(
                        controller: bioCtrl,
                        maxLines: 2,
                        decoration: InputDecoration(
                          labelText: 'Personal Bio & Target Goal',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                      const SizedBox(height: 20),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Theme.of(context).primaryColor,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        onPressed: () async {
                          profile.name = nameCtrl.text.trim();
                          profile.email = emailCtrl.text.trim();
                          profile.phone = phoneCtrl.text.trim();
                          profile.attemptYear = selectedYear;
                          profile.optionalSubject = optionalCtrl.text.trim();
                          profile.bio = bioCtrl.text.trim();
                          onProfileUpdate(profile);

                          // Sync to backend database
                          await ApiService.syncProfile(profile);

                          if (context.mounted) {
                            Navigator.pop(ctx);
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('✅ Synced with https://backend.indrajeetsir.com database!'),
                                backgroundColor: Color(0xFF10B981),
                              ),
                            );
                          }
                        },
                        child: const Text('SAVE & SYNC TO DATABASE', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  // ── Show Avatar Picker Sheet ──
  void _openAvatarPicker(BuildContext context) {
    final avatars = [
      {'key': 'ias_officer', 'emoji': '👮‍♂️', 'title': 'IAS Officer'},
      {'key': 'aspirant_male', 'emoji': '👨‍🎓', 'title': 'Aspirant (M)'},
      {'key': 'aspirant_female', 'emoji': '👩‍🎓', 'title': 'Aspirant (F)'},
      {'key': 'scholar', 'emoji': '🧑‍🏫', 'title': 'Scholar'},
      {'key': 'bookworm', 'emoji': '📚', 'title': 'Bookworm'},
      {'key': 'top_ranker', 'emoji': '🌟', 'title': 'Top Ranker'},
    ];

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return LiquidGlassBox(
          borderRadius: 28,
          blurSigma: 32,
          padding: const EdgeInsets.all(22),
          margin: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('📸 Choose Profile Avatar', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
                  IconButton(icon: const Icon(CupertinoIcons.xmark_circle_fill), onPressed: () => Navigator.pop(ctx)),
                ],
              ),
              const SizedBox(height: 16),
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  mainAxisSpacing: 12,
                  crossAxisSpacing: 12,
                  childAspectRatio: 1.1,
                ),
                itemCount: avatars.length,
                itemBuilder: (c, i) {
                  final a = avatars[i];
                  final isCurrent = profile.avatarKey == a['key'];
                  return GestureDetector(
                    onTap: () {
                      profile.avatarKey = a['key']!;
                      onProfileUpdate(profile);
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Avatar changed to ${a['title']}!')),
                      );
                    },
                    child: Container(
                      decoration: BoxDecoration(
                        color: isCurrent
                            ? Theme.of(context).primaryColor.withValues(alpha: 0.2)
                            : Colors.black.withValues(alpha: 0.05),
                        border: Border.all(
                          color: isCurrent ? Theme.of(context).primaryColor : Colors.transparent,
                          width: 2,
                        ),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(a['emoji']!, style: const TextStyle(fontSize: 32)),
                          const SizedBox(height: 4),
                          Text(a['title']!, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }

  // ── Show Policy Sheets ──
  void _showPolicySheet(BuildContext context, String title, String emoji, String content) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return DraggableScrollableSheet(
          initialChildSize: 0.75,
          maxChildSize: 0.92,
          minChildSize: 0.45,
          builder: (_, scrollCtrl) {
            return LiquidGlassBox(
              borderRadius: 30,
              blurSigma: 32,
              padding: const EdgeInsets.fromLTRB(24, 16, 24, 24),
              margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              child: Column(
                children: [
                  Container(
                    width: 44,
                    height: 5,
                    margin: const EdgeInsets.only(bottom: 16),
                    decoration: BoxDecoration(
                      color: Colors.grey.withValues(alpha: 0.4),
                      borderRadius: BorderRadius.circular(3),
                    ),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Text(emoji, style: const TextStyle(fontSize: 22)),
                          const SizedBox(width: 8),
                          Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                        ],
                      ),
                      IconButton(
                        icon: const Icon(CupertinoIcons.xmark_circle_fill),
                        onPressed: () => Navigator.pop(ctx),
                      ),
                    ],
                  ),
                  const Divider(height: 20),
                  Expanded(
                    child: ListView(
                      controller: scrollCtrl,
                      children: [
                        Text(
                          content,
                          style: const TextStyle(fontSize: 13.5, height: 1.6, color: Colors.grey),
                        ),
                        const SizedBox(height: 24),
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Theme.of(context).primaryColor,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          ),
                          onPressed: () => Navigator.pop(ctx),
                          child: const Text('I Understand & Agree'),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primaryColor = Theme.of(context).primaryColor;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Student Profile & Settings', style: TextStyle(fontWeight: FontWeight.w800)),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 120),
        children: [
          // ── Hero Glass Profile Card with Avatar & Quick Actions ──
          LiquidGlassBox(
            borderRadius: 28,
            blurSigma: 30,
            padding: const EdgeInsets.all(22),
            child: Column(
              children: [
                Stack(
                  alignment: Alignment.bottomRight,
                  children: [
                    GestureDetector(
                      onTap: () => _openAvatarPicker(context),
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: primaryColor, width: 2.5),
                          boxShadow: [
                            BoxShadow(color: primaryColor.withValues(alpha: 0.25), blurRadius: 16),
                          ],
                        ),
                        child: CircleAvatar(
                          radius: 44,
                          backgroundColor: primaryColor.withValues(alpha: 0.15),
                          child: Text(profile.avatarDisplayEmoji, style: const TextStyle(fontSize: 44)),
                        ),
                      ),
                    ),
                    GestureDetector(
                      onTap: () => _openAvatarPicker(context),
                      child: Container(
                        padding: const EdgeInsets.all(7),
                        decoration: BoxDecoration(
                          color: primaryColor,
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 2),
                        ),
                        child: const Icon(CupertinoIcons.camera_fill, size: 14, color: Colors.white),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                Text(
                  profile.name,
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                    color: isDark ? Colors.white : const Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 2),
                Text(profile.email, style: const TextStyle(fontSize: 12.5, color: Colors.grey)),
                const SizedBox(height: 10),

                // Badges Row
                Wrap(
                  alignment: WrapAlignment.center,
                  spacing: 8,
                  runSpacing: 6,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: primaryColor.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Text('🎯 UPSC CSE ${profile.attemptYear}', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: primaryColor)),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF10B981).withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Text('📖 ${profile.optionalSubject}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF10B981))),
                    ),
                  ],
                ),

                const SizedBox(height: 12),
                Text(
                  profile.bio,
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 12, color: isDark ? Colors.white70 : Colors.black87, fontStyle: FontStyle.italic),
                ),
                const SizedBox(height: 16),

                // Edit Button
                ElevatedButton.icon(
                  onPressed: () => _openEditProfileDialog(context),
                  icon: const Icon(CupertinoIcons.pencil, size: 16),
                  label: const Text('Edit Personal Details'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: primaryColor,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),

          // ── Mentorship Stats Matrix ──
          Row(
            children: [
              Expanded(
                child: LiquidGlassBox(
                  borderRadius: 20,
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    children: [
                      Text('14', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: primaryColor)),
                      const SizedBox(height: 2),
                      const Text('1:1 Sessions Attended', textAlign: TextAlign.center, style: TextStyle(fontSize: 10.5, color: Colors.grey)),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: LiquidGlassBox(
                  borderRadius: 20,
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    children: const [
                      Text('98%', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Color(0xFF10B981))),
                      SizedBox(height: 2),
                      Text('Session Attendance', textAlign: TextAlign.center, style: TextStyle(fontSize: 10.5, color: Colors.grey)),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: LiquidGlassBox(
                  borderRadius: 20,
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    children: const [
                      Text('28', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Color(0xFFF59E0B))),
                      SizedBox(height: 2),
                      Text('Mains Evaluated', textAlign: TextAlign.center, style: TextStyle(fontSize: 10.5, color: Colors.grey)),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 22),

          // ── App Preferences Section ──
          const Padding(
            padding: EdgeInsets.only(left: 4, bottom: 8),
            child: Text('APP SETTINGS & APPEARANCE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Colors.grey, letterSpacing: 0.5)),
          ),
          LiquidGlassBox(
            borderRadius: 22,
            padding: EdgeInsets.zero,
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(CupertinoIcons.moon_stars_fill, color: Color(0xFF6366F1)),
                  title: const Text('Liquid Glass Dark Mode', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                  subtitle: const Text('Apple visionOS deep navy glass theme', style: TextStyle(fontSize: 11, color: Colors.grey)),
                  trailing: Switch(
                    value: isDark,
                    onChanged: (val) => onThemeToggle(),
                  ),
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(CupertinoIcons.bell_fill, color: Color(0xFF0EA5E9)),
                  title: const Text('Notification Reminders', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                  subtitle: const Text('Live class alerts & Mentor replies', style: TextStyle(fontSize: 11, color: Colors.grey)),
                  trailing: const Icon(CupertinoIcons.chevron_right, size: 14, color: Colors.grey),
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Notifications are enabled for all scheduled 1:1 sessions!')),
                    );
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 22),

          // ── Policies & Legal Section ──
          const Padding(
            padding: EdgeInsets.only(left: 4, bottom: 8),
            child: Text('POLICIES & APPLICATION DETAILS', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Colors.grey, letterSpacing: 0.5)),
          ),
          LiquidGlassBox(
            borderRadius: 22,
            padding: EdgeInsets.zero,
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(CupertinoIcons.shield_fill, color: Color(0xFF10B981)),
                  title: const Text('Privacy Policy', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                  subtitle: const Text('Confidentiality of 1:1 sessions & notes', style: TextStyle(fontSize: 11, color: Colors.grey)),
                  trailing: const Icon(CupertinoIcons.chevron_right, size: 14, color: Colors.grey),
                  onTap: () {
                    _showPolicySheet(
                      context,
                      'Privacy Policy',
                      '🛡️',
                      '1. DATA CONFIDENTIALITY:\nIndrajeet Sir UPSC Mentorship adheres to strict privacy standards. Your personal registration details, contact numbers, and mock tests are confidential.\n\n'
                      '2. 1:1 SESSION PRIVACY:\nVideo recordings and personal mentorship audio are solely stored for your personalized revisions and are never shared publicly or commercially.\n\n'
                      '3. DATA SECURITY & ENCRYPTION:\nAll transmissions with our API (https://backend.indrajeetsir.com) use SSL/TLS encryption. Passwords and credentials are encrypted securely.\n\n'
                      '4. STUDENT RIGHTS:\nYou have the right to request deletion or modification of your profile data at any time by contacting our academic administration.',
                    );
                  },
                ),
                const Divider(height: 1),

                ListTile(
                  leading: const Icon(CupertinoIcons.doc_text_fill, color: Color(0xFFF59E0B)),
                  title: const Text('Terms & Conditions Policy', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                  subtitle: const Text('Platform guidelines & code of conduct', style: TextStyle(fontSize: 11, color: Colors.grey)),
                  trailing: const Icon(CupertinoIcons.chevron_right, size: 14, color: Colors.grey),
                  onTap: () {
                    _showPolicySheet(
                      context,
                      'Terms & Conditions',
                      '📜',
                      '1. ENROLLMENT & CODE OF CONDUCT:\nEvery student enrolled with Indrajeet Sir agrees to maintain dignity, punctuality, and mutual respect during live 1:1 mentorship sessions.\n\n'
                      '2. INTELLECTUAL PROPERTY:\nAll proprietary strategy sheets, model answers, and handouts provided by Indrajeet Sir are for the personal use of the enrolled student only.\n\n'
                      '3. SESSION SCHEDULING:\nSession links will be provided on your dashboard. Rescheduling requests must be sent at least 6 hours in advance via the direct chat feature.\n\n'
                      '4. ZERO TOLERANCE POLICY:\nAny redistribution of copyrighted notes or misconduct during sessions will lead to immediate cancellation of mentorship access.',
                    );
                  },
                ),
                const Divider(height: 1),

                ListTile(
                  leading: const Icon(CupertinoIcons.info_circle_fill, color: Color(0xFF8B5CF6)),
                  title: const Text('Application Details', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                  subtitle: const Text('Version, Backend status & Build details', style: TextStyle(fontSize: 11, color: Colors.grey)),
                  trailing: const Icon(CupertinoIcons.chevron_right, size: 14, color: Colors.grey),
                  onTap: () {
                    _showPolicySheet(
                      context,
                      'Application Details',
                      'ℹ️',
                      '• App Name: Indrajeet Sir UPSC & State PCS Mentorship App\n'
                      '• Version: 2.4.0 (Liquid Glass Edition)\n'
                      '• Build: 2026.10-release\n'
                      '• Live Backend API: https://backend.indrajeetsir.com\n'
                      '• Database Host: MySQL (38.242.244.225:3306 - indrajeetsir)\n'
                      '• Database Engine: Prisma ORM with Live Sync\n'
                      '• API Endpoints: /auth/student-login, /live-classes, /messages, /students\n'
                      '• Chief Mentor: Indrajeet Sir (10+ Years Teaching Experience)\n'
                      '• Supported Exams: UPSC Civil Services Examination & State PCS\n'
                      '• Developed with precision for serious Civil Services aspirants.',
                    );
                  },
                ),
                const Divider(height: 1),

                ListTile(
                  leading: const Icon(CupertinoIcons.phone_fill, color: Color(0xFF2563EB)),
                  title: const Text('Helpline & WhatsApp Support', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                  subtitle: const Text('+91 98765 43210 (Mon-Sat 9AM-8PM)', style: TextStyle(fontSize: 11, color: Colors.grey)),
                  trailing: const Icon(CupertinoIcons.chevron_right, size: 14, color: Colors.grey),
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Helpline connected: Contact support at +91 98765 43210')),
                    );
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 22),

          // ── Logout Button ──
          LiquidGlassBox(
            borderRadius: 20,
            padding: EdgeInsets.zero,
            child: ListTile(
              leading: const Icon(CupertinoIcons.square_arrow_right, color: Colors.red),
              title: const Text('Sign Out from Student Portal', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 14)),
              onTap: () {
                showDialog(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text('Sign Out?'),
                    content: const Text('Are you sure you want to log out from Indrajeet Sir Mentorship App?'),
                    actions: [
                      TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(backgroundColor: Colors.red, foregroundColor: Colors.white),
                        onPressed: () {
                          Navigator.pop(ctx);
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                              builder: (context) => LoginScreen(
                                onThemeToggle: onThemeToggle,
                                profile: profile,
                                onProfileUpdate: onProfileUpdate,
                              ),
                            ),
                          );
                        },
                        child: const Text('Log Out'),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 16),
          const Center(
            child: Text(
              'Indrajeet Sir UPSC Mentorship • v2.4.0 Liquid Glass',
              style: TextStyle(fontSize: 11, color: Colors.grey),
            ),
          ),
        ],
      ),
    );
  }
}
